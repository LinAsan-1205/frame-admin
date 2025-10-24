import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { Region } from '#/api/system/region';

import { RegionType } from '#/api/system/region';
import { $t } from '#/locales';

/**
 * 行政区域表格列配置
 * @param onActionClick 操作按钮点击回调
 * @returns 表格列配置数组
 */
export function useColumns(
  onActionClick?: OnActionClickFn<Region.View>,
): VxeTableGridOptions<Region.View>['columns'] {
  return [
    { title: '#', type: 'seq', width: 50, fixed: 'left' },
    {
      align: 'center',
      field: 'title',
      fixed: 'left',
      title: $t('system.region.title'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'code',
      title: $t('system.region.code'),
    },
    {
      align: 'center',
      cellRender: { name: 'CellTag', options: RegionType.toOriginItems() },
      field: 'type',
      title: $t('system.region.type'),
      width: 100,
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.region.createTime'),
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'title',
          nameTitle: $t('system.region.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: ['edit', 'delete'],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.region.operation'),
      width: 150,
    },
  ];
}
