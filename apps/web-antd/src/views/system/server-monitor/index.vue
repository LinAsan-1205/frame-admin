<script setup lang="ts">
import type { ServerMonitor } from '#/api/system/monitor';

import { watchEffect } from 'vue';

import { Loading, Page } from '@vben/common-ui';

import { useQuery } from '@tanstack/vue-query';
import { Button, Card, Progress } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getServerInfo } from '#/api/system/monitor';
import { $t } from '#/locales';

defineOptions({ name: 'ServerMonitorPage' });

/**
 * 使用 TanStack Query 获取服务器信息
 */
const {
  data: serverInfo,
  isLoading,
  refetch,
} = useQuery({
  queryKey: ['serverInfo'],
  queryFn: getServerInfo,
});

/**
 * 格式化运行时长
 */
function formatRunTime(seconds: string): string {
  const sec = Number.parseInt(seconds, 10);
  const days = Math.floor(sec / 86_400);
  const hours = Math.floor((sec % 86_400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} ${$t('monitor.server.unit.days')}`);
  if (hours > 0) parts.push(`${hours} ${$t('monitor.server.unit.hours')}`);
  if (minutes > 0)
    parts.push(`${minutes} ${$t('monitor.server.unit.minutes')}`);

  return parts.join(' ') || `0 ${$t('monitor.server.unit.minutes')}`;
}

/**
 * 获取使用率颜色
 */
function getUsageColor(usage: number): string {
  if (usage >= 80) return '#ff4d4f';
  if (usage >= 60) return '#faad14';
  return '#52c41a';
}

/**
 * 创建磁盘表格
 */
const [DiskGrid, diskGridApi] = useVbenVxeGrid<ServerMonitor.SysFile>({
  gridOptions: {
    columns: [
      {
        title: $t('monitor.server.disk.dirName'),
        field: 'dirName',
        minWidth: 150,
      },
      {
        title: $t('monitor.server.disk.sysTypeName'),
        field: 'sysTypeName',
        minWidth: 120,
      },
      {
        title: $t('monitor.server.disk.total'),
        field: 'total',
        minWidth: 120,
      },
      {
        title: $t('monitor.server.disk.used'),
        field: 'used',
        minWidth: 120,
      },
      {
        title: $t('monitor.server.disk.free'),
        field: 'free',
        minWidth: 120,
      },
      {
        title: $t('monitor.server.disk.usage'),
        field: 'usage',
        minWidth: 200,
        slots: { default: 'usage' },
      },
    ],
    data: [],
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
    toolbarConfig: {
      enabled: false,
    },
    rowConfig: {
      keyField: 'dirName',
    },
  },
});

/**
 * 监听服务器信息变化，更新磁盘表格数据
 */
watchEffect(() => {
  if (serverInfo.value && !isLoading.value) {
    diskGridApi.setState({
      gridOptions: {
        data: serverInfo.value.sysFiles,
      },
    });
  }
});
</script>

<template>
  <Page :title="$t('monitor.server.title')">
    <template #extra>
      <Button :loading="isLoading" type="primary" @click="() => refetch()">
        {{ $t('monitor.server.refresh') }}
      </Button>
    </template>
    <Loading :spinning="isLoading" class="h-full w-full">
      <div v-if="serverInfo" class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- CPU 信息卡片 -->
        <Card
          :title="$t('monitor.server.cpu.title')"
          :body-style="{ padding: '10px' }"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.cpu.cpuNum') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.cpu.cpuNum }} {{ $t('monitor.server.unit.core') }}
              </div>
            </div>
            <div>
              <div class="mb-2 flex items-center justify-between">
                <div class="text-gray-600">
                  {{ $t('monitor.server.cpu.used') }}
                </div>
                <div class="font-semibold">{{ serverInfo.cpu.used }}%</div>
              </div>
              <Progress
                :percent="serverInfo.cpu.used"
                :stroke-color="getUsageColor(serverInfo.cpu.used)"
                :show-info="false"
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.cpu.sys') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.cpu.sys }}{{ $t('monitor.server.unit.percent') }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.cpu.free') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.cpu.free }}{{ $t('monitor.server.unit.percent') }}
              </div>
            </div>
          </div>
        </Card>

        <!-- 内存信息卡片 -->
        <Card
          :title="$t('monitor.server.memory.title')"
          :body-style="{ padding: '10px' }"
        >
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.memory.total') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.mem.total }} {{ $t('monitor.server.unit.gb') }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.memory.used') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.mem.used }} {{ $t('monitor.server.unit.gb') }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.memory.free') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.mem.free }} {{ $t('monitor.server.unit.gb') }}
              </div>
            </div>
            <div>
              <div class="mb-2 flex items-center justify-between">
                <div class="text-gray-600">
                  {{ $t('monitor.server.memory.usage') }}
                </div>
                <div class="font-semibold">{{ serverInfo.mem.usage }}%</div>
              </div>
              <Progress
                :percent="serverInfo.mem.usage"
                :stroke-color="getUsageColor(serverInfo.mem.usage)"
                :show-info="false"
              />
            </div>
          </div>
        </Card>

        <!-- Node.js 运行时信息卡片 -->
        <Card
          :title="$t('monitor.server.node.title')"
          :body-style="{ padding: '10px' }"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.version') }}
              </div>
              <div class="font-semibold">{{ serverInfo.node.version }}</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.v8Version') }}
              </div>
              <div class="font-semibold">{{ serverInfo.node.name }}</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.startTime') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.node.startTime }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.runTime') }}
              </div>
              <div class="font-semibold">
                {{ formatRunTime(serverInfo.node.runTime) }}
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.home') }}
              </div>
              <div class="truncate font-semibold" :title="serverInfo.node.home">
                {{ serverInfo.node.home }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.heapTotal') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.node.total }} {{ $t('monitor.server.unit.mb') }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.heapUsed') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.node.used }} {{ $t('monitor.server.unit.mb') }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.heapFree') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.node.free }} {{ $t('monitor.server.unit.mb') }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.node.heapMax') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.node.max }} {{ $t('monitor.server.unit.mb') }}
              </div>
            </div>
          </div>
        </Card>

        <!-- 系统信息卡片 -->
        <Card
          :title="$t('monitor.server.system.title')"
          :body-style="{ padding: '10px' }"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.system.computerName') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.sys.computerName }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.system.computerIp') }}
              </div>
              <div class="font-semibold">
                {{ serverInfo.sys.computerIp }}
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.system.osName') }}
              </div>
              <div class="font-semibold">{{ serverInfo.sys.osName }}</div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-gray-600">
                {{ $t('monitor.server.system.osArch') }}
              </div>
              <div class="font-semibold">{{ serverInfo.sys.osArch }}</div>
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-gray-600">
                {{ $t('monitor.server.system.userDir') }}
              </div>
              <div
                class="truncate font-semibold"
                :title="serverInfo.sys.userDir"
              >
                {{ serverInfo.sys.userDir }}
              </div>
            </div>
          </div>
        </Card>

        <!-- 磁盘信息（全宽） -->
        <Card
          :title="$t('monitor.server.disk.title')"
          class="md:col-span-2"
          :body-style="{ padding: '10px' }"
        >
          <DiskGrid>
            <template #usage="{ row }">
              <div class="flex items-center justify-center gap-2">
                <Progress
                  :percent="row.usage"
                  :stroke-color="getUsageColor(row.usage)"
                  :style="{ width: '150px' }"
                />
              </div>
            </template>
          </DiskGrid>
        </Card>
      </div>
    </Loading>
  </Page>
</template>
