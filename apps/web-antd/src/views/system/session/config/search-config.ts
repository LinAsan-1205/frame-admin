import type { VbenFormProps } from '#/adapter/form';

import { ActiveStatus, DeviceType, PlatformType } from '#/api/system/session';
import { $t } from '#/locales';

/**
 * 会话搜索表单配置
 * @returns 搜索表单配置对象
 */
export function useSearchFormOptions(): VbenFormProps {
  return {
    fieldMappingTime: [['loginTime', ['startTime', 'endTime']]],
    submitOnChange: true,
    schema: [
      {
        component: 'InputNumber',
        fieldName: 'userId',
        label: $t('system.session.userId'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Input',
        fieldName: 'deviceId',
        label: $t('system.session.deviceId'),
        componentProps: {
          allowClear: true,
        },
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: PlatformType.toSelect(),
        },
        fieldName: 'platform',
        label: $t('system.session.platform'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: DeviceType.toSelect(),
        },
        fieldName: 'deviceType',
        label: $t('system.session.deviceType'),
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: ActiveStatus.toSelect(),
        },
        fieldName: 'isActive',
        label: $t('system.session.status'),
      },
      {
        component: 'RangePicker',
        fieldName: 'loginTime',
        label: $t('system.session.loginTime'),
      },
    ],
  };
}
