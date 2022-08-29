<template>
  <el-dialog title="定制信息" v-model="show" width="580px" @close="close" :close-on-click-modal="false">
    <div class="info">
      <el-popover placement="right-start" trigger="hover" width="auto">
        <el-image style="width: 200px; height: 200px" :src="info?.skuImage?info.skuImage:info.skuImg" fit="contain"></el-image>
        <template #reference>
          <el-image class="ml-10" style="width: 100px; height: 100px" :src="info?.skuImage?info.skuImage:info.skuImg" fit="contain"></el-image>
        </template>
      </el-popover>
      <div class="column-center">
        <p>订单SKU: {{info?.sku}}</p>
        <p class="flex-4-1">
          <span class="flex-4">订单金额：{{info?.currency}} {{info?.totalPrice}}</span>
          <span class="flex-1">X {{info?.goodsQuantity ? info?.goodsQuantity : info?.quantity}}</span>
        </p>
      </div>
    </div>
    <div style="margin:12px 0">定制内容</div>
    <el-table :data="tableData">
      <el-table-column prop="field" label="规格名称" align="center"></el-table-column>
      <el-table-column prop="value" label="规格值" align="center">
        <template #default={row}>
          <div v-if="row.type == 'upload_img'||row.type == 'img_options'">
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image style="width: 200px; height: 200px" :src="row.value" fit="contain"></el-image>
              <template #reference>
                <el-image class="ml-10" style="width: 100px; height: 100px" :src="row.value" fit="contain"></el-image>
              </template>
            </el-popover>
          </div>
          <p v-else>{{ row.value }}</p>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  emits: ['closeEvent'],
  props: ['info'],
  setup(props, ctx) {
    let tableData = []
    const customValue = props.info?.customValue ? JSON.parse(props.info?.customValue) : []
    customValue.forEach(v => {
      tableData.push(v)
      if (v.subOptions) tableData = [...tableData, ...v.subOptions]
    })
    const state = reactive({
      show: true,
      tableData
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }
    return {
      ...toRefs(state),
      close
    }
  }
}
</script>

<style lang="scss" scoped>
.info {
  display: flex;
  border: 1px solid #d7d7d7;
  padding: 12px;
}
.img-box img {
  height: 80px;
  width: 80px;
  object-fit: contain;
}
.column-center {
  margin-left: 8px;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-around;
}

.flex-4-1 {
  display: flex;

  .flex-4 {
    flex: 4;
  }

  .flex-1 {
    flex: 1;
  }
}
</style>
