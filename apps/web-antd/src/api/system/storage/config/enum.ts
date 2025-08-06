import { Enum } from 'enum-plus';

/**
 * 存储配置类型枚举
 */
export const StorageConfigType = Enum({
  Local: { value: 1, label: '本地存储', color: 'success' },
  OSS: { value: 2, label: '对象存储', color: 'pink' },
} as const);

/**
 * 存储配置状态枚举
 */
export const StorageConfigStatus = Enum({
  Enabled: { value: 0, label: '启用', color: 'success' },
  Disabled: { value: 1, label: '禁用', color: 'error' },
} as const);

/**
 * 存储配置是否默认枚举
 */
export const StorageConfigIsDefault = Enum({
  Yes: { value: 0, label: '是' },
  No: { value: 1, label: '否' },
} as const);
