<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductContent } from '#/api/content-management/product-content';

import { Page, useVbenModal } from '@vben/common-ui';
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
import ContentForm from './modules/content-form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ContentForm,
  destroyOnClose: true,
});

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
      formModalApi.setData(row).open();
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
            formValues,
          );
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
  } as VxeTableGridOptions<ProductContent.View>,
});

// 删除
async function onDelete(row: ProductContent.View) {
  await deleteProductContentById(row.id);
  message.success($t('common.deleteSuccess'));
  gridApi.grid.commitProxy('query');
}

// 新增
function onCreate() {
  formModalApi.setData({}).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="gridApi.grid.commitProxy('query')" />
    <Grid :table-title="$t('page.content-management.productContent')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('common.add') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
