import type { Auth } from './types';

import { requestClient } from '#/api/request';

/**
 * 登录
 */
export async function accountLogin(data: Auth.LoginParams) {
  const { username: userName, ...params } = data;
  return requestClient.post<Auth.LoginResult>('/auth/account-login', {
    ...params,
    userName,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return requestClient.post<Auth.RefreshTokenResult>('/auth/refresh-token');
}

/**
 * 退出登录
 */
export async function accountLogout() {
  return requestClient.post('/auth/account-logout');
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
