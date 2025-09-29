import type { TenantStatus, SubscriptionType } from './enum';

export namespace Tenant {
  export type TenantStatusType = typeof TenantStatus.valueType;
  export type SubscriptionTypeValue = typeof SubscriptionType.valueType;
  export type StatusType = TenantStatusType;

  /** 租户视图 */
  export interface View {
    id: number;
    tenantName: string;
    domain?: string;
    phone: string;
    email: string;
    subscriptionType: SubscriptionTypeValue;
    subscriptionTypeLabel: string;
    fixedPeriodDays?: number;
    expireTime?: string;
    status: TenantStatusType;
    statusLabel: string;
    packageId?: number;
    package?: {
      id: number;
      packageName: string;
      price: number;
      originalPrice: number;
    };
    remark?: string;
    createTime: string;
    updateTime: string;
  }

  /** 租户编辑 */
  export interface Edit {
    tenantName: string;
    domain?: string;
    phone: string;
    email: string;
    password?: string;
    subscriptionType: SubscriptionTypeValue;
    fixedPeriodDays?: number;
    expireTime?: string;
    packageId?: number;
    remark?: string;
  }

  /** 查询条件 */
  export interface QueryParams {
    tenantName?: string;
    domain?: string;
    phone?: string;
    email?: string;
    status?: TenantStatusType;
    subscriptionType?: SubscriptionTypeValue;
  }

  /** 设置状态 */
  export interface StatusUpdate {
    tenantId: number;
    status: TenantStatusType;
  }

  /** 批量删除 */
  export interface BatchDelete {
    tenantIds: number[];
  }
}