import type { VbenFormProps } from '#/adapter/form';

import { OperationStatus } from '#/api/log/operation';
import { $t } from '#/locales';

/**
 * 操作日志搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    schema: [
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('operationLog.usernamePlaceholder'),
        },
        fieldName: 'username',
        label: $t('operationLog.username'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: OperationStatus.toSelect(),
        },
        fieldName: 'status',
        label: $t('operationLog.status'),
      },
    ],
    submitOnChange: true,
  };
}