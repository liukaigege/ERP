<template>
	<el-dialog title="批量修改标签" v-model="ifShow" :width="480" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <el-space alignment="start" wrap :size="16">
			  <el-check-tag @change="($event) => onChange($event, index, item.id)" :checked="item.value" v-for="(item, index) in labelList" :key="index" >{{item.name}}</el-check-tag>
      </el-space>
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
	import { onMounted, reactive, toRefs } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import Hooks from '@/views/goods/goodsManagement/js/hooks'
  import { batchLabel } from '@/api/goods/quotedPrice.js'
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
				labelList: [],
        form: {
          goodsIds: props.goodsIds,
          labelIds: []
        },
        loading: false
			})

      let hooks = Hooks(state)

      let onChange = (e, index, id) => {
        if (e && state.form.labelIds.length > 20) {
          ElMessage.error('最多选择20个标签！')
          return false;
        }
        if (e) {
          state.form.labelIds.push(id)
        } else {
          let ind = state.form.labelIds.indexOf(id)
          console.log(ind)
          if (ind !== -1) {
            state.form.labelIds.splice(ind, 1)
          }
        }
        state.labelList[index].value = e
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
      
      let setLabel = () => {
        state.loading = true
        batchLabel(state.form).then(res => {
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
      }

			// 确认回调
			let affirmEvent = () => {
        if (state.form.labelIds.length == 0) {
          ElMessageBox.confirm('标签未选择，是否清空勾选商品的所有标签？', '提示', {
					confirmButtonText: '是',
					cancelButtonText: '否',
					type: 'warning',
				})
					.then(() => {
            setLabel()
					})
					.catch(() => {
					})
        } else {
          setLabel()
        }
			}

      onMounted(() => {
        hooks.getLabelList()
      })

			return {
				...toRefs(state),
        onChange,
				closeEvent,
				cancelEvent,
				affirmEvent,
        ...hooks
			}
		}
	}
</script>

<style lang="scss" scoped>
  .contentView{
    height: 200px;
    overflow-y: auto;
  }
</style>