import { setToken, getToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUserDateByID } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken() || '',
    userInfo: {}
  },
  mutations: {
    // 设置用户token信息
    setToken(state, payload) {
      state.token = payload
      setToken(payload)
    },
    // 设置用户信息
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    // 清除用户信息
    removeUserInfo(state) {
      state.userInfo = {}
      state.token = ''
      removeToken()
    }
  },
  actions: {
    // 抽离login登录方法
    async asyncGetToken(ctx, payload) {
      const res = await login(payload)
      ctx.commit('setToken', res)
    },
    // 抽离用户信息方法
    async asyncDateUserInfo(ctx) {
      // 1- 获取用户登录信息接口方法
      const res = await getUserInfo()
      // 2- 获取用户信息展示头像ID接口方法
      const baseInfo = await getUserDateByID(res.userId)
      // 3- 通知更改setUserInfo用户信息
      ctx.commit('setUserInfo', { ...res, ...baseInfo })
      return res
    }
  }
}

