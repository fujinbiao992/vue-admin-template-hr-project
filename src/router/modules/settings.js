
import Layout from '@/layout'
export default {
  path: '/settings',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/settings/index'),
      name: 'settings',
      meta: { title: '角色管理', icon: 'setting' }
    }
  ]
}
