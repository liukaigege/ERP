import { storage } from '@/utils/storage.js'
import { toTree } from '@/utils/tool.js'
import { msgNum } from '@/api/goods/shop'
const menu = {
  namespaced: true, // 使用时必须加上模块名
  state: {
    isCollapse: false,
    sideBarWidth: '220px',
    asideMenu: storage.get('ASIDE_MENU') || [],
    headerMenu: storage.get('HEADER_MENU') || [],
    messageNum: '',
  },
  mutations: {
    setHeaderMenu(state, userInfo) {
      if (userInfo.menus) {
        const menus = userInfo.menus.filter(v => (v.menuType != 'F' && v.menuType != 'D')|| v.isRoute == 1)
        let newMenus = JSON.parse(JSON.stringify(toTree(menus, 'menuId')))
        newMenus = newMenus.filter(v => v.visible == '0')
        state.headerMenu = newMenus
        storage.set('HEADER_MENU', newMenus)
      }
    },
    setAsideMenu(state, subMenu) {
      state.asideMenu = subMenu || []
      storage.set('ASIDE_MENU', state.asideMenu)
    },
    setCollapse(state, flag) {
      if (flag) {
        state.sideBarWidth = '60px'
      } else {
        state.sideBarWidth = '220px'
      }
      state.isCollapse = flag
    },
    setMsgNum(state, num) {
      state.messageNum = num
    }
  },
  actions: {
    // 更新消息数据
    getMsgNum({ commit }) {
      msgNum().then(({ data }) => {
        commit('setMsgNum', data)
      })
    }
  },
  getters: {
    getCollapse: state => state.isCollapse,
    getAsideMenu: state => state.asideMenu,
    getHeaderMenu: state => state.headerMenu
  }
}
export default menu