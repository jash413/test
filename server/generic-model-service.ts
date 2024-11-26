//file : server/generic-model-service.ts

import api from './axios';
import { ModelMapping, createModelConverters } from './converter';
import { isEqual } from 'lodash';
import { areArraysEqual, areDatesEqual, isDateString } from './utils/parsers';

export type GenericModelShape = {
  id: number;
  [key: string]: any;
};

export type APIGenericModelShape<T extends GenericModelShape> = {
  data: {
    type: string;
    id: number;
    attributes: T;
  };
};

export class GenericModelService<T extends GenericModelShape> {
  public apiEndpoint: string;
  private converters: ReturnType<typeof createModelConverters<T, T>>;
  private uniqueKey: keyof T;

  constructor(apiEndpoint: string, mapping: ModelMapping, uniqueKey?: any) {
    this.apiEndpoint = apiEndpoint;
    this.converters = createModelConverters<T, T>(apiEndpoint, mapping);
    this.uniqueKey = uniqueKey;
  }

  private getHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private handleApiError(error: any, operation: string) {
    console.error(`Error ${operation} model:`, error);
    if (error.response?.data?.body?.errors) {
      throw new Error(error.response.data.body.errors[0].detail);
    }
    throw error;
  }

  async create(model: Partial<T>, token: string): Promise<T | undefined> {
    try {
      const headers = this.getHeaders(token);
      const apiModel = this.converters.toAPIFormat(model as T);

      // Remove the id field from the API model
      // Remove the id field from the API model and attributes
      const { id, ...dataWithoutId } = apiModel.data;
      const { id: attributeId, ...attributesWithoutId } =
        dataWithoutId.attributes;

      const apiModelToSend = {
        data: {
          type: apiModel.data.type,
          attributes: attributesWithoutId
        }
      };

      const response = await api.post(this.apiEndpoint, apiModelToSend, {
        headers
      });
      return this.converters.fromAPIFormat(
        response.data.body as APIGenericModelShape<T>
      );
    } catch (error) {
      this.handleApiError(error, 'creating');
    }
  }

  async get(id: number, token: string): Promise<T | null | undefined> {
    try {
      const headers = this.getHeaders(token);
      const response = await api.get(`${this.apiEndpoint}/${id}`, { headers });
      return response.data?.body?.data
        ? this.converters.fromAPIFormat({
            data: response.data.body.data
          } as APIGenericModelShape<T>)
        : null;
    } catch (error) {
      this.handleApiError(error, 'fetching');
    }
  }

  async update(
    id: number,
    partialModel: Partial<T>,
    token: string
  ): Promise<T | undefined> {
    try {
      const headers = this.getHeaders(token);
      const apiPartialModel = this.converters.toAPIFormat(partialModel as T);
      const originalData = await this.get(id, token);
      // console.log('originalData:', originalData);
      // console.log('apiPartialModel:', partialModel);
      let changedData = getChangedValues(partialModel, originalData);
      if (Object.keys(changedData).length > 0) {
        changedData['updated_at'] = new Date().toISOString();
        // console.log('chagnedData:', changedData);
        let apiModelToSend = {
          data: {
            type: apiPartialModel.data.type,
            attributes: changedData
          }
        };
        const response = await api.patch(
          `${this.apiEndpoint}/${id}`,
          apiModelToSend,
          { headers }
        );
        return this.converters.fromAPIFormat(
          response.data.body as APIGenericModelShape<T>
        );
      } else {
        return originalData as T;
      }
    } catch (error) {
      this.handleApiError(error, 'updating');
    }
  }

  async delete(id: number, token: string): Promise<void> {
    try {
      const headers = this.getHeaders(token);
      await api.delete(`${this.apiEndpoint}/${id}`, { headers });
    } catch (error) {
      this.handleApiError(error, 'deleting');
    }
  }

  async list(
    params: Record<string, any>,
    token: string
  ): Promise<T[] | undefined> {
    try {
      const headers = this.getHeaders(token);
      const response = await api.get(this.apiEndpoint, {
        headers,
        params
      });
      if (response.data?.body?.errors) {
        throw new Error(response.data.body.errors[0].detail);
      }
      return response.data?.body?.data
        ? response.data.body.data.map((item: APIGenericModelShape<T>['data']) =>
            this.converters.fromAPIFormat({
              data: item
            } as APIGenericModelShape<T>)
          )
        : [];
    } catch (error) {
      this.handleApiError(error, 'listing');
    }
  }

  async upsert(model: Partial<T>, token: string): Promise<T | undefined> {
    try {
      const headers = this.getHeaders(token);

      if (!this.uniqueKey) {
        // If uniqueKey is not defined, call create directly
        return this.create(model, token);
      }

      const uniqueValue = model[this.uniqueKey];

      if (uniqueValue === undefined) {
        throw new Error(
          `Unique key ${String(this.uniqueKey)} is not provided in the model`
        );
      }

      // First, try to fetch the existing record
      const response = await api.get(this.apiEndpoint, {
        headers,
        params: { filter: { [this.uniqueKey]: uniqueValue } }
      });

      if (response.data?.body?.data && response.data.body.data.length > 0) {
        // Record exists, update it
        const existingRecord = response.data.body.data[0];

        // Update the model's id with the existing record's id
        const updatedModel = { ...model, id: existingRecord.id };

        return this.update(existingRecord.id, updatedModel, token);
      } else {
        // Record doesn't exist, create it
        return this.create(model, token);
      }
    } catch (error) {
      this.handleApiError(error, 'upserting');
      return undefined;
    }
  }
}

const getChangedValues = (newData: any, originalData: any) => {
  const changedValues: Record<string, any> = {};

  let allKeys = new Set([...Object.keys(newData)]);
  allKeys.delete('created_at');
  allKeys.delete('updated_at');
  allKeys.delete('creator_id');
  allKeys.delete('business_id');
  allKeys.delete('id');

  allKeys.forEach((key) => {
    const newValue = newData[key];
    const originalValue = originalData[key];

    if (key in newData) {
      if (Array.isArray(newValue) && Array.isArray(originalValue)) {
        // console.log(`Comparing arrays for ${key}:`, {
        //   newValue,
        //   originalValue
        // });
        if (!areArraysEqual(newValue, originalValue)) {
          // console.log(`Array changed for ${key}`);
          changedValues[key] = newValue;
        } else {
          // console.log(`Array unchanged for ${key}`);
        }
      } else if (isDateString(newValue) || isDateString(originalValue)) {
        // console.log(`Comparing dates for ${key}:`, { newValue, originalValue });
        if (!areDatesEqual(newValue, originalValue)) {
          console.log(`Date changed for ${key}`);
          changedValues[key] = newValue;
        } else {
          console.log(`Date unchanged for ${key}`);
        }
      } else if (!isEqual(newValue, originalValue)) {
        changedValues[key] = newValue;
      }
    } else if (originalValue !== undefined && originalValue !== null) {
      changedValues[key] = undefined;
    }
  });

  return changedValues;
};

export async function uploadFile(
  file: File,
  token: string,
  id: number,
  data?: any
): Promise<JSON | undefined> {
  try {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('data', JSON.stringify(data));

    const uploadResponse = await api.post('/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!uploadResponse.data?.[0]?.file_url) {
      if (uploadResponse.data?.message)
        throw new Error(uploadResponse.data.message);
      else throw new Error('File upload failed');
    }

    return uploadResponse.data;
  } catch (error: any) {
    console.error(`Error uploading file:`, error);
    if (error.response?.data?.body?.errors) {
      throw new Error(error.response.data.body.errors[0].detail);
    }
    throw error;
  }
}

export async function uploadMultipleFiles(
  files: File[],
  token: string,
  id: number,
  data?: any
): Promise<JSON | undefined> {
  try {
    const formData = new FormData();
    // Append each file individually
    // formData.append('files', files[0]);

    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    if (data) {
      formData.append('data', JSON.stringify(data));
    }

    const uploadResponse = await api.post('/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!uploadResponse.data?.[0]?.file_url) {
      if (uploadResponse.data?.message)
        throw new Error(uploadResponse.data.message);
      else throw new Error('File upload failed');
    }

    return uploadResponse.data;
  } catch (error: any) {
    console.error(`Error uploading file:`, error);
    if (error.response?.data?.body?.errors) {
      throw new Error(error.response.data.body.errors[0].detail);
    }
    throw error;
  }
}
