/*
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-07-23 15:16:26
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-07-28 11:55:11
 */
// 路由文件

const Layout = () =>
    import('@/views/Layout/index.vue')
const NotFound = () =>
    import('@/views/Layout/exception/404.vue')
const Login = () =>
    import('@/views/Layout/login.vue')

const routes = [
    {
        path: '/',
        name: 'erp',
        component: Layout,
        redirect: '/index',
        children: [
            {
                path: '/goods/news',
                name: 'goodsNews',
                component: () => import('@/views/message/goodsNews/index.vue'),
                meta: {
                    title: '商品消息',
                    visible: 0,
                    keepAlive: false,
                    subRoutes: []
                }
            },
        ]
    },
    
    {
        path: '/404',
        name: '404',
        component: NotFound,
        meta: {}
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {}
    }
]

export default routes

/*



*/