<template>
	<div class="headExport">
		<el-dialog title="导出" width="800px" v-model="centerDialogVisible" :before-close="close">
			<el-tabs v-model="query.type" @tab-click="handleClick">
				<el-tab-pane label="当前数据导出" name="0">
					<el-radio v-model="query.subType" label="0">当前查询数据</el-radio>
					<el-radio v-model="query.subType" label="1">当前勾选数据</el-radio>
				</el-tab-pane>
				<el-tab-pane label="按天导出" name="1">
					<span class="exportTitle">选择日期:</span>
					<el-date-picker v-model="time" type="date" style="margin-left:10px" value-format="YYYY-MM-DD " placeholder="选择日期" @change="changes">
					</el-date-picker>
				</el-tab-pane>
			</el-tabs>
			<!-- 导出 -->
			<div style="margin-top: 8px">
				<el-button type="primary" size="small" @click="exportList">导出</el-button>
			</div>
			<div class="exportLine"></div>
			<!-- 下方的选择框 -->
			<div style="margin-top: 16px;position:relative">
				<el-row>
					<el-col :span="3" class="exportTable">
						<div class="exportChidren">
							<div>导出信息</div>
							<div>
								<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
							</div>
						</div>
					</el-col>
					<!-- 子级 -->
					<el-col :span="21" class="exportTables">
						<el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange" class="exportChile">
							<el-checkbox v-for="item in cities" :label="item.value" :key="item.name">{{
                item.name
              }}</el-checkbox>
						</el-checkbox-group>
					</el-col>
				</el-row>
			</div>
		</el-dialog>
		<!-- 导出弹框 -->
		<el-dialog title="导出订单" v-model="exportOrder" width="640px" :before-close="closeProgress">
			<el-progress :stroke-width="20" :percentage="percentage" />
			<p class="progressText">订单导出数据整理中，请耐心等待，如长时间进度无反应，请与研发部联系。</p>
		</el-dialog>
	</div>
</template>
<script>
	import { ElMessage } from 'element-plus'
	import moment from 'moment'
	import { reactive, toRefs } from 'vue'
	import {
		exportFields,
		progress,
		exportDelivery,//U42.导出字段
	} from '@/api/order/orderProcessing.js'
	export default {
		props: {
			form: {
				type: Object,
				default: Object
			},
			selectOptions: {
				type: Array,
				default: []
			}
		},
		emits: ['close', 'inits'],
		setup(props, { attrs, emit }) {
			const row = props.form
			console.log(row, 'row');
			const selectOptions = props.selectOptions
			const state = reactive({
				uuid: '',
				exportOrder: false,//控制导出订单的弹框显示
				percentage: 0,//导出订单的进度条
				time: [],
				query: {
					type: '0',
					subType: '0',
					startDate: '',
					endDate: '',
				},
				centerDialogVisible: true, //控制弹框显示隐藏
				isIndeterminate: false,
				checkAll: false,
				checkedCities: [],
				cities: []
			})

			//U42.导出字段渲染
			exportFields().then(res => {
				console.log(res, '导出字段')
				if (res.code == 200) {
					state.cities = res.data.fields
					console.log(state.cities);
				}
			})
			//弹框关闭
			const close = () => {
				emit('close')
			}
			//上方的tab切换
			const handleClick = () => {
				console.log(state.query.type)
			}
			//表格的选择(全部选择)
			const handleCheckAllChange = val => {
				console.log(val, 'val');
				state.checkedCities = val ? state.cities.map(item => {
					return item.value
				}) : []
				console.log(state.checkedCities, 'state.checkedCities');
				state.isIndeterminate = false
			}
			//表格的其余子选择
			const handleCheckedCitiesChange = value => {
				state.checkedCities = value
				console.log(state.checkedCities);
				let checkedCount = value.length
				state.checkAll = checkedCount === state.cities.length
				state.isIndeterminate =
					checkedCount > 0 && checkedCount < state.cities.length
			}
			//打开导出弹框事件
			const exportList = () => {
				console.log(state.checkedCities.length, 555555);
				if (!state.checkedCities.length) {
					state.exportOrder = false
					ElMessage.error('请选择导出字段')
					return
				} else if (!state.query.startDate && state.query.type == '1') {
					state.exportOrder = false
					ElMessage.error('请选择日期')
				} else {
					state.uuid = uuid()
					let params = {}
					if (state.query.type == '0') {
						params.type = state.query.type
						params.subType = state.query.subType
						params.startDate = row.startDate,
							params.endDate = row.endDate,
							params.ids = selectOptions,
							params.timeType = row.timeType,
							params.country = row.country == '全部' ? '' : row.country
						params.logistics = row.logistics.length ? row.logistics[0] : '',
							params.lgtcLine = row.logistics.length ? row.logistics[1] : '',
							params.deliveryBy = row.deliveryBy,
							params.searchContentTypeId = row.searchContentTypeId,
							params.searchContent = row.searchContent
						params.fields = state.checkedCities
						params.uuid = state.uuid
					} else {
						params.type = state.query.type
						params.startDate = state.query.startDate,
							params.endDate = state.query.endDate,
							params.fields = state.checkedCities
						params.uuid = state.uuid
					}

					exportDelivery(params).then(res => {
						if (res.data.indexOf('http') != -1) {
							state.percentage = 100
						}
						state.exportOrder = true
						state.centerDialogVisible = false
						evProgress({ uuid: state.uuid }, true)
						window.open(res.data, '_self')
						emit('inits')
					})


				}

			}

			//关闭导出弹框
			const closeProgress = () => {
				state.exportOrder = false
				emit('close')

			}
			//进度条的函数判断
			const evProgress = (e, flag) => {
				progress(e).then(res => {
					// if( res.data != 'dubbo has not return value!'){
					console.log(state.percentage);
					if (res.data.percent == 100) {
						setTimeout(() => {
							closeProgress()
							ElMessage({
								type: 'success',
								message: '下载完成'
							})
						}, 600);

						return
					}
					state.percentage = res.data.percent
					if (flag) {
						return state.exportOrder = false
					}
					evProgress({ uuid: state.uuid })
					// }

				})
			}
			//uuid
			const uuid = () => {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});
			}
			const changes = e => {
				console.log(e);
				state.query.startDate = e ? e + ' 00:00:00' : ''
				state.query.endDate = e ? e + ' 23:59:59' : ''
				console.log(state.query.startDate, state.query.endDate);
			}
			return {
				...toRefs(state),
				close,
				handleClick,
				handleCheckAllChange,
				handleCheckedCitiesChange,
				closeProgress,
				exportList,
				row,
				selectOptions,
				changes
			}
		}
	}
</script>
<style scoped lang="scss">
.headExport {
	:deep(.el-tabs__item) {
		font-size: 16px;
	}
	.exportLine {
		margin-top: 16px;
		border-bottom: 1px dashed #e9e9e9;
	}
	:deep(.el-dialog__body) {
		padding: 0 20px 30px;
	}
	.exportTable {
		position: relative;
		height: 130px;
		background-color: #f5f7fa;
		border: 1px solid #e8e8e8;
		.exportChidren {
			line-height: 33px;
			text-align: center;
			padding: 10px 0;
			width: 100%;
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			font-weight: bold;
		}
	}
	.exportTables {
		height: 130px;
		border: 1px solid #e8e8e8;
		border-left: 0;
		padding: 22px;
		.exportChile {
			position: absolute;
			top: 12px;
		}
		:deep(.el-checkbox) {
			width: 20%;
			margin-right: 0;
			padding: 0 10px;
		}
		:deep(.el-checkbox__label) {
			font-size: 14px;
			padding-left: 5px;
		}
		:deep(.el-checkbox-group) {
			line-height: 28px;
		}
	}
	.progressText {
		margin-top: 20px;
		text-align: center;
		font-size: 12px;
	}
}
</style>
