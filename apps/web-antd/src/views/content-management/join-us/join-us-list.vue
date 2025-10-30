<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { JoinUs } from '#/api/content-management/join-us';

import { useRouter } from 'vue-router';

import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteJoinUsById, getJoinUsPage } from '#/api/content-management/join-us';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';

const router = useRouter();

const formOptions = useSearchFormOptions();

// 操作处理
function onActionClick({
  code,
  row,
}: {
  code: string;
  row: JoinUs.View;
}) {
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

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return getJoinUsPage(
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
  } as VxeTableGridOptions<JoinUs.View>,
});

function onEdit(row: JoinUs.View) {
  router.push(`/content-management/join-us/edit/${row.id}`);
}

function onCreate() {
  router.push('/content-management/join-us/add');
}

async function onDelete(row: JoinUs.View) {
  await deleteJoinUsById(row.id);
  message.success($t('common.deleteSuccess'));
  onRefresh();
}

function onRefresh() {
  gridApi.query();
}
</script>
<template>
  <Grid :table-title="$t('content-management.joinUs.title')">
    <template #toolbar-tools>
      <Button type="primary" @click="onCreate">
        <Plus class="size-5" />
        {{ $t('common.add') }}
      </Button>
    </template>
  </Grid>
</template>

