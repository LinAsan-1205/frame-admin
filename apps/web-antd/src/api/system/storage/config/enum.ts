import { Enum } from 'enum-plus';

/**
 * 存储配置类型枚举
 */
export const StorageConfigType = Enum({
  /** 本地存储：将文件存储在服务器本地文件系统中 */
  Local: { value: 1, label: '本地存储', color: 'success' },
  /** 对象存储：将文件存储在云服务商的对象存储服务中 */
  OSS: { value: 2, label: '对象存储', color: 'pink' },
} as const);

/**
 * 存储配置状态枚举
 */
export const StorageConfigStatus = Enum({
  /** 启用状态：存储配置正常可用 */
  Enabled: { value: 'Enabled', label: '启用', color: 'success' },
  /** 禁用状态：存储配置暂时不可用 */
  Disabled: { value: 'Disabled', label: '禁用', color: 'error' },
} as const);

/**
 * 存储配置是否默认枚举
 */
export const StorageConfigIsDefault = Enum({
  /** 是：该配置为系统默认存储配置 */
  Yes: { value: 'Yes', label: '是' },
  /** 否：该配置不是系统默认存储配置 */
  No: { value: 'No', label: '否' },
} as const);
