import { Enum } from 'enum-plus';

/**
 * 文件分类状态枚举
 */
export const FileCategoryStatusEnum = Enum({
  /** 正常 */
  Normal: { value: 0, label: '正常' },
  /** 禁用 */
  Disabled: { value: 1, label: '禁用' },
} as const);

/**
 * 文件分类类型枚举
 */
export const FileCategoryTypeEnum = Enum({
  /** 系统分类 */
  System: { value: 'system', label: '系统分类' },
  /** 自定义分类 */
  Custom: { value: 'custom', label: '自定义分类' },
} as const);

/**
 * 是否允许子分类枚举
 */
export const AllowSubCategoryEnum = Enum({
  /** 不允许 */
  NotAllowed: { value: 0, label: '不允许' },
  /** 允许 */
  Allowed: { value: 1, label: '允许' },
} as const);
