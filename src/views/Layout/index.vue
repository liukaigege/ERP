<!--
 * @Descripttion:
 * @version:
 * @Author: 韦剑
 * @Date: 2021-08-10 14:26:19
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-11 10:09:38
-->
<template>
	<el-container>
		<el-aside :width="sideBarWidth" class="erp-aside-warpper">
			<div class="erp-aside">
				<div class="logo-warp">
					<Logo :isCollapse="isCollapse" />
				</div>
				<aside-menu></aside-menu>
			</div>
		</el-aside>
		<el-container>
			<el-header height="110px">
				<erp-header></erp-header>
			</el-header>
			<el-main class="erp-main">
				<router-view class="router-view" v-slot="{ Component }">
					<template v-if="Component && refresh">
						<transition name='el-fade-in' mode="out-in">
							<keep-alive :include="cachedViews">
								<component :is="Component" :key="key"  />
							</keep-alive>
						</transition>
					</template>
				</router-view>
        <BackToTop />
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import { computed } from 'vue'
	import ErpHeader from './components/erpHeader'
	import AsideMenu from '@/views/Layout/components/asideMenu.vue'
  import BackToTop from './components/erpBackToTop/index.vue'
	import getMessage from '@/assets/js/ws'
	import Logo from './components/logo.vue'
	import { useStore } from 'vuex'
	import { useRoute } from 'vue-router'
	export default {
		components: { ErpHeader, AsideMenu, Logo, BackToTop },
		setup() {
			const store = useStore()
			const route = useRoute()
			const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
            // 更新数字
            store.dispatch('menu/getMsgNum')
            // 开启mqtt
			getMessage()
			const refresh = computed(() => store.state.com.refresh)
			let isCollapse = computed(() => store.state.menu.isCollapse)
			const key = computed(() => route.name)
			const cachedViews = computed(_ => store.state.com.cachedViews)
			return {
				isCollapse,
				refresh,
				sideBarWidth,
				key,
				cachedViews
			}
		}
	}
</script>

<style lang="scss" scoped>
	.erp-main {
		background-color: rgb(249, 249, 251);
		overflow: visible;
	}
	.erp-main {
		padding: 25px;
	}
	.el-header {
		padding: 0;
	}
	.erp-aside-warpper {
		height: calc(100vh - 15px);
		transition: width 1s;
		&::-webkit-scrollbar {
			display: none;
		}
		.logo-warp {
			margin: 15px;
		}
	}
	.erp-aside {
		position: fixed;
		height: calc(100vh - 15px);
		border-right: 1px #e8ecef solid;
		left: 0;
		top: 0;
		bottom: 0;
		width: v-bind(sideBarWidth);
		z-index: 99;
	}
</style>
