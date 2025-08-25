import {
  StorageConfigIsDefault,
  StorageConfigStatus,
  StorageConfigType,
} from './enum';

export declare namespace StorageConfig {
  /** 存储配置类型 */
  export type Type = typeof StorageConfigType.valueType;
  /** 存储配置状态 */
  export type Status = typeof StorageConfigStatus.valueType;
  /** 存储配置是否默认 */
  export type IsDefault = typeof StorageConfigIsDefault.valueType;

  /**
   * 存储配置视图类型
   */
  export interface View {
    /** 存储配置唯一标识ID */
    id: number;
    /** 存储配置名称 */
    name: string;
    /** 存储配置编码，用于系统内部标识 */
    code: string;
    /** 存储类型：Local(本地存储) 或 OSS(对象存储) */
    type: Type;
    /** 排序权重，数值越小排序越靠前 */
    sort: number;
    /** 存储配置描述信息 */
    description: string;
    /** 存储配置状态：Enabled(启用) 或 Disabled(禁用) */
    status: Status;
    /** 存储路径，本地存储时指定本地目录路径 */
    storagePath?: string;
    /** 访问路径，用于外部访问存储资源的URL前缀 */
    accessPath?: string;
    /** 访问密钥，OSS存储时用于身份验证 */
    accessKey?: string;
    /** 秘密密钥，OSS存储时用于身份验证 */
    secretKey?: string;
    /** 存储桶名称，OSS存储时指定存储桶 */
    bucket?: string;
    /** 服务端点，OSS存储时指定服务地址 */
    endpoint?: string;
    /** 自定义域名，用于自定义访问地址 */
    domain?: string;
    /** 创建时间，格式：YYYY-MM-DD HH:mm:ss */
    createTime: string;
    /** 是否为默认存储配置：Yes(是) 或 No(否) */
    isDefault: IsDefault;
  }

  /**
   * 查询条件类型
   */
  export interface Condition {
    /** 存储类型筛选条件 */
    type?: Type;
    /** 存储状态筛选条件 */
    status?: Status;
    /** 是否默认筛选条件 */
    isDefault?: IsDefault;
    /** 存储配置编码模糊查询 */
    code?: string;
    /** 存储配置名称模糊查询 */
    name?: string;
    /** 创建时间起始日期，格式：YYYY-MM-DD */
    createFormDate?: string;
    /** 创建时间结束日期，格式：YYYY-MM-DD */
    createToDate?: string;
  }

  /**
   * 创建存储配置类型
   */
  export interface Create {
    /** 存储配置名称，必填项 */
    name: string;
    /** 存储配置编码，必填项，系统内唯一 */
    code: string;
    /** 存储类型，必填项：Local(本地存储) 或 OSS(对象存储) */
    type: Type;
    /** 排序权重，可选，默认值为0 */
    sort?: number;
    /** 存储配置描述信息，可选 */
    description?: string;
    /** 存储配置状态，可选，默认为Enabled(启用) */
    status?: Status;
    /** 存储路径，本地存储时必填，指定本地目录路径 */
    storagePath?: string;
    /** 访问路径，可选，用于外部访问存储资源的URL前缀 */
    accessPath?: string;
    /** 访问密钥，OSS存储时必填，用于身份验证 */
    accessKey?: string;
    /** 秘密密钥，OSS存储时必填，用于身份验证 */
    secretKey?: string;
    /** 存储桶名称，OSS存储时必填，指定存储桶 */
    bucket?: string;
    /** 服务端点，OSS存储时必填，指定服务地址 */
    endpoint?: string;
    /** 自定义域名，可选，用于自定义访问地址 */
    domain?: string;
    /** 是否为默认存储配置，必填项：Yes(是) 或 No(否) */
    isDefault: IsDefault;
  }

  /**
   * 更新存储配置类型
   */
  export interface Update {
    /** 存储配置名称，可选 */
    name?: string;
    /** 排序权重，可选 */
    sort?: number;
    /** 存储配置描述信息，可选 */
    description?: string;
    /** 存储配置状态，可选：Enabled(启用) 或 Disabled(禁用) */
    status?: Status;
    /** 存储路径，可选，本地存储时指定本地目录路径 */
    storagePath?: string;
    /** 访问路径，可选，用于外部访问存储资源的URL前缀 */
    accessPath?: string;
    /** 访问密钥，可选，OSS存储时用于身份验证 */
    accessKey?: string;
    /** 秘密密钥，可选，OSS存储时用于身份验证 */
    secretKey?: string;
    /** 存储桶名称，可选，OSS存储时指定存储桶 */
    bucket?: string;
    /** 服务端点，可选，OSS存储时指定服务地址 */
    endpoint?: string;
    /** 自定义域名，可选，用于自定义访问地址 */
    domain?: string;
  }

  /**
   * 设置状态类型
   */
  export interface StatusDto {
    /** 存储配置ID，必填项 */
    configId: number;
    /** 目标状态，必填项：Enabled(启用) 或 Disabled(禁用) */
    status: Status;
  }

  /**
   * 设置默认类型
   */
  export interface IsDefaultDto {
    /** 存储配置ID，必填项 */
    configId: number;
    /** 是否设为默认，必填项：Yes(是) 或 No(否) */
    isDefault: IsDefault;
  }

  /**
   * 批量删除类型
   */
  export interface BatchDeleteDto {
    /** 存储配置ID数组，必填项，支持批量删除多个配置 */
    configIds: number[];
  }

  /**
   * 统计信息类型
   */
  export interface Statistics {
    /** 存储配置总数 */
    totalCount: number;
    /** 启用状态的配置数量 */
    enabledCount: number;
    /** 禁用状态的配置数量 */
    disabledCount: number;
    /** 本地存储类型配置数量 */
    localCount: number;
    /** OSS存储类型配置数量 */
    ossCount: number;
    /** 默认配置数量 */
    defaultCount: number;
  }

  // 兼容旧版本的类型别名
  export type Post = Create;
}
