<template>
<div class="page-box" v-enterHandler="'submit'">
  <!-- 运单号不存在时进入这个页面 -->
  <el-form :model="form" ref="formRef" :rules="rules">
    <div class="info-card">
      <div class="head">
        <div class="title">
          <span>运单号：{{form.trackNum}}</span>
        </div>
      </div>
      <div class="info-content">
        <el-form-item label="包装状态:" prop="packState">
          <el-radio-group v-model="form.packState">
            <el-radio :label="1">完好无损</el-radio>
            <el-radio :label="2">轻度破损</el-radio>
            <el-radio :label="3">中度破损</el-radio>
            <el-radio :label="4">严重破损</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="flex">
          <el-form-item label="本次到货箱数:" prop="boxesNum">
            <el-input-number v-model="form.boxesNum" :precision="0" :min="1" :max="999" :controls="false"></el-input-number>
          </el-form-item>
          <el-form-item label="包裹重量:" prop="boxWeight">
            <erpNumberInput v-model="form.boxWeight" :max="9999.99" :precision="2">
              <template #append>
                kg
              </template>
            </erpNumberInput>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item label="物流商:" prop="LogisticsName">
            <el-select v-model="form.LogisticsName">
              <el-option v-for="item in logisticsList" :key="item.nameEn" :label="item.nameCn" :value="item.nameCn">
              </el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="收件人:" prop="consignee">
            <el-input v-model.trim="form.consignee" clearable maxlength="20"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="备注:">
          <el-input v-model="form.remark" type="textarea" style="width:700px" rows="3" maxlength="200">
          </el-input>
        </el-form-item>
      </div>
    </div>
  </el-form>
  <div class="footer-btn">
    <el-button type="primary" @click="submit">确认签收</el-button>
    <el-button @click="close">取消</el-button>
  </div>
</div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import erpNumberInput from '@/components/erpNumberInput/index.vue'
import { ivtLogisticses } from '@/api/purchase/purchase.js'
import {
  signOperation, //签收操作
} from '@/api/store.js'
export default {
  components: { erpNumberInput },
  setup() {
    const route = useRoute()
    const router = useRouter()
    let state = reactive({
      form: {
        packState: 1,
        remark: null,
        boxesNum: 1,
        boxWeight: null,
        trackNum: route.query.trackNum,
        LogisticsName: null,
        consignee: null,
      },
      logisticsList: []
    })

    let formRef = ref(null)

    const rules = {
      packState: { required: true },
      boxesNum: { required: true },
      boxWeight: {
        validator: (rule, value, callback) => {
          if (value <= 0) callback('请输入正数')
          else callback()
        },
        trigger: 'blur'
      },
      LogisticsName: { required: true, message: '请选择物流商' },
      consignee: { required: true, message: '请输入收件人' },
    }

    onMounted(() => {
      ivtLogisticses().then(res => {
        state.logisticsList = res.data
      })
    })

    function submit() {
      formRef.value.validate().then(_ => {
        // 坐等接口
        let data = JSON.parse(JSON.stringify(state.form))
        signOperation({ signOrderList: [data] }).then(res => {
          router.push({
            name: 'scanSignIn'
          })
        })

      })
    }

    function close() {
      router.push({
        name: 'scanSignIn'
      })
    }
    return {
      ...toRefs(state),
      formRef,
      rules,
      submit,
      close
    }
  }
}
</script>

<style lang="scss" scoped>
.page-box {
  background-color: #fff;
  padding: 16px;
  padding-bottom: 0;
}

.info-card {
  border: 1px solid #d7d7d7;
  border-radius: 5px;
}

.info-card+.info-card {
  margin-top: 20px;
}

.head {
  padding-left: 10px;
  border-bottom: 1px solid #d7d7d7;
  height: 35px;
  line-height: 35px;
  background-color: #f2f2f2;
}

.info-content {
  padding: 0 10px;

  // :deep(.el-form-item--small .el-form-item__error) {
  //   margin-left: 110px;
  // }

  .user-info {
    display: flex;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px dashed #d7d7d7;
    margin-bottom: 10px;

    span {
      margin-right: 24px;
    }
  }

  .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }

  .flex {
    display: flex;

    span {
      margin-right: 16px;
    }

    .el-form-item {
      margin-right: 16px;
    }
  }
}

.scroll {
  max-height: 680px;
  overflow: hidden;
  overflow-y: auto;
}

.footer-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
}

i {
  font-style: normal;
}
</style>>
