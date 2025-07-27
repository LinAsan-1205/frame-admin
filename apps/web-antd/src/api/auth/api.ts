import type { Auth } from './types';

import { baseRequestClient, requestClient } from '#/api/request';

/**
 * 登录
 */
export async function accountLogin(data: Auth.LoginParams) {
  return requestClient.post<Auth.LoginResult>('/auth/account-login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<Auth.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function accountLogout() {
  return baseRequestClient.post('/auth/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
