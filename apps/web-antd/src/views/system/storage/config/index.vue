<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { StorageConfig } from '#/api/system/storage/config';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  delStorageConfigById,
  queryStorageConfigPage,
  setStorageConfigIsDefault,
  StorageConfigIsDefault,
} from '#/api/system/storage/config';
import { $t } from '#/locales';

import { useColumns, userSearchFormOptions } from './data';
import Form from './modules/form.vue';

const [storageConfigFormModal, storageConfigFormModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/**
 * 编辑存储配置
 * @param storageConfigRow 存储配置行数据
 */
function handleEditStorageConfig(storageConfigRow: StorageConfig.View) {
  storageConfigFormModalApi.setData(storageConfigRow).open();
}

/**
 * 创建新存储配置
 */
function handleCreateStorageConfig() {
  storageConfigFormModalApi.setData(null).open();
}

/**
 * 删除存储配置
 * @param storageConfigRow 存储配置行数据
 */
async function handleDeleteStorageConfig(storageConfigRow: StorageConfig.View) {
  const deletingMessageContent = $t('ui.actionMessage.deleting', [
    storageConfigRow.name,
  ]);
  const hideLoadingMessage = message.loading({
    content: deletingMessageContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await delStorageConfigById(storageConfigRow.id);
    const deleteSuccessMessage = $t('ui.actionMessage.deleteSuccess', [
      storageConfigRow.name,
    ]);
    message.success({
      content: deleteSuccessMessage,
      key: 'action_process_msg',
    });
    refreshStorageConfigGrid();
  } catch {
    hideLoadingMessage();
  }
}

/**
 * 通用确认弹窗
 * @param confirmContent 确认内容
 * @param confirmTitle 标题
 * @returns Promise
 */
function showConfirmModal(confirmContent: string, confirmTitle: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content: confirmContent,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        resolve(true);
      },
      title: confirmTitle,
    });
  });
}

/**
 * 存储配置默认状态切换
 * @param isDefaultStatus 期望切换的默认状态
 * @param storageConfigRow 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function handleIsDefaultStatusChange(
  isDefaultStatus: StorageConfig.IsDefault,
  storageConfigRow: StorageConfig.View,
) {
  const isDefaultStatusLabel = StorageConfigIsDefault.label(isDefaultStatus);
  try {
    const confirmContent = `你要将${storageConfigRow.name}的状态切换为 【${isDefaultStatusLabel}】 吗？`;
    const confirmTitle = `切换状态`;
    await showConfirmModal(confirmContent, confirmTitle);
    await setStorageConfigIsDefault(storageConfigRow.id, isDefaultStatus);
    return true;
  } catch {
    return false;
  }
}

function handleStorageConfigActionClick({
  code,
  row,
}: OnActionClickParams<StorageConfig.View>) {
  switch (code) {
    case 'delete': {
      handleDeleteStorageConfig(row);
      break;
    }
    case 'edit': {
      handleEditStorageConfig(row);
      break;
    }
  }
}

const storageConfigFormOptions = userSearchFormOptions();

function refreshStorageConfigGrid() {
  storageConfigGridApi.query();
}

const [storageConfigGrid, storageConfigGridApi] = useVbenVxeGrid({
  formOptions: storageConfigFormOptions,
  gridEvents: {},
  gridOptions: {
    columns: useColumns(
      handleStorageConfigActionClick,
      handleIsDefaultStatusChange,
    ),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await queryStorageConfigPage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
            },
            formValues,
          );
        },
      },
    },
  } as VxeTableGridOptions,
});
</script>
<template>
  <Page
    auto-content-height
    :description="$t('system.storageConfig.pageDescription')"
    :title="$t('system.storageConfig.title')"
  >
    <storageConfigFormModal @success="refreshStorageConfigGrid" />
    <storageConfigGrid :table-title="$t('system.storageConfig.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="handleCreateStorageConfig">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.storageConfig.name')]) }}
        </Button>
      </template>
    </storageConfigGrid>
  </Page>
</template>
