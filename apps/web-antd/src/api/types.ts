export declare namespace Api {
  export interface PageCursor {
    page?: number;
    pageSize?: number;
  }
  export interface PaginationResult<T> {
    /** 分页数据列表 */
    items: T[];
    /** 分页元数据 */
    meta: {
      /** 当前页码 */
      currentPage: number;
      /** 当前页数据条数 */
      itemCount: number;
      /** 每页数据条数 */
      pageSize: number;
      /** 总数据条数 */
      totalItems: number;
      /** 总页数 */
      totalPages: number;
    };
  }

  export interface StatusDisplay {
    label: string;
    type: string;
    value: string;
  }

  export interface Response<T = any> {
    /** 是否成功 */
    success: boolean;
    /** 响应数据 */
    data: T;
    /** 错误信息 */
    message?: string;
    /** 错误代码 */
    code?: number;
  }
}
