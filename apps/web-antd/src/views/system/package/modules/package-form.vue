<script setup lang="ts">
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Package } from '#/api/system/package';

import { computed, nextTick, ref } from 'vue';

import { Tree, useVbenForm, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Spin } from 'ant-design-vue';

import { getMenuTreeList } from '#/api/system/menu';
import { addPackage, setPackage } from '#/api/system/package';
import { $t } from '#/locales';

import { useFormSchemaConfig } from '../config/form-schemas';

const emits = defineEmits(['success']);

const formData = ref<Package.View>();

const menuTreeData = ref<DataNode[]>([]);
const isMenuLoading = ref(false);

async function loadMenuTreeData() {
  isMenuLoading.value = true;
  try {
    const menuList = await getMenuTreeList();
    menuTreeData.value = menuList as unknown as DataNode[];
  } finally {
    isMenuLoading.value = false;
  }
}

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
    const values: Package.Edit = await formApi.getValues();
    modalApi.lock();
    (id.value ? setPackage(id.value, values) : addPackage(values))
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
      const data = modalApi.getData<Package.View>();
      formApi.resetForm();

      if (menuTreeData.value.length === 0) {
        await loadMenuTreeData();
      }

      if (data) {
        formData.value = data;
        id.value = data.id;
      } else {
        id.value = undefined;
      }

      // Wait for Vue to flush DOM updates (form fields mounted)
      await nextTick();
      if (data) {
        formApi.setValues(data);
      }
    }
  },
});

const getModalTitle = computed(() => {
  return formData.value?.id
    ? `${$t('common.edit')} ${$t('tenant.package.name')}`
    : `${$t('common.create')} ${$t('tenant.package.name')}`;
});
</script>

<template>
  <Modal :title="getModalTitle">
    <Form>
      <template #menuIds="slotProps">
        <Spin :spinning="isMenuLoading" wrapper-class-name="w-full">
          <Tree
            :tree-data="menuTreeData"
            multiple
            bordered
            :default-expanded-level="2"
            v-bind="slotProps"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
          >
            <template #node="{ value }">
              <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
              {{ $t(value.meta.title) }}
            </template>
          </Tree>
        </Spin>
      </template>
    </Form>
  </Modal>
</template>
