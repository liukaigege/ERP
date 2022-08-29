<template>
	<div class="performance">
		<div class="erp-nav">
			<div class="head">
				<div class="tabs-box">
					<el-tabs v-model="activeName" @tab-click="handleClick">
						<el-tab-pane label="发货" name="1"></el-tab-pane>
						<el-tab-pane label="妥投" name="2"></el-tab-pane>
						<el-tab-pane label="履约" name="3"></el-tab-pane>
					</el-tabs>
				</div>
			</div>
		</div>
		<div class="content">
			<el-card shadow="never">
				<template #header>
					<span class="fontClass">数据看板</span>
				</template>
				<div class="search">
					<el-form :model="form[activeName]" :inline="true"  ref="formRef">

						<el-form-item  label="品类:" prop="categoryIds">
							<el-cascader  ref="searchCascader" clearable v-model="form[activeName].categoryIds" :options="categoryList" collapse-tags :props="cascaderProps" @change="categoryChange($event,1)" />
						</el-form-item>
						<el-form-item label="时间:" prop="year">
							<el-select v-model="form[activeName].year" filterable style="width:90px" placeholder="年份">
								<el-option v-for="item in dateSelect" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item  label="季度:" prop="quarter">
							<el-select v-model="form[activeName].quarter" placeholder="季度" filterable style="width:80px">
								<el-option v-for="item in quarterSelect" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>

						</el-form-item>
						<el-form-item label="" >
							<el-button type="primary"  @click="search">查询</el-button>
							<el-button  @click="reset">重置</el-button>
						</el-form-item>

					</el-form>
				</div>
				<!-- 卡片 -->
				<!-- 卡片 -->
				<gmvCard :active="activeName" :data="cardData[activeName]" />
				<!-- 卡片 -->
				<!-- 卡片 -->
			</el-card>
			<el-card shadow="never" class="card">
				<template #header>
					<span class="fontClass">明细下载</span>
				</template>
				<el-form :model="downData" :inline="true" >
					<el-form-item  label="品类:" prop="categoryId">
						<el-cascader  ref="cascaderRef" :options="categoryList" collapse-tags :props="cascaderProps" clearable @change="categoryChange($event,2)" />
					</el-form-item>
					<el-form-item :label="activeName==2?'发货日期:':'付款日期:'">
						<el-date-picker v-model="downDate" type="daterange" value-format="YYYY-MM-DD" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" unlink-panels @change="dateChange">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="exportDetail">明细下载</el-button>
					</el-form-item>
				</el-form>
			</el-card>
		</div>
		<progressDialog :progress="percent" :progressDesc="percentDesc" v-if="progressShow" @closeEvent="closeEvent" />
	</div>
</template>

<script>
	import { reactive, toRefs, computed, onMounted, ref } from 'vue'
	import { useStore } from 'vuex'
	import { rulecClassify } from "@/api/goods/rules.js";
	import { getDepartmentList } from '@/api/user.js'
	import elSelectTree from "@/components/elSelectTree/index.vue";
	import gmvCard from "./components/gmvCard.vue";
	import progressDialog from '../components/progress.vue'
	import {
		queryDeliveryRate,
		queryCorrectDistributeRate,
		queryHonourAnAgreementRate,
		exportDeliveryDetail,
		exportCorrectDistributeDetail,
		exportHonourAnAgreementDetail,
		progress
	} from './api/api.js'
	import { getuuid } from '@/utils/tool.js'
	import { ElMessage } from 'element-plus';
	export default {
		components: { elSelectTree, gmvCard, progressDialog },
		setup() {
			const state = reactive({
				activeName: '1',
				categoryList: [],
				deptList: [],
				form: {
					1: {
						year: new Date().getFullYear(),
						quarter: Math.ceil((new Date().getMonth()+1) / 3),
						categoryIds: []
					},
					2: {
						year: new Date().getFullYear(),
						quarter: Math.ceil((new Date().getMonth()+1) / 3),
						categoryIds: []
					},
					3: {
						year: new Date().getFullYear(),
						quarter: Math.ceil((new Date().getMonth()+1) / 3),
						categoryIds: []
					},
				},
				downData: {
					categoryIds: [],
					startDate: '',
					endDate: '',
					uuid: ''
				},
				downDate: "",
				cardData: { 1: {}, 2: {}, 3: {} },
				percent: 0, // 进度条
				progressShow: false,
				time:null,
				percentDesc:undefined
			})
			let formRef = ref(null)
			let searchCascader = ref(null)
			let cascaderRef = ref(null)
			let store = useStore()
			let sideBarWidth = computed(() => store.state.menu.sideBarWidth)

			let dateSelect = []
			let quarterSelect = [
				{ label: 'Q1', value: 1 },
				{ label: 'Q2', value: 2 },
				{ label: 'Q3', value: 3 },
				{ label: 'Q4', value: 4 }
			]
			let treeProps = {
				value: 'deptId', // ID字段名
				label: 'deptName', // 显示名称
				children: 'children',
			}
			let cascaderProps = { emitPath: true, multiple: true, label: 'name', value: 'id', children: 'child' }

			function creatDateSelect() {
				let creatTime = 2021
				let time = new Date().getFullYear()
				for (let date = creatTime; date <= time; date++) {
					dateSelect.push({
						label: '' + date,
						value: date
					})
				}
			}
			creatDateSelect()

			onMounted(() => {
				rulecClassify().then(res => {
					state.categoryList = res.data
				})
				getDepartmentList().then(res => {
					state.deptList = res.data
				})
				search()
			})

			function dateChange(e) {
				state.downData.startDate = ''
				state.downData.endDate = ''
				if (!e) return
				state.downData.startDate = e[0] + ' 00:00:00'
				state.downData.endDate = e[1]  + ' 23:59:59'
			}

			function categoryChange(e, num) {
				let arr = []
				if (num == 1) {
					arr = searchCascader.value.getCheckedNodes().map(item => item.data.id)
				} else {
					arr = cascaderRef.value.getCheckedNodes().map(item => item.data.id)
				}
				num == 1 ? state.form[state.activeName].categoryIds = arr : state.downData.categoryIds = arr
			}

			function check(e) {
				console.log(e);
			}

			function handleClick() {
				if (!state.cardData[state.activeName].list) search()
			}

			function reset(i) {
				formRef.value.resetFields()
				searchCascader.value.handleClear()
				if (i) search()
			}

			function search() {
				switch (state.activeName) {
					case '1':
						getCardData(queryDeliveryRate)
						break;
					case '2':
						getCardData(queryCorrectDistributeRate)
						break;
					case '3':
						getCardData(queryHonourAnAgreementRate)
						break;
				}
			}

			function getCardData(api) {
				api(state.form[state.activeName]).then(res => {
					let arr = []
					for (let index = state.form[state.activeName].quarter * 3 - 2; index <= state.form[state.activeName].quarter * 3; index++) { // 生成顺序时间数组
						arr.push(res.data.list.find(item => item.month == index) || {
							deliveryRate: 0,
							correctDistributeRate: 0,
							honourAnAgreementRate: 0,
							month: index,
						})
					}
					res.data.list = arr
					state.cardData[state.activeName] = res.data
				}).catch(err => {
					let arr = []
					for (let index = state.form[state.activeName].quarter * 3 - 2; index <= state.form[state.activeName].quarter * 3; index++) { // 生成顺序时间数组
						arr.push({
							deliveryRate: '--',
							correctDistributeRate: '--',
							honourAnAgreementRate: '--',
							month: index,
						})
					}
					res.data.list = arr
					state.cardData[state.activeName] = res.data
				})
			}

			function exportDetail() {
				switch (state.activeName) {
					case '1':
						getDetail(exportDeliveryDetail)
						break;
					case '2':
						getDetail(exportCorrectDistributeDetail)
						break;
					case '3':
						getDetail(exportHonourAnAgreementDetail)
						break;
				}
			}

			function getDetail(api) {
				state.downData.uuid = getuuid()
				if (!state.downData.startDate) return ElMessage.error('请选择日期')
				api(state.downData).then(res => {
					state.progressShow = true
					state.time = setInterval(() => {
						progress({ uuid: state.downData.uuid }).then(res => {
							state.percent = res.data.percent
							state.percentDesc = res.data.description
							if (res.data.percent == 100 || res.data.url) {
								setTimeout(() => {
									clearInterval(state.time)
									state.percent = 0
									state.percentDesc = undefined
									window.open(res.data.url, '_self')
								}, 700)
							}else if(!res.data.percent){
								ElMessage.error('进度获取失败')
									closeEvent()
							}
						}).catch(err=>{
							closeEvent()
						})
					}, 800);
				})

			}

			function closeEvent(){
				clearInterval(state.time)
				state.percent = 0
				state.percentDesc = undefined
				state.progressShow = false
			}
			return {
				...toRefs(state),
				sideBarWidth,
				handleClick,
				quarterSelect,
				dateSelect,
				treeProps,
				dateChange,
				categoryChange,
				check,
				formRef,
				reset,
				searchCascader,
				cascaderProps,
				search,
				exportDetail,
				cascaderRef,
				closeEvent
			}
		}
	}
</script>

<style lang="scss" scoped>
.erp-empty-box {
	margin-top: -23px;
	height: 75px;
}

.erp-nav {
	position: fixed;
	left: v-bind(sideBarWidth);
	right: 0;
	top: 111px;
	transition: left 1s;
	border-top: 1px solid #e8e8e8;
	z-index: 15;

	.head {
		background: #fff;
	}

	.nav-title {
		color: rgba(0, 0, 0, 0.85);
		font-size: 20px;
		font-weight: 500;
		text-align: center;
		flex-grow: 1;
	}
}

::v-deep(.el-tabs__item) {
	padding: 0 24px !important;
	height: 52px;
	line-height: 52px;
}

::v-deep(.el-card) {
	border: none;
}

.card {
	margin-top: 30px;
	:deep(.el-card__body) {
		padding-bottom: 0;
	}
}

::v-deep(.el-form-item) {
	margin-right: 16px;
}

.tabs-box {
	::v-deep(.el-tabs__header) {
		margin: 0;
	}
}

.performance {
	padding-top: 56px;

	.fontClass {
		font-size: 16px;
	}
}
</style>
