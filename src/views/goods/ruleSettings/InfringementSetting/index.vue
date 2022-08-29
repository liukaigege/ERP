<template>
	<div class="headingring">
		<!-- 第一部分 -->
		<div class="contentingring">
			<el-form :model="form" :inline="true" @keydown.enter='searchForm'>
				<el-form-item label="创建时间：" style="margin-left:8px">
					<el-date-picker v-model="createTime" type="daterange" style="width: 224px; "  range-separator="→" value-format="YYYY-MM-DD" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="搜索内容：" style="margin-left:8px">
					<el-select v-model="type" placeholder="请选择" style="width: 140px" clearable >
						<el-option label="样例名称" value="样例名称"></el-option>
						<el-option label="敏感词汇" value="敏感词汇"></el-option>
					</el-select>
					<el-input style="width:320px;margin-left:16px" placeholder="请输入要检索的内容多条可用逗号或空格隔开" v-model="inputName" />
				</el-form-item>
				<el-form-item label="创建人：" style="margin-left:8px">
					<el-select v-model="form.createBy" placeholder="请选择" style="width: 140px" clearable>
						<el-option v-for="item in personList" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态：" style="margin-left:8px">
					<el-select v-model="form.status" placeholder="请选择" style="width: 140px" clearable>
						<el-option label="已开启" :value="1"></el-option>
						<el-option label="未开启" :value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item style="float:right">
					<el-button style="margin-left: 16px" type="primary"  @click="searchForm">查询</el-button>
					<el-button style="margin-left: 14px" type="primary"  @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!-- 第二部分 -->
		<div style="margin-top:24px">
			<el-button type="primary"  @click="batchStatus(1)" v-permission="'infringe-setting_open-batch:btn'">批量开启</el-button>
			<el-button style="margin-left: 16px" type="primary"  @click="batchStatus(0)" v-permission="'infringe-setting_close-batch:btn'">批量关闭</el-button>
			<el-button style="float:right" type="primary"  @click="add('add')" v-permission="'infringe-setting_add-edit:menu'">新增</el-button>
		</div>
		<!-- 表格部分 -->
		<div class="headTable">
			<el-table :data="tableData" :header-row-style="{
        'background-color': '#FAFAFA',
        color: '#242526',
        width: '100%'
      }" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" />
				<el-table-column prop="name" label="样例名称" align="center" width="100" />
				<el-table-column prop="words" label="敏感词汇" align="center" width="300">
					<template #default="scope">
						<div class="tableTags">
							<el-tag type="danger" :title="scope.row.vocabularyList" style="margin-left:5px" size="small" v-for="item in scope.row.vocabularyList" :key="item">{{item}}</el-tag>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="skuImg" label="图片样例" align="center">
					<template #default="scope">
						<div class="qualityImgs">
							<el-popover :hide-after="1" placement="right-start" trigger="hover" width="auto">
								<el-image style="width: 200px; height: 200px" :src="scope.row.urlImg" fit="contain"></el-image>
								<template #reference>
									<el-image style="width: 70px; height: 70px;" :src="scope.row.urlImg" fit="contain">
										<template #error>
                                                <div class="image-slot">
                                                    <el-image style="width: 70px; height: 70px;" fit="contain" :src="img" />
                                                </div>
                                            </template>
									</el-image>
								</template>
							</el-popover>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="createUserName" label="创建人" align="center" />
				<el-table-column prop="createTime" label="创建时间" align="center" >
                   <template #default="scope">{{scope.row.createTime}}</template>    
                </el-table-column>
				<el-table-column prop="status" label="状态" align="center">
					<template #default="scope">
						<div class="switchStatus">
							<el-switch v-model="scope.row.status" active-color="#1890FF" inactive-color="#C0C0C0"></el-switch>
							<div class="statusMasker" @click="
                  changeStatus(scope.row,
                    scope.row.status,
                  )
                "></div>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<a @click="edit(scope.row,'edit')" v-permission="'infringe-setting_add-edit:menu'">编辑</a>
						<el-popconfirm title="确定删除样例?" @confirm="del(scope.row.id)">
							<template #reference>
								<a style="margin-left:30px;color: #FD4C60;" v-permission="'infringe-setting_del:btn'">删除</a>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<!-- 分页器 -->
        <div class="flex-pagination page-fixed">
            <div>
                <el-checkbox v-model="checkedList">
					已选<span style="color: #1890ff">{{selectGoodsId?selectGoodsId.length:0}}</span>条
				</el-checkbox>
            </div>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
            </el-pagination>
        </div>
	</div>
</template>

<script>
    import img from '@/assets/image/zwt_bg.png'
	import { reactive, toRef, toRefs, getCurrentInstance, onMounted, ref,onActivated } from 'vue'
	import { ElMessage, ElMessageBox } from "element-plus"
    import { erpElTable } from 'hooks'
	import { useRouter } from 'vue-router'
	import { resetForm } from '@/utils/tool.js'
	import {
		getTort, //查询侵权列表
		getTortUser,//创建用户列表
		getTortStatus,//状态修改
		deleteTort,//删除
	} from '@/api/goods/rules.js'
	export default {
		name: 'InfringementSetting',
		setup() {
			const router = useRouter()
			const personList = ref([]) //创建人列表
			const state = reactive({
                createTime: [],//查询时间
                type:'样例名称',
                inputName:'',
                img,
				form: {
					createTimeStart:'',//开始时间
                    createTimeEnd:'',//结束时间
					name: '',//样例名称
					createBy: '',
					status: 1,//状态
					vocabulary: ''//模糊搜索
				},
				checkedList: false,
				selectGoodsId: []
			})
			//1.初始事件
            const erpTableOpts = erpElTable(getTort, state.form, {
                dataFilter: res => {
                    res.forEach(item => {
                    item.status=item.status?true:false
                    item.urlImg=item.photoList[0]?item.photoList[0].url:''
                    item.createTime=item.createTime.substring(0,item.createTime.length-3)
                    })
                    console.log(res,'res');
                    return res
                    
                }
            })
			//1.2 查询用户列表
			getTortUser().then(res => {
				personList.value = res.data
			})
           //1.3调用的刷新方法
           onActivated(()=>{
              erpTableOpts.search()
           })
			//2.状态事件
			function changeStatus(row, val) {
				ElMessageBox.confirm('是否改变状态?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					getTortStatus({
						status: val ? 0 : 1,
						idList: [row.id]
					}).then(res => {
						ElMessage.success('状态修改成功！')
						erpTableOpts.search()
					})
				})
			}
			//3.编辑事件
			function edit(row, val) {
				router.push({ name: 'addInfringmentSetting', params: { routeType: val , rowId: row.id} })
			}
			//4.新增事件
			function add(val) {
				router.push({ name: 'addInfringmentSetting', params: { routeType: val } })
			}
			//4.1.表格的选择框
			function handleSelectionChange(selection) {
				state.selectGoodsId = []
				selection.forEach(v => {
					state.selectGoodsId.push(v.id)
				})
				state.checkedList = state.selectGoodsId && state.selectGoodsId.length ? true : false
			}
			//4.2批量开启/批量关闭
			function batchStatus(value) {
				if (state.selectGoodsId.length == 0) { return ElMessage.error('请选择侵权样例') }
				ElMessageBox.confirm(`是否批量${value ? '开启' : '关闭'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					//调接口
					getTortStatus({
						status: value,
						idList: state.selectGoodsId
					}).then(res => {
						ElMessage.success('修改成功')
						erpTableOpts.search()
					})
				})
			}
			//4.3 删除事件
			function del(val) {
				deleteTort({ id: val }).then(res => {
					ElMessage.success('删除成功')
					erpTableOpts.search()
				})
			}
			//重置按钮
			function reset() {
                state.type='样例名称'
                state.inputName=''
                state.createTime=[]
                let restForm={
                    status:1
                }
                    
				resetForm(state.form,restForm)
				erpTableOpts.search()
			}
            //日期选择
            function changeDate(data){
             if(data){
                state.form.createTimeStart=data[0]+ ' 00:00:00'
               state.form.createTimeEnd=data[1]+' 23:59:59'
             }else{
                 state.form.createTimeStart=state.form.createTimeEnd=''
             }
            }
            //查询的方法
            function searchForm() {
                if(state.type=='样例名称'){
                   state.form.name=state.inputName
                   state.form.vocabulary=''
               }else if(state.type=='敏感词汇'){
                   state.form.vocabulary=state.inputName
                   state.form.name=''
               }else{
                  state.form.name=''
                  state.form.vocabulary='' 
               }
               erpTableOpts.search()
            }
         
           
			return {
				...toRefs(state),
                ...erpTableOpts,
				personList,
				changeStatus,
				edit,
				add,
				del,
				reset,
				handleSelectionChange,
				batchStatus,
                changeDate,
                searchForm,

			}
		}

	}
</script>

<style lang="scss" scoped>
.headingring {
	.contentingring {
		padding: 24px 30px;
		padding-bottom: 1px;
		background: #fff;

		:deep(.el-input--suffix .el-input__inner) {
			height: 32px;
		}

		:deep(.el-input) {
			line-height: 32px;
		}

		:deep(.el-input__inner) {
			height: 32px;
		}

		:deep(.el-form-item__label) {
			padding: 0;
		}

		:deep(.el-range-editor--small .el-range-separator) {
			width: 38px;
		}
	}

	.headTable {
		padding: 30px 30px;
		background: #fff;
		margin-top: 16px;
        margin-bottom: 60px;

		.tableTags {
			text-align: justify;
			text-align-last: left;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
		}
		.qualityImgs {
			 display: flex;
            //  align-items: center;
             justify-content: center;
		}
	}

	//图片设置
	//状态
	.switchStatus {
		position: relative;

		.statusMasker {
			position: absolute;
			width: 30%;
			height: 100%;
			top: 0;
			right: 35%;
			cursor: pointer;
		}
	}
}
</style>
