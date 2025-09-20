import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { OnActionClickFn } from '#/adapter/vxe-table';
import type { StorageConfig } from '#/api/system/storage/config';

import {
  StorageConfigIsDefault,
  StorageConfigStatus,
  StorageConfigType,
} from '#/api/system/storage/config';
import { $t } from '#/locales';

/**
 * 存储配置表格列配置
 * @param onActionClick 操作按钮点击回调
 * @param onIsDefaultChange 默认配置切换回调
 * @returns 表格列配置数组
 */
export function useColumns<T = StorageConfig.View>(
  onActionClick?: OnActionClickFn<T>,
  onIsDefaultChange?: (
    newStatus: any,
    row: T,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions<T>['columns'] {
  return [
    {
      align: 'center',
      field: 'name',
      title: $t('system.storageConfig.names'),
    },
    {
      align: 'center',
      field: 'code',
      title: $t('system.storageConfig.code'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      cellRender: {
        name: 'CellTag',
        options: StorageConfigType.toOriginItems(),
      },
      field: 'type',
      title: $t('system.storageConfig.type'),
    },

    {
      align: 'center',
      field: 'storagePath',
      title: $t('system.storageConfig.storagePath'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'accessPath',
      title: $t('system.storageConfig.accessPath'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'accessKey',
      title: $t('system.storageConfig.accessKey'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'secretKey',
      title: $t('system.storageConfig.secretKey'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'bucket',
      title: $t('system.storageConfig.bucket'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      width: 120,
    },
    {
      align: 'center',
      field: 'endpoint',
      title: $t('system.storageConfig.endpoint'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      align: 'center',
      field: 'domain',
      title: $t('system.storageConfig.domain'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },

    {
      field: 'description',
      title: $t('system.storageConfig.description'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
    },
    {
      cellRender: {
        name: 'CellTag',
        options: StorageConfigStatus.toOriginItems(),
      },
      field: 'status',
      title: $t('system.storageConfig.status'),
      width: 100,
    },
    {
      cellRender: {
        attrs: { beforeChange: onIsDefaultChange },
        name: 'CellSwitch',
        props: {
          checkedValue: StorageConfigIsDefault.Yes,
          unCheckedValue: StorageConfigIsDefault.No,
          checkedChildren: $t('system.storageConfig.isDefaultText'),
          unCheckedChildren: $t('system.storageConfig.notDefaultText'),
        },
      },
      field: 'isDefault',
      title: $t('system.storageConfig.isDefault'),
      width: 100,
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.storageConfig.createTime'),
      width: 200,
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.dept.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit',
          {
            code: 'delete',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.dept.operation'),
      width: 120,
    },
  ];
}
