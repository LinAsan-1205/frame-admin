<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

interface Props {
  // eslint-disable-next-line vue/require-default-prop
  description?: string;
  // eslint-disable-next-line vue/require-default-prop
  title?: string;
  icon?: 'empty' | 'error' | 'noData' | 'noResult';
  size?: 'large' | 'medium' | 'small';
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'empty',
  size: 'medium',
  animated: true,
});

const isVisible = ref(false);

onMounted(() => {
  if (props.animated) {
    setTimeout(() => {
      isVisible.value = true;
    }, 100);
  } else {
    isVisible.value = true;
  }
});

const sizeClasses = computed(() => {
  const sizeMap = {
    small: 'p-6 gap-3',
    medium: 'p-10 gap-5',
    large: 'p-14 gap-7',
  };
  return sizeMap[props.size];
});

const iconSizeClasses = computed(() => {
  const sizeMap = {
    small: 'h-12 w-12 p-3',
    medium: 'h-16 w-16 p-4',
    large: 'h-20 w-20 p-5',
  };
  return sizeMap[props.size];
});

const textSizeClasses = computed(() => {
  const sizeMap = {
    small: { title: 'text-base', description: 'text-xs' },
    medium: { title: 'text-lg', description: 'text-sm' },
    large: { title: 'text-xl', description: 'text-base' },
  };
  return sizeMap[props.size];
});

const iconConfig = computed(() => {
  const iconMap = {
    empty: {
      paths: [
        'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z',
        'M14 2v4a2 2 0 0 0 2 2h4',
        'm14.5 12.5-5 5',
        'm9.5 12.5 5 5',
      ],
      gradient:
        'from-slate-100 via-gray-50 to-slate-100 dark:from-slate-800/40 dark:via-slate-700/30 dark:to-slate-800/40',
      iconColor: 'text-slate-400 dark:text-slate-500',
      ring: 'ring-slate-200/50 dark:ring-slate-700/50',
    },
    noData: {
      paths: [
        'M12 2L2 7l10 5 10-5-10-5z',
        'm2 17 10 5 10-5',
        'm2 12 10 5 10-5',
      ],
      gradient:
        'from-blue-100 via-indigo-50 to-blue-100 dark:from-blue-900/40 dark:via-indigo-800/30 dark:to-blue-900/40',
      iconColor: 'text-blue-500 dark:text-blue-400',
      ring: 'ring-blue-200/50 dark:ring-blue-700/50',
    },
    error: {
      paths: [
        'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z',
        'M12 9v4',
        'm12 17.02.01 0',
      ],
      gradient:
        'from-red-100 via-rose-50 to-red-100 dark:from-red-900/40 dark:via-rose-800/30 dark:to-red-900/40',
      iconColor: 'text-red-500 dark:text-red-400',
      ring: 'ring-red-200/50 dark:ring-red-700/50',
    },
    noResult: {
      paths: ['m21 21-4.35-4.35', 'M11 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18z'],
      gradient:
        'from-amber-100 via-yellow-50 to-amber-100 dark:from-amber-900/40 dark:via-yellow-800/30 dark:to-amber-900/40',
      iconColor: 'text-amber-500 dark:text-amber-400',
      ring: 'ring-amber-200/50 dark:ring-amber-700/50',
    },
  };
  return iconMap[props.icon];
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center text-center transition-all duration-500 ease-out"
    :class="[
      sizeClasses,
      {
        'translate-y-4 opacity-0': !isVisible && animated,
        'translate-y-0 opacity-100': isVisible || !animated,
      },
    ]"
  >
    <!-- 图标容器 -->
    <div
      class="group relative mb-4 rounded-full shadow-lg ring-2 transition-all duration-500 ease-out hover:-translate-y-1 hover:scale-110 hover:shadow-2xl"
      :class="[
        iconSizeClasses,
        iconConfig.gradient,
        iconConfig.ring,
        {
          'rotate-12 scale-75 opacity-0': !isVisible && animated,
          'rotate-0 scale-100 opacity-100': isVisible || !animated,
        },
      ]"
      style="transition-delay: 200ms"
    >
      <!-- 背景装饰环 -->
      <div
        class="absolute -inset-1 rounded-full bg-gradient-to-r opacity-20 blur-sm transition-all duration-300 group-hover:opacity-40"
        :class="iconConfig.gradient"
      ></div>

      <!-- 内层发光效果 -->
      <div
        class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br opacity-30 group-hover:animate-none"
        :class="iconConfig.gradient"
      ></div>

      <!-- 图标 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="relative z-10 h-8 w-8 transition-all duration-300 group-hover:scale-110"
        :class="iconConfig.iconColor"
      >
        <path
          v-for="(path, index) in iconConfig.paths"
          :key="index"
          :d="path"
          class="transition-all duration-300"
          :style="{
            opacity: isVisible || !animated ? 1 : 0,
            animationDelay: `${400 + index * 150}ms`,
            transitionDelay: `${400 + index * 150}ms`,
          }"
        />
      </svg>

      <!-- 浮动光点效果 -->
      <div
        v-if="animated"
        class="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 transition-all duration-300 group-hover:opacity-100"
      ></div>
    </div>

    <!-- 标题 -->
    <h3
      v-if="title"
      class="mb-3 font-semibold text-gray-900 transition-all duration-500 dark:text-gray-100"
      :class="[
        textSizeClasses.title,
        {
          'translate-y-2 opacity-0': !isVisible && animated,
          'translate-y-0 opacity-100': isVisible || !animated,
        },
      ]"
      style="transition-delay: 300ms"
    >
      {{ title }}
    </h3>

    <!-- 描述 -->
    <p
      v-if="description"
      class="mb-6 max-w-sm leading-relaxed text-gray-500 transition-all duration-500 dark:text-gray-400"
      :class="[
        textSizeClasses.description,
        {
          'translate-y-2 opacity-0': !isVisible && animated,
          'translate-y-0 opacity-100': isVisible || !animated,
        },
      ]"
      style="transition-delay: 400ms"
    >
      {{ description }}
    </p>

    <!-- 操作按钮插槽 -->
    <div
      class="flex flex-col gap-3 transition-all duration-500 sm:flex-row"
      :class="{
        'translate-y-2 opacity-0': !isVisible && animated,
        'translate-y-0 opacity-100': isVisible || !animated,
      }"
      style="transition-delay: 500ms"
    >
      <slot name="action"></slot>
      <slot name="button"></slot>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgb(59 130 246 / 30%);
  }

  50% {
    box-shadow: 0 0 30px rgb(59 130 246 / 60%);
  }
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 0;
    transform: scale(0.8) rotate(0deg);
  }

  50% {
    opacity: 1;
    transform: scale(1.2) rotate(180deg);
  }
}

/* 响应式动画 */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-glow,
  .animate-sparkle,
  .animate-pulse {
    animation: none;
  }

  .transition-all {
    transition: none;
  }
}

/* 增强可访问性 */
@media (prefers-contrast: high) {
  .ring-1,
  .ring-2 {
    ring-width: 3px;
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

/* 自定义颜色变量 */
.bg-gradient-custom-blue {
  background: linear-gradient(
    135deg,
    rgb(239 246 255) 0%,
    rgb(219 234 254) 25%,
    rgb(191 219 254) 50%,
    rgb(219 234 254) 75%,
    rgb(239 246 255) 100%
  );
}

.dark .bg-gradient-custom-blue {
  background: linear-gradient(
    135deg,
    rgb(30 58 138 / 40%) 0%,
    rgb(37 99 235 / 30%) 25%,
    rgb(59 130 246 / 20%) 50%,
    rgb(37 99 235 / 30%) 75%,
    rgb(30 58 138 / 40%) 100%
  );
}

.bg-gradient-custom-red {
  background: linear-gradient(
    135deg,
    rgb(254 242 242) 0%,
    rgb(254 226 226) 25%,
    rgb(252 165 165) 50%,
    rgb(254 226 226) 75%,
    rgb(254 242 242) 100%
  );
}

.dark .bg-gradient-custom-red {
  background: linear-gradient(
    135deg,
    rgb(127 29 29 / 40%) 0%,
    rgb(185 28 28 / 30%) 25%,
    rgb(239 68 68 / 20%) 50%,
    rgb(185 28 28 / 30%) 75%,
    rgb(127 29 29 / 40%) 100%
  );
}

.bg-gradient-custom-amber {
  background: linear-gradient(
    135deg,
    rgb(255 251 235) 0%,
    rgb(254 243 199) 25%,
    rgb(252 211 77) 50%,
    rgb(254 243 199) 75%,
    rgb(255 251 235) 100%
  );
}

.dark .bg-gradient-custom-amber {
  background: linear-gradient(
    135deg,
    rgb(120 53 15 / 40%) 0%,
    rgb(180 83 9 / 30%) 25%,
    rgb(245 158 11 / 20%) 50%,
    rgb(180 83 9 / 30%) 75%,
    rgb(120 53 15 / 40%) 100%
  );
}

.bg-gradient-custom-slate {
  background: linear-gradient(
    135deg,
    rgb(248 250 252) 0%,
    rgb(241 245 249) 25%,
    rgb(203 213 225) 50%,
    rgb(241 245 249) 75%,
    rgb(248 250 252) 100%
  );
}

.dark .bg-gradient-custom-slate {
  background: linear-gradient(
    135deg,
    rgb(15 23 42 / 40%) 0%,
    rgb(30 41 59 / 30%) 25%,
    rgb(51 65 85 / 20%) 50%,
    rgb(30 41 59 / 30%) 75%,
    rgb(15 23 42 / 40%) 100%
  );
}

/* 微交互效果 */
.hover-lift {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-lift:hover {
  filter: drop-shadow(0 10px 25px rgb(0 0 0 / 15%));
  transform: translateY(-4px) scale(1.05);
}
</style>
