import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: {
    menuList: [...constantRoutes] // 菜单渲染依赖的数据 把静态菜单作为一个默认值 动态菜单通过调用mutation函数添加进来
  },
  mutations: {
    // 把动态路由数据过滤好之后 通过这个函数设置到menuList中
    setMenuList(state, filterAsyncRoutes) {
      // 拥有了完整的静态路由表和筛选之后的动态路由表
      state.menuList = [...constantRoutes, ...filterAsyncRoutes]
    }
  }
}
