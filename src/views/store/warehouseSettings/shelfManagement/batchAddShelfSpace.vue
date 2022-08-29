<template>
	<div class="addShelfSpace">
		<!-- 头部    -->
		<div class="box">
			<erpNav title="新增货架位" :routeOpt="{name:'shelfManagement'}" :goBack="goBack" />
		</div>
		<!-- form表单 -->
		<div class="headContent">
			<el-form :inline="true" :model="form" :rules="rules" :label-width="120" ref="formRef">
				<el-form-item label="所属仓库：" prop="warehouseId">
					<el-select v-model="form.warehouseId" style="width:324px">
						<el-option v-for="item in storeList" :key="item.id" :label="item.warehouseName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属分区：" prop="areaId" style="margin-left:80px">
					<el-select v-model="form.areaId" style="width:324px;" @change="selectChange">
						<el-option v-for="item in storeArea" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属货架：" prop="shelfId" style="margin-left:80px">
					<el-select v-model="form.shelfId" style="width:324px" @change="selectShelf">
						<el-option v-for="item in shelfDataList" :key="item.id" :label="item.shelfName" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="编号前缀：" prop="preCode">
					<el-input v-model="form.preCode" style="width:324px" :maxlength="10" @change="inputChange">
						<template #append>-</template>
					</el-input>
				</el-form-item>
				<!-- <el-form-item label="上架总数上限：" prop="quantityLimit" style="margin-left:80px">
					<el-input v-model="form.quantityLimit" style="width:324px" :maxlength="4" ></el-input>
				</el-form-item> -->
				<el-form-item label="货架层列：" prop="row" style="margin-left:80px">
					<el-input v-model="form.row" style="width:145px" :maxlength="1">
						<template #append>行</template>
					</el-input>
					<span style="text-align: center;margin-left:10px;">
						<i class="el-icon-minus"></i>
					</span>
				</el-form-item>
				<el-form-item label="" prop="col">
					<el-input v-model="form.col" style="width:145px" :maxlength="1">
						<template #append>列
						</template>
					</el-input>
					<span>
						<el-button type="warning" style="margin-left:16px;position:absolute;top:0" @click="generation">预生成</el-button>
					</span>
				</el-form-item>
			</el-form>
			<!-- 线 -->
			<div class="line"></div>
			<div class="batchBinding">
				<span>
					<el-button type="primary" @click="batchList('batch')">批量绑定</el-button>
				</span>
				<span class="spanTwo">重复的货架编号将不会添加到货架列表</span>
			</div>
			<!-- 表格 -->
			<div class="pageTable">
				<el-table :data="shelfData" @selection-change="handleSelectionChange" ref="tableRef">
					<el-table-column type="selection" width="55" :selectable="selectable" />
					<el-table-column label="货架位编号" prop="preCode" align="center" width="200">
						<template #default='scope'>
							<span>{{scope.row.preCode}}</span>
							<span>
								<el-tag type="danger" size="small" v-if="scope.row.tagRepeat">重</el-tag>
							</span>
						</template>
					</el-table-column>
					<el-table-column label="所属行" prop="row" align="center" />
					<el-table-column label="所属列" prop="col" align="center" />
					<el-table-column label="绑定品类/SKU" align="center">
						<template #default="scope">
							<div v-if="scope.row.catagoryStr?.length" :title="scope.row.catagoryStr" class="skuClass">{{scope.row.catagoryStr}}</div>
							<div v-if="scope.row.skuStr?.length" :title="scope.row.skuStr" class="skuClass">{{scope.row.skuStr}}</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center">
						<template #default="scope">
							<el-button type="text" @click="singleList(scope.row,'single')" :disabled="scope.row.tagRepeat">绑定</el-button>
						</template>
					</el-table-column>

				</el-table>
			</div>
		</div>
		<erp-footer>
			<template #default>
				<div class="footer">
					<el-button @click="back">取消</el-button>
					<el-button type="primary" @click="submit">保存</el-button>
				</div>
			</template>
		</erp-footer>
		<BindingGood v-if="showBindingGood" :batchType="batchType" :rows="rows" @closeShelf="closeShelf" @binDingList="binDingList" />
	</div>
</template>

<script>
	import {
		getWareHouse //仓库管理页面查询
	} from '@/api/store.js'
	import {
		getWareHouseShelf,//模糊查询货架或者货架位
		getStoreArea, //仓库分区查询
		queryShelf,//Z210.根据仓库和分区id查询货架
		addShelfSpace,//新增货架位
	} from '@/api/store/warehouseSettings.js'
	import BindingGood from './components/bindingGood.vue'
	import { useRoute, useRouter } from 'vue-router'
	import erpNav from '@/components/erpNav/index.vue'
	import erpFooter from '@/components/erpFooter/index.vue'
	import { nextTick, onMounted, reactive, toRefs, watch } from 'vue'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { storage } from '@/utils/storage.js'
	export default {
		name: 'batchAddShelfSpace',
		components: {
			erpNav,
			erpFooter,
			BindingGood,
		},
		setup() {
			const route = useRoute()
			const params = route.params
			const router = useRouter()
			const tableRef = (null)
			const rules = {
				warehouseId: [
					{ required: true, message: '请选择所属仓库', trigger: 'blur' }
				],
				areaId: [
					{ required: true, message: '请选择所属分区', trigger: 'blur' }
				],
				shelfId: [
					{ required: true, message: '请选择所属货架', trigger: 'blur' }
				],
				preCode: [
					{ required: true, message: '请输入编号前缀', trigger: 'blur' },
					{ pattern: /^[0-9A-Za-z]+$/, message: '前缀格式不正确', trigger: 'blur' }
				],
				// quantityLimit: [
				// 	{ required: true, message: '请输入上架总数', trigger: 'blur' },
				// 	{ pattern: /^[1-9]\d{0,3}$/, message: '上架总数上限格式不正确', trigger: 'blur' }
				// ],
				row: [
					{ required: true, message: '请输入货架层行', trigger: 'blur' },
					{ pattern: /^[1-9]+$/, message: '货架层行格式不正确', trigger: 'blur' }
				],
				col: [
					{ required: true, message: '请输入货架层列', trigger: 'blur' },
					{ pattern: /^[1-9]+$/, message: '货架层列格式不正确', trigger: 'blur' }
				]
			}
			const state = reactive({
				formRef: null,//form表单绑定的ref
				shelfData: [],//预生成的货架位表格数据
				selectList: [],//保存预生成表格的批量选择id
				batchType: '',//绑定类型(传入到子页面)
				rows: {},//传入到子页面的对象
				showBindingGood: false,
				form: {
					warehouseId: 1,
					areaId: 1,
					shelfId: '',
					preCode: '',
					quantityLimit: 9999,
					row: '',
					col: ''
				},
				oldForm: {},
				storeList: [],//仓库列表
				storeArea: [],//仓库分区
				shelfDataList: [],//接口返回的货架数据
			})
			//页面渲染完成
			onMounted(() => {
				shelfQuery()//获取到货架列表
			})
			//获取仓库的接口
			getWareHouse({ page: { pageNo: 1, pageSize: 10 } }).then(res => {
				state.storeList = res.data.dataList
				state.form.warehouseId = state.storeList[0].id
				//仓库分区接口
				getStoreArea({ warehouseId: state.form.warehouseId }).then(res => {
					state.storeArea = res.data
					state.form.areaId = res.data[0].id
					shelfQuery()
				})
			})
			//分区选择查询货架
			function shelfQuery() {
				queryShelf({ warehouseId: 1, areaId: state.form.areaId }).then(res => {
					state.shelfDataList = res.data
				})
			}

			//点击预生成按钮
			function generation() {
				let shelfRepeat = []
				if (!state.form.areaId) {//所属分区
					ElMessage.error('请选择所属分区')
				} else if (!state.form.shelfId) {//所属货架
					ElMessage.error('请选择所属货架')
				} else if (!state.form.preCode) {//所属编码
					ElMessage.error('请输入编号前缀')
				} else if (!state.form.row) {
					ElMessage.error('请输入货架层行')
				} else if (!state.form.col) {
					ElMessage.error('请输入货架层列')
				} else {
					state.shelfData = []
					for (let row = 1; row <= state.form.row; row++) {
						for (let col = 1; col <= state.form.col; col++) {
							state.shelfData.push({ row, col, code: state.form.preCode, preCode: state.form.preCode + '-' + '0' + row + '-' + '0' + col, tagRepeat: false, catagory: [], sku: [], catagoryStr: [], skuStr: [], type: '1', spuLimit: '' })
						}
					}
					//预生成的数据和列表的数据对比
					//获取某一货架下的货架位个数(调接口)

					let ivtWarehouseShelfDTO = {
						warehouseId: 1,
						areaId: state.form.areaId,
						shelfId: state.form.shelfId,
						page:{
							pageNo:1,
							pageSize:9999
						}
					}

					getWareHouseShelf(ivtWarehouseShelfDTO).then(res => {
						res.data.dataList.forEach(item => {
							if (item.shelfGridDOList.length) {
								item.shelfGridDOList.forEach(v => {
									shelfRepeat.push(v)
								})
							}
						})
						state.shelfData.forEach((item, index) => {//去重
							item.id = index + 1 //加唯一的id值
							console.log(item.preCode)
							item.tagRepeat = shelfRepeat.some(v => v.shelfGridName === item.preCode)
						})
						state.oldForm = Object.assign(state.oldForm, state.form)
					})
				}
			}
			//预生成表格的CheckBox选择
			function handleSelectionChange(selection) {
				state.selectList = []
				selection.forEach(item => {
					state.selectList.push(item.id)
				})
				console.log(state.selectList);
			}
			//单个绑定
			function singleList(row, val) {
				state.rows = JSON.parse(JSON.stringify(row))
				state.batchType = val
				state.showBindingGood = true

			}
			//点击批量绑定按钮
			function batchList(val) {
				state.batchType = val
				state.rows = JSON.parse(JSON.stringify({
					type: '1',
					sku: [],
					catagory: []
				}))
				if (!state.shelfData.length) return ElMessage.error('请先预生成货架数据')
				if (!state.selectList.length) return ElMessage.error('请先勾选数据')
				state.showBindingGood = true
			}
			//子页面返回出来的方法
			function closeShelf() {
				state.showBindingGood = false

			}
			//返回到首页
			function back() {
				router.push({
					name: 'shelfManagement'
				})
			}
			//仓库分区下拉选择事件
			function selectChange(val) {
				shelfQuery()
				if (state.shelfData.length) {//判断列表有没有数据，切换有的话点击确定就清除
					ElMessageBox.confirm(`更换分区将清除预生成列表数据，确认继续更换?`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						type: 'warning',
					}).then(() => {
						state.shelfData = []
					}).catch(err => {
						state.form.areaId = state.oldForm.areaId
					})
				}
			}


			//货架选择事件
			function selectShelf(val) {
				if (state.shelfData.length) {//判断列表有没有数据，切换有的话点击确定就清除
					ElMessageBox.confirm(`更换货架将清除预生成列表数据，确认继续更换?`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						type: 'warning',
					}).then(() => {
						state.shelfData = []
					}).catch(err => {
						state.form.shelfId = state.oldForm.shelfId
					})
				}
			}

			//编号前缀修改事件
			function inputChange() {
				if (state.shelfData.length) {
					ElMessageBox.confirm(`修改编号前缀将清除预生成列表数据，确认继续更换?`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						closeOnClickModal: false,
						closeOnPressEscape: false,
						type: 'warning',
					}).then(() => {
						state.shelfData = []
					}).catch(err => {
						state.form.preCode = state.oldForm.preCode
					})
				}
			}
			//保存事件
			function submit() {
				if (!state.shelfData.length) {
					return ElMessage.error('请先预生成货架位')
				}
				state.formRef.validate().then(() => {
					let flag = false
					let arrList = []
					state.shelfData.forEach(item => {//重新组装后端需要的数据
						if (!item.tagRepeat) {//重复的货架位数据不传给后端
							arrList.push({
								preCode: item.code, row: item.row, col: item.col,
								shelfId: state.form.shelfId,
								categoryIds: item.catagory.map(item => item.id).join(','),
								skuIds: item.sku.map(item => item.skuId).join(','),
								bindNames: item.catagoryStr.length ? null : item.skuStr.toString(),
								warehouseId: state.form.warehouseId,
								areaId: state.form.areaId,
								spuLimit: item.spuLimit,
								quantityLimit: state.form.quantityLimit
							})
							console.log(item.catagory, item.sku, '12121');
							if (!item.catagory?.length && !item.sku?.length) return flag = true
						}
					})
					///
					if (flag) {//判断sku和品类数据都没有填情况
						ElMessageBox.confirm(`部分货架位未绑定商品，确认保存?`, '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							closeOnClickModal: false,
							closeOnPressEscape: false,
							type: 'warning',
						}).then(() => {
							//调接口
							addShelfSpace({ gridDOList: arrList }).then(res => {
								ElMessage.success(res.message)
								back()
							})
						})
					} else {
						//调接口
						if (!arrList.length) return ElMessage.error('列表无有效数据，请重新设置货架位')
						addShelfSpace({ gridDOList: arrList }).then(res => {
							ElMessage.success(res.message)
							back()
						})
					}
				})
			}
			//头部的返回
			function goBack() {
				if (state.shelfData.length) {
					ElMessageBox.confirm('确认取消?', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						router.push({ name: 'shelfManagement' })
					})
				} else {
					router.push({ name: 'shelfManagement' })
				}
			}
			//子页面的数据
			function binDingList(catagory, sku, spu, type) {
				if (state.batchType == 'single') {// 单个绑定数据
					state.rows.spuLimit = spu
					state.rows.catagory = catagory
					state.rows.sku = sku
					state.rows.type = type
					state.rows.catagoryStr = state.rows.catagory.map(item => item.name).join(',')
					state.rows.skuStr = state.rows.sku.map(item => item.goodsSku).join(',')
					state.shelfData[state.shelfData.findIndex(s => s.id === state.rows.id)] = state.rows
					console.log('单条操作最终表格数据==========', state.shelfData)
				} else {//批量
					state.shelfData.forEach(item => {
						if (state.selectList?.indexOf(item.id) !== -1) {//如果能找到勾选的id就往里面加数据
							item.type = type
							item.catagory = catagory
							item.sku = sku
							item.spuLimit = spu
							item.catagoryStr = catagory.map(item => item.name).join(',')
							item.skuStr = sku.map(item => item.goodsSku).join(',')
						}
					})
					console.log('批量操作最终表格数据==========', state.shelfData)
				}
			}
			//是否可选
			function selectable(e) {
				return !e.tagRepeat
			}
			return {
				...toRefs(state),
				rules,
				params,
				tableRef,//表格的ref
				generation,
				handleSelectionChange,//表格选择
				batchList,
				singleList,
				closeShelf,
				back,
				selectChange,
				selectShelf,
				inputChange,
				submit,
				goBack,
				binDingList,
				selectable
			}
		}
	}
</script>

<style lang="scss" scoped>
.addShelfSpace {
	.footer {
		text-align: right;
		padding-right: 25px;
	}
	.headContent {
		background: #fff;
		margin-top: 24px;
		padding: 24px 24px;
		:deep(.el-form-item__label) {
			padding: 0;
		}
		:deep(.el-form-item) {
			margin-bottom: 15px;
		}
		:deep(.el-icon-minus:before) {
			position: relative;
			top: -2px;
		}
		.line {
			margin-top: 10px;
			padding: 0 24px;
			border: 1px dashed #e8e8e8;
		}
		.batchBinding {
			margin-top: 24px;
			.spanTwo {
				margin-left: 16px;
				font-size: 12px;
				color: #ff3b30;
			}
		}
		.pageTable {
			margin-top: 16px;
			.skuClass {
				width: 250px;
				overflow: hidden;
				white-space: nowrap; //表示不换
				text-overflow: ellipsis; //加省略号;
			}
		}
	}
}
</style>