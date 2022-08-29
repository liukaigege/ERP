<template>
	<el-dialog title="批量修改维护人" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
			<el-form :model="form" :rules="rules" ref="formRef">
				<el-form-item label="维护人:" required>
					<el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 90%"></el-input>
				</el-form-item>
			</el-form>
			<div style="padding:0px 65px">
				<el-tree class="filter-tree disable-item" :data="maintainmanList" :expand-on-click-node="false" :props="defaultProps" default-expand-all :filter-node-method="filterNode" @node-click="nodeChange" ref="treeRef"></el-tree>
			</div>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent">取消</el-button>
				<el-button type="primary" @click="affirmEvent" :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { reactive, toRefs, ref, onMounted, watch } from 'vue'
	import { ElMessage, ElMessageBox } from 'element-plus'
	import { getMaintainman, batchEditMaintain } from '@/api/goods/quotedPrice'
	export default {
		props: {
			goodsIds: {
				type: Array,
				default: []
			}
		},
		emits: ['closeEvent'],
		setup(props, context) {
			let state = reactive({
				ifShow: true,
				maintainmanList: [],
				filterText: '',
				defaultProps: {
					value: 'deptId',
					children: 'children',
					label: 'deptName',
					disabled: 'disabled'
				},
				form: {
					goodsIds: props.goodsIds,
					userId: ''
				},
				loading: false
			})
			let rules = {
				userId: { required: true, message: '请选择维护人', trigger: 'blur' }
			}
			let formRef = ref(null)
			let treeRef = ref(null)

			watch(() => state.filterText, (newVal) => {
				treeRef.value.filter(newVal)
			})

			let filterNode = (value, data) => {
				if (!value) return true
				return data.deptName.indexOf(value) !== -1
			}

			// 关闭弹框
			let closeEvent = (refresh = false) => {
				state.ifShow = false
				setTimeout(() => {
					context.emit('closeEvent', refresh)
				}, 500)
			}

			// 取消回调
			let cancelEvent = () => {
				closeEvent()
			}

			let nodeChange = (e) => {
				console.log(e)
				state.form.userId = e.deptId
			}

			// 确认回调
			let affirmEvent = () => {
				ElMessageBox.confirm('修改商品维护人将会影响部分人员对该商品的查看权限，你还要继续吗？', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						if (!state.form.userId) {
							ElMessage.error('请选择维护人')
							return false;
						}
						state.loading = true
						batchEditMaintain(state.form).then(res => {
							state.loading = false
							if (res.code == 200) {
								ElMessage.success({ message: '操作成功！', type: 'success' });
								closeEvent(true)
							} else {
								ElMessage.error(res.message)
							}
						}).catch(err => {
							state.loading = false

						})
					})
					.catch(() => {
					})
			}

			let loop = (data) => {
				data.forEach(item => {
					if (item.children?.length) loop(item.children)
					let arr = []
					if (item.userVos?.length) {
						item.userVos.forEach(val => {
							arr.push({ deptId: val.userId, deptName: val.fullName })
						})
					}
					item.disabled = true
					item.children = arr.concat(item.children)
				})
			}

			// 获取维护人列表
			let getMaintainmanList = () => {
				getMaintainman().then(res => {
					if (res.code == 200) {
						loop(res.data)
						console.log(res.data)
						// setTimeout(() => {
						//   console.log(res.data)
						//   state.maintainmanList = res.data
						// }, 2000)
						state.maintainmanList = res.data
					} else {
						ElMessage.error(res.message)
					}
				})
			}

			onMounted(() => {
				getMaintainmanList()
			})

			return {
				...toRefs(state),
				rules,
				formRef,
				treeRef,
				filterNode,
				closeEvent,
				cancelEvent,
				affirmEvent,
				nodeChange
			}
		}
	}
</script>

<style lang="scss" scoped>
.el-icon-warning {
	font-size: 14px;
	color: #faad14;
	margin-right: 8px;
}
.text {
	font-size: 14px;
	color: rgba(0, 0, 0, 0.85);
}
.contentView {
	height: 300px;
	overflow-y: scroll;
}
</style>

<style scoped>
.disable-item >>> [aria-disabled='true'] > .el-tree-node__content {
	cursor: not-allowed;
	background: #fff !important;
}
</style>
