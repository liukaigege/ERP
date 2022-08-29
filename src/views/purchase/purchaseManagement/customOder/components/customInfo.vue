<!--
* @Descripttion: Vango ERP customInfo 定制信息
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog title="定制信息" v-model="dialogVisible" width="600px" @closed="handleClose" :close-on-click-modal="false">
    <div>
      <div class="goodsContainer">
        <div class="goodsContent">
          <div class="goodsImages">
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image style="width: 200px; height: 200px" :src="data?.orderInfo?.skuImg||data?.skuImg||data?.orderInfo?.mainImg||data?.mainImg" fit="contain"></el-image>
              <template #reference>
                <el-image class="ml-10" style="width: 100px; height: 100px" :src="data?.orderInfo?.skuImg||data?.skuImg||data?.orderInfo?.mainImg||data?.mainImg" fit="contain"></el-image>
              </template>
            </el-popover>
          </div>
          <div class="goodsInfo">
            <p class="ellipsisP">订单SKU：{{ data?.orderSku || data?.orderInfo?.orderSku || data?.orderInfo?.sku || data?.sku || data?.skuCode || data?.orderInfo?.skuId  }}</p>
            <p class="ellipsisP">商品单价：{{data?.orderInfo?.currency ||data?.currency || 'USD'}} {{ data?.orderInfo?.skuPrice || data?.skuPrice || data?.orderInfo?.price || data?.price|| '0.00' }}</p>
            <p class="ellipsisP">团队：{{data.deptName}}</p>
          </div>
          <div class="goodsNum">x{{ data.goodsQuantity || data.quantity}}</div>
        </div>
      </div>
      <div class="goodsSkuTitle">定制内容</div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column prop="field" label="规格名称" align="center" />
        <el-table-column label="规格值" align="center">
          <template #default="scope">
            <div v-if="scope.row.type == 'upload_img'||scope.row.type == 'img_options' || scope.row.type == 'img' || scope.row.value.indexOf('http://') != -1 || scope.row.value.indexOf('https://') != -1">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="scope.row.value" fit="contain"></el-image>
                <template #reference>
                  <el-image class="ml-10" style="width: 100px; height: 100px" :src="scope.row.value" fit="contain"></el-image>
                </template>
              </el-popover>
            </div>
            <p v-else>{{ scope.row.value }}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-permission="'outStock:btn:remarkNor'" type="primary" v-if="!nobtn && tabPosition != 0" @click="ok">标为普货</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { tagged } from '../composables/api'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  props: {
    data: Object,
    nobtn: {
      type: Boolean,
      default: false // 是否有标记普货按钮
    },
    tabPosition: {
      type: Number,
      default: 1 // tabPosition 是否搁置 （1：正常、0：搁置中）
    }
  },
  emits: ['customInfoClose'],
  setup(props, { emit }) {
    const tableData = props.data.customValue && props.data.customValue.length ? props.data.customValue : []
    // const customValue = props.data.customValue && props.data.customValue.length ? props.data.customValue : []
    // customValue.forEach(v => {
      // tableData.push(v)
      // if (v.subOptions) tableData = [...tableData, ...v.subOptions]
    // })
    const state = reactive({
      dialogVisible: true,
      tableData
    })
    // affter the cancel modal event done
    function handleClose() {
      emit('customInfoClose', false)
    }
    // click the submit button event
    function ok() {
      ElMessageBox.confirm('确认标记为普货？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        "close-on-click-modal": false,
        "close-on-press-escape": false
      })
        .then(() => {
          const obj = {
            productId: props.data.productId,
            orderSku: props.data.orderInfo.sku,
            orderId: props.data.orderInfo.orderId
          }
          tagged({ list: [obj] }).then(res => {
            if (res.code == 200) {
              ElMessage.success({ message: '标记普货成功' })
              emit('customInfoClose', true)
            } else {
              ElMessage.warning({ message: res.message })
            }
          })
        })
        .catch(() => { })
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
.goodsContainer {
  width: 100%;
  border: 1px solid #ebeef5;
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
      box-sizing: border-box;
      padding-left: 15px;
      p {
        line-height: 30px;
        width: 100%;
        // white-space: nowrap;
        // overflow: hidden;
        // -o-text-overflow: ellipsis;
        // text-overflow: ellipsis;
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
