<script lang="ts" setup>
import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';

import type { Log } from '#/api/schedule/log';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryLogPage } from '#/api/schedule/log';

import { useColumns, useSearchFormOptions } from './data';

const searchFormOptions = useSearchFormOptions();

const [TaskLogGrid] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions: {
    columns: useColumns(),
    keepSource: true,
    height: 'auto',
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return queryLogPage(
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
  } as VxeTableGridOptions<Log.View>,
});
</script>
<template>
  <Page auto-content-height>
    <TaskLogGrid :table-title="$t('schedule.log.list')" />
  </Page>
</template>
