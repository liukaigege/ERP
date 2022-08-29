<!--
 * @Descripttion: 扫描二维码弹框
 * @version: 
 * @Author: 韦剑
 * @Date: 2021-07-06 13:42:55
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-13 10:25:44
-->
<template>
  <el-dialog title="扫描商品" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="sacnQrcodeView">
			<el-input v-model="value" ref="input" placeholder="请输入商品二维码"  style="width: 482px" @keyup.enter="enterEvent" clearable></el-input>
		</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEvent" >取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs, onMounted, nextTick } from 'vue'
import { purchaseSearch } from '@/api/store.js'
import { ElMessage } from 'element-plus'
export default {
	props: {
		packageIdAll: {
			type: Array,
			default: []
		},
		ivtPurchaseDetailId: {
			type: Number,
			default: 0
		}
	},
	emits: ['closeEvent', 'affirmEvent'],
	setup(props, context) {
		let ifShow = ref(true)
		let input = ref(null)
		let state = reactive({
			value: ''
		})
		nextTick(() => {
			input.value.focus()
		})
		const methods = {
			enterEvent() { // 回车
			let result
			try {
				result = JSON.parse(state.value)
			} catch {
				ElMessage.error('二维码不存在，请重新扫描！');
				return false;
			}
				if (result.ivtPurchaseDetailId) {
					let packageIds = props.packageIdAll.join(',')
					let params = {
						packageIds,
						ivtPurchaseDetailNewId: result.ivtPurchaseDetailId,
						ivtPurchaseDetailId: props.ivtPurchaseDetailId,
            warehouseId: 1
					}
					methods.purchaseSearchEvent(params)
				} else {
					ElMessage.error('读取二维码和当前包裹内的商品不匹配，请重新扫描！');
				}
			},
			purchaseSearchEvent(params) { // 开始扫描
				purchaseSearch(params).then(res => {
					if (res.code == 200) {
						if (res.data.code) {
							ElMessage.error({ message: res.data.msg })
						} else {
							ElMessage.success({ message: '扫描成功！', type: 'success' })
							context.emit('affirmEvent', res.data)
						}
					} else {
						ElMessage.error('读取二维码和当前包裹内的商品不匹配，请重新扫描！');
					}
				}).catch((error) => {
          clearTimeout(error.timeId)
          ElMessage.error({ message: error.message })
        })
			},
			closeEvent() {
        context.emit('closeEvent')
      },
		}
		return {
			ifShow,
			input,
			...toRefs(state),
			...methods
		}
	}
}
</script>

<style lang="scss" scoped>
.sacnQrcodeView{
	display: flex;
	justify-content: center;
}
</style>