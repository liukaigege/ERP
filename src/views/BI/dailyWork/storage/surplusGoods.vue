<template>
	<div class="headSurplusGoods">
		<!-- 头部的返回 -->
		<div class="box">
			<erpNav title="T+0打单率明细表" :routeOpt="{name:'dailyWorkStorage'}" />
		</div>
		<div class="content">
			<el-form :model="form" :inline="true">
				<el-form-item label="仓库名称:">
					<el-select v-model="store" style="width:278px" >
						<el-option value="1" label="万众智谷仓库"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="日期:">
					<el-date-picker v-model="createTime" type="daterange" class="date-item" unlink-panels style="width: 224px;"  range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" style="margin-left: 10px"  @click="search">查询</el-button>
					<el-button  @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 导出按钮 -->
		<div class="buttonClass">
			<el-button type="primary"  @click="downOrder">导出</el-button>
		</div>
		<!-- 表格部分 -->
		<div class="pageClass">
			<el-table :data="tableData">
				<el-table-column label="日期" prop="date" align="center"></el-table-column>
                <el-table-column  prop="shouldPrintCount"  align="center">
                   <template #header>
                   <span>应打单量</span>
                   <el-tooltip effect="light" content="应打单量:前一天20:00至当天20:00移入【待打单】有货的订单+【已发货】中移入待打单的订单-移入搁置中的订单;" placement="top">
                       <i class="el-icon-question">
                       </i>
                    </el-tooltip>
                </template> 
                </el-table-column>
                <el-table-column  prop="validPrintCount" align="center">
                   <template #header>
                   <span>今日已完成</span>
                   <el-tooltip effect="light" content="数据范围:只统计当日应打单量中已完成的包裹数量" placement="top">
                       <i class="el-icon-question">
                       </i>
                    </el-tooltip>
                </template> 
                </el-table-column>
                <el-table-column  prop="surplusPrintCount"  align="center">
                   <template #header>
                   <span>今日未完成</span>
                   <el-tooltip effect="light" content="数据范围:只统计当日应打单量中未完成的包裹数量" placement="top">
                       <i class="el-icon-question">
                       </i>
                    </el-tooltip>
                </template> 
                </el-table-column>
                <el-table-column  prop="actualPrintCount"  align="center">
                   <template #header>
                   <span>实际打单量</span>
                   <el-tooltip effect="light" content="数据范围:用户实际发货量，包含用户完成的今日应发货包裹数量+完成之前剩余未完成的包裹数量" placement="top">
                       <i class="el-icon-question">
                       </i>
                    </el-tooltip>
                </template> 
                </el-table-column>
				<el-table-column  prop="rate"  align="center">
                   <template #header>
                   <span>T+0打单率</span>
                   <el-tooltip effect="light" content=" 公式=今日已完成/应打单量" placement="top">
                       <i class="el-icon-question">
                       </i>
                    </el-tooltip>
                </template> 
                </el-table-column>
			</el-table>
		</div>
		<!-- 分页器 -->
		<div class="flex-pagination page-fixed">
			<div>
			</div>
			<div>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
				</el-pagination>
			</div>
		</div>
		<!-- 导出订单弹框 -->
		<progressDialog v-if="showProgress" :progress="percent" @closeEvent="showProgress=false" />
	</div>
</template>

<script>
	import moment from 'moment';
    import { getuuid } from '@/utils/tool.js'
	import { erpElTable } from 'hooks'
	import { surplusDelivery ,exportSurplusDelivery ,progress} from './api/api.js'
	import progressDialog from '../components/progress.vue'
	import { reactive, toRefs } from 'vue'
	import erpNav from '@/components/erpNav/index.vue'
	import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';
	export default {
		name: 'surplusGoods',
		components: {
			erpNav,
			progressDialog
		},
		setup() {
			const router = useRouter()
			const state = reactive({
				store: '1',
				createTime: [moment().subtract(29, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
				form: {
					date: {
						start: moment().subtract(29, 'day').format('YYYY-MM-DD'),
						end: moment().format('YYYY-MM-DD'),
					},
                  uuid:''
				},
				//进度条
				showProgress: false,
				percent: 0 //进度条进度
			})
			//日期选择
			function changeDate(date) {
				if (!date) return
				state.form.date.start = date[0] 
				state.form.date.end = date[1]
			}
             //重置
            function reset () {
                state.createTime=[moment().subtract(29, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
                state.form.date.start= moment().subtract(29, 'day').format('YYYY-MM-DD')
                state.form.date.end=moment().format('YYYY-MM-DD')
                erpTableOpts.search() 
            }
			//初始进去
			const erpTableOpts = erpElTable(surplusDelivery, state.form)
			//导出订单
			function downOrder() {
             state.form.uuid = getuuid()
             if(!state.createTime.length) return ElMessage.error('请选择日期')
               exportSurplusDelivery(state.form).then (res => {
                   state.showProgress = true
                   let time = setInterval( () => {
                    progress({uuid:state.form.uuid}).then (res => {
                        state.percent=res.data.percent
                        if(res.data.percent==100 || res.data.url) {
                            setTimeout( () => {
                                clearInterval(time)
                                state.percent = 0
                                window.open(res.data.url,'_self')
                            },600)
                        }
                    })
                   },800)
               })
			}
			return {
				...toRefs(state),
				...erpTableOpts,
				downOrder,
				changeDate,
                reset
			}
		}
	}

</script>

<style lang="scss" scoped>
.headSurplusGoods {
	.content {
		margin-top: 24px;
		background: #fff;
		padding: 24px 30px 1px;
	}
	.buttonClass {
		padding: 24px 0;
		text-align: right;
	}
	.pageClass {
        margin-bottom: 60px;
		background: #fff;
		padding: 24px 30px;
	}
}
</style>
