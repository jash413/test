interface APIField<T> {
  value: T;
  apiField: string;
}

interface APIMapping<T> {
  fields: { [K in keyof T]: APIField<T[K]> };
  path: string;
}


export const NoDataFoundError = new Error('No data returned from API');

export function convertResponse<T>(
  response: any,
  mapping: APIMapping<T>
): T {
  const result = {} as T;
  if ( response.status !== 200 ) {
    let errorMessage = 'Undefined API Errror'
    if ( response.body.errors[0].title ) errorMessage = 'API Errror - ' + response.body.errors[0].title
    throw new Error(errorMessage);
  }

  if ( response.data.length && response.data.length == 0 ) {
    throw NoDataFoundError
  }
  // Function to safely get nested properties
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
  };

  const data = getNestedValue(response.data, mapping.path);

  for (const [key, field] of Object.entries(mapping.fields) as [keyof T, APIField<any>][]) {
    if (field.apiField === 'token') {
      result[key] = response.data.token;
    } else if (field.apiField === 'id') {
      result[key] = data?.id;
    } else {
      const value = data?.attributes?.[field.apiField];
      result[key] = formatValue(value, typeof field.value);
    }
  }

  return result;
}

function formatValue(value: any, type: string): any {
  if (value === null) return null;
  switch (type) {
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    case 'object':
      return value instanceof Date ? new Date(value) : value;
    default:
      return value;
  }
}

export type UserShape = {
  id: number;
  email: string;
  name: string | null;
  emailVerified: Date | null;
  phoneVerified: Date | null;
  image: string | null;
  phone: string;
  apiUserToken: string;
  profileCreated: boolean;
  fullyOnboarded: boolean;
  business_info : any;
};

export const User: APIMapping<UserShape> = {
  path: 'user.body.data',
  fields: {
    id: { value: 0, apiField: 'id' },
    apiUserToken: { value: '', apiField: 'token' },
    email: { value: '', apiField: 'email' },
    name: { value: null, apiField: 'name' },
    emailVerified: { value: null, apiField: 'email_verified' },
    phoneVerified: { value: null, apiField: 'phone_verified' },
    image: { value: null, apiField: 'image' },
    phone: { value: '', apiField: 'phone_number_mobile' },
    profileCreated : { value: false, apiField: 'profile_created' },
    fullyOnboarded: { value: false, apiField: 'user_fully_onboarded' },
    business_info : { value: null, apiField: 'business_info' }
  }
};

export type UserWithMapping = typeof User;

export function formDataToJSON<T>(formData: FormData, mapping: APIMapping<T>, type: string): { data: { type: string; attributes: Partial<T> } } {
  const attributes: Partial<T> = {};

  const parseSafely = (value: string | null) => {
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return value; // Return the original value if parsing fails
    }
  };

  const getFormValue = (key: string): string | null => {
    const value = formData.get(key);
    return value instanceof File ? null : (value as string | null);
  };

  Object.entries(mapping.fields).forEach(([key, field] : any) => {
    const formValue = getFormValue(field.apiField);
    let value: any = formValue;

    // Apply transformations based on field type
    if (key === 'dateOfBirth' || (typeof key === 'string' && key.toLowerCase().includes('date'))) {
      value = formValue ? new Date(formValue) : null;
    } else if (key === 'socialMediaLinks' || key === 'homeOwnerInterests') {
      value = parseSafely(formValue);
    }

    if (value !== null && value !== undefined) {
      attributes[key as keyof T] = value;
    }
  });

  // Handle address fields specially
  const address = getFormValue('address');
  if (address) {
    const addressParts = address.split(',').map(part => part.trim());
    attributes['address1' as keyof T] = addressParts[0] as any;
    attributes['address2' as keyof T] = addressParts.slice(1, -2).join(', ') as any;
    attributes['state' as keyof T] = addressParts[addressParts.length - 2] as any;
    attributes['zipcode' as keyof T] = addressParts[addressParts.length - 1] as any;
  }

  return {
    data: {
      type,
      attributes
    }
  };
}
