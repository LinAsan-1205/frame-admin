<script lang="ts" setup>
import type { RedisCache } from '#/api/monitor/redis';

import { Page } from '@vben/common-ui';

import { VbenSpinner } from '@vben-core/shadcn-ui';

import { useQuery } from '@tanstack/vue-query';
import { Card, Progress, Skeleton, Statistic, Tag } from 'ant-design-vue';

import { getRedisCacheInfo } from '#/api/monitor/redis';
import { $t } from '#/locales';

const {
  data: redisInfo,
  isLoading,
  isFetching,
} = useQuery<RedisCache.Info, unknown>({
  queryKey: ['monitor', 'redisCacheInfo'],
  queryFn: () => getRedisCacheInfo(),
  refetchInterval: 30_000,
  refetchOnWindowFocus: false,
  retry: 1,
});

// 获取运行时间显示文本
function getUptimeText(redisInfo: RedisCache.Info): string {
  if (!redisInfo || typeof redisInfo.uptimeDays !== 'number') return '-';
  return formatUptime(redisInfo.uptimeDays);
}

// 格式化运行时间
function formatUptime(days: number): string {
  if (days === 0) return $t('monitor.redis.uptimeLessThanOneDay');
  return $t('monitor.redis.uptimeDays', [days]);
}

// 获取内存使用率显示值
function getMemoryPercent(redisInfo: RedisCache.Info): number {
  if (!redisInfo || typeof redisInfo.memoryUsagePercent !== 'number') return 0;
  return Math.max(0, Math.min(100, redisInfo.memoryUsagePercent));
}

// 获取命中率显示值
function getHitPercent(redisInfo: RedisCache.Info): number {
  if (!redisInfo || typeof redisInfo.hitRate !== 'number') return 0;
  return Math.max(0, Math.min(100, redisInfo.hitRate));
}

// 获取状态颜色
function getStatusColor(status: string): string {
  return status === 'ok' ? '#52c41a' : '#ff4d4f';
}

// 获取内存使用率颜色
function getMemoryUsageColor(percent: number): string {
  if (percent < 60) return '#52c41a';
  if (percent < 80) return '#faad14';
  return '#ff4d4f';
}

// 获取命中率颜色
function getHitRateColor(percent: number): string {
  if (percent >= 90) return '#52c41a';
  if (percent >= 70) return '#faad14';
  return '#ff4d4f';
}
</script>

<template>
  <Page
    :description="$t('monitor.redis.description')"
    :title="$t('monitor.redis.title')"
  >
    <div class="relative min-h-[16rem] p-4">
      <VbenSpinner
        :spinning="isLoading || !redisInfo"
        :min-loading-time="150"
      />
      <Transition name="fade-zoom">
        <div
          v-if="isFetching && redisInfo"
          class="pointer-events-none absolute inset-0"
          style="will-change: opacity, transform"
        >
          <div class="mb-4 flex gap-4">
            <Card class="flex-1" v-for="i in 4" :key="`row1-${i}`">
              <Skeleton active :title="true" :paragraph="{ rows: 0 }" />
            </Card>
          </div>
          <div class="mb-4 flex gap-4">
            <Card class="flex-1" v-for="i in 4" :key="`row2-${i}`">
              <Skeleton active :title="true" :paragraph="{ rows: 0 }" />
            </Card>
          </div>
          <div class="mb-4 flex gap-4">
            <Card class="flex-1" v-for="i in 4" :key="`row3-${i}`">
              <Skeleton active :title="true" :paragraph="{ rows: 2 }" />
            </Card>
          </div>
        </div>
      </Transition>
      <div v-if="redisInfo">
        <!-- 基本信息 -->
        <div class="mb-4 flex gap-4">
          <Card class="flex-1">
            <Statistic
              :value="redisInfo.version"
              :title="$t('monitor.redis.version')"
              :value-style="{ color: '#1890ff' }"
            />
          </Card>
          <Card class="flex-1">
            <Statistic
              :value="redisInfo.mode"
              :title="$t('monitor.redis.mode')"
              :value-style="{ color: '#722ed1' }"
            />
          </Card>
          <Card class="flex-1">
            <Statistic
              :value="redisInfo.port"
              :title="$t('monitor.redis.port')"
              :value-style="{ color: '#13c2c2' }"
            />
          </Card>
          <Card class="flex-1">
            <Statistic
              :value="getUptimeText(redisInfo)"
              :title="$t('monitor.redis.uptime')"
              :value-style="{ color: '#52c41a' }"
            />
          </Card>
        </div>

        <!-- 连接和Key信息 -->
        <div class="mb-4 flex gap-4">
          <Card class="flex-1">
            <Statistic
              :value="redisInfo.connectedClients"
              :suffix="$t('monitor.redis.unit.count')"
              :title="$t('monitor.redis.connectedClients')"
              :value-style="{ color: '#eb2f96' }"
            />
          </Card>
          <Card class="flex-1">
            <Statistic
              :value="redisInfo.totalKeys"
              :suffix="$t('monitor.redis.unit.count')"
              :title="$t('monitor.redis.totalKeys')"
              :value-style="{ color: '#fa541c' }"
            />
          </Card>
          <Card class="flex-1">
            <Statistic
              :value="redisInfo.expiredKeys"
              :suffix="$t('monitor.redis.unit.count')"
              :title="$t('monitor.redis.expiredKeys')"
              :value-style="{ color: '#faad14' }"
            />
          </Card>
          <Card class="flex-1">
            <div class="text-center">
              <div class="mb-2 text-sm text-gray-500">
                {{ $t('monitor.redis.aofPersistence') }}
              </div>
              <Tag :color="redisInfo.aofEnabled ? 'success' : 'error'">
                {{
                  redisInfo.aofEnabled
                    ? $t('monitor.redis.aofEnabled')
                    : $t('monitor.redis.aofDisabled')
                }}
              </Tag>
            </div>
          </Card>
        </div>

        <!-- 内存和状态信息 -->
        <div class="mb-4 flex gap-4">
          <Card class="flex-1" :title="$t('monitor.redis.memoryUsage')">
            <div class="mb-1 flex justify-between text-sm text-gray-500">
              <span>{{ $t('monitor.redis.usedMemory') }}</span>
              <span>{{ redisInfo.usedMemory }}</span>
            </div>
            <div class="mb-2 flex justify-between text-sm text-gray-500">
              <span>{{ $t('monitor.redis.maxMemory') }}</span>
              <span>{{ redisInfo.maxMemory }}</span>
            </div>
            <Progress
              :percent="getMemoryPercent(redisInfo)"
              :stroke-color="getMemoryUsageColor(getMemoryPercent(redisInfo))"
            />
          </Card>
          <Card class="flex-1" :title="$t('monitor.redis.cacheHitRate')">
            <div class="flex items-center justify-center">
              <div class="w-full text-center">
                <Progress
                  :percent="getHitPercent(redisInfo)"
                  :stroke-color="getHitRateColor(getHitPercent(redisInfo))"
                  :format="(percent) => `${percent}%`"
                />
              </div>
            </div>
          </Card>
          <Card class="flex-1" :title="$t('monitor.redis.rdbStatus')">
            <div class="space-y-3">
              <div>
                <div class="text-gray-500">
                  {{ $t('monitor.redis.saveStatus') }}:
                </div>
                <Tag :color="getStatusColor(redisInfo.rdbLastSaveStatus)">
                  {{ redisInfo.rdbLastSaveStatus }}
                </Tag>
              </div>
              <div class="text-sm text-gray-500">
                <div>{{ $t('monitor.redis.lastSaveTime') }}：</div>
                <div class="mt-1">{{ redisInfo.rdbLastSaveTime }}</div>
              </div>
            </div>
          </Card>
          <Card class="flex-1" :title="$t('monitor.redis.networkTraffic')">
            <div class="flex items-center space-x-4">
              <Statistic
                :value="redisInfo.totalNetInputBytes"
                :title="$t('monitor.redis.totalNetInput')"
                :value-style="{ color: '#1890ff' }"
              />
              <Statistic
                :value="redisInfo.totalNetOutputBytes"
                :title="$t('monitor.redis.totalNetOutput')"
                :value-style="{ color: '#722ed1' }"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.fade-zoom-enter-active,
.fade-zoom-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.fade-zoom-enter-from,
.fade-zoom-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
.fade-zoom-enter-to,
.fade-zoom-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
