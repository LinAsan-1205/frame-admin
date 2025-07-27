export namespace Auth {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    userName?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}
