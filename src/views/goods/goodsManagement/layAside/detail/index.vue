<template>
	<div>
		<ErpNav title="商品详情" routeOpt='/goods/goodsManagement/layAside' />
		<div class="tabBox">
			<el-tabs v-model="tabIndex" class="detail-tabs">
				<el-tab-pane label="商品信息" name="GoodsDescription"></el-tab-pane>
				<el-tab-pane label="采购信息" name="PurchaseInfo"></el-tab-pane>
				<el-tab-pane label="物流信息" name="Logistics"></el-tab-pane>
				<el-tab-pane label="备注信息" name="RemarkMessage"></el-tab-pane>
				<el-tab-pane label="日志" name="logsList"></el-tab-pane>
			</el-tabs>
		</div>
		<div class="empty-box"></div>
		<component :is="tabIndex" :isEdit="false"></component>
	</div>
</template>

<script>
	import ErpNav from '@/components/erpNav/index.vue';
	import Logistics from '@/views/goods/components/Logistics/index.vue' // 物流信息
	import GoodsDescription from '@/views/goods/components/goodsDescription/index.vue'//商品信息
	import LogsList from '@/views/goods/components/logsList/index.vue' // 日志信息
	import RemarkMessage from '@/views/goods/components/remarkMessage/index.vue' //备注信息
	import PurchaseInfo from "@/views/goods/components/PurchaseInfo/index.vue"
	import { reactive, toRefs, computed } from 'vue';
	import { useStore } from 'vuex'
	export default {
		components: {
			ErpNav, Logistics, GoodsDescription, LogsList, RemarkMessage, PurchaseInfo
		},
		setup() {
			let state = reactive({
				tabIndex: 'GoodsDescription',
			})
			let store = useStore()
			let sideBarWidth = computed(() => store.state.menu.sideBarWidth)
			return {
				...toRefs(state),
				sideBarWidth
			}
		},
	}
</script>

<style lang="scss" scoped>
.tabBox {
	position: fixed;
	top: 185px;
	z-index: 15;
	left: v-bind(sideBarWidth);
	right: 0;
}
.empty-box {
	height: 65px;
	width: 100%;
}
.detail-tabs {
	background: #fff;
	::v-deep(.el-tabs__nav-wrap) {
		padding: 0 40px;
	}
	::v-deep(.el-tabs__item) {
		font-size: 16px;
	}
	::v-deep(.el-tabs__header) {
		margin-bottom: 0;
	}
	:deep(.el-tabs__nav-wrap::after) {
		height: 0 !important;
	}
}
.m-110 {
	margin-top: 110px;
}
</style>