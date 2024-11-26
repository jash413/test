// file : server/converter.ts

export type ConversionRule = {
  from: string;
  to: string;
  transform?: (value: any) => any;
};

export type ModelMapping = {
  [key: string]: ConversionRule[];
};

export function convertData<T extends object, U extends object>(
  data: T | FormData,
  mapping: ModelMapping,
  fromType: string,
  toType: string
): U {
  const result = {} as U;

  const rules = mapping[`${fromType}_to_${toType}`] || [];

  for (const rule of rules) {
    let value: any;

    if (data instanceof FormData) {
      value = data.get(rule.from);
    } else {
      value = (data as any)[rule.from];
    }

    if (rule.transform) {
      value = rule.transform(value);
    }

    if (toType === 'formdata') {
      (result as FormData).append(rule.to, value);
    } else {
      (result as any)[rule.to] = value;
    }
  }

  // console.log('result in convertor :::' , result);

  // Special handling for address
  // if (fromType === 'formdata' && toType === 'object') {
  //   const address =
  //     data instanceof FormData ? (data.get('address') as string) : '';
  //   if (address) {
  //     const parts = address.split(',').map((part) => part.trim());
  //     (result as any).address1 = parts[0];
  //     (result as any).address2 =
  //       parts.length > 3 ? parts.slice(1, -2).join(', ') : '';
  //     (result as any).state = parts[parts.length - 2];
  //     (result as any).zipcode = parts[parts.length - 1];
  //   }
  // } else if (
  //   (fromType === 'object' || fromType === 'api') &&
  //   toType === 'formdata'
  // ) {
  //   const address1 = (data as any).address1 || '';
  //   const address2 = (data as any).address2 || '';
  //   const state = (data as any).state || '';
  //   const zipcode = (data as any).zipcode || '';
  //   const fullAddress = [address1, address2, state, zipcode]
  //     .filter(Boolean)
  //     .join(', ');
  //   (result as FormData).append('address', fullAddress);
  // } else if (fromType === 'api' || toType === 'object') {
  //   const address1 = (data as any).address1 || '';
  //   const address2 = (data as any).address2 || '';
  //   const state = (data as any).state || '';
  //   const zipcode = (data as any).zipcode || '';
  //   const fullAddress = [address1, address2, state, zipcode]
  //     .filter(Boolean)
  //     .join(', ');
  //   const file_size = (data as any).file_size || '';
  //   (result as any).address = fullAddress;
  //   (result as any).file_size = file_size;
  //   // console.log('result in convertor :::', data);
  // }

  return result;
}

export function addReverseMappings(mapping: ModelMapping) {
  for (const [key, rules] of Object.entries(mapping)) {
    const [from, _, to] = key.split('_');
    const reverseKey = `${to}_to_${from}`;
    if (!mapping[reverseKey]) {
      mapping[reverseKey] = rules.map((rule) => ({
        from: rule.to,
        to: rule.from,
        transform: rule.transform
          ? (value: any) => {
              try {
                return JSON.parse(value);
              } catch {
                return value;
              }
            }
          : undefined
      }));
    }
  }
}

export function createModelConverters<T extends object, U extends object>(
  modelName: string,
  mapping: ModelMapping
) {
  addReverseMappings(mapping);

  return {
    fromFormData: (formData: FormData): T =>
      convertData<FormData, T>(formData, mapping, 'formdata', 'object'),

    toAPIFormat: (
      obj: T
    ): { data: { type: string; id?: number | null; attributes: U } } => ({
      data: {
        type: modelName,
        id: (obj as any).id,
        attributes: convertData<T, U>(obj, mapping, 'object', 'api')
      }
    }),

    fromAPIFormat: (apiObj: {
      data: { type: string; id?: number | null; attributes: U };
      errors?: any[];
    }): T => {
      if (apiObj.errors) {
        throw new Error(apiObj.errors[0].detail);
      }

      const converted = convertData<U, T>(
        apiObj.data.attributes,
        mapping,
        'api',
        'object'
      );

      (converted as any).id = apiObj.data.id;
      return converted;
    },

    toFormData: (obj: T): FormData =>
      convertData<T, FormData>(obj, mapping, 'object', 'formdata')
  };
}
