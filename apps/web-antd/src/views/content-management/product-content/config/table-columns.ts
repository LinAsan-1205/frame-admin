import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductContent } from '#/api/content-management/product-content';

import {
  ProductContentStatus,
  ProductContentType,
} from '#/api/content-management/product-content';
import { $t } from '#/locales';

/**
 * 产品内容表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = ProductContent.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 60,
    },
    {
      type: 'seq',
      width: 60,
    },
    {
      field: 'title',
      minWidth: 200,
      title: $t('content-management.content.title'),
    },
    {
      field: 'category.name',
      title: $t('content-management.content.categoryId'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      width: 150,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: ProductContentType.toOriginItems(),
      },
      field: 'type',
      title: $t('content-management.content.type'),
      width: 120,
    },
    {
      cellRender: {
        name: 'CellImage',
      },
      field: 'coverImage',
      title: $t('content-management.content.coverImage'),
      width: 100,
    },
    {
      field: 'sort',
      title: $t('content-management.content.sort'),
      width: 80,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: ProductContentStatus.toOriginItems(),
      },
      field: 'status',
      title: $t('content-management.content.status'),
      width: 100,
    },
    {
      field: 'publishedAt',
      cellRender: { name: 'CellFormatDate' },
      title: $t('content-management.content.publishedAt'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('content-management.content.title'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'edit',
            text: $t('common.edit'),
          },
          {
            code: 'delete',
            text: $t('common.delete'),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.action'),
      width: 160,
    },
  ];
}
