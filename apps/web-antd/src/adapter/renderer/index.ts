import type { VxeGlobalRenderer } from 'vxe-table';

import { h } from 'vue';

import { get, isEmpty } from '@vben/utils';

import { useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
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
  renderer.add('CellMaskPhone', {
    renderTableDefault(_renderOpts, params) {
      const { column, row } = params;
      const phone = row[column.field]?.replace(
        /(\d{3})\d{4}(\d{4})/,
        '$1****$2',
      );
      return h('span', {}, phone);
    },
  });
  renderer.add('CellCopyText', {
    renderTableDefault(_renderOpts, params) {
      const { column, row } = params;
      const value = row[column.field];
      const { text, copy, isSupported } = useClipboard({
        source: value,
      });
      const onClick = async () => {
        if (!isSupported.value) {
          message.error('当前浏览器不支持复制');
          return;
        }
        await copy(value);
        if (text.value) {
          message.success('复制成功');
        } else {
          message.error('复制失败');
        }
      };
      return h(
        'span',
        {
          onClick,
        },
        value ?? '-',
      );
    },
  });

  renderer.add('CellFormatEmpty', {
    renderTableDefault(_renderOpts, params) {
      const { column, row } = params;
      const value = row[column.field];
      return h('span', {}, { default: () => (isEmpty(value) ? '-' : value) });
    },
  });
}
