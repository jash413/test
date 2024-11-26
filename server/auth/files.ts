import axios, { AxiosInstance } from 'axios';
import { convertResponse, User, UserShape } from './types';

const api: AxiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/api`,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Connection: 'keep-alive'
  }
});

// Helper function to handle API errors
const handleApiError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.error || 'An error occurred');
  }
  throw error;
};

export const downloadFolder = async (folderId: string, token: string) => {
  try {
    const response = await api.get(`/download-folder/${folderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        responseType: 'arraybuffer' // Important: Set response type to arraybuffer
      }
    });

    return response;
  } catch (error) {
    handleApiError(error);
  }
};

export const generateShareLink = async (folderId: string, token: string) => {
  try {
    const response = await api.post(
      `/generate-share-link/${folderId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateFileData = async (
  fileId: string,
  token: string,
  data: any
) => {
  // patch

  console.log('fileId', fileId, 'token', token, 'data', data);

  try {
    const response = await api.patch(`/zen/file/${fileId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const fileUpload = async (arrayBuffer: ArrayBuffer, token: string) => {
  try {
    // Create a FormData object
    const formData = new FormData();

    // Convert ArrayBuffer to Blob and append to FormData
    const blob = new Blob([arrayBuffer], { type: 'image/png' }); // Specify the correct MIME type
    formData.append('file', blob, 'uploaded-file.png'); // Append blob with a filename

    // Make the request with FormData

    // console.log('formData', formData);

    const response = await api.post('/upload', formData, {
      headers: {
        Authorization: `Bearer ${token}`
        // No need to manually set 'Content-Type' as Axios sets it automatically for FormData
      }
    });

    console.log('response', response);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getUserFiles = async (filterData: any, token: string) => {
  let url = 'user-files';

  if (filterData) {
    let subStr = '';
    for (const key in filterData) {
      subStr += `${key}=${filterData[key]}&`;
    }
    subStr = subStr.slice(0, -1);
    url += `?${subStr}`;
  }

  console.log('url', url);

  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getDefaultCostCodes = async (filterData: any, token: string) => {
  let url = '/zen/default_Cost_Codes';

  if (filterData && filterData['filter[business_id]']) {
    let subStr = '';
    for (const key in filterData) {
      if (filterData[key] !== null) {
        subStr += `${key}=${filterData[key]}&`;
      }
    }
    subStr = subStr.slice(0, -1);
    url += `?${subStr}`;
  }

  console.log('url', url);

  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getCostCodes = async (filterData: any, token: string) => {
  let url = '/zen/cost_Codes';

  if (filterData && filterData['filter[business_id]']) {
    let subStr = '';
    for (const key in filterData) {
      if (filterData[key] !== null) {
        subStr += `${key}=${filterData[key]}&`;
      }
    }
    subStr = subStr.slice(0, -1);
    url += `?${subStr}`;
  }

  console.log('url', url);

  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getLoginEvent = async (filterData: any, token: string) => {
  let url = '/zen/api_Log';

  if (true) {
    let subStr = '';
    for (const key in filterData) {
      if (filterData[key] !== null) {
        subStr += `${key}=${filterData[key]}&`;
      }
    }
    subStr = subStr.slice(0, -1);
    url += `?${subStr}`;
  }

  console.log('url', url);

  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateDefaultCostCodes = async (
  objId: string,
  token: string,
  data: any
) => {
  // patch

  try {
    const response = await api.patch(`/zen/default_Cost_Codes/${objId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateCostCodes = async (
  objId: string,
  token: string,
  data: any
) => {
  try {
    const response = await api.patch(`/zen/cost_Codes/${objId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addDefaultCostCodes = async (token: string, data: any) => {
  console.log('data', data, 'token', token);

  try {
    const response = await api.post(`/zen/default_Cost_Codes/`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const initiateChangePassword = async (token: string, data: any) => {
  console.log('data', data, 'token', token);

  try {
    const response = await api.post(`/auth/initiate-password-change`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response?.data;
  } catch (error: any) {
    console.log(error);
    // check for 401 and 500

    if (error?.response as any) {
      return error?.response?.data;
    }
  }
};
export const completePasswordChange = async (token: string, data: any) => {
  console.log('data', data, 'token', token);

  try {
    const response = await api.post(`/auth/complete-password-change`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response?.data;
  } catch (error: any) {
    console.log(error);
    // check for 401 and 500

    if (error?.response as any) {
      return error?.response?.data;
    }
  }
};

export const addCostCodes = async (token: string, data: any) => {
  console.log('data', data, 'token', token);

  try {
    const response = await api.post(`/zen/cost_Codes/`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addBusinessRolePermission = async (token: string, data: any) => {
  console.log('data', data, 'token', token);

  try {
    const response = await api.post(`/zen/business_Roles_Permissions`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateUser = async (objId: string, token: string, data: any) => {
  // patch

  console.log('objId', objId, 'token', token, 'data', data);

  try {
    const response = await api.patch(`/zen/user/${objId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('response', response);

    return response.data;
  } catch (error) {
    console.log(error);
    handleApiError(error);
  }
};

export const getSpecification = async (filterData: any, token: string) => {
  let url = '/zen/specification';

  if (filterData) {
    let subStr = '';
    for (const key in filterData) {
      subStr += `${key}=${filterData[key]}&`;
    }
    subStr = subStr.slice(0, -1);
    url += `?${subStr}`;
  }

  console.log('url', url);

  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getSpecificationCodes = async (filterData: any, token: string) => {
  let url = '/zen/specification_Codes';

  if (filterData) {
    console.log('filterData', filterData);
    let subStr = '';
    for (const key in filterData) {
      subStr += `${key}=${filterData[key]}&`;
    }
    subStr = subStr.slice(0, -1);
    url += `?${subStr}`;
  }

  console.log('url', url);

  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
