import type { CaptchaApi } from './types';

import { requestClient } from '#/api/request';

/**
 * 生成基础验证码
 * @returns
 */
export async function generateFoundationCaptcha() {
  return requestClient.get<CaptchaApi.FoundationResponse>(
    '/captcha/foundation',
  );
}
