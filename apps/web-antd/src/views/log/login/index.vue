<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { LoginLog } from '#/api/log/login';

import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteByIds, queryLoginLogPage } from '#/api/log/login';
import { $t } from '#/locales';

import { useColumns } from './config/table-columns';
import { useSearchFormOptions } from './config/search-config';

const loginLogFormOptions = useSearchFormOptions();

const loginLogSelectedRows = ref<LoginLog.View[]>([]);

const isAllowBatchDelete = computed(() => {
  return loginLogSelectedRows.value.length > 0;
});

function refreshLoginLogGrid() {
  loginLogGridApi.query();
}

/**
 * 批量删除登录日志
 */
async function deleteLoginLogBatch() {
  Modal.confirm({
    content: $t('loginLog.deleteConfirm'),
    async onOk() {
      const loginLogIds = loginLogSelectedRows.value.map(
        (loginLogRow) => loginLogRow.id,
      );
      await deleteByIds(loginLogIds);
      message.success({
        content: $t('loginLog.deleteSuccess'),
        key: 'action_process_msg',
      });
      refreshLoginLogGrid();
    },
  });
}

const [LoginLogGrid, loginLogGridApi] = useVbenVxeGrid({
  formOptions: loginLogFormOptions,
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
      loginLogSelectedRows.value = loginLogGridApi.grid.getCheckboxRecords();
    },
    checkboxChange: () => {
      loginLogSelectedRows.value = loginLogGridApi.grid.getCheckboxRecords();
    },
  },
});
</script>
<template>
  <Page auto-content-height>
    <LoginLogGrid :table-title="$t('loginLog.list')">
      <template #toolbar-actions>
        <Button
          type="primary"
          @click="deleteLoginLogBatch"
          :disabled="!isAllowBatchDelete"
        >
          {{ $t('common.delete') }}
        </Button>
      </template>
    </LoginLogGrid>
  </Page>
</template>
