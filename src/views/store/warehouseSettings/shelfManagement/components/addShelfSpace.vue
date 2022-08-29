<template>
	<el-dialog :title="typeJump=='add'?'新增货架位':'编辑货架位'" width="850px" v-model="dialogShelfSpace" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeShelfSpace">
		<div class="headClass">
			<el-form :rules="rules" :model="form" :inline="true" :label-width="130" ref="formRef">
				<el-form-item label="货架位编号：" prop="preCode">

					<el-input v-model="form.preCode" style="width:85px" placeholder="前缀字母" :maxlength="10"></el-input>
					<span style="text-align: center;margin-left:2px;">
						<i class="el-icon-minus"></i>
					</span>
				</el-form-item>

				<el-form-item prop="row">
					<el-input v-model="form.row" :maxlength="1" style="width:74px;margin-left:1px" placeholder="行数字"></el-input>
					<span style="text-align: center;margin-left:2px;">
						<i class="el-icon-minus"></i>
					</span>
				</el-form-item>

				<el-form-item prop="col">
					<el-input v-model="form.col " :maxlength="1" style="width:74px;margin-left:1px" placeholder="列数字"></el-input>
				</el-form-item>
				<el-form-item label="所属货架：">
					<div>{{storageAreaShelfName}}</div>
				</el-form-item>
				<!-- SPU分配上限 -->
				<el-form-item label="SKU分配上限：" prop="spuLimit" v-if="binding=='1'">
					<el-input placeholder="仅支持正整数" :maxlength="3" v-model="form.spuLimit" style="width:269px"></el-input>
				</el-form-item>
				<!-- <el-form-item label="上架总数上限：" prop="quantityLimit">
					<el-input v-model="form.quantityLimit" :maxlength="4" style="width:269px"></el-input>
				</el-form-item> -->
			</el-form>
			<!-- 虚线 -->
			<div class="line"></div>
			<!-- 绑定商品品类和sku -->
			<div class="bindingClass">
				<div>绑定商品：</div>
				<el-radio-group @change="binDingSearch" v-model="binding">
					<el-radio label="1">绑定品类</el-radio>
					<!-- <el-radio label="2">绑定SKU</el-radio> -->
				</el-radio-group>
			</div>

			<!-- 选择的品类 -->
			<div class="catagoryClass" v-show="binding=='1'">
				<div class="treeClass">
					<el-checkbox v-model="catagoryChecked" class="checkbxClass" :indeterminate="isIndeterminate" label="全选" style="margin:16px 0 10px 24px" @change="checkedAll" v-if="catagoryData&&catagoryData.length"></el-checkbox>
					<el-tree ref="treeCategory" class="disable-item" show-checkbox :data="catagoryData" :expand-on-click-node="false" :default-checked-keys='checkedKeys' node-key="id" default-expand-all :props="{value:'id',children:'children',label:'name'}" @check-change="handleCategoryClick"></el-tree>
				</div>
			</div>
			<!-- sku选择 -->
		
		</div>
		<!-- 底部 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button  @click="closeShelfSpace">取 消</el-button>
				<el-button  type="primary" @click="submit">确 定</el-button>

			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { goodsBases } from '@/api/order/orderManagement.js'//sku接口
	import { assignTool } from 'tool'
	import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
	import { toTree, treeToArr } from '@/utils/tool.js'
	import { erpElTable } from "@/utils/hooks.js";
	import {
		selectCategory, //查询品类列表
	} from '@/api/goods/rules.js'
	import {
		editShelfSpaceEcho, //Z211.货架位编辑回显
		addShelfSpace,//Z203.新增/批量新增货架位
		editShelfSpace,//Z205.编辑货架位
	} from '@/api/store/warehouseSettings.js'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			rows: {
				type: Object,
				default: {}
			},
			typeJump: {
				type: String
			}
		},
		emits: ['closeShelfSpace'],
		setup(props, context) {
			const rows = props.rows
			const formRef = ref(null)
			const skuCopy = ref([])
			let checkedKeys = ref([])
			const rules = {
				preCode: [
					{ required: true, message: '前缀不能为空', trigger: 'blur' },
					{ pattern: /^[0-9A-Za-z]+$/, message: '前缀格式不正确', trigger: 'blur' }
				],
				row: [
					{ required: true, message: '行不能为空', trigger: 'blur' },
					{ pattern: /^[1-9]+$/, message: '行格式不正确', trigger: 'blur' }
				],
				col: [
					{ required: true, message: '列不能为空', trigger: 'blur' },
					{ pattern: /^[1-9]+$/, message: '列格式不正确', trigger: 'blur' }
				],
				spuLimit: [
					{ required: true, message: 'SPU分配上限不能为空', trigger: 'blur' },
					{ pattern: /^[1-9]\d{0,2}$/, message: 'SPU分配上限格式不正确', trigger: 'blur' }
				],
				// quantityLimit: [
				// 	{ required: true, message: '上架总数上限不能为空', trigger: 'blur' },
				// 	{ pattern: /^[1-9]\d{0,3}$/, message: '上架总数上限格式不正确', trigger: 'blur' }
				// ]
			}
			const selectCateList = ref([])//品类的选择后的存储数组
			const state = reactive({
				dialogShelfSpace: true,
				binding: '1',//绑定按钮
				catagoryChecked: false,//品类头部全选框
				form: {
					preCode: '',
					row: '',
					col: '',
					spuLimit: 15,
					quantityLimit: 9999,
				},
				storageAreaShelfName: '',//所属货架拼接
				catagoryData: [],//品类数据
				treeCategory: null,
				isIndeterminate: false,
				catagoryLength: 0,//品类数据的长度
				searchSku: '',
				catagoryEcho: [],//品类回显
				bindCateName: [],//品类或者sku的名字或者编码
				bindSkuName: [],//sku编码的存储
				checkCode: {},//最后提交比对的编码值
				paginationTotal: 0, //分页总数据条数
				paginationArr: [10, 20, 30, 50], //分页每页选择条数默认数据
				current: 1, //当前页码
				size: 10, //一页多少条
				skuList: [],
			})
			//弹框关闭事件
			function closeShelfSpace() {
				context.emit('closeShelfSpace', false)
			}
			//编辑页面的回显接口
			function echoList() {
				if (props.typeJump == 'edit') {//编辑页面
					editShelfSpaceEcho({ gridId: rows.id }).then(res => {
						state.checkCode = JSON.parse(JSON.stringify({ preCode: res.data.preCode, row: res.data.row, col: res.data.col }))
						state.form = assignTool(state.form, res.data, ['id'])
						state.form.spuLimit = res.data.spuLimit ? res.data.spuLimit : '',//如果回显时候后端给的spu为0处理成空不然校验有问题
							state.storageAreaShelfName = res.data.storageAreaShelfName//回显货架位名称
						if (res.data.categoryIds?.length) {//品类有值
							state.binding = '1'
							categoryPromise().then(_ => {
								state.catagoryEcho = res.data.categoryIds ? res.data.categoryIds.split(',').filter(item => item !== 'null') : ''
								nextTick(() => {
									state.treeCategory.setCheckedKeys(state.catagoryEcho)
								})
							})
                            search()
						} else if (res.data.goodsBaseVOList) {//sku有值
							state.binding = '2'
							if (res.data.goodsBaseVOList) {
								res.data.goodsBaseVOList.forEach(item => {
                                    if(item.skuValue){//如果规格值有值
                                      item.skuCn = JSON.parse(item.skuValue).map(v => v.speVal).join('-')  
                                    }else{
                                     item.skuCn=''
                                    }
								})
							} else {
								res.data.goodsBaseVOList = []
							}
							skuCopy.value = [...res.data.goodsBaseVOList]
							search()
                            categoryPromise()
						} else {//两者都没有
							categoryPromise()
                            search()
							skuCopy.value = []
							state.catagoryEcho = []
						}

					})
				} else {//新增界面
					categoryPromise()
                    search()
					state.storageAreaShelfName = '万众智谷仓库' + '-' + rows.areaName + '-' + rows.shelfName
					skuCopy.value = []
					state.catagoryEcho = []
				}
			}
			//回显接口
			echoList()

			function categoryPromise() {
				return new Promise((resolve, reject) => {
					selectCategory().then(res => {
						res.data = res.data.filter(item => item.status === 1)
						state.catagoryLength = res.data?.length
						state.catagoryData = toTree(res.data, 'id')
						resolve()
					}).catch(e => reject(e))
				})
			}
			//sku接口
			function search() {
				return new Promise((resolve, reject) => {
					goodsBases({ search: state.searchSku, skuTypeFlag: 3,combineType:1, page: { pageNo: state.current, pageSize: state.size } }).then(res => {
						res.data.dataList.forEach(v => {
							v.skuCn = JSON.parse(v.skuValue).map(item => item.speVal).join('-')
							v.selectSkuList = skuCopy.value.some(s => s.skuId === v.skuId)
						})
						state.skuList = res.data.dataList
						state.paginationTotal = res.data.page.totalCount
						resolve()
					}).catch(e => reject(e))
				})
			}

			function binDingSearch() {
				// if (state.binding === '2') {
                //     search()
                //     }
			}

			//品类框的选择
			function handleCategoryClick(data, checkd) {
				console.log(data, checkd);
				if (data.children.length > 0) return
				let checkeds = state.treeCategory.getCheckedNodes()
				checkeds = checkeds.map(item => item.id)
				state.catagoryChecked = state.catagoryLength == checkeds.length
				state.isIndeterminate = checkeds.length > 0 && checkeds.length < state.catagoryLength//全选时候checked框的状态控制
				if (checkd) {
					selectCateList.value.push(data.id)
					state.bindCateName.push(data.name)
				} else {
					selectCateList.value = selectCateList.value.filter(item => item != data.id)
					state.bindCateName = state.bindCateName.filter(item => item != data.name)//去重
				}
				console.log(selectCateList.value, state.bindCateName, 'selectList');

			}
			//品类的全选事件
			function checkedAll() {
				selectCateList.value = []
				let selectTrue = []
				if (state.catagoryChecked) {
					loop(state.catagoryData)
					function loop(data) {
						data.forEach(item => {
							selectTrue.push(item.id)
							if (item.children.length) {
								loop(item.children)
							}
						})
					}
					state.treeCategory.setCheckedKeys(selectTrue)
				} else {
					selectCateList.value = []
					state.treeCategory.setCheckedKeys([])
				}
				console.log(selectCateList.value);
			}
			//sku选择事件
			function selectList(item, id) {
                if(skuCopy.value.length>=999) return ElMessage.error('选择的SKU已达上限')
				item.selectSkuList = !item.selectSkuList
				if (item.selectSkuList) {
					skuCopy.value.push(item)
				} else {
					deleteGoods(id)
				}
			}
			//sku删除事件
			function deleteGoods(skuId) {
				skuCopy.value = skuCopy.value.filter(item => item.skuId != skuId)
				const item = state.skuList.find(e => e.skuId === skuId)
				if (item) item.selectSkuList = false
			}
			//确定事件
			function submit() {
				//判断下最后单选是的品类还是sku
                state.bindSkuName=[]
				if (state.binding == '1') {//选择的是品类
					if (!selectCateList.value.length) return ElMessage.error('请选择品类')
					state.bindSkuName = []
					skuCopy.value = []
				} else {//选择的是sku
					if (!skuCopy.value.length) return ElMessage.error('请选择商品')
					state.form.spuLimit = ''
					state.bindCateName = []//清空品类名称和保存数组
					selectCateList.value = []
					skuCopy.value.forEach(item => {
						state.bindSkuName.push(item.goodsSku)
					})
				}
                console.log(state.bindSkuName,'name');
				formRef.value.validate().then(() => {
					const obj = Object.assign({}, state.form)
					obj.warehouseId = rows.warehouseId //仓库id
					obj.areaId = rows.areaId //分区id
					obj.bindNames = state.bindSkuName.length ? state.bindSkuName.toString() : null
					obj.categoryIds = selectCateList.value.length ? selectCateList.value.join(',') : ''
					obj.skuIds = skuCopy.value.length ? skuCopy.value.map(v => v.skuId).join(',') : ''
					if (props.typeJump == 'add') {//新增货架位接口
						obj.shelfId = rows.id//货架id
						addShelfSpace({ gridDOList: [obj] }).then(res => {
							ElMessage.success('新增成功')
							context.emit('closeShelfSpace', true)
						})
					} else {//编辑货架位接口
						obj.id = rows.id//货架位id
						obj.shelfId = rows.shelfId//货架id
						let check = { preCode: obj.preCode, row: obj.row, col: obj.col }
						if (JSON.stringify(state.checkCode) == JSON.stringify(check)) {//后端需要编码没有改动的话传个null给他
							obj.preCode = null
							obj.row = null
							obj.col = null
						}
						editShelfSpace(obj).then(res => {
							ElMessage.success('修改成功')
							context.emit('closeShelfSpace', true)
						})
					}
				})

			}
			// 分页
			const handleSizeChange = val => {
				state.size = val
				search()
			}
			const handleCurrentChange = val => {
				state.current = val
				search()
			}
			return {
				...toRefs(state),
				closeShelfSpace,
				rules,
				formRef,
				handleCategoryClick,
				selectList,
				selectCateList,
				deleteGoods,
				checkedAll,
				rows,
				skuCopy,
				submit,
				checkedKeys,
				handleSizeChange,
				handleCurrentChange,
				search,
				binDingSearch
			}
		}
	}
</script>

<style lang="scss" scoped>
.headClass {
	:deep(.el-input__inner) {
		height: 32px;
		// padding: 11px;
	}
	:deep(.el-form-item) {
		margin-bottom: 15px;
	}
	:deep(.el-form-item__label) {
		padding: 0;
	}
	:deep(.el-form--inline .el-form-item) {
		margin-right: 1px;
	}
	.line {
		border: 1px dashed #e7e7e7;
		margin-top: 10px;
	}
	.bindingClass {
		padding: 16px 0 16px 10px;
		display: flex;
		align-items: center;
	}
	.catagoryClass {
		height: 278px;
		overflow: auto;
		padding-bottom: 24px;
		border: 1px solid #e7e7e7;
		.treeClass {
			padding: 0 24px 34px 24px;
		}
		.checkbxClass {
			:deep(.el-checkbox__label) {
				font-weight: 600;
			}
		}
	}
	.skuClass {
        display: flex;
        align-items: center;
		border: 1px solid #e8e8e8;
		border-bottom: 0;
		background: #fafafa;
        .searchFlex{
            height: 100%;
            display: flex;
            align-items: center;
        }
	}
	// sku选择
	.imgClass {
		height: 278px;
		padding: 8px 12px;
		padding-right: 24px;
		border: 1px solid #e8e8e8;
		overflow: auto;
		.imgContent {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80px;
		}
		p {
			margin: 0;
			padding-top: 3px;
			padding-left: 10px;
		}
		.skuFont {
			width: 240px;
			overflow: hidden;
			white-space: nowrap; //表示不换
			text-overflow: ellipsis; //加省略号;
		}
		.qualityImages {
			display: flex;
			align-items: center;
		}
	}
	.selectGoodClass {
		padding: 7px 12px;
		border: 1px solid #e8e8e8;
		border-bottom: 0;
		background: #fafafa;
		font-weight: 600;
	}
}
</style>