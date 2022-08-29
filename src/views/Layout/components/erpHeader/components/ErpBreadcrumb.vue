<template>
	<div class="erp-header-breadcrumb">
		<div class="left-header">
			<div class="menu-switch"><i @click="changeAsideMenu" :class="isCollapse ? 'el-icon-s-unfold hideIcon' : 'el-icon-s-fold hideIcon'"></i></div>
			<div class="tag-content">
				<div class="home-tag" :class="{'is-active': activeKey=='/index'}" @click="goTo({path : '/index',children: []})">首 页</div>
				<el-tag v-for="tag in tabList" class="tag-item" :key="tag.path" closable hit  :type="tag.path === nowRouterPath || tag.meta.subRoutes.indexOf(nowRouterPath) !== -1 ? '' : 'info'" @close="() => closeRouter(tag)" @click="goTo(tag)">
					{{ tag.meta.title }}
				</el-tag>
			</div>
		</div>
		<div class="right-header">
			<el-button type="default" size="small" @click="refreshRouter"><i class="el-icon-refresh mr-10"></i>刷新</el-button>
		</div>
	</div>
</template>
<script>
	import { nextTick, computed } from 'vue'
	import { useStore } from 'vuex'
	import { useRouter, useRoute } from 'vue-router'
	export default {
		props: ['activeKey'],
		setup() {
			const store = useStore()
			const router = useRouter()
			const route = useRoute()
			const nowRouterPath = computed(() => route.path)
			let isCollapse = computed(() => store.state.menu.isCollapse)
			let routerHistory = store.getters.routerHistory
			let tabList = computed(() => {
				return routerHistory.slice(-8)
			})
			function changeAsideMenu() {
				store.commit('menu/setCollapse', !isCollapse.value)
			}

			function goTo(item) {
                let option = {
					path: item.path
				}
                if(item.children.length > 0) {
                    option = {
                        ...item.children[item.children.length -1]
                    }
                }

				router.push(option)
			}
			function closeRouter(item) {
				if(item.name === 'outOfStock') {
					store.dispatch('purchaseSearch/setNormalFormActions', null)
					store.dispatch('purchaseSearch/setNormalShelveFormActions', null)
					store.dispatch('purchaseSearch/setCustomFormActions', null)
					store.dispatch('purchaseSearch/setCustomShelveFormActions', null)
					store.dispatch('purchaseSearch/setCustomRemarkFormActions', null)
					store.dispatch('purchaseSearch/setPageStatusActions', '0')
					store.dispatch('purchaseSearch/setTabStatusActions', 1)
				}
				store.commit('com/delRouterHistory', item)
				const subRoutes = item.meta.subRoutes
				if (item.path === nowRouterPath.value || subRoutes.indexOf(nowRouterPath.value) !== -1) {
					if (routerHistory.length > 0) {
						router.replace(routerHistory[routerHistory.length - 1].path)
					} else {
						router.replace('/index')
					}
				}
			}
			function refreshRouter() {
				const name = route.name
				const index = store.getters.cachedViews.findIndex(view => view === name)
				store.commit('com/deleteCachedView', { index, name })
				store.dispatch('com/setRefreshByActions', false)
				nextTick(() => {
					store.dispatch('com/setRefreshByActions', true)
					if(name === 'OrderManagement'){
						  store.dispatch('orderManage/setOrderStatusByActions', '1')
					}  // 订单当前页才清除订单tab
					store.commit('com/addCachedView', { index, name })
				})
			}
			return {
				isCollapse,
				tabList,
				changeAsideMenu,
				goTo,
				closeRouter,
				refreshRouter,
				nowRouterPath
			}
		}
	}
</script>
<style lang="scss" scoped>
.erp-header-breadcrumb {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 45px;
	width: 100%;
	padding: 0 25px;
	.is-active {
		color: #1890ff;
	}
	.left-header {
		display: flex;
		flex-grow: 1;
	}
	.tag-content {
		flex-grow: 1;
		display: flex;
		.tag-item {
			cursor: pointer;
		}
		.tag-item + .tag-item {
			margin-left: 15px;
		}
	}
	.hideIcon {
		font: 14px;
		color: rgba(0, 0, 0, 0.45);
	}
	.home-tag,
	.menu-switch {
		cursor: pointer;
		margin-right: 15px;
	}
	.menu-switch {
		color: rgba(0, 0, 0, 0.45);
	}
}
</style>
