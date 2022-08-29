/*
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-05 10:33:46
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-19 15:04:10
 */
import { storage } from '@/utils/storage.js'
import { login, loginOut } from '@/api/user.js'
import { ElMessage, ElNotification } from 'element-plus'
import { toTree } from '@/utils/tool.js'
import { routerFilter } from '@/router/filterRouter.js'
import router from '@/router/index.js'
const user = {
    namespaced: true, // 使用时必须加上模块名
    state: {
        token: '' || storage.get('ERP_TOKEN'),
        userInfo: '' || storage.get('ERP_USERINFO'),
        hasRouter: false,
        routerList: null,
        authPath:'' || storage.get('ERP_AUTHPATH')
    },
    mutations: {
        setTokenByMutations(state, token) {
            state.token = token
            storage.set('ERP_TOKEN', token)
        },
        setUserInfoByMutations(state, userInfo) {
            state.userInfo = userInfo
            storage.set('ERP_USERINFO', userInfo)
        },
        loginOutByMutations(state) {
            state.token = ''
            state.userInfo = ''
            state.routerList = null
            state.hasRouter = false
            storage.clear()
            // 退出登录清空信息
        },
        setRouterListByMutations(state, routerList) {
            state.routerList = routerList
        },
        addRouters(state) {
            state.hasRouter = true
            let treeMenu = toTree(JSON.parse(JSON.stringify(state.userInfo.menus)),'menuId')
            routerFilter(treeMenu,'erp')
        },
    },
    actions: {
        setTokenByActions({ commit }, token) {
            commit('setTokenByMutations', token)
        },
        loginByActions({ commit }, data) {
            return new Promise((resolove, reject) => {
                login(data).then(res => {
                    const { sysUser, token } = res.data
                    if (res.code == 200) {
                        commit('setTokenByMutations', token)
                        commit('setUserInfoByMutations', sysUser)
                        resolove(res.data)
                    } else {
                        reject(res.message)
                    }
                }).catch(e => {
                    reject(e)
                })
            })
        }, // 登录
        loginOutByActions({ state, commit }) {
            return new Promise((resolove, reject) => {
                const param = {
                    userId: state.userInfo.userId
                }
                loginOut(param).then(res => {
                    if (res.code == 200 || res.code == 401) {
                        commit('loginOutByMutations')
                        commit('com/SET_ROUTERHISTORY_MUTATIONS', [], { root: true }) // 清空com模块里面的历史路由
                        resolove()
                    }
                })



            })

        },

        loginOutForResponse({ commit }) {
            commit('loginOutByMutations')
            commit('com/SET_ROUTERHISTORY_MUTATIONS', [], { root: true }) // 清空com模块里面的历史路由
            router.replace({ path: '/login' })
        },

        authPath({state}){
            state.authPath = {}
            const{ menus } = storage.get("ERP_USERINFO")
            const authMenus  = menus.filter( item=>item.menuType == 'F' || item.menuType == 'D' || item.menuType == 'C' )
            authMenus.map(item => {
                if (item.requestUrl) {
                    state.authPath[item.requestUrl] = true
                }
            })
            storage.set('ERP_AUTHPATH',state.authPath)
        },

        updateAvatar({state},imgUrl){ // 更新头像
            state.userInfo.avatar = imgUrl
            storage.set('ERP_USERINFO', state.userInfo)
        }



    }
}

export default user
