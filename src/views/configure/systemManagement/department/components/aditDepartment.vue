<template>
	<el-dialog :title="routerType == 1 ? '编辑部门' : '新增部门'" width="580px" v-model="centerDialogVisible" :close-on-click-modal="false" :before-close="close">
		<el-form :model="form" :ref="formRef" label-width="100px" :rules="rules">
			<!-- 菜单标题 -->
			<el-form-item label="名称:" prop="deptName">
				<el-input v-model="form.deptName" style="width: 430px" placeholder="请输入名称" />
			</el-form-item>

			<el-form-item label="状态:" prop="status">
				<el-radio v-model="form.status" label="0">启用</el-radio>
				<el-radio v-model="form.status" label="1" :disabled="showInput">停用</el-radio>
			</el-form-item>
			<!-- 部门负责人 -->
			<el-form-item label="部门负责人:" prop="managerBy" v-show="routerType == '1'">
				<elSelectTree @ok="getUser" :multiple="false" :data="userDate" isDisableItem :width="410" :slPlaceholder="slPlaceholderUser" :defaultExpandAll="true" :treeProps="{
            value: 'userId',
            label: 'fullName',
            children: 'children'
          }" :defaultCheckedKeys="defaultCheckedUser" :checkStrictly="true" />
			</el-form-item>
			<!-- <el-form-item v-if="routerType=='2'">
                <div style="width:88px;text-align:right;display:inline-block;">
                    <span style="color:#f56c6c;">*</span>
                <span style="color:#606266">部门负责人:</span>
                </div>
                <el-input style="width:430px;margin-left:12px;display:inline-block;" :disabled="true" />
            </el-form-item> -->

			<!-- 上级类目 -->
			<el-form-item label="上级部门:" prop="parentId">
				<elSelectTree @ok="getValue" :multiple="false" :data="dataList" :width="408" :slDisabled="slDisabled" :slPlaceholder="slPlaceholder" :defaultExpandAll="true" :treeProps="{
            value: 'deptId',
            label: 'deptName',
            children: 'children'
          }" :defaultCheckedKeys="defaultCheckedKeys" :checkStrictly="true" />
			</el-form-item>
			<!-- <el-form-item v-else label="">
                <div style="width:88px;text-align:right;display:inline-block;">
                  <span style="color:#f56c6c;">*</span>
                <span style="color:#606266">上级部门:</span>  
                </div>
                <el-input v-model="parentName" style="width:435px;margin-left:12px" :disabled="true" />
            </el-form-item> -->
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="submitForm">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { ElMessage } from 'element-plus'
	import { reactive, toRefs, ref, toRaw } from 'vue'
	import elSelectTree from '@/components/elSelectTree/index.vue'
	import {
		addDepartment, //新增部门
		getDepartmentList, //查询部门列表(tree)
		getDepartment, //查询部门列表
		updataDepartment, //编辑部门信息
		getManagerBy, //新增部门负责人接口

	} from '@/api/user.js'
	import { nextTick, onMounted } from 'vue'
	export default {
		components: { elSelectTree },
		props: {
			routerType: {
				type: Number,
				default: 1
			},
			row: {
				type: Object,
				default: {}
			},
			editStatus: {
				type: String,
				default: String
			}

		},
		emits: ['close'],
		setup(props, { attrs, emit }) {
			console.log(props)
			const routerType = props.routerType
			const editStatus = props.editStatus
			const row = props.row
			console.log(row, 888)
			const state = reactive({
				parentName: '', //修改时候的上级部门名称
				slDisabled: false,
				showInput: false,
				slPlaceholder: '请选择上级部门',
				slPlaceholderUser: '请选择部门负责人',
				//回显部门
				defaultCheckedKeys: [],
				//员工回显
				defaultCheckedUser: [],
				//表单验证
				rules: {
					deptName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' },
						{ max: 16, message: '长度16个字符', trigger: 'blur' }
					],
					parentId: [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
					managerBy: [{ required: routerType === 1, message: '请选择部门负责人', trigger: 'blur' }]

				},

				menus: [],
				centerDialogVisible: true, //控制弹框的显示和隐藏
				dataList: [],
				userDate: [], //员工的列表
				form: {
					deptName: '',
					status: '1',
					parentId: '',
					managerBy: ''
				},
				dataForm: {

				}
			})
			//初始进入编辑页面回显
			const init = () => {
				getDepartment().then(res => {
					state.dataList = res.data
					state.dataList = looplist(state.dataList)
					if (routerType == '1') { //编辑时候
						// state.slDisabled = true
						state.form.deptName = row.deptName ? row.deptName : ''
						//保存一份数据用于提交校验
						state.dataForm.deptName = row.deptName
						state.dataForm.managerBy = row.managerBy
						if (row.children && row.children.length || editStatus == '2') {
							state.showInput = true
						}
						if (row.status) {
							state.form.status = '0'
							state.dataForm.status = '0'
						} else {
							state.form.status = '1'
							state.dataForm.status = '1'

						}
						// nextTick(() => {
						// 	console.log('222')
						// })
            console.log(row,'row');
            state.defaultCheckedKeys = row.parentId?[row.parentId]:[]
            state.form.parentId = state.defaultCheckedKeys.length ? state.defaultCheckedKeys[0]:state.form.parentId
						// state.parentName = row.parentName

					} else {
						//新增时候
						state.defaultCheckedKeys = state.dataList.length === 1 ? [state.dataList[0].deptId] : []
						state.form.parentId = state.defaultCheckedKeys.length ? state.defaultCheckedKeys[0] : state.form.parentId
						// console.log('defaultCheckedKeys========', state.defaultCheckedKeys)
						// console.log('state.dataList==========', state.dataList)
					}
				})
				//新增部门负责人的功能
				if (routerType == '1') {
					getManagerBy({ deptId: row.deptId }).then(res => {
						state.userDate = res.data
						state.form.managerBy = row.managerBy ? row.managerBy : state.form.managerBy
						state.defaultCheckedUser = row.managerBy ? [row.managerBy] : []
					})
				}

			}
			onMounted(() => {
				init()
			})
			//查询部门信息列表(tree)
			const looplist = data => {
				data = data.filter(item => item.status == '0')
				data.forEach(item => {
					if (item.children && item.children.length) {
						item.children = looplist(item.children)
					}
				})
				return data
			}

			//关闭弹框事件
			const close = () => {
				emit('close', false)
			}
			//选择菜单类目
			const getValue = e => {
				console.log(e)
				state.form.parentId = e
			}
			//部门负责人选择
			function getUser(e) {
				console.log(e);
				state.form.managerBy = e
			}
			//提交时候
			let formR = ''
			const formRef = el => {
				formR = el
			}
			const submitForm = () => {
				formR
					.validate()
					.then(() => {
						let { deptName, status, parentId, managerBy } = state.form,
							params = { deptName, status, parentId, managerBy };
						if (routerType == '2') {
							//新增时候
							params.managerBy = null
							addDepartment(params).then(res => {
								emit('close', true)
								ElMessage.success('新增成功')
							})
						} else {
							//修改时候

							if (JSON.stringify(state.form) == JSON.stringify(state.dataForm)) {
								console.log(11111)
								emit('close', false)
							} else {
								// params.parentId = row.parentId
								params.deptId = row.deptId
								updataDepartment(params).then(res => {
									emit('close', true)
									ElMessage.success('修改成功')
								})
							}
						}
						// console.log('校验成功')
					})
					.catch((errors) => {
						console.log('校验失败', errors)
					})
			}

			return {
				...toRefs(state),
				routerType,
				row,
				close,
				submitForm,
				formRef,
				getValue,
				init,
				getUser

			}
		}
	}
</script>

<style lang="scss" scoped>
// .submit {
//   display: flex;
//   justify-content: flex-end;
// }
::v-deep(.el-form-item__content) {
	margin-left: 0 !important;
}
</style>
