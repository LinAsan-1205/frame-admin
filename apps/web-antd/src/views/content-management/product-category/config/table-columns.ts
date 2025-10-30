import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductCategory } from '#/api/content-management/product-category';

import { $t } from '#/locales';

/**
 * 产品分类表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = ProductCategory.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
    },
    {
      field: 'name',
      title: $t('content-management.category.name'),
      treeNode: true,
      width: 200,
    },
    {
      field: 'sort',
      title: $t('content-management.category.sort'),
      width: 100,
    },
    {
      field: 'remark',
      title: $t('content-management.category.remark'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      minWidth: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('content-management.category.name'),
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
