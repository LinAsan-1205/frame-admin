export namespace Param {
  /** 系统参数视图 */
  export interface View {
    id: number;
    paramName: string;
    paramKey: string;
    paramValue?: null | string;
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
    remark?: string;
  }

  /** 批量删除 */
  export interface BatchDelete {
    paramIds: number[];
  }
}
