<script lang="ts" setup>
import type { RedisCache } from '#/api/monitor/redis';

import { onMounted, onUnmounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Progress, Statistic, Tag } from 'ant-design-vue';

import { getRedisCacheInfo } from '#/api/monitor/redis';

const loading = ref(false);
const redisInfo = ref<null | RedisCache.Info>(null);
let refreshTimer: NodeJS.Timeout | null = null;

// 获取Redis缓存信息
async function fetchRedisCacheInfo() {
  try {
    loading.value = true;
    const response = await getRedisCacheInfo();
    redisInfo.value = response;
  } catch (error) {
    console.error('获取Redis缓存信息失败:', error);
    // 可以在这里添加错误提示
  } finally {
    loading.value = false;
  }
}

// 自动刷新
function startAutoRefresh() {
  refreshTimer = setInterval(fetchRedisCacheInfo, 30_000);
}

function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

// 获取运行时间显示文本
function getUptimeText(redisInfo: RedisCache.Info): string {
  if (!redisInfo || typeof redisInfo.uptimeDays !== 'number') return '-';
  return formatUptime(redisInfo.uptimeDays);
}

// 格式化运行时间
function formatUptime(days: number): string {
  if (days === 0) return '< 1天';
  return `${days}天`;
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

onMounted(() => {
  fetchRedisCacheInfo();
  startAutoRefresh();
});

onUnmounted(() => {
  stopAutoRefresh();
});
</script>

<template>
  <Page
    description="实时监控Redis缓存服务运行状态和性能指标"
    title="Redis 缓存监控"
  >
    <div v-if="redisInfo" class="p-4">
      <!-- 基本信息 -->
      <div class="mb-4 flex gap-4">
        <Card class="flex-1">
          <Statistic
            :value="redisInfo.version"
            title="Redis 版本"
            :value-style="{ color: '#1890ff' }"
          />
        </Card>
        <Card class="flex-1">
          <Statistic
            :value="redisInfo.mode"
            title="运行模式"
            :value-style="{ color: '#722ed1' }"
          />
        </Card>
        <Card class="flex-1">
          <Statistic
            :value="redisInfo.port"
            title="端口"
            :value-style="{ color: '#13c2c2' }"
          />
        </Card>
        <Card class="flex-1">
          <Statistic
            :value="getUptimeText(redisInfo)"
            title="运行时间"
            :value-style="{ color: '#52c41a' }"
          />
        </Card>
      </div>

      <!-- 连接和Key信息 -->
      <div class="mb-4 flex gap-4">
        <Card class="flex-1">
          <Statistic
            :value="redisInfo.connectedClients"
            suffix="个"
            title="连接客户端"
            :value-style="{ color: '#eb2f96' }"
          />
        </Card>
        <Card class="flex-1">
          <Statistic
            :value="redisInfo.totalKeys"
            suffix="个"
            title="Key 总数"
            :value-style="{ color: '#fa541c' }"
          />
        </Card>
        <Card class="flex-1">
          <Statistic
            :value="redisInfo.expiredKeys"
            suffix="个"
            title="过期 Key"
            :value-style="{ color: '#faad14' }"
          />
        </Card>
        <Card class="flex-1">
          <div class="text-center">
            <div class="mb-2 text-sm text-gray-500">AOF 持久化</div>
            <Tag :color="redisInfo.aofEnabled ? 'success' : 'error'">
              {{ redisInfo.aofEnabled ? '已开启' : '未开启' }}
            </Tag>
          </div>
        </Card>
      </div>

      <!-- 内存和状态信息 -->
      <div class="mb-4 flex gap-4">
        <Card class="flex-1" title="内存使用情况">
          <div class="mb-1 flex justify-between text-sm text-gray-500">
            <span>已用内存</span>
            <span>{{ redisInfo.usedMemory }}</span>
          </div>
          <div class="mb-2 flex justify-between text-sm text-gray-500">
            <span>最大内存</span>
            <span>{{ redisInfo.maxMemory }}</span>
          </div>
          <Progress
            :percent="getMemoryPercent(redisInfo)"
            :stroke-color="getMemoryUsageColor(getMemoryPercent(redisInfo))"
          />
        </Card>
        <Card class="flex-1" title="缓存命中率">
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
        <Card class="flex-1" title="RDB 状态">
          <div class="space-y-3">
            <div>
              <span class="text-gray-500">保存状态：</span>
              <Tag :color="getStatusColor(redisInfo.rdbLastSaveStatus)">
                {{ redisInfo.rdbLastSaveStatus }}
              </Tag>
            </div>
            <div class="text-sm text-gray-500">
              <div>最后保存时间：</div>
              <div class="mt-1">{{ redisInfo.rdbLastSaveTime }}</div>
            </div>
          </div>
        </Card>
        <Card class="flex-1" title="网络流量统计">
          <div class="flex items-center space-x-4">
            <Statistic
              :value="redisInfo.totalNetInputBytes"
              title="网络输入总量"
              :value-style="{ color: '#1890ff' }"
            />
            <Statistic
              :value="redisInfo.totalNetOutputBytes"
              title="网络输出总量"
              :value-style="{ color: '#722ed1' }"
            />
          </div>
        </Card>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="flex h-64 items-center justify-center">
      <div class="text-center">
        <div
          class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
        ></div>
        <div class="text-gray-500">加载中...</div>
      </div>
    </div>
  </Page>
</template>
