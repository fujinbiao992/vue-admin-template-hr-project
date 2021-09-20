
import Layout from '@/layout'
export default {
  path: '/socials',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/socials/index'),
      name: 'social_securitys',
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
