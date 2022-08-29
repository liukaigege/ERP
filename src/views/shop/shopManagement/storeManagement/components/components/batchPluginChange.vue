<template>
<div>
  <el-form :model="data" ref="formRef" label-width="0px" :inline="false">
    <el-table :data="data" border stripe :header-cell-style="{color:'#000'}">
      <el-table-column prop="name" label="店铺名称" align="center">
      </el-table-column>
      <el-table-column prop="platform" label="店铺平台" align="center">
      </el-table-column>
      <el-table-column prop="tempDomain" label="临时域名" align="center">
      </el-table-column>
      <el-table-column prop="pluginName" label="插件名称" align="center">
        <template #header>
          <span class="red">* </span>插件名称
        </template>
        <template #default="{row,$index}">
          <el-form-item label="" :prop="$index + '.pluginName'" :rules="pluginName">
            <el-input v-model="row.pluginName" clearable maxlength="10"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="插件金额" align="center" width="250px">
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
      <el-table-column prop="date" label="插件有效期" align="center" width="400px">
        <template #header>
          <span class="red">* </span>续费有效期
        </template>
        <template #default="{row ,$index}">
          <el-form-item label="" :prop="$index+'.date'" :rules="date">
            <el-date-picker v-model="row.date" style="width:380px" type="daterange" value-format="YYYY-MM-DD" unlink-panels range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间">
            </el-date-picker>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="edit" label="操作" align="center" width="100">
        <template #default="{row ,$index}">
          <span class="blue pointer" @click="addRows(row,$index)">增加</span>
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
import { changeCheck } from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
import { checkNumber_2 } from '@/utils/ruleOptions.js'
export default {
  props:{
    backRoute:{}
  },
  setup(props) {
    const state = reactive({
      data: [],
      formRef: null,
    })
    onMounted(() => {
      state.data = storage.get('shopdata')
      state.data.forEach(item => {
        item.company = 0
      })
    })

    const rules = {
      pluginName: requiredValue('请输入插件名称'),
      amount: [
        requiredValue('请输入插件金额'),
        {
          validator: (rule, value, callback) => {
            const row = state.data[rule.field.split('.')[0]]
            if (row.company == 1) {
              if (value < 0 || value > 9999999.99) {
                return callback('请输入0到9999999.99之间的数字')
              } else {
                return callback()
              }
            } else {
              if (value < 0 || value > 999999.99) {
                return callback('请输入0到999999.99之间的数字')
              } else {
                return callback()
              }
            }
          },
          trigger: 'blur'
        },
        { validator: checkNumber_2, trigger: ['blur', 'change'] }
      ],
      date: [{ required: true, message: '请选择日期', trigger: ['change', 'blur'] },
        {
          validator: (rule, value, callback) => {
            let month = new Date().getMonth() + 1
            let year = new Date().getFullYear()
            let minDate = new Date(`${year}-${month}-1 00:00:00`).getTime()
            if (new Date(value[0]).getTime() < minDate) {
              callback('有效期的开始时间所属月度不得早于当月度')
            } else {
              callback()
            }
          }
        }
      ],
    }

    function submit() {
      if (!state.data.length) return ElMessage.error('当前无数据')
      state.formRef.validate().then(_ => {
        let arr = []
        state.data.forEach(item => {
          arr.push({
            pluginName: item.pluginName,
            shopId: item.shopId,
            company: item.company,
            amount: item.amount,
            startTime: item.date[0] +' 00:00:00',
            endTime: item.date[1]+' 23:59:59',
          })
        })
        const data = {
          changeType: 3,
          shopChangeDTOS: arr
        }
        changeCheck(data).then(res => {
          if (typeof res.data == 'string') {
            ElMessage.success('增加成功')
            props.backRoute()
          } else {
            state.tipsData = res.data
            state.tipsOpen = true
          }
        })
      })
    }

    function delRow(i) {
      state.data.splice(i, 1)
    }

    function addRows(r,i){
      let data = {...r}
      data.date = ''
      data.company = 0
      data.amount = ''
      data.pluginName = ''
      state.data.splice(i+1,0,data)
    }
    return {
      ...toRefs(state),
      ...rules,
      delRow,
      submit,
      addRows
    }
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: red;
}

.blue {
  color: #1890ff;
  margin-right: 8px;
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
