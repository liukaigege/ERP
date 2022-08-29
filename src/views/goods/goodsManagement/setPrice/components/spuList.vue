<template>
	<el-dialog title="SPU历史记录" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <el-table :data="spuList" style="width: 100%" height="300" v-loading="loading" border :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
        <el-table-column label="商品SPU" width="217">
          <template #default="{ row }">
            <div class="textOverflow" :title="row.spu">{{ row.spu }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="更新时间" width="190"> </el-table-column>
        <el-table-column label="备注">
          <template #default="{ row }">
            <div class="textOverflow" :title="row.remark">{{ row.remark }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName" label="操作人" width="100"> </el-table-column>
      </el-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >关闭</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { onMounted, reactive, ref, toRefs } from 'vue'
	import { getSpuList as spuList } from '@/api/goods/quotedPrice.js'
	import { ElMessage } from 'element-plus';
	export default {
		props: {
			spuId: {
				type: Array,
				default: []
			}
		},
		emits: ['closeEvent'],
		setup(props, context) {
			let state = reactive({
				ifShow: true,
        spuList: [],
        loading: false,
				form: {
					goodsId: props.spuId
				}
			})

			// 关闭弹框
			let closeEvent = () => {
        state.ifShow = false
				setTimeout(() => {
					context.emit('closeEvent')
				}, 500)
			}

			// 取消回调
			let cancelEvent = () => {
				closeEvent()
			}

      let getSpuList = () => {
        state.loading = true
        spuList(state.form).then(res => {
          state.loading = false
          if (res.code == 200) {
            state.spuList = res.data
          } else {
              ElMessage.error(res.message)
            }
          }).catch(err => {
            state.loading = false
        
          })
      }

			onMounted(() => {
				getSpuList()
			})

			return {
				...toRefs(state),
				closeEvent,
				cancelEvent
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>