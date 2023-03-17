import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'BCell',
    component: DefaultLayout,
    redirect: '/order/new',
    children: [
      {
        path: '/order',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: '/order/new',
            name: 'Tạo phiếu mới',
            meta: { requiresAuth: true },
            component: () => import('@/views/Order/New.vue'),
          },
          {
            path: '/order/manager',
            name: 'Quản lý phiếu',
            meta: { requiresAuth: true },
            component: () => import('@/views/Order/Manager.vue'),
          },
        ],
      },
      {
        path: '/provider',
        name:'Nhà cung cấp',
        redirect: '/provider/new',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        children: [
          {
            path: '/provider/new',
            name: 'Thêm nhà cung cấp mới',
            meta: { requiresAuth: true },
            component: () => import('@/views/Shop/Provider/New.vue'),
          },
        ],
      },
      {
        path: '/admin',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/admin/order',
        children: [
          {
            path: '/admin/order',
            name: 'Tất cả phiếu',
            meta: { requiresAuth: true },
            component: () => import('@/views/Admin/Order.vue'),
          },
          {
            path: '/admin/member',
            name: 'Thành viên',
            meta: { requiresAuth: true },
            component: () => import('@/views/Admin/Member.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/pages',
    redirect: '/pages/404',
    name: '404Page',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Không tìm thấy trang',
        component: () => import('@/views/Pages/Page404'),
      },
      {
        path: 'login',
        name: 'Đăng nhập',
        component: () => import('@/views/Pages/Login'),
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/pages/404' },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  document.title = to.name
  const token = localStorage.getItem('token') || null
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) next({ path: '/pages/login' })
  }
  next()
})

export default router
