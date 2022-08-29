<!--
 * @Descripttion: 取消合并订单
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-16 11:10:18
-->

<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :width="width"
      @close="close"
    >
      <div class="mergeOrder">
        <p>请选择要取消合并的订单</p>

        <div class="table">
          <el-table
            :data="tableData"
            width="100%"
            border
            max-height="300"
            :header-cell-style="{ background: '#FAFAFA' }"
            @selection-change="selectChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column
              prop="orderId"
              label="订单号"
              align="center"
              width="320px"
            >
              <template #default="scope">
                <span style="color: #1890ff"> {{ scope.row.orderId }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="金额" align="center">
              <template #default="scope">
                {{scope.row.currency}} {{ scope.row.price }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button  @click="cancel">取 消</el-button>
          <el-button type="primary"  @click="dialogHandOk"
          :disabled="disabled"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  getCurrentInstance,
  watch,
  onMounted,
  ref,
  inject
} from 'vue'
import { cancelMergeOrders } from '@/api/order/orderManagement.js'
import { debounce } from '@/utils/tool.js'
export default {
  components: {},
  props: {
    dialog: {
      type: Object,
      default: null
    },
    dialogTitle: {
      type: String,
      default: '提示'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '30%'
    },
    data: {
      type: Object,
      default: null
    }
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance()
    const formRef = ref()
    const formOptions = inject('formOptions')
    // 获取的formOptions 组件
    const orderTable = inject('orderTable')
    // 获取的orderTable 组件
    const data = reactive({
      tableData: [],
      selected: [], //选中的项
      disabled:false
    })

    watch(
      () => props.data,
      (a, b) => {
        data.tableData = props.data.orderData
      }
    )

    const dialogHandOk = debounce(() => {
      if (data.selected && data.selected.length > 0) {
        let orderIds=[]
        data.selected.forEach(item=>{
          orderIds.push(item.orderId)
        })
        const cancelMergeOrdersDTO = {
          orderIds:orderIds.join(','),
          packageId:props.data.packageId
        }
        cancelMearge(cancelMergeOrdersDTO)
        
      } else {
        proxy.$message.error('请选中需要合并的订单,最少一个!')
      }
    })

    const close = () => {
      proxy.$parent.dialogVisible = false
    }
    const cancel = () => {
      proxy.$parent.dialogVisible = false
    }

    const selectChange = val => {
      data.selected = val
    }


    const cancelMearge = cancelMergeOrdersDTO => {
      data.disabled = true
      cancelMergeOrders(cancelMergeOrdersDTO)
        .then(res => {
          if (res.code == 200) {
            proxy.$message.success(res.message)
            formOptions.value.init()
            orderTable.value.getMergeNum()
            data.disabled = false
            cancel()
          }
        })
        .catch(err => {
          
          formOptions.value.init()
          orderTable.value.getMergeNum()
          data.disabled = false
          cancel()
        })
    }

    onMounted(() => {
      const { orderData,packageId } = props.data
      data.tableData = orderData
    })

    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      close,
      formRef,
      selectChange
    }
  }
}
</script>

<style lang="scss" scoped>
.mergeOrder {
  .title {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .table {
    margin-top: 25px;
    min-height: 35vh;
  }
}
.text {
  color: red;
  margin: 10px;
}
</style>
