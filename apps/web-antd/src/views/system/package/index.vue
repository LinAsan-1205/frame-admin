<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Package } from '#/api/system/package';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { delPackageById, queryPackagePage } from '#/api/system/package';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';
import PackageForm from './modules/package-form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PackageForm,
  destroyOnClose: true,
});

const packageFormOptions = useSearchFormOptions();

/**
 * 编辑套餐
 * @param packageView 套餐数据
 */
function onEditPackage(packageView: Package.View) {
  formModalApi.setData(packageView).open();
}

/**
 * 创建新套餐
 */
function onCreatePackage() {
  formModalApi.setData({}).open();
}

/**
 * 删除套餐
 * @param packageView 套餐数据
 */
async function onDeletePackage(packageView: Package.View) {
  const deletingContent = $t('ui.actionMessage.deleting', [
    packageView.packageName,
  ]);
  const deleteSuccessContent = $t('ui.actionMessage.deleteSuccess', [
    packageView.packageName,
  ]);
  const hideLoading = message.loading({
    content: deletingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await delPackageById(packageView.id);
    message.success({
      content: deleteSuccessContent,
      key: 'action_process_msg',
    });
    onRefreshPackageList();
  } catch {
    hideLoading();
  }
}

async function onActionClick(actionParams: OnActionClickParams<Package.View>) {
  switch (actionParams.code) {
    case 'delete': {
      await onDeletePackage(actionParams.row);
      break;
    }
    case 'edit': {
      onEditPackage(actionParams.row);
      break;
    }
  }
}

function onRefreshPackageList() {
  packageGridApi.query();
}

const [PackageGrid, packageGridApi] = useVbenVxeGrid({
  formOptions: packageFormOptions,
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
          return await queryPackagePage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
            },
            formValues,
          );
        },
      },
    },
  } as VxeTableGridOptions<Package.View>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefreshPackageList" />
    <PackageGrid :table-title="$t('tenant.package.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreatePackage">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('tenant.package.name')]) }}
        </Button>
      </template>
    </PackageGrid>
  </Page>
</template>
