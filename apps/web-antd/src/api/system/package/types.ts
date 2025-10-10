import type { Menu } from '../menu';
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
    menus: Menu.View[];
    tenantCount: number;
    remark?: string;
    createTime: string;
    updateTime: string;
  }

  /** 套餐编辑 */
  export interface Post {
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
