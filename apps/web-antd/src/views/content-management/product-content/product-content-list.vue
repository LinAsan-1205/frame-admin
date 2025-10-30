<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductContent } from '#/api/content-management/product-content';

import { watch } from 'vue';
import { useRouter } from 'vue-router';

import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProductContentById,
  getProductContentPage,
} from '#/api/content-management/product-content';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';

const router = useRouter();
const categoryId = defineModel<number | undefined>('categoryId');

const formOptions = useSearchFormOptions();

// 操作处理
function onActionClick({
  code,
  row,
}: {
  code: string;
  row: ProductContent.View;
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
          return getProductContentPage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
            },
            {
              ...formValues,
              categoryId: categoryId.value,
            },
          );
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
  } as VxeTableGridOptions<ProductContent.View>,
});

function onEdit(row: ProductContent.View) {
  router.push(`/content-management/product-content/edit/${row.id}`);
}

function onCreate() {
  router.push('/content-management/product-content/add');
}

async function onDelete(row: ProductContent.View) {
  await deleteProductContentById(row.id);
  message.success($t('common.deleteSuccess'));
  onRefresh();
}

function onRefresh() {
  gridApi.query();
}

watch(() => categoryId.value, onRefresh);
</script>
<template>
  <Grid :table-title="$t('page.content-management.productContent')">
    <template #toolbar-tools>
      <Button type="primary" @click="onCreate">
        <Plus class="size-5" />
        {{ $t('common.add') }}
      </Button>
    </template>
  </Grid>
</template>

