<script setup lang="ts">
import type { Session } from '#/api/system/session';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Descriptions, DescriptionsItem, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

const sessionData = ref<null | Session.View>(null);

const [SessionDetailModal, modalApi] = useVbenModal({
  onOpenChange: (isOpen: boolean) => {
    sessionData.value = isOpen ? modalApi.getData<Session.View>() : null;
  },
});

// 工具函数
const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return '-';
  return new Date(dateTime).toLocaleString();
};

const getPlatformColor = (platform?: string) => {
  const colorMap: Record<string, string> = {
    admin: 'success',
    app: 'processing',
    web: 'warning',
    miniapp: 'purple',
  };
  return colorMap[platform || ''] || 'default';
};

const getPlatformText = (platform?: string) => {
  const textMap: Record<string, string> = {
    admin: $t('system.session.platformAdmin'),
    app: $t('system.session.platformApp'),
    web: $t('system.session.platformWeb'),
    miniapp: $t('system.session.platformMiniapp'),
  };
  return textMap[platform || ''] || platform || '-';
};

const getDeviceTypeColor = (deviceType?: string) => {
  const colorMap: Record<string, string> = {
    web: 'blue',
    mobile: 'green',
    desktop: 'cyan',
    tablet: 'geekblue',
  };
  return colorMap[deviceType || ''] || 'default';
};

const getDeviceTypeText = (deviceType?: string) => {
  const textMap: Record<string, string> = {
    web: $t('system.session.deviceTypeWeb'),
    mobile: $t('system.session.deviceTypeMobile'),
    desktop: $t('system.session.deviceTypeDesktop'),
    tablet: $t('system.session.deviceTypeTablet'),
  };
  return textMap[deviceType || ''] || deviceType || '-';
};

defineExpose({
  openModal: modalApi.open,
  closeModal: modalApi.close,
});
</script>

<template>
  <SessionDetailModal :title="$t('system.session.sessionDetail')" width="800">
    <div v-if="sessionData" class="session-detail">
      <Descriptions :column="2" bordered>
        <DescriptionsItem :label="$t('system.session.sessionId')">
          {{ sessionData.id }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.userId')">
          {{ sessionData.userId }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.deviceId')">
          {{ sessionData.deviceId }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.deviceName')">
          {{ sessionData.deviceName || '-' }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.platform')">
          <Tag :color="getPlatformColor(sessionData.platform)">
            {{ getPlatformText(sessionData.platform) }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.deviceType')">
          <Tag :color="getDeviceTypeColor(sessionData.deviceType)">
            {{ getDeviceTypeText(sessionData.deviceType) }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.ipAddress')">
          {{ sessionData.ipAddress || '-' }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.loginLocation')">
          {{ sessionData.loginLocation || '-' }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.status')">
          <Tag :color="sessionData.isActive ? 'success' : 'default'">
            {{
              sessionData.isActive
                ? $t('system.session.online')
                : $t('system.session.offline')
            }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.sessionStatus')">
          {{ sessionData.status }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.loginTime')">
          {{ formatDateTime(sessionData.loginAt) }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.lastActiveTime')">
          {{ formatDateTime(sessionData.lastActiveAt) }}
        </DescriptionsItem>
        <DescriptionsItem
          :label="$t('system.session.refreshTokenExpiresAt')"
          v-if="sessionData.refreshTokenExpiresAt"
        >
          {{ formatDateTime(sessionData.refreshTokenExpiresAt) }}
        </DescriptionsItem>
        <DescriptionsItem
          :label="$t('system.session.logoutTime')"
          v-if="sessionData.logoutAt"
        >
          {{ formatDateTime(sessionData.logoutAt) }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('ui.common.createTime')">
          {{ formatDateTime(sessionData.createdAt) }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('ui.common.updateTime')">
          {{ formatDateTime(sessionData.updatedAt) }}
        </DescriptionsItem>
        <DescriptionsItem
          :label="$t('system.session.userAgent')"
          :span="2"
          v-if="sessionData.userAgent"
        >
          <div class="break-all text-sm">
            {{ sessionData.userAgent }}
          </div>
        </DescriptionsItem>
      </Descriptions>
    </div>
  </SessionDetailModal>
</template>

<style scoped>
.session-detail {
  padding: 8px 0;
}
</style>
