<script lang="ts" setup>
import type { User } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { findAllEnabledRoles } from '#/api/system/role';
import { assignUserRole } from '#/api/system/user';
import { $t } from '#/locales';

const emit = defineEmits(['success']);

const currentUserData = ref<User.View>();

const assignedRoleTitle = computed(() => {
  return $t('system.user.assignedRole');
});

const [AssignedRoleForm, assignedRoleFormApi] = useVbenForm({
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'userName',
      label: $t('system.user.userName'),
    },
    {
      component: 'ApiSelect',
      componentProps: {
        api: async () => {
          // 查询所有启用的角色
          const enabledRoleList = await findAllEnabledRoles();
          return enabledRoleList.map((roleItem) => ({
            label: roleItem.name,
            value: roleItem.id,
          }));
        },
        mode: 'multiple',
        class: 'w-full',
        allowClear: true,
      },
      fieldName: 'roleIdList',
      label: $t('system.role.name'),
    },
  ],
  showDefaultActions: false,
});

const [AssignedRoleModal, assignedRoleModalApi] = useVbenModal({
  /**
   * 确认分配角色
   */
  async onConfirm() {
    const { valid } = await assignedRoleFormApi.validate();
    if (valid) {
      assignedRoleModalApi.lock();
      // 获取表单中的角色ID列表
      const { roleIdList = [] } = await assignedRoleFormApi.getValues();
      try {
        if (!currentUserData.value?.id) return;
        await assignUserRole(currentUserData.value.id, roleIdList);
        assignedRoleModalApi.close();
        message.success({
          content: $t('ui.actionMessage.operationSuccess'),
          key: 'action_process_msg',
        });
        emit('success');
      } finally {
        assignedRoleModalApi.lock(false);
      }
    }
  },

  onOpenChange(isOpen) {
    if (isOpen) {
      const userViewData = assignedRoleModalApi.getData<User.View>();
      if (userViewData) {
        currentUserData.value = userViewData;
        const roleIdList = userViewData.roles.map((roleItem) => roleItem.id);
        const userName = userViewData.userName;
        assignedRoleFormApi.setValues({
          roleIdList,
          userName,
        });
      }
    }
  },
});
</script>

<template>
  <AssignedRoleModal :title="assignedRoleTitle">
    <AssignedRoleForm class="mx-4" />
  </AssignedRoleModal>
</template>
