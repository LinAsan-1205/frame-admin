import type { VxeGlobalRenderer } from 'vxe-table';

import { h } from 'vue';

import { get } from '@vben/utils';

import dayjs from 'dayjs';

export function renderers(renderer: VxeGlobalRenderer) {
  // 单元格渲染：日期格式化
  renderer.add('CellFormatDate', {
    renderTableDefault({ props }, { column, row }) {
      const value = get(row, column.field);
      const { unit = 'YYYY-MM-DD HH:mm:ss', placeholder = '-' } = props ?? {};

      // 边界处理：检查值是否为空或无效
      if (value === null || value === '' || value === undefined) {
        return h(
          'span',
          { class: 'text-gray-400' },
          { default: () => placeholder },
        );
      }

      // 边界处理：验证日期是否有效
      const date = dayjs(value);
      if (!date.isValid()) {
        return h(
          'span',
          { class: 'text-red-400' },
          { default: () => '无效日期' },
        );
      }

      const formatValue = date.format(unit);
      return h('span', {}, { default: () => formatValue });
    },
  });
}
