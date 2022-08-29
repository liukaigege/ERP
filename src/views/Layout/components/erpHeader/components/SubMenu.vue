<template>
	<ul class="sub-menu-box">
		<li class="menu-list" v-for="catalogue in subMenu" :key='catalogue.menuId'>
			<div class="sub-menu-title">{{catalogue.menuName}}</div>
			<ul class="menu-item">
				<template v-for="menu in catalogue.children">
					<li v-if="menu.visible == '0'" :key='menu.menuId' @click="go($event,menu,subMenu)" :class="{'is-active': menu.routeUrl === activeKey || setActive(menu)}">{{menu.menuName}}</li>
				</template>
			</ul>
		</li>
	</ul>
</template>
<script>
	import { useStore } from 'vuex'
	import { useRouter } from 'vue-router'
	export default {
		props: ['subMenu', 'activeKey'],
		setup(props, context) {
			const router = useRouter()
			let store = useStore()
			function go(e, menu, subMenu) {
				let doms = document.querySelectorAll('.sub-menu-box')
				let dom = [...doms].find(dom => dom.contains(e.target))
				dom.style.visibility = 'hidden'
				store.commit('menu/setAsideMenu', subMenu)
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
				return arr.includes(props.activeKey)
			}
			return {
				go,
				setActive
			}
		}
	}
</script>
<style lang="scss" scoped>
.sub-menu-box {
	visibility: hidden;
	position: absolute;
	z-index: 1000;
	bottom: 0;
	left: 0;
	padding: 15px;
	min-width: 200px;
	background-color: #ffffff;
	line-height: 1.5;
	font-size: 14px;
	transform: translateY(100%);
	box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
	&::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		border-left: 9px solid transparent;
		border-right: 9px solid transparent;
		top: -8px;
		left: 10px;
		border-bottom: 9px solid #e8ecef;
	}
	&::after {
		content: '';
		position: absolute;
		top: -7px;
		left: 11px;
		width: 0;
		height: 0;
		border-right: 9px solid transparent;
		border-left: 9px solid transparent;
		border-bottom: 9px solid #fff;
	}
	.is-active {
		color: #1890ff;
	}
	.menu-list {
		display: flex;
	}
	.menu-list + .menu-list {
		margin-top: 15px;
	}
	.sub-menu-title {
		font-weight: bold;
		color: rgba(0, 0, 0, 0.85);
	}
	.menu-item {
		margin-left: 15px;
		cursor: pointer;
		display: grid;
		grid-template-columns: auto auto auto;
		grid-row-gap: 15px;
		grid-column-gap: 15px;
		color: rgba(0, 0, 0, 0.65);
		li:hover {
			color: #1890ff;
		}
	}
}
</style>