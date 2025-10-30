<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue';

import { ref, watch } from 'vue';

import { VbenIcon } from '@vben-core/shadcn-ui';

import { Button, message, Upload } from 'ant-design-vue';

import { getFileById } from '#/api/system/file';
import { uploadAuto } from '#/api/upload';
import { $t } from '#/locales';

/**
 * 图片上传组件
 */
interface Props {
  /** 允许的图片类型 */
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
  /** 图片预览宽度 */
  previewWidth?: number;
  /** 图片预览高度 */
  previewHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*',
  maxSize: 5,
  buttonText: '上传图片',
  buttonIcon: 'ri:image-add-line',
  disabled: false,
  data: () => ({}),
  previewWidth: 120,
  previewHeight: 120,
});

const emit = defineEmits<{
  /** 上传失败事件 */
  error: [error: Error];
  /** 上传成功事件 */
  success: [url: string];
}>();

const modelValue = defineModel<string>();

const uploading = ref(false);
const imageUrl = ref<string>(modelValue.value || '');

// 监听外部值变化
watch(
  () => modelValue.value,
  (newVal) => {
    imageUrl.value = newVal || '';
  },
);

// 监听内部值变化
watch(imageUrl, (newVal) => {
  modelValue.value = newVal;
});

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
      // 检查通配符模式（如 image/*）
      if (type.includes('/*')) {
        const prefix = type.split('/*')[0];
        return mimeType.startsWith(`${prefix}/`);
      }
      // 检查文件扩展名（如 .png）
      if (type.startsWith('.')) {
        return fileExtension === type.toLowerCase();
      }
      // 检查精确的 MIME 类型（如 image/png）
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

    if (response?.id) {
      // 根据 id 查询文件详情
      const fileInfo = await getFileById(response.id);
      
      // 使用查询到的文件信息
      imageUrl.value = fileInfo.fileUrl;
      onSuccess({
        url: fileInfo.fileUrl,
        name: fileInfo.originalName || file.name,
        size: fileInfo.fileSize > 0 ? fileInfo.fileSize : file.size,
        status: 'done',
        uid: fileInfo.id,
      });
      emit('success', fileInfo.fileUrl);
    } else {
      throw new Error('Upload failed: Invalid response');
    }
  } catch (error) {
    console.error('Upload error:', error);
    onError(error as Error);
  }
};

/**
 * 删除图片
 */
const handleRemove = () => {
  imageUrl.value = '';
  modelValue.value = '';
};
</script>

<template>
  <div class="image-upload">
    <div v-if="imageUrl" class="image-preview">
      <img
        :src="imageUrl"
        :style="{ width: `${previewWidth}px`, height: `${previewHeight}px` }"
        alt="preview"
        class="preview-image"
      />
      <div class="image-actions">
        <Button
          :disabled="disabled"
          danger
          size="small"
          type="text"
          @click="handleRemove"
        >
          <VbenIcon icon="ri:delete-bin-line" class="size-4" />
          删除
        </Button>
      </div>
    </div>
    <Upload
      v-else
      :accept="accept"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :disabled="disabled"
      :on-change="handleChange"
      :on-error="handleError"
      :show-upload-list="false"
    >
      <Button
        :disabled="disabled"
        :loading="uploading"
        class="flex items-center space-x-2"
        type="dashed"
      >
        <VbenIcon :icon="buttonIcon" class="size-4" />
        <span>{{ buttonText }}</span>
      </Button>
    </Upload>
    <div v-if="!imageUrl" class="upload-tip">
      支持 jpg、png、gif 等图片格式，文件大小不超过 {{ maxSize }}MB
    </div>
  </div>
</template>

<style scoped>
.image-upload {
  @apply w-full;
}

.image-preview {
  @apply relative inline-block;
}

.preview-image {
  @apply rounded border border-gray-300 object-cover;
}

.image-actions {
  @apply mt-2 flex items-center gap-2;
}

.upload-tip {
  @apply mt-2 text-xs text-gray-400;
}
</style>
