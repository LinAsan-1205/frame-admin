import { Enum } from 'enum-plus';

/**
 * 产品内容相关枚举
 */

/**
 * 产品内容状态枚举
 */
export const ProductContentStatus = Enum({
  Show: { value: '1', label: '正常显示', color: 'success' },
  Hide: { value: '0', label: '隐藏', color: 'default' },
} as const);

/**
 * 产品内容类型枚举
 */
export const ProductContentType = Enum({
  Article: { value: 'article', label: '文章', color: 'processing' },
  Banner: { value: 'banner', label: '轮播图', color: 'warning' },
  Default: { value: 'default', label: '普通内容', color: 'default' },
} as const);
