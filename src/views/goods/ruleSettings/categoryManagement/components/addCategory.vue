<template>
	<div class="headAuthorOne">
		<el-dialog :title="rows.edit===1?'编辑品类':'新增品类'" v-model="dialogSource" width="480px" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeDialog">
			<div>
				<el-form :rules="rules"  :model="form" ref="formRef">
					<el-form-item label="品类名称：" prop="name">
						<el-input style="width:320px" v-model="form.name" placeholder="请输入品类名称" />
					</el-form-item>
					<el-form-item label="品类编码：" prop="code">
						<el-input style="width:320px" v-model="form.code" placeholder="请输入品类编码" />
					</el-form-item>
					<!-- 上级品类 -->
					<el-form-item label="上级品类：" prop="parentId" label-width="100" v-if="typeEdit!=='edit'">
						<elSelectTree @ok="getValue" :multiple="false" :data="dataList" :width="298" :slDisabled="slDisabled" :slPlaceholder="slPlaceholder" :defaultExpandAll="true" :treeProps="{
                           value: 'id',
                           label: 'name',
                           children: 'children'
                            }" :defaultCheckedKeys="defaultCheckedKeys" :checkStrictly="true" />
					</el-form-item>
					<el-form-item label-width="120" v-else>
						<span style="color:#f56c6c;">*</span>
						<span style="color:#606266;">上级品类 ：</span>
						<el-input v-model="parentName" style="width:320px;margin-left:12px" :disabled="true" />
					</el-form-item>
				</el-form>

			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button  @click="closeDialog">取 消</el-button>
					<el-button  type="primary" @click="submitForm">确 定</el-button>

				</span>
			</template>
		</el-dialog>

	</div>
</template>

<script>
	import { reactive, toRefs, onMounted, nextTick } from 'vue'
	import elSelectTree from '@/components/elSelectTree/index.vue'
	import { toTree } from '@/utils/tool.js'
	import { ElMessage } from 'element-plus'
	import {
		selectCategory, //查询品类列表
		updateCategoryList //新增修改品类
	} from '@/api/goods/rules.js'
	export default {
		components: {
			elSelectTree
		},
		props: {
			rows: {
				type: Object,
				default: {}
			},
			typeLevel: {
				type: String
			},
			typeEdit: {
				type: String
			}
		},
		emits: ['closeDialog', 'updataList'],
		setup(props, context) {
			//表单的验证
			const rules = {
				name: [
					{ required: true, message: '请输入品类名称', trigger: 'blur' },
					{ max: 10, message: '长度10个字符', trigger: 'blur' }
				],
				code: [
					{ required: true, message: '请输入品类编码', trigger: 'blur' },
					{ max: 5, message: '长度5个字符', trigger: 'blur' },
					{ pattern: /^[0-9A-Za-z]+$/, message: '品类编码格式不正确', trigger: 'blur' }
				],
				parentId: [
					{ required: true, message: '请输入上级品类', trigger: 'blur' },
				]

			}
			const rows = props.rows
			const typeLevel = props.typeLevel
			const typeEdit = props.typeEdit
			const state = reactive({
				formRef: null,
				dialogSource: true,
				slDisabled: false,
				slPlaceholder: '请选择上级品类',
				//回显品类
				defaultCheckedKeys: [],
				parentName: '无',
				form: {
					id: '',
					name: '',
					code: '',
					parentId: '',
					levelNum: ''
				},
				//下拉品类数据
				dataList: [],
				levelNums: {}, //判断品类等级递归时候保存的数据
				result: null,//递归完的结果存起来
			})
			//1.关闭事件
			function closeDialog() {
				state.dialogSource = false
				context.emit('closeDialog')
			}
			//1.2 页面的回显事件
			function init() {
				//调接口
				console.log(typeLevel, rows.levelNum, 'typeLevel');
				selectCategory({ level: typeLevel }).then(res => {
					res.data = res.data.filter(item => item.status === 1)
					state.dataList = toTree(res.data, 'id')
					state.dataList.unshift({ id: 0, name: '无', levelNum: 0 })
					//递归找名称加上回显(编辑时候)
					if (typeEdit == 'edit') {
						state.form.name = rows.name //名称
						state.form.code = rows.code //编码
						loop(state.dataList)
						function loop(data) {
							for (let i = 0; i < data.length; i++) {
								if (data[i].id == rows.parentId) {
									return state.parentName = data[i].name
								}
								if (data[i].children && data[i].children.length) {
									loop(data[i].children)
								}
							}
						}
					} else if (typeEdit == '1' || typeEdit == '2') { //添加二级还有三级时候回显上级品类
						state.defaultCheckedKeys = [rows.id]
						state.form.parentId = rows.id
						nextTick(() => {
							state.defaultCheckedKeys = [rows.id]
						})

					} else {
						state.form.name = ''
						state.form.code = ''
						state.defaultCheckedKeys = []
					}
				})

			}
			onMounted(() => {
				init()
			})
			//2.弹框确定事件
			function submitForm() {
				state.formRef.validate().then(() => {
					if (rows.edit === 1) {
						state.form.levelNum = rows.levelNum
					} else if (rows.levelNum === 1) {//如果没有选值而是默认回显的情况就传固定的值
						state.form.levelNum = state.result ? state.result : 2
					} else if (rows.levelNum === 2) {
						state.form.levelNum = state.result ? state.result : 3
					} else {
						state.form.levelNum = state.result
					}
					//封装参数
					let params = {
						id: rows.edit === 1 ? rows.id : null,
						name: state.form.name,
						code: state.form.code,
						parentId: state.form.parentId,
						levelNum: state.form.levelNum

					}
					updateCategoryList(params).then(res => {
						context.emit('updataList', {
              id:  state.form.parentId || props.rows.parentId,
              code: state.form.code,
              type: props.typeEdit
            })
					})
				
				})
			}
			//3.点击上级品类事件
			function getValue(e) {
				state.form.parentId = e
				//递归
				loop(state.dataList)
				function loop(data) {
					data.forEach((item) => {
						if (item.id == e) {
							state.levelNums = item
						}
						if (item.children) {
							loop(item.children)
						}
					});
					return state.levelNums
				}
				if (state.levelNums.levelNum == 1) {
					state.result = 2
				} else if (state.levelNums.levelNum == 2) {
					state.result = 3
				} else if (state.levelNums.levelNum == 0) {
					state.result = 1
				}
			}
			//处理等级的方法

			return {
				...toRefs(state),
				rows,
				typeLevel,
				rules,
				typeEdit,
				closeDialog, //关闭
				submitForm, //确定
				getValue, //上级品类
			}
		}
	}
</script>

<style lang="scss" scoped>
	.headAuthorOne {
		:deep(.el-dialog__title) {
			font-weight: 500;
		}
	}
</style>
