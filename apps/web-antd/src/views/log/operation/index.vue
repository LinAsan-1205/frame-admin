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

import { useColumns } from './config/table-columns';
import { useSearchFormOptions } from './config/search-config';

const operationLogSelectedRows = ref<Operation.View[]>([]);

const isAllowBatchDelete = computed(() => {
  return operationLogSelectedRows.value.length > 0;
});

function refreshOperationLogGrid() {
  operationLogGridApi.query();
}

/**
 * 删除单条操作日志
 * @param operationLogRow 操作日志行
 */
async function deleteOperationLogByRow(operationLogRow: Operation.View) {
  await deleteById(operationLogRow.id);
  const deleteSuccessMessage = $t('ui.actionMessage.deleteSuccess', [
    operationLogRow.description,
  ]);
  message.success({
    content: deleteSuccessMessage,
    key: 'action_process_msg',
  });
  refreshOperationLogGrid();
}

/**
 * 批量删除操作日志
 */
function deleteOperationLogBatch() {
  // 拼接所有选中日志的描述
  const operationLogDescriptions = operationLogSelectedRows.value
    .map((operationLogRow) => operationLogRow.description)
    .join(',');
  Modal.confirm({
    content: $t('ui.actionMessage.deleteConfirm', [operationLogDescriptions]),
    async onOk() {
      const operationLogIds = operationLogSelectedRows.value.map(
        (operationLogRow) => operationLogRow.id,
      );
      await deleteByIds(operationLogIds);
      const deleteSuccessMessage = $t('ui.actionMessage.deleteSuccess', [
        operationLogDescriptions,
      ]);
      message.success({
        content: deleteSuccessMessage,
        key: 'action_process_msg',
      });
      refreshOperationLogGrid();
    },
  });
}

function handleOperationLogActionClick({
  code,
  row,
}: OnActionClickParams<Operation.View>) {
  switch (code) {
    case 'delete': {
      deleteOperationLogByRow(row);
      break;
    }
  }
}

const operationLogFormOptions = useSearchFormOptions();

const [OperationLogGrid, operationLogGridApi] = useVbenVxeGrid({
  formOptions: operationLogFormOptions,
  gridOptions: {
    columns: useColumns(handleOperationLogActionClick),
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
      operationLogSelectedRows.value =
        operationLogGridApi.grid.getCheckboxRecords();
    },
    checkboxChange: () => {
      operationLogSelectedRows.value =
        operationLogGridApi.grid.getCheckboxRecords();
    },
  },
});
</script>
<template>
  <Page auto-content-height>
    <OperationLogGrid :table-title="$t('operationLog.list')">
      <template #toolbar-actions>
        <Button
          type="primary"
          @click="deleteOperationLogBatch"
          :disabled="!isAllowBatchDelete"
        >
          {{ $t('common.delete') }}
        </Button>
      </template>
    </OperationLogGrid>
  </Page>
</template>
