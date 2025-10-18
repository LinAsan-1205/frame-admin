import type { File } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

function queryFilePage(
  pageCursor: Api.PageCursor = {},
  condition: File.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<File.View[]>>(
    '/system/file/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

function getFileById(fileId: number) {
  return requestClient.get<File.View>(`/system/file/${fileId}`);
}

function delFileById(fileId: number) {
  return requestClient.delete<boolean>(`/system/file/${fileId}`);
}

export { delFileById, getFileById, queryFilePage };
