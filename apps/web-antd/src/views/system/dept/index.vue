<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Dept } from '#/api/system/dept';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDeptById, getDeptList } from '#/api/system/dept';
import { $t } from '#/locales';

import { useColumns, userSearchFormOptions } from './data';
import Form from './modules/form.vue';

const [formDeptModal, formDeptModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/**
 * 编辑部门
 * @param deptView 部门数据
 */
function onEditDept(deptView: Dept.View) {
  formDeptModalApi.setData(deptView).open();
}

/**
 * 添加下级部门
 * @param deptView 部门数据
 */
function onAppendDept(deptView: Dept.View) {
  formDeptModalApi.setData({ parentId: deptView.id }).open();
}

/**
 * 创建新部门
 */
function onCreateDept() {
  formDeptModalApi.setData(null).open();
}

/**
 * 删除部门
 * @param deptView 部门数据
 */
async function onDeleteDept(deptView: Dept.View) {
  const deletingContent = $t('ui.actionMessage.deleting', [deptView.name]);
  const deleteSuccessContent = $t('ui.actionMessage.deleteSuccess', [
    deptView.name,
  ]);
  const hideLoading = message.loading({
    content: deletingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteDeptById(deptView.id);
    message.success({
      content: deleteSuccessContent,
      key: 'action_process_msg',
    });
    refreshDeptGrid();
  } catch {
    hideLoading();
  }
}

function onDeptActionClick({ code, row }: OnActionClickParams<Dept.View>) {
  switch (code) {
    case 'append': {
      onAppendDept(row);
      break;
    }
    case 'delete': {
      onDeleteDept(row);
      break;
    }
    case 'edit': {
      onEditDept(row);
      break;
    }
  }
}

const deptFormOptions = userSearchFormOptions();

const [DeptGrid, deptGridApi] = useVbenVxeGrid({
  formOptions: deptFormOptions,
  gridEvents: {},
  gridOptions: {
    columns: useColumns(onDeptActionClick),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_: any, deptFormValues: any) => {
          return await getDeptList(deptFormValues);
        },
      },
    },
    treeConfig: {
      parentField: 'parentId',
      rowField: 'id',
      transform: true,
    },
  } as VxeTableGridOptions,
});

function refreshDeptGrid() {
  deptGridApi.query();
}
</script>
<template>
  <Page auto-content-height>
    <formDeptModal @success="refreshDeptGrid" />
    <DeptGrid :table-title="$t('system.dept.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreateDept">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.dept.name')]) }}
        </Button>
      </template>
    </DeptGrid>
  </Page>
</template>
