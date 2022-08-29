<template>
<div class="page-box" v-enterHandler="'submit'">
  <div class="scroll">
    <el-form :model="data" ref="formRef" :inline="false" >
      <div class="info-card" v-for="(item,index) in data" :key="item.purchaseOrderNumber">
        <div class="head">
          <div class="title">
            <span>采购单号：{{item.purchaseOrderNumber}}</span>
          </div>
        </div>
        <div class="info-content">
          <div class="user-info">
            <span style="width:180px">采购人员：{{item.purchaseUser}}</span>
            <span style="width:200px">物流方式：{{item.name}}</span>
            <span style="width:250px">下单时间：{{item.createTime}}</span>
            <p><span class="textOverflow">供货商：【{{item.supplierType}}{{item.supplierType=='合作'?'供应商':''}}】{{item.supplierName}}</span></p>
          </div>
          <el-form-item label="运单号:" >
            <span>{{item.trackNum}}</span>
          </el-form-item>
          <el-form-item label="包装状态:"  :rules="{required:true,message:'请选择包装状态',trigger:'change'}" :prop="index + '.packState'">
            <el-radio v-model="item.packState" label="1">完好无损</el-radio>
            <el-radio v-model="item.packState" label="2">轻度破损</el-radio>
            <el-radio v-model="item.packState" label="3">中度破损</el-radio>
            <el-radio v-model="item.packState" label="4">严重破损</el-radio>
          </el-form-item>
          <el-form-item label="">
            <div class="flex">
              <span>预估箱数：{{item.planBox}}</span>
              <span>已收箱数：{{item.alreadyBox}}</span>
              <i style="color:red">*</i>
              <el-form-item label="本次到货箱数:"  :prop="index + '.nowBox'" :rules="rules.nowBox">
                <el-input v-model.trim="item.nowBox"  clearable style="width:190px"></el-input>
              </el-form-item>
              <el-form-item label="包裹重量:"  :prop="index + '.boxWeight'" :rules="rules.boxWeight">
                <el-input v-model.trim="item.boxWeight" clearable>
                  <template #append>kg</template>
                </el-input>
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="备注:" >
            <el-input v-model="item.remark" type="textarea" style="width:700px" rows="3" maxlength="200">
            </el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
  <div class="footer-btn">
    <el-button type="primary"  @click="submit">确认签收</el-button>
    <el-button  @click="close">取消</el-button>
  </div>
</div>
</template>

<script>
import { reactive, toRefs, ref, onMounted, nextTick } from 'vue'
import {
  getSignOrderList,
  signOperation, //签收操作
} from '@/api/store.js'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
  setup() {
    const state = reactive({
      formRef: null,
      data: [],
      num: 0
    })
    const router = useRouter()
    const rules = {
      boxWeight: [{
        validator: (rule, value, callback) => {
            const reg = new RegExp(/^(-?\d+)(\.\d+)?$/)
            const reg2 = new RegExp(/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[0-9][0-9]*\.\d{1,2})))$/)
            if(!reg.test(value)){
              resetValueNull(rule) 
              callback()
              return 
            }
            if (reg2.test(value)) {
              if (value <= 0) {resetValueNull(rule) }
              if (value > 999.99) { setValue(rule, 999.99) }
              callback()
            } else if(!value) {
              callback()
            }else{
              callback('最多输入两位小数')
            }
        },
        trigger: 'blur'
      }],
      nowBox: [{
          validator: (rule, value, callback) => {
            console.log(typeof value);
            const reg = new RegExp(/^([1-9]\d*|[0]{1,1})$/)
            if (reg.test(value)) {
              if (value <= 0) { return resetValueNull(rule) }
              if (value > 999) { setValue(rule, 999) }
            } else {
              resetValueNull(rule)
            }
            console.log(typeof value,'call');
            callback()
          },
          trigger: 'blur'
        },
        {
          validator: (rule, value, callback) => {
            if (state.data.filter(item => item.nowBox).length) {
              console.log(typeof value,'then');
              callback()
            } else {
              console.log(typeof value);
              callback('请输入签收数量','catch')
            }
          },
          trigger: 'blur'
        }
      ]
    }
    const route = useRoute()
    onMounted(() => {
      getSignOrderList({
        trackNum: route.query.trackNum + ''
      }).then(res => {
        state.data = res.data
        state.data.forEach(item =>{
           item.packState = '1'
           item.nowBox = item.planBox -item.alreadyBox == 1?1:''

        })
        nextTick(() => {
          document.querySelector('.el-input__inner').focus()
        })
      })

    })

    function resetValueNull(rule) { // 置空
      let dataAddrs = rule.field.split('.')
      state.data[dataAddrs[0]][dataAddrs[1]] = null
    }

    function setValue(rule, value) { // 设定值
      let dataAddrs = rule.field.split('.')
      state.data[dataAddrs[0]][dataAddrs[1]] = value
    }

    function submit() {
      state.formRef.validate().then(res => {
        let data = JSON.parse(JSON.stringify(state.data))
        let obj = {
          '合作': 1,
          '1688': 2,
          '淘宝': 3,
          '拼多多': 4
        }
        data.forEach(item => {
          item.supplierType = obj[item.supplierType]
        })
        signOperation({ signOrderList: data }).then(res => {
          ElMessage.success('签收成功')
          router.push({
            name: 'scanSignIn'
          })
        })
      }).catch(err => {
        let len = state.data.filter(item => item.nowBox).length
        if (!len) {
          ElMessage.error('请输入签收数量')
        }
      })
    }

    function close() {
      router.push({
        name: 'scanSignIn'
      })
    }
    return {
      ...toRefs(state),
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
</style>
