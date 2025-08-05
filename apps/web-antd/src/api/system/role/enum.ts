import { Enum } from 'enum-plus';
/**
 * 角色状态
 */
export const Status = Enum({
  Normal: { value: '0', label: '正常', type: 'success' },
  Stop: { value: '1', label: '停用', type: 'error' },
} as const);
