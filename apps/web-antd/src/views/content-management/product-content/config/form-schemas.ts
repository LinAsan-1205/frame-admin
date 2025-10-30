import type { VbenFormSchema } from '#/adapter/form';

import { markRaw } from 'vue';

import dayjs from 'dayjs';

import { getProductCategoryTree } from '#/api/content-management/product-category';
import {
  ProductContentStatus,
  ProductContentType,
} from '#/api/content-management/product-content';
import { RichTextEditor } from '#/components/editor';
import { ImageUpload } from '#/components/upload';
import { $t } from '#/locales';

/**
 * 产品内容表单配置
 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('content-management.content.titlePlaceholder'),
      },
      fieldName: 'title',
      label: $t('content-management.content.title'),
      rules: 'required',
    },
    {
      component: 'ApiTreeSelect',
      componentProps: {
        allowClear: false,
        api: getProductCategoryTree,
        fieldNames: {
          label: 'name',
          value: 'id',
        },
        placeholder: $t('content-management.content.categoryIdPlaceholder'),
        resultField: 'data',
      },
      fieldName: 'categoryId',
      label: $t('content-management.content.categoryId'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: ProductContentType.toOriginItems(),
        placeholder: $t('content-management.content.typePlaceholder'),
      },
      defaultValue: ProductContentType.Article,
      fieldName: 'type',
      label: $t('content-management.content.type'),
    },
    {
      component: markRaw(ImageUpload),
      componentProps: {
        accept: 'image/*',
        buttonText: '上传产品主图',
        maxSize: 5,
      },
      fieldName: 'coverImage',
      label: $t('content-management.content.coverImage'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: $t('content-management.content.summaryPlaceholder'),
        rows: 3,
      },
      fieldName: 'summary',
      label: $t('content-management.content.summary'),
    },
    {
      component: markRaw(RichTextEditor),
      componentProps: {
        minHeight: '300px',
        placeholder: $t('content-management.content.contentPlaceholder'),
        toolbar: 'full',
      },
      fieldName: 'content',
      label: $t('content-management.content.content'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        placeholder: $t('content-management.content.sortPlaceholder'),
        style: { width: '100%' },
      },
      defaultValue: 1,
      fieldName: 'sort',
      label: $t('content-management.content.sort'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: $t('content-management.content.publishedAtPlaceholder'),
        showTime: true,
        style: { width: '100%' },
      },
      defaultValue: dayjs(),
      fieldName: 'publishedAt',
      label: $t('content-management.content.publishedAt'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: ProductContentStatus.toOriginItems(),
      },
      defaultValue: ProductContentStatus.Show,
      fieldName: 'status',
      label: $t('content-management.content.status'),
    },
  ];
}
