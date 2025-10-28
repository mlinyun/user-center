export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { name: '登录', path: '/user/login', component: './user/login' },
      { name: '注册', path: '/user/register', component: './user/register' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './welcome' },
  { path: '/profile', name: '个人中心', icon: 'user', component: './user/profile' },
  { path: '/settings', name: '账号设置', icon: 'setting', component: './user/settings' },
  {
    path: '/admin',
    name: '管理页',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/user-manage' },
      { path: '/admin/user-manage', name: '用户管理', component: './admin/user-manage' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
