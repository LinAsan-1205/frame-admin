import { Enum } from 'enum-plus';

/**
 * 套餐状态
 */
export const PackageStatus = Enum({
  Normal: { value: '0', label: '正常', color: 'success' },
  Disabled: { value: '1', label: '停用', color: 'error' },
} as const);