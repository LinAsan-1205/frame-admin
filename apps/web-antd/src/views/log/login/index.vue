<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { LoginLog } from '#/api/log/login';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteByIds, queryLoginLogPage } from '#/api/log/login';
import { $t } from '#/locales';

import { useColumns, userSearchFormOptions } from './data';

const formOptions = userSearchFormOptions();

const selectedRows = ref<LoginLog.View[]>([]);

const isBatchDelete = computed(() => {
  return selectedRows.value.length > 0;
});

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

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return queryLoginLogPage(
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

function refreshGrid() {
  gridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <Grid table-title="登录日志列表">
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
