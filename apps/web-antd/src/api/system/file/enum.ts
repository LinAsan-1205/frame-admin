import { Enum } from 'enum-plus';

/**
 * 文件状态
 */
export const FileStatus = Enum({
  Normal: { value: '0', label: '正常', type: 'success' },
  Deleted: { value: '1', label: '已删除', type: 'error' },
} as const);

/**
 * 文件类型
 */
export const FileType = Enum({
  Image: { value: 'image', label: '图片', type: 'success' },
  Document: { value: 'document', label: '文档', type: 'info' },
  Video: { value: 'video', label: '视频', type: 'warning' },
  Audio: { value: 'audio', label: '音频', type: 'processing' },
  Other: { value: 'other', label: '其他', type: 'default' },
} as const);

/**
 * 存储类型
 */
export const StorageType = Enum({
  Local: { value: 'local', label: '本地存储', type: 'success' },
  OSS: { value: 'oss', label: '阿里云OSS', type: 'info' },
  COS: { value: 'cos', label: '腾讯云COS', type: 'warning' },
} as const);
