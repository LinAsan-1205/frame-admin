<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Operation } from '#/api/log/operation';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteById,
  deleteByIds,
  queryOperationLogpage,
} from '#/api/log/operation';
import { $t } from '#/locales';

import { useColumns, userSearchFormOptions } from './data';

/**
 * 删除操作日志
 * @param row
 */
function onDelete(row: Operation.View) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting'),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteById(row.id)
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess'),
        key: 'action_process_msg',
      });
      refreshGrid();
    })
    .catch(() => {
      hideLoading();
    });
}

function onDeleteBatch() {
  Modal.confirm({
    content: $t('ui.actionMessage.deleteConfirm'),
    onOk: () => {
      const hideLoading = message.loading({
        content: $t('ui.actionMessage.deleting'),
        duration: 0,
        key: 'action_process_msg',
      });
      const ids = selectedRows.value.map((row) => row.id);
      deleteByIds(ids)
        .then(() => {
          message.success({
            content: $t('ui.actionMessage.deleteSuccess'),
            key: 'action_process_msg',
          });
          refreshGrid();
        })
        .catch(() => {
          hideLoading();
        });
    },
  });
}

function onActionClick({ code, row }: OnActionClickParams<Operation.View>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
  }
}

const formOptions = userSearchFormOptions();

const selectedRows = ref<Operation.View[]>([]);

const isBatchDelete = computed(() => {
  return selectedRows.value.length > 0;
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return queryOperationLogpage(
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
  gridEvents: {
    checkboxAll: () => {
      selectedRows.value = gridApi.grid.getCheckboxRecords();
    },
    checkboxChange: () => {
      selectedRows.value = gridApi.grid.getCheckboxRecords();
    },
  },
});

/**
 * 刷新表格
 */
function refreshGrid() {
  gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <Grid table-title="操作日志列表">
      <template #toolbar-actions>
        <Button
          type="primary"
          @click="onDeleteBatch"
          :disabled="!isBatchDelete"
        >
          删除
        </Button>
      </template>
    </Grid>
  </Page>
</template>
