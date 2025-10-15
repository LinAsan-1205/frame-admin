import { PostStatus } from './enum';

export namespace Post {
  export type StatusType = typeof PostStatus.valueType;

  export interface View {
    id: number;
    postCode: string;
    postName: string;
    deptId?: number;
    postSort: number;
    status: StatusType;
    remark?: string;
    dept?: {
      id: number;
      name: string;
    };
    createTime?: string;
    updateTime?: string;
  }

  export interface Condition {
    postCode?: string;
    postName?: string;
    status?: StatusType;
    deptId?: number;
  }

  export interface Create {
    postCode: string;
    postName: string;
    deptId?: number;
    postSort?: number;
    status?: StatusType;
    remark?: string;
  }

  export interface Update extends Partial<Create> {
    id: number;
  }

  export interface SetStatus {
    id: number;
    status: StatusType;
  }

  export interface BatchDelete {
    postIds: number[];
  }
}
