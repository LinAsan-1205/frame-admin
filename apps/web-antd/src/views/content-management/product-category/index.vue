<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductCategory } from '#/api/content-management/product-category';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteProductCategoryById,
  getProductCategoryPage,
} from '#/api/content-management/product-category';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';
import CategoryForm from './modules/category-form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: CategoryForm,
  destroyOnClose: true,
});

const formOptions = useSearchFormOptions();

// 操作处理
function onActionClick({
  code,
  row,
}: {
  code: string;
  row: ProductCategory.View;
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
          return getProductCategoryPage(
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
    treeConfig: {
      parentField: 'parentId',
      rowField: 'id',
      transform: true,
    },
  } as VxeTableGridOptions<ProductCategory.View>,
});

// 删除
async function onDelete(row: ProductCategory.View) {
  await deleteProductCategoryById(row.id);
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
    <Grid :table-title="$t('page.content-management.productCategory')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('common.add') }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
