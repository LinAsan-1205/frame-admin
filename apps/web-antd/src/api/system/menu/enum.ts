import { Enum } from 'enum-plus';
/**
 * 菜单状态
 */
export const Status = Enum({
  Normal: { value: '0', label: '正常', type: 'success' },
  Stop: { value: '1', label: '停用', type: 'error' },
} as const);

/**
 * 菜单类型
 */
export const MenuType = Enum({
  Catalog: { value: 'catalog', label: '目录', color: 'processing' },
  Menu: { value: 'menu', label: '菜单', color: 'default' },
  Button: { value: 'button', label: '按钮', color: 'error' },
  Embedded: { value: 'embedded', label: '内嵌', color: 'success' },
  Link: { value: 'link', label: '外链', color: 'warning' },
} as const);

/**
 * 徽标颜色集合
 */
export const BadgeVariant = Enum({
  Default: { value: 'default', label: '默认' },
  Primary: { value: 'primary', label: '主要' },
  Success: { value: 'success', label: '成功' },
  Info: { value: 'info', label: '信息' },
  Warning: { value: 'warning', label: '警告' },
  Danger: { value: 'danger', label: '危险' },
} as const);

/**
 * 徽标类型
 */
export const BadgeType = Enum({
  Dot: { value: 'dot', label: '点' },
  Text: { value: 'normal', label: '文字' },
} as const);
