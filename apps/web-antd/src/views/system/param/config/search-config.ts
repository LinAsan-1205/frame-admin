import type { VbenFormProps } from '#/adapter/form';

import { $t } from '#/locales';

export function useSearchFormOptions(): VbenFormProps {
  return {
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        fieldName: 'paramName',
        label: $t('system.param.paramName'),
        componentProps: { allowClear: true },
      },
      {
        component: 'Input',
        fieldName: 'paramKey',
        label: $t('system.param.paramKey'),
        componentProps: { allowClear: true },
      },
    ],
  };
}
