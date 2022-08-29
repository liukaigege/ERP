<template>
<div v-enterHandler="'submit'">
  <el-dialog title="导入结果" v-model="show" width="640px" @close="close" :close-on-click-modal="false" style="height:400px">
    <el-progress :text-inside="true" :stroke-width="16" :percentage="percent" status="success" />
    <div class="flex" v-if="description">
      <div>
        <span>处理详情：</span>
        <span>处理总数：{{description.total}}</span>
        <span>导入成功：<i style="color:#67c23a">{{description.successTotal}}</i></span>
        <span>导入失败：<i style="color:#D9001B">{{description.failTotal}}</i></span>
      </div>
      <el-button type="text"  v-if="description.url" @click="down">导出失败列表</el-button>
    </div>
    <template #footer>
      <el-button  type="primary" @click="submit" :disabled="percent!=100">确定</el-button>
    </template>
  </el-dialog>
</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
export default {
  emits: ["closeEvent"],
  props: {
    percent: {
      default:0
    },
    description: {
      default:undefined
    },
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function submit() {
      if(props.percent == 100){
        close()
      }
    }
    function down(){
      window.open(props.description.url,'_self')
    }
    return {
      ...toRefs(state),
      close,
      submit,
      down
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span+span {
    margin-left: 10px;
  }

  i {
    font-style: normal;
  }
}
::v-deep(.el-dialog__body){
  height: 200px;
}
</style>
