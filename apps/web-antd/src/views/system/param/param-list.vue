<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Param } from '#/api/system/param';

import { useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteParamById, getParamPage } from '#/api/system/param';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';
import ParamForm from './modules/param-form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ParamForm,
  destroyOnClose: true,
});

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
          return getParamPage(
            { page: page.currentPage, pageSize: page.pageSize },
            formValues,
          );
        },
      },
    },
    rowConfig: { keyField: 'id' },
  } as VxeTableGridOptions<Param.View>,
});

async function onActionClick(event: OnActionClickParams<Param.View>) {
  switch (event.code) {
    case 'delete': {
      await deleteParamById(event.row.id);
      message.success($t('common.deleteSuccess'));
      gridApi.query();
      break;
    }
    case 'edit': {
      formModalApi.setData(event.row).open();
      break;
    }
  }
}

function onCreate() {
  formModalApi.setData({}).open();
}

function onRefreshParamList() {
  gridApi.reload();
}
</script>

<template>
  <FormModal @success="onRefreshParamList" />
  <Grid :table-title="$t('system.param.list')">
    <template #toolbar-tools>
      <Button type="primary" @click="onCreate">
        <Plus class="size-5" />
        {{ $t('ui.actionTitle.create') }}
      </Button>
    </template>
  </Grid>
</template>
