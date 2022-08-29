<template>
	<div class="shelfManagement">
		<!-- 头部 -->
		<div class="headContent">
			<el-form :model="form" :inline="true" @keydown.enter='search'>
				<el-form-item label="仓库名称:">
					<el-select class="styleClass" v-model="form.storeId" @change="changeStore" clearable @clear="form.storeId='1'">
						<el-option v-for="item in storeList" :key="item.id" :label="item.warehouseName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="仓库分区:" style="margin-left:10px" clearable>
					<el-select class="styleClass" v-model="form.areaId" @change="changeSelect" clearable @clear="form.areaId=1">
						<el-option v-for="item in storeArea" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="搜索内容:" style="margin-left:10px">
					<el-input placeholder="请输入货架名称/货架位编码" maxlength="10" style="width:318px" v-model="form.search" clearable />
				</el-form-item>
				<el-form-item>
					<el-button type="primary" style="margin-left:16px" @click="search">查询</el-button>
					<el-button style="margin-left:14px" @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
			<div class="line"></div>
			<!-- 展开收起 -->
			<div style="margin-top:23px">
				<span :class="{expand:true,expandCheck:isBigClass}" @click="tableTree.setAllTreeExpand(true),isBigClass=true">展开<i class="el-icon-arrow-down" style="margin-left:5px"></i></span>
				<span :class="{expand:true,expandCheck:!isBigClass}" style="margin-left:31px" @click="tableTree.clearTreeExpand(),isBigClass=false">收起<i class="el-icon-arrow-up" style="margin-left:5px"></i></span>
			</div>
		</div>
		<!-- 按钮 -->
    <el-affix :offset="90">
		<div class="buttonClass">
			<el-dropdown style="margin-top: 24px;" @command="handleCommand">
				<el-button type="primary">批量操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="addShelf" v-permission="'batch_addShelf:btn'">批量新增货架位</el-dropdown-item>
						<el-dropdown-item command="deleteShelfSpace" v-permission="'batch_deleteShelfspace:btn'">批量删除货架位</el-dropdown-item>
						<el-dropdown-item command="deleteShelf" v-permission="'batch_deleteShelf:btn'">批量删除货架</el-dropdown-item>
            <el-dropdown-item command="updateLimitUpper" >批量修改分配上限</el-dropdown-item>
            <el-dropdown-item command="batchCategory" >批量绑定品类</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<el-button v-permission="'add_shelf:btn'" type="primary" style=" float: right;margin-top: 24px;" @click="addShelf('add')">新增货架</el-button>
		</div>
    </el-affix>
		<!-- 表格部分 -->
		<div class="pageTable">
			<vxe-table :data="tableData" ref="tableTree" show-overflow row-id="rowId" :tree-config="{ reserve:true, rowField: 'rowId',parentField: 'parentRowId',transform: true }" max-height="650px" :checkbox-config="{labelField: 'shelfName'}" @checkbox-change="selectChange" @checkbox-all="selectAll">
				<vxe-column type="checkbox" title="货架名称/货架位编码" tree-node align="left"></vxe-column>
				<vxe-column title="绑定品类/SKU" align="center">
					<template #default="{row}">
						<div class="skuFont" :title="row.bindNames" v-if="row.parentId">{{row.bindNames}}</div>
					</template>
				</vxe-column>
				<vxe-column title="SKU分配上限/已分配" align="center">
					<template #default="{row}">
						<div v-if="row.parentId">
							{{row.spuLimit?row.spuLimit:'-'}}/{{row.spuCount?row.spuCount:'-'}}
						</div>
					</template>
				</vxe-column>
				<!-- <vxe-column field="quantityLimit" title="上架总数上限" align="center"></vxe-column> -->
				<vxe-column field="alreadyPutaway" title="已上架总数" align="center"></vxe-column>
				<vxe-column field="status" title="状态" align="center">
					<template #default="{row}">
						<div v-if="row.parentId" :style="row.status?'color: rgba(0, 0, 0, 0.65);':'color: #FD4C60;'">{{row.status?'正常收货':'停止收货'}}</div>
					</template>
				</vxe-column>
				<vxe-column title="操作" align="center">
					<template #default="{row}">
						<a style="margin-left:20px;" @click="edit(row,'edit')" v-permission="'shelf_edit:btn'">编辑</a>
						<a v-if="!row.parentId" style="margin-left:20px;" @click="addShelfSpace('add',row)" v-permission="'add_shelfSpace:btn'">新增货架位</a>
						<a v-if="row.parentId" style="margin-left:20px;" v-permission="'shelf_openStatus:btn'" @click="changeStatus(row)">{{row.status?'停止收货':'开启收货'}}</a>
						<el-popconfirm icon="el-icon-info" :title="row.parentId?'是否删除货架位？':'是否删除货架?'" @confirm="deleteList(row)">
							<template #reference>
								<el-button type="text" style="color:#FD4C60;margin-left:20px;" v-permission="'shelfManage_delete:btn'">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</vxe-column>
			</vxe-table>
		</div>
		<!-- 分页 -->
		<div class="flex-pagination page-fixed">
			<div>
			</div>
			<div>
				<el-pagination style="" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNo" :page-sizes="paginationArr" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="paginationTotal">
				</el-pagination>
			</div>
		</div>
		<CreateShelf v-if="showAddShelf" :typeJump="typeJump" :rows="rows" @closeDialog="closeDialog"></CreateShelf>
		<AddShelfSpace v-if="showAddShelfSpace" :typeJump="typeJump" :rows="rows" @closeShelfSpace="closeShelfSpace"></AddShelfSpace>
    <UpdateLimitUpper v-if="showUpdateLimit" @closeUpdateLimit="closeUpdateLimit" :shelfSpaceData="shelfSpaceData"/>
    <BatchCategory v-if="showBatchCategory" @closeBatchCategory="closeBatchCategory" :shelfSpaceData="shelfSpaceData"/>
	</div>
</template>

<script>
	import AddShelfSpace from './components/addShelfSpace.vue'
  import UpdateLimitUpper from './components/updateLimitUpper.vue'
  import BatchCategory from './components/batchCategory.vue'
	import {
		getWareHouse //仓库管理页面查询
	} from '@/api/store.js'
	import {
		getWareHouseShelf, //Z201.模糊查询货架或者货架位
		getStoreArea, //仓库分区查询
		deleteShelf,//Z206.批量删除/单个删除货架
		deleteShelfSpace,//Z207.批量删除货架位/单个删除货架位
		getAStatus,// Z209.开启/停止操作 auth:张志芳
	} from '@/api/store/warehouseSettings.js'
	import CreateShelf from './components/createShelf'
	import { reactive, toRefs, ref, onMounted, nextTick, onActivated } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { storage } from '@/utils/storage.js'
	import { ElMessage, ElMessageBox } from 'element-plus'
	export default {
		name: 'shelfManagement',
		components: {
			CreateShelf,
			AddShelfSpace,
      UpdateLimitUpper,
      BatchCategory,
		},
		setup() {
			const tableTree = ref(null)
			const router = useRouter()
			const state = reactive({
				showAddShelf: false,//打开创建货架弹框
				showAddShelfSpace: false,//打开新增货架位弹框
        showUpdateLimit:false,//批量修改分配上限
        showBatchCategory:false,//批量修改品类
				typeJump: '',//跳转到弹框事件
				rows: {},//
				form: {
					storeId: "1",
					search: '',
					areaId: 1,
				},
				page: {
					pageSize: 10, //分页
					pageNo: 1 //分页  
				},
				paginationTotal: 0, //分页总数据条数
				paginationArr: [10, 20, 30, 50, 100], //分页每页选择条数默认数据
				tableData: [],
				shelfData: [],//存储表格选择的货架数据(给后端)
				shelfSpaceData: [],//存储表格选择的货架位数据(给后端)
				storeList: [],//仓库列表
				storeArea: [],//仓库分区
				areaName: '拣货区',//仓库分区的名字带到回显页面
				isBigClass: true,//展开收起控制样式
			})
			//获取仓库的接口
			getWareHouse({ page: { pageNo: 1, pageSize: 10 } }).then(res => {
				state.storeList = res.data.dataList
				state.form.storeId = state.storeList[0].id
				//仓库分区接口
				getStoreArea({ warehouseId: state.form.storeId }).then(res => {
					state.storeArea = res.data
					state.form.areaId = res.data[0].id
				})
			})

			//初始进入页面的渲染
			function init(isExpand) {
				let ivtWarehouseShelfDTO = {
					text: state.form.search,
					areaId: state.form.areaId || 1,
					warehouseId: state.form.storeId || 1,
				}
				ivtWarehouseShelfDTO.page = state.page
				getWareHouseShelf(ivtWarehouseShelfDTO).then(res => {
					if (isExpand) {
						state.isBigClass = true
						setTimeout(() => {
							tableTree.value.setAllTreeExpand(true)
						})
					} else {
						state.isBigClass = false
					}
					state.paginationTotal = res.data.page.totalCount
					res.data.dataList.forEach(item => {
						let num = (new Date()).getTime()
						item.rowId = 'parent_' + num + item.id
						if (item.shelfGridDOList.length) {
							item.shelfGridDOList.sort((a, b) => a.preCode.localeCompare(b.preCode))
							item.shelfGridDOList.forEach(v => {
								v.rowId = 'child_' + num + v.id
								v.shelfName = v.shelfGridName
								v.parentRowId = item.rowId
							})
						}
					})
					let tableData = []
					res.data.dataList.forEach(item => {
						tableData.push(item)
						if (item.shelfGridDOList) {
							item.shelfGridDOList.forEach(child => {
								tableData.push(child)
							})
						}
					})
					console.log(tableData);
					state.tableData = tableData
				})
			}
			//调用刷新的方法
			onActivated(() => {
				init()
			})
			//查询事件
			function search() {
				init(true)
			}
			//仓库选择事件
			function changeStore(val) {
				console.log('id', val);
				console.log(state.form.storeId);
			}
			//表格选择事件
			function selectChange(records) {
				state.shelfData = []
				state.shelfSpaceData = []
				records.records.forEach(item => {
					if (!item.parentId) {
						state.shelfData.push(item)//货架id
					} else {
						state.shelfSpaceData.push(item)//货架位id
					}
					console.log(state.shelfData, 'shelfData', state.shelfSpaceData, 'shelfSpaceData');
				})
			}
			//表格全选事件
			function selectAll(records) {
				state.shelfData = []
				state.shelfSpaceData = []
				records.records.forEach(item => {
					if (!item.parentId) {
						state.shelfData.push(item)//货架id
					} else {
						state.shelfSpaceData.push(item)//货架位id
					}
					console.log(state.shelfData, 'shelfData', state.shelfSpaceData, 'shelfSpaceData');
				})
			}
			//编辑事件
			function edit(row, type) {
				state.typeJump = type
				state.rows = row
				if (!row.parentId) {
					state.rows.areaId = state.form.areaId
					state.showAddShelf = true
				} else {
					state.showAddShelfSpace = true
				}
			}
			//新增货架
			function addShelf(type) {
				state.typeJump = type
				state.showAddShelf = true
			}
			//新增货架位
			function addShelfSpace(type, row) {
				state.rows = JSON.parse(JSON.stringify(row))
				state.rows.areaName = state.areaName
				state.typeJump = type
				state.showAddShelfSpace = true
			}
			//子页面返回的关闭弹窗事件
			//1.关闭新增编辑货架
			function closeDialog(status) {
				state.showAddShelf = false
				if (status) {
					init()

				}

			}
			//2.关闭新增编辑货架位
			function closeShelfSpace(status) {
				state.showAddShelfSpace = false
				if (status) {
					init()
					// tableTree.value.refreshColumn()
				}
			}
      //关闭修改分配上限
      function closeUpdateLimit(status){
        state.showUpdateLimit = false
        if(status){
          init(true)
        }
      }
      //关闭批量绑定品类
      function closeBatchCategory(status){
        state.showBatchCategory = false
        if(status){
          init(true)
        }
      }
			//批量操作
			function handleCommand(val) {
				if (val === 'addShelf') {//新增货架位
					router.push({ name: 'batchAddShelfSpace' })
				} else if (val === 'deleteShelfSpace') {//删除货架位
					if (!state.shelfSpaceData.length) return ElMessage.error('请选择货架位')
					ElMessageBox.confirm('确认删除货架位?', '提示', {//弹框提示
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						let arr = []
						let flags = state.shelfSpaceData.every(item => {
							return item.alreadyPutaway
						})
						if (flags) {
							ElMessage.error('货架位已被商品占用，不可删除')
						} else {
							arr = state.shelfSpaceData.filter(item => {
								return !item.alreadyPutaway
							}).map(item => item.id)
							deleteShelfSpace({ ids: arr.toString() }).then(res => {
								ElMessage.success(res.message)
								init()
								clearSelected()
							})
						}
					})
				}else if(val==='deleteShelf') {//删除货架
					if (!state.shelfData.length) return ElMessage.error('请选择货架')
					ElMessageBox.confirm('确认删除货架?', '提示', {//弹框提示
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						let data = []
						let flag = state.shelfData.every(item => {
							return item.shelfGridDOList.length > 0
						})
						if (flag) {
							ElMessage.error('货架已设置货架位，不可删除')
						} else {
							data = state.shelfData.filter(item => {
								return item.shelfGridDOList.length == 0
							}).map(item => item.id)
							deleteShelf({ ids: data.toString() }).then(res => {
								ElMessage.success(res.message)
								init()
								clearSelected()
							})
						}

					})
				}else if(val==='updateLimitUpper'){//批量修改分配上限
           if (!state.shelfSpaceData.length) return ElMessage.error('请选择货架位')
           state.showUpdateLimit = true
        }else{
          if (!state.shelfSpaceData.length) return ElMessage.error('请选择货架位')
          state.showBatchCategory = true
        }
			}
			//仓库分区的下拉选择事件
			function changeSelect(val) {
				state.storeArea.forEach(item => {
					if (item.id == val) {
						state.areaName = item.name
					}
				})
				init(true)
			}
			//重置
			function reset() {
				state.form.storeId = '1'
				state.form.areaId = 1
				state.form.search = ''
				init()
			}
			//表格的单条删除
			function deleteList(row) {
				if (!row.parentId) {//删除货架
					deleteShelf({ ids: row.id.toString() }).then(res => {
						ElMessage.success(res.message)
						tableTree.value.clearCheckboxRow()
						init()
					})
				} else {//删除货架位
					deleteShelfSpace({ ids: row.id.toString() }).then(res => {
						ElMessage.success(res.message)
						tableTree.value.clearCheckboxRow()
						init()
					})
				}
			}
			//状态开启和关闭
			function changeStatus(row) {
				getAStatus({
					gridId: row.id,
					type: row.status ? 0 : 1,
					skuIds: row.skuIds ? row.skuIds : '',
					categoryIds: row.categoryIds ? row.categoryIds : ''
				}).then(res => {
					ElMessage.success('修改成功')
					init()
				})
			}
			//分页
			const handleSizeChange = val => {
				state.page.pageSize = val
				state.page.pageNo = 1
				init()
			}
			const handleCurrentChange = val => {
				state.page.pageNo = val
				init()
			}
			// 清除选中状态
			function clearSelected() {
				tableTree.value.clearCheckboxRow()
				state.shelfData = []
				state.shelfSpaceData = []
			}
			return {
				...toRefs(state),
				tableTree,
				selectChange,
				selectAll,
				edit,
				closeDialog,
				closeShelfSpace,
        closeUpdateLimit,
        closeBatchCategory,
				addShelf,
				addShelfSpace,
				handleCommand,
				changeSelect,
				reset,
				changeStore,
				deleteList,//单条删除
				changeStatus,
				search,
				handleSizeChange,
				handleCurrentChange
			}
		}
	}
</script>

<style lang="scss" scoped>
.shelfManagement {
	.headContent {
		background: #fff;
		padding: 19px 30px 28px;

		.styleClass {
			width: 278px;
		}

		.line {
			border: 1px dashed #e9e9e9;
		}
		.expand {
			color: rgba(0, 0, 0, 0.65);
		}
		.expand:hover {
			color: #1890ff;
			font-size: 19px;
			cursor: pointer;
		}
		.expandCheck {
			color: #1890ff;
			font-size: 19px;
		}
		.buttonClass {
			margin-top: 24px;
		}
    //增加固钉样式
	.el-affix {
		width: calc(100% - v-bind(sideBarWidth) - 50) !important;
	}
	}
	.pageTable {
		background: #fff;
		padding: 24px;
		margin-top: 24px;
		margin-bottom: 40px;
		.skuFont {
			width: 200px;
			overflow: hidden;
			white-space: nowrap; //表示不换
			text-overflow: ellipsis; //加省略号;
		}
	}
}
</style>