import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Param } from '#/api/system/param';

import { IsSystem } from '#/api/system/param';
import { $t } from '#/locales';

export function useColumns<T = Param.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    { title: '#', type: 'seq', width: 60 },
    { field: 'paramName', title: $t('system.param.paramName') },
    { field: 'paramKey', title: $t('system.param.paramKey') },
    {
      field: 'paramValue',
      title: $t('system.param.paramValue'),
    },
    {
      field: 'isSystem',
      title: $t('system.param.isSystem'),
      cellRender: {
        name: 'CellTag',
        options: IsSystem.toOriginItems(),
      },
    },
    { field: 'remark', title: $t('system.param.remark') },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      cellRender: { name: 'CellFormatDate' },
    },
    {
      field: 'operation',
      title: $t('common.operation'),
      width: 140,
      fixed: 'right',
      align: 'center',
      cellRender: {
        name: 'CellOperation',
        attrs: {
          nameField: 'paramName',
          nameTitle: $t('system.param.paramName'),
          onClick: onActionClick,
        },
        options: [
          'edit',
          {
            code: 'delete',
            text: $t('common.delete'),
            disabled: (row: Param.View) => {
              return row.isSystem === IsSystem.Yes;
            },
          },
        ],
      },
    },
  ];
}
