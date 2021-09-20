import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
/* Layout */
import Layout from '@/layout'
// 引入多个动态路由模块
import approvalsRouter from './modules/approvals'
import departmentsRouter from './modules/departments'
import employeesRouter from './modules/employees'
import permissionRouter from './modules/permissions'
import attendancesRouter from './modules/attendances'
import salarysRouter from './modules/salarys'
import settingRouter from './modules/settings'
// import socialRouter from './modules/socials'

// 动态路由表
export const asyncRoutes = [
  departmentsRouter,
  settingRouter,
  employeesRouter,
  permissionRouter,
  approvalsRouter,
  attendancesRouter,
  salarysRouter
  // socialRouter
]

// 静态路由表
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/import',
    component: Layout,
    children: [{
      path: '',
      name: 'import',
      component: () => import('@/views/Import/index')
    }]
  }
  // 404 page must be placed at the end !!!
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // 组合静态和动态路由
  routes: [...constantRoutes, ...asyncRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
