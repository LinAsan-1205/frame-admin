import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ContactUs } from '#/api/content-management/contact-us';

import { ContactType } from '#/api/content-management/contact-us';
import { $t } from '#/locales';

/**
 * 联系记录表格列配置
 * @param onActionClick 操作按钮点击回调
 */
export function useColumns<T = ContactUs.View>(
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
      field: 'name',
      minWidth: 120,
      title: $t('content-management.contactUs.name'),
    },
    {
      field: 'email',
      minWidth: 180,
      title: $t('content-management.contactUs.email'),
    },
    {
      cellRender: {
        name: 'CellFormatEmpty',
      },
      field: 'phone',
      minWidth: 130,
      title: $t('content-management.contactUs.phone'),
    },
    {
      cellRender: {
        name: 'CellTag',
        options: ContactType.toOriginItems(),
      },
      field: 'type',
      title: $t('content-management.contactUs.type'),
      width: 120,
    },
    {
      field: 'subject',
      minWidth: 200,
      title: $t('content-management.contactUs.subject'),
    },
    {
      cellRender: {
        name: 'CellEllipsis',
      },
      field: 'message',
      minWidth: 250,
      title: $t('content-management.contactUs.message'),
    },
    {
      cellRender: {
        name: 'CellFormatEmpty',
      },
      field: 'ipAddress',
      title: $t('content-management.contactUs.ipAddress'),
      width: 130,
    },
    {
      cellRender: { name: 'CellFormatDate' },
      field: 'createTime',
      title: $t('content-management.contactUs.createTime'),
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('content-management.contactUs.name'),
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'delete',
            text: $t('common.delete'),
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: $t('common.action'),
      width: 100,
    },
  ];
}
