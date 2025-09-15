import { Status } from './enum';

export declare namespace Dict {
  export type Status = typeof Status.valueType;

  export interface View {
    id: number;
    dictName: string;
    dictType: string;
    status: Status;
    remark?: string;
    createTime: string;
    updateTime: string;
    dictData?: DictData.View[];
  }

  export interface Condition {
    dictName?: string;
    dictType?: string;
    status?: Status;
    createFormDate?: string;
    createToDate?: string;
  }

  export interface Post {
    dictName: string;
    dictType: string;
    status?: Status;
    remark?: string;
  }
}

export declare namespace DictData {
  export type Status = typeof Status.valueType;

  export interface View {
    id: number;
    dictId: number;
    dictLabel: string;
    dictValue: string;
    dictSort: number;
    status: Status;
    remark?: string;
    createTime: string;
    updateTime: string;
    dict?: Pick<Dict.View, 'dictName' | 'dictType' | 'id'>;
  }

  export interface Condition {
    dictId?: number;
    dictLabel?: string;
    dictValue?: string;
    status?: Status;
    createFormDate?: string;
    createToDate?: string;
  }

  export interface Post {
    dictId: number;
    dictLabel: string;
    dictValue: string;
    dictSort?: number;
    status?: Status;
    remark?: string;
  }
}
