<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Button, Card, message, Step, Steps } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  generateCode,
  getTableColumns,
  previewCode,
  saveGeneratorConfig,
} from '#/api/generator';
import {
  BackendOption,
  FeatureOption,
  FormType,
  FrontendOption,
  QueryType,
} from '#/api/generator/enum';
import { $t } from '#/locales';

import CodePreview from './code-preview.vue';

interface TableInfo {
  tableName: string;
  tableComment?: string;
}

const props = defineProps<{
  tableInfo: TableInfo;
}>();

const emit = defineEmits<{
  success: [];
}>();

const currentStep = ref(0);
const loading = ref(false);
const columns = ref<any[]>([]);
const needMerge = ref(true);

function onBasicFormSubmit(_values: Record<string, any>) {
  currentStep.value = 1;
}

function onFieldStepNext() {
  currentStep.value = 2;
}

function onFieldStepPrev() {
  currentStep.value = 0;
}

function onOptionsFormSubmit(_values: Record<string, any>) {}

function onOptionsStepReset() {
  currentStep.value = 1;
}

const [BasicForm, basicFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onBasicFormSubmit,
  layout: 'vertical',
  resetButtonOptions: {
    show: false,
  },
  schema: [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'tableName',
      label: $t('generator.config.basic.tableName'),
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'tableComment',
      label: $t('generator.config.basic.tableComment'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('generator.config.basic.moduleNamePlaceholder'),
      },
      fieldName: 'moduleName',
      label: $t('generator.config.basic.moduleName'),
      rules: z
        .string()
        .min(2, '模块名称长度至少2个字符')
        .max(50, '模块名称长度不超过50个字符')
        .regex(
          /^[a-z]\w*$/i,
          '模块名称只能包含字母、数字和下划线，且以字母开头',
        ),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('generator.config.basic.businessNamePlaceholder'),
      },
      fieldName: 'businessName',
      label: $t('generator.config.basic.businessName'),
      rules: z
        .string()
        .min(2, '业务名称长度至少2个字符')
        .max(50, '业务名称长度不超过50个字符'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('generator.config.basic.modulePathPlaceholder'),
      },
      fieldName: 'modulePath',
      label: $t('generator.config.basic.modulePath'),
      rules: z
        .string()
        .min(1, '请输入模块路径')
        .regex(/^[\w/]+$/, '模块路径只能包含字母、数字、下划线和斜杠'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('generator.config.basic.permissionPrefixPlaceholder'),
      },
      fieldName: 'permissionPrefix',
      label: $t('generator.config.basic.permissionPrefix'),
      rules: z
        .string()
        .min(1, '请输入权限前缀')
        .regex(/^[\w:]+$/, '权限前缀只能包含字母、数字、下划线和冒号'),
    },
  ],
  submitButtonOptions: {
    content: '下一步',
  },
  wrapperClass: 'grid-cols-1',
});

const [OptionsForm, optionsFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleReset: onOptionsStepReset,
  handleSubmit: onOptionsFormSubmit,
  layout: 'vertical',
  resetButtonOptions: {
    content: '上一步',
  },
  schema: [
    {
      component: 'CheckboxGroup',
      componentProps: {
        options: BackendOption.toSelect(),
      },
      fieldName: 'backendOptions',
      label: $t('generator.config.options.backend.title'),
      rules: z.array(z.string()).min(1, '请至少选择一个后端选项'),
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        options: FrontendOption.toSelect(),
      },
      fieldName: 'frontendOptions',
      label: $t('generator.config.options.frontend.title'),
      rules: z.array(z.string()).min(1, '请至少选择一个前端选项'),
    },
    {
      component: 'CheckboxGroup',
      componentProps: {
        options: FeatureOption.toSelect(),
      },
      fieldName: 'features',
      label: $t('generator.config.options.features.title'),
      rules: z.array(z.string()).min(1, '请至少选择一个功能特性'),
    },
  ],
  submitButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1',
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

const [FieldGrid, fieldGridApi] = useVbenVxeGrid({
  showSearchForm: false,
  gridOptions: {
    columns: fieldColumns,
    data: [],
    height: 600,
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
      const basicData = {
        tableName: newVal.tableName,
        tableComment: newVal.tableComment || '',
        moduleName: extractModuleName(newVal.tableName),
        businessName: newVal.tableComment?.replace(/表$/, '') || '',
        modulePath: generateModulePath(newVal.tableName),
        permissionPrefix: generatePermissionPrefix(newVal.tableName),
      };

      const optionsData = {
        backendOptions: [...BackendOption.toValue()],
        frontendOptions: [...FrontendOption.toValue()],
        features: [
          FeatureOption.Add,
          FeatureOption.Edit,
          FeatureOption.Delete,
          FeatureOption.BatchDelete,
        ],
      };

      basicFormApi.setValues(basicData);
      optionsFormApi.setValues(optionsData);

      columns.value = await getTableColumns(newVal.tableName);
      fieldGridApi.setState({
        gridOptions: {
          data: columns.value,
        },
      });
    }
  },
  { immediate: true },
);

async function handleMergeSubmit() {
  try {
    loading.value = true;

    const mergedValues = await basicFormApi
      .merge(optionsFormApi)
      .submitAllForm(needMerge.value);

    const config = {
      ...mergedValues,
      fields: fieldGridApi?.grid?.getData?.() || columns.value,
    };

    const result = await generateCode(config);
    if (result.success) {
      message.success('代码生成成功！');
      emit('success');
    }
  } catch {
    message.error('代码生成失败，请检查配置');
  } finally {
    loading.value = false;
  }
}

// 保存配置
async function handleSave() {
  try {
    loading.value = true;

    const mergedValues = await basicFormApi
      .merge(optionsFormApi)
      .submitAllForm(needMerge.value);

    const config = {
      ...mergedValues,
      fields: fieldGridApi?.grid?.getData() || columns.value,
    };

    await saveGeneratorConfig(config);
    message.success($t('generator.config.actions.saveSuccess'));
  } catch {
    message.error('保存失败');
  } finally {
    loading.value = false;
  }
}

async function handlePreview() {
  try {
    loading.value = true;

    const mergedValues = await basicFormApi
      .merge(optionsFormApi)
      .submitAllForm(needMerge.value);

    const config = {
      ...mergedValues,
      fields: fieldGridApi?.grid?.getData?.(),
    };

    const result = await previewCode(config);
    previewDrawerApi.setData(result).open();
  } catch {
    message.error('预览失败');
  } finally {
    loading.value = false;
  }
}

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
  <Card title="代码生成配置" class="h-full">
    <template #extra>
      <div class="flex items-center space-x-4">
        <Button @click="handleSave" :loading="loading">
          {{ $t('generator.config.actions.save') }}
        </Button>
        <Button @click="handlePreview" :loading="loading">
          {{ $t('generator.config.actions.preview') }}
        </Button>
        <Button type="primary" @click="handleMergeSubmit" :loading="loading">
          {{ $t('generator.config.actions.generate') }}
        </Button>
      </div>
    </template>

    <div class="mx-auto max-w-4xl">
      <Steps :current="currentStep" class="steps mb-8">
        <Step title="基础配置" description="配置模块基础信息" />
        <Step title="字段配置" description="配置表字段属性" />
        <Step title="生成选项" description="选择生成内容和功能" />
      </Steps>

      <div class="p-6">
        <!-- 第一步：基础配置 -->
        <div v-show="currentStep === 0">
          <div class="max-w-2xl">
            <BasicForm />
          </div>
        </div>

        <!-- 第二步：字段配置 -->
        <div v-show="currentStep === 1">
          <div class="mb-4">
            <h3 class="mb-2 text-lg font-medium">字段配置</h3>
            <p class="mb-4 text-gray-600">配置表字段的生成属性和验证规则</p>
          </div>
          <FieldGrid />
          <div class="mt-6 flex justify-between">
            <Button @click="onFieldStepPrev">上一步</Button>
            <Button type="primary" @click="onFieldStepNext">下一步</Button>
          </div>
        </div>

        <!-- 第三步：生成选项 -->
        <div v-show="currentStep === 2">
          <div class="max-w-2xl">
            <OptionsForm />
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
.steps {
  :deep(.ant-steps-item-title) {
    font-size: 16px;
    font-weight: 500;
  }

  :deep(.ant-steps-item-description) {
    color: #666;
  }
}
</style>
