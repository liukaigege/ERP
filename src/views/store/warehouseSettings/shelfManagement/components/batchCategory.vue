<template>
	<el-dialog title="绑定品类" width="700px" v-model="dialogBatchCategory" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeBatchCategory">
		<div class="headBatchCategoryClass">
			<!-- 绑定商品品类和sku -->
			<div class="bindingClass">
				<div>绑定商品：</div>
				<el-radio-group v-model="binding">
					<el-radio label="1">绑定品类</el-radio>
				</el-radio-group>
				<el-radio-group style="margin-left:20px" v-model="buttonStatus">
					<el-radio-button label="0">新增</el-radio-button>
					<el-radio-button label="2">减少</el-radio-button>
					<el-radio-button label="1">变更</el-radio-button>
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
				<el-button @click="closeBatchCategory">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>

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
		batchUpdateCategory, //批量绑定品类
	} from '@/api/store/warehouseSettings.js'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			shelfSpaceData: {
				type: Array,
				default: []
			},
		},
		emits: ['closeBatchCategory'],
		setup(props, context) {
			const formRef = ref(null)
			let checkedKeys = ref([])
			const selectCateList = ref([])//品类的选择后的存储数组
			const state = reactive({
				dialogBatchCategory: true,
				binding: '1',//绑定按钮
				buttonStatus: '0',
				catagoryChecked: false,//品类头部全选框
				catagoryData: [],//品类数据
				treeCategory: null,
				isIndeterminate: false,
				catagoryLength: 0,//品类数据的长度
			})
			//弹框关闭事件
			function closeBatchCategory() {
				context.emit('closeBatchCategory', false)
			}
			//编辑页面的回显接口
			function echoList() {
				selectCategory().then(res => {
					res.data = res.data.filter(item => item.status === 1)
					state.catagoryLength = res.data?.length
					state.catagoryData = toTree(res.data, 'id')
				})

			}
			//回显接口
			onMounted(() => {
				echoList()
			})
			//品类框的单选
			function handleCategoryClick(data, checkd) {
				if (data.children.length > 0) return
				let checkeds = state.treeCategory.getCheckedNodes()
				checkeds = checkeds.map(item => item.id)
				state.catagoryChecked = state.catagoryLength == checkeds.length
				state.isIndeterminate = checkeds.length > 0 && checkeds.length < state.catagoryLength//全选时候checked框的状态控制
				if (checkd) {
					selectCateList.value.push(data.id)
				} else {
					selectCateList.value = selectCateList.value.filter(item => item != data.id)
				}
				console.log(selectCateList.value);

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
			//确定事件
			function submit() {
				console.log(1111);
				if (!selectCateList.value.length) return ElMessage.error('请选择品类')
				let params;
				params = {
					ids: props.shelfSpaceData.map(item => item.id),
					action: state.buttonStatus,
					categoryIds: selectCateList.value
				}
				batchUpdateCategory(params).then(res => {
					ElMessage.success('修改成功')
					setTimeout(() => {
						context.emit('closeBatchCategory', true)
					}, 500)

				})
			}
			return {
				...toRefs(state),
				closeBatchCategory,
				formRef,
				handleCategoryClick,
				selectCateList,
				checkedAll,
				submit,
				checkedKeys,
			}
		}
	}
</script>

<style lang="scss" scoped>
.headBatchCategoryClass {
	:deep(.el-input__inner) {
		height: 32px;
		// padding: 11px;
	}
	.bindingClass {
		padding: 16px 0 16px 10px;
		display: flex;
		align-items: center;
	}
	.catagoryClass {
		height: 300px;
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
}
</style>