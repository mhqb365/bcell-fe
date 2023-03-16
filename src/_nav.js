export default [
  {
    component: 'CNavTitle',
    name: 'Nghiệp vụ chi nhánh',
    permission: 0,
  },
  {
    component: 'CNavItem',
    name: 'Tạo phiếu mới',
    to: '/order/new',
    icon: 'cil-note-add',
    permission: 0,
  },
  {
    component: 'CNavItem',
    name: 'Quản lý phiếu',
    to: '/order/manager',
    icon: 'cil-notes',
    permission: 0,
  },
  {
    component: 'CNavItem',
    name: 'Đăng nhập',
    to: '/pages/login',
    icon: 'cil-user',
    permission: 0,
  },
  {
    component: 'CNavTitle',
    name: 'Dữ liệu chung',
    permission: 1,
  },
  {
    component: 'CNavItem',
    name: 'Tất cả phiếu',
    to: '/admin/order',
    icon: 'cil-notes',
    permission: 1,
  },
  {
    component: 'CNavItem',
    name: 'Thành viên',
    to: '/admin/member',
    icon: 'cil-user',
    permission: 1,
  },
]
