import type { VbenFormProps } from '#/adapter/form';

import { RegionType } from '#/api/system/region';
import { $t } from '#/locales';

/**
 * 行政区域搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    schema: [
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('system.region.titlePlaceholder'),
          allowClear: true,
        },
        fieldName: 'title',
        label: $t('system.region.title'),
      },
      {
        component: 'Input',
        componentProps: {
          placeholder: $t('system.region.codePlaceholder'),
          allowClear: true,
        },
        fieldName: 'code',
        label: $t('system.region.code'),
      },
      {
        component: 'InputNumber',
        componentProps: {
          placeholder: $t('system.region.levelPlaceholder'),
          allowClear: true,
          class: 'w-full',
        },
        fieldName: 'level',
        label: $t('system.region.level'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: RegionType.toSelect(),
        },
        fieldName: 'type',
        label: $t('system.region.type'),
      },
    ],
    submitOnChange: true,
  };
}
