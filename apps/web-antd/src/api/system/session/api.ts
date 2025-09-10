import type { SessionApi } from './types';

import { requestClient } from '#/api/request';
/**
 * 刷新accessToken
 */
export async function refreshTokenApi(refreshToken: null | string) {
  return requestClient.post<SessionApi.RefreshTokenResult>(
    '/system/session/refresh-token',
    {
      refreshToken,
    },
  );
}
