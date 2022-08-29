<template>
	<el-dialog :title="batchType==='single'?'绑定商品':'批量绑定商品'" width="850px" v-model="dialogShelf" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeShelf">
		<div class="headClass">
			<div style="padding:0 0 0 10px">
				<span>绑定商品：</span>
				<el-radio v-model="rows.type" label="1">绑定品类</el-radio>
				<!-- <el-radio v-model="rows.type" label="2">绑定SKU</el-radio> -->
			</div>
			<div class="radioClass" v-if="rows.type=='1'">
				<el-form :model="form" :rules="rules" ref="formRef">
					<el-form-item prop="spu" label="SKU分配上限:">
						<el-input placeholder="仅支持正整数"  v-model="form.spu" :maxlength="3" style="width:245px"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<!-- 选择的品类 -->
			<div class="catagoryClass" v-show="rows.type=='1'">
				<div class="treeClass">
					<el-checkbox v-model="catagoryChecked" :indeterminate="isIndeterminate" class="checkbxClass" label="全选" style="margin:16px 0 10px 24px" @change="checkedAll" v-if="catagoryData&&catagoryData.length"></el-checkbox>
					<el-tree ref="treeCategory" node-key="id" class="disable-item" show-checkbox :data="catagoryData" :expand-on-click-node="false" default-expand-all :props="{value:'id',children:'children',label:'name'}" @check-change="handleCategoryClick"></el-tree>
				</div>
			</div>
	
		</div>

		<!-- 底部 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeShelf">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { toTree, deepCopy, treeToArr } from '@/utils/tool.js'
	import { goodsBases } from '@/api/order/orderManagement.js'
	import { erpElTable } from "@/utils/hooks.js";
	import {
		selectCategory, //查询品类列表
	} from '@/api/goods/rules.js'
	import { reactive, toRefs, ref, onMounted, nextTick } from 'vue'
	import { ElMessage } from 'element-plus';
	export default {
		props: {
			rows: {
				type: Object,
				default: {}
			},
			batchType: {
				type: String
			}
		},
		emits: ['closeShelf', 'binDingList'],
		setup(props, context) {
			const rules = {
				spu: [
					{ required: true, message: 'SPU分配上限不能为空', trigger: 'blur' },
					{ pattern: /^[1-9]\d{0,2}$/, message: 'SPU分配上限格式不正确', trigger: 'blur' }
				]
			}
			const batchType = props.batchType
			const rows = props.rows //父页面传过来的数据
			let skuCopy = ref([...props.rows.sku])
			const treeCategory = ref(null)
			const selectList = ref([])//保存品类的选择后的数据
			const state = reactive({
				dialogShelf: true,
				// binding: '1',//选择品类或者sku切换
				catagoryChecked: false,//品类全选的框
				formRef: null,
				catagoryLength: 0,
				form: { //spu值
					spu: 15
				},
				skuSearch: {
					search: '',
					combineType: 1,
					skuTypeFlag: 3
				},//sku头部搜索
				catagoryData: [], //品类选择框数据
				isIndeterminate: false,
				skuData: [], //sku的数组List
			})
			//品类的接口
			selectCategory().then(res => {
				res.data = res.data.filter(item => item.status === 1)
				state.catagoryLength = res.data?.length
				state.catagoryData = toTree(res.data, 'id')
				let id = []
				id = rows.catagory.map(item => item.id)
				nextTick(_ => {
					treeCategory.value.setCheckedKeys(id)
				})
			})
			//sku接口
			const erpTableOpt = erpElTable(goodsBases, state.skuSearch, {
				dataFilter: data => {
					data.map(val => {
						val.skuCn = JSON.parse(val.skuValue).map(item => item.speVal).join('-')
						val.selectSkuList = skuCopy.value.findIndex(s => s.skuId === val.skuId) !== -1
					})
					return data
				},
				pagination: {
					pageSizes: [10, 20, 30, 50, 100]
				}
			})
			onMounted(() => {
				// init()

				if (batchType == 'single') {
					if (rows.type == '1') {
						state.form.spu = rows.spuLimit
					}
				}
				console.log(rows, '初始进入页面');
			})
			//品类的接口

			//关闭弹框
			function closeShelf() {
				context.emit('closeShelf', false)
			}
			//品类框的选择
			function handleCategoryClick(data, checkd) {
				if (data.children.length > 0) return
				let checkeds = treeCategory.value.getCheckedNodes()
				checkeds = checkeds.map(item => item.id)
				state.catagoryChecked = state.catagoryLength == checkeds.length
				state.isIndeterminate = checkeds.length > 0 && checkeds.length < state.catagoryLength//全选时候checked框的状态控制
				if (checkd) {
					selectList.value.push({ id: data.id, name: data.name })
				} else {
					selectList.value = selectList.value.filter(item => item.id != data.id)
				}
				console.log('selet', selectList.value);
			}
			//sku选择事件
			function selectSkuClick(item, id) {
				if (skuCopy.value.length >= 999) return ElMessage.error('选择的SKU已达上限')
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
				const item = erpTableOpt.tableData.value.find(e => e.skuId === skuId)
				if (item) item.selectSkuList = false
			}
			//品类头部全选的chekbox框
			function checkedAll() {
				selectList.value = []
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
					treeCategory.value.setCheckedKeys(selectTrue)
				} else {
					selectList.value = []
					treeCategory.value.setCheckedKeys([])
				}
			}
			//确定事件
			function submit() {
				if (rows.type == '1') {//品类
					state.formRef.validate().then(() => {
						if (!selectList.value.length) return ElMessage.error('请选择品类')
						context.emit('binDingList', selectList.value, [], state.form.spu, rows.type)
						context.emit('closeShelf')
					})
				} else {//sku
					if (!skuCopy.value.length) return ElMessage.error('请选择商品')
					context.emit('binDingList', [], skuCopy.value, '', rows.type)
					context.emit('closeShelf')
				}

			}
			return {
				...toRefs(state),
				...erpTableOpt,
				closeShelf,
				treeCategory,
				rules,
				handleCategoryClick,
				selectSkuClick,
				deleteGoods,
				checkedAll,
				submit,
				selectList,
				rows,
				batchType,
				skuCopy
			}
		}

	}
</script>

<style lang="scss" scoped>
.headClass {
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
		.searchFlex {
			height: 100%;
			display: flex;
			align-items: center;
		}
	}
	// sku选择
	.imgClass {
		height: 278px;
		padding: 8px 12px;
		padding-right: 10px;
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