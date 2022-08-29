<!--
* @Descripttion: Vango ERP priceEditDialog.vue 批量修改入库单价
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="批量填充"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="120px">
      <el-form-item label="入库单价：" prop="price">
        <el-input-number
          placeholder="请输入入库单价"
          v-model="form.price"
					style="width:200px;"
          :min="0"
          :max="9999999.99"
          :controls="false"
          :precision="2"
          @keyup.enter="ok"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { batchFillPriceApi } from '../composables/api'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
	props:{
		selectList:{
			type:Array,
			default:[]
		}
	},
  emits: ['changeBack'],
  setup(props,{emit}) {
    //   最多保留两位小数,值范围在0-100之间（包含0 100）
    const state = reactive({
      dialogVisible: true,
      form: {
        price: null
      },
    })
    function handleClose() {
      emit('changeBack', false)
    }
    function ok() {
			const ids = props.selectList.map(v=>v.id)
			batchFillPriceApi({price:state.form.price, ids})
				.then(res => {
					if(res.code == 200) emit('changeBack', state.form)
					else ElMessage.warning({ message: res.message })
				})
    }
    return {
      ...toRefs(state),
      handleClose,
      ok
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
