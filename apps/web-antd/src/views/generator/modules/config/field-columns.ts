import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DataType, FormType, QueryType } from '#/api/generator/enum';
import { $t } from '#/locales';

/**
 * 字段配置表格列定义
 */
export const createFieldColumns = (): VxeTableGridOptions['columns'] => [
  { title: '#', type: 'seq', width: 50 },
  {
    field: 'columnName',
    title: $t('generator.config.fields.columns.columnName'),
  },
  {
    field: 'columnComment',
    title: $t('generator.config.fields.columns.columnComment'),
    editRender: { name: 'input' },
  },
  {
    field: 'dataType',
    title: $t('generator.config.fields.columns.dataType'),
    editRender: { name: 'VxeSelect', options: DataType.toOriginItems() },
  },
  {
    field: 'isRequired',
    title: $t('generator.config.fields.columns.isRequired'),
    editRender: {
      name: 'VxeSelect',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },
  {
    field: 'isInsert',
    title: $t('generator.config.fields.columns.isInsert'),
    editRender: {
      name: 'VxeSelect',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },
  {
    field: 'isEdit',
    title: $t('generator.config.fields.columns.isEdit'),
    editRender: {
      name: 'VxeSelect',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },
  {
    field: 'isList',
    title: $t('generator.config.fields.columns.isList'),
    editRender: {
      name: 'VxeSelect',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },
  {
    field: 'isQuery',
    title: $t('generator.config.fields.columns.isQuery'),
    editRender: {
      name: 'VxeSelect',
      options: [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
  },
  {
    field: 'formType',
    title: $t('generator.config.fields.columns.formType'),
    editRender: {
      name: 'VxeSelect',
      options: FormType.toOriginItems(),
    },
  },
  {
    field: 'queryType',
    title: $t('generator.config.fields.columns.queryType'),
    editRender: {
      name: 'VxeSelect',
      options: QueryType.toOriginItems(),
    },
  },
];
