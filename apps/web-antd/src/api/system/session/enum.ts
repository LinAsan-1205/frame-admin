import { Enum } from 'enum-plus';

/**
 * 会话状态枚举
 */
export const SessionStatus = Enum({
  Active: { value: 'active', label: '活跃', color: 'success' },
  Inactive: { value: 'inactive', label: '非活跃', color: 'default' },
  Expired: { value: 'expired', label: '过期', color: 'warning' },
  Revoked: { value: 'revoked', label: '已撤销', color: 'error' },
  LoggedOut: { value: 'logged_out', label: '已下线', color: 'default' },
} as const);

/**
 * 平台类型枚举
 */
export const PlatformType = Enum({
  Admin: { value: 'admin', label: '管理后台', color: 'success' },
  App: { value: 'app', label: '移动应用', color: 'processing' },
  Web: { value: 'web', label: 'Web应用', color: 'warning' },
  Miniapp: { value: 'miniapp', label: '小程序', color: 'purple' },
} as const);

/**
 * 设备类型枚举
 */
export const DeviceType = Enum({
  Web: { value: 'web', label: '网页端', color: 'blue' },
  Mobile: { value: 'mobile', label: '移动端', color: 'success' },
  Desktop: { value: 'desktop', label: '桌面应用', color: 'cyan' },
  Tablet: { value: 'tablet', label: '平板', color: 'geekblue' },
} as const);

/**
 * 会话活跃状态枚举
 */
export const ActiveStatus = Enum({
  Online: { value: true, label: '在线', color: 'success' },
  Offline: { value: false, label: '离线', color: 'default' },
} as const);
