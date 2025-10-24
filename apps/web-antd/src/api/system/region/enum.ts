import { Enum } from 'enum-plus';

/**
 * 行政区域类型枚举
 */
export const RegionType = Enum({
  Province: { value: 'province', label: '省', color: 'blue' },
  City: { value: 'city', label: '市', color: 'green' },
  Area: { value: 'area', label: '区县', color: 'orange' },
  Street: { value: 'street', label: '街道', color: 'purple' },
} as const);
