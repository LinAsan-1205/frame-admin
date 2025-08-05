<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Operation } from '#/api/log/operation';

import { Page } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteById, queryOperationLogpage } from '#/api/log/operation';
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

function onActionClick({ code, row }: OnActionClickParams<Operation.View>) {
  switch (code) {
    case 'delete': {
      onDelete(row);
      break;
    }
  }
}

const formOptions = userSearchFormOptions();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      pageSize: 30,
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
    <Grid table-title="操作日志列表" />
  </Page>
</template>
