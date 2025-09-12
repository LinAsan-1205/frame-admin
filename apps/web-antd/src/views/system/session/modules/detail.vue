<script setup lang="ts">
import type { Session } from '#/api/system/session';

import { useVbenModal } from '@vben/common-ui';

import { Descriptions, DescriptionsItem, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

interface Props {
  sessionData?: null | Session.SessionInfo;
}

const props = withDefaults(defineProps<Props>(), {
  sessionData: null,
});

const [SessionDetailModal, modalApi] = useVbenModal({
  onOpenChange: (isOpen: boolean) => {
    if (!isOpen) {
      modalApi.setData(null);
    }
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
    <div v-if="props.sessionData" class="session-detail">
      <Descriptions :column="2" bordered>
        <DescriptionsItem :label="$t('system.session.sessionId')">
          {{ props.sessionData.id }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.userId')">
          {{ props.sessionData.userId }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.deviceId')">
          {{ props.sessionData.deviceId }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.deviceName')">
          {{ props.sessionData.deviceName || '-' }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.platform')">
          <Tag :color="getPlatformColor(props.sessionData.platform)">
            {{ getPlatformText(props.sessionData.platform) }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.deviceType')">
          <Tag :color="getDeviceTypeColor(props.sessionData.deviceType)">
            {{ getDeviceTypeText(props.sessionData.deviceType) }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.ipAddress')">
          {{ props.sessionData.ipAddress || '-' }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.loginLocation')">
          {{ props.sessionData.loginLocation || '-' }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.status')">
          <Tag :color="props.sessionData.isActive ? 'success' : 'default'">
            {{
              props.sessionData.isActive
                ? $t('system.session.online')
                : $t('system.session.offline')
            }}
          </Tag>
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.sessionStatus')">
          {{ props.sessionData.status }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.loginTime')">
          {{ formatDateTime(props.sessionData.loginAt) }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('system.session.lastActiveTime')">
          {{ formatDateTime(props.sessionData.lastActiveAt) }}
        </DescriptionsItem>
        <DescriptionsItem
          :label="$t('system.session.refreshTokenExpiresAt')"
          v-if="props.sessionData.refreshTokenExpiresAt"
        >
          {{ formatDateTime(props.sessionData.refreshTokenExpiresAt) }}
        </DescriptionsItem>
        <DescriptionsItem
          :label="$t('system.session.logoutTime')"
          v-if="props.sessionData.logoutAt"
        >
          {{ formatDateTime(props.sessionData.logoutAt) }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('ui.common.createTime')">
          {{ formatDateTime(props.sessionData.createdAt) }}
        </DescriptionsItem>
        <DescriptionsItem :label="$t('ui.common.updateTime')">
          {{ formatDateTime(props.sessionData.updatedAt) }}
        </DescriptionsItem>
        <DescriptionsItem
          :label="$t('system.session.userAgent')"
          :span="2"
          v-if="props.sessionData.userAgent"
        >
          <div class="break-all text-sm">
            {{ props.sessionData.userAgent }}
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
