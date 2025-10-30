/**
 * 产品内容相关枚举
 */

/**
 * 产品内容状态枚举
 */
export enum ProductContentStatus {
  /** 隐藏 */
  Hide = '0',
  /** 正常显示 */
  Show = '1',
}

/**
 * 产品内容状态标签映射
 */
export const ProductContentStatusLabels: Record<ProductContentStatus, string> =
  {
    [ProductContentStatus.Show]: '正常显示',
    [ProductContentStatus.Hide]: '隐藏',
  };

/**
 * 产品内容类型枚举
 */
export enum ProductContentType {
  /** 文章 */
  Article = 'article',
  /** 轮播图 */
  Banner = 'banner',
  /** 普通内容 */
  Default = 'default',
}

/**
 * 产品内容类型标签映射
 */
export const ProductContentTypeLabels: Record<ProductContentType, string> = {
  [ProductContentType.Default]: '普通内容',
  [ProductContentType.Article]: '文章',
  [ProductContentType.Banner]: '轮播图',
};
