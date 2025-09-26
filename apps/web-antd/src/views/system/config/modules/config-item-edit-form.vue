<script setup lang="ts">
import { computed, watch } from 'vue';

import { VbenIcon, VbenSpinner } from '@vben-core/shadcn-ui';

import { useQuery } from '@tanstack/vue-query';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  batchUpdateConfigValues,
  queryConfigItemByGroupId,
} from '#/api/system/config';
import { $t } from '#/locales';

import { buildFormSchemasFromConfigItems } from './form-schema-builder';

interface ConfigItemEditFormProps {
  groupId: number;
}

const props = defineProps<ConfigItemEditFormProps>();

/**
 * 查询配置项数据
 */
const {
  data: configItemList,
  refetch: refetchConfigItems,
  isLoading: isConfigItemsLoading,
} = useQuery({
  queryKey: ['configItems', () => props.groupId],
  queryFn: () => queryConfigItemByGroupId(props.groupId),
  staleTime: 1000 * 60 * 5, // 缓存5分钟
});

/**
 * 处理表单提交 - 批量保存配置值
 * @param formValues 表单提交的值
 */
const handleSubmitConfigValues = async (formValues: Record<string, any>) => {
  try {
    const configUpdateList = configItemList.value?.map((configItem) => ({
      id: configItem.id,
      configKey: configItem.configKey,
      configValue: formValues[configItem.configKey] || '',
    }));

    await batchUpdateConfigValues({
      configs: configUpdateList,
    });

    message.success($t('ui.actionMessage.operationSuccess'));
    refetchConfigItems();
  } catch {
    message.error($t('ui.actionMessage.operationFailed'));
  }
};

/**
 * 处理表单重置 - 重置为原始配置值
 */
const handleResetFormToOriginalValues = () => {
  const originalFormValues = configItemList.value?.reduce(
    (formValueAccumulator, currentConfigItem) => {
      formValueAccumulator[currentConfigItem.configKey] =
        currentConfigItem.configValue;
      return formValueAccumulator;
    },
    {} as Record<string, any>,
  );

  configEditFormApi.setValues(originalFormValues || {});
};

/**
 * 配置编辑表单实例
 */
const [ConfigEditForm, configEditFormApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  layout: 'horizontal',
  schema: [],
  handleSubmit: handleSubmitConfigValues,
  handleReset: handleResetFormToOriginalValues,
  wrapperClass: 'grid-cols-1',
});

/**
 * 动态构建表单Schema
 */
const configFormSchema = computed(() => {
  if (!configItemList.value || configItemList.value.length === 0) {
    return [];
  }

  return buildFormSchemasFromConfigItems(configItemList.value);
});

/**
 * 监听表单Schema变化，动态更新表单结构
 */
watch(
  configFormSchema,
  (updatedFormSchema) => {
    configEditFormApi.setState({ schema: updatedFormSchema });
  },
  { deep: true },
);

/**
 * 暴露给父组件的方法
 */
defineExpose({
  refetchConfigItems,
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-base font-medium text-gray-900">
        {{ $t('system.config.configItem.batchUpdateValues') }}
      </h4>
    </div>

    <VbenSpinner
      v-if="isConfigItemsLoading && !configItemList"
      :spinning="true"
      class="min-h-[400px]"
    />

    <div
      v-else-if="configItemList && configItemList.length > 0"
      class="rounded-lg border border-gray-200 bg-white p-4"
    >
      <ConfigEditForm />
    </div>

    <div
      v-else
      class="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-gray-200"
    >
      <div class="text-center">
        <VbenIcon
          icon="ri:settings-line"
          class="mx-auto mb-4 size-12 text-gray-300"
        />
        <p class="text-sm text-gray-500">当前配置组暂无配置项</p>
        <p class="mt-1 text-xs text-gray-400">请在右侧添加配置项</p>
      </div>
    </div>
  </div>
</template>
