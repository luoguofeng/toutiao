import Vue from 'vue'
import Router from 'vue-router'
// 导入
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ ease: 'ease', speed: 800 }) // ease：调整动画设置，ease可传递CSS3缓冲动画字符串（如ease、linear、ease-in、ease-out、ease-in-out、cubic-bezier）。speed为动画速度（单位ms）。
Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      // 登录路由
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login')
    },
    {
      // 布局路由
      path: '/layout',
      name: 'Layout',
      component: () => import('@/views/layout'),
      children: [
        // 主页路由
        { path: '/home', component: () => import('@/views/home') },
        // 发布文章路由
        { path: '/publish', component: () => import('@/views/publish') },
        // 发布文章路由
        { path: '/article/list', component: () => import('@/views/article/list') }
      ]
    }
  ],
  // 滚动行为
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
/* 全局全局前置守卫
 每个守卫方法接收三个参数：
 to: Route: 即将要进入的目标 路由对象
 from: Route: 当前导航正要离开的路由
 next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数 */
router.beforeEach((to, from, next) => {
  NProgress.start()
  to.path === '/login' ? next() : localStorage.getItem('userInfo') ? next() : next('/login')
})
router.afterEach(() => {
  NProgress.done()
})

export default router
