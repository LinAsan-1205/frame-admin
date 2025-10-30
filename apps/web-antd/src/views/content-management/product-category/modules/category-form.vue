<script setup lang="ts">
import type { ProductCategory } from '#/api/content-management/product-category';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import {
  addProductCategory,
  setProductCategoryById,
} from '#/api/content-management/product-category';
import { $t } from '#/locales';

import { useFormSchema } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<ProductCategory.View>();
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
    const values: ProductCategory.Create = await formApi.getValues();
    modalApi.lock();
    (id.value
      ? setProductCategoryById(id.value, values)
      : addProductCategory(values)
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
      const data = modalApi.getData<ProductCategory.View>();
      formApi.resetForm();
      if (data && data.id) {
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
  return formData.value?.id
    ? $t('common.edit') + $t('content-management.category.title')
    : $t('common.add') + $t('content-management.category.title');
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
