import { Enum } from 'enum-plus';

/**
 * 用户类型
 */
export const UserType = Enum({
  Admin: { value: '02', label: '管理员', color: 'default' },
  System: { value: '00', label: '系统用户', color: 'processing' },
  Simple: { value: '01', label: '普通用户', color: 'success' },
} as const);

/**
 * 用户性别
 */
export const Sex = Enum({
  Male: { value: '0', label: '男', color: 'processing' },
  Female: { value: '1', label: '女', color: 'info' },
  Unknown: { value: '2', label: '未知', color: 'warning' },
} as const);

/**
 * 用户状态
 */
export const Status = Enum({
  Normal: { value: '0', label: '启用', color: 'success' },
  Stop: { value: '1', label: '禁用', color: 'error' },
} as const);
