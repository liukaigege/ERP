<template>
<el-dialog title="移除供应商" v-model="show" width="640px" @close="close" :close-on-click-modal="false">
  <p class="tip">说明：删除会自动忽略设为SKU默认供应商的数据项</p>
  <div>
    <p v-for="item in data" :key="item.supplierName" class="checkbox-item">
      <el-checkbox v-model="item.checked">{{`【${item.partnerType}】${item.supplierName}`}}</el-checkbox>
    </p>
  </div>
  <template #footer>
    <el-button @click="close" >取消</el-button>
    <el-button type="primary"  @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import { supplierRemove } from '@/api/commodity.js'
export default {
  emits: ['closeEvent'],
  props: {
    data: {},
    checkData: {}
  },
  setup(props, ctx) {
    const state = reactive({
      show: true
    })

    function close() {
      state.show = false
      setTimeout(() => {
          ctx.emit('closeEvent')
      }, 500);
      
    }

    function submit() {
      let arr = props.data.filter(item => item.checked)
      if (!arr.length) return ElMessage.error('请选择要移除的供应商')
      let idList = []
      let supplierId = arr.map(item => item.supplierId)
      props.checkData.forEach(item => {
        item.supplierList.forEach((val, index) => {
          if (supplierId.includes(val.supplierId) && val.id && val.defaultFlag == 0) {
            idList.push(val.id)
          }
        })
      })
      if (!idList.length) {
        props.checkData.forEach(item => {
          let indexs = []
          item.supplierList.forEach((val, index) => {
            if (supplierId.includes(val.supplierId) && !val.id) {
              indexs.push(index)
            }
          })
          item.supplierList = item.supplierList.filter((e, i) => !indexs.includes(i))
        })
        ElMessage.success('移除成功')
        close()
      } else {
        supplierRemove({ idList }).then(res => {
          props.checkData.forEach(item => {
            let indexs = []
            item.supplierList.forEach((val, index) => {
              if (supplierId.includes(val.supplierId) && val.defaultFlag == 0) {
                indexs.push(index)
              }
            })
            item.supplierList = item.supplierList.filter((e, i) => !indexs.includes(i))
          })
          ElMessage.success('移除成功')
          close()
        })
      }

    }
    return {
      ...toRefs(state),
      close,
      submit
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-item {
  padding: 3px 0 3px 20px;
}

.tip {
  padding-left: 20px;
  color: rgb(247, 175, 81);
}
</style>
