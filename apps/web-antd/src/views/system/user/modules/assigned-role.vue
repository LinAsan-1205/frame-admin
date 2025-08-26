<script lang="ts" setup>
import type { User } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { findAllEnabledRoles } from '#/api/system/role';
import { assignUserRole } from '#/api/system/user';
import { $t } from '#/locales';

const emit = defineEmits(['success']);
const formData = ref<User.View>();
const getTitle = computed(() => {
  return $t('system.user.assignedRole');
});

const [Form, formApi] = useVbenForm({
  layout: 'horizontal',
  schema: [
    {
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          const roles = await findAllEnabledRoles();
          return roles.map((role) => ({
            label: role.name,
            value: role.id,
          }));
        },
        mode: 'multiple',
        class: 'w-full',
        allowClear: true,
      },
      fieldName: 'roleIds',
      label: $t('system.role.name'),
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (valid) {
      modalApi.lock();
      const { roleIds = [] } = await formApi.getValues();
      try {
        if (!formData.value?.id) return;
        await assignUserRole(formData.value.id, roleIds);
        modalApi.close();
        emit('success');
      } finally {
        modalApi.lock(false);
      }
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<User.View>();
      if (data) {
        formData.value = data;
        formApi.setValues({
          roleIds: data?.roles?.map((role) => role.id),
        });
      }
    }
  },
});
</script>

<template>
  <Modal :title="getTitle">
    <Form class="mx-4" />
  </Modal>
</template>
