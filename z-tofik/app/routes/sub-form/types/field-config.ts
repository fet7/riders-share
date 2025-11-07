export type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "number"
  | "select"
  | "date"
  | "tel"
  | "password";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  defaultValue?: any;
  options?: { label: string; value: string }[]; // For select fields
  validation?: (value: any) => string | null;
  className?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "search";
  pattern?: string;
}

export interface RecordManagerConfig<T> {
  recordType: string;
  fields: FieldConfig[];
  endpoints: {
    create: string;
    update: string;
    delete: string;
  };
  idField: keyof T;
  idPattern?: string;
  searchFields: (keyof T)[];
  newRecordTemplate?: Partial<T>;
  layout?: "vertical" | "horizontal" | "grid";
  gridColumns?: number;
  onRecordsChange?: (records: T[]) => void;
  onRecordChange?: (record: T) => void;
}
