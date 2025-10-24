import type { Session } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取会话分页列表
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function querySessionPage(
  pageCursor: Api.PageCursor = {},
  condition: Session.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Session.View>>(
    '/system/session/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

/**
 * 刷新访问令牌
 */
function refreshToken(refreshToken: null | string) {
  return requestClient.post<Session.TokenResponse>(
    '/system/session/refresh-token',
    {
      refreshToken,
    },
  );
}

/**
 * 撤销当前会话
 */
function revokeSession(data: Session.RevokeSessionParams) {
  return requestClient.post('/system/session/revoke', data);
}

/**
 * 获取用户设备列表
 */
function getUserDevices(params: Session.QueryUserSessionParams) {
  return requestClient.get<Session.UserDeviceList>(
    '/system/session/user-devices',
    {
      params,
    },
  );
}

/**
 * 获取会话统计信息
 */
function getSessionStatistics() {
  return requestClient.get<Session.SessionStatistics>(
    '/system/session/statistics',
  );
}

/**
 * 强制用户下线
 */
function forceLogout(data: Session.ForceLogoutParams) {
  return requestClient.post('/system/session/force-logout', data);
}

/**
 * 删除会话
 */
function deleteSessionById(sessionId: number) {
  return requestClient.post<boolean>(`/system/session/delete/${sessionId}`);
}

/**
 * 批量删除会话
 */
function batchDeleteSessions(sessionIds: number[]) {
  return requestClient.post<boolean>('/system/session/batch-delete', {
    sessionIds,
  });
}

/**
 * 更新会话状态
 */
function updateSessionStatus(data: Session.UpdateSessionStatusParams) {
  return requestClient.post<boolean>('/system/session/update-status', data);
}

/**
 * 获取在线用户列表
 */
function getOnlineUsers() {
  return requestClient.get<Session.DeviceInfo[]>(
    '/system/session/online-users',
  );
}

/**
 * 清理过期会话
 */
function cleanupExpiredSessions() {
  return requestClient.post<boolean>('/system/session/cleanup');
}

/**
 * 获取登录策略配置
 */
function getLoginStrategyConfig() {
  return requestClient.get<Session.LoginStrategyConfig>(
    '/system/session/strategy/config',
  );
}

/**
 * 更新登录策略配置
 */
function updateLoginStrategyConfig(
  data: Session.UpdateLoginStrategyConfigParams,
) {
  return requestClient.put<boolean>('/system/session/strategy/config', data);
}

export {
  batchDeleteSessions,
  cleanupExpiredSessions,
  deleteSessionById,
  forceLogout,
  getLoginStrategyConfig,
  getOnlineUsers,
  getSessionStatistics,
  getUserDevices,
  querySessionPage,
  refreshToken,
  revokeSession,
  updateLoginStrategyConfig,
  updateSessionStatus,
};
