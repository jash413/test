import { ModelMapping } from '../converter';

export type GenericModelShape = {
  id?: number;
  created_at?: Date;
  creator_id?: number;
  updated_at?: Date;
  [key: string]: any;
};

export class BaseModel implements GenericModelShape {
  id?: number;
  created_at?: Date;
  creator_id?: number;
  updated_at?: Date;
  file_info?: Record<string, any>;

  static baseMapping: ModelMapping = {
    formdata_to_object: [
      { from: 'id', to: 'id', transform: (v) => Number(v) || undefined },
      {
        from: 'created_at',
        to: 'created_at',
        transform: (v) => (v ? new Date(v as string) : undefined)
      },
      {
        from: 'updated_at',
        to: 'updated_at',
        transform: (v) => (v ? new Date(v as string) : undefined)
      },
      {
        from: 'creator_id',
        to: 'creator_id',
        transform: (v) => (v !== undefined ? Number(v) : undefined)
      },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : undefined)
      }
    ],
    object_to_api: [
      { from: 'id', to: 'id' },
      {
        from: 'created_at',
        to: 'created_at',
        transform: (v) => (v instanceof Date ? v.toISOString() : undefined)
      },
      {
        from: 'updated_at',
        to: 'updated_at',
        transform: (v) => (v instanceof Date ? v.toISOString() : undefined)
      },
      { from: 'creator_id', to: 'creator_id' },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.stringify(v) : undefined)
      }
    ]
  };
}

export interface Comment {
  id: number;
  userName: string;
  userId: number;
  timestamp: string;
  text: string;
  replyTo?: number;
}

export interface Like {
  userId: number;
  userName: string;
  timestamp: string;
}
