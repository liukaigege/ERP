<template>
	<div class="headOperationLog">
		<div class="headContainer">
			<el-form :inline="true" :model="form">
				<el-form-item label="搜索内容:">
					<el-select v-model="form.serachType" style="width:120px" clearable>
						<el-option label="姓名" :value="1"></el-option>
						<el-option label="行为属性" :value="2"></el-option>
						<el-option label="行为" :value="3"></el-option>
					</el-select>
					<el-input v-model="form.serachName" placeholder="请输入要搜索的内容" :maxlength="500" style="width:280px;margin-left:16px" clearable />
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="creatTime" type="daterange" style="width: 280px; margin-left: 16px" range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-select v-model="form.postName" style="margin-left: 16px; width: 140px" clearable placeholder="岗位名称">
						<el-option v-for="item in stationValue" :key="item.postId" :label="item.postName" :value="item.postName" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<elSelectTree ref="deptRef" style="margin-left:16px" @ok="getValue" slPlaceholder='部门' :multiple="false" :data="options" :width="140" :treeProps="{
            value: 'deptName',
            label: 'deptName',
            children: 'children'
          }" :checkStrictly="true" />

				</el-form-item>
				<el-form-item>
					<el-button style="margin-left: 10px" type="primary" @click="search">搜索</el-button>
					<el-button style="margin-left: 10px" type="primary" @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 表格部分 -->
		<div class="headTable">
			<el-table border :data="data" style="width: 100%" :header-cell-style="{
          background: '#FAFAFA',
          color: '#606266'
        }">
				<el-table-column prop="userName" label="姓名" width="180" align="center">
				</el-table-column>
				<el-table-column prop="deptName" label="部门" width="180" align="center">
				</el-table-column>
				<el-table-column prop="postName" label="岗位" width="180" align="center">
				</el-table-column>
				<el-table-column prop="roleName" label="角色" width="180" align="center" :formatter="formater">
				</el-table-column>
				<el-table-column prop="ip" label="ip" width="180" align="center">
				</el-table-column>
				<el-table-column prop="createTime" label="操作时间" width="180" align="center">
				</el-table-column>
				<el-table-column prop="type" label="行为属性" width="180" align="center">
				</el-table-column>
				<el-table-column prop="content" label="行为" align="center">
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页 -->
		<div class="paginationClass">
			<el-pagination style="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page.pageNo" :page-sizes="paginationArr" :page-size="form.page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import { reactive, toRefs } from 'vue'
	import moment from 'moment'
	import { onMounted } from 'vue'
	import elSelectTree from '@/components/elSelectTree/index.vue'
	import {
		getDepartmentList, //查询部门列表(tree)
		searchStationLog, //查询操作日志岗位信息
		getOperationLog,//查询日志列表
	} from '@/api/user.js'
	import { ElMessage } from 'element-plus'
	export default {
		name: 'OperationLog',
		components: { elSelectTree },
		setup() {
			const state = reactive({
				creatTime: [],
				stationValue: [],
        deptRef:null,
				form: {
					postName: '',
					serachType: null,
					serachName: '',
					start: '',
					end: '',
					deptName: '',
					page: {
						pageNo: 1,
						pageSize: 10
					}
				},
				options: [],
				data: [],
				paginationTotal: 1, //分页总数据条数
				paginationArr: [10, 20, 30, 40, 100] //分页每页选择条数默认数据
			})
			// 初始方法
			const init = () => {
				let { postName, serachType, serachName, deptName, page } = state.form,
					params = { postName, serachType, serachName, deptName, page };
				params.start = state.creatTime ? state.creatTime[0] + ' 00:00:00' : ''
				params.end = state.creatTime ? state.creatTime[1] + ' 23:59:59' : ''

				// params.userId='1'
				getOperationLog(params).then(res => {
					if (res.code == 200) {
						state.data = res.data.dataList
						state.paginationTotal = res.data.page.totalCount
						console.log(res.data, 1111)
					}
				})
			}
			onMounted(() => {
				state.creatTime = [moment()
					.endOf('day')
					.subtract(6, 'days')
					.format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD')]
				init()
			})
			//点击搜索时候
			const search = () => {
				init()
			}
			//重置
			function reset() {
				state.form.postName = ''
        state.form.deptName = ''
        state.form.serachType = null
				state.form.serachName = ''
				state.form.start = ''
				state.form.end = ''
        state.deptRef.clearHandle()
				state.creatTime = [moment()
					.endOf('day')
					.subtract(6, 'days')
					.format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD')]
				init()
			}
			//1.
			const getValue = e => {
				console.log(e)
				state.form.deptName = e
			}
			// 分页
			const handleSizeChange = val => {
				state.form.page.pageSize = val
				init()
			}
			const handleCurrentChange = val => {
				state.form.page.pageNo = val
				init()
			}
			//查询岗位信息
			searchStationLog().then(res => {
				if (res.code == 200) {
					state.stationValue = res.data
				}
			})
			//查询部门信息列表(tree)
			getDepartmentList().then(res => {
				if (res.code == 200) {
					//  console.log(res.data,'55555')
					state.options = res.data
				}
			})

			//过滤
			const formater = (row) => {
				return row.roleName.trim().split(' ').join('，')
			}
			return {
				...toRefs(state),
				getValue,
				handleSizeChange,
				handleCurrentChange,
				search,
				formater,
				reset
			}
		}
	}
</script>
<style scoped lang="scss">
.headOperationLog {
	padding-bottom: 60px;
	.headContainer {
		background: #fff;
		padding: 20px 30px;
		padding-bottom: 1px;
		:deep(.el-input__inner) {
			height: 32px;
		}
		:deep(.el-range-editor--small .el-range-separator) {
			width: 38px;
		}
		:deep(.el-button--small) {
			min-height: 32px;
		}
		:deep(.el-form--inline .el-form-item) {
			margin-right: 0;
		}
		// :deep(.el-select .el-input .el-select__caret){
		//   height: 34px;
		// }
	}

	//表格样式
	.headTable {
		margin-top: 30px;
		background-color: #ffffff;
		border-radius: 2px 2px 2px 0px;
		padding: 20px 25px;
	}
	//分页
	.paginationClass {
		position: fixed;
		bottom: 0;
		left: var(--sideBarWidth);
		width: calc(100% - var(--sideBarWidth));
		display: flex;
		// align-items: center;
		// justify-content: space-between;
		justify-content: flex-end;
		background: white;
		z-index: 9;
		padding: 10px 10px;

		:deep(.el-pagination) {
			margin-top: 0;
		}
	}
}
</style>
