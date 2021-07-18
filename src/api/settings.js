import request from '@/utils/request'

/**
 * @description: 获取角色列表
 * @param {*} params:{page, pageSize}
 * @return {*}
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
