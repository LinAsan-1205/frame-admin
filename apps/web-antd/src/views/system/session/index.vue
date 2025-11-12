<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { Session } from '#/api/system/session';

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

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
import LoginStrategyConfigForm from './modules/login-strategy-config-form.vue';

const searchFormOptions = useSearchFormOptions();
const websocketStore = useWebSocketStore();
const userStore = useUserStore();

// 轮询配置
const POLLING_INTERVAL = 10_000; // 10秒轮询
const POLLING_INTERVAL_HIDDEN = 30_000; // 页面隐藏时30秒轮询
const pollingTimer = ref<NodeJS.Timeout | null>(null);

// WebSocket 会话变更计数
const lastChangeCount = computed(() => websocketStore.sessionChangeCount);
let previousChangeCount = 0;

const [SessionGrid, sessionGridApi] = useVbenVxeGrid({
  formOptions: searchFormOptions,
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      autoLoad: true,
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

const [LoginStrategyConfigModal, loginStrategyConfigModalApi] = useVbenModal({
  connectedComponent: LoginStrategyConfigForm,
  destroyOnClose: true,
});

/**
 * 监听 WebSocket 会话变更事件（实时通知）
 */
watch(lastChangeCount, (newCount) => {
  if (newCount > previousChangeCount && previousChangeCount > 0) {
    onRefreshSessionList();
  }
  previousChangeCount = newCount;
});

/**
 * 启动轮询
 * @param interval 轮询间隔（毫秒）
 */
function startPolling(interval: number = POLLING_INTERVAL) {
  stopPolling();
  pollingTimer.value = setInterval(() => {
    onRefreshSessionList();
  }, interval);
}

/**
 * 停止轮询
 */
function stopPolling() {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
    pollingTimer.value = null;
  }
}

/**
 * 页面可见性变化处理
 * 页面可见时使用正常轮询间隔，隐藏时降低轮询频率
 */
function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    // 页面可见：立即刷新 + 恢复正常轮询
    onRefreshSessionList();
    startPolling(POLLING_INTERVAL);
  } else {
    // 页面隐藏：降低轮询频率减少服务器压力
    startPolling(POLLING_INTERVAL_HIDDEN);
  }
}

onMounted(() => {
  previousChangeCount = lastChangeCount.value;

  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 启动轮询
  startPolling();
});

onUnmounted(() => {
  // 停止轮询
  stopPolling();

  // 移除事件监听
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});

/**
 * 处理表格操作
 */
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

/**
 * 确认弹窗
 */
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

  onRefreshSessionList();
}

/**
 * 刷新会话列表
 */
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

function onOpenLoginStrategyConfig() {
  loginStrategyConfigModalApi.open();
}

onUnmounted(() => {
  stopPolling();

  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <Page auto-content-height>
    <DetailModal />
    <LoginStrategyConfigModal @success="onRefreshSessionList" />
    <SessionGrid :table-title="$t('system.session.list')">
      <template #toolbar-tools>
        <Button @click="onOpenLoginStrategyConfig" type="default">
          {{ $t('system.session.loginStrategyConfig') }}
        </Button>
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
