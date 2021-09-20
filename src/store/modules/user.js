import { setToken, getToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    token: getToken() || '', // token
    userInfo: {} // 用户资料
  },
  mutations: {
    setToken(state, payload) {
      // 把token存入vuex中state
      state.token = payload
      // 把token存入本地cookie
      setToken(payload)
    },
    // 修改userInfo的函数
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    // 清空用户信息
    removeUserInfo(state) {
      state.token = ''
      // 清空本地cookie
      removeToken()
      state.userInfo = {}
    }
  },
  actions: {
    loginOutRemove(ctx) {
      // 重置路由系统
      // 清空vuex中管理的菜单数据
      // 跨模块调用mutation
      // 1. 必须要在action函数中调用另外一个模块的mutation ctx.commit()
      // 2. 和一般的mutation函数触发不同 ctx.commit('模块名称/mutation名称',payload,{root:true})
      resetRouter()
      ctx.commit('menu/setMenuList', [], { root: true })
    },
    // 发送登录请求获取token数据
    async asyncSetToken(ctx, payload) {
      const res = await login(payload)
      ctx.commit('setToken', res)
      // action函数是可以拥有返回值的，并且action被dispatch调用之后返回的是一个promise对象
    },
    async asyncSetUserInfo(ctx) {
      // 1. 发送请求请求用户数据
      const res = await getUserInfo()
      // 2. 获取用户头像
      const imgInfo = await getUserDetailById(res.userId)
      // 把获得的头像数据和之前的用户资料数据做一个融合
      // 把融合之后的对象通过提交mutation的方式一起提交过去

      // 2. 提交mutation函数修改userInfo
      ctx.commit('setUserInfo', { ...res, ...imgInfo })
      // 如果在其他模块中想使用action函数中异步请求的返回值 可以将异步请求返回的结果作为
      // action函数的return值return出来
      return res
    }
  }
}

