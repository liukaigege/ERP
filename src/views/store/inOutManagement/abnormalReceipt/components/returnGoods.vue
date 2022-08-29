<template>
<el-dialog title="多发退货" v-model="show" width="800px" @close="close(false)" :close-on-click-modal="false">
  <div class="head">
    <div class="left">
      <div class="img">
        <img :src="data.skuImage" alt="">
      </div>
      <div class="info">
        <p class="col" :label="data.goodsName">{{data.goodsName}}</p>
        <p>{{data.spe}}</p>
        <p>{{data.sku}}</p>
      </div>
    </div>
    <div class="right">
      <p>x{{data.quantity}}</p>
    </div>
  </div>
  <el-form :model="formData" label-width="100px" :inline="false"  ref="form">
    <el-form-item label="采购审核:" >
      {{purchaseAudit[data.purchaseAudit]}}
    </el-form-item>
    <div class="form-item-flex">
      <el-form-item label="收件人姓名:" >
        {{data.receiverName}}
      </el-form-item>
      <el-form-item label="手机号:" >
        {{data.phoneNum}}
      </el-form-item>
    </div>
    <el-form-item label="收货地址:" >
      {{data.shippingAddress}}
    </el-form-item>
    <el-form-item label="货架位:" >
      <span v-for="item in data.instockInfo" :key="item"> {{item}} &nbsp;&nbsp; </span>
    </el-form-item>
    <el-form-item label="运单号:" >
      <div v-for="(item,index) in formData.trackInfo" :key="item" class="flex-form-item">
        <el-form-item  :prop="'trackInfo.' + index + '.ivtLogisticsId'" :rules="rules.logistics" class="flex-item">
          <el-select v-model="item.ivtLogisticsId" placeholder="请选择物流方式" clearable class="item-select">
            <el-option v-for="item in logistics" :key="item.nameCn" :label="item.nameCn" :value="item.id">
            </el-option>
          </el-select>

        </el-form-item>
        <el-form-item  :prop="'trackInfo.' + index + '.wayBillNum'" :rules="rules.waybillNo">
          <!-- 运单号 -->
          <el-input v-model="item.wayBillNum" placeholder="请输入运单号"  clearable class="item-input" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="运费:" label-width="70px"  :prop="'trackInfo.' + index + '.freightPrice'" :rules="rules.freight">
          <el-input v-model="item.freightPrice" placeholder="请输入运费"  type="number" clearable class="item-input flex-item"></el-input>
          <el-button  disabled style="width:60px">￥</el-button>

          <span style="margin-left:16px;color:#1890FF;cursor: pointer;" v-if="index==0" @click="addItem">添加</span>
          <span style="margin-left:16px;color:#FD4C60;cursor: pointer;" v-else @click="delItem(index)">删除</span>
        </el-form-item>
      </div>
    </el-form-item>
    <el-form-item label="备注:" >
      <el-input type="textarea" maxlength="100" v-model="formData.remark" />
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button  @click="close(false)">取消</el-button>
    <el-button type="primary"  @click="submit">确认退货</el-button>
  </template>
</el-dialog>
</template>

<script>
import { inject, onMounted, reactive, ref, toRefs } from 'vue'
import { checkNumOrWords, checkNumber_2 } from '@/utils/ruleOptions.js'
import { ElMessage } from 'element-plus'
import { exceptionProcess, ivtLogisticses } from '../composables/api.js'
import { checkPhone } from '@/utils/ruleOptions.js'
export default {
  props: {
    data: {}
  },
  emits: ['closeEvent'],
  setup(props, ctx) {
    const state = reactive({
      show: true,
      formData: {
        serialNumber: props.data.serialNumber,
        remark: '',
        trackInfo: [{
          ivtLogisticsId: "",
          wayBillNum: '', //运单号
          freightPrice: '' // 运费
        }],
      },
      logistics: []
    })
    let purchaseAudit = {
      1: '待审核',
      2: '多发退货',
      3: '多发退货'
    }

    onMounted(() => {
      ivtLogisticses().then(res => {
        state.logistics = res.data
      })
    })

    const rules = {
      logistics: [
        { required: true, message: "请选择物流方式", trigger: ['blur', 'change'] }
      ],
      waybillNo: [
        { required: true, message: '请输入运单号', trigger: ['blur', 'change'] },
        { validator: checkNumOrWords, trigger: ['blur', 'change'] },
        { validator: duplicate, trigger: 'blur' }
      ],
      freight: [
        { required: true, message: '请输入运费', trigger: ['blur', 'change'] },
        {
          validator: (rule, value, callback) => {
            if (value < 0 || value > 9999.99) return callback('请输入0-9999.99之间的数字')
            checkNumber_2(rule, value, callback)
          },
          trigger: ['blur', 'change']
        }
      ]
    }

    let form = ref(null)
    let changeTabs = inject('changeTabs')

    function close(e) {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent', 'returnGoodsShow')
        if (e) {
          changeTabs()
        }
      }, 500)
    }

    function addItem() {
      if (state.formData.trackInfo.length == 10) return ElMessage.error('只能添加10个')
      state.formData.trackInfo.push({
        ivtLogisticsId: "",
        wayBillNum: '', //运单号
        freightPrice: '' // 运费
      })
    }

    function delItem(index) {
      state.formData.trackInfo.splice(index, 1)
    }

    function duplicate(rule, value, callback) { // 运单号查重
      let index = rule.field.split('.')[1]
      let data = state.formData.trackInfo.filter((item, idx) => {
        return idx != index
      })
      let flag = data.some(item => item.wayBillNum == value)
      if (flag) {
        return callback('物流单号不能重复')
      }
      callback()
    }

    function submit() {
      console.log(state.formData);
      form.value.validate().then(res => {
        exceptionProcess(state.formData).then(res => {
          ElMessage.success(res.message)
          setTimeout(() => {
            close(true)
          }, 500);
        })
      })
    }
    return {
      ...toRefs(state),
      close,
      addItem,
      delItem,
      rules,
      form,
      submit,
      purchaseAudit,
      checkPhone
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  margin-bottom: 16px;
  border-bottom: 1px dashed #e8e8e8;

  .left {
    display: flex;

    .img {
      margin-right: 10px;

      img {
        width: 60px;
        height: 60px;
      }
    }

    .col {
      width: 330px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .right {
    display: flex;
    align-items: center;
  }
}

.flex-form-item {
  display: flex;
    margin-bottom: 8px;

  .flex-item {
    margin-right: 8px;
  }

  .item-input {
    width: 140px;
  }

  .item-select {
    width: 150px;
  }
}

.form-item-flex {
  display: flex;
  ::v-deep(.el-form-item){
    flex: 1.5;
  }
  ::v-deep(.el-form-item + .el-form-item){
    flex: 3.5;
  }
}
</style>
