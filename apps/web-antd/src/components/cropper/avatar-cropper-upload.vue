<script lang="ts" setup>
import type { PropType } from 'vue';

import type { File as FileType } from '#/api/system/file';

import { computed, ref, watch } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

import { useVbenModal, VbenButton } from '@vben/common-ui';

import { Avatar, message } from 'ant-design-vue';

import { getFileById } from '#/api/system/file';
import { uploadAuto } from '#/api/upload/api';
import { $t } from '#/locales';

const props = defineProps({
  // 当前图片 URL（v-model）
  modelValue: { type: String, default: '' },
  // 裁剪比例，例如 1 表示 1:1，16/9 表示 16:9
  aspectRatio: { type: Number, default: 1 },
  // 传入 uploadAuto 的额外表单字段
  uploadData: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  // 选择的图片类型限制
  accept: { type: String, default: 'image/*' },
  // 预览区域宽高（展示时用）
  previewWidth: { type: [Number, String], default: 120 },
  previewHeight: { type: [Number, String], default: 120 },
  // 裁剪弹窗标题
  modalTitle: { type: String, default: '' },
  // 主按钮文案
  buttonText: { type: String, default: '' },
});

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'success', v: FileType.View): void;
}>();

const imageUrl = ref(props.modelValue);
const modalTitleComputed = computed(
  () => props.modalTitle || $t('component.cropper.modalTitle'),
);
const mainButtonText = computed(
  () => props.buttonText || $t('component.cropper.changeAvatar'),
);
watch(
  () => props.modelValue,
  (v) => {
    imageUrl.value = v;
  },
);

// 弹窗与裁剪相关状态
const cropperRef = ref<any>();
const localImageSrc = ref<null | string>(null);
const isImageSelected = computed(() => !!localImageSrc.value);

// 选择图片
function onSelectFile(e: Event) {
  const files = (e.target as HTMLInputElement)?.files;
  if (!files || !files[0]) return;
  const file = files[0];
  if (!file.type.startsWith('image/')) {
    message.error($t('component.cropper.invalidType'));
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    localImageSrc.value = String(reader.result || '');
  });
  reader.readAsDataURL(file);
}

function resetLocal() {
  localImageSrc.value = null;
}

function zoomIn() {
  try {
    cropperRef.value?.zoom?.(1.1);
  } catch {}
}
function zoomOut() {
  try {
    cropperRef.value?.zoom?.(0.9);
  } catch {}
}

const [Modal, modalApi] = useVbenModal({
  title: props.modalTitle,
  async onConfirm() {
    if (!cropperRef.value) {
      message.warning($t('component.cropper.needCrop'));
      return;
    }
    const result = cropperRef.value.getResult?.();
    if (!result || !result.canvas) {
      message.warning($t('component.cropper.needCrop'));
      return;
    }
    const canvas: HTMLCanvasElement = result.canvas as HTMLCanvasElement;
    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      message.error($t('component.cropper.invalidArea'));
      return;
    }
    modalApi.lock();
    try {
      const blob: Blob = await new Promise((resolve, reject) => {
        try {
          canvas.toBlob((b: Blob | null) => {
            if (!b)
              return reject(new Error($t('component.cropper.exportFailed')));
            resolve(b);
          });
        } catch (error) {
          reject(error);
        }
      });
      const file = new File([blob], 'cropped.png', {
        type: blob.type || 'image/png',
      });
      const resp = await uploadAuto(file, props.uploadData);
      const fileInfo = await getFileById(resp.id);
      imageUrl.value = fileInfo.fileUrl;
      emit('update:modelValue', fileInfo.fileUrl);
      emit('success', fileInfo);
      modalApi.close();
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || $t('common.failed'));
      modalApi.unlock();
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      localImageSrc.value = imageUrl.value;
    }
  },
});

function openModal() {
  modalApi.open();
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col items-center gap-2">
      <div
        v-if="imageUrl"
        class="inline-flex items-center justify-center overflow-hidden"
        :style="{ width: `${previewWidth}px`, height: `${previewHeight}px` }"
      >
        <Avatar :src="imageUrl" alt="preview" class="h-full w-full" />
      </div>

      <div>
        <VbenButton size="sm" type="primary" @click="openModal">
          {{ mainButtonText }}
        </VbenButton>
      </div>
    </div>

    <!-- 裁剪弹窗 -->
    <Modal :title="modalTitleComputed">
      <div class="flex flex-col gap-3">
        <div
          class="h-[420px] w-full overflow-hidden rounded-md border border-dashed border-gray-200"
        >
          <Cropper
            ref="cropperRef"
            class="h-full w-full"
            :src="localImageSrc"
            :stencil-props="{ aspectRatio }"
          />
        </div>
        <div class="flex items-center gap-2">
          <label class="relative inline-flex">
            <input
              :accept="accept"
              class="absolute inset-0 cursor-pointer opacity-0"
              type="file"
              @change="onSelectFile"
            />
            <VbenButton size="sm">{{
              $t('component.cropper.selectImage')
            }}</VbenButton>
          </label>
          <div class="flex-1"></div>
          <VbenButton size="sm" :disabled="!isImageSelected" @click="zoomOut">
            {{ $t('component.cropper.zoomOut') }}
          </VbenButton>
          <VbenButton size="sm" :disabled="!isImageSelected" @click="zoomIn">
            {{ $t('component.cropper.zoomIn') }}
          </VbenButton>
          <VbenButton
            size="sm"
            :disabled="!isImageSelected"
            variant="ghost"
            @click="resetLocal"
          >
            {{ $t('component.cropper.reset') }}
          </VbenButton>
        </div>
      </div>
    </Modal>
  </div>
</template>
