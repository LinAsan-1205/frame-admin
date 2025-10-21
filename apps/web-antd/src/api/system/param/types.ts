import type { IsSystem as ParamIsSystem } from './enum';

export namespace Param {
  /** 是否系统内置 类型 */
  export type IsSystem = typeof ParamIsSystem.valueType;
  /** 系统参数视图 */
  export interface View {
    id: number;
    paramName: string;
    paramKey: string;
    paramValue?: null | string;
    isSystem?: IsSystem;
    remark?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 查询条件 */
  export interface Condition {
    paramName?: string;
    paramKey?: string;
    createFormDate?: string;
    createToDate?: string;
  }

  /** 新增/更新请求体 */
  export interface Post {
    paramName: string;
    paramKey: string;
    paramValue?: null | string;
    /** 是否系统内置：Yes(1)/No(0) */
    isSystem?: IsSystem;
    remark?: string;
  }

  /** 批量删除 */
  export interface BatchDelete {
    paramIds: number[];
  }
}
