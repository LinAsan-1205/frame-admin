/**
 * 该文件可自行根据业务逻辑进行调整
 */
import type {
  AxiosResponseHeaders,
  MakeErrorMessageFn,
  RequestClientOptions,
  ResponseInterceptorConfig,
} from '@vben/request';

import { useAppConfig } from '@vben/hooks';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { defaultResponseInterceptor, RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';
import { cloneDeep } from '@vben/utils';

import { message } from 'ant-design-vue';
import axios from 'axios';
import JSONBigInt from 'json-bigint';

import { useAuthStore } from '#/store';

import { refreshToken as refreshTokenApi } from './system/session';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    baseURL,
    transformResponse: (data: any, header: AxiosResponseHeaders) => {
      // storeAsString指示将BigInt存储为字符串，设为false则会存储为内置的BigInt类型
      return header.getContentType()?.toString().includes('application/json')
        ? cloneDeep(
            JSONBigInt({ storeAsString: true, strict: true }).parse(data),
          )
        : data;
    },
  });

  const authenticateResponseInterceptor = ({
    client,
    doReAuthenticate,
    doRefreshToken,
    enableRefreshToken,
    formatToken,
  }: {
    client: RequestClient;
    doReAuthenticate: () => Promise<void>;
    doRefreshToken: () => Promise<string>;
    enableRefreshToken: boolean;
    formatToken: (token: string) => null | string;
  }): ResponseInterceptorConfig => {
    return {
      rejected: async (error) => {
        const { config, response } = error;
        // 如果不是 401 错误，直接抛出异常
        if (response?.status !== 401 && response?.data?.code !== 201) {
          throw error;
        }
        // 判断是否启用了 refreshToken 功能
        // 如果没有启用或者已经是重试请求了，直接跳转到重新登录
        if (!enableRefreshToken || config.__isRetryRequest) {
          await doReAuthenticate();
          // 标记错误已被处理，避免在后续拦截器中重复显示错误提示
          error.__isAuthHandled = true;
          throw error;
        }
        // 如果正在刷新 token，则将请求加入队列，等待刷新完成
        if (client.isRefreshing) {
          return new Promise((resolve) => {
            client.refreshTokenQueue.push((newToken: string) => {
              config.headers.Authorization = formatToken(newToken);
              resolve(client.request(config.url, { ...config }));
            });
          });
        }

        // 标记开始刷新 token
        client.isRefreshing = true;
        // 标记当前请求为重试请求，避免无限循环
        config.__isRetryRequest = true;

        try {
          const newToken = await doRefreshToken();

          // 处理队列中的请求
          client.refreshTokenQueue.forEach((callback) => callback(newToken));
          // 清空队列
          client.refreshTokenQueue = [];

          return client.request(error.config.url, { ...error.config });
        } catch (refreshError: any) {
          console.error('Refresh token failed:', refreshError);
          // 如果刷新 token 失败，处理错误（如强制登出或跳转登录页面）
          client.refreshTokenQueue.forEach((callback) => callback(''));
          client.refreshTokenQueue = [];
          await doReAuthenticate();

          // 标记错误已被处理，避免在后续拦截器中重复显示错误提示
          refreshError.__isAuthHandled = true;
          throw refreshError;
        } finally {
          client.isRefreshing = false;
        }
      },
    };
  };

  const errorMessageResponseInterceptor = (
    makeErrorMessage?: MakeErrorMessageFn,
  ): ResponseInterceptorConfig => {
    return {
      rejected: (error: any) => {
        if (axios.isCancel(error)) {
          return Promise.reject(error);
        }

        // 如果错误已经在认证拦截器中处理过，避免重复提示
        if (error.__isAuthHandled) {
          return Promise.reject(error);
        }

        const err: string = error?.toString?.() ?? '';
        let errMsg = '';
        if (err?.includes('Network Error')) {
          errMsg = $t('ui.fallback.http.networkError');
        } else if (error?.message?.includes?.('timeout')) {
          errMsg = $t('ui.fallback.http.requestTimeout');
        }
        if (errMsg) {
          makeErrorMessage?.(errMsg, error);
          return Promise.reject(error);
        }

        let errorMessage = '';
        let status = error?.response?.status || error?.code;
        if (status === 2001 || status === 4010) {
          status = 401;
        }

        switch (status) {
          case 400: {
            errorMessage = $t('ui.fallback.http.badRequest');
            break;
          }
          case 401: {
            errorMessage = $t('ui.fallback.http.unauthorized');
            break;
          }
          case 403: {
            errorMessage = $t('ui.fallback.http.forbidden');
            break;
          }
          case 404: {
            errorMessage = $t('ui.fallback.http.notFound');
            break;
          }
          case 408: {
            errorMessage = $t('ui.fallback.http.requestTimeout');
            break;
          }
          default: {
            errorMessage = $t('ui.fallback.http.internalServerError');
          }
        }
        makeErrorMessage?.(errorMessage, error);
        return Promise.reject(error);
      },
    };
  };

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');
    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi(accessStore.refreshToken);
    const newToken = resp?.accessToken;
    accessStore.setAccessToken(newToken);
    return newToken;
  }

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const accessStore = useAccessStore();

      config.headers.Authorization = formatToken(accessStore.accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;
      return config;
    },
  });

  // 处理返回的响应数据格式
  client.addResponseInterceptor(
    defaultResponseInterceptor({
      codeField: 'code',
      dataField: 'data',
      successCode: 10_000,
    }),
  );

  // token过期的处理
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
      formatToken,
    }),
  );

  // 通用的错误处理,如果没有进入上面的错误处理逻辑，就会进入这里
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error) => {
      const responseData = error?.response?.data ?? {};
      const errorMessage =
        responseData?.error ?? responseData?.message ?? msg ?? '';
      const errorCode = responseData?.code ?? error.code;

      switch (errorCode) {
        case 401:
        case 2001: {
          message.error(errorMessage);
          doReAuthenticate();
          break;
        }
        default: {
          message.error(errorMessage);
          break;
        }
      }
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});

export const baseRequestClient = new RequestClient({ baseURL: apiURL });
