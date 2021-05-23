import axios from 'axios'
import store from '@/store'
// axios实例对象
const service = axios.create({
  // 接口基准地址
  baseURL: process.env.VUE_APP_BASE_API,
  // 接口超时时间
  timeout: 5000
})
// axios请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求头信息中注入token信息
    const token = store.getters.token
    config.headers['Authorization'] = `Bearer${token}`
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// axios响应拦截器
service.interceptors.response.use(
  response => {
    // 简化响应参数
    const { success, data, message } = response.data
    if (success) {
      return data
    } else {
      return Promise(new Error(message))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
