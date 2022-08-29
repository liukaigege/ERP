import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './router.config'
import store from '../store/index.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
  scrollBehavior() {
    return {
      top: 0
    }
  }
})
let scrollTop = 0
NProgress.configure({ showSpinner: false }) // NProgress  Configuration
const loginRoutePath = '/login'
router.beforeEach((to, from, next) => {
  scrollTop = document.documentElement.scrollTop
  NProgress.start()
  const token = store.getters.token
  const hasRouter = store.state.user.hasRouter
  if (!token && to.path !== loginRoutePath) {
    next(loginRoutePath)
  } else if (!hasRouter && to.path !== loginRoutePath) {
    // 加载路由
    store.commit('user/addRouters')
    next({ ...to, replace: true })
  } else if (to.matched.length == 0) { // 路由不存在,即指定跳转到404页面
    next({ name: '404', params: { title: '抱歉，页面不存在' } })

  } else {
    next()
  }

})

router.afterEach((to, from) => {
	const topPath =  store.state.menu.asideMenu.find(item=>to.fullPath.includes(item.routeUrl))
  NProgress.done()
  // 添加路由历史记录
  let routerHistory = store.state.com.routerHistory
  let index = routerHistory.findIndex((item) => { return item.path === to.path })
  try {
    // 判断有没有缓存3级菜单
    if (to.path !== '/index' && to.path !== '/login' && to.path !== '/404' && to.meta.visible == '0' && index < 0) {
      store.commit("com/addRouterHistory", { ...to, children: [] })
    }
    // 判断该页面是否在面包屑后8位，不是则调换位置到最后一位
    if (index > -1 && index < routerHistory.length - 8) {
      store.commit("com/changeRouteIndex", index)
    }
    //  判断去4级页面 同时离开的是主页面
    if ((to.meta.visible != '0' && from.meta.visible == '0') || to.meta.visible != '0') {
      if (from.meta.subRoutes?.includes(to.path)) store.commit("com/addHistoryChild", {to}) // 去子页面
      else store.commit("com/addHistoryChild", { allRouter: router.getRoutes(), to }) // 去其他页面的子页面
    }
    //  判断去主页面,删除所有该页下 所有缓存
    if (to.meta.visible == '0') {
      store.commit("com/delHistoryChild", to)
      if(from.path == '/index') store.commit("com/addCache", to.name)
    }
    // 离开4级页面，达到的也是4级页面
    if (from.path != '/' && to.path !== '/login' && from.meta.visible != '0' && to.meta.visible != '0') {
      store.commit("com/changeHistoryChild", { from, to })
    }
    store.commit("com/setScrollTop", {scrollTop,from,to})
  } catch (err) {
    console.log(err, to, from);
  }
})

export default router
