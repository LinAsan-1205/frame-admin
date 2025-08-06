import {
  StorageConfigIsDefault,
  StorageConfigStatus,
  StorageConfigType,
} from './enum';

export declare namespace StorageConfig {
  export type Type = typeof StorageConfigType.valueType;
  export type Status = typeof StorageConfigStatus.valueType;
  export type IsDefault = typeof StorageConfigIsDefault.valueType;
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
    isDefault: IsDefault;
  }

  export interface Condition {
    type?: Type;
    status?: Status;
    isDefault?: IsDefault;
    code?: string;
    name?: string;
  }
  export type Post = Omit<View, 'createTime' | 'id'>;
}
