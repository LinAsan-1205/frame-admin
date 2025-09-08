import type { Upload } from './types';

import { requestClient } from '#/api/request';

/**
 * 自动上传文件
 * @param file 文件对象
 * @param data 额外参数
 */
function uploadAuto(file: File, data: Record<string, any> = {}) {
  const formData = new FormData();
  formData.append('file', file);

  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  return requestClient.post<Upload.View>('/upload/auto', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export { uploadAuto };
