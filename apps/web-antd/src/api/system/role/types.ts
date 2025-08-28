import { Status } from './enum';

export declare namespace Role {
  export type StatusType = typeof Status.valueType;
  export interface View {
    id: number;
    name: string;
    code: string;
    sort: number;
    status: StatusType;
    remark?: string;
    menuIds: number[];
  }
  export interface Condition {
    name?: string;
    code?: string;
    status?: StatusType;
    startTime?: string;
    endTime?: string;
  }

  export type Post = Omit<View, 'id'>;
}
