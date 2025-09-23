<script lang="ts" setup>
import { ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Button, Card, Step, Steps } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import CodePreview from './code-preview.vue';
// 导入 composables
import { useGeneratorConfig } from './composables/useGeneratorConfig';
import { useStepNavigation } from './composables/useStepNavigation';
// 导入配置文件
import { createFieldColumns } from './config/field-columns';
import {
  createBasicFormSchema,
  createOptionsFormSchema,
} from './config/form-schemas';

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

// 使用 composables
const {
  currentStep,
  onBasicFormSubmit,
  onFieldStepNext,
  onFieldStepPrev,
  onOptionsFormSubmit,
  onOptionsStepReset,
} = useStepNavigation();
const { loading, loadTableConfig, handleSave, handlePreview, handleGenerate } =
  useGeneratorConfig();

const needMerge = ref(true);

// 创建表单
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
  schema: createBasicFormSchema(),
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
  schema: createOptionsFormSchema(),
  submitButtonOptions: {
    show: false,
  },
  wrapperClass: 'grid-cols-1',
});

// 预览抽屉
const [PreviewDrawer, previewDrawerApi] = useVbenDrawer({
  connectedComponent: CodePreview,
  destroyOnClose: true,
  title: $t('generator.preview.title'),
});

// 字段表格
const [FieldGrid, fieldGridApi] = useVbenVxeGrid({
  showSearchForm: false,
  gridOptions: {
    columns: createFieldColumns(),
    data: [],
    height: 600,
    editConfig: {
      trigger: 'click',
      mode: 'cell',
    },
    pagerConfig: {
      enabled: false,
    },
    rowConfig: {
      keyField: 'columnName',
    },
  },
});

// 监听表信息变化
watch(
  () => props.tableInfo,
  async (newVal) => {
    if (newVal) {
      const { basicData, optionsData, columns } = await loadTableConfig(newVal);

      // 设置表单数据
      basicFormApi.setValues(basicData);
      optionsFormApi.setValues(optionsData);

      // 设置字段表格数据
      fieldGridApi.setState({
        gridOptions: {
          data: columns,
        },
      });
    }
  },
  { immediate: true },
);

// 事件处理函数
const onSave = () =>
  handleSave(basicFormApi, optionsFormApi, fieldGridApi, needMerge.value);
const onPreview = () =>
  handlePreview(
    basicFormApi,
    optionsFormApi,
    fieldGridApi,
    needMerge.value,
    previewDrawerApi,
  );
const onGenerate = () =>
  handleGenerate(
    basicFormApi,
    optionsFormApi,
    fieldGridApi,
    needMerge.value,
    emit,
  );
</script>

<template>
  <PreviewDrawer />
  <Card title="代码生成配置" class="h-full">
    <template #extra>
      <div class="flex items-center space-x-4">
        <Button @click="onSave" :loading="loading">
          {{ $t('generator.config.actions.save') }}
        </Button>
        <Button @click="onPreview" :loading="loading">
          {{ $t('generator.config.actions.preview') }}
        </Button>
        <Button type="primary" @click="onGenerate" :loading="loading">
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
