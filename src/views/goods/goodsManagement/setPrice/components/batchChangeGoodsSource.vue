<template>
	<el-dialog title="批量修改货源渠道" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <el-form  :model="form" :rules="rules" ref="formRef">
				<el-form-item label="货源渠道:" prop="channelId">
					<el-select v-model="form.channelId" placeholder="请选择货源渠道" @change="changeEvent">
						<el-option :label="item.name" :value="item.id" v-for="(item, index) in goodsSource" :key="index"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { reactive, toRefs, onUnmounted, ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
	import { batchEditChannel, channelPage } from '@/api/goods/quotedPrice.js'
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
        goodsSource: [],
        form: {
          channelId: null,
					goodsIds: props.goodsIds
        },
        loading: false
			})
      let rules = {
				channelId: { required: true, message: '请选择货源渠道', trigger: 'blur' }
			}
			let formRef = ref(null)

      let getchannelList = () => {
        let params = {
          page: {
            pageNo: 1,
            pageSize: 500
          }
        }
        channelPage(params).then(res => {
          if (res.code == 200) {
            state.goodsSource = res.data.dataList
          } else {
            ElMessage.error(res.message)
          }
        })
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

      let changeEvent = () => {
        formRef.value.clearValidate()
      }

      // 确认回调
			let affirmEvent = () => {
        formRef.value.validate((valid) => {
          if (valid) {
            state.loading = true
            batchEditChannel(state.form).then(res => {
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
			}

      onMounted(() => {
        getchannelList()
      })

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