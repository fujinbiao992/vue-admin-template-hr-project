import { setToken, getToken } from '@/utils/auth'
import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken() || ''
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
      setToken(payload)
    }
  },
  actions: {
    // 抽离login登录方法
    async asyncGetToken(ctx, payload) {
      const res = await login(payload)
      ctx.commit('setToken', res)
    }
  }
}

