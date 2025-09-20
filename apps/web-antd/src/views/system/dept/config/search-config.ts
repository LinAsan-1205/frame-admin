import type { VbenFormProps } from '#/adapter/form';

import { Status } from '#/api/system/dept';
import { $t } from '#/locales';

/**
 * 部门搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    schema: [
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('system.dept.deptNamePlaceholder'),
          allowClear: true,
        },
        fieldName: 'name',
        label: $t('system.dept.deptName'),
      },
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('system.dept.leaderPlaceholder'),
          allowClear: true,
        },
        fieldName: 'leader',
        label: $t('system.dept.leader'),
      },
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('system.dept.phonePlaceholder'),
          allowClear: true,
        },
        fieldName: 'phone',
        label: $t('system.dept.phone'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: Status.toSelect(),
        },
        fieldName: 'status',
        label: $t('system.dept.status'),
      },
    ],
    submitOnChange: true,
  };
}
