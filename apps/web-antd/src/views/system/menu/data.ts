import type { VbenFormProps } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { Menu } from '#/api/system/menu';

import { MenuType, Status } from '#/api/system/menu';
import { $t } from '#/locales';

export function getMenuTypeOptions() {
  return [...MenuType.items];
}

export function userSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    schema: [
      {
        component: 'Input',
        fieldName: 'title',
        label: $t('system.menu.menuTitle'),
      },
      {
        component: 'Input',
        fieldName: 'path',
        label: $t('system.menu.path'),
      },
      {
        component: 'Input',
        fieldName: 'component',
        label: $t('system.menu.component'),
      },
      {
        component: 'RadioGroup',
        componentProps: {
          buttonStyle: 'solid',
          options: Status.toSelect(),
        },
        fieldName: 'status',
        label: $t('system.menu.status'),
      },
    ],
    submitOnChange: true,
  };
}

export function useColumns(
  onActionClick: OnActionClickFn<Menu.View>,
): VxeTableGridOptions<Menu.View>['columns'] {
  return [
    {
      align: 'center',
      field: 'meta.title',
      fixed: 'left',
      slots: { default: 'title' },
      title: $t('system.menu.menuTitle'),
      treeNode: true,
      width: 250,
    },

    {
      align: 'center',
      cellRender: { name: 'CellTag', options: MenuType.toOriginItems() },
      field: 'type',
      title: $t('system.menu.type'),
      width: 100,
    },

    {
      field: 'authCode',
      title: $t('system.menu.authCode'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      width: 200,
    },
    {
      align: 'left',
      field: 'path',
      title: $t('system.menu.path'),
      width: 200,
    },
    {
      field: 'name',
      title: $t('system.menu.menuName'),
      cellRender: {
        name: 'CellFormatEmpty',
      },
      width: 200,
    },
    {
      align: 'left',
      field: 'component',
      formatter: ({ row }) => {
        switch (row.type) {
          case 'catalog':
          case 'menu': {
            return row.component ?? '';
          }
          case 'embedded': {
            return row.meta?.iframeSrc ?? '';
          }
          case 'link': {
            return row.meta?.link ?? '';
          }
        }
        return '';
      },
      minWidth: 200,
      title: $t('system.menu.component'),
    },
    {
      cellRender: {
        name: 'CellState',
        props: {
          successText: '隐藏',
          errorText: '不隐藏',
          successColor: 'error',
          errorColor: 'default',
        },
      },
      field: 'meta.hideInMenu',
      title: $t('system.menu.hideInMenu'),
      width: 100,
    },
    {
      cellRender: {
        name: 'CellState',
        props: {
          successText: '隐藏',
          errorText: '不隐藏',
          successColor: 'error',
          errorColor: 'default',
        },
      },
      field: 'meta.hideChildrenInMenu',
      title: $t('system.menu.hideChildrenInMenu'),
      width: 130,
    },
    {
      cellRender: {
        name: 'CellState',
        props: {
          successText: '隐藏',
          errorText: '不隐藏',
          successColor: 'error',
          errorColor: 'default',
        },
      },
      field: 'meta.hideInBreadcrumb',
      title: $t('system.menu.hideInBreadcrumb'),
      width: 130,
    },
    {
      cellRender: {
        name: 'CellState',
        props: {
          successText: '隐藏',
          errorText: '正常',
          successColor: 'error',
          errorColor: 'success',
        },
      },
      field: 'meta.hideInTab',
      title: $t('system.menu.hideInTab'),
      width: 130,
    },
    {
      cellRender: { name: 'CellState' },
      field: 'meta.keepAlive',
      title: $t('system.menu.keepAlive'),
      width: 100,
    },
    {
      cellRender: { name: 'CellTag', options: Status.toOriginItems() },
      field: 'status',
      title: $t('system.menu.status'),
      width: 100,
    },
    {
      field: 'createTime',
      cellRender: { name: 'CellFormatDate' },
      title: $t('system.menu.createTime'),
    },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '新增下级',
          },
          'edit',
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: $t('system.menu.operation'),
      width: 200,
    },
  ];
}
