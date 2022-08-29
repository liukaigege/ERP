<template>
	<div class="menu-title" v-if="menu.children?.length >0" @click="setAside(menu)" :class="{'is-active': active}">{{menu.menuName}}</div>
	<div class="menu-title menu-item" v-else :class="{'is-active': menu.routeUrl === activeKey}" @click="go(menu)">{{menu.menuName}}</div>
	<sub-menu :subMenu="menu.children" :activeKey="activeKey"></sub-menu>
</template>
<script>
	import subMenu from './SubMenu'
	import { ref, watch } from 'vue'
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	export default {
		components: { subMenu },
		props: ['menu', 'activeKey'],
		setup(props) {
			const router = useRouter()
			const store = useStore()
			function go(menu) {
				store.commit('menu/setAsideMenu', [])
				router.push({
					path: menu.routeUrl
				})
			}
			function setAside(menu) {
				store.commit('menu/setAsideMenu', menu.children)
                // 默认跳转到3级菜单第一个
                router.push({
					path: menu.children[0].children[0].routeUrl
				})
			}
			let active = ref(false)
			watch(() => props.activeKey, (v) => {
				let arr = []
				function addRoute(menu) {
					menu.children.forEach(item => {
						if (item.menuType == 'C' || (item.menuType === "F" && item.isRoute == 1)) arr.push(item.routeUrl)
						if (item.children) addRoute(item)
					})
				}
				addRoute(props.menu)
				active.value = arr.includes(v)
			},
				{
					immediate: true
				}
			)

			return {
				go,
				active,
				setAside
			}
		}
	}
</script>
<style lang="scss" scoped>
.is-active {
	color: #1890ff;
}
.menu-item {
	cursor: pointer;
}
.menu-title {
	cursor: pointer;
	font-size: 16px;
}
</style>