import type { VbenFormProps } from '#/adapter/form';

import { PostStatus } from '#/api/system/post';
import { $t } from '#/locales';

/**
 * 岗位搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['createTime', ['createFormDate', 'createToDate']]],
    submitOnChange: true,
    schema: [
      {
        component: 'Input',
        fieldName: 'postCode',
        label: $t('system.post.postCode'),
        componentProps: {
          allowClear: true,
          placeholder: $t('system.post.postCodePlaceholder'),
        },
      },
      {
        component: 'Input',
        fieldName: 'postName',
        label: $t('system.post.postName'),
        componentProps: {
          allowClear: true,
          placeholder: $t('system.post.postNamePlaceholder'),
        },
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: PostStatus.toSelect(),
          placeholder: $t('system.post.statusPlaceholder'),
        },
        fieldName: 'status',
        label: $t('system.post.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'createTime',
        label: $t('system.post.createTime'),
      },
    ],
  };
}
