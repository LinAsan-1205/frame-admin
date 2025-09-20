import type { VbenFormProps } from '#/adapter/form';

import { LoginStatus } from '#/api/log/login';
import { $t } from '#/locales';

/**
 * 登录日志搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    fieldMappingTime: [['loginTime', ['createFormDate', 'createToDate']]],
    schema: [
      {
        component: 'Input',
        fieldName: 'username',
        label: $t('loginLog.username'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'behavior',
        label: $t('loginLog.behavior'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'ip',
        label: $t('loginLog.ip'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: LoginStatus.toSelect(),
        },
        fieldName: 'status',
        label: $t('loginLog.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'loginTime',
        label: $t('loginLog.loginTime'),
      },
    ],
    submitOnChange: true,
  };
}