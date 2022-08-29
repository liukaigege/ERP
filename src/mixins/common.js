/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-06-13 22:17:30
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-17 18:19:37
 */
// 公用的混入文件
import { debounce, copy, theadSticky } from '@/directives/erpToolsDirective'
import { authPath, getPermissionList } from '@/utils/hooks.js'
import { resetForm } from '@/utils/tool.js'
import { options } from '@/directives/erpOrderDirective'

const commonMixin = {
    data() {
        return {
            poperAptions: {
                boundariesElement: 'body',
                removeOnDestroy: true
            }
        }
    },
    directives: {
        debounce,
        copy,
        options,
        theadSticky
    },
    computed: {
        routeQuery() {
            return this.$route.query
        }, // 接口query参数
        routeParams() {
            return this.$route.params
        }, // 接口params参数
        permissonList() {
            return getPermissionList()
        }
    },
    mounted() {

    },
    methods: {
        authPath,
        showPermission(orderTabType, testOrderType, per) {
            let bole = true
            if (per) { } //权限校验模块
            if (orderTabType !== undefined && testOrderType !== undefined) {
                if (orderTabType !== testOrderType) bole = false
            }

            return bole
        }, // 根据权限和orderTabType 来决定是否显示

        go(path, query) {
            this.$router.push({
                path,
                query: query
            })
        }, // 路由跳转

        goParam(name, params) {
            this.$router.push({
                name,
                params
            })
        },

        back(num) {
            window.history.length > parseInt(num) ?
                this.$router.go(num) :
                this.$router.push('/')
        }, //跳回上级或者多级

        rest(form, obj) {
            return resetForm(form, obj)
        },
        downloadFile(path) {
            if (path) window.location.href = path
        }
    }
}

export default commonMixin
