<script lang="ts" setup>
import type * as monaco from 'monaco-editor';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from 'vue';

import { useDebounceFn } from '@vueuse/core';

/**
 * Monaco Editor 生命周期钩子
 */
interface LifecycleHooks {
  /** 编辑器创建前 */
  beforeCreate?: () => Promise<void> | void;
  /** 编辑器创建后 */
  onCreated?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  /** 编辑器准备就绪 */
  onReady?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  /** 错误处理 */
  onError?: (error: unknown) => void;
}

/**
 * JSON 编辑器属性
 */
interface JsonEditorProps {
  height?: number | string;
  /** 编辑器主题 */
  theme?: 'vs' | 'vs-dark' | string;
  /** 只读模式 */
  readOnly?: boolean;
  /** Monaco 编辑器原生配置 */
  // eslint-disable-next-line vue/require-default-prop
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  /** 生命周期钩子 */
  // eslint-disable-next-line vue/require-default-prop
  lifecycle?: LifecycleHooks;
  /** 是否启用 JSON 校验（默认启用） */
  validate?: boolean;
  /** 是否显示错误提示文本（默认显示） */
  showError?: boolean;
  /** JSON 校验防抖延迟（毫秒，默认 300） */
  validateDebounce?: number;
}

const props = withDefaults(defineProps<JsonEditorProps>(), {
  height: 300,
  theme: 'vs',
  readOnly: false,
  validate: true,
  showError: true,
  validateDebounce: 300,
});

const emit = defineEmits<{
  /** 内容变化事件 */
  change: [value: string];
  /** 错误事件 */
  error: [error: unknown];
  /** 加载状态事件 */
  loading: [isLoading: boolean];
  /** 准备就绪事件 */
  ready: [];
}>();

// v-model 双向绑定
const model = defineModel<string>('modelValue', { default: '' });

// 容器与编辑器实例（使用 shallowRef 优化性能）
const containerRef = shallowRef<HTMLDivElement>();
const editorInstance = shallowRef<monaco.editor.IStandaloneCodeEditor>();

// 错误消息
const errorMessage = shallowRef<string>();

/**
 * 规范化高度值
 */
const normalizeHeight = (h?: number | string): string => {
  if (h === undefined || h === null) return '300px';
  if (typeof h === 'number') return `${h}px`;
  const v = String(h).trim();
  return /^\d+$/.test(v) ? `${v}px` : v;
};

// 计算属性
const heightStyle = computed(() => normalizeHeight(props.height));
const themeValue = computed(() => props.theme);
const baseOptions =
  computed<monaco.editor.IStandaloneEditorConstructionOptions>(() => ({
    readOnly: props.readOnly,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    tabSize: 2,
    insertSpaces: true,
    fontSize: 14,
    lineNumbers: 'on',
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 10,
    lineNumbersMinChars: 3,
    ...props.options,
  }));

/**
 * 配置 Monaco Editor Worker
 */
const setupMonacoWorker = async () => {
  const [{ default: EditorWorker }, { default: JsonWorker }, monacoEditor] =
    await Promise.all([
      import('monaco-editor/esm/vs/editor/editor.worker?worker'),
      import('monaco-editor/esm/vs/language/json/json.worker?worker'),
      import('monaco-editor'),
    ]);

  // eslint-disable-next-line no-restricted-globals
  (self as any).MonacoEnvironment = {
    getWorker(_: string, label: string) {
      if (label === 'json') {
        return new (JsonWorker as any)();
      }
      return new (EditorWorker as any)();
    },
  };

  return monacoEditor;
};

/**
 * JSON 校验函数（带防抖）
 */
const validateJson = useDebounceFn((value: string) => {
  if (!props.validate) {
    errorMessage.value = undefined;
    return;
  }

  try {
    if (value.trim()) {
      JSON.parse(value);
    }
    errorMessage.value = undefined;
  } catch (error: any) {
    errorMessage.value = error?.message || 'Invalid JSON';
  }
}, props.validateDebounce);

/**
 * 初始化编辑器
 */
const initEditor = async () => {
  if (!containerRef.value) return;

  emit('loading', true);

  try {
    // 执行生命周期钩子
    await props.lifecycle?.beforeCreate?.();

    // 设置 Monaco Worker
    const monaco = await setupMonacoWorker();

    // 配置 JSON 诊断
    if (props.validate) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: [],
      });
    }

    // 创建编辑器实例
    const editor = monaco.editor.create(containerRef.value, {
      value: model.value || '',
      language: 'json',
      theme: themeValue.value,
      ...baseOptions.value,
    });

    editorInstance.value = editor;

    // 执行生命周期钩子
    props.lifecycle?.onCreated?.(editor);

    // 确保布局正确
    await nextTick();
    editor.layout();

    // 监听内容变化
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      if (value !== model.value) {
        model.value = value;
        emit('change', value);
      }
      validateJson(value);
    });

    // 添加格式化快捷键（Ctrl+Shift+F / Cmd+Shift+F）
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      () => {
        formatJson();
      },
    );

    // 初始校验
    validateJson(model.value);

    // 执行准备就绪钩子
    props.lifecycle?.onReady?.(editor);
    emit('ready');
  } catch (error) {
    props.lifecycle?.onError?.(error);
    emit('error', error);
    console.error('[JsonEditor] 初始化失败:', error);
  } finally {
    emit('loading', false);
  }
};

/**
 * 格式化 JSON
 */
const formatJson = (): boolean => {
  try {
    const value = model.value || '';
    if (!value.trim()) return false;

    const obj = JSON.parse(value);
    model.value = JSON.stringify(obj, null, 2);

    // 触发编辑器自动格式化
    editorInstance.value?.getAction('editor.action.formatDocument')?.run();
    return true;
  } catch {
    return false;
  }
};

/**
 * 设置编辑器内容
 */
const setValue = (value: string) => {
  if (editorInstance.value) {
    editorInstance.value.setValue(value || '');
  } else {
    model.value = value || '';
  }
};

/**
 * 获取编辑器内容
 */
const getValue = (): string => {
  return editorInstance.value?.getValue() || model.value;
};

/**
 * 获取编辑器实例
 */
const getEditor = () => {
  return editorInstance.value;
};

/**
 * 聚焦编辑器
 */
const focus = () => {
  editorInstance.value?.focus();
};

/**
 * 刷新编辑器布局
 */
const layout = () => {
  editorInstance.value?.layout();
};

// 生命周期
onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  editorInstance.value?.dispose();
  editorInstance.value = undefined;
});

// 监听外部 v-model 变化
watch(
  model,
  (newValue) => {
    const editor = editorInstance.value;
    if (!editor) return;

    const currentValue = editor.getValue();
    if (newValue !== currentValue) {
      editor.setValue(newValue || '');
    }
  },
  { flush: 'post' },
);

// 监听主题变化
watch(themeValue, (newTheme) => {
  import('monaco-editor').then((monaco) => {
    monaco.editor.setTheme(newTheme);
  });
});

// 监听只读状态变化
watch(
  () => props.readOnly,
  (readOnly) => {
    editorInstance.value?.updateOptions({ readOnly });
  },
);

// 监听选项变化
watch(
  () => props.options,
  (options) => {
    if (editorInstance.value && options) {
      editorInstance.value.updateOptions(options);
    }
  },
  { deep: true },
);

// 监听高度变化
watch(heightStyle, async () => {
  await nextTick();
  layout();
});

// 对外暴露方法
defineExpose({
  /** 格式化 JSON */
  formatJson,
  /** 获取编辑器实例 */
  getEditor,
  /** 设置编辑器内容 */
  setValue,
  /** 获取编辑器内容 */
  getValue,
  /** 聚焦编辑器 */
  focus,
  /** 刷新编辑器布局 */
  layout,
});
</script>

<template>
  <div class="json-editor-wrapper">
    <div
      class="json-editor-container"
      :class="{
        'has-error': showError && errorMessage,
        'is-readonly': readOnly,
      }"
      :style="{ height: heightStyle }"
    >
      <div ref="containerRef" class="editor-content"></div>
    </div>

    <!-- 错误提示 -->
    <Transition name="slide-fade">
      <div v-if="showError && errorMessage" class="error-message-container">
        <div class="error-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="h-4 w-4"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="error-content">
          <div class="error-title">JSON 格式错误</div>
          <div class="error-description">{{ errorMessage }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  .json-editor-container {
    background-color: rgb(17 24 39);
    border-color: rgb(55 65 81);
  }

  .json-editor-container:hover {
    border-color: rgb(75 85 99);
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 30%);
  }

  .json-editor-container.is-readonly {
    background-color: rgb(31 41 55);
  }

  .error-message-container {
    background: linear-gradient(to right, rgb(127 29 29 / 20%), rgb(17 24 39));
    border-color: rgb(153 27 27);
  }

  .error-icon {
    color: rgb(248 113 113);
  }

  .error-title {
    color: rgb(252 165 165);
  }

  .error-description {
    color: rgb(254 202 202);
  }
}

.json-editor-wrapper {
  position: relative;
  width: 100%;
}

.json-editor-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid rgb(229 231 235);
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
}

.json-editor-container:hover {
  border-color: rgb(209 213 219);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 5%);
}

.json-editor-container:focus-within {
  border-color: hsl(219deg 100% 34%);
  box-shadow: 0 0 0 3px hsl(219deg 100% 34% / 10%);
}

.json-editor-container.has-error {
  border-color: rgb(239 68 68);
}

.json-editor-container.has-error:focus-within {
  border-color: rgb(239 68 68);
  box-shadow: 0 0 0 3px rgb(239 68 68 / 10%);
}

.json-editor-container.is-readonly {
  cursor: not-allowed;
  background-color: rgb(249 250 251);
}

.editor-content {
  width: 100%;
  height: 100%;
}

/* 错误提示样式 */
.error-message-container {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  margin-top: 12px;
  background: linear-gradient(to right, rgb(254 242 242), rgb(255 255 255));
  border: 1px solid rgb(254 226 226);
  border-left: 4px solid rgb(239 68 68);
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 5%);
}

.error-icon {
  flex-shrink: 0;
  color: rgb(239 68 68);
}

.error-content {
  flex: 1;
  min-width: 0;
}

.error-title {
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 600;
  color: rgb(220 38 38);
}

.error-description {
  font-size: 12px;
  line-height: 1.5;
  color: rgb(127 29 29);
  word-break: break-word;
}

/* 过渡动画 */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 深色主题类（用于手动切换） */
.dark .json-editor-container {
  background-color: rgb(17 24 39);
  border-color: rgb(55 65 81);
}

.dark .json-editor-container:hover {
  border-color: rgb(75 85 99);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 30%);
}

.dark .json-editor-container.is-readonly {
  background-color: rgb(31 41 55);
}

.dark .error-message-container {
  background: linear-gradient(to right, rgb(127 29 29 / 20%), rgb(17 24 39));
  border-color: rgb(153 27 27);
}

.dark .error-icon {
  color: rgb(248 113 113);
}

.dark .error-title {
  color: rgb(252 165 165);
}

.dark .error-description {
  color: rgb(254 202 202);
}
</style>
