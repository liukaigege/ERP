<template>
	<div class="headOderDetails">
		<!-- 头部的返回 -->
		<div class="box">
			<erpNav title="T+0下单数据明细表" :routeOpt="{name:'dailyWorkPurchase'}" />
		</div>
		<div class="content">
			<el-form :model="form" :inline="true">
				<!-- <el-form-item label="维度:">
					<el-select v-model="form.dimension" style="width:135px" >
						<el-option label="一级" :value="1"></el-option>
						<el-option label="二级" :value="2"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="品类:" prop="catagoryId">
					<el-cascader  ref="cascaderRef" :options="categoryList" collapse-tags :props="{ emitPath:true, multiple:true,label:'name',value:'id',children:'child' }" clearable v-model="categoryIds" />
				</el-form-item>
				<el-form-item label="日期:">
					<el-date-picker v-model="createTime" type="daterange" class="date-item" unlink-panels style="width: 224px;"  range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" style="margin-left: 10px"  @click="searchQuery">查询</el-button>
					<el-button  @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 导出按钮 -->
		<div class="buttonClass">
			<el-button type="primary"  @click="exportDetails">导出</el-button>
		</div>
		<!-- 表格部分 -->
		<div class="pageClass">
			<el-table :data="tableData" v-loading="tableLoading">
				<el-table-column label="品类" prop="categoryId" align="center">
					<template #default="scope">
						<div class="hideClass" :title="scope.row.category_id">{{scope.row.categoryName?scope.row.categoryName:scope.row.categoryId}}</div>
					</template>
				</el-table-column>
				<el-table-column label="SKU" prop="skuId" align="center">
					<template #default="scope">
						<div class="hideClass" :title="scope.row.skuId">{{scope.row.skuId}}</div>
					</template>
				</el-table-column>
				<el-table-column label="日期" prop="date" align="center"></el-table-column>
				<el-table-column label="应下单量" prop="shouldPurchaseCount" align="center"></el-table-column>
				<el-table-column  prop="validPurchaseCount" align="center">
                     <template #header>
                   <span>有效下单量</span>
                   <el-tooltip effect="light" content="说明:对于商品sku实际下单数量，系统优先分配给该商品之前未完成的下单数量，因此有效下单量为实际下单量扣除之前累计未完成数量;若为负数，有效下单量为0" placement="top">
                       <i class="el-icon-question">
                       </i>
                    </el-tooltip>
                </template> 
                </el-table-column>
        <el-table-column label="实际下单量" prop="actualPurchaseCount" align="center"></el-table-column>
				<el-table-column label="T+0下单率" prop="rate" align="center"></el-table-column>
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
	import { getuuid } from '@/utils/tool.js'
	import moment from 'moment';
	import { erpElTable } from 'hooks'
	import { ElMessage } from 'element-plus';
	import progressDialog from '../components/progress.vue'
	import { purchaseDetail, exportPurchaseDetail, progress } from './api/api.js'
	import { rulecClassify } from "@/api/goods/rules.js";
	import { reactive, toRefs, ref } from 'vue'
	import erpNav from '@/components/erpNav/index.vue'
    import { toTree, deepCopy, treeToArr } from '@/utils/tool.js'
	import { useRouter } from 'vue-router'
	export default {
		name: 'orderDetails',
		components: {
			erpNav,
			progressDialog
		},
		setup() {
			const router = useRouter()
			let cascaderRef = ref(null)
			const state = reactive({
				createTime: [moment().subtract(29, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
				form: {
					// dimension: '',//维度暂时不做
					date: {
						start: moment().subtract(29, 'day').format('YYYY-MM-DD'),
						end: moment().format('YYYY-MM-DD'),
					},
					categories: [],
					uuid: ''
				},
				categoryIds: [],//选择的品类id数组
				categoryList: [],//后台接口返回数据
				//进度条
				showProgress: false,
				percent: 0 //进度条进度
			})
			//初始进去
			const erpTableOpts = erpElTable(purchaseDetail, state.form,{
                autoSearch:false,
                dataFilter:res => {
                    let  category = []
                    function loop(data){
                        data.forEach(item=>{
                            if(item.child&&item.child.length){
                                loop(item.child)
                            }
                            category.push(item)
                    })
                    }
                    loop(state.categoryList)
                    console.log(category);
                    res.forEach(item => {
                        category.forEach (v => {
                            if(item.categoryId == v.id){
                                item.categoryName = v.name
                            }
                        })
                    })
                    return res
                }
            })
			//品类接口
			rulecClassify().then(res => {
				state.categoryList = res.data
                erpTableOpts.search()
			})
			//头部查询事件
			function searchQuery() {
				state.form.categories = cascaderRef.value.getCheckedNodes().map(v => v.value)
				erpTableOpts.search()
			}

			//导出明细
			function exportDetails() {
				state.form.uuid = getuuid()
				let params = {
					startTime: state.form.date.start,
					endTime: state.form.date.end,
					categoryIds: state.form.categories,
					uuid: state.form.uuid
				}
				if (!state.createTime) return ElMessage.error('请选择日期')
				exportPurchaseDetail(params).then(res => {
					state.showProgress = true
					let time = setInterval(() => {
						progress({ uuid: state.form.uuid }).then(res => {
							state.percent = res.data.percent
							if (res.data.percent == 100 || res.data.url) {
								setTimeout(() => {
									clearInterval(time)
									state.percent = 0
									window.open(res.data.url, '_self')
								}, 600)
							}
						})
					}, 800)
				})
			}
            //日期选择
			function changeDate(date) {
				if (!date) return
				state.form.date.start = date[0] 
				state.form.date.end = date[1] 
			}
			//重置
			function reset() {
				state.createTime = [moment().subtract(29, 'day').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')]
				state.form.date.start = moment().subtract(29, 'day').format('YYYY-MM-DD')
				state.form.date.end = moment().format('YYYY-MM-DD')
				cascaderRef.value.handleClear()
				erpTableOpts.search()
			}
			return {
				...toRefs(state),
				cascaderRef,
				...erpTableOpts,
				exportDetails,
				searchQuery,
				reset,
                changeDate
			}
		}
	}
</script>
<style lang="scss" scoped>
.headOderDetails {
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
		.hideClass {
			width: 200px;
			overflow: hidden;
			white-space: nowrap; //表示不换
			text-overflow: ellipsis; //加省略号;
		}
	}
}
</style>