import { ModelMapping } from '../converter';
import {
  parseInteger,
  parseFloat,
  parseDate,
  parseDateArray,
  formatDateForAPI,
  parseArrayString,
  parseBoolean
} from '@/server/utils/parsers';
import { BaseModel, GenericModelShape, Like, Comment } from './base_mapping';

export class Project extends BaseModel implements ProjectShape {
  home_owner_id: number | null = null;
  business_id: number = 0;
  name: string = '';
  description: string | null = null;
  address: string | null = null;
  address1: string | null = null;
  address2: string | null = null;
  state: string | null = null;
  zipcode: string | null = null;
  city: string | null = null;
  status: string | null = null;
  project_type: string | null = null;
  contract_type: string | null = null;
  budget_estimated: number | null = null;
  actual_spent: number | null = null;
  percentage_complete: number | null = null;
  notes: string | null = null;
  start_date: Date | null = null;
  end_date: Date | null = null;
  exception_notes: string | null = null;
  exception_dates: Date[] = [];
  lot_size_in_acres: number | null = null;
  square_footage: number | null = null;
  non_heated_square_footage: number | null = null;
  heated_square_footage: number | null = null;
  number_of_baths: number | null = null;
  number_of_beds: number | null = null;
  file_info: any | null = null;
  timeline_info: any | null = null;
  budget_info: any | null = null;
  project_documents?: JSON;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'home_owner_id', to: 'home_owner_id', transform: parseInteger },
      { from: 'business_id', to: 'business_id', transform: parseInteger },
      { from: 'name', to: 'name' },
      { from: 'description', to: 'description' },
      { from: 'address', to: 'address' },
      { from: 'address1', to: 'address1' },
      { from: 'address2', to: 'address2' },
      { from: 'state', to: 'state' },
      { from: 'zipcode', to: 'zipcode' },
      { from: 'city', to: 'city' },
      { from: 'status', to: 'status' },
      { from: 'project_type', to: 'project_type' },
      { from: 'contract_type', to: 'contract_type' },
      {
        from: 'budget_estimated',
        to: 'budget_estimated',
        transform: parseInteger
      },
      { from: 'actual_spent', to: 'actual_spent', transform: parseFloat },
      {
        from: 'percentage_complete',
        to: 'percentage_complete',
        transform: parseFloat
      },
      { from: 'notes', to: 'notes' },
      { from: 'start_date', to: 'start_date', transform: parseDate },
      { from: 'end_date', to: 'end_date', transform: parseDate },
      { from: 'exception_notes', to: 'exception_notes' },
      {
        from: 'exception_dates',
        to: 'exception_dates',
        transform: parseDateArray
      },
      {
        from: 'lot_size_in_acres',
        to: 'lot_size_in_acres',
        transform: parseFloat
      },
      { from: 'square_footage', to: 'square_footage', transform: parseInteger },
      {
        from: 'number_of_baths',
        to: 'number_of_baths',
        transform: (v) => parseFloat(v, 1)
      },
      { from: 'number_of_beds', to: 'number_of_beds', transform: parseInteger },
      {
        from: 'heated_square_footage',
        to: 'heated_square_footage',
        transform: parseInteger
      },
      {
        from: 'non_heated_square_footage',
        to: 'non_heated_square_footage',
        transform: parseInteger
      },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      {
        from: 'project_documents',
        to: 'project_documents',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'home_owner_id', to: 'home_owner_id' },
      { from: 'business_id', to: 'gc_business_id' },
      { from: 'name', to: 'name' },
      { from: 'description', to: 'description' },
      { from: 'address', to: 'address' },
      { from: 'address1', to: 'address1' },
      { from: 'address2', to: 'address2' },
      { from: 'state', to: 'state' },
      { from: 'zipcode', to: 'zipcode' },
      { from: 'city', to: 'city' },
      { from: 'status', to: 'status' },
      { from: 'project_type', to: 'project_type' },
      { from: 'contract_type', to: 'contract_type' },
      { from: 'budget_estimated', to: 'budget_estimated' },
      { from: 'actual_spent', to: 'actual_spent' },
      { from: 'percentage_complete', to: 'percentage_complete' },
      { from: 'notes', to: 'notes' },
      { from: 'start_date', to: 'start_date', transform: formatDateForAPI },
      { from: 'end_date', to: 'end_date', transform: formatDateForAPI },
      { from: 'exception_notes', to: 'exception_notes' },
      { from: 'exception_dates', to: 'exception_dates' },
      { from: 'lot_size_in_acres', to: 'lot_size_in_acres' },
      { from: 'square_footage', to: 'square_footage' },
      { from: 'number_of_baths', to: 'number_of_baths' },
      { from: 'number_of_beds', to: 'number_of_beds' },
      { from: 'heated_square_footage', to: 'heated_square_footage' },
      { from: 'non_heated_square_footage', to: 'non_heated_square_footage' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify },
      { from: 'timeline_info', to: 'timeline_info', transform: JSON.stringify },
      { from: 'budget_info', to: 'budget_info', transform: JSON.stringify },
      { from: 'project_documents', to: 'project_documents' }
    ]
  };
}

export class Task extends BaseModel implements TaskShape {
  project_id: number = 0;
  task_code: string = '';
  task_name: string = '';
  description: string | null = null;
  start_date: Date | null = null;
  end_date: Date | null = null;
  task_owner_id: number | null = null;
  business_id: number | null = null;
  order_by: number = 0;
  task_dependencies: number[] = [];
  status: string | null = null;
  notes: string[] = [];
  days_estimated: number = 0;
  budget_estimated: number | null = null;
  actual_days: number | null = null;
  actual_spent: number | null = null;
  percentage_complete: number | null = null;
  percentage_spent: number | null = null;
  file_info: any | null = null;
  sub_tasks: SubTask[] = [];

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_code', to: 'task_code' },
      { from: 'task_name', to: 'task_name' },
      { from: 'description', to: 'description' },
      { from: 'start_date', to: 'start_date', transform: parseDate },
      { from: 'end_date', to: 'end_date', transform: parseDate },
      { from: 'task_owner_id', to: 'task_owner_id', transform: parseInteger },
      { from: 'business_id', to: 'business_id', transform: parseInteger },
      { from: 'order_by', to: 'order_by', transform: parseInteger },
      {
        from: 'task_dependencies',
        to: 'task_dependencies',
        transform: (v) => parseArrayString(v).map(parseInteger)
      },
      { from: 'status', to: 'status' },
      { from: 'notes', to: 'notes', transform: parseArrayString },
      { from: 'days_estimated', to: 'days_estimated', transform: parseInteger },
      {
        from: 'budget_estimated',
        to: 'budget_estimated',
        transform: parseFloat
      },
      { from: 'actual_days', to: 'actual_days', transform: parseInteger },
      { from: 'actual_spent', to: 'actual_spent', transform: parseInteger },
      {
        from: 'percentage_complete',
        to: 'percentage_complete',
        transform: parseFloat
      },
      {
        from: 'percentage_spent',
        to: 'percentage_spent',
        transform: parseFloat
      },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'project_id', to: 'project_id' },
      { from: 'task_code', to: 'task_code' },
      { from: 'task_name', to: 'task_name' },
      { from: 'description', to: 'description' },
      { from: 'start_date', to: 'start_date', transform: formatDateForAPI },
      { from: 'end_date', to: 'end_date', transform: formatDateForAPI },
      { from: 'task_owner_id', to: 'task_owner_id' },
      { from: 'business_id', to: 'business_id' },
      { from: 'order_by', to: 'order_by' },
      { from: 'task_dependencies', to: 'task_dependencies' },
      { from: 'status', to: 'status' },
      { from: 'notes', to: 'notes' },
      { from: 'days_estimated', to: 'days_estimated' },
      { from: 'budget_estimated', to: 'budget_estimated' },
      { from: 'actual_days', to: 'actual_days' },
      { from: 'actual_spent', to: 'actual_spent' },
      { from: 'percentage_complete', to: 'percentage_complete' },
      { from: 'percentage_spent', to: 'percentage_spent' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify }
    ]
  };
}

export class SubTask extends BaseModel implements SubTaskShape {
  task_id: number | null = null;
  name: string = '';
  sub_task_type: string | null = null;
  description: string | null = null;
  start_date: Date | null = null;
  end_date: Date | null = null;
  status: string | null = null;
  notes: string | null = null;
  file_info: any | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      { from: 'name', to: 'name' },
      { from: 'sub_task_type', to: 'sub_task_type' },
      { from: 'description', to: 'description' },
      { from: 'start_date', to: 'start_date', transform: parseDate },
      { from: 'end_date', to: 'end_date', transform: parseDate },
      { from: 'status', to: 'status' },
      { from: 'notes', to: 'notes' },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'task_id', to: 'task_id' },
      { from: 'name', to: 'name' },
      { from: 'sub_task_type', to: 'sub_task_type' },
      { from: 'description', to: 'description' },
      { from: 'start_date', to: 'start_date', transform: formatDateForAPI },
      { from: 'end_date', to: 'end_date', transform: formatDateForAPI },
      { from: 'status', to: 'status' },
      { from: 'notes', to: 'notes' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify }
    ]
  };
}

export class PunchList extends BaseModel implements PunchListShape {
  project_id: number = 0;
  task_id: number | null = null;
  punch_item_type: string | null = null;
  assignee_to_id: number = 0;
  description: string | null = null;
  status: string | null = null;
  file_info: any | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      { from: 'punch_item_type', to: 'punch_item_type' },
      { from: 'assignee_to_id', to: 'assignee_to_id', transform: parseInteger },
      { from: 'description', to: 'description' },
      { from: 'status', to: 'status' },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'project_id', to: 'project_id' },
      { from: 'task_id', to: 'task_id' },
      { from: 'punch_item_type', to: 'punch_item_type' },
      { from: 'assignee_to_id', to: 'assignee_to_id' },
      { from: 'description', to: 'description' },
      { from: 'status', to: 'status' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify }
    ]
  };
}

export class DailyLog extends BaseModel implements DailyLogShape {
  user_id: number = 0;
  project_id: number | null = null;
  task_id: number | null = null;
  log_type: string | null = null;
  checkin_time: Date = new Date();
  checkout_time: Date = new Date();
  hours_worked: number | null = null;
  description: string | null = null;
  file_info: any | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'user_id', to: 'user_id', transform: parseInteger },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      { from: 'log_type', to: 'log_type' },
      { from: 'checkin_time', to: 'checkin_time', transform: parseDate },
      { from: 'checkout_time', to: 'checkout_time', transform: parseDate },
      { from: 'hours_worked', to: 'hours_worked', transform: parseFloat },
      { from: 'description', to: 'description' },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'user_id', to: 'user_id' },
      { from: 'project_id', to: 'project_id' },
      { from: 'task_id', to: 'task_id' },
      { from: 'log_type', to: 'log_type' },
      { from: 'checkin_time', to: 'checkin_time', transform: formatDateForAPI },
      {
        from: 'checkout_time',
        to: 'checkout_time',
        transform: formatDateForAPI
      },
      { from: 'hours_worked', to: 'hours_worked' },
      { from: 'description', to: 'description' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify }
    ]
  };
}

export class ProgressionNotes
  extends BaseModel
  implements ProgressionNotesShape
{
  user_id: number = 0;
  project_id: number = 0;
  task_id: number | null = null;
  notes_type: string = '';
  description: string = '';
  file_info: any | null = null;
  comments: any | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'user_id', to: 'user_id', transform: parseInteger },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      { from: 'notes_type', to: 'notes_type' },
      { from: 'description', to: 'description' },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      {
        from: 'comments',
        to: 'comments',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'user_id', to: 'user_id' },
      { from: 'project_id', to: 'project_id' },
      { from: 'task_id', to: 'task_id' },
      { from: 'notes_type', to: 'notes_type' },
      { from: 'description', to: 'description' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify },
      { from: 'comments', to: 'comments', transform: JSON.stringify }
    ]
  };
}

export class ChangeOrder extends BaseModel implements ChangeOrderShape {
  project_id: number = 0;
  description: string | null = null;
  amount: number | null = null;
  status: string | null = null;
  notes: string[] = [];
  increaase_budget: boolean | null = null;
  payment_terms: string | null = null;
  reviewed_by: number | null = null;
  approved_by: number | null = null;
  file_info: any | null = null;
  action_task_id: number | null = null;
  active: boolean = true;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'description', to: 'description' },
      { from: 'amount', to: 'amount', transform: parseFloat },
      { from: 'status', to: 'status' },
      { from: 'notes', to: 'notes', transform: parseArrayString },
      {
        from: 'increaase_budget',
        to: 'increaase_budget',
        transform: (v) => v === 'true'
      },
      { from: 'payment_terms', to: 'payment_terms' },
      { from: 'reviewed_by', to: 'reviewed_by', transform: parseInteger },
      { from: 'approved_by', to: 'approved_by', transform: parseInteger },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      { from: 'action_task_id', to: 'action_task_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: parseBoolean }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'project_id', to: 'project_id' },
      { from: 'description', to: 'description' },
      { from: 'amount', to: 'amount' },
      { from: 'status', to: 'status' },
      { from: 'notes', to: 'notes' },
      { from: 'increaase_budget', to: 'increaase_budget' },
      { from: 'payment_terms', to: 'payment_terms' },
      { from: 'reviewed_by', to: 'reviewed_by' },
      { from: 'approved_by', to: 'approved_by' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify },
      { from: 'action_task_id', to: 'action_task_id' },
      { from: 'active', to: 'active' }
    ]
  };
}

export class PurchaseOrder extends BaseModel implements PurchaseOrderShape {
  action_task_id: number | null = null;
  active: boolean = true;
  Order_date: Date | null = null;
  Delivery_date: Date | null = null;
  user_id: number = 0;
  description: string | null = null;
  amount: number | null = null;
  business_id: number = 0;
  notes: string[] = [];
  status: string | null = null;
  po_number: string | null = null;
  file_info: any | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'action_task_id', to: 'action_task_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: parseBoolean },
      { from: 'Order_date', to: 'Order_date', transform: parseDate },
      { from: 'Delivery_date', to: 'Delivery_date', transform: parseDate },
      { from: 'user_id', to: 'user_id', transform: parseInteger },
      { from: 'description', to: 'description' },
      { from: 'amount', to: 'amount', transform: parseFloat },
      { from: 'business_id', to: 'business_id', transform: parseInteger },
      { from: 'notes', to: 'notes', transform: parseArrayString },
      { from: 'status', to: 'status' },
      { from: 'po_number', to: 'po_number' },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'action_task_id', to: 'action_task_id' },
      { from: 'active', to: 'active' },
      { from: 'Order_date', to: 'Order_date', transform: formatDateForAPI },
      {
        from: 'Delivery_date',
        to: 'Delivery_date',
        transform: formatDateForAPI
      },
      { from: 'user_id', to: 'user_id' },
      { from: 'description', to: 'description' },
      { from: 'amount', to: 'amount' },
      { from: 'business_id', to: 'business_id' },
      { from: 'notes', to: 'notes' },
      { from: 'status', to: 'status' },
      { from: 'po_number', to: 'po_number' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify }
    ]
  };
}

export class Inspiration extends BaseModel implements InspirationShape {
  title: string = '';
  description: string | null = null;
  links: any | null = null;
  notes: string | null = null;
  category: string | null = null;
  tags: string[] = [];
  order: number = 0;
  is_private: boolean = false;
  view_count: number = 0;
  metadata: any | null = null;
  project_id: number | null = null;
  task_id: number | null = null;
  comments: Comment[] = [];
  likes: Like[] = [];
  shares: any | null = null;
  inspiration_images?: JSON;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'title', to: 'title' },
      { from: 'description', to: 'description' },
      {
        from: 'links',
        to: 'links',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      { from: 'notes', to: 'notes' },
      { from: 'category', to: 'category' },
      { from: 'tags', to: 'tags', transform: parseArrayString },
      { from: 'order', to: 'order', transform: parseInteger },
      { from: 'is_private', to: 'is_private', transform: parseBoolean },
      { from: 'view_count', to: 'view_count', transform: parseInteger },
      {
        from: 'metadata',
        to: 'metadata',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'task_id', to: 'task_id', transform: parseInteger },
      {
        from: 'comments',
        to: 'comments',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      },
      {
        from: 'likes',
        to: 'likes',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      },
      {
        from: 'shares',
        to: 'shares',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      {
        from: 'inspiration_images',
        to: 'inspiration_images',
        transform: (v) => (v ? JSON.parse(v as string) : [])
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'title', to: 'title' },
      { from: 'description', to: 'description' },
      { from: 'links', to: 'links', transform: JSON.stringify },
      { from: 'notes', to: 'notes' },
      { from: 'category', to: 'category' },
      { from: 'tags', to: 'tags' },
      { from: 'order', to: 'order' },
      { from: 'is_private', to: 'is_private' },
      { from: 'view_count', to: 'view_count' },
      { from: 'metadata', to: 'metadata', transform: JSON.stringify },
      { from: 'project_id', to: 'project_id' },
      { from: 'task_id', to: 'task_id' },
      { from: 'comments', to: 'comments', transform: JSON.stringify },
      { from: 'likes', to: 'likes', transform: JSON.stringify },
      { from: 'shares', to: 'shares', transform: JSON.stringify },
      { from: 'inspiration_images', to: 'inspiration_images' }
    ]
  };
}

// "creator_id": 0,
// "updater_id": 0,
// "active": true,
// "project_id": 200001,
// "specification_code_id": 3895,
// "title": "FOUNDATION",
// "detailed_specs": {},
// "description": null,
// "notes": [],
// "status": null,
// "file_info": null

export class Specification extends BaseModel implements SpecificationShape {
  creator_id: number = 0;
  updater_id: number = 0;
  active: boolean = true;
  project_id: number = 0;
  specification_code_id: number = 0;
  title: string = '';
  detailed_specs: any | null = null;
  description: string | null = null;
  notes: string[] = [];
  status: string | null = null;
  file_info: any | null = null;

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'updater_id', to: 'updater_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: parseBoolean },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      {
        from: 'specification_code_id',
        to: 'specification_code_id',
        transform: parseInteger
      },
      { from: 'title', to: 'title' },
      {
        from: 'detailed_specs',
        to: 'detailed_specs',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      { from: 'description', to: 'description' },
      { from: 'notes', to: 'notes', transform: parseArrayString },
      { from: 'status', to: 'status' },
      {
        from: 'file_info',
        to: 'file_info',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'creator_id', to: 'creator_id' },
      { from: 'updater_id', to: 'updater_id' },
      { from: 'active', to: 'active' },
      { from: 'project_id', to: 'project_id' },
      { from: 'specification_code_id', to: 'specification_code_id' },
      { from: 'title', to: 'title' },
      {
        from: 'detailed_specs',
        to: 'detailed_specs',
        transform: JSON.stringify
      },
      { from: 'description', to: 'description' },
      { from: 'notes', to: 'notes' },
      { from: 'status', to: 'status' },
      { from: 'file_info', to: 'file_info', transform: JSON.stringify }
    ]
  };
}

// {
//   "type": "specification_Codes",
//   "id": 3895,
//   "attributes": {
//       "creator_id": 0,
//       "updater_id": 0,
//       "active": true,
//       "code": "FOUNDATION",
//       "category": "Grading and Foundation",
//       "project_id": 200001,
//       "interior": false,
//       "exterior": true,
//       "room_type": "",
//       "trades_included": [
//           "'FOUNDATION'"
//       ],
//       "spec_configurations": {
//           "title": "Foundation",
//           "sections": [
//               {
//                   "fields": [
//                       {
//                           "label": "Type-",
//                           "options": [
//                               {
//                                   "label": "Monolithic Slab Foundation",
//                                   "value": "monolithicSlabFoundation"
//                               },
//                               {
//                                   "label": "Stem Wall Slab Foundation",
//                                   "value": "stemWallSlabFoundation"
//                               },
//                               {
//                                   "label": "Crawl Space Foundation",
//                                   "value": "crawlSpaceFoundation"
//                               },
//                               {
//                                   "label": "Full Basement Foundation",
//                                   "value": "fullBasementFoundation"
//                               },
//                               {
//                                   "label": "Pier and Beam Foundation",
//                                   "value": "pierAndBeamFoundation"
//                               }
//                           ],
//                           "inputType": "radio",
//                           "attributeName": "type"
//                       },
//                       {
//                           "label": "Block or Poured Wall-",
//                           "options": [
//                               {
//                                   "label": "Block",
//                                   "value": "block"
//                               },
//                               {
//                                   "label": "Poured",
//                                   "value": "poured "
//                               },
//                               {
//                                   "label": "N/A",
//                                   "value": "na"
//                               }
//                           ],
//                           "inputType": "radio",
//                           "attributeName": "blockorPouredWall"
//                       },
//                       {
//                           "label": "Block Finish-",
//                           "options": [
//                               {
//                                   "label": "Regular Block Finish",
//                                   "value": "regularBlockFinish"
//                               },
//                               {
//                                   "label": "Brick",
//                                   "value": "brick"
//                               },
//                               {
//                                   "label": "Real Stone",
//                                   "value": "realStone"
//                               },
//                               {
//                                   "label": "Cultured Stone",
//                                   "value": "culturedStone"
//                               },
//                               {
//                                   "label": "Other",
//                                   "value": "other"
//                               }
//                           ],
//                           "inputType": "radio",
//                           "attributeName": "blockFinish"
//                       },
//                       {
//                           "label": "___________________________________",
//                           "inputType": "text",
//                           "attributeName": "blockFinishOther"
//                       },
//                       {
//                           "label": "Poured Walls",
//                           "options": [
//                               {
//                                   "label": "Per Plan",
//                                   "value": "perPaln"
//                               },
//                               {
//                                   "label": "8 inches",
//                                   "value": "eight"
//                               },
//                               {
//                                   "label": "10 inches",
//                                   "value": "ten"
//                               },
//                               {
//                                   "label": "12 inches",
//                                   "value": "twelve"
//                               }
//                           ],
//                           "inputType": "radio",
//                           "attributeName": "approximateMonolithicSlabEdgeDim:"
//                       },
//                       {
//                           "label": "Approximate Monolithic Slab Edge Dimension:",
//                           "options": [
//                               {
//                                   "label": "Per Plan",
//                                   "value": "perPaln"
//                               },
//                               {
//                                   "label": "12 inches",
//                                   "value": "twelve"
//                               },
//                               {
//                                   "label": "16 inches",
//                                   "value": "sixteen"
//                               },
//                               {
//                                   "label": "24 inches",
//                                   "value": "twentyFour"
//                               }
//                           ],
//                           "inputType": "radio",
//                           "attributeName": "pouredWalls:"
//                       }
//                   ],
//                   "sectionName": "Foundation"
//               },
//               {
//                   "fields": [
//                       {
//                           "inputType": "text",
//                           "attributeName": "basementFloorAmount",
//                           "Basement Floor $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "windowWellsAmount",
//                           "Window Wells $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "footerDrainsAmount",
//                           "Footer Drains $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "Brick Ledge $": "___________________________________",
//                           "attributeName": "brickLedgeAmount"
//                       },
//                       {
//                           "Parging $": "___________________________________",
//                           "inputType": "text",
//                           "attributeName": "pargingAmount"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "sillPlateBoltsStrapsAmount",
//                           "Sill Plate Bolts/Straps $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "basementWindowsAmount",
//                           "Basement Windows $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "Bilco Door $": "___________________________________",
//                           "attributeName": "bilcoDoorAmount"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "padforACUnitAmount",
//                           "Pad for A/C Unit $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "padforTransformerAmount",
//                           "Pad for Transformer $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "sumpPumpFloorDrains",
//                           "Sump Pump & Floor Drains $": "___________________________________"
//                       }
//                   ],
//                   "sectionName": "Other charges: (if applicable)"
//               },
//               {
//                   "fields": [
//                       {
//                           "inputType": "text",
//                           "attributeName": "monolithicSlabAmount",
//                           "Monolithic Slab $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "Stem Wall $": "___________________________________",
//                           "attributeName": "stemWallAmount"
//                       },
//                       {
//                           "inputType": "text",
//                           "Step Downs $": "___________________________________",
//                           "attributeName": "stepdownsAmount"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "slabThickness4InchesAmount",
//                           "Slab Thickness 4 inches $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "slabThickness6InchesAmount",
//                           "PSlab Thickness 6 inches $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "Fiber Mesh $": "___________________________________",
//                           "attributeName": "fiberMeshAmount"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "steelMeshAmount",
//                           "Steel Mesh (6/6-10/10) $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "visqueen6milAmount",
//                           "Visqueen 6 mil$": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "visqueen10milAmount",
//                           "Visqueen 10 mil $": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "attributeName": "iimeFrameforCompletion",
//                           "Time Frame for Completion ": "___________________________________"
//                       },
//                       {
//                           "inputType": "text",
//                           "Other Notes $": "___________________________________",
//                           "attributeName": "otherNotes"
//                       }
//                   ],
//                   "sectionName": "General cost per square foot information needed from subcontractor:"
//               }
//           ],
//           "SPECIFICATION DESCRIPTION": "Subcontractor to furnish all pumps, rebar, anchors, concrete, and other materials and/or equipment needed for a complete foundation.Subcontractor to supply all form material, clips and cleats, and panel system with snap ties. Panels must be in good condition. Subcontractor to install keyway if determined necessary. Subcontractor to work with owner on setting grades and elevations."
//       },
//       "spec_description": ""
//   }
// },

export class SpecificationCode extends BaseModel {
  creator_id: number = 0;
  updater_id: number = 0;
  active: boolean = true;
  code: string = '';
  category: string = '';
  project_id: number = 0;
  interior: boolean = false;
  exterior: boolean = false;
  room_type: string = '';
  trades_included: string[] = [];
  spec_configurations: any | null = null;
  spec_description: string = '';

  static override baseMapping: ModelMapping = {
    formdata_to_object: [
      ...BaseModel.baseMapping.formdata_to_object,
      { from: 'creator_id', to: 'creator_id', transform: parseInteger },
      { from: 'updater_id', to: 'updater_id', transform: parseInteger },
      { from: 'active', to: 'active', transform: parseBoolean },
      { from: 'code', to: 'code' },
      { from: 'category', to: 'category' },
      { from: 'project_id', to: 'project_id', transform: parseInteger },
      { from: 'interior', to: 'interior', transform: parseBoolean },
      { from: 'exterior', to: 'exterior', transform: parseBoolean },
      { from: 'room_type', to: 'room_type' },
      {
        from: 'trades_included',
        to: 'trades_included',
        transform: parseArrayString
      },
      {
        from: 'spec_configurations',
        to: 'spec_configurations',
        transform: (v) => (v ? JSON.parse(v as string) : null)
      },
      { from: 'spec_description', to: 'spec_description' }
    ],
    object_to_api: [
      ...BaseModel.baseMapping.object_to_api,
      { from: 'creator_id', to: 'creator_id' },
      { from: 'updater_id', to: 'updater_id' },
      { from: 'active', to: 'active' },
      { from: 'code', to: 'code' },
      { from: 'category', to: 'category' },
      { from: 'project_id', to: 'project_id' },
      { from: 'interior', to: 'interior' },
      { from: 'exterior', to: 'exterior' },
      { from: 'room_type', to: 'room_type' },
      { from: 'trades_included', to: 'trades_included' },
      {
        from: 'spec_configurations',
        to: 'spec_configurations',
        transform: JSON.stringify
      },
      { from: 'spec_description', to: 'spec_description' }
    ]
  };
}

export type ProjectShape = GenericModelShape &
  Omit<Project, keyof GenericModelShape>;
export type TaskShape = GenericModelShape & Omit<Task, keyof GenericModelShape>;
export type SubTaskShape = GenericModelShape &
  Omit<SubTask, keyof GenericModelShape>;
export type PunchListShape = GenericModelShape &
  Omit<PunchList, keyof GenericModelShape>;
export type DailyLogShape = GenericModelShape &
  Omit<DailyLog, keyof GenericModelShape>;
export type ProgressionNotesShape = GenericModelShape &
  Omit<ProgressionNotes, keyof GenericModelShape>;
export type ChangeOrderShape = GenericModelShape &
  Omit<ChangeOrder, keyof GenericModelShape>;

export type InspirationShape = GenericModelShape &
  Omit<Inspiration, keyof GenericModelShape>;
export type PurchaseOrderShape = GenericModelShape &
  Omit<PurchaseOrder, keyof GenericModelShape>;
export type SpecificationShape = GenericModelShape &
  Omit<Specification, keyof GenericModelShape>;
export type SpecificationCodeShape = GenericModelShape &
  Omit<SpecificationCode, keyof GenericModelShape>;

export const projectMapping = Project.baseMapping;
export const taskMapping = Task.baseMapping;
export const subTaskMapping = SubTask.baseMapping;
export const punchListMapping = PunchList.baseMapping;
export const dailyLogMapping = DailyLog.baseMapping;
export const progressionNotesMapping = ProgressionNotes.baseMapping;
export const changeOrderMapping = ChangeOrder.baseMapping;
export const inspirationMapping = Inspiration.baseMapping;
export const purchaseOrderMapping = PurchaseOrder.baseMapping;
export const specificationMapping = Specification.baseMapping;
export const specificationCodeMapping = SpecificationCode.baseMapping;
