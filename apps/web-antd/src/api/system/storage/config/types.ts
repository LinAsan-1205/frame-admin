import { StorageConfigStatus, StorageConfigType } from './enum';

export declare namespace StorageConfig {
  export type Type = typeof StorageConfigType.valueType;
  export type Status = typeof StorageConfigStatus.valueType;
  export interface View {
    id: number;
    name: string;
    code: string;
    type: Type;
    sort: number;
    description: string;
    status: Status;
    storagePath?: string;
    accessPath?: string;
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    endpoint?: string;
    domain?: string;
    createTime: string;
  }

  export interface Condition {
    type?: Type;
    status?: Status;
  }
  export type Post = Omit<View, 'createTime' | 'id'>;
}
