<script setup lang="ts">
import type { UploadFile, UploadProps } from 'ant-design-vue';

import { ref } from 'vue';

import { VbenIcon } from '@vben-core/shadcn-ui';

import { Button, message, Upload } from 'ant-design-vue';

import { uploadAuto } from '#/api/upload';
import { $t } from '#/locales';

/**
 * 文件上传组件
 * 支持单文件和多文件上传
 */
interface Props {
  /** 是否支持多文件上传 */
  multiple?: boolean;
  /** 允许的文件类型 */
  accept?: string;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 最大文件数量 */
  maxCount?: number;
  /** 上传按钮文本 */
  buttonText?: string;
  /** 上传按钮图标 */
  buttonIcon?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 上传地址 */
  action?: string;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 额外参数 */
  data?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  accept: '*',
  maxSize: 10,
  maxCount: 1,
  buttonText: '上传文件',
  buttonIcon: 'ri:upload-line',
  disabled: false,
  action: '/api/upload',
  headers: () => ({}),
  data: () => ({}),
});

const emit = defineEmits<{
  /** 文件变化事件 */
  change: [info: { file: UploadFile; fileList: UploadFile[] }];
  /** 上传失败事件 */
  error: [error: Error, file: UploadFile, fileList: UploadFile[]];
  /** 上传成功事件 */
  success: [file: UploadFile, fileList: UploadFile[]];
}>();

const fileList = ref<UploadFile[]>([]);
const uploading = ref(false);

/**
 * 处理文件上传前验证
 * @param file 文件对象
 */
const beforeUpload = (file: File): boolean => {
  // 检查文件大小
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize;
  if (!isLtMaxSize) {
    message.error($t('system.storageFiles.fileSizeExceeded', [props.maxSize]));
    return false;
  }

  // 检查文件类型
  if (props.accept !== '*') {
    const acceptTypes = props.accept.split(',').map((type) => type.trim());
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    const mimeType = file.type;

    const isAcceptedType = acceptTypes.some((type) => {
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      }
      if (type.includes('/')) {
        return mimeType === type;
      }
      return false;
    });

    if (!isAcceptedType) {
      message.error($t('system.storageFiles.fileTypeNotAllowed'));
      return false;
    }
  }

  // 这里可以添加自定义验证逻辑
  // 例如：调用父组件传入的验证函数

  return true;
};

/**
 * 处理文件变化
 * @param info 文件信息
 */
const handleChange: UploadProps['onChange'] = (info) => {
  let newFileList = [...info.fileList];

  // 限制文件数量
  if (props.maxCount && newFileList.length > props.maxCount) {
    newFileList = newFileList.slice(-props.maxCount);
  }

  // 更新文件列表
  fileList.value = newFileList;

  // 触发变化事件
  emit('change', { file: info.file, fileList: newFileList });

  // 处理上传状态
  switch (info.file.status) {
    case 'done': {
      uploading.value = false;
      message.success($t('system.storageFiles.uploadSuccess'));
      emit('success', info.file, newFileList);

      break;
    }
    case 'error': {
      uploading.value = false;
      message.error($t('system.storageFiles.uploadFailed'));
      emit('error', new Error('Upload failed'), info.file, newFileList);

      break;
    }
    case 'uploading': {
      uploading.value = true;

      break;
    }
    // No default
  }
};

/**
 * 处理上传错误
 * @param error 错误信息
 * @param file 文件对象
 * @param fileList 文件列表
 */
const handleError = (
  error: Error,
  file: UploadFile,
  fileList: UploadFile[],
) => {
  uploading.value = false;
  message.error($t('system.storageFiles.uploadFailed'));
  emit('error', error, file, fileList);
};

/**
 * 自定义上传请求
 * @param options 上传选项
 */
const customRequest = async (options: any) => {
  const { file, onSuccess, onError, onProgress } = options;

  try {
    // 创建FormData
    const formData = new FormData();
    formData.append('file', file);

    // 添加额外参数
    Object.keys(props.data).forEach((key) => {
      formData.append(key, props.data[key]);
    });

    // 模拟上传进度
    let progress = 0;
    const progressTimer = setInterval(() => {
      progress += 10;
      onProgress({ percent: progress });
    }, 100);

    // 调用真实的上传API
    const response = await uploadAuto(file, props.data);

    // 清除进度定时器
    clearInterval(progressTimer);

    // 处理API响应
    if (response) {
      onSuccess({
        url: response.url || URL.createObjectURL(file),
        name: response.name || file.name,
        size: response.size > 0 ? response.size : file.size,
        status: 'done',
        uid: file.uid,
      });
    } else {
      throw new Error('Upload failed: Invalid response');
    }
  } catch (error) {
    console.error('Upload error:', error);
    onError(error as Error);
  }
};

/**
 * 清空文件列表
 */
const clearFiles = () => {
  fileList.value = [];
};

/**
 * 获取已上传的文件列表
 */
const getFileList = () => {
  return fileList.value;
};

// 暴露方法给父组件
defineExpose({
  clearFiles,
  getFileList,
});
</script>

<template>
  <div class="file-upload">
    <Upload
      :file-list="fileList"
      :multiple="multiple"
      :accept="accept"
      :action="action"
      :headers="headers"
      :data="data"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :on-change="handleChange"
      :on-error="handleError"
      :show-upload-list="false"
      :disabled="disabled"
    >
      <Button
        :loading="uploading"
        :disabled="disabled"
        type="primary"
        class="flex items-center space-x-2"
      >
        <VbenIcon :icon="buttonIcon" class="size-4" />
        <span>{{ buttonText }}</span>
      </Button>
    </Upload>

    <!-- 文件列表显示 -->
    <div v-if="fileList.length > 0" class="mt-3 space-y-2">
      <div
        v-for="file in fileList"
        :key="file.uid"
        class="flex items-center justify-between rounded border bg-gray-50 p-2"
      >
        <div class="flex items-center space-x-2">
          <VbenIcon
            :icon="file.status === 'done' ? 'ri:check-line' : 'ri:file-line'"
            class="size-4"
            :class="[
              file.status === 'done' ? 'text-green-500' : 'text-gray-400',
            ]"
          />
          <span class="text-sm text-gray-700">{{ file.name }}</span>
          <span class="text-xs text-gray-500">
            ({{ Math.round((file.size || 0) / 1024) }}KB)
          </span>
        </div>
        <div class="flex items-center space-x-1">
          <span
            v-if="file.status === 'uploading'"
            class="text-xs text-blue-500"
          >
            {{ file.percent }}%
          </span>
          <VbenIcon
            v-else-if="file.status === 'error'"
            icon="ri:close-line"
            class="size-4 text-red-500"
          />
          <VbenIcon
            v-else-if="file.status === 'done'"
            icon="ri:check-line"
            class="size-4 text-green-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-upload {
  @apply w-full;
}
</style>
