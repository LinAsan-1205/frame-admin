import { Enum } from 'enum-plus';

/**
 * 用户类型
 */
export const UserType = Enum({
  System: { value: '00', label: '系统用户', type: 'processing' },
  Simple: { value: '01', label: '普通用户', type: 'success' },
  Admin: { value: '02', label: '管理员', type: 'success' },
} as const);

/**
 * 用户性别
 */
export const Sex = Enum({
  Male: { value: '0', label: '男', type: 'processing' },
  Female: { value: '1', label: '女', type: 'info' },
  Unknown: { value: '2', label: '未知', type: 'warning' },
} as const);

/**
 * 用户状态
 */
export const Status = Enum({
  Normal: { value: '0', label: '启用', type: 'success' },
  Stop: { value: '1', label: '禁用', type: 'error' },
} as const);
