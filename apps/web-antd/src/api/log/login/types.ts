import { LoginStatus } from './enum';

export declare namespace LoginLog {
  export type StatusType = typeof LoginStatus.valueType;
  export interface View {
    id: number;
    username: string;
    ip: string;
    browser: string;
    os: string;
    status: StatusType;
    loginTime: number;
  }

  export interface Condition {
    username?: string;
    ip?: string;
    status?: StatusType;
  }
}
