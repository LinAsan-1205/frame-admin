import type { VbenFormSchema } from '#/adapter/form';

import { markRaw } from 'vue';

import dayjs from 'dayjs';

import { JobStatus, JobType } from '#/api/content-management/join-us';
import { RichTextEditor } from '#/components/editor';
import { $t } from '#/locales';

/**
 * 招聘职位表单配置
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.joinUs.jobTitlePlaceholder'),
      },
      fieldName: 'title',
      label: $t('content-management.joinUs.jobTitle'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.joinUs.departmentPlaceholder'),
      },
      fieldName: 'department',
      label: $t('content-management.joinUs.department'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.joinUs.locationPlaceholder'),
      },
      fieldName: 'location',
      label: $t('content-management.joinUs.location'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: JobType.toOriginItems(),
        placeholder: $t('content-management.joinUs.typePlaceholder'),
      },
      defaultValue: JobType.FullTime,
      fieldName: 'type',
      label: $t('content-management.joinUs.type'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.joinUs.salaryRangePlaceholder'),
      },
      fieldName: 'salaryRange',
      label: $t('content-management.joinUs.salaryRange'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: $t('content-management.joinUs.headcountPlaceholder'),
        style: { width: '100%' },
      },
      fieldName: 'headcount',
      label: $t('content-management.joinUs.headcount'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('content-management.joinUs.summaryPlaceholder'),
        rows: 3,
      },
      fieldName: 'summary',
      label: $t('content-management.joinUs.summary'),
    },
    {
      component: markRaw(RichTextEditor),
      componentProps: {
        minHeight: '300px',
        placeholder: $t('content-management.joinUs.contentPlaceholder'),
        toolbar: 'full',
      },
      fieldName: 'content',
      label: $t('content-management.joinUs.content'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('content-management.joinUs.requirementsPlaceholder'),
        rows: 4,
      },
      fieldName: 'requirements',
      label: $t('content-management.joinUs.requirements'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('content-management.joinUs.benefitsPlaceholder'),
        rows: 4,
      },
      fieldName: 'benefits',
      label: $t('content-management.joinUs.benefits'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.joinUs.contactEmailPlaceholder'),
      },
      fieldName: 'contactEmail',
      label: $t('content-management.joinUs.contactEmail'),
      rules: 'email',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('content-management.joinUs.sortPlaceholder'),
        style: { width: '100%' },
      },
      defaultValue: 0,
      fieldName: 'sort',
      label: $t('content-management.joinUs.sort'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: $t('content-management.joinUs.publishedAtPlaceholder'),
        showTime: true,
        style: { width: '100%' },
      },
      defaultValue: dayjs(),
      fieldName: 'publishedAt',
      label: $t('content-management.joinUs.publishedAt'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: $t('content-management.joinUs.deadlinePlaceholder'),
        showTime: true,
        style: { width: '100%' },
      },
      fieldName: 'deadline',
      label: $t('content-management.joinUs.deadline'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: JobStatus.toOriginItems(),
      },
      defaultValue: JobStatus.Show,
      fieldName: 'status',
      label: $t('content-management.joinUs.status'),
    },
  ];
}

