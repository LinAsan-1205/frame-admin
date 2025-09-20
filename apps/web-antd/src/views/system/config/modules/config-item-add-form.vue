<script setup lang="ts">
import type { ConfigItem } from '#/api/system/config';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addConfigItem } from '#/api/system/config';
import { $t } from '#/locales';

import { useConfigItemAddFormSchema } from '../config/form-schemas';

interface Props {
  groupId?: number;
  onSuccess?: () => void;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  success: [];
}>();

const handleSaveItem = async (values: Record<string, any>) => {
  try {
    if (!props.groupId) {
      message.error('配置组ID不能为空');
      return;
    }

    const submitData = {
      ...(values as ConfigItem.View),
      groupId: props.groupId,
    };

    await addConfigItem(submitData);
    message.success($t('common.createSuccess'));
    addFormApi.resetForm();
    emit('success');
    props.onSuccess?.();
  } catch (error) {
    console.error('保存配置项失败:', error);
    message.error($t('common.operationFailed'));
  }
};

const [AddForm, addFormApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  schema: useConfigItemAddFormSchema(),
  handleSubmit: handleSaveItem,
  wrapperClass: 'grid-cols-1',
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h4 class="text-base font-medium text-gray-900">
        {{ $t('common.create') }}{{ $t('system.config.configItem.name') }}
      </h4>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <AddForm />
    </div>
  </div>
</template>
