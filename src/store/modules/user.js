import { setToken, getToken, removeToken } from '@/utils/auth'
import { login, loginInfo } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken() || '',
    userInfo: ''
  },
  mutations: {
    // 设置用户token信息
    setToken(state, payload) {
      state.token = payload
      setToken(payload)
    },
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    // 清除用户信息
    removeUserInfo(state) {
      state.userInfo = ''
      state.token = {}
      removeToken()
    }
  },
  actions: {
    // 抽离login登录方法
    async asyncGetToken(ctx, payload) {
      const res = await login(payload)
      ctx.commit('setToken', res)
    },
    // 抽离用户资料方法
    async asyncDateUserInfo(ctx) {
      const res = await loginInfo()
      ctx.commit('setUserInfo', res)
      return res
    }
  }
}

