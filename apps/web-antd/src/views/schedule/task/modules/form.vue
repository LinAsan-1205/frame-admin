<script lang="ts" setup>
import type { Task } from '#/api/schedule/task';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addTask, setTask } from '#/api/schedule/task';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
  commonConfig: {
    labelWidth: 130,
    componentProps: {
      class: 'w-full',
    },
  },
});

const taskId = ref<number>();

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: Task.Post = await formApi.getValues();
    modalApi.lock();
    (taskId.value ? setTask(taskId.value, values) : addTask(values))
      .then(() => {
        emits('success');
        modalApi.close();
      })
      .catch(() => {
        modalApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<Task.View>();
      formApi.resetForm();
      taskId.value = data ? data.id : undefined;
      if (data) {
        formApi.setValues(data);
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return taskId.value ? $t('common.edit') : $t('common.create');
});
</script>
<template>
  <Modal :title="getDrawerTitle">
    <Form />
  </Modal>
</template>
