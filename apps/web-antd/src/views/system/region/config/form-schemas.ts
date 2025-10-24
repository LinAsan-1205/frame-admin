import type { VbenFormSchema } from '#/adapter/form';

import { z } from '#/adapter/form';
import { getRegionList, RegionType } from '#/api/system/region';
import { $t } from '#/locales';

/**
 * 行政区域表单配置
 * 获取编辑表单的字段配置
 * @returns 行政区域表单字段配置数组
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('system.region.title'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.region.title')]))
        .max(
          255,
          $t('ui.formRules.maxLength', [$t('system.region.title'), 255]),
        ),
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: $t('system.region.code'),
      rules: z
        .string()
        .min(1, $t('ui.formRules.required', [$t('system.region.code')]))
        .max(
          255,
          $t('ui.formRules.maxLength', [$t('system.region.code'), 255]),
        ),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: $t('system.region.levelPlaceholder'),
        class: 'w-full',
        min: 1,
      },
      fieldName: 'level',
      label: $t('system.region.level'),
      rules: z
        .number()
        .min(1, $t('ui.formRules.minValue', [$t('system.region.level'), 1]))
        .optional(),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: getRegionList,
        labelField: 'title',
        valueField: 'id',
      },
      fieldName: 'parentId',
      defaultValue: undefined,
      label: $t('system.region.parentId'),
    },
    {
      component: 'RadioGroup',
      componentProps: { options: RegionType.toSelect() },
      defaultValue: RegionType.Province,
      fieldName: 'type',
      label: $t('system.region.type'),
    },
  ];
}
