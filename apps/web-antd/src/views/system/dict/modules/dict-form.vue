<script lang="ts" setup>
import type { Dict } from '#/api/system/dict';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { addDict, setDictById } from '#/api/system/dict';
import { $t } from '#/locales';

import { useDictFormSchema } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<Dict.View>();
const id = ref();

const [Form, formApi] = useVbenForm({
  schema: useDictFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: Dict.Post = await formApi.getValues();
    modalApi.lock();
    (id.value ? setDictById(id.value, values) : addDict(values))
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
      const data = modalApi.getData<Dict.View>();
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

const getModalTitle = computed(() => {
  return `${formData.value?.id ? $t('common.edit') : $t('common.create')}${$t('system.dict.name')}`;
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>

<style lang="css" scoped></style>
