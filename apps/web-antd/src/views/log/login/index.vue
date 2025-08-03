<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryLoginLogPage } from '#/api/log/login';

import { useColumns, userSearchFormOptions } from './data';

const formOptions = userSearchFormOptions();

const [Grid] = useVbenVxeGrid({
  formOptions,
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
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
});
</script>
<template>
  <Page auto-content-height>
    <Grid table-title="登录日志列表">
      <template #status="{ row }">
        <Tag :color="row.statusDisplay.type">{{ row.statusDisplay.label }}</Tag>
      </template>
    </Grid>
  </Page>
</template>
