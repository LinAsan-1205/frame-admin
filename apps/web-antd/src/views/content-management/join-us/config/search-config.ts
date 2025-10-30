import type { VbenFormProps } from '#/adapter/form';

import { JobStatus, JobType } from '#/api/content-management/join-us';
import { $t } from '#/locales';

/**
 * 招聘职位搜索表单配置
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    schema: [
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('content-management.joinUs.jobTitleSearch'),
        },
        fieldName: 'title',
        label: $t('content-management.joinUs.jobTitle'),
      },
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('content-management.joinUs.departmentSearch'),
        },
        fieldName: 'department',
        label: $t('content-management.joinUs.department'),
      },
      {
        component: 'Input',
        componentProps: {
          allowClear: true,
          placeholder: $t('content-management.joinUs.locationSearch'),
        },
        fieldName: 'location',
        label: $t('content-management.joinUs.location'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: JobType.toOriginItems(),
          placeholder: $t('content-management.joinUs.typeSearch'),
        },
        fieldName: 'type',
        label: $t('content-management.joinUs.type'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: JobStatus.toOriginItems(),
          placeholder: $t('content-management.joinUs.statusSearch'),
        },
        fieldName: 'status',
        label: $t('content-management.joinUs.status'),
      },
    ],
  };
}

