import { Enum } from 'enum-plus';

/**
 * 登录状态枚举
 */
export const LoginStatus = Enum({
  Success: { value: '0', label: '登录成功', color: 'success' },
  Failure: { value: '1', label: '登录失败', color: 'error' },
} as const);
