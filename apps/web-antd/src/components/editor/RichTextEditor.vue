<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';

// @ts-expect-error - wangEditor 类型定义问题
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { message } from 'ant-design-vue';

import { getFileById } from '#/api/system/file';
import { uploadAuto } from '#/api/upload';

import '@wangeditor/editor/dist/css/style.css';

/**
 * 富文本编辑器组件
 */
interface Props {
  /** 编辑器工具栏配置 */
  toolbar?: 'essential' | 'full' | 'minimal';
  /** 占位符文本 */
  placeholder?: string;
  /** 只读模式 */
  readOnly?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 最小高度 */
  minHeight?: number | string;
  /** 最大高度 */
  maxHeight?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  toolbar: 'full',
  placeholder: '请输入内容...',
  readOnly: false,
  disabled: false,
  minHeight: '300px',
  maxHeight: '600px',
});

const emit = defineEmits<{
  /** 失去焦点事件 */
  blur: [];
  /** 内容变化事件 */
  change: [content: string];
  /** 获得焦点事件 */
  focus: [];
  /** 编辑器准备就绪事件 */
  ready: [];
}>();

const modelValue = defineModel<string>();

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML
const valueHtml = ref(modelValue.value || '');

// 监听外部值变化
watch(
  () => modelValue.value,
  (newVal) => {
    if (newVal !== valueHtml.value) {
      valueHtml.value = newVal || '';
    }
  },
);

// 监听内部值变化
watch(valueHtml, (newVal) => {
  modelValue.value = newVal;
  emit('change', newVal);
});

/**
 * 获取工具栏配置
 */
function getToolbarConfig() {
  if (props.toolbar === 'minimal') {
    return {
      toolbarKeys: [
        'bold',
        'italic',
        'underline',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'insertLink',
      ],
    };
  }
  
  if (props.toolbar === 'essential') {
    return {
      toolbarKeys: [
        'headerSelect',
        'bold',
        'italic',
        'underline',
        'through',
        '|',
        'bulletedList',
        'numberedList',
        'blockquote',
        '|',
        'color',
        'bgColor',
        '|',
        'insertLink',
        'uploadImage',
        '|',
        'undo',
        'redo',
      ],
    };
  }
  
  // full 模式使用默认全部工具栏
  return {};
}

/**
 * 工具栏配置
 */
const toolbarConfig: any = getToolbarConfig();

/**
 * 编辑器配置
 */
const editorConfig: any = {
  placeholder: props.placeholder,
  readOnly: props.readOnly || props.disabled,
  MENU_CONF: {
    uploadImage: {
      // 自定义图片上传
      async customUpload(file: File, insertFn: (url: string) => void) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          message.error('请选择图片文件');
          return;
        }

        // 验证文件大小（5MB）
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          message.error('图片大小不能超过 5MB');
          return;
        }

        try {
          const hide = message.loading('图片上传中...', 0);

          // 上传文件
          const uploadResponse = await uploadAuto(file);

          if (!uploadResponse?.id) {
            throw new Error('上传失败：无效的响应');
          }

          // 根据 id 查询文件详情
          const fileInfo = await getFileById(uploadResponse.id);

          hide();

          if (fileInfo?.fileUrl) {
            // 插入图片到编辑器
            insertFn(fileInfo.fileUrl);
            message.success('图片上传成功');
          } else {
            throw new Error('获取图片地址失败');
          }
        } catch (error) {
          console.error('Image upload error:', error);
          message.error('图片上传失败，请重试');
        }
      },
    },
  },
};

/**
 * 编辑器创建完成
 */
const handleCreated = (editor: any) => {
  editorRef.value = editor;
  emit('ready');
};

/**
 * 获得焦点
 */
const handleFocus = () => {
  emit('focus');
};

/**
 * 失去焦点
 */
const handleBlur = () => {
  emit('blur');
};

/**
 * 获取编辑器实例
 */
const getEditor = () => {
  return editorRef.value;
};

/**
 * 设置内容
 */
const setContent = (content: string) => {
  valueHtml.value = content;
};

/**
 * 获取内容（HTML）
 */
const getContent = () => {
  return valueHtml.value;
};

/**
 * 清空内容
 */
const clearContent = () => {
  valueHtml.value = '';
};

/**
 * 获取文本内容（无格式）
 */
const getText = () => {
  const editor = editorRef.value;
  return editor?.getText() || '';
};

/**
 * 获取内容长度
 */
const getLength = () => {
  const editor = editorRef.value;
  const text = editor?.getText() || '';
  return text.length;
};

// 组件销毁时，销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor === null || editor === undefined) return;
  editor.destroy();
});

// 暴露方法给父组件
defineExpose({
  clearContent,
  getContent,
  getEditor,
  getLength,
  getText,
  setContent,
});
</script>

<template>
  <div
    class="rich-text-editor"
    :class="{
      'is-disabled': disabled,
      'is-readonly': readOnly,
    }"
  >
    <Toolbar
      :default-config="toolbarConfig"
      :editor="editorRef"
      mode="default"
      class="editor-toolbar"
    />
    <Editor
      v-model="valueHtml"
      :default-config="editorConfig"
      mode="default"
      class="editor-container"
      @on-blur="handleBlur"
      @on-created="handleCreated"
      @on-focus="handleFocus"
    />
  </div>
</template>

<style scoped>
.rich-text-editor {
  @apply w-full rounded border border-gray-300;
}

.editor-toolbar {
  @apply border-b border-gray-300 bg-white;
}

.editor-toolbar :deep(.w-e-toolbar) {
  background-color: #fff;
  border: none;
}

.editor-container {
  min-height: v-bind(minHeight);
  max-height: v-bind(maxHeight);
  overflow-y: auto;
}

.editor-container :deep(.w-e-text-container) {
  min-height: v-bind(minHeight);
}

.rich-text-editor.is-disabled {
  @apply bg-gray-50;
}

.rich-text-editor.is-readonly {
  @apply bg-gray-50;
}

/* 自定义滚动条样式 */
.editor-container::-webkit-scrollbar {
  @apply w-2;
}

.editor-container::-webkit-scrollbar-track {
  @apply rounded bg-gray-100;
}

.editor-container::-webkit-scrollbar-thumb {
  @apply rounded bg-gray-300;
}

.editor-container::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400;
}

/* 编辑器内容区域样式 */
.rich-text-editor :deep(.w-e-text-container) {
  background-color: #fff;
}

.rich-text-editor :deep(.w-e-text-placeholder) {
  @apply italic text-gray-400;
}

/* 图片样式 - 支持调整大小 */
.rich-text-editor :deep(.w-e-text-container img) {
  cursor: pointer;
  max-width: 100%;
  height: auto;
}

/* 禁用和只读状态 */
.rich-text-editor.is-disabled :deep(.w-e-text-container),
.rich-text-editor.is-readonly :deep(.w-e-text-container) {
  @apply bg-gray-50;
}
</style>
