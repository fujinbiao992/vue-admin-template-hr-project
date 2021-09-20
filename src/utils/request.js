// 封装了axios所有的操作

// 1.create方法实例化
// 2.请求拦截器
// 3.响应拦截器
// 4.大数问题（1.Number数据超过js能表达的最大精度 2.JSON.parse(data)）
//   如果后端存储id直接使用的是string类型 是不会出现这个问题

import axios from 'axios'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  // 接口基础地址
  // 可以根据不一样的环境 读取到不一样的baseUrl地址
  baseURL: process.env.VUE_APP_BASE_API,
  // 接口超时时间
  timeout: 5000 // request timeout
})

// 请求拦截器
// 统一注入token 让所有用到当前axios实例发送接口请求的时候都拥有了token数据
service.interceptors.request.use(
  config => {
    // config当前的请求参数
    const token = store.getters.token
    // 加入headers中
    config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
// token失效 401监控跳转
service.interceptors.response.use(
  response => {
    // 1.结构出核心字段 data  message success
    const { data, message, success } = response.data
    // 2.根据决定接口是否成功的字段success做接口数据返回处理
    if (success) {
      return data
    } else {
      // 接口失败直接返回一个reject状态的promise对象  暴露错误
      return Promise.reject(new Error(message))
    }
  },
  error => {
    // token失效之后进行处理
    // 判断的依据是 1.http状态码是否为401  2.使用自定义的失效业务状态码10002
    // 访问对象属性的安全性判断 反之出现前面属性不存在的代码bug
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 清空本地用户数据
      store.commit('user/removeUserInfo')
      // 跳回到登录页
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service

// 1.create方法可以执行多次生成多个实例，多个实例完成独立 可以有自己独立的配置
// 2.通过create方法创建的新实例，相当于增强版本的直接导入的axios （增加一些自定义的配置）
// 3.不管是请求拦截器还是响应式拦截器都可以调用多次（use）拦截器会进行一次调用
