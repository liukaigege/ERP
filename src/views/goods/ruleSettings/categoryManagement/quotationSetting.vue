<template>
	<div class="headQuotationSetting">
		<!-- 头部 -->
		<div class="box">
			<erpNav title="报价设置" routeOpt="/goods/ruleSettings/categoryManagement/index" />
		</div>
		<!-- //采购报价物流报价 -->
		<div class="headtabs">
			<el-tabs v-model="actived" @tab-click="handleActived">
				<el-tab-pane label="采购报价" name="1">
				</el-tab-pane>
				<el-tab-pane label="物流报价" name="2">
				</el-tab-pane>
			</el-tabs>
		</div>
		<addQuotation v-if="update" v-show="actived == 1" ref='offerRef' :actived="actived"></addQuotation>
		<addQuotation v-if="update" v-show="actived == 2" ref="logisticsRef" :actived="actived"></addQuotation>
		<!-- 底部 -->
		<div class="flex-pagination page-fixed">
			<div></div>
			<div>
				<el-button  @click="back">取消</el-button>
				<el-button type="primary"  @click="submit">确定</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import erpNav from '@/components/erpNav/index.vue'
	import addQuotation from './components/addQuotation.vue'
	import { onMounted, reactive, toRefs, ref } from 'vue'
	import { useRouter } from 'vue-router'
	import {
		categoryConfig, //报价设置（采购报价&物流报价）
	} from '@/api/goods/rules.js'
	import { ElMessage } from 'element-plus'
	export default {
		name: 'quotationSetting',
		components: {
			erpNav,
			addQuotation
		},
		setup() {
			const router = useRouter()
			let offerRef = ref(null)
			let logisticsRef = ref(null)
			const state = reactive({
				actived: '1',
				a: '1',
				tree: null,
				update: false,
				offer: {}, //采购报价数据
				logistic: {}, //物流报价数据
			})
			//退回到首页
			function back() {
				router.push({ name: 'categoryManagement' })
			}
			//切换tabs事件
			function handleActived(tab, event) {
				state.actived = tab.props.name
			}


			//点击确定的事件
			function submit() {
				let offerData = offerRef.value.getData(1)
				if (!offerData) return
				let logisticsData = logisticsRef.value.getData(2)
				if (!logisticsData) return
				let arr = [...offerData, ...logisticsData]
				console.log(arr);
			//调接口
				categoryConfig({ configList: arr }).then(res => {
					ElMessage.success('设置成功')
					setTimeout(function () {
						router.push({ name: 'categoryManagement' })
					}, 1000)
				})
			}
			onMounted(() => {
				state.update = true
			})
			return {
				...toRefs(state),
				back,
				submit,
				handleActived,
				offerRef,
				logisticsRef
			}
		}
	}
</script>

<style lang="scss" scoped>
.headQuotationSetting {
     .box{
       :deep(.el-tabs__nav-wrap::after) {
        display: none;
    } 
    }
	padding-top:60px;
	:deep([aria-disabled='true'] > .el-tree-node__content) {
		// pointer-events: none;
		cursor: not-allowed;
		background: #fff !important;
	}

	.headtabs {
		position: fixed;
		right: 0;
		top: 185px;
		height: 40px;
		text-align: left;
		background-color: #fff;
		width: calc(100% - var(--sideBarWidth));
		line-height: 40px;
		padding: 0 24px;
		z-index: 5;

		:deep(.el-tabs__item) {
			font-size: 16px;
		}
         :deep(.el-tabs__nav-wrap::after) {
        display: none;
    } 
	}

	.content {
		.catagroyClass {
			height: 700px;
			overflow: auto;
			background: #fff;
			border: 1px solid #eee;
			padding-bottom: 24px;
			margin-bottom: 50px;
		}

		.rightClass {
			height: 700px;
			background: #fff;
			border: 1px solid #eee;
			padding: 24px 0px 34px 24px;
			margin-bottom: 50px;

			:deep(.el-tabs__item) {
				font-size: 16px;
			}
		}

		p {
			padding: 16px 24px;
			font-size: 16px;
			font-weight: 500;
		}

		.treeClass {
			padding: 24px 24px 34px 24px;
		}

		.treeRightClass {
			padding: 0px 0px 34px 0px;
		}

		:deep(.el-input__inner) {
			height: 32px;
		}

		.buttonClass {
			width: 70px;
			height: 28px;
			background: #1890ff;
			color: #fff;
			padding: 6px 14px;
			border-radius: 3px;
			cursor: pointer;
		}
	}
}
</style>
