<template>
  <el-dialog title="批量设置开关" v-model="showSwitchDialog" width="300px" @close="closeDialog(false)">
    <div style="display: flex; justify-content: space-between" v-if="showPubSku">
      <div class="switch-item">
        <span class="">报价开关：</span>
        <el-switch @change="() => { if (batchPuhSwitch === 0) { batchSkuSwitch = 0 } }" :active-value="1" :inactive-value="0" v-model="batchPuhSwitch"></el-switch>
      </div>
      <div class="switch-item">
        <span class="">SKU开关：</span>
        <el-switch :active-value="1" :inactive-value="0" v-model="batchSkuSwitch"></el-switch>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between" v-if="showCustomized">
      <div class="switch-item">
        <span class="">定制图片：</span>
        <el-switch :active-value="1" :inactive-value="0" v-model="batchImgSwitch"></el-switch>
      </div>
      <div class="switch-item">
        <span class="">定制文本：</span>
        <el-switch :active-value="1" :inactive-value="0" v-model="batchTextSwitch" ></el-switch>
      </div>
    </div>
    <template #footer>
      <div style="display: flex; align-items: center; justify-content: flex-end;">
        <el-button  @click="closeDialog(false)">取消</el-button>
        <el-button  type="primary" @click="closeDialog(true)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
export default {
  props:{
    showPubSku:Boolean,
    showCustomized:Boolean
  },
  emits: ['close'],
  setup(props, ctx) {
    const batchPuhSwitch = ref(1)
    const batchSkuSwitch = ref(1)
    let showSwitchDialog = ref(true)
    const batchImgSwitch = ref(1)
    const batchTextSwitch= ref(1)
    function closeDialog(flag) {
      showSwitchDialog.value = false
      let pubsku = props.showPubSku?{
        batchPuhSwitch:batchPuhSwitch.value,
        batchSkuSwitch:batchSkuSwitch.value}:{}
      let customized = props.showCustomized?{
        batchImgSwitch:batchImgSwitch.value,
        batchTextSwitch:batchTextSwitch.value}:{}
      ctx.emit('close',Object.assign({flag},pubsku,customized))
    }

    return {
      showSwitchDialog,
      batchPuhSwitch,
      batchSkuSwitch,
      closeDialog,
      batchImgSwitch,
      batchTextSwitch
    }
  }
}
</script>
<style scoped lang="scss">
.switch-item{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>