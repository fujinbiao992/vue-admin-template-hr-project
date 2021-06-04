import request from '@/utils/request'

/**
 * @description: 登录
 * @param {*} data {mobile, password}
 * @return {*}
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
export function loginInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
