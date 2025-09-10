export declare namespace SessionApi {
  export interface RefreshTokenResult {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
    tokenType: string;
  }
}
