import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Tenant } from '#/api/system/tenant';

import { TenantStatus, SubscriptionType } from '#/api/system/tenant';
import { $t } from '#/locales';

export function useColumns<T = Tenant.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '#', type: 'seq', width: 50 },
    {
      field: 'tenantName',
      title: $t('tenant.form.tenantName'),
      width: 150,
    },
    {
      field: 'domain',
      title: $t('tenant.form.domain'),
      width: 180,
    },
    {
      field: 'phone',
      title: $t('tenant.form.phone'),
      width: 120,
    },
    {
      field: 'email',
      title: $t('tenant.form.email'),
      width: 200,
    },
    {
      field: 'status',
      title: $t('tenant.form.status'),
      width: 100,
      cellRender: {
        name: 'CellTag',
      },
    },
    {
      field: 'subscriptionType',
      title: $t('tenant.form.subscriptionType'),
      width: 120,
      cellRender: {
        name: 'CellTag',
      },
    },
    {
      field: 'expireTime',
      title: $t('tenant.form.expireTime'),
      width: 150,
      cellRender: { name: 'CellFormatDate' },
    },
    {
      field: 'package.packageName',
      title: $t('tenant.form.package'),
      width: 120,
      cellRender: {
        name: 'CellFormatEmpty',
      },
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
      width: 200,
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'tenantName',
          nameTitle: $t('tenant.name'),
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