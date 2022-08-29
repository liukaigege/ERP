<template>
	<div class="headLimitSetting">
		<el-dialog title="批量修改权限设置" v-model="dialogBatchLimit" width="480px" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeDialog">
			<div class="buttonGroup">
               <el-radio-group v-model="buttonState" >
                   <el-radio-button label="ADD">新增</el-radio-button>
                   <el-radio-button label="DELETE">减少</el-radio-button>
                   <el-radio-button label="UPDATE">变更</el-radio-button>
               </el-radio-group>
            </div>
            <div class="limitContent">
				<el-input placeholder="请输入部门名称" v-model="keywordDepartment" style="width:380px"  />
				<el-button type="primary"  @click="search">搜索</el-button>
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
					<el-button  @click="closeDialog">取 消</el-button>
					<el-button  type="primary" @click="submitForm">确定</el-button>
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
	import { onMounted, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
	export default {
		props: {
            selectId:{
               type:Array,
               default:[]
           }
		},
        emits:['closeBatchLimit'],
		setup(props, context) {
			const state = reactive({
				dialogBatchLimit: true,
                buttonState:'ADD',
                keywordDepartment:'',
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
			function initDepartment() {
				getDepartment({ keyword: state.keywordDepartment }).then(res => {
					state.treeLength = [...treeToArr(res.data, 'children', true)].length
					state.dataDepartment = res.data
				})
			}
			onMounted(() => {
				initDepartment()
                console.log(props.selectId,'id');
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
            function handleDepartmentClick(data,checkd) {
                 let checkeds = state.treeDepartment.getCheckedNodes() 
                 checkeds = checkeds.map(item => item.deptId)
                 state.checked = state.treeLength == checkeds.length
                 state.isIndeterminate = checkeds.length>0 && checkeds.length < state.treeLength
                 if(checkd){
                     state.departmentId.push(data.deptId)
                 }else{
                   state.departmentId = state.departmentId.filter(item => item !=data.deptId)  
                 }
            }
            //搜索
            function search(){
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
						idList: props.selectId,
						operateType: state.buttonState,
						rightIdList: state.departmentId
					}
					categoryConfig({ configList: [limit] }).then(res => {
						ElMessage.success('提交成功')
						context.emit('closeBatchLimit', true)
					})
				}
            }
			//关闭
			function closeDialog() {
				state.dialogBatchLimit = false
                context.emit('closeBatchLimit',false)
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
    .buttonGroup{
        padding: 10px 0;
    }
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