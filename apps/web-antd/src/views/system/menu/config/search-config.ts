import type { VbenFormProps } from '#/adapter/form';

import { Status } from '#/api/system/menu';
import { $t } from '#/locales';

/**
 * 菜单搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    collapsed: false,
    schema: [
      {
        component: 'Input',
        fieldName: 'title',
        label: $t('system.menu.menuTitle'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'path',
        label: $t('system.menu.path'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'component',
        label: $t('system.menu.component'),
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
        label: $t('system.menu.status'),
      },
    ],
    submitOnChange: true,
  };
}
