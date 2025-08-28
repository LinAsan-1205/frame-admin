<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { Role } from '#/api/system/role';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal, VbenTree } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { message, Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api/system/menu';
import { assignRoleMenu } from '#/api/system/role';
import { $t } from '#/locales';

const emit = defineEmits(['success']);

const currentRoleData = ref<Role.View>();

const menuTreeData = ref<DataNode[]>([]);

const isMenuLoading = ref(false);

const assignedAuthTitle = computed(() => $t('system.role.assignedAuth'));

const [AssignedAuthForm, assignedAuthFormApi] = useVbenForm({
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'name',
      label: $t('system.role.roleName'),
    },
    {
      component: 'Input',
      componentProps: {
        disabled: true,
      },
      fieldName: 'code',
      label: $t('system.role.code'),
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: $t('system.role.assignedAuth'),
      modelPropName: 'modelValue',
    },
  ],
  showDefaultActions: false,
});

function showOperationSuccessMsg() {
  message.success({
    content: $t('ui.actionMessage.operationSuccess'),
    key: 'action_process_msg',
  });
}

async function loadMenuTreeData() {
  isMenuLoading.value = true;
  try {
    const menuList = await getMenuList();
    menuTreeData.value = menuList as unknown as DataNode[];
  } finally {
    isMenuLoading.value = false;
  }
}

// 处理节点样式
function getMenuNodeClass(menuNode: Recordable<any>) {
  const nodeClassList: string[] = [];
  if (menuNode.value?.type === 'button') {
    nodeClassList.push('inline-flex');
    if (menuNode.index % 3 >= 1) {
      nodeClassList.push('!pl-0');
    }
  }
  return nodeClassList.join(' ');
}

const [AssignedAuthModal, assignedAuthModalApi] = useVbenModal({
  /**
   * 确认分配权限
   */
  async onConfirm() {
    const { valid } = await assignedAuthFormApi.validate();
    if (valid) {
      assignedAuthModalApi.lock();
      const { permissions: selectedMenuIds = [] } =
        await assignedAuthFormApi.getValues();
      try {
        if (!currentRoleData.value?.id) return;
        await assignRoleMenu(currentRoleData.value.id, selectedMenuIds);
        assignedAuthModalApi.close();
        showOperationSuccessMsg();
        emit('success');
      } finally {
        assignedAuthModalApi.lock(false);
      }
    }
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const roleViewData = assignedAuthModalApi.getData<Role.View>();
      if (menuTreeData.value.length === 0) {
        await loadMenuTreeData();
      }
      await nextTick();
      if (roleViewData) {
        currentRoleData.value = roleViewData;
        assignedAuthFormApi.setValues({
          permissions: roleViewData.menuIds,
          name: roleViewData.name,
          code: roleViewData.code,
        });
      }
    }
  },
});
</script>

<template>
  <AssignedAuthModal :title="assignedAuthTitle">
    <AssignedAuthForm class="mx-4">
      <template #permissions="slotProps">
        <Spin :spinning="isMenuLoading" wrapper-class-name="w-full">
          <VbenTree
            :tree-data="menuTreeData"
            multiple
            bordered
            :default-expanded-level="2"
            :get-node-class="getMenuNodeClass"
            v-bind="slotProps"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
          >
            <template #node="{ value }">
              <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
              {{ $t(value.meta.title) }}
            </template>
          </VbenTree>
        </Spin>
      </template>
    </AssignedAuthForm>
  </AssignedAuthModal>
</template>
