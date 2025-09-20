<script lang="ts" setup>
import type { User } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { assignUserRole } from '#/api/system/user';
import { $t } from '#/locales';

import { useRoleAssignFormSchema } from '../config/form-schemas';

const emit = defineEmits(['success']);

const currentUserData = ref<User.View>();

const assignedRoleTitle = computed(() => {
  return $t('system.user.assignedRole');
});

const [AssignedRoleForm, assignedRoleFormApi] = useVbenForm({
  layout: 'horizontal',
  schema: useRoleAssignFormSchema(),
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
