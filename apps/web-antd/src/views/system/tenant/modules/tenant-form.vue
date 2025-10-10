<script setup lang="ts">
import type { Tenant } from '#/api/system/tenant';

import { computed, nextTick, ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { queryPackageList } from '#/api/system/package';
import { addTenant, setTenant } from '#/api/system/tenant';
import { $t } from '#/locales';

import { useFormSchemaConfig } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<Tenant.View>();
const packageOptions = ref<Array<{ label: string; value: number }>>([]);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    controlClass: 'w-full',
  },
  schema: useFormSchemaConfig(),
  showDefaultActions: false,
});

const id = ref();
const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values: Tenant.Edit = await formApi.getValues();
    modalApi.lock();
    (id.value ? setTenant(id.value, values) : addTenant(values))
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
      const data = modalApi.getData<Tenant.View>();
      formApi.resetForm();

      if (data) {
        formData.value = data;
        id.value = data.id;
      } else {
        id.value = undefined;
      }

      if (packageOptions.value.length === 0) {
        await loadPackageOptions();
      }
      // Wait for Vue to flush DOM updates (form fields mounted)
      await nextTick();
      if (data) {
        formApi.setValues(data);
      }
    }
  },
});

// 加载套餐选项
async function loadPackageOptions() {
  try {
    const packages = await queryPackageList();
    packageOptions.value = packages.map((pkg) => ({
      label: pkg.packageName,
      value: pkg.id,
    }));
  } catch (error) {
    console.error('加载套餐列表失败:', error);
  }
}

const getModalTitle = computed(() => {
  return formData.value?.id
    ? `${$t('common.edit')} ${$t('tenant.name')}`
    : `${$t('common.create')} ${$t('tenant.name')}`;
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form />
  </Modal>
</template>
