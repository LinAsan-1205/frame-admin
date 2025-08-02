import type { Api } from '#/api/types';

export declare namespace LoginLog {
  export interface View {
    id: number;
    username: string;
    ip: string;
    browser: string;
    os: string;
    status: string;
    loginTime: number;
    statusDisplay: Api.StatusDisplay;
  }

  export interface Condition {
    username?: string;
    ip?: string;
  }
}
