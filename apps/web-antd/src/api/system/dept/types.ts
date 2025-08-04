import { Status } from './enum';

export namespace Dept {
  export type StatusType = typeof Status.valueType;
  export interface View {
    [key: string]: any;
    children?: Dept.View[];
    id: number;
    name: string;
    remark?: string;
    status: StatusType;
    leader?: string;
    phone?: string;
  }
  export interface Condition {
    name?: string;
    leader?: string;
    phone?: string;
  }
}
