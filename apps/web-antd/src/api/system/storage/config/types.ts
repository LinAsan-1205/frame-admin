import {
  StorageConfigIsDefault,
  StorageConfigStatus,
  StorageConfigType,
} from './enum';

export declare namespace StorageConfig {
  export type Type = typeof StorageConfigType.valueType;
  export type Status = typeof StorageConfigStatus.valueType;
  export type IsDefault = typeof StorageConfigIsDefault.valueType;
  
  /**
   * 存储配置视图类型
   */
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

  /**
   * 查询条件类型
   */
  export interface Condition {
    type?: Type;
    status?: Status;
    isDefault?: IsDefault;
    code?: string;
    name?: string;
    createFormDate?: string;
    createToDate?: string;
  }

  /**
   * 创建存储配置类型
   */
  export interface Create {
    name: string;
    code: string;
    type: Type;
    sort?: number;
    description?: string;
    status?: Status;
    storagePath?: string;
    accessPath?: string;
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    endpoint?: string;
    domain?: string;
    isDefault: IsDefault;
  }

  /**
   * 更新存储配置类型
   */
  export interface Update {
    name?: string;
    sort?: number;
    description?: string;
    status?: Status;
    storagePath?: string;
    accessPath?: string;
    accessKey?: string;
    secretKey?: string;
    bucket?: string;
    endpoint?: string;
    domain?: string;
  }

  /**
   * 设置状态类型
   */
  export interface StatusDto {
    configId: number;
    status: Status;
  }

  /**
   * 设置默认类型
   */
  export interface IsDefaultDto {
    configId: number;
    isDefault: IsDefault;
  }

  /**
   * 批量删除类型
   */
  export interface BatchDeleteDto {
    configIds: number[];
  }

  /**
   * 统计信息类型
   */
  export interface Statistics {
    totalCount: number;
    enabledCount: number;
    disabledCount: number;
    localCount: number;
    ossCount: number;
    defaultCount: number;
  }

  // 兼容旧版本的类型别名
  export type Post = Create;
}
