
import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/employees/index'),
      name: 'employees',
      meta: { title: '员工管理', icon: 'people' }
    },
    {
      path: 'detail',
      component: () => import('@/views/employees/detail'),
      name: 'detail',
      meta: { title: '员工详情' },
      hidden: true
    }
  ]
}
