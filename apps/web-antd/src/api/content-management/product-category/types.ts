/**
 * 产品分类 API 类型定义
 */
export namespace ProductCategory {
  /** 查询条件 */
  export interface Condition {
    /** 分类名称（模糊查询） */
    name?: string;
  }

  /** 视图对象 */
  export interface View {
    /** 分类ID */
    id: number;
    /** 分类名称 */
    name: string;
    /** 父分类ID */
    parentId?: number;
    /** 排序号 */
    sort: number;
    /** 备注 */
    remark?: string;
    /** 子分类列表（树形结构） */
    children?: View[];
  }

  /** 创建对象 */
  export interface Create {
    /** 分类名称 */
    name: string;
    /** 父分类ID */
    parentId?: number;
    /** 排序号 */
    sort?: number;
    /** 备注 */
    remark?: string;
  }

  /** 更新对象 */
  export interface Update extends Partial<Create> {}

  /** 批量删除 */
  export interface BatchDelete {
    /** 分类ID列表 */
    categoryIds: number[];
  }
}
