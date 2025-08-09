import request from "@/utils/request";

/**
 * 日志列表查询
 * @param {number} page 页码
 * @param {number} pageSize 每页条数
 * @returns {Promise}
 */
export const getLogPage = (page, pageSize) =>
  request.get("/log/page", {
    params: {
      page,
      pageSize,
    },
  });
