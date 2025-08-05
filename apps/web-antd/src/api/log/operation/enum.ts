import { Enum } from 'enum-plus';

/**
 * 操作类型枚举
 */
export const OperationType = Enum({
  CREATE: { value: 'CREATE', label: '新增', color: 'success' },
  UPDATE: { value: 'UPDATE', label: '修改', color: 'warning' },
  DELETE: { value: 'DELETE', label: '删除', color: 'error' },
  QUERY: { value: 'QUERY', label: '查询', color: 'processing' },
  LOGIN: { value: 'LOGIN', label: '登录', color: 'green' },
  LOGOUT: { value: 'LOGOUT', label: '登出', color: 'cyan' },
  EXPORT: { value: 'EXPORT', label: '导出', color: 'blue' },
  IMPORT: { value: 'IMPORT', label: '导入', color: 'purple' },
  OTHER: { value: 'OTHER', label: '其他', color: 'pink' },
} as const);

/**
 * 操作状态枚举
 */
export const OperationStatus = Enum({
  SUCCESS: { value: '0', label: '成功', color: 'success' },
  FAILURE: { value: '1', label: '失败', color: 'error' },
} as const);
