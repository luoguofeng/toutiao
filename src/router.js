import Vue from 'vue'
import Router from 'vue-router'
// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // ease：调整动画设置，ease可传递CSS3缓冲动画字符串（如ease、linear、ease-in）。speed为动画速度（单位ms）。
import { Message } from 'element-ui'
NProgress.configure({ ease: 'ease', speed: 800 })

// 解决在使用ElementUi时点击同一个路由，页面报错
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

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
        { path: '/article/publish', component: () => import('@/views/article/publish') },
        // 发布文章路由
        { path: '/article/list', component: () => import('@/views/article/list') },
        // 编辑文章路由
        { path: '/article/edit/:id', component: () => import('@/views/article/publish') },
        // 评论列表路由
        { path: '/article/comment', component: () => import('@/views/article/comment') },
        // 素材管理路由
        { path: '/article/material', component: () => import('@/views/article/material') },
        // 账户信息路由
        { path: '/userInfo', component: () => import('@/views/userInfo') }
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
  if (to.path === '/login' || localStorage.getItem('userInfo')) {
    next()
  } else {
    // 没有登录
    Message({
      message: '您没有登录,请先登录', // 消息文字
      center: true, // 文字是否居中
      duration: 3000, // 显示时间, 毫秒。设为 0 则不会自动关闭
      type: 'warning' // 主题
    })
    next('/login')
  }
})
router.afterEach(() => {
  NProgress.done()
})

export default router
