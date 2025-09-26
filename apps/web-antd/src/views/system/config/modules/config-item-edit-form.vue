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

interface Props {
  groupId: number;
}

const props = defineProps<Props>();

const {
  data: configItems,
  refetch,
  isLoading,
} = useQuery({
  queryKey: ['configItems', () => props.groupId],
  queryFn: () => queryConfigItemByGroupId(props.groupId),
  staleTime: 1000 * 60 * 5,
});

const handleSaveValues = async (values: Record<string, any>) => {
  try {
    await batchUpdateConfigValues({
      configs: configItems.value?.map((item) => ({
        id: item.id,
        configKey: item.configKey,
        configValue: values[item.configKey] || '',
      })),
    });
    message.success($t('ui.actionMessage.operationSuccess'));
    refetch();
  } catch {
    message.error($t('ui.actionMessage.operationFailed'));
  }
};

const [EditForm, editFormApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  layout: 'horizontal',
  schema: [],
  handleSubmit: handleSaveValues,
  handleReset: () => {
    const values = configItems.value?.reduce(
      (acc, item) => {
        acc[item.configKey] = item.configValue;
        return acc;
      },
      {} as Record<string, any>,
    );
    editFormApi.setValues(values || {});
  },
  wrapperClass: 'grid-cols-1',
});

const valueFormSchema = computed(() => {
  if (!configItems.value || configItems.value.length === 0) {
    return [];
  }

  return buildFormSchemasFromConfigItems(configItems.value);
});

watch(
  valueFormSchema,
  (newSchema) => {
    editFormApi.setState({ schema: newSchema });
  },
  { deep: true },
);

defineExpose({
  refetch,
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
      v-if="isLoading && !configItems"
      :spinning="true"
      class="min-h-[400px]"
    />

    <div
      v-else-if="configItems && configItems.length > 0"
      class="rounded-lg border border-gray-200 bg-white p-4"
    >
      <EditForm />
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
