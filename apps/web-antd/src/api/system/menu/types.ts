import type { Recordable } from '@vben/types';

import { BadgeType, BadgeVariant, MenuType } from './enum';

export namespace Menu {
  /** 徽标颜色集合 */
  export const BadgeVariants = BadgeVariant.items.map((item) => item.value);
  /** 徽标类型集合 */
  export const BadgeTypes = BadgeType.items.map((item) => item.value);
  /** 菜单类型集合 */
  export const MenuTypes = MenuType.items.map((item) => item.value);

  export interface Meta {
    /** 激活时显示的图标 */
    activeIcon?: string;
    /** 作为路由时，需要激活的菜单的Path */
    activePath?: string;
    /** 固定在标签栏 */
    affixTab?: boolean;
    /** 在标签栏固定的顺序 */
    affixTabOrder?: number;
    /** 徽标内容(当徽标类型为normal时有效) */
    badge?: string;
    /** 徽标类型 */
    badgeType?: (typeof BadgeTypes)[number];
    /** 徽标颜色 */
    badgeVariants?: (typeof BadgeVariants)[number];
    /** 在菜单中隐藏下级 */
    hideChildrenInMenu?: boolean;
    /** 在面包屑中隐藏 */
    hideInBreadcrumb?: boolean;
    /** 在菜单中隐藏 */
    hideInMenu?: boolean;
    /** 在标签栏中隐藏 */
    hideInTab?: boolean;
    /** 菜单图标 */
    icon?: string;
    /** 内嵌Iframe的URL */
    iframeSrc?: string;
    /** 是否缓存页面 */
    keepAlive?: boolean;
    /** 外链页面的URL */
    link?: string;
    /** 同一个路由最大打开的标签数 */
    maxNumOfOpenTab?: number;
    /** 无需基础布局 */
    noBasicLayout?: boolean;
    /** 是否在新窗口打开 */
    openInNewWindow?: boolean;
    /** 菜单排序 */
    order?: number;
    /** 额外的路由参数 */
    query?: Recordable<any>;
    /** 菜单标题 */
    title?: string;
  }
  /** 系统菜单 */
  export interface View {
    [key: string]: any;
    /** 后端权限标识 */
    authCode: string;
    /** 组件 */
    component?: string;
    /** 菜单ID */
    id: string;
    /** 菜单元数据 */
    meta?: Meta;
    /** 菜单名称 */
    name: string;
    /** 路由路径 */
    path: string;
    /** 父级ID */
    pid: string;
    /** 重定向 */
    redirect?: string;
    /** 菜单类型 */
    type: (typeof MenuTypes)[number];
    /** 创建时间 */
    createTime: string;
  }

  export interface TreeView extends View {
    children?: TreeView[];
  }

  export type OriginView = Meta & Omit<View, 'meta'>;

  export interface Condition {
    /** 菜单名称 */
    title?: string;
    /** 路由路径 */
    path?: string;
  }
}
