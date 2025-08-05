import { Enum } from 'enum-plus';
/**
 * 部门状态
 */
export const Status = Enum({
  Normal: { value: '0', label: '正常', color: 'success' },
  Stop: { value: '1', label: '停用', color: 'error' },
} as const);
