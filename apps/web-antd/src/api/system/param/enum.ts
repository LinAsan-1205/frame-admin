import { Enum } from 'enum-plus';

/**
 * 系统参数是否为系统内置
 */
export const IsSystem = Enum({
  /** 是：系统内置参数 */
  Yes: { value: 1, label: '是' },
  /** 否：非系统内置参数 */
  No: { value: 0, label: '否' },
} as const);
