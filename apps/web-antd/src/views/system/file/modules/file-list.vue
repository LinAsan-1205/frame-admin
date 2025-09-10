<script setup lang="ts">
import type { File } from '#/api/system/file/types';

import { computed, ref } from 'vue';

import { Search } from '@vben/icons';
import { downloadFileFromImageUrl } from '@vben/utils';

import { VbenIcon, VbenIconButton } from '@vben-core/shadcn-ui';

import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import {
  Badge,
  Button,
  Card,
  Dropdown,
  Input,
  Menu,
  MenuItem,
  message,
  Modal,
  Pagination,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import { delFileById, queryFilePage } from '#/api/system/file';
import { FileStatus, FileType, StorageType } from '#/api/system/file/enum';
import { $t } from '#/locales';

import FileUpload from './file-upload.vue';

const categoryId = defineModel<number | undefined>('categoryId');

const searchKeyword = ref('');
const selectedCategory = ref<number | undefined>();
const currentPage = ref(1);
const pageSize = ref(30);

const {
  data: filePageData,
  refetch: refetchFiles,
  isLoading,
} = useQuery({
  queryKey: [
    'fileList',
    currentPage,
    pageSize,
    searchKeyword,
    selectedCategory,
    categoryId,
  ],
  queryFn: () =>
    queryFilePage(
      {
        page: currentPage.value,
        pageSize: pageSize.value,
      },
      {
        name: searchKeyword.value || undefined,
        type: selectedCategory.value?.toString(),
      },
    ),
  placeholderData: keepPreviousData,
});

const fileList = computed(
  () => (filePageData.value?.items || []) as unknown as File.View[],
);
const total = computed(() => filePageData.value?.meta?.totalItems || 0);

/**
 * 根据文件类型获取图标
 * @param fileType 文件类型
 */
function getFileIcon(fileType: string) {
  const iconMap: Record<string, string> = {
    image: 'ri:image-line',
    document: 'ri:file-text-line',
    video: 'ri:video-line',
    audio: 'ri:music-line',
    other: 'ri:file-line',
  };
  return iconMap[fileType] || iconMap.other;
}

/**
 * 根据文件类型获取颜色
 * @param fileType 文件类型
 */
function getFileColor(fileType: string) {
  const colorMap: Record<string, string> = {
    image: 'text-green-500',
    document: 'text-blue-500',
    video: 'text-purple-500',
    audio: 'text-pink-500',
    other: 'text-gray-400',
  };
  return colorMap[fileType] || colorMap.other;
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

// 文件列表已经通过API分页和过滤，直接使用
const displayFileList = computed(() => fileList.value);

/**
 * 获取文件类型标签
 * @param fileType 文件类型
 */
function getFileTypeLabel(fileType: string) {
  const typeOption = FileType.raw(fileType);
  return typeOption?.label || fileType;
}

/**
 * 获取存储类型标签
 * @param storageType 存储类型
 */
function getStorageTypeLabel(storageType: string) {
  const typeOption = StorageType.raw(storageType);
  return typeOption?.label || storageType;
}

/**
 * 获取文件状态标签
 * @param status 文件状态
 */
function getFileStatusLabel(status: string) {
  const statusOption = FileStatus.raw(status);
  return statusOption?.label || $t('system.storageFiles.unknown');
}

/**
 * 检查文件状态是否正常
 * @param status 文件状态
 */
function isFileStatusNormal(status: string) {
  return FileStatus.has(status) && status === FileStatus.Normal;
}

/**
 * 处理搜索
 */
function handleSearch() {
  currentPage.value = 1;
  refetchFiles();
}

/**
 * 处理文件操作
 * @param action 操作类型
 * @param file 文件信息
 */
async function handleFileAction(action: string, file: File.View) {
  switch (action) {
    case 'delete': {
      Modal.confirm({
        title: $t('system.storageFiles.deleteConfirm'),
        content: $t('system.storageFiles.deleteConfirmContent', [
          file.originalName,
        ]),
        onOk: async () => {
          try {
            await delFileById(file.id);
            message.success($t('system.storageFiles.deleteSuccess'));
            refetchFiles();
          } catch {
            message.error($t('system.storageFiles.deleteFailed'));
          }
        },
      });
      break;
    }
    case 'download': {
      downloadFileFromImageUrl({
        source: file.fileUrl,
        fileName: file.fileName,
      });
      break;
    }
    case 'edit': {
      // 编辑文件信息
      message.info($t('system.storageFiles.editInDevelopment'));
      break;
    }
    case 'view': {
      // 预览文件
      window.open(file.fileUrl, '_blank');
      break;
    }
  }
}

/**
 * 处理分页变化
 * @param page 页码
 * @param size 每页数量
 */
function handlePageChange(page: number, size: number) {
  currentPage.value = page;
  pageSize.value = size;
}

/**
 * 处理上传成功
 * @param _file 上传的文件
 * @param _fileList 文件列表
 */
function handleUploadSuccess() {
  refetchFiles();
}

/**
 * 处理上传失败
 * @param error 错误信息
 * @param _file 上传的文件
 * @param _fileList 文件列表
 */
function handleUploadError(error: Error) {
  console.error('Upload error:', error);
}
</script>

<template>
  <div class="flex h-full flex-col space-y-4">
    <!-- 搜索和操作栏 -->
    <Card>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Input
            v-model:value="searchKeyword"
            :placeholder="$t('system.storageFiles.searchPlaceholder')"
            class="w-64"
            @press-enter="handleSearch"
          >
            <template #prefix>
              <Search class="size-4 text-gray-400" />
            </template>
          </Input>
          <Button @click="handleSearch">
            {{ $t('system.storageFiles.search') }}
          </Button>
          <Button>
            <VbenIcon icon="ri:filter-line" class="size-4" />
            {{ $t('system.storageFiles.filter') }}
          </Button>
        </div>
        <div class="flex items-center space-x-2">
          <FileUpload
            :multiple="true"
            :max-size="50"
            :max-count="10"
            :button-text="$t('system.storageFiles.upload')"
            button-icon="ri:upload-line"
            @success="handleUploadSuccess"
            @error="handleUploadError"
          />
        </div>
      </div>
    </Card>

    <div class="flex-1">
      <!-- 文件列表 -->
      <div
        class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <Card
          v-for="file in displayFileList"
          :key="file.id"
          class="group cursor-pointer transition-shadow hover:shadow-lg"
          @click="handleFileAction('view', file)"
        >
          <div class="space-y-3">
            <!-- 文件图标和操作按钮 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="text-3xl" :class="[getFileColor(file.fileType)]">
                  <VbenIcon :icon="getFileIcon(file.fileType)" />
                </div>
                <div class="min-w-0 flex-1">
                  <h3
                    class="truncate text-sm font-medium"
                    :title="file.originalName"
                  >
                    {{ file.originalName }}
                  </h3>
                  <p class="text-xs text-gray-500">
                    {{ formatFileSize(file.fileSize) }}
                  </p>
                </div>
              </div>
              <Dropdown :trigger="['click']" @click.stop>
                <Button
                  type="text"
                  size="small"
                  class="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <VbenIcon icon="ri:more-2-line" />
                </Button>
                <template #overlay>
                  <Menu
                    @click="({ key }) => handleFileAction(key as string, file)"
                  >
                    <MenuItem key="view">
                      <div class="flex items-center">
                        <VbenIcon icon="ri:eye-line" class="size-4" />
                        {{ $t('system.storageFiles.preview') }}
                      </div>
                    </MenuItem>
                    <MenuItem key="download">
                      <div class="flex items-center">
                        <VbenIcon icon="ri:download-line" class="size-4" />
                        {{ $t('system.storageFiles.download') }}
                      </div>
                    </MenuItem>
                    <MenuItem key="delete" class="text-red-500">
                      <div class="flex items-center">
                        <VbenIcon icon="ri:delete-bin-line" class="size-4" />
                        {{ $t('system.storageFiles.delete') }}
                      </div>
                    </MenuItem>
                  </Menu>
                </template>
              </Dropdown>
            </div>

            <!-- 文件信息 -->
            <div class="space-y-1 text-xs text-gray-500">
              <div class="flex items-center justify-between">
                <span>{{ $t('system.storageFiles.type') }}：</span>
                <Badge
                  :color="getFileColor(file.fileType)"
                  :text="getFileTypeLabel(file.fileType)"
                />
              </div>
              <div class="flex items-center justify-between">
                <span>{{ $t('system.storageFiles.storage') }}：</span>
                <span>{{ getStorageTypeLabel(file.storageType) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>{{ $t('system.storageFiles.mime') }}：</span>
                <span class="truncate">{{ file.mimeType }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>{{ $t('system.storageFiles.uploadTime') }}：</span>
                <span class="truncate">{{
                  dayjs(file.createTime).format('YYYY-MM-DD HH:mm:ss')
                }}</span>
              </div>
            </div>

            <!-- 状态指示器 -->
            <div class="flex items-center justify-between">
              <Badge
                :status="isFileStatusNormal(file.status) ? 'success' : 'error'"
                :text="getFileStatusLabel(file.status)"
              />
              <div class="flex space-x-1">
                <VbenIconButton
                  @click.stop="handleFileAction('view', file)"
                  :tooltip="$t('system.storageFiles.preview')"
                >
                  <VbenIcon icon="ri:eye-line" class="size-3" />
                </VbenIconButton>
                <VbenIconButton
                  @click.stop="handleFileAction('download', file)"
                  :tooltip="$t('system.storageFiles.download')"
                >
                  <VbenIcon icon="ri:download-line" class="size-3" />
                </VbenIconButton>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <!-- 加载状态 -->
      <div v-if="isLoading" class="py-12 text-center">
        <VbenIcon
          icon="ri:loader-4-line"
          class="mx-auto mb-4 size-16 animate-spin text-gray-300"
        />
        <p class="text-lg text-gray-500">
          {{ $t('system.storageFiles.loading') }}
        </p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="displayFileList.length === 0" class="py-12 text-center">
        <VbenIcon
          icon="ri:file-line"
          class="mx-auto mb-4 size-16 text-gray-300"
        />
        <p class="mb-2 text-lg text-gray-500">
          {{ $t('system.storageFiles.noFiles') }}
        </p>
        <p class="text-sm text-gray-400">
          {{ $t('system.storageFiles.noFilesDesc') }}
        </p>
      </div>
    </div>
    <!-- 分页 -->
    <div v-if="!isLoading && total > pageSize" class="flex justify-center">
      <Pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :show-total="
          (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
        "
        @change="handlePageChange"
      />
    </div>
  </div>
</template>
