import type { VbenFormProps } from '#/adapter/form';

import { Status } from '#/api/system/role';
import { $t } from '#/locales';

/**
 * 角色搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        fieldName: 'name',
        label: $t('system.role.roleName'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'code',
        label: $t('system.role.code'),
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
