
import Layout from '@/layout'
export default {
  path: '/permissions',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/permission/index'),
      name: 'permissions',
      meta: { title: '权限点管理', icon: 'lock' }
    }
  ]
}
