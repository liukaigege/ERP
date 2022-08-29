/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-06-16 09:23:52
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-20 16:06:53
 */
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import router from './router/index'
import store from '@/store/index.js'
import directives from '@/directives'
import mixins from '@/mixins'
// 引入矢量库
import '@/assets/fonts/iconfont.css'
import '@/assets/fonts/element-icons.css'
import useTable from '@/assets/js/vxe-table'
import 'vxe-table/lib/style.css'
import globalConfig from '@/assets/js/globalConfig'

// 注册icon全局组件
import elIcon from '@/components/el-icon/index'
//由于多节点，无法使用自定义指令 故覆盖el-dropdown-item
import elDropdownItem from '@/components/el-dropdown-item/index.vue'
const app = createApp(App)
app.component('el-dropdown-item', elDropdownItem)
useTable(app)
app.use(ElementPlus, { locale })
app.use(globalConfig)
app.use(elIcon)
// 设置mixins
app.use(mixins)
// 设置全局指令
app.use(directives)

// 引入虚拟滚动
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css' // 引入它的 css
import VueVirtualScroller from 'vue-virtual-scroller' // 引入它
app.use(VueVirtualScroller) // use 它
app.use(router)
app.use(store)
app.mount('#app')
