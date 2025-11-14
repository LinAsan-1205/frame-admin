<script lang="ts" setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal } from '@vben/common-ui';
import { useWatermark } from '@vben/hooks';
import { BasicLayout, LockScreen, UserDropdown } from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';

import { $t } from '#/locales';
import { useAuthStore } from '#/store';
import { useRealtimeStore } from '#/store/realtime';
import LoginForm from '#/views/_core/authentication/login.vue';

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const realtimeStore = useRealtimeStore();
const { destroyWatermark, updateWatermark } = useWatermark();
const router = useRouter();

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

const menus = computed(() => [
  {
    handler: () => {
      router.push('/user/profile');
    },
    icon: 'ant-design:user-outlined',
    text: $t('page.user.profile'),
  },
]);

async function handleLogout() {
  await authStore.logout(false);
}

onMounted(() => {
  if (accessStore.accessToken) {
    realtimeStore.connect();
  }
});

onUnmounted(() => {
  realtimeStore.disconnect();
});

watch(
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.userName} - ${userStore.userInfo?.nickName}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);

accessStore.$subscribe((_, state) => {
  if (
    state.accessToken &&
    !realtimeStore.isConnected &&
    !realtimeStore.isConnecting
  ) {
    realtimeStore.connect();
  } else if (!state.accessToken && realtimeStore.isConnected) {
    realtimeStore.disconnect();
  }
});
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :menus
        trigger="both"
        :text="userStore.userInfo?.nickName"
        :description="userStore.userInfo?.email"
        @logout="handleLogout"
      />
    </template>

    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
</template>
