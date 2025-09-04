import type { Log } from './types';

import type { Api } from '#/api/types';

import { requestClient } from '#/api/request';

/**
 * 获取任务列表数据
 * @param pageCursor 分页参数
 * @param condition 查询条件
 */
function queryLogPage(
  pageCursor: Api.PageCursor = {},
  condition: Log.Condition = {},
) {
  return requestClient.get<Api.PaginationResult<Log.View>>(
    '/schedule/log/page',
    {
      params: {
        ...pageCursor,
        ...condition,
      },
    },
  );
}

export { queryLogPage };
