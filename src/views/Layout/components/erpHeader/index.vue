<template>
	<div class="erp-header-warpper">
		<div class="erp-header-menu-box">
			<ul class="erp-header-menu">
				<li class="first-menu" @mouseenter="handleMouseenter($event,menu)" @mouseleave="handleMouseleave($event,menu)" v-for="menu in menuData" :key='menu.menuId'>
					<menu-list :menu="menu" :activeKey="routerPath"></menu-list>
				</li>
				<li class="first-menu help-menu" @click="goHelp">
					<div>帮助</div>
				</li>
			</ul>
			<div class="user-info">
				<div @click="setAside" class="msg-badge-box">
					<i class="el-icon-bell"></i>
					<el-badge :value="messageNum" v-if="messageNum" :max="9999" class="msg-badge" type="danger"></el-badge>
				</div>
				<user></user>
			</div>
		</div>
		<erp-breadcrumb :activeKey="routerPath"></erp-breadcrumb>
	</div>
</template>
<script>
	import menuList from "./components/MenuList"
	import user from './components/user'
	import { computed, watchEffect, ref } from 'vue'
	import { useStore } from 'vuex'
	import { useRoute, useRouter } from 'vue-router'
	import ErpBreadcrumb from './components/ErpBreadcrumb.vue'
	export default {
		components: { menuList, ErpBreadcrumb, user },
		setup() {
			let timer = null
			let target = null
			function handleMouseleave(e, menu) {
				if (menu.children?.length) {
					let dom = e.target
					target = dom
					timer = setTimeout(() => {
						dom.querySelector('.sub-menu-box').style.visibility = 'hidden'
						timer = null
						target = null
					}, 500)
				}
			}
			function handleMouseenter(e, menu) {
				let dom = e.target
				if (timer) {
					clearTimeout(timer)
					if (dom != target) {
						target.querySelector('.sub-menu-box').style.visibility = 'hidden'
						timer = null
						target = null
					}
				}
				if (menu.children?.length) {
					dom.querySelector('.sub-menu-box').style.visibility = 'visible'
				}
			}
			function goHelp() {
				window.open('https://docs.qq.com/doc/DU3hQQWhYdWpUUVJo')
			}
			function setAside() {
				let children = [
					{
						icon: 'vango-erp-xiaoxizhongxin',
						menuName: '消息中心',
						children: [
							{
								visible: '0',
								menuName: '商品消息',
								menuType: 'C',
								routeUrl: '/goods/news',
								children: []
							}
						]
					}
				]
				store.commit('menu/setAsideMenu', children)
				// 默认跳转到3级菜单第一个
				router.push({
					path: children[0].children[0].routeUrl
				})
			}
			const store = useStore()
			const route = useRoute()
			const router = useRouter()
			const menuData = computed(() => store.state.menu.headerMenu)
			const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
			const messageNum = computed(() => store.state.menu.messageNum)
			const routerPath = ref(0)
			routerPath.value = route.path
			watchEffect(() => {
				routerPath.value = route.path
			})
			return {
				handleMouseleave,
				handleMouseenter,
				menuData,
				routerPath,
				sideBarWidth,
				goHelp,
				setAside,
				messageNum
			}
		},
	}
</script>
<style lang="scss" scoped>
	.erp-header-warpper {
		position: fixed;
		top: 0;
		left: v-bind(sideBarWidth);
		right: 0;
		height: 111px;
		z-index: 999;
		background: #fff;
		transition: left 1s;
	}
	.erp-header-menu-box {
		position: relative;
		.user-info {
			position: absolute;
			top: 0px;
			right: 25px;
			display: flex;
			align-items: center;
		}
		:deep(.el-badge__content) {
			border: none;
		}
		.el-icon-bell {
			font-size: 24px;
			color: #999;
			cursor: pointer;
		}
	}
	.msg-badge-box {
        margin-right: 10px;
		.msg-badge {
			margin: -25px 0 0 -10px;
            
		}
	}
	.erp-header-menu {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 65px;
		line-height: 65px;
		white-space: nowrap;
		background: #ffffff;
		border-bottom: 1px solid #e8ecef;
		.first-menu + .first-menu {
			margin-left: 40px;
		}
		.first-menu {
			position: relative;
		}
		.help-menu {
			cursor: pointer;
			font-size: 16px;
		}
	}
</style>