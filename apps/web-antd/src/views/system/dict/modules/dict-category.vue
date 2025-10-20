<script setup lang="ts">
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Dict } from '#/api/system/dict';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delDictById, queryDictPage } from '#/api/system/dict';
import { $t } from '#/locales';

import { useDictSearchFormOptions } from '../config/search-config';
import { useDictColumns } from '../config/table-columns';
import DictDataList from './dict-data-list.vue';
import DictForm from './dict-form.vue';

// 字典表单（新增/编辑）
const [DictFormModal, dictFormModalApi] = useVbenModal({
  connectedComponent: DictForm,
  destroyOnClose: true,
});

// 字典数据抽屉
const [DictDataDrawer, dictDataDrawerApi] = useVbenDrawer({
  connectedComponent: DictDataList,
  destroyOnClose: true,
  class: 'w-[1200px]',
});

const formOptions = useDictSearchFormOptions();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions: {
    columns: useDictColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return queryDictPage(
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
  } as VxeTableGridOptions<Dict.View>,
});

function onActionClick(event: OnActionClickParams<Dict.View>) {
  switch (event.code) {
    case 'delete': {
      onDelete(event.row);
      break;
    }
    case 'dictData': {
      dictDataDrawerApi.setData({ dictId: event.row.id }).open();
      break;
    }
    case 'edit': {
      onEdit(event.row);
      break;
    }
  }
}

function onEdit(row: Dict.View) {
  dictFormModalApi.setData(row).open();
}

function onCreate() {
  dictFormModalApi.setData({}).open();
}

function onRefresh() {
  gridApi.query();
}

function onDelete(row: Dict.View) {
  Modal.confirm({
    title: $t('common.tip'),
    content: $t('common.confirmDelete'),
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: async () => {
      await delDictById(row.id);
      message.success($t('common.deleteSuccess'));
      onRefresh();
    },
  });
}
</script>

<template>
  <DictFormModal @success="onRefresh" />
  <DictDataDrawer />
  <Grid :table-title="$t('system.dict.list')">
    <template #toolbar-tools>
      <Button type="primary" @click="onCreate">
        <template #icon>
          <Plus class="size-4" />
        </template>
        {{ $t('common.add') }}
      </Button>
    </template>
  </Grid>
</template>
