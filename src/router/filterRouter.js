/*
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-19 15:38:42
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-18 11:24:24
 */

import router from './index.js'

function getComponents() {
    const components =
        import.meta.glob('../views/**/*.vue')
    return components
}
const modules = getComponents()

function routerFilter(routers, parentName) {
    routers.forEach(v => {
	      const { menuType, menuName, icon, visible, componentUrl, isKeepAlive, componentName, routeUrl, redirectUrl, children ,isRoute,parentId} = v
        if (menuType === "C" || (menuType === "F" && isRoute == 1)) {
            let comName = `../${componentUrl}.vue`
            let route = {
                path: routeUrl,
                name: componentName,
                component: modules[comName],
                redirect: redirectUrl,
                meta: {
									  parentId,
                    title: menuName,
                    icon: icon,
                    visible: (visible==0 && isRoute != 1)? 0 :1,
                    keepAlive: isKeepAlive == '1',
                    redirectUrl,
                    subRoutes: children?.length ? children.filter(item => item.menuType === "C" || (item.menuType === "F" && item.isRoute == 1)).map(item => item.routeUrl) : [],
                    subNameRoutes: children?.length ? children.filter(item => item.menuType === "C" || (item.menuType === "F" && item.isRoute == 1)).map(item => item.componentName) : []
                }
            }
            router.addRoute(parentName, route)
        }
        if (v.children && v.children.length > 0) {
            routerFilter(v.children, parentName)
        }
    })


} // 动态渲染路由

export {
    routerFilter
}
