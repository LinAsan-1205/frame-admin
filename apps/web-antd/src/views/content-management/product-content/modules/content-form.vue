<script setup lang="ts">
import type { ProductContent } from '#/api/content-management/product-content';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  addProductContent,
  setProductContentById,
} from '#/api/content-management/product-content';
import { $t } from '#/locales';

import { useFormSchema } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<ProductContent.View>();
const id = ref();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  schema: useFormSchema(),
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: ProductContent.Create = await formApi.getValues();
    modalApi.lock();
    (id.value
      ? setProductContentById(id.value, values)
      : addProductContent(values)
    )
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
      const data = modalApi.getData<ProductContent.View>();
      formApi.resetForm();
      if (data && data.id) {
        formData.value = data;
        id.value = data.id;
        // 处理关联对象，提取 categoryId
        const formValues = {
          ...data,
          categoryId: data.category?.id || data.categoryId,
        };
        formApi.setValues(formValues);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getModalTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit') + $t('content-management.content.titleField')
    : $t('common.add') + $t('content-management.content.titleField');
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
