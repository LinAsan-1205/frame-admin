<script setup lang="ts">
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ContactUs } from '#/api/content-management/contact-us';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  batchDeleteContactUs,
  deleteContactUsById,
  getContactUsPage,
} from '#/api/content-management/contact-us';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';

const formOptions = useSearchFormOptions();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return getContactUsPage(
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
  } as VxeTableGridOptions<ContactUs.View>,
});

function onActionClick(event: OnActionClickParams<ContactUs.View>) {
  switch (event.code) {
    case 'delete': {
      onDelete(event.row);
      break;
    }
  }
}

function onRefresh() {
  gridApi.query();
}

function onDelete(row: ContactUs.View) {
  Modal.confirm({
    cancelText: $t('common.cancel'),
    content: $t('common.confirmDelete'),
    okText: $t('common.confirm'),
    title: $t('common.tip'),
    onOk: async () => {
      await deleteContactUsById(row.id);
      message.success($t('common.deleteSuccess'));
      onRefresh();
    },
  });
}

async function onBatchDelete() {
  const selectedRows = gridApi.grid.getCheckboxRecords();
  if (selectedRows.length === 0) {
    message.warning($t('common.selectData'));
    return;
  }

  Modal.confirm({
    cancelText: $t('common.cancel'),
    content: $t('common.confirmBatchDelete'),
    okText: $t('common.confirm'),
    title: $t('common.tip'),
    onOk: async () => {
      await batchDeleteContactUs({
        contactIds: selectedRows.map((row) => row.id),
      });
      message.success($t('common.deleteSuccess'));
      onRefresh();
    },
  });
}
</script>

<template>
  <Grid :table-title="$t('content-management.contactUs.title')">
    <template #toolbar-tools>
      <Button danger @click="onBatchDelete">
        {{ $t('common.batchDelete') }}
      </Button>
    </template>
  </Grid>
</template>
