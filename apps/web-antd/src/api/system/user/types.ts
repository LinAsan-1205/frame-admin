import type { Api } from '#/api/types';

export declare namespace User {
  export interface View {
    id: number;
    userName: string;
    nickName: string;
    email: string;
    phone: string;
    avatar: string;
    sex: string;
    status: string;
    loginIp: string;
    loginDate: string;
    remark?: string;
    deptId?: number;
    userTypeDisplay: Api.StatusDisplay;
  }
  export interface Condition {
    userName?: string;
    nickName?: string;
    email?: string;
    phone?: string;
    sex?: string;
    status?: string;
    deptId?: number;
  }
  export interface profile {
    id: number;
    userName: string;
    nickName: string;
    avatar: string;
    roles: string[];
  }
}
