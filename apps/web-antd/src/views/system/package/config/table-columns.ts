import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Package } from '#/api/system/package';

import { $t } from '#/locales';

export function useColumns<T = Package.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '#', type: 'seq', width: 50 },
    {
      field: 'packageName',
      showOverflow: true,
      title: $t('tenant.package.form.packageName'),
    },
    {
      field: 'price',
      title: $t('tenant.package.form.price'),
      width: 100,
      cellRender: {
        name: 'CellFormatMoney',
      },
    },
    {
      field: 'originalPrice',
      title: $t('tenant.package.form.originalPrice'),
      width: 120,
      cellRender: {
        name: 'CellFormatMoney',
      },
    },
    {
      field: 'description',
      title: $t('tenant.package.form.description'),
      width: 200,
      showOverflow: true,
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'status',
      title: $t('tenant.package.form.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
      },
    },
    {
      field: 'tenantCount',
      title: $t('tenant.package.tenantCount'),
      width: 100,
    },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      width: 150,
      cellRender: { name: 'CellFormatDate' },
    },
    {
      field: 'remark',
      title: $t('common.remark'),
      showOverflow: true,
      width: 200,
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'packageName',
          nameTitle: $t('tenant.package.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.action'),
      width: 130,
    },
  ];
}
