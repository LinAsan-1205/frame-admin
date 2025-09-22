<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Space,
  TabPane,
  Tabs,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  generateCode,
  getTableColumns,
  previewCode,
  saveGeneratorConfig,
} from '#/api/generator';
import { $t } from '#/locales';

import CodePreview from './code-preview.vue';

const props = defineProps<{
  tableInfo: any;
}>();

const emit = defineEmits<{
  success: [];
}>();

const activeTab = ref('basic');
const loading = ref(false);
const columns = ref<any[]>([]);
const formData = ref({
  tableName: '',
  tableComment: '',
  moduleName: '',
  businessName: '',
  modulePath: '',
  permissionPrefix: '',
  backendOptions: ['entity', 'dto', 'service', 'controller', 'module'],
  frontendOptions: [
    'api',
    'types',
    'enum',
    'list',
    'form',
    'table-columns',
    'form-schemas',
    'search-config',
  ],
  features: ['add', 'edit', 'delete', 'batchDelete'],
});

const [PreviewDrawer, previewDrawerApi] = useVbenDrawer({
  connectedComponent: CodePreview,
  destroyOnClose: true,
  title: $t('generator.preview.title'),
});

const fieldColumns: VxeTableGridOptions['columns'] = [
  {
    field: 'columnName',
    title: $t('generator.config.fields.columns.columnName'),
    width: 120,
  },
  {
    field: 'columnComment',
    title: $t('generator.config.fields.columns.columnComment'),
    width: 150,
    editRender: { name: 'input' },
  },
  {
    field: 'dataType',
    title: $t('generator.config.fields.columns.dataType'),
    width: 100,
  },
  {
    field: 'isRequired',
    title: $t('generator.config.fields.columns.isRequired'),
    width: 70,
    cellRender: {
      name: 'VxeSwitch',
    },
  },
  {
    field: 'isInsert',
    title: $t('generator.config.fields.columns.isInsert'),
    width: 70,
    cellRender: {
      name: 'VxeSwitch',
    },
  },
  {
    field: 'isEdit',
    title: $t('generator.config.fields.columns.isEdit'),
    width: 70,
    cellRender: {
      name: 'VxeSwitch',
    },
  },
  {
    field: 'isList',
    title: $t('generator.config.fields.columns.isList'),
    width: 70,
    cellRender: {
      name: 'VxeSwitch',
    },
  },
  {
    field: 'isQuery',
    title: $t('generator.config.fields.columns.isQuery'),
    width: 70,
    cellRender: {
      name: 'VxeSwitch',
    },
  },
  {
    field: 'formType',
    title: $t('generator.config.fields.columns.formType'),
    width: 120,
    editRender: {
      name: 'VxeSelect',
      options: [
        {
          value: 'Input',
          label: $t('generator.config.fields.formTypes.Input'),
        },
        {
          value: 'Textarea',
          label: $t('generator.config.fields.formTypes.Textarea'),
        },
        {
          value: 'InputNumber',
          label: $t('generator.config.fields.formTypes.InputNumber'),
        },
        {
          value: 'Select',
          label: $t('generator.config.fields.formTypes.Select'),
        },
        {
          value: 'RadioGroup',
          label: $t('generator.config.fields.formTypes.RadioGroup'),
        },
        {
          value: 'CheckboxGroup',
          label: $t('generator.config.fields.formTypes.CheckboxGroup'),
        },
        {
          value: 'DatePicker',
          label: $t('generator.config.fields.formTypes.DatePicker'),
        },
        {
          value: 'Switch',
          label: $t('generator.config.fields.formTypes.Switch'),
        },
        {
          value: 'Upload',
          label: $t('generator.config.fields.formTypes.Upload'),
        },
        {
          value: 'ApiTreeSelect',
          label: $t('generator.config.fields.formTypes.ApiTreeSelect'),
        },
      ],
    },
  },
  {
    field: 'queryType',
    title: $t('generator.config.fields.columns.queryType'),
    width: 100,
    editRender: {
      name: 'VxeSelect',
      options: [
        { value: 'EQ', label: $t('generator.config.fields.queryTypes.EQ') },
        { value: 'LIKE', label: $t('generator.config.fields.queryTypes.LIKE') },
        {
          value: 'BETWEEN',
          label: $t('generator.config.fields.queryTypes.BETWEEN'),
        },
      ],
    },
  },
];

const [FieldGrid] = useVbenVxeGrid({
  gridOptions: {
    columns: fieldColumns,
    data: columns.value,
    height: 400,
    editConfig: {
      trigger: 'click',
      mode: 'cell',
    },
    rowConfig: {
      keyField: 'columnName',
    },
  },
});

watch(
  () => props.tableInfo,
  async (newVal) => {
    if (newVal) {
      // 自动推断配置
      formData.value = {
        tableName: newVal.tableName,
        tableComment: newVal.tableComment || '',
        moduleName: extractModuleName(newVal.tableName),
        businessName: newVal.tableComment?.replace(/表$/, '') || '',
        modulePath: generateModulePath(newVal.tableName),
        permissionPrefix: generatePermissionPrefix(newVal.tableName),
        backendOptions: ['entity', 'dto', 'service', 'controller', 'module'],
        frontendOptions: [
          'api',
          'types',
          'enum',
          'list',
          'form',
          'table-columns',
          'form-schemas',
          'search-config',
        ],
        features: ['add', 'edit', 'delete', 'batchDelete'],
      };

      // 加载字段列表
      columns.value = await getTableColumns(newVal.tableName);
    }
  },
  { immediate: true },
);

async function handleSave() {
  loading.value = true;
  try {
    const config = {
      ...formData.value,
      fields: columns.value,
    };
    await saveGeneratorConfig(config);
    message.success($t('generator.config.actions.saveSuccess'));
  } finally {
    loading.value = false;
  }
}

async function handlePreview() {
  loading.value = true;
  try {
    const config = {
      ...formData.value,
      fields: columns.value,
    };
    console.log('Preview config:', config);
    const result = await previewCode(config);
    console.log('Preview result:', result);
    previewDrawerApi.setData(result).open();
  } finally {
    loading.value = false;
  }
}

async function handleGenerate() {
  loading.value = true;
  try {
    const config = {
      ...formData.value,
      fields: columns.value,
    };
    const result = await generateCode(config);
    if (result.success) {
      message.success($t('generator.config.actions.generateSuccess'));
      emit('success');
    }
  } finally {
    loading.value = false;
  }
}

// 工具函数
function extractModuleName(tableName: string): string {
  return tableName.replace(/^[a-z]+_/, '');
}

function generateModulePath(tableName: string): string {
  const parts = tableName.split('_');
  return parts.join('/');
}

function generatePermissionPrefix(tableName: string): string {
  const parts = tableName.split('_');
  return parts.join(':');
}
</script>

<template>
  <PreviewDrawer />
  <Card
    :title="$t('generator.config.title', { tableName: formData.tableName })"
    class="h-full"
  >
    <Tabs v-model:active-key="activeTab">
      <TabPane key="basic" :tab="$t('generator.config.tabs.basic')">
        <Form
          :model="formData"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
        >
          <Form.Item :label="$t('generator.config.basic.tableName')">
            <Input v-model:value="formData.tableName" disabled />
          </Form.Item>
          <Form.Item :label="$t('generator.config.basic.tableComment')">
            <Input v-model:value="formData.tableComment" disabled />
          </Form.Item>
          <Form.Item :label="$t('generator.config.basic.moduleName')">
            <Input
              v-model:value="formData.moduleName"
              :placeholder="$t('generator.config.basic.moduleNamePlaceholder')"
            />
          </Form.Item>
          <Form.Item :label="$t('generator.config.basic.businessName')">
            <Input
              v-model:value="formData.businessName"
              :placeholder="
                $t('generator.config.basic.businessNamePlaceholder')
              "
            />
          </Form.Item>
          <Form.Item :label="$t('generator.config.basic.modulePath')">
            <Input
              v-model:value="formData.modulePath"
              :placeholder="$t('generator.config.basic.modulePathPlaceholder')"
            />
          </Form.Item>
          <Form.Item :label="$t('generator.config.basic.permissionPrefix')">
            <Input
              v-model:value="formData.permissionPrefix"
              :placeholder="
                $t('generator.config.basic.permissionPrefixPlaceholder')
              "
            />
          </Form.Item>
        </Form>
      </TabPane>

      <TabPane key="fields" :tab="$t('generator.config.tabs.fields')">
        <FieldGrid />
      </TabPane>

      <TabPane key="options" :tab="$t('generator.config.tabs.options')">
        <div class="generation-options">
          <div class="option-group">
            <h4>{{ $t('generator.config.options.backend.title') }}</h4>
            <Checkbox.Group v-model:value="formData.backendOptions">
              <Checkbox value="entity">
                {{ $t('generator.config.options.backend.entity') }}
              </Checkbox>
              <Checkbox value="dto">
                {{ $t('generator.config.options.backend.dto') }}
              </Checkbox>
              <Checkbox value="service">
                {{ $t('generator.config.options.backend.service') }}
              </Checkbox>
              <Checkbox value="controller">
                {{ $t('generator.config.options.backend.controller') }}
              </Checkbox>
              <Checkbox value="module">
                {{ $t('generator.config.options.backend.module') }}
              </Checkbox>
            </Checkbox.Group>
          </div>

          <div class="option-group">
            <h4>{{ $t('generator.config.options.frontend.title') }}</h4>
            <Checkbox.Group v-model:value="formData.frontendOptions">
              <Checkbox value="api">
                {{ $t('generator.config.options.frontend.api') }}
              </Checkbox>
              <Checkbox value="types">
                {{ $t('generator.config.options.frontend.types') }}
              </Checkbox>
              <Checkbox value="enum">
                {{ $t('generator.config.options.frontend.enum') }}
              </Checkbox>
              <Checkbox value="list">
                {{ $t('generator.config.options.frontend.list') }}
              </Checkbox>
              <Checkbox value="form">
                {{ $t('generator.config.options.frontend.form') }}
              </Checkbox>
              <Checkbox value="table-columns">
                {{ $t('generator.config.options.frontend.tableColumns') }}
              </Checkbox>
              <Checkbox value="form-schemas">
                {{ $t('generator.config.options.frontend.formSchemas') }}
              </Checkbox>
              <Checkbox value="search-config">
                {{ $t('generator.config.options.frontend.searchConfig') }}
              </Checkbox>
            </Checkbox.Group>
          </div>

          <div class="option-group">
            <h4>{{ $t('generator.config.options.features.title') }}</h4>
            <Checkbox.Group v-model:value="formData.features">
              <Checkbox value="add">
                {{ $t('generator.config.options.features.add') }}
              </Checkbox>
              <Checkbox value="edit">
                {{ $t('generator.config.options.features.edit') }}
              </Checkbox>
              <Checkbox value="delete">
                {{ $t('generator.config.options.features.delete') }}
              </Checkbox>
              <Checkbox value="batchDelete">
                {{ $t('generator.config.options.features.batchDelete') }}
              </Checkbox>
              <Checkbox value="export">
                {{ $t('generator.config.options.features.export') }}
              </Checkbox>
              <Checkbox value="import">
                {{ $t('generator.config.options.features.import') }}
              </Checkbox>
            </Checkbox.Group>
          </div>
        </div>
      </TabPane>
    </Tabs>

    <template #extra>
      <Space>
        <Button @click="handleSave" :loading="loading">
          {{ $t('generator.config.actions.save') }}
        </Button>
        <Button @click="handlePreview" :loading="loading">
          {{ $t('generator.config.actions.preview') }}
        </Button>
        <Button type="primary" @click="handleGenerate" :loading="loading">
          {{ $t('generator.config.actions.generate') }}
        </Button>
      </Space>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
.generation-options {
  .option-group {
    margin-bottom: 20px;

    h4 {
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
