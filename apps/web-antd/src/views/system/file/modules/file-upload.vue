<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue';

import { ref } from 'vue';

import { VbenIcon } from '@vben-core/shadcn-ui';

import { Button, message, Upload } from 'ant-design-vue';

import { uploadAuto } from '#/api/upload';
import { $t } from '#/locales';

/**
 * 单文件上传组件
 */
interface Props {
  /** 允许的文件类型 */
  accept?: string;
  /** 最大文件大小（MB） */
  maxSize?: number;
  /** 上传按钮文本 */
  buttonText?: string;
  /** 上传按钮图标 */
  buttonIcon?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 额外参数 */
  data?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*',
  maxSize: 10,
  buttonText: '上传文件',
  buttonIcon: 'ri:upload-line',
  disabled: false,
  data: () => ({}),
});

const emit = defineEmits<{
  /** 上传失败事件 */
  error: [error: Error];
  /** 上传成功事件 */
  success: [];
}>();

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

  return true;
};

/**
 * 处理文件变化
 * @param info 文件信息
 */
const handleChange: UploadProps['onChange'] = (info) => {
  // 处理上传状态
  switch (info.file.status) {
    case 'done': {
      uploading.value = false;
      message.success($t('system.storageFiles.uploadSuccess'));
      emit('success');
      break;
    }
    case 'error': {
      uploading.value = false;
      message.error($t('system.storageFiles.uploadFailed'));
      emit('error', new Error('Upload failed'));
      break;
    }
    case 'uploading': {
      uploading.value = true;
      break;
    }
  }
};

/**
 * 处理上传错误
 * @param error 错误信息
 */
const handleError = (error: Error) => {
  uploading.value = false;
  message.error($t('system.storageFiles.uploadFailed'));
  emit('error', error);
};

/**
 * 自定义上传请求
 * @param options 上传选项
 */
const customRequest = async (options: any) => {
  const { file, onSuccess, onError, onProgress } = options;

  try {
    let progress = 0;
    const progressTimer = setInterval(() => {
      progress += 10;
      onProgress({ percent: progress });
    }, 100);

    const response = await uploadAuto(file, props.data).finally(() => {
      clearInterval(progressTimer);
    });

    if (response) {
      onSuccess({
        url: response.fileUrl || URL.createObjectURL(file),
        name: response.originalName || file.name,
        size: response.fileSize > 0 ? response.fileSize : file.size,
        status: 'done',
        uid: file.id,
      });
    } else {
      throw new Error('Upload failed: Invalid response');
    }
  } catch (error) {
    console.error('Upload error:', error);

    onError(error as Error);
  }
};
</script>

<template>
  <div class="file-upload">
    <Upload
      :accept="accept"
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
  </div>
</template>

<style scoped>
.file-upload {
  @apply w-full;
}
</style>
