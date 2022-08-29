<template>
	<div class="headCategory">
		<!-- 头部 -->
		<div class="content">
			<div>
				<span :class="{expand:true,expandCheck:!isBigClass}" @click="expands">展开<i class="el-icon-arrow-down"></i></span>
				<span :class="{expand:true,expandCheck:isBigClass}" style="margin-left:31px" @click="close">收起<i class="el-icon-arrow-up"></i></span>
			</div>
			<div>
                <el-dropdown  @command="handleCommand">
				<el-button type="primary" >批量修改权限设置<i class="el-icon-arrow-down el-icon--right"></i></el-button>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="batchLimit" >批量修改权限设置</el-dropdown-item>
						<el-dropdown-item command="batchQuotation" >批量修改报价设置</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
				<!-- <el-button  @click="quotation()" v-permission="'quotation-setting'">报价设置</el-button>
				<el-button style="margin-left: 16px"  @click="limit()" v-permission="'limit-setting'">权限设置</el-button> -->
				<el-button style="margin-left: 16px" type="primary" v-permission="'category-add:btn'"  @click="adds('2','add')">新增品类</el-button>
			</div>
		</div>
		<!-- 表格部分 -->
		<div class="headTable">
			<el-table ref="topicTable" :data="data" row-key="id" highlight-current-row :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" align="center" :selectable="selectable" />
				<el-table-column label="品类名称" prop="name" width="150" show-overflow-tooltip/>
				<el-table-column label="品类编码" prop="code" align="center" width="100" />
				<el-table-column label="排序" prop="sort" align="center">
					<template #default="scope">
						<div>
							<a v-if="scope.row.index !==0" @click="sort(scope.row,'up')"><img src="../../../../assets/image/px_s_icon.png" alt=""></a>
							<a class="sortIcon" v-if="!scope.row.end" @click="sort(scope.row,'down')"><img src="../../../../assets/image/px_x_icon.png" alt=""></a>
							<a class="sortIcon" v-if="!scope.row.end" @click="sort(scope.row,'bottom')"><img src="../../../../assets/image/px_zd_icon.png" alt=""></a>
							<a class="sortIcon" v-if="scope.row.index !==0" @click="sort(scope.row,'top')"><img src="../../../../assets/image/px_db_icon.png" alt=""></a>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="商品数量（已报价/待报价/待申请）" prop="goods" width="250" align="center">
					<template #default="scope">
						<div v-show="!scope.row.children||!scope.row.children.length">
							( <a @click="jumpOffer(scope.row,1)">{{scope.row.goodsQuantity?scope.row.goodsQuantity.quotedCount:0}}</a>
							\
							<a style="color:#E66A69;margin-left:5px" @click="jumpOffer(scope.row,2)">{{scope.row.goodsQuantity?scope.row.goodsQuantity.tobeQuotedCount:0}}</a>
							<span style="margin-left:5px"> \</span>
							<a style="color: rgba(0, 0, 0, 0.65);margin-left:5px" @click="jumpOffer(scope.row,3)">{{scope.row.goodsQuantity?scope.row.goodsQuantity.unQuotedCount:0}}</a> )
						</div>
					</template>
				</el-table-column>
				<el-table-column label="常用规格" prop="speCount" align="center" width="100">
					<template #default="scope">
						<a v-if="scope.row.levelNum == 1" @click="speCount(scope.row)">{{scope.row.speCount}}</a>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" align="center" width="200" />
				<el-table-column label="状态" prop="status" align="center" width="150">
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
				<el-table-column label="操作" align="center" width="400">
					<template #default="scope">
						<a v-if="scope.row.levelNum===1" @click="add(scope.row,'1')" v-permission="'category-setting_add-child:btn'">添加二级品类</a>
						<a v-if="scope.row.levelNum===1" style="margin-left:15px" @click="addLimit(scope.row)">权限设置</a>
						<a v-if="scope.row.levelNum===1" style="margin-left:15px" @click="addQuotationSetting(scope.row)">报价设置</a>
						<a v-if="scope.row.levelNum===2" @click="add(scope.row,'2')" v-permission="'category-setting_add-child:btn'">添加三级品类</a>
						<a style="margin-left:15px" @click="edit(scope.row,'edit')" v-permission="'category-setting_edit:btn'">编辑</a>
						<el-popconfirm icon="el-icon-info" title="是否删除该品类？" @confirm="del(scope.row.id)">
							<template #reference>
								<el-button type="text" style="color:#FD4C60;margin-left:15px;" v-permission="'category-setting_del:btn'">删除</el-button>
							</template>
						</el-popconfirm>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<AddCategory v-if="showCategory" :rows="rows" :typeLevel="typeLevel" :typeEdit="typeEdit" @closeDialog="closeDialog" @updataList="updataList" />
		<!-- 权限设置 -->
		<AddLimitSetting v-if="showLimit" :settingRows="settingRows" @closeLimit='closeLimit' />
		<!-- 报价设置 -->
		<AddQuotationSetting v-if="showQuotation" :settingRows="settingRows" @closeQuotation='closeQuotation' />
        <!-- 批量修改权限 -->
        <BatchLimit v-if="showBatchLimit" :selectId="selectId" @closeBatchLimit='closeBatchLimit'/>
        <!-- 批量修改报价设置 -->
        <BatchQuatation v-if="showBatchQuation" :selectId="selectId" @closeBatchQuotation='closeBatchQuotation'/>
	</div>
</template>

<script>
    import BatchQuatation from './components/batchQuatation'
    import BatchLimit from './components/batchLimit'
	import AddCategory from './components/addCategory'
	import AddLimitSetting from './components/addLimitSetting'
	import AddQuotationSetting from './components/addQuotationSettings'
	import { toTree } from '@/utils/tool.js'
	import { reactive, toRefs, onMounted, shallowReactive, nextTick } from 'vue'
	import { ElMessage, ElMessageBox } from "element-plus"
	import { useRouter } from 'vue-router'
	import {
		selectCategory, //查询是否设置权限
		getCategoryList, //查询品类列表
		deleteCategory, //删除品类
		updateCategoryStatus, //状态
		categorySort //品类排序
	} from '@/api/goods/rules.js'
	export default {
		name: 'categoryManagement',
		components: {
			AddCategory,//品类弹框
			AddLimitSetting,//权限弹框
			AddQuotationSetting,//报价设置
            BatchLimit,//批量修改权限
            BatchQuatation,//批量修改报价设置
		},
		setup() {
			const router = useRouter()
			const state = shallowReactive({
				flag: true,
				rows: {},
                settingRows:{},
				typeLevel: '',
				typeEdit: '',
				showCategory: false,
				topicTable: null,
				data: [],
				/////// 四期新增的
				showLimit: false,
				showQuotation: false,
                showBatchLimit:false,
                showBatchQuation:false,
                selectId:[],//表格选择的id
				isBigClass: true,//展开收起控制样式
			})
			let expandList = []
			//1.初始进去时候
			function init(code) {
				getCategoryList({ level: null }).then(res => {
					state.data = toTree(res.data, 'id')
					loopList(state.data)
					nextTick(() => {
						expandList.forEach(item => {  // 收起
							state.topicTable.toggleRowExpansion(item, true)
						})
						if (code) {  // 选中
							let treeNode = {}
							if (expandList[0].levelNum > 1) {
								state.data.some(item => {
									return item.children.some(child => {
										if (child.id == expandList[0].id) {
											treeNode = child
											return true
										}
									})
								})
							} else {
								treeNode = state.data.find(item => item.id == expandList[0].id)
							}
							let child = treeNode.children.find(item => item.code == code)
							state.topicTable.setCurrentRow(child)
							setTimeout(() => {
								let dom = document.querySelector('.current-row')
								dom.scrollIntoView({
									block: 'end',
									behavior: 'smooth'
								})
							})
						}
					})
					function loopList(data) {
						data.forEach((item, index) => {
							item.status = item.status ? true : false
							item.index = index
							item.end = data.length - 1 == index
							if (item.children && item.children.length) {
								loopList(item.children)
							}
						})
					}
				})
			}
			//2.状态事件
			function changeStatus(row, val) {
				let params = {
					status: val ? 0 : 1,
					idList: [row.id]
				}
				ElMessageBox.confirm('是否改变状态?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					updateCategoryStatus(params).then(res => {
						init()
						ElMessage.success('修改成功')
					})
				})

			}
			//3.编辑事件
			function edit(row, val) {
				state.typeEdit = val
				row.edit = 1
				state.rows = row
				state.showCategory = true
			}
			//4.新增事件
			function add(row, val) {
				if (!row.status) {
					return ElMessage.error('状态关闭的不能添加新的品类')
				} else {
					state.rows = row
					state.typeEdit = val
					state.typeLevel = val
					state.showCategory = true
				}

			}
			function adds(val, type) {
				state.rows = {}
				state.typeEdit = type
				state.typeLevel = val
				state.showCategory = true
			}
			onMounted(() => {
				init()
			})
			//展开
			function expands() {
                state.isBigClass=false
				loopExpand(state.data)
				function loopExpand(data) {
					data.forEach(row => {
						state.topicTable.toggleRowExpansion(row, true)
						if (row.children && row.children.length) {
							loopExpand(row.children)
						}
					})
				}
			}
			//收起
			function close() {
                state.isBigClass=true
				state.data.forEach(row => {
					state.topicTable.toggleRowExpansion(row, false)
				})
			}
			//首页已报价/待报价/未报价页面的跳转
			function jumpOffer(row, val) {
				if (!row.status) return
				if (val === 1) {
					router.push({ name: 'SetPrice', params: { categoryId: row.id, isRefresh: true } })
				} else if (val === 2) {
					router.push({ name: 'Quotation', params: { categoryId: row.id } })
				} else {
					router.push({ name: 'UnsetPrice', params: { categoryId: row.id, isRefresh: true } })
				}
			}
			//常用规格页面的跳转
			function speCount(row) {
				if (!row.status) {
					return
				} else {
					router.push({ name: 'commonSpecifications', params: { categoryId: row.id } })
				}

			}
			//打开权限设置弹框
			function addLimit(value) {
                state.settingRows=value
				state.showLimit = true
			}
			//打开报价设置弹框
			function addQuotationSetting(value) {
                if(!value.goodsDeptIdList.length){
                    ElMessage.error('请先设置权限设置')
                }else{
                    state.settingRows=value
				    state.showQuotation = true
                }
			}
            //批量修改权限设置
            function handleCommand(val) {
                if(state.selectId.length==0) return ElMessage.warning('请先勾选列表品类')
                if(val==='batchLimit'){
                    state.showBatchLimit=true
                }else{
                    state.showBatchQuation=true
                }
     
            }
			//删除品类事件
			function del(val) {
				deleteCategory({ id: val }).then(res => {
					ElMessage.success('删除成功')
					init()
				})

			}
			//父页面接受子页面返回的方法
			function closeDialog() {
				state.showCategory = false
			}

			function updataList({ id, code, type }) {
				console.log(id, code, type);
				state.showCategory = false
				let arr = []
				let treeItem = state.data.find(item => {
					return item.id == id || item.children.some(child => {
						if (child.id == id) {
							arr.push(child)
							return true
						}
					})
				})
				arr.push(treeItem)
				expandList = arr
				if (type != 'edit') {
					init(code)
				} else {
					init()
				}

			}
			//排序
			function sort(row, type,) {
				let params = {
					type: type,
					id: row.id
				}
				categorySort(params).then(res => {
					init()
				})
			}
			//表格的选择框
			function handleSelectionChange(selection) {
                state.selectId=[]
                selection.forEach(v => {
                    state.selectId.push(v.id)
                })
				console.log(state.selectId,'state.selectId');
			}
			//是否可选
			function selectable(e) {
				return e.levelNum === 1
			}
			//权限页面返回关闭方法
			function closeLimit(val) {
                if(val){
                    init()
                }
				state.showLimit = false
			}
			//报价设置页面返回关闭方法
			function closeQuotation(val) {
                if(val){
                   init() 
                }
				state.showQuotation = false
			}
            //批量设置权限页面返回关闭方法
            function closeBatchLimit (val){
                if(val){
                    init()
                }
            state.showBatchLimit = false
            }
            //批量设置报价设置关闭方法
            function closeBatchQuotation(val){
                if(val){
                    init()
                }
                state.showBatchQuation=false
            }
			return {
				...toRefs(state),
				changeStatus,
				edit,
				add,
				expands,
				close,
				del,
				closeDialog,
				sort,
				updataList,
				adds,
				jumpOffer,
				speCount,
				handleSelectionChange,
				selectable,
				addLimit,
				addQuotationSetting,
				closeLimit,
				closeQuotation,
                handleCommand,
                closeBatchLimit,
                closeBatchQuotation
			}
		}
	}
</script>

<style lang="scss" scoped>
.headCategory {
	.content {
		padding: 24px 30px;
		background: #fff;
		display: flex;
		justify-content: space-between;
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
	}

	.headTable {
		padding: 24px 30px;
		background: #fff;
		margin-top: 23px;
		.sortIcon {
			margin-left: 10px;
		}
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
}
</style>
