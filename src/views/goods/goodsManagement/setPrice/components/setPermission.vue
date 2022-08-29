<template>
	<el-dialog title="设置权限" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
			<el-form  :model="form" :rules="rules" ref="formRef">
				<el-form-item label="查看范围:" prop="authType">
					<el-select v-model="form.authType" @change="changeEvent">
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in permissionList" :key="index"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" v-debounce="affirmEvent"  :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { reactive, ref, toRefs } from 'vue'
	import { ElMessageBox, ElMessage } from 'element-plus';
  import { setPermission } from '@/api/goods/quotedPrice.js'
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
        permissionList: [
          {
            value: 2,
            label: '所有人'
          },
          {
            value: 1,
            label: '仅部门可见'
          },
          {
            value: 3,
            label: '部门及以下'
          },
          {
            value: 0,
            label: '仅本人可见'
          }
        ],
        form: {
					authType: null,
					goodsIds: props.goodsIds
				},
        loading: false
			})

			let rules = {
				authType: { required: true, message: '请选择查看范围', trigger: 'blur' },
			}
			let formRef = ref(null)

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

      // 确认回调
			let affirmEvent = () => {
				ElMessageBox.confirm('修改商品查看范围将会影响部分人员对该商品的查看权限，你还要继续吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
						formRef.value.validate((valid) => {
							if (valid) {
                state.loading = true
                setPermission(state.form).then(res => {
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
              } else {
                ElMessage.error('信息填写错误，提交失败')
              }
						})
            // closeEvent()
          })

			}

			let changeEvent = () => {
				formRef.value.clearValidate('permission')
			}

			return {
				...toRefs(state),
				rules,
				formRef,
				closeEvent,
				cancelEvent,
				affirmEvent,
				changeEvent
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
