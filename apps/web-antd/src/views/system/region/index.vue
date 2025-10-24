<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Region } from '#/api/system/region';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRegionById, getRegionPage } from '#/api/system/region';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';
import RegionForm from './modules/region-form.vue';

const [formRegionModal, formRegionModalApi] = useVbenModal({
  connectedComponent: RegionForm,
  destroyOnClose: true,
});

/**
 * 编辑行政区域
 * @param regionView 行政区域数据
 */
function onEditRegion(regionView: Region.View) {
  formRegionModalApi.setData(regionView).open();
}

/**
 * 创建新行政区域
 */
function onCreateRegion() {
  formRegionModalApi.setData(null).open();
}

/**
 * 删除行政区域
 * @param regionView 行政区域数据
 */
async function onDeleteRegion(regionView: Region.View) {
  const deletingContent = $t('ui.actionMessage.deleting', [
    regionView.title || regionView.code,
  ]);
  const deleteSuccessContent = $t('ui.actionMessage.deleteSuccess', [
    regionView.title || regionView.code,
  ]);
  const hideLoading = message.loading({
    content: deletingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteRegionById(regionView.id);
    message.success({
      content: deleteSuccessContent,
      key: 'action_process_msg',
    });
    refreshRegionGrid();
  } catch {
    hideLoading();
  }
}

function onRegionActionClick({ code, row }: OnActionClickParams<Region.View>) {
  switch (code) {
    case 'delete': {
      onDeleteRegion(row);
      break;
    }
    case 'edit': {
      onEditRegion(row);
      break;
    }
  }
}

const regionFormOptions = useSearchFormOptions();

const [RegionGrid, regionGridApi] = useVbenVxeGrid({
  formOptions: regionFormOptions,
  gridEvents: {},
  gridOptions: {
    columns: useColumns(onRegionActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: true,
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, regionFormValues: any) => {
          return await getRegionPage({
            ...regionFormValues,
            page: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
    },
  } as VxeTableGridOptions,
});

function refreshRegionGrid() {
  regionGridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <formRegionModal @success="refreshRegionGrid" />
    <RegionGrid :table-title="$t('system.region.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreateRegion">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.region.name')]) }}
        </Button>
      </template>
    </RegionGrid>
  </Page>
</template>
