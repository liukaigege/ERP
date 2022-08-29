
<template>
	<ul class="erp-aside-menu">
		<li v-for="menu in menuList" :key="menu.menuId" class="aside-menu-content">
			<div class="sub-menu-icon" :class="{'is-active': setActive(menu)}">
				<i :class="['vango-icon',menu.icon]" class="menu-icon"></i>
			</div>
			<div class="sub-menu-box" v-if=" !isCollapse">
				<div :class="{'is-active': setActive(menu)}">
					<span class="aside-catalogue-title">{{menu.menuName}}</span>
				</div>
				<ul class="aside-menu-item-box">
					<template v-for="subMenu in menu.children">
						<li :key="subMenu.menuId" v-if="subMenu.visible == '0'" class="aside-menu-item" @click="goto(subMenu)">
							<span class="aside-menu-title" :class="{'is-active': subMenu.routeUrl === routerPath || setActive(subMenu)}">{{subMenu.menuName}}</span>
						</li>
					</template>

				</ul>
			</div>
		</li>
	</ul>
</template>

<script>
	import { computed, watch } from 'vue'
	import { useStore } from 'vuex'
	import { useRoute, useRouter } from 'vue-router'

	export default {
		setup() {
			const store = useStore()
			const route = useRoute()
			const router = useRouter()
			const routerPath = computed(() => route.path)
			let isCollapse = computed(() => store.state.menu.isCollapse)
			let headerMenu = computed(() => store.state.menu.headerMenu)
			let menuList = computed(() => store.state.menu.asideMenu)
			watch(() => route, (v) => {
				if (v.path == '/index') {
					store.commit('menu/setAsideMenu', [])
				} else {
					headerMenu.value.some(item => { // 一级
						return item.children?.some(catalogue => { // 二级
							return catalogue.children?.some(menu => {
								if (menu.routeUrl === v.path || menu.children.some(sub => sub.routeUrl === v.path)) {
									store.commit('menu/setAsideMenu', item.children)
									return true
								}
							})
						})
					})
				}
			}, {
				deep: true,
				immediate: true
			})
			function goto(menu) {
				router.push({
					path: menu.routeUrl
				})
			}
			function setActive(menu) {
				let arr = []

				function addRoute(menu) {
					menu.children.forEach(item => {
						if (item.menuType == 'C' || (item.menuType === "F" && item.isRoute == 1)) arr.push(item.routeUrl)
						if (item.children) addRoute(item)
					})
				}
				addRoute(menu)
				return arr.includes(routerPath.value)
			}
			return {
				menuList,
				routerPath,
				isCollapse,
				goto,
				setActive
			}
		}
	}
</script>

<style lang="scss" scoped>
.erp-aside-menu {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.65);
	font-weight: 400;
	width: 100%;

	.aside-menu-content {
		padding: 0 25px !important;
		display: flex;
	}
	.menu-icon {
		margin-right: 12px;
	}
	.sub-menu-box {
		white-space: nowrap;
	}
	.aside-catalogue-title {
		font-weight: 500;
	}
	.aside-menu-content ~ .aside-menu-content {
		margin-top: 15px;
	}
	.aside-menu-item {
		cursor: pointer;
		margin-top: 15px;
        &:hover {
            color: #1890ff;
        }
	}
	.is-active {
		color: #1880e7;
	}
}
</style>
