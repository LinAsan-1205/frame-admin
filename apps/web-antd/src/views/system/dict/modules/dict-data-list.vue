<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { DictData } from '#/api/system/dict';

import { ref } from 'vue';

import { useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delDictDataById, queryDictDataPage } from '#/api/system/dict';
import { $t } from '#/locales';

import { useDictDataSearchFormOptions } from '../config/search-config';
import { useDictDataColumns } from '../config/table-columns';
import DictDataForm from './dict-data-form.vue';

const [DictDataFormModal, dictDataFormModalApi] = useVbenModal({
  connectedComponent: DictDataForm,
  destroyOnClose: true,
});

const formOptions = useDictDataSearchFormOptions();

const dictId = ref<number | undefined>();
const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<{ dictId?: number }>();
      dictId.value = data?.dictId;
      if (dictId.value) {
        gridApi.reload();
      }
    } else {
      dictId.value = undefined;
    }
  },
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions,
  gridOptions: {
    columns: useDictDataColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return queryDictDataPage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
            },
            {
              ...formValues,
              dictId: dictId.value,
            },
          );
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
  } as VxeTableGridOptions<DictData.View>,
});

function onActionClick(event: OnActionClickParams<DictData.View>) {
  switch (event.code) {
    case 'delete': {
      onDelete(event.row);
      break;
    }
    case 'edit': {
      onEdit(event.row);
      break;
    }
  }
}

function onEdit(row: DictData.View) {
  dictDataFormModalApi.setData(row).open();
}

function onCreate() {
  if (!dictId.value) {
    message.warning($t('system.dictData.selectDictFirst'));
    return;
  }
  dictDataFormModalApi.setData({ dictId: dictId.value }).open();
}

async function onDelete(row: DictData.View) {
  Modal.confirm({
    title: $t('common.tip'),
    content: $t('common.confirmDelete'),
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: async () => {
      await delDictDataById(row.id);
      message.success($t('common.deleteSuccess'));
      await gridApi.reload();
    },
  });
}

function onFormSuccess() {
  gridApi.reload();
}
</script>

<template>
  <Drawer :title="$t('system.dictData.list')">
    <DictDataFormModal @success="onFormSuccess" />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" :disabled="!dictId" @click="onCreate">
          <template #icon>
            <Plus class="size-4" />
          </template>
          {{ $t('common.add') }}
        </Button>
      </template>
    </Grid>
  </Drawer>
</template>
