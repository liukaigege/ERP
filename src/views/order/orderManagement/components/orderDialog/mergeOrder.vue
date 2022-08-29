<!--
 * @Descripttion: 合并订单
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-21 10:13:22
-->

<template>
  <div>
    <el-dialog
      :title="showLogistic ? '确认物流方式' : '合并订单'"
      v-model="dialogVisible"
      :width="width"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="mergeOrder" v-show="!showLogistic">
        <p>请选择要合并的订单</p>

        <div class="table">
          <el-table
            ref="table"
            :data="tableData"
            width="100%"
            border
            max-height="300"
            :header-cell-style="{ background: '#FAFAFA' }"
            @selection-change="selectChange"
          >
            <el-table-column type="selection" width="55"  disabled='true'  :selectable="checkSelectable"/>
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
                {{scope.row.currency}} {{ scope.row.totalPrice }}
              </template>
            </el-table-column>

            <el-table-column prop="deductFlag" label="扣库存" align="center">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.deductFlag"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled = "scope.row.lag"
                ></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <div class="logistic" v-if="showLogistic">
        <p class="text">
          您选择合并的订单物流方式不同，请选择一个合并后使用的物流方式
        </p>
        <el-form
          :model="form"

          label-width="120px"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item label="选择物流方式" prop="selectedLog">
            <el-select
              v-model="form.selectedLog"
              placeholder=""
              @change="getSelect"
            >
              <el-option
                v-for="(item, index) in logisticFilter"
                :key="index"
                :label="item.logisticsName+'-'+item.lgtcLineName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button  @click="cancel" v-if="!showLogistic"
            >取 消</el-button
          >
          <el-button
            type="primary"
            v-if="!showLogistic"

            @click="dialogHandOk"
            :disabled="disabled"
            >确 定</el-button
          >

          <el-button  @click="selectAgain" v-if="showLogistic"
            >重新选择</el-button
          >
          <el-button
            type="primary"
            v-if="showLogistic"

            @click="success"
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
  inject,
  nextTick
} from 'vue'
import { channelWithManual, mergeOrders } from '@/api/order/orderManagement.js'
import {debounce} from '@/utils/tool.js'
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
      logistic: [],
      selected: [], //选中的项
      logisticFilter:[],//过滤的物流方式
      showLogistic: false,
      rules: {
        selectedLog: [
          { required: true, message: '请选择物流方式', trigger: 'change' }
        ]
      },
      form: {
        selectedLog: ''
      },
      logisticList: [], //物流方式
      caProps: {
        value: 'value',
        label: 'name',
        children: 'billWays'
      },
      disabled:false
    })
    const table = ref(null)
    watch(
      () => props.data,
      (a, b) => {
        data.tableData = props.data.mergeOrdersRelDTOS
      }
    )

    const dialogHandOk = debounce (function(){
      if (data.selected && data.selected.length > 1) {
        let arr = []
        data.logistic.forEach(item=>{
            if(data.selected.filter(v=> item.packageId == v.packageId).length>0 ){
              arr.push(item)
            }
        }) // 过滤出勾选项的且不是手工单的物流方式

        arr = setLogistic(arr) // 去重
        data.logisticFilter = arr

        if (arr.length == 0) {
          const mergeOrdersDTO = {
            mergeOrdersRelDTOS: data.selected,
            logistics: null,
            lgtcLine: null,
            operation: 0,
            trackNumber: null
          }
          mearge(mergeOrdersDTO)
          return
        }
        if (arr.length == 1) {
          let x = arr[0]
          const mergeOrdersDTO = {
            mergeOrdersRelDTOS: data.selected,
            logistics: x.logistics,
            lgtcLine: x.lgtcLine,
            operation: 0,
            trackNumber:''
          }
          mearge(mergeOrdersDTO)
          return
        }
        if (arr.length > 1) {
          if(!showLog(data.selected)){
            proxy.$message.error('需合并的订单扣库存状态不同，请设置统一后，再合并')
            return
          }
          data.showLogistic = true
        }
      } else {
        proxy.$message.error('请选中需要合并的订单,最少两个!')
      }


      function setLogistic(array){
        let obj = {}
        return array.filter((item, index) => {
            // 防止key重复
            let newItem = item.logistic+item.lgtcLine
            return obj.hasOwnProperty(newItem) ? false : obj[newItem] = true
        })
      } // 物流去重

    }

    )

    const close = () => {
      proxy.$parent.dialogVisible = false
    }
    const cancel = () => {
      proxy.$parent.dialogVisible = false
    }

    const selectChange = val => {
      console.log(val)
      data.selected = val
    }

    const getList = () => {
      channelWithManual().then(res => {
        if (res.code == 200) {
          data.logisticList = res.data || []
          data.logisticList.unshift({
            name: '其他',
            value: 1,
            billWays: null
          })
        }
      })
    }

    const getSelect = val => {
      console.log(val)
    }

    const selectedLogis = val => {
      data.form.selected = val
    }
    const selectAgain = () => {
      data.showLogistic = false
      data.form.selectedLog = ''
    //  data.form.selected = []
    //  data.selected = []
      //console.log(data.selected)
    }
    const success = debounce( () => {

      formRef.value.validate((bole, obj) => {
        if (bole) {
          let x = data.logistic.filter(v=>v.id == data.form.selectedLog)[0]
          const mergeOrdersDTO = {
            mergeOrdersRelDTOS: data.selected,
            logistics: x.logistics,
            lgtcLine: x.lgtcLine,
            operation: 0,
            trackNumber: ''
          }

          mearge(mergeOrdersDTO)
        }
      })
    }
    )

    const mearge = mergeOrdersDTO => {
      if(!showLog(data.selected)){
        proxy.$message.error('需合并的订单扣库存状态不同，请设置统一后，再合并')
        return
      }
      data.disabled = true
      mergeOrders(mergeOrdersDTO)
        .then(res => {
          if (res.code == 200) {
            proxy.$message.success(res.message)
            formOptions.value.init().then(res=>{
              orderTable.value.meargeData = orderTable.value.getMerge(res,'infoCode')
              // 合并单元格之后重新整理合并之后的列表样式
            })
            orderTable.value.getMergeNum()
            data.disabled = false
            cancel()

          }
        })
        .catch(err => {

          data.disabled = false
          formOptions.value.init()
          orderTable.value.getMergeNum()

        })
    }

    const showLog = arr =>{
      let bole = true
      let cheked = arr[0].deductFlag
        arr.forEach((item,index)=>{
           if(item.deductFlag !== cheked ) bole = false
        })
        return bole
    }



    const checkSelectable = (row,index)=>{
      return !row.lag
      // 为true可选中,反则不可选中
    }

    onMounted(() => {
      const { mergeOrdersRelDTOS, logistic } = props.data

      mergeOrdersRelDTOS.forEach(item=>{
        if(item.lag){
          data.selected.push(item)
          nextTick(()=>{
            table.value.toggleRowSelection(item)
          })
        }
      }) // 提前选中已经合并过的包裹
      data.tableData = mergeOrdersRelDTOS
      data.logistic = logistic
      getList()
    })

    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      close,
      selectedLogis,
      selectAgain,
      success,
      formRef,
      selectChange,
      getSelect,
      checkSelectable,
      table
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
