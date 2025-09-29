<script lang="ts" setup>
import type {
  OnActionClickFn,
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Tenant } from '#/api/system/tenant';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  delTenantById,
  queryTenantPage,
} from '#/api/system/tenant';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';
import TenantForm from './modules/tenant-form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: TenantForm,
  destroyOnClose: true,
});

const tenantFormOptions = useSearchFormOptions();

/**
 * 编辑租户
 * @param tenantView 租户数据
 */
function onEditTenant(tenantView: Tenant.View) {
  formModalApi.setData(tenantView).open();
}

/**
 * 创建新租户
 */
function onCreateTenant() {
  formModalApi.setData({}).open();
}

/**
 * 删除租户
 * @param tenantView 租户数据
 */
async function onDeleteTenant(tenantView: Tenant.View) {
  const deletingContent = $t('ui.actionMessage.deleting', [
    tenantView.tenantName,
  ]);
  const deleteSuccessContent = $t('ui.actionMessage.deleteSuccess', [
    tenantView.tenantName,
  ]);
  const hideLoading = message.loading({
    content: deletingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await delTenantById(tenantView.id);
    message.success({
      content: deleteSuccessContent,
      key: 'action_process_msg',
    });
    onRefreshTenantList();
  } catch {
    hideLoading();
  }
}

async function onActionClick(actionParams: OnActionClickParams<Tenant.View>) {
  switch (actionParams.code) {
    case 'delete': {
      await onDeleteTenant(actionParams.row);
      break;
    }
    case 'edit': {
      onEditTenant(actionParams.row);
      break;
    }
  }
}

function onRefreshTenantList() {
  tenantGridApi.query();
}

const [TenantGrid, tenantGridApi] = useVbenVxeGrid({
  formOptions: tenantFormOptions,
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    rowConfig: {
      keyField: 'id',
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await queryTenantPage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
            },
            formValues,
          );
        },
      },
    },
  } as VxeTableGridOptions<Tenant.View>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefreshTenantList" />
    <TenantGrid :table-title="$t('tenant.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreateTenant">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('tenant.name')]) }}
        </Button>
      </template>
    </TenantGrid>
  </Page>
</template>
