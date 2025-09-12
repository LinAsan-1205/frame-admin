import type { DeviceType, PlatformType, SessionStatus } from './enum';

export declare namespace Session {
  export type SessionStatusType = typeof SessionStatus.valueType;
  export type PlatformTypeType = typeof PlatformType.valueType;
  export type DeviceTypeType = typeof DeviceType.valueType;

  // 会话视图信息
  export interface View {
    id: number;
    userId: number;
    deviceId: string;
    deviceName: string;
    deviceType: DeviceTypeType;
    platform: PlatformTypeType;
    ipAddress: string;
    loginLocation?: string;
    lastActiveAt: string;
    loginAt: string;
    isActive: boolean;
    status: SessionStatusType;
    refreshToken?: string;
    refreshTokenExpiresAt?: string;
    userAgent?: string;
    logoutAt?: string;
    createdAt: string;
    updatedAt: string;
  }

  // 查询条件
  export interface Condition {
    userId?: number;
    deviceId?: string;
    platform?: PlatformTypeType;
    deviceType?: DeviceTypeType;
    isActive?: boolean;
    startTime?: string;
    endTime?: string;
  }

  // 设备信息
  export interface DeviceInfo {
    deviceId: string;
    deviceName: string;
    deviceType: DeviceTypeType;
    platform: PlatformTypeType;
    ipAddress: string;
    loginLocation?: string;
    lastActiveAt: string;
    loginAt: string;
    isActive: boolean;
    status: SessionStatusType;
  }

  // 用户设备列表
  export interface UserDeviceList {
    devices: DeviceInfo[];
    onlineCount: number;
    totalCount: number;
  }

  // 会话统计信息
  export interface SessionStatistics {
    totalSessions: number;
    activeSessions: number;
    todayLogins: number;
    onlineUsers: number;
    deviceTypeStats: { count: number; type: string }[];
    platformStats: { count: number; platform: string }[];
  }

  // 查询用户会话参数
  export interface QueryUserSessionParams {
    userId: number;
    isActive?: boolean;
  }

  // 强制下线参数
  export interface ForceLogoutParams {
    userId: number;
    deviceId?: string;
  }

  // 刷新令牌参数
  export interface RefreshTokenParams {
    refreshToken: string;
  }

  // 撤销会话参数
  export interface RevokeSessionParams {
    accessToken: string;
    refreshToken?: string;
  }

  // 令牌响应
  export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
  }

  // 更新会话状态参数
  export interface UpdateSessionStatusParams {
    sessionId: number;
    status?: string;
    isActive?: boolean;
  }
}
