<script setup lang="ts">
import type { File } from '#/api/system/file/types';

import { computed, ref } from 'vue';

import { downloadFileFromImageUrl } from '@vben/utils';

import {
  VbenButton,
  VbenIcon,
  VbenIconButton,
  VbenSpinner,
} from '@vben-core/shadcn-ui';

import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import {
  Badge,
  Card,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Modal,
  Pagination,
  Skeleton,
} from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { delFileById, queryFilePage } from '#/api/system/file';
import { FileStatus, FileType, StorageType } from '#/api/system/file/enum';
import { $t } from '#/locales';

import FilePreview from './file-preview.vue';
import FileUpload from './file-upload.vue';

const categoryId = defineModel<number | undefined>('categoryId');

const currentPage = ref(1);
const pageSize = ref(30);

const previewOpen = ref(false);
const previewFile = ref<File.View | null>(null);
const opSpinning = ref(false);
const submitDebounceTimer = ref<number | undefined>();

// 图片加载错误与重试支持
const imageErrorMap = ref<Record<number, boolean>>({});
const imageRetryTokenMap = ref<Record<number, number>>({});

function getImageUrl(file: File.View) {
  const token = imageRetryTokenMap.value[file.id];
  if (!token) return file.fileUrl;
  const sep = file.fileUrl.includes('?') ? '&' : '?';
  return `${file.fileUrl}${sep}_=${token}`;
}

function onImageError(fileId: number) {
  imageErrorMap.value[fileId] = true;
}

function onImageLoad(fileId: number) {
  if (imageErrorMap.value[fileId]) {
    delete imageErrorMap.value[fileId];
  }
}

function onRetryImage(file: File.View) {
  imageErrorMap.value[file.id] = false;
  imageRetryTokenMap.value[file.id] = Date.now();
}

function onFileMenuClick(info: { key: string }, file: File.View) {
  handleFileAction(info.key as string, file);
}

function renderPaginationTotal(total: number, range: [number, number]) {
  return `第 ${range[0]}-${range[1]} 条，共 ${total} 条`;
}

const [SearchForm, SearchFormApi] = useVbenForm({
  collapsed: false,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  handleValuesChange: onValuesChange,
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.storageFiles.fileNamePlaceholder'),
        allowClear: true,
      },
      fieldName: 'name',
      label: $t('system.storageFiles.fileName'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: FileType.toOriginItems(),
        placeholder: $t('system.storageFiles.fileTypePlaceholder'),
        showSearch: true,
        filterOption: true,
      },
      fieldName: 'fileType',
      label: $t('system.storageFiles.fileType'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: StorageType.toOriginItems(),
        placeholder: $t('system.storageFiles.storageTypePlaceholder'),
        showSearch: true,
        filterOption: true,
      },
      fieldName: 'storageType',
      label: $t('system.storageFiles.storageType'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: FileStatus.toOriginItems(),
        placeholder: $t('system.storageFiles.statusPlaceholder'),
        showSearch: true,
        filterOption: true,
      },
      fieldName: 'status',
      label: $t('system.storageFiles.status'),
    },
  ],
  submitButtonOptions: {
    content: $t('common.search'),
  },
  resetButtonOptions: {
    content: $t('common.reset'),
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  handleReset: () => {
    SearchFormApi.resetForm();
    searchParams.value = {};
    currentPage.value = 1;
    refetchFiles();
  },
  submitOnChange: true,
});

const searchParams = ref<Record<string, any>>({});

const {
  data: filePageData,
  refetch: refetchFiles,
  isFetching,
} = useQuery({
  queryKey: ['fileList', currentPage, pageSize, searchParams, categoryId],
  queryFn: () =>
    queryFilePage(
      {
        page: currentPage.value,
        pageSize: pageSize.value,
      },
      searchParams.value,
    ),
  placeholderData: keepPreviousData,
});

const fileList = computed(
  () => (filePageData.value?.items || []) as unknown as File.View[],
);
const total = computed(() => filePageData.value?.meta?.totalItems || 0);

function onSubmit(values: Record<string, any>) {
  searchParams.value = { ...values };
  currentPage.value = 1;
  refetchFiles();
}

function onValuesChange(values: Record<string, any>) {
  // 输入时做防抖，降低频繁请求与闪烁
  if (submitDebounceTimer.value) {
    clearTimeout(submitDebounceTimer.value);
  }
  submitDebounceTimer.value = window.setTimeout(() => {
    searchParams.value = { ...values };
    currentPage.value = 1;
    refetchFiles();
  }, 300);
}

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
            opSpinning.value = true;
            await delFileById(file.id);
            message.success($t('system.storageFiles.deleteSuccess'));
            refetchFiles();
          } catch {
            message.error($t('system.storageFiles.deleteFailed'));
          } finally {
            opSpinning.value = false;
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
      // 使用通用预览组件预览（图片类型内部用 a-image 覆盖层）
      previewFile.value = file;
      previewOpen.value = true;
      break;
    }
  }
}

function onCardClick(file: File.View) {
  if (isFetching || opSpinning.value) return;
  handleFileAction('view', file);
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

function handleUploadSuccess() {
  refetchFiles();
}

function handleUploadError(error: Error) {
  console.error('Upload error:', error);
}
</script>

<template>
  <div class="flex h-full flex-col space-y-4">
    <!-- 搜索表单 -->
    <Card size="small" :body-style="{ padding: '12px' }">
      <SearchForm />
    </Card>

    <Card size="small" :body-style="{ padding: '12px' }">
      <div class="flex justify-end">
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
    </Card>

    <div class="relative flex-1 overflow-y-auto">
      <VbenSpinner
        :min-loading-time="150"
        class="!bg-transparent backdrop-blur-0"
        :spinning="opSpinning"
      />
      <!-- Skeleton 占位卡片（分页/查询 isFetching 时显示，覆盖在旧数据上方） -->
      <div v-if="isFetching" class="pointer-events-none absolute inset-0">
        <div
          class="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <Card
            v-for="i in 8"
            :key="`sk-${i}`"
            :body-style="{ padding: '12px' }"
            class="h-full"
          >
            <div
              class="mb-3 aspect-video w-full rounded-md bg-gray-100 dark:bg-gray-800"
            ></div>
            <Skeleton active :title="true" :paragraph="{ rows: 3 }" />
          </Card>
        </div>
      </div>
      <!-- 文件列表 -->
      <div
        class="grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        :class="{ 'pointer-events-none opacity-60': isFetching }"
      >
        <Card
          v-for="file in displayFileList"
          :key="file.id"
          hoverable
          :body-style="{ padding: '12px' }"
          class="group h-full cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg"
          @click="onCardClick(file)"
        >
          <!-- 缩略图（图片） -->
          <div
            v-if="
              file.fileType === 'image' ||
              (file.mimeType && file.mimeType.startsWith('image/'))
            "
            class="relative mb-3"
          >
            <div
              class="aspect-video w-full overflow-hidden rounded-md bg-gray-50"
            >
              <img
                :src="getImageUrl(file)"
                :alt="file.originalName"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                @click.stop="onCardClick(file)"
                @error="onImageError(file.id)"
                @load="onImageLoad(file.id)"
              />
            </div>
            <!-- 图片加载失败覆盖提示 -->
            <div
              v-if="imageErrorMap[file.id]"
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-red-50/80 text-red-600 dark:bg-red-900/40 dark:text-red-300"
              @click.stop
            >
              <VbenIcon icon="ri:error-warning-line" class="size-6" />
              <span class="text-xs">{{
                $t('system.storageFiles.imageLoadFailed')
              }}</span>
              <VbenButton
                size="sm"
                variant="outline"
                @click.stop="onRetryImage(file)"
              >
                {{ $t('system.storageFiles.retry') }}
              </VbenButton>
            </div>
          </div>
          <div class="space-y-3">
            <!-- 文件图标和操作按钮 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  v-if="
                    !(
                      file.fileType === 'image' ||
                      (file.mimeType && file.mimeType.startsWith('image/'))
                    )
                  "
                  class="text-3xl"
                  :class="[getFileColor(file.fileType)]"
                >
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
              <Dropdown
                :trigger="['click']"
                placement="bottomRight"
                @click.stop
              >
                <VbenButton
                  size="sm"
                  variant="ghost"
                  :disabled="isFetching || opSpinning"
                  class="opacity-60 transition-opacity hover:opacity-100 group-hover:opacity-100"
                >
                  <VbenIcon icon="ri:more-2-line" />
                </VbenButton>
                <template #overlay>
                  <Menu @click="onFileMenuClick($event as any, file)">
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
            <div class="mt-2 flex items-center justify-between">
              <Badge
                :status="isFileStatusNormal(file.status) ? 'success' : 'error'"
                :text="getFileStatusLabel(file.status)"
              />
              <div class="flex space-x-1">
                <VbenIconButton
                  :disabled="isFetching || opSpinning"
                  @click.stop="handleFileAction('view', file)"
                  :tooltip="$t('system.storageFiles.preview')"
                >
                  <VbenIcon icon="ri:eye-line" class="size-3" />
                </VbenIconButton>
                <VbenIconButton
                  :disabled="isFetching || opSpinning"
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

      <!-- 空状态 -->
      <div
        v-if="!isFetching && displayFileList.length === 0"
        class="py-12 text-center"
      >
        <VbenIcon
          icon="ri:file-line"
          class="mx-auto mb-4 size-12 text-gray-300"
        />
        <p class="mb-1.5 text-base text-gray-500">
          {{ $t('system.storageFiles.noFiles') }}
        </p>
        <p class="text-xs text-gray-400">
          {{ $t('system.storageFiles.noFilesDesc') }}
        </p>
      </div>
    </div>
    <!-- 分页 -->
    <div v-if="!isFetching && total > pageSize" class="flex justify-center">
      <Pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :show-total="renderPaginationTotal"
        @change="handlePageChange"
      />
    </div>

    <!-- 文件预览组件（图片/视频/音频/PDF/其他） -->
    <FilePreview v-model:open="previewOpen" :file="previewFile" />
  </div>
</template>
