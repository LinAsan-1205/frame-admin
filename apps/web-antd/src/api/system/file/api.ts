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

function delFileById(id: number) {
  return requestClient.delete<boolean>(`/system/file/${id}`);
}

export { delFileById, queryFilePage };
