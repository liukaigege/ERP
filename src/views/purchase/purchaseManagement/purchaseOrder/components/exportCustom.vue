<template>
  <div class="box">
    <el-dialog title="导出定制信息" v-model="show" width="560px" @close="close" :close-on-click-modal="false">
      <el-tabs v-model="form.type" tab-position="top">
        <el-tab-pane label="当前数据导出" :name="1"></el-tab-pane>
        <el-tab-pane label="重命名打包导出" :name="2"></el-tab-pane>
      </el-tabs>
      <el-radio-group v-model="form.subType">
        <el-radio :label="1">当前查询数据</el-radio>
        <el-radio :label="2">当前勾选数据</el-radio>
      </el-radio-group>
      <div style="display:flex;align-items:center" v-if="form.type == 2">
        <span style="color:red">* </span><span>文件前缀名： </span>
        <el-input v-model="form.fileName" clearable maxlength="15" style="width:300px" show-word-limit></el-input>
      </div>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </template>
      <el-progress :text-inside="true" :stroke-width="14" v-show="progressShow" :percentage="percent" status="success" />
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { exportCustomized, purchaseProgress } from '@/api/purchase/purchase'
import { ElMessage } from 'element-plus'
import { getuuid } from 'tool'
import { basicProgress } from '@/api/purchase/purchase.js'
export default {
  props: {
    searchForm: {},
    purchaseId: {}
  },
  emits: ['closeEvent'],
  setup(props, ctx) {
    const state = reactive({
      form: {
        type: 1, // 1当前数据导出 2重命名打包导出
        subType: 1, // 当type为1时,1当前查询数据2当前勾选数据
        fileName: null, // 文件前缀名
        uuid: getuuid(),
        value: null, // 对应导出条件的值 当前勾选的数据,值为订单id,多个逗号隔开
        orderDTO: props.searchForm
      },
      show: true,
      percent: 0,
      description: '正在处理',
      progressShow: false
    })


    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }
    function ok() {
      if (state.form.subType == 2 && props.purchaseId.length < 1) return ElMessage.error('请勾选采购订单')
      if (state.form.type == 2 && !state.form.fileName) return ElMessage.error('请输入文件前缀名')
      props.purchaseId.length && (state.form.value = props.purchaseId.join(','))
      exportCustomized(state.form).then(res => {
        state.form.type == 1 ? downDetail(res.data) : getBasicProgress(state.form.uuid, res.data)
      })
    }

    let time = null
    function downDetail(key) {
      state.progressShow = true
      time = setInterval(() => {
        purchaseProgress({ key }).then(res => {
          state.percent = res.data.percent
          state.description = res.data.description
          if (res.data.percent == 100 || res.data.url) {
            setTimeout(() => {
              window.open(res.data.url, '_self')
              progressClose()
              close()
            }, 700)
          } else if (typeof res.data.percent != 'number' || res.data.errorCode == 404) {
            ElMessage.error('进度获取失败')
            close()
          }
        }).catch(err => {
          close()
        })
      }, 800)
    }

    function progressClose() {
      state.progressShow = false
      state.percent = 0
      state.description = '正在处理'
      clearInterval(time)
    }

    function getBasicProgress(uuid, url) {
      state.progressShow = true
      basicProgress({ uuid }).then(res => {
        if (res.code == 200) {
          state.percent = res.data.percent
          state.description = res.data.description
          if (res.data.percent == 100) {
            window.open(url, '_self')
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
.box {
  ::v-deep(.el-dialog__body) {
    padding-top: 0;
  }
}
</style>
