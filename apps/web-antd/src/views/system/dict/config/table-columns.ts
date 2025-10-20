import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Dict, DictData } from '#/api/system/dict';

import { Status } from '#/api/system/dict';
import { $t } from '#/locales';

/**
 * 字典表格列配置
 * @param onActionClick 操作按钮点击回调
 * @returns 字典表格列配置数组
 */
export function useDictColumns<T = Dict.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('common.index'),
    },
    {
      field: 'dictType',
      title: $t('system.dict.dictType'),
    },
    {
      field: 'dictName',
      title: $t('system.dict.dictName'),
    },
    {
      field: 'remark',
      title: $t('system.dict.remark'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'status',
      title: $t('system.dict.status'),
      cellRender: {
        name: 'CellTag',
        options: Status.toOriginItems(),
      },
    },

    {
      field: 'createTime',
      title: $t('common.createTime'),
      cellRender: { name: 'CellFormatDate' },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'dictName',
          nameTitle: $t('system.dict.dictName'),
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
          {
            code: 'dictData',
            text: $t('system.dictData.list'),
          },
        ],
      },
      field: 'actions',
      fixed: 'right',
      title: $t('common.action'),
      width: 300,
    },
  ];
}

/**
 * 字典数据表格列配置
 * @param onActionClick 操作按钮点击回调
 * @returns 字典数据表格列配置数组
 */
export function useDictDataColumns<T = DictData.View>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'seq',
      width: 60,
      title: $t('common.index'),
    },
    {
      field: 'dictLabel',
      title: $t('system.dictData.dictLabel'),
    },
    {
      field: 'dictValue',
      title: $t('system.dictData.dictValue'),
    },
    {
      field: 'dictSort',
      title: $t('system.dictData.dictSort'),
    },
    {
      field: 'status',
      title: $t('system.dictData.status'),
      cellRender: {
        name: 'CellTag',
        options: Status.toOriginItems(),
      },
    },
    {
      field: 'remark',
      title: $t('system.dictData.remark'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      field: 'createTime',
      title: $t('common.createTime'),
      cellRender: { name: 'CellFormatDate' },
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'dictLabel',
          nameTitle: $t('system.dictData.dictLabel'),
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
      field: 'actions',
      fixed: 'right',
      title: $t('common.action'),
      width: 160,
    },
  ];
}
