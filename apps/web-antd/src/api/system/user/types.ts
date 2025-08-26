import type { Role } from '../role';

import type { Api } from '#/api/types';

import { UserType } from './enum';

export declare namespace User {
  export type UserType = typeof UserType.valueType;
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
    userType: UserType;
    userTypeDisplay: Api.StatusDisplay;
    roles: Pick<Role.View, 'id' | 'name'>[];
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
    homePath?: string;
  }

  export interface Post {
    userName: string;
    nickName: string;
    password: string;
    email?: string;
    phone?: string;
    avatar?: string;
    sex?: string;
    status: string;
    remark?: string;
    deptId?: number;
    userType?: UserType;
  }
}
