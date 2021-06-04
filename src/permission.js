// 权限拦截配置文件,导航守卫,路由守卫
import router from '@/router'
import store from '@/store'
const whiteList = ['/login', '/404'] // 定义白名单  所有不受权限控制的页面

// 创建路由前置导航守卫函数
router.beforeEach(async function(to, from, next) {
  // 获取token信息,根据token信息判断是否进行放行操作
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      await store.dispatch('user/asyncDateUserInfo')
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      // 如果在白名单中,那么放行
      next()
    } else {
      // 如果没有在白名单中,跳转到登录页面
      next('/login')
    }
  }
})
