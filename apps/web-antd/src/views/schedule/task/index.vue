<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Task } from '#/api/schedule/task';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteTask,
  executeTask,
  queryTaskPage,
  setTaskStatus,
} from '#/api/schedule/task';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';
import ExecutionLog from './modules/execution-log.vue';
import Form from './modules/form.vue';

const [FormModel, formModelApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const searchFormOptions = useSearchFormOptions();

const [TaskGrid, taskGridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: ({ page }, formValues) => {
          return queryTaskPage(
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
  } as VxeTableGridOptions<Task.View>,
});

const [ExecutionLogModal, executionLogModalApi] = useVbenModal({
  connectedComponent: ExecutionLog,
  destroyOnClose: true,
});

/**
 * 处理操作按钮点击事件
 * @param actionParams 操作参数
 */
async function onActionClick(actionParams: OnActionClickParams<Task.View>) {
  switch (actionParams.code) {
    case 'delete': {
      await onDeleteTask(actionParams.row);
      break;
    }
    case 'edit': {
      onEditTask(actionParams.row);
      break;
    }
    case 'execute': {
      await onExecuteTask(actionParams.row);
      break;
    }
    case 'executionLog': {
      executionLogModalApi
        .setData({
          taskId: actionParams.row.id,
        })
        .open();
      break;
    }
  }
}

/**
 * 确认对话框
 * @param content 内容
 * @param title 标题
 */
function confirmModal(content: string, title: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        resolve(true);
      },
      title,
    });
  });
}

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param taskView 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(newStatus: string, taskView: Task.View) {
  // 状态映射
  const statusMap: Recordable<string> = {
    1: '禁用',
    0: '启用',
  };
  try {
    const statusText = statusMap[newStatus.toString()];
    await confirmModal(
      `你要将${taskView.name}的状态切换为 【${statusText}】 吗？`,
      `切换状态`,
    );
    await setTaskStatus(taskView.id, newStatus);
    return true;
  } catch {
    return false;
  }
}

/**
 * 编辑任务
 * @param taskView 任务数据
 */
function onEditTask(taskView: Task.View) {
  formModelApi.setData(taskView).open();
}

/**
 * 删除任务
 * @param taskView 任务数据
 */
async function onDeleteTask(taskView: Task.View) {
  const deletingContent = $t('ui.actionMessage.deleting', [taskView.name]);
  const deleteSuccessContent = $t('ui.actionMessage.deleteSuccess', [
    taskView.name,
  ]);
  const hideLoading = message.loading({
    content: deletingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteTask(taskView.id);
    message.success({
      content: deleteSuccessContent,
      key: 'action_process_msg',
    });
    onRefreshTaskList();
  } catch {
    hideLoading();
  }
}

/**
 * 执行任务
 * @param taskView 任务数据
 */
async function onExecuteTask(taskView: Task.View) {
  const executingContent = `正在执行任务：${taskView.name}`;
  const executeSuccessContent = `任务 ${taskView.name} 执行成功`;
  const hideLoading = message.loading({
    content: executingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await executeTask(taskView.id);
    message.success({
      content: executeSuccessContent,
      key: 'action_process_msg',
    });
    onRefreshTaskList();
  } catch {
    hideLoading();
  }
}

/**
 * 刷新任务列表
 */
function onRefreshTaskList() {
  taskGridApi.query();
}

/**
 * 创建任务
 */
function onCreateTask() {
  formModelApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormModel @success="onRefreshTaskList" />
    <ExecutionLogModal @success="onRefreshTaskList" />
    <TaskGrid :table-title="$t('schedule.task.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreateTask">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('schedule.task.name')]) }}
        </Button>
      </template>
    </TaskGrid>
  </Page>
</template>
