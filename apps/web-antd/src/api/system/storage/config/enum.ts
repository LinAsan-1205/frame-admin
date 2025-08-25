import { Enum } from 'enum-plus';

/**
 * 存储配置类型枚举
 */
export const StorageConfigType = Enum({
  Local: { value: 'Local', label: '本地存储', color: 'success' },
  OSS: { value: 'OSS', label: '对象存储', color: 'pink' },
} as const);

/**
 * 存储配置状态枚举
 */
export const StorageConfigStatus = Enum({
  Enabled: { value: 'Enabled', label: '启用', color: 'success' },
  Disabled: { value: 'Disabled', label: '禁用', color: 'error' },
} as const);

/**
 * 存储配置是否默认枚举
 */
export const StorageConfigIsDefault = Enum({
  Yes: { value: 'Yes', label: '是' },
  No: { value: 'No', label: '否' },
} as const);
