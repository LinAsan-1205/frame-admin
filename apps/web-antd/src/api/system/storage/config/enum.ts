import { Enum } from 'enum-plus';

/**
 * 存储配置类型枚举
 */
export const StorageConfigType = Enum({
  Local: { value: 1, label: '本地存储' },
  OSS: { value: 2, label: '对象存储' },
} as const);

/**
 * 存储配置状态枚举
 */
export const StorageConfigStatus = Enum({
  Enabled: { value: 1, label: '启用' },
  Disabled: { value: 0, label: '禁用' },
} as const);
