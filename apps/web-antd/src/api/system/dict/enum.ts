import { Enum } from 'enum-plus';

export const Status = Enum({
  Normal: { value: '0', label: '启用', color: 'success' },
  Stop: { value: '1', label: '禁用', color: 'error' },
} as const);
