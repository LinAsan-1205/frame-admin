import type { CaptchaApi } from './types';

import { requestClient } from '#/api/request';

/**
 * 生成基础验证码
 */
export async function generateFoundationCaptcha(
  condition?: CaptchaApi.FoundationCondition,
) {
  return requestClient.get<CaptchaApi.FoundationResponse>(
    '/captcha/foundation',
    {
      params: condition,
    },
  );
}
