<!-- eslint-disable vue/custom-event-name-casing -->
<script setup lang="ts">
import type { File } from '#/api/system/file/types';

import { computed, watch } from 'vue';

import { VbenButton } from '@vben-core/shadcn-ui';

import { Image, Modal } from 'ant-design-vue';

import { $t } from '#/locales';

const props = defineProps<{ file?: File.View | null }>();

const emit = defineEmits<{ (event: 'openChange', value: boolean): void }>();

const open = defineModel<boolean>('open', { default: false });

const isImage = computed(() => !!props.file && props.file.fileType === 'image');
const isVideo = computed(() => !!props.file && props.file.fileType === 'video');
const isAudio = computed(() => !!props.file && props.file.fileType === 'audio');
const isPdf = computed(
  () =>
    !!props.file &&
    !!props.file.mimeType &&
    props.file.mimeType.toLowerCase().includes('pdf'),
);

// Office 文档类型识别：doc/docx/xls/xlsx/ppt/pptx
const isOfficeDoc = computed(() => {
  if (!props.file) return false;
  const name = (
    props.file.originalName ||
    props.file.fileName ||
    ''
  ).toLowerCase();
  const mime = (props.file.mimeType || '').toLowerCase();
  const extMatch = /(?:\.docx?|\.xlsx?|\.pptx?)$/i.test(name);
  const mimeMatch =
    mime.includes('officedocument') ||
    mime.includes('msword') ||
    mime.includes('vnd.ms-excel') ||
    mime.includes('vnd.ms-powerpoint');
  return extMatch || mimeMatch;
});

function toAbsoluteUrl(url?: string) {
  if (!url) return '';
  try {
    // 若已是绝对地址直接返回
    return new URL(url, window.location.origin).href;
  } catch {
    return url;
  }
}

const encodedSrc = computed(() =>
  encodeURIComponent(toAbsoluteUrl(props.file?.fileUrl)),
);
// 优先使用微软 Office 在线预览，失败时可回退为 Google 预览
const officeMsViewer = computed(
  () =>
    `https://view.officeapps.live.com/op/embed.aspx?src=${encodedSrc.value}`,
);
const officeGoogleViewer = computed(
  () => `https://docs.google.com/gview?embedded=true&url=${encodedSrc.value}`,
);

function onImageVisibleChange(visible: boolean) {
  open.value = visible;
  emit('openChange', visible);
}

function handleOpenOriginalFile() {
  if (props.file?.fileUrl) {
    window.open(props.file.fileUrl, '_blank');
  }
}

function handleOpenGooglePreview() {
  window.open(officeGoogleViewer.value, '_blank');
}

// 当切换到图片类型且需要打开时，确保触发 Image 预览
watch(
  () => [open.value, isImage.value],
  ([visible, image]) => {
    if (!image && visible) {
      // 非图片直接由 Modal 控制，无需特殊处理
    }
  },
);
</script>

<template>
  <!-- 图片：使用 a-image 的预览覆盖层，组件本体隐藏即可 -->
  <Image
    v-if="isImage && file"
    :src="file.fileUrl"
    style="
      position: fixed;
      width: 0;
      height: 0;
      pointer-events: none;
      opacity: 0;
    "
    :preview="{ visible: open, onVisibleChange: onImageVisibleChange }"
  />

  <!-- 视频/音频/PDF/Office/其他：统一用 Modal 承载 -->
  <Modal
    v-else
    v-model:open="open"
    :title="file?.originalName || $t('system.storageFiles.filePreviewTitle')"
    :footer="null"
    :width="isPdf || isOfficeDoc ? 980 : isVideo ? 900 : isAudio ? 520 : 720"
    destroy-on-close
  >
    <template v-if="isVideo && file">
      <div class="flex items-center justify-center">
        <video
          :key="file.id"
          :src="file.fileUrl"
          class="max-h-[70vh] w-full rounded-md bg-black"
          controls
        ></video>
      </div>
    </template>

    <template v-else-if="isAudio && file">
      <div class="flex flex-col items-center space-y-3 p-4">
        <audio
          :key="file.id"
          :src="file.fileUrl"
          class="w-full"
          controls
        ></audio>
        <div class="text-sm text-gray-500">{{ file.originalName }}</div>
      </div>
    </template>

    <template v-else-if="isPdf && file">
      <div class="h-[70vh] w-full overflow-hidden rounded-md">
        <iframe :src="file.fileUrl" class="h-full w-full"></iframe>
      </div>
    </template>

    <template v-else-if="isOfficeDoc && file">
      <div class="mb-2 text-xs text-gray-400">
        {{ $t('system.storageFiles.officePreviewFallbackHint') }}
      </div>
      <div class="h-[70vh] w-full overflow-hidden rounded-md">
        <iframe :src="officeMsViewer" class="h-full w-full"></iframe>
      </div>
      <div class="mt-2 flex justify-end gap-2">
        <VbenButton size="sm" variant="outline" @click="handleOpenOriginalFile">
          {{ $t('system.storageFiles.openOriginalFile') }}
        </VbenButton>
        <VbenButton
          size="sm"
          variant="default"
          @click="handleOpenGooglePreview"
        >
          {{ $t('system.storageFiles.useGooglePreview') }}
        </VbenButton>
      </div>
    </template>

    <template v-else>
      <div class="space-y-3 p-4">
        <div class="text-gray-500">
          {{ $t('system.storageFiles.previewNotSupported') }}
        </div>
        <div class="flex gap-2">
          <VbenButton
            size="sm"
            variant="default"
            @click="handleOpenOriginalFile"
          >
            {{ $t('system.storageFiles.openInNewWindow') }}
          </VbenButton>
        </div>
      </div>
    </template>
  </Modal>
</template>
