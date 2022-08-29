<template>
<div>
  <el-form :model="data" ref="formRef" label-width="0px" :inline="false">
    <el-table :data="data" border stripe :header-cell-style="{color:'#000'}">
      <el-table-column prop="shopName" label="店铺名称" align="center">
      </el-table-column>
      <el-table-column prop="platform" label="店铺平台" align="center">
      </el-table-column>
      <el-table-column prop="tempDomain" label="临时域名" align="center">
      </el-table-column>
      <el-table-column prop="name" label="插件名称" align="center">
      </el-table-column>
      <el-table-column prop="endTime" label="插件到期时间" align="center" width="180">
        <template #default="{row}">
          <span :class="{red:row.pluginStatus}">{{row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="续费金额" align="center" width="250px">
        <template #header>
          <span class="red">* </span>续费金额
        </template>
        <template #default="{row,$index}">
          <el-form-item label="" :prop="$index + '.amount'" :rules="amount">
            <div class="flex">
              <div class="ipt">
                <el-input v-model="row.amount"></el-input>
              </div>
              <div class="sle">
                <el-select v-model="row.company" @change="row.amount = ''">
                  <el-option label="美元" :value="0">
                  </el-option>
                  <el-option label="元" :value="1">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="续费有效期" align="center" width="320px">
        <template #header>
          <span class="red">* </span>续费有效期
        </template>
        <template #default="{row ,$index}">
          <el-form-item label="" :prop="$index+'.date'" :rules="date">
            <el-date-picker v-model="row.date" style="width:300px" type="daterange" value-format="YYYY-MM-DD" unlink-panels range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="edit" label="操作" align="center">
        <template #default="{$index}">
          <el-popconfirm title="确定移除吗？" @confirm="delRow($index)">
            <template #reference>
              <span style="color:#FD4C60;cursor: pointer;">移除</span>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-form>

</div>
</template>

<script>
import { storage } from '@/utils/storage.js'
import { onMounted, reactive, toRefs, watch } from 'vue'
import { requiredValue, moneyRules } from '@/views/shop/shopRules/rules.js'
import { ElMessage } from 'element-plus'
import { renew } from '@/api/goods/shop.js'
export default {
  props:{
    backRoute:{}
  },
  setup(props) {
    const state = reactive({
      data: [],
      formRef: null
    })
    onMounted(() => {
      const data = storage.get('shopdata')
      data.forEach(item => {
        item.pluginList.forEach(val => {
          val.company = 0
          val.shopName = item.name
          val.platform = item.platform
          val.tempDomain = item.tempDomain
          let nowTime = new Date().getTime()/1000
          let pluginTime = new Date(val.endTime).getTime()/1000
          val.pluginStatus = (pluginTime - nowTime )<864000
          state.data.push(val)
        })
      })
    })

  const rules = {
      amount: moneyRules(state.data, '请输入续费金额'),
      date: [requiredValue('请选择有效期'), {
        validator: (rule, value, callback) => {
          const row = state.data[rule.field.split('.')[0]]
          let oldTime = new Date(row.endTime).getTime()
          let newTime = new Date(row.date[0]).getTime()
          if (oldTime >= newTime) {
            callback(new Error(rule.message))
          } else {
            callback()
          }
        },
        message: `有效期的开始时间需晚于当前插件到期时间`
      }],
    }

    function submit() {
      if (!state.data.length) return ElMessage.error('当前无数据')
      state.formRef.validate().then(_ => {
        let arr = []
        state.data.forEach(item => {
          arr.push({
            pId:item.id,
            pluginName:item.name,
            shopId: item.shopId,
            company: item.company,
            amount: item.amount,
            startTime: item.date[0] + ' 00:00:00',
            endTime: item.date[1] + ' 23:59:59'
          })
        })
        const data = {
          renewType: 3,
          shopRenewDTOS: arr
        }
        renew(data).then(_ => {
          ElMessage.success('续费成功')
          props.backRoute()
        })
      })
    }

    function delRow(i) {
      state.data.splice(i, 1)
    }
    return {
      ...toRefs(state),
     ...rules,
     delRow,
     submit
    }
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: red;
}

.pointer {
  cursor: pointer;
}

.flex {
  display: flex;

  .ipt {
    flex: 7;

  }

  .sle {
    flex: 3;
  }
}

::v-deep(.el-input__inner) {
  padding-right: 15px;
}

::v-deep(.el-input__suffix) {
  right: 5px;
}

::v-deep(.el-form-item) {
  margin: 18px 0;
}
</style>
