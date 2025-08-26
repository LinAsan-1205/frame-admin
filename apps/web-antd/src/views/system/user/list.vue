<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { User } from '#/api/system/user';

import { watch } from 'vue';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  delUserById,
  queryUserPage,
  setInitializePassword,
} from '#/api/system/user';
import UserBlock from '#/components/model/system/user/user-block.vue';
import { $t } from '#/locales';

import { useColumns, useSearchFormOptions } from './data';
import AssignedRole from './modules/assigned-role.vue';
import Form from './modules/form.vue';

const deptId = defineModel<number | undefined>('deptId');

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [AssignedRoleModal, assignedRoleModalApi] = useVbenModal({
  connectedComponent: AssignedRole,
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
          return queryUserPage(
            {
              page: page.currentPage,
              pageSize: page.pageSize,
            },
            {
              ...formValues,
              deptId: deptId.value,
            },
          );
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
  } as VxeTableGridOptions<User.View>,
});

function onActionClick(event: OnActionClickParams<User.View>) {
  switch (event.code) {
    case 'assignedRole': {
      assignedRoleModalApi.setData(event.row).open();
      break;
    }
    case 'delete': {
      onDelete(event.row);
      break;
    }
    case 'edit': {
      onEdit(event.row);
      break;
    }
    case 'initializePassword': {
      onInitializePassword(event.row);
      break;
    }
  }
}

function onEdit(row: User.View) {
  formDrawerApi.setData(row).open();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}

async function onDelete(row: User.View) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.userName]),
    duration: 0,
  });
  await delUserById(row.id).finally(() => {
    hideLoading();
  });
  message.success({
    content: $t('ui.actionMessage.deleteSuccess', [row.userName]),
  });
  onRefresh();
}

async function onInitializePassword(row: User.View) {
  await setInitializePassword(row.id);
  message.success({
    content: $t('ui.actionMessage.operationSuccess'),
  });
  onRefresh();
}

function onRefresh() {
  gridApi.query();
}

watch(() => deptId.value, onRefresh);
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <AssignedRoleModal @success="onRefresh" />
    <Grid :table-title="$t('system.user.list')">
      <template #userBlock="{ row }">
        <UserBlock :origin="row" />
      </template>
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.user.name')]) }}
        </Button>
      </template>
    </Grid>
  </Page>
</template>
