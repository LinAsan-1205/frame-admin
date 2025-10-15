<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Post } from '#/api/system/post';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deletePostById,
  getPostPage,
  setPostStatus,
} from '#/api/system/post';
import { $t } from '#/locales';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';
import PostForm from './modules/post-form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: PostForm,
  destroyOnClose: true,
});

const searchFormOptions = useSearchFormOptions();

const [PostGrid, postGridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions: {
    columns: useColumns(onActionClick, onStatusChange),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getPostPage({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
  } as VxeTableGridOptions<Post.View>,
});

async function onActionClick(actionParams: OnActionClickParams<Post.View>) {
  switch (actionParams.code) {
    case 'delete': {
      await onDeletePost(actionParams.row);
      break;
    }
    case 'edit': {
      onEditPost(actionParams.row);
      break;
    }
  }
}

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
 * @param postView 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(newStatus: string, postView: Post.View) {
  // 状态映射
  const statusMap: Recordable<string> = {
    1: $t('system.post.stop'),
    0: $t('system.post.normal'),
  };
  try {
    const statusText = statusMap[newStatus.toString()];
    await confirmModal(
      `确认将 ${postView.postName} 的状态切换为 【${statusText}】 吗？`,
      `切换状态`,
    );
    await setPostStatus({ id: postView.id, status: newStatus as any });
    message.success($t('system.post.setStatusSuccess'));
    return true;
  } catch {
    return false;
  }
}

function onEditPost(postView: Post.View) {
  formModalApi.setData(postView).open();
}

/**
 * 删除岗位
 * @param postView 岗位数据
 */
async function onDeletePost(postView: Post.View) {
  const deletingContent = $t('ui.actionMessage.deleting', [postView.postName]);
  const deleteSuccessContent = $t('ui.actionMessage.deleteSuccess', [
    postView.postName,
  ]);
  const hideLoading = message.loading({
    content: deletingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deletePostById(postView.id);
    message.success({
      content: deleteSuccessContent,
      key: 'action_process_msg',
    });
    onRefreshPostList();
  } catch {
    hideLoading();
  }
}

function onRefreshPostList() {
  postGridApi.query();
}

function onCreatePost() {
  formModalApi.setData({}).open();
}
</script>
<template>
  <Page auto-content-height>
    <FormModal @success="onRefreshPostList" />
    <PostGrid :table-title="$t('system.post.list')">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreatePost">
          <Plus class="size-5" />
          {{ $t('ui.actionTitle.create', [$t('system.post.name')]) }}
        </Button>
      </template>
    </PostGrid>
  </Page>
</template>
