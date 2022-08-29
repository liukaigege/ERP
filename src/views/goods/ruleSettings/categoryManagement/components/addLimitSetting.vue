<template>
	<div class="headLimitSetting">
		<el-dialog title="权限设置" v-model="dialogLimit" width="480px" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeDialog">
			<div class="limitContent">
				<el-input placeholder="请输入部门名称" v-model="keywordDepartment" style="width:380px" />
				<el-button type="primary" @click="search">搜索</el-button>
			</div>
			<div class="treeDeptClass">
				<div class="checkBoxClass" v-if="dataDepartment&&dataDepartment.length">
					<el-checkbox v-model="checked" :indeterminate="isIndeterminate" label="部门名称" @change="checkedAll" />
				</div>
				<div class="treeContent">
					<el-tree show-checkbox :data="dataDepartment" :node-key="defaultProps.value" check-on-click-node :props="defaultProps" default-expand-all check-strictly @check-change="handleDepartmentClick" ref="treeDepartment" />
				</div>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="closeDialog">取 消</el-button>
					<el-button type="primary" @click="submitForm">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
	import { toTree, treeToArr } from '@/utils/tool.js'
	import {
		categoryConfig, //品类设置（采购报价设置/物流报价设置/权限设置)
	} from '@/api/goods/rules.js'
	import {
		getDepartment, //查询部门信息列表
	} from '@/api/user.js'
	import { nextTick, onMounted, reactive, toRefs } from 'vue'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			settingRows: {
				type: Object,
				default: {}
			}
		},
		emits: ['closeLimit'],
		setup(props, context) {
			const state = reactive({
				dialogLimit: true,
				keywordDepartment: '',
				treeLength: 0,
				dataDepartment: [], //部门数据
				checked: false,
				isIndeterminate: false,//f复选框的状态
				defaultProps: { //部门
					value: 'deptId', // ID字段名
					children: 'children',
					label: 'deptName',
				},
				departmentId: [],
				treeDepartment: null,
			})
			//部门的接口
			function initDepartment(val) {
				getDepartment({ keyword: state.keywordDepartment }).then(res => {
					state.treeLength = [...treeToArr(res.data, 'children', true)].length
					state.dataDepartment = res.data
          loopDept(state.dataDepartment)
          function loopDept(data){
          data = data.filter(item => item.status ==='0')
           data.forEach(v=>{
             if(v.children&&v.children.length){
              v.children = loopDept(v.children)
             }
           })
           return data
          }
					//回显
					if (val) {
						nextTick(() => {
							state.treeDepartment.setCheckedKeys(props.settingRows.goodsDeptIdList)
						})
					}
				})
			}
			onMounted(() => {
				initDepartment(true)
			})
			//全选checkbox框
			function checkedAll() {
				state.departmentId = []
				if (state.checked) {
					loop(state.dataDepartment)
					function loop(data) {
						data.forEach(item => {
							state.departmentId.push(item.deptId)
							if (item.children && item.children.length) {
								loop(item.children)
							}
						})
					}
					state.treeDepartment.setCheckedKeys(state.departmentId)
				} else {
					state.departmentId = []
					state.treeDepartment.setCheckedKeys([])
				}
			}
			//部门的选择事件
			function handleDepartmentClick(data, checkd) {
				let checkeds = state.treeDepartment.getCheckedNodes()
				checkeds = checkeds.map(item => item.deptId)
				state.checked = state.treeLength == checkeds.length
				state.isIndeterminate = checkeds.length > 0 && checkeds.length < state.treeLength
				if (checkd) {
					state.departmentId.push(data.deptId)
				} else {
					state.departmentId = state.departmentId.filter(item => item != data.deptId)
				}
				// console.log(state.departmentId);
			}
			//搜索
			function search() {
				initDepartment()
				state.treeDepartment.setCheckedKeys(state.departmentId)
			}
			//弹框确定事件
			function submitForm() {
				//调接口
				if (!state.departmentId.length) {
					ElMessage.error('请勾选数据')
				} else {
					let limit = {
						type: 3,
						rightType: 1,
						idList: [props.settingRows.id],
						operateType: 'UPDATE',
						rightIdList: state.departmentId
					}
					categoryConfig({ configList: [limit] }).then(res => {
						ElMessage.success('提交成功')
						context.emit('closeLimit', true)

					})
				}
			}
			//关闭
			function closeDialog() {
				state.dialogLimit = false
				context.emit('closeLimit', false)
			}
			return {
				...toRefs(state),
				closeDialog,//关闭
				checkedAll,
				handleDepartmentClick,
				submitForm,
				search
			}
		}
	}
</script>

<style scoped lang="scss">
.headLimitSetting {
	.limitContent {
		display: flex;
		justify-content: space-between;
	}
	.treeDeptClass {
		height: 350px;
		overflow: auto;
		padding-bottom: 46px;
		.checkBoxClass {
			margin: 16px 0 14px 24px;
		}
	}
}
</style>