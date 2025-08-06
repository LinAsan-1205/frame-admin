<script lang="ts" setup>
import type { Recordable } from '@vben/types';

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

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/**
 * 编辑部门
 * @param row
 */
function onEdit(row: StorageConfig.View) {
  formModalApi.setData(row).open();
}

/**
 * 创建新部门
 */
function onCreate() {
  formModalApi.setData(null).open();
}

/**
 * 删除部门
 * @param row
 */
function onDelete(row: StorageConfig.View) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  delStorageConfigById(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function confirm(content: string, title: string) {
  return new Promise((reslove, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        reslove(true);
      },
      title,
    });
  });
}
/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param row 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onIsDefaultChange(
  newStatus: StorageConfig.IsDefault,
  row: StorageConfig.View,
) {
  const status: Recordable<string> = {
    1: StorageConfigIsDefault.label(StorageConfigIsDefault.No),
    0: StorageConfigIsDefault.label(StorageConfigIsDefault.Yes),
  };
  try {
    await confirm(
      `你要将${row.name}的状态切换为 【${status[newStatus.toString()]}】 吗？`,
      `切换状态`,
    );
    await setStorageConfigIsDefault(row.id, newStatus);
    return true;
  } catch {
    return false;
  }
}
/**
 * 表格操作按钮的回调函数
 */
function onActionClick({ code, row }: OnActionClickParams<StorageConfig.View>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

const formOptions = userSearchFormOptions();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridEvents: {},
  gridOptions: {
    columns: useColumns(onActionClick, onIsDefaultChange),
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

/**
 * 刷新表格
 */
function refreshGrid() {
  gridApi.query();
}
</script>
<template>
  <Page
    auto-content-height
    :description="$t('system.storageConfig.pageDescription')"
    :title="$t('system.storageConfig.title')"
  >
    <FormModal @success="refreshGrid" />
    <Grid :table-title="$t('system.storageConfig.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.storageConfig.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
