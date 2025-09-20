import type { VbenFormProps } from '#/adapter/form';

import { Status } from '#/api/system/user/enum';
import { $t } from '#/locales';

/**
 * 用户搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        fieldName: 'userName',
        label: $t('system.user.userName'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'nickName',
        label: $t('system.user.nickName'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'phone',
        label: $t('system.user.phone'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'email',
        label: $t('system.user.email'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: Status.toSelect(),
        },
        fieldName: 'status',
        label: $t('system.role.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'createTime',
        label: $t('system.role.createTime'),
      },
    ],
  };
}
