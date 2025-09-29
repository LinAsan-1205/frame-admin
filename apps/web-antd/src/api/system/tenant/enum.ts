import { Enum } from 'enum-plus';

/**
 * 租户状态
 */
export const TenantStatus = Enum({
  Normal: { value: '0', label: '正常', color: 'success' },
  Disabled: { value: '1', label: '停用', color: 'error' },
  Expired: { value: '2', label: '已过期', color: 'warning' },
} as const);

/**
 * 订阅周期类型
 */
export const SubscriptionType = Enum({
  OneYear: { value: '1', label: '一年', color: 'blue' },
  FixedPeriod: { value: '2', label: '固定时长', color: 'orange' },
  Permanent: { value: '3', label: '永久', color: 'green' },
} as const);