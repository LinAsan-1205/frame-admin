<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Role } from '#/api/system/role';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteRoleById,
  queryRolePage,
  setRoleStatus,
} from '#/api/system/role';
import { $t } from '#/locales';

import { useColumns, useSearchFormOptions } from './data';
import AssignedAuth from './modules/assigned-auth.vue';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const searchFormOptions = useSearchFormOptions();

const [RoleGrid, roleGridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await queryRolePage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
            },
            formValues,
          );
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
  } as VxeTableGridOptions<Role.View>,
});

const [AssignedAuthModal, assignedAuthModalApi] = useVbenModal({
  connectedComponent: AssignedAuth,
  destroyOnClose: true,
});

async function onActionClick(actionParams: OnActionClickParams<Role.View>) {
  switch (actionParams.code) {
    case 'assignedAuth': {
      assignedAuthModalApi.setData(actionParams.row).open();
      break;
    }
    case 'delete': {
      await onDeleteRole(actionParams.row);
      break;
    }
    case 'edit': {
      onEditRole(actionParams.row);
      break;
    }
  }
}

function confirmModal(content: string, title: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        resolve(true);
      },
      title,
    });
  });
}

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param roleView 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(newStatus: string, roleView: Role.View) {
  // 状态映射
  const statusMap: Recordable<string> = {
    1: '禁用',
    0: '启用',
  };
  try {
    const statusText = statusMap[newStatus.toString()];
    await confirmModal(
      `你要将${roleView.name}的状态切换为 【${statusText}】 吗？`,
      `切换状态`,
    );
    await setRoleStatus(roleView.id, newStatus);
    return true;
  } catch {
    return false;
  }
}

function onEditRole(roleView: Role.View) {
  formModalApi.setData(roleView).open();
}

/**
 * 删除角色
 * @param roleView 角色数据
 */
async function onDeleteRole(roleView: Role.View) {
  const deletingContent = $t('ui.actionMessage.deleting', [roleView.name]);
  const deleteSuccessContent = $t('ui.actionMessage.deleteSuccess', [
    roleView.name,
  ]);
  const hideLoading = message.loading({
    content: deletingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteRoleById(roleView.id);
    message.success({
      content: deleteSuccessContent,
      key: 'action_process_msg',
    });
    onRefreshRoleList();
  } catch {
    hideLoading();
  }
}

function onRefreshRoleList() {
  roleGridApi.query();
}

function onCreateRole() {
  formModalApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormModal @success="onRefreshRoleList" />
    <AssignedAuthModal @success="onRefreshRoleList" />
    <RoleGrid :table-title="$t('system.role.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreateRole">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.role.name')]) }}
        </Button>
      </template>
    </RoleGrid>
  </Page>
</template>
