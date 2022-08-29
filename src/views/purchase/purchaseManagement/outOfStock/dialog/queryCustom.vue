<!--
* @Descripttion: Vango ERP queryCustom.vue => query custom infomation
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog title="定制信息" v-model="dialogVisible" width="800px" :close-on-click-modal="false" @close="closeFn" :destroy-on-close="true">
    <div>
      <div class="goodsContainer">
        <div class="goodsContent">
          <div class="goodsImages">
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image style="width: 200px; height: 200px" :src="data.skuImg || data.mainImg" fit="contain"></el-image>
              <template #reference>
                <el-image class="ml-10" style="width: 100px; height: 100px" :src="data.skuImg || data.mainImg" fit="contain"></el-image>
              </template>
            </el-popover>
          </div>
          <div class="goodsInfo">
            <p>订单SKU：{{data?.orderSku}}</p>
            <p>商品单价：{{data?.currency || 'USD'}} {{data?.orderSkuPrice}}</p>
            <p>团队：{{data?.deptName}}</p>
          </div>
          <div class="goodsNum">x{{data?.goodsQuantity}}</div>
        </div>
      </div>
      <div class="goodsSkuTitle">定制内容</div>
      <el-table :data="list" style="width: 100%" border>
        <el-table-column prop="field" label="规格名称" align="center" />
        <el-table-column label="规格值" align="center">
          <template #default="{ row }">
            <div v-if="isImgString(row?.value)">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="row?.value" fit="contain"></el-image>
                <template #reference>
                  <el-image class="ml-10" style="width: 100px; height: 100px" :src="row?.value" fit="contain"></el-image>
                </template>
              </el-popover>
            </div>
            <p v-else>{{ row?.value }}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-permission="'outStock:btn:cancelRemark'" type="primary" @click="ok">取消标记</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { cancelBatch } from '@/views/purchase/purchaseManagement/customOder/composables/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { isImgString } from '@/utils/tool'
export default {
  props: {
    data: {
      type: Object,
      default: null
    },
  },
  emits: ['queryBack'],
  setup(props, { emit }) {
    let tableData = []
    let result = props.data?.customValue && typeof(props.data?.customValue) === 'string' ? JSON.parse(props.data?.customValue) : props.data?.customValue
		// 	try {
		// 		result = JSON.parse(props.data?.customValue)
		// 	} catch (error) {
		// 		result = props.data?.customValue
		// 	}
    const customValue = result ? result : []
    customValue.forEach(v => {
      tableData.push(v)
      // if (v.subOptions) tableData = [...tableData, ...v.subOptions]
    })
    const state = reactive({
      dialogVisible: true,
      list: tableData
    })
    function closeFn() {
      emit('queryBack', false)
    }
    function ok() {
      cancelBatch({ list: [props.data.id] })
        .then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: '取消标记成功' })
            emit('queryBack', true)
          } else {
            ElMessage.warning({ message: res.message })
          }
        })

    }
    return {
      ...toRefs(state),
      ok,
      closeFn,
			isImgString
    }
  }
}
</script>
<style lang='scss' scoped>
.goodsContainer {
  width: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
  padding: 10px;
  .goodsContent {
    display: flex;
    justify-content: space-between;
    .goodsImages {
      width: 100px;
      height: 100px;
      :deep(.ml-10) {
        margin: 0 !important;
      }
    }
    .goodsNum {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
    .goodsInfo {
      width: 400px;
      p {
        line-height: 33px;
      }
    }
  }
}
.goodsSkuTitle {
  line-height: 60px;
  font-size: 20px;
  margin-top: 15px;
}
</style>
