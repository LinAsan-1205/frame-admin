<script lang="ts" setup>
import type { FileCategory } from '#/api/system/file/category';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addFileCategory, setFileCategory } from '#/api/system/file/category';
import { $t } from '#/locales';

import { useCategoryFormSchema } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<FileCategory.View>();
const id = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  schema: useCategoryFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: FileCategory.Post = await formApi.getValues();
    modalApi.lock();
    (id.value ? setFileCategory(id.value, values) : addFileCategory(values))
      .then(() => {
        emits('success');
        modalApi.close();
      })
      .catch(() => {
        modalApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<FileCategory.View>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.fileCategory.name'))
    : $t('common.create', $t('system.fileCategory.name'));
});
</script>
<template>
  <Modal :title="getDrawerTitle">
    <Form />
  </Modal>
</template>
<style lang="css" scoped></style>
