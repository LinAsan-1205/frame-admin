import type { VbenFormSchema } from '#/adapter/form';

import { $t } from '#/locales';

/**
 * 系统参数表单配置
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'paramName',
      label: $t('system.param.paramName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'paramKey',
      label: $t('system.param.paramKey'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'paramValue',
      label: $t('system.param.paramValue'),
      componentProps: { rows: 3 },
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.param.remark'),
      componentProps: { rows: 3 },
    },
  ];
}
