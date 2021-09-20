// 当前文件做权限相关的工作
// 在一个文件中通过import 引入一个js文件 直接会执行里面的代码
import router from '@/router'
import store from '@/store'
// 导入动态路由表
import { asyncRoutes } from '@/router'
// 目标：通过token做页面跳转判断
// 路由全局导航守卫  前守卫
// 声明白名单
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  // to:跳转到的目标路由对象
  // from: 来源目标路由对象
  // next: 放行函数
  // 根据token做判断逻辑 必须在beforeEach方法中获取token数据
  // 保证每次路由跳转的时候都会去取值！！
  const token = store.getters.token
  if (token) {
    if (to.path === '/login') {
      // 重定向
      next('/')
    } else {
      // 跳转到任何一个除了登录之外的页面
      // 触发获取用户资料数据的action函数
      // 并且还需要保证用户资料接口成功返回之后才能进行跳转（同步）
      // 优化重复调用：根据当前vuex里面的userId 如果已经有了就不要再调用了
      if (!store.getters.userId) {
        const res = await store.dispatch('user/asyncSetUserInfo')
        // console.log('接受action函数返回值：', res)
        // 1.拿到当前登录用户可访问的菜单标识
        const menus = res.roles.menus
        // 2.俩份数据都具备了 对所有的动态路由表做过滤处理
        // 过滤思路：遍历我们所有的动态路由表 通过路由name去做匹配
        // name属性只有能在菜单权限表里面找到 才有资格展示
        let filterRoutes = []
        filterRoutes = asyncRoutes.filter((route) => {
          return menus.includes(route.children[0].name)
        })
        // console.log('过滤完毕的动态路由表', filterRoutes)
        // 实际应用：
        // 2.显示到左侧菜单中
        store.commit('menu/setMenuList', [...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // 1.把过滤得到的最终的路由数据加入到路由系统中
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // 解决刷新出现的白屏bug
        next({
          ...to, // next({ ...to })的目的,是保证路由添加完了再进入页面 (可以理解为重进一次)
          replace: true // 重进一次, 不保留重复历史
        })
        return
      }
      next()
    }
    // 有token
  } else {
    // 没有token
    // 白名单表示不需要经过token判断 不管有没有token都可以跳的过去
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

