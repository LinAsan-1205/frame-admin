import type { PackageStatus } from './enum';

export namespace Package {
  export type PackageStatusType = typeof PackageStatus.valueType;
  export type StatusType = PackageStatusType;

  /** 套餐视图 */
  export interface View {
    id: number;
    packageName: string;
    price: number;
    originalPrice: number;
    description?: string;
    status: PackageStatusType;
    statusLabel: string;
    menus: Array<{
      id: number;
      title: string;
      name: string;
      type: string;
    }>;
    tenantCount: number;
    remark?: string;
    createTime: string;
    updateTime: string;
  }

  /** 套餐编辑 */
  export interface Edit {
    packageName: string;
    price: number;
    originalPrice: number;
    description?: string;
    menuIds: number[];
    remark?: string;
  }

  /** 查询条件 */
  export interface QueryParams {
    packageName?: string;
    status?: PackageStatusType;
  }

  /** 设置状态 */
  export interface StatusUpdate {
    packageId: number;
    status: PackageStatusType;
  }

  /** 批量删除 */
  export interface BatchDelete {
    packageIds: number[];
  }
}