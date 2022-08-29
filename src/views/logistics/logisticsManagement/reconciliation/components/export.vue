<template>
<div >
  <el-dialog title="导出" v-model="show" width="480px" @close="close" :close-on-click-modal="false">
    <el-radio v-model="radio" :label="1">当前查询</el-radio>
    <el-radio v-model="radio" :label="2">当前选中</el-radio>
    <template #footer>
      <el-button  @click="close">取消</el-button>
      <el-button  type="primary" @click="submit">确定</el-button>
    </template>

  </el-dialog>
  <progressDialog v-if="progressShow" @closeEvent="progressclose" :progressDesc="description" :progress="percent" />
</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { logisExport } from '../api/api.js'
import { getuuid } from '@/utils/tool.js'
import { progressInfo } from '@/api/basic.js'
import progressDialog from './progress.vue'
export default {
  emits: ["closeEvent"],
  components: { progressDialog },
  props: {
    data: {
      default: []
    },
    formData: {}
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      radio: 1,
      uuid: '',
      progressShow: false,
      percent: 0,
      description: ''
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function submit() {
      state.uuid = getuuid()
      switch (state.radio) {
        case 1:
          logisExport({
            type: 1,
            uuid: state.uuid,
            query: props.formData
          }).then(res => {
            state.progressShow = true
            getprogress()
          })
          break;
        case 2:
          if (!props.data.length) return ElMessage.error('请选择要导出的订单')
          logisExport({
            type: 2,
            uuid: state.uuid,
            ids: props.data.map(item => item.id),
            query:{
              sortType: props.formData.sortType,
              sort: props.formData.sort
            }
          }).then(res => {
            state.progressShow = true
            getprogress()
          })
          break;
      }
    }

    function getprogress() {
      let time = setInterval(() => {
        progressInfo(state.uuid).then(res => {
          state.percent = res.data.percent
          state.description = res.data.description
          if (res.data.url) {
            clearInterval(time)
            window.open(res.data.url, '_self')
            setTimeout(() => {
              state.percent = 0
              state.description = null
            }, 700);
          }
          if (typeof res.data == 'string') {
            clearInterval(time)
            setTimeout(() => {
              state.percent = 0
              state.description = null
            }, 700);
          }
        }).catch(err => {
          clearInterval(time)
        })

      }, 800);

    }

    function progressclose(e){
      state.progressShow = false
      if(e){
        close()
      }
    }
    return {
      ...toRefs(state),
      close,
      submit,
      progressclose
    }
  }
}
</script>

<style scoped lang="scss">

</style>
