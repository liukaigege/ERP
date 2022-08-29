<!--
 * @Descripttion: 搁置
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-19 16:34:04
-->

<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      :width="width"
      @close="close"
    >
      <div class="content">
        <p class="titles">请选择搁置原因</p>

        <div class="radioList">
          <div
            class="radioItem"
            v-for="(item, index) in radioList"
            :key="index"
          >
            <el-radio v-model="checked" :label="item.id">{{
              item.lable
            }}</el-radio>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button  @click="cancel">取 消</el-button>
          <el-button type="primary"  @click="dialogHandOk"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance,inject } from 'vue'
import {layFlag} from '@/api/order/orderManagement.js'
import {debounce} from '@/utils/tool.js'
export default {
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
    data:{
      type:Object,
      default:null
    }
  },
  setup(props, context) {
    const { proxy } = getCurrentInstance()
    const formOptions = inject('formOptions')
    // 获取的formOptions 组件
    const data = reactive({
      checked: 1,
      radioList: [
        {
          lable: '取消订单：正在联系',
          id: 1
        },
        {
          lable: '取消订单：确认退款',
          id: 2
        },
        {
          lable: '待确认：地址信息/产品参数',
          id: 3
        },
        {
          lable: '待确认：大额订单',
          id: 4
        },
        {
          lable: '待确认：是否同意换货',
          id: 5
        },
        {
          lable: '海外仓等特殊渠道发货',
          id: 6
        },
        {
          lable: '其他公司代发订单',
          id: 7
        },
        {
          lable: '补偿申请：正在协商',
          id: 8
        },
        {
          lable: '订单已拒付',
          id: 9
        },
        {
          lable: '不通邮待退款',
          id: 10
        },
        {
          lable: '采购不到待退款',
          id: 11
        },
        {
          lable: '其他',
          id: 12
        }
      ]
    })

    const dialogHandOk = debounce(() => {

      const {packageIds} = props.data
      let reason = data.radioList.find(v=> v.id == data.checked).lable
      const param = {
        "packageIds":packageIds,
          "reason":reason
      }
      layFlag(param).then(res=>{
        if(res.code == 200){
          proxy.$message.success(res.message)
           formOptions.value.init()
           cancel()
        }if (res.code  ==  301) {
          proxy.$message.warning(res.message)
          formOptions.value.init()
          cancel()
      }
      })

  })
    const close = () => {
      proxy.$parent.dialogVisible = false
      data.checked = 1
    }
    const cancel = () => {
      proxy.$parent.dialogVisible = false
      data.checked = 1
    }

    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      close
    }
  }
}
</script>

<style lang="scss" scoped>
.titles {
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: rgba(0, 0, 0, 0.85);
}
.radioList {
  padding: 24px 112px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .radioItem {
    width: 50%;
    margin-bottom: 14px;
  }
}
</style>
