import type { VbenFormProps } from '#/adapter/form';

import { ContactType } from '#/api/content-management/contact-us';
import { $t } from '#/locales';

/**
 * 联系记录搜索表单配置
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    schema: [
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('content-management.contactUs.nameSearch'),
        },
        fieldName: 'name',
        label: $t('content-management.contactUs.name'),
      },
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('content-management.contactUs.emailSearch'),
        },
        fieldName: 'email',
        label: $t('content-management.contactUs.email'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: ContactType.toOriginItems(),
          placeholder: $t('content-management.contactUs.typeSearch'),
        },
        fieldName: 'type',
        label: $t('content-management.contactUs.type'),
      },
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('content-management.contactUs.subjectSearch'),
        },
        fieldName: 'subject',
        label: $t('content-management.contactUs.subject'),
      },
    ],
  };
}
