<template>
  <el-dialog title="导出盘点数据" v-model="show" width="560px" @close="close" :close-on-click-modal="false" append-to-body>
    <el-radio-group v-model="type">
      <el-radio :label="2">当前查询数据</el-radio>
      <el-radio :label="1">当前勾选数据</el-radio>
    </el-radio-group>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="ok" :loading="progressShow">确定</el-button>
    </template>
    <el-progress :text-inside="true" :stroke-width="14" v-show="progressShow" :percentage="percent" status="success" />
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { exportInventoryList } from '../composables/api.js'
import { ElMessage } from 'element-plus'
import { getuuid } from 'tool'
import { basicProgress } from '@/api/purchase/purchase.js'
export default {
  props: {
    searchForm: {
      type: Object,
      default: {
        inventoryCheckNumber: 0,
        searchType: 0,
        searchText: "",
        inventoryStatus: '',
        result: "",
        ids: []
      }
    },
    sortParams: {
      type: Object,
      default: {
        sortName: "",
        sortType: ""
      }
    }
  },
  emits: ['closeEvent'],
  setup(props, ctx) {
    const state = reactive({
      type: 2,
      show: true,
      percent: 0,
      description: '正在处理',
      progressShow: false,
      uuid: getuuid()
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }

    function ok() {
      const { type, uuid } = state
      if (props.searchForm.ids.length < 1 && type == 1) return ElMessage.error('请选择商品')
      const exportParams = Object.assign({}, props.searchForm, { type, uuid }, props.sortParams)
      exportInventoryList(exportParams).then(res => {
        // window.open(res.data)
        // close()
        // downDetail(res.data)
        getBasicProgress(state.uuid, res.data)
      })
    }


    function progressClose() {
      state.progressShow = false
      state.percent = 0
      state.description = '正在处理'
      clearInterval(time)
    }

    let time = null

    function getBasicProgress(uuid, url) {
      state.progressShow = true
      time = setInterval(() => {
        basicProgress({ uuid }).then(res => {
          if (res.code == 200) {
            state.percent = res.data.percent
            state.description = res.data.description
            if (res.data.percent == 100) {
              window.open(res.data.url, '_self')
              progressClose()
              close()
            }
          } else {
            ElMessage.error('进度获取失败')
            close()
          }
        }).catch(err => {
          close()
        })
      }, 300)
    }
    return {
      ...toRefs(state),
      close,
      ok,
      getBasicProgress
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep(.el-dialog__body) {
  padding-top: 0;
}
</style>
