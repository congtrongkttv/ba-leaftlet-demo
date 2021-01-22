import { TypeOfTag } from 'typescript';

export interface FieldsControl {
  label: string;
  field: string;
  type: 'checkbox' | 'text' | 'number' | 'list' | 'date' | 'textarea';
  checked?: boolean;
  multiRow?: boolean;
}
