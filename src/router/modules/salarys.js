
import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/salarys/index'),
      name: 'salarys',
      meta: { title: '工资管理', icon: 'money' }
    }
  ]
}
