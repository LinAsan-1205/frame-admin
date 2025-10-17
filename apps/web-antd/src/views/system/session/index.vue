<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Session } from '#/api/system/session';

import { computed, onMounted, onUnmounted, watch } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { Button, message, Modal, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  cleanupExpiredSessions,
  deleteSessionById,
  forceLogout,
  querySessionPage,
} from '#/api/system/session';
import { $t } from '#/locales';
import { useWebSocketStore } from '#/store/websocket';

import { useSearchFormOptions } from './config/search-config';
import { useColumns } from './config/table-columns';
import Detail from './modules/detail.vue';

const searchFormOptions = useSearchFormOptions();

const websocketStore = useWebSocketStore();

const userStore = useUserStore();

const lastChangeCount = computed(() => websocketStore.sessionChangeCount);
let previousChangeCount = 0;

// WebSocket 连接状态
const isWsConnected = computed(() => websocketStore.isConnected);
let refreshTimer: NodeJS.Timeout | null = null;

const [SessionGrid, sessionGridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      autoLoad: false,
      ajax: {
        query: async ({ page }, formValues) => {
          return await querySessionPage(
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
  } as VxeTableGridOptions<Session.View>,
});

const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});

watch(lastChangeCount, (newCount) => {
  if (newCount > previousChangeCount && previousChangeCount > 0) {
    onRefreshSessionList();
  }
  previousChangeCount = newCount;
});

watch(isWsConnected, (connected, wasConnected) => {
  if (connected && wasConnected === false) {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
    refreshTimer = setTimeout(() => {
      onRefreshSessionList();
    }, 500);
  }
});

function handleVisibilityChange() {
  if (document.visibilityState === 'visible' && isWsConnected.value) {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
    refreshTimer = setTimeout(() => {
      onRefreshSessionList();
    }, 300);
  }
}

onMounted(() => {
  previousChangeCount = lastChangeCount.value;

  document.addEventListener('visibilitychange', handleVisibilityChange);

  if (isWsConnected.value) {
    refreshTimer = setTimeout(() => {
      onRefreshSessionList();
    }, 500);
  }
});

onUnmounted(() => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

async function onActionClick(actionParams: OnActionClickParams<Session.View>) {
  switch (actionParams.code) {
    case 'delete': {
      await onDeleteSession(actionParams.row);
      break;
    }
    case 'detail': {
      detailModalApi.setData(actionParams.row).open();
      break;
    }
    case 'forceLogout': {
      await onForceLogout(actionParams.row);
      break;
    }
  }
}

function confirmModal(content: string, title: string) {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error($t('system.session.canceled')));
      },
      onOk() {
        resolve(true);
      },
      title,
    });
  });
}

/**
 * 删除会话
 * @param sessionView 会话数据
 */
async function onDeleteSession(sessionView: Session.View) {
  const deletingContent = $t('ui.actionMessage.deleting', [
    sessionView.deviceName,
  ]);
  const deleteSuccessContent = $t('ui.actionMessage.deleteSuccess', [
    sessionView.deviceName,
  ]);
  const hideLoading = message.loading({
    content: deletingContent,
    duration: 0,
    key: 'action_process_msg',
  });
  try {
    await deleteSessionById(sessionView.id);
    message.success({
      content: deleteSuccessContent,
      key: 'action_process_msg',
    });
    onRefreshSessionList();
  } catch {
    hideLoading();
  }
}

/**
 * 强制下线
 * @param sessionView 会话数据
 */
async function onForceLogout(sessionView: Session.View) {
  await confirmModal(
    $t('system.session.confirmForceLogoutContent', [sessionView.deviceName]),
    $t('system.session.confirmForceLogout'),
  );

  const hideLoading = message.loading({
    content: $t('system.session.forceLogoutLoading'),
    duration: 0,
    key: 'action_process_msg',
  });

  await forceLogout({
    userId: sessionView.userId,
    deviceId: sessionView.deviceId,
  }).finally(() => {
    hideLoading();
  });

  websocketStore.sendMessage('force_user_offline', {
    userId: sessionView.userId,
    deviceId: sessionView.deviceId,
  });

  onRefreshSessionList();
}

function onRefreshSessionList() {
  sessionGridApi.query();
}

/**
 * 清理过期会话
 */
async function onCleanupExpiredSessions() {
  await confirmModal(
    $t('system.session.confirmCleanupExpiredContent'),
    $t('system.session.confirmCleanupExpired'),
  );

  const hideLoading = message.loading({
    content: $t('system.session.cleanupExpiredLoading'),
    duration: 0,
    key: 'cleanup_process_msg',
  });

  await cleanupExpiredSessions().finally(() => {
    hideLoading();
  });

  message.success({
    content: $t('system.session.cleanupExpiredSuccess'),
    key: 'cleanup_process_msg',
  });

  onRefreshSessionList();
}
</script>

<template>
  <Page auto-content-height>
    <DetailModal />
    <SessionGrid :table-title="$t('system.session.list')">
      <template #toolbar-tools>
        <Button @click="onCleanupExpiredSessions" type="primary">
          {{ $t('system.session.cleanupExpired') }}
        </Button>
      </template>
      <template #userBlock="{ row: { user, userId } }">
        {{ user?.userName }}
        <Tag v-if="userStore.userInfo?.id === userId" color="success">
          {{ $t('system.session.isMe') }}
        </Tag>
      </template>
    </SessionGrid>
  </Page>
</template>
