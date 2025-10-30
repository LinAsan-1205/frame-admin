import type { ProductContentStatus, ProductContentType } from './enum';

/**
 * 产品内容 API 类型定义
 */
export namespace ProductContent {
  /** 查询条件 */
  export interface Condition {
    /** 标题（模糊查询） */
    title?: string;
    /** 分类ID */
    categoryId?: number;
    /** 内容类型 */
    type?: ProductContentType;
    /** 状态 */
    status?: ProductContentStatus;
  }

  /** 视图对象 */
  export interface View {
    /** 内容ID */
    id: number;
    /** 产品标题 */
    title: string;
    /** 分类ID */
    categoryId: number;
    /** 分类信息 */
    category?: {
      id: number;
      name: string;
    };
    /** 产品主图 */
    coverImage?: string;
    /** 摘要 */
    summary?: string;
    /** 内容正文 */
    content?: string;
    /** 内容类型 */
    type?: ProductContentType;
    /** 排序号 */
    sort: number;
    /** 发布时间 */
    publishedAt?: string;
    /** 状态 */
    status: ProductContentStatus;
  }

  /** 创建对象 */
  export interface Create {
    /** 产品标题 */
    title: string;
    /** 分类ID */
    categoryId: number;
    /** 产品主图 */
    coverImage?: string;
    /** 摘要 */
    summary?: string;
    /** 内容正文 */
    content?: string;
    /** 内容类型 */
    type?: ProductContentType;
    /** 排序号 */
    sort?: number;
    /** 发布时间 */
    publishedAt?: string;
    /** 状态 */
    status?: ProductContentStatus;
  }

  /** 更新对象 */
  export interface Update extends Partial<Create> {}

  /** 批量删除 */
  export interface BatchDelete {
    /** 内容ID列表 */
    contentIds: number[];
  }
}
