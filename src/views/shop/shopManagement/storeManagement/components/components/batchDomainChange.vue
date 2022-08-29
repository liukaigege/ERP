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
      <el-table-column prop="newDomain" label="主域名" align="center">
        <template #header>
          <span class="red">* </span>主域名
        </template>
        <template #default="{row,$index}">
          <el-form-item label="" :prop="$index + '.newDomain'" :rules="domain">
            <el-input v-model="row.newDomain" placeholder="" clearable :disabled="row.domainStatus==1"></el-input>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="domainTime" label="域名到期时间" align="center">
        <template #default="{row}">
          <span :class="{red:row.domStatus}">{{row.domainEndTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="center" width="220px">
        <template #header>
          <span class="red">* </span>金额
        </template>
        <template #default="{row,$index}">
          <el-form-item label="" :prop="$index + '.amount'" :rules="amount">
            <div class="flex">
              <div class="ipt">
                <el-input v-model="row.amount"></el-input>
              </div>
              <div class="sle">
                <el-select v-model="row.company" @change="row.amount = 0">
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
      <el-table-column prop="domainStatus" label="域名状态" align="center" width="120px">
        <template #header>
          <span class="red">* </span>域名状态
        </template>
        <template #default="{row,$index}">
          <el-form-item label="" :prop="$index+'.domainStatus'" :rules="domainStatus">
            <el-select v-model="row.domainStatus" clearable>
              <el-option label="启用" :value="0">
              </el-option>
              <el-option label="停用" :value="1" :disabled="row.newDomain!=row.domain.replace(/^(http|https):\/\//, '')">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="启用/停用时间" align="center" width="250px">
        <template #header>
          <span class="red">* </span>启用/停用时间
        </template>
        <template #default="{row,$index}">
          <el-form-item label="" :prop="$index+'.domainTime'" :rules="domainTime">
            <el-date-picker v-model="row.domainTime" :disabled="!row.domainStatus&&row.domainStatus!=0" :validate-event="false" style="width:290px" type="date" value-format="YYYY-MM-DD HH:mm:ss" unlink-panels range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间">
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
  <tips v-if="tipsOpen" :data="tipsData" />
</div>
</template>

<script>
import { storage } from '@/utils/storage.js'
import { onMounted, reactive, toRefs, provide } from 'vue'
import { changeCheck, change, domainIsRepeat } from '@/api/goods/shop.js'
import tips from '../renewDialog/components/tips.vue'
import { requiredValue, moneyRules, ruleUrl } from '@/views/shop/shopRules/rules.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    backRoute: {}
  },
  components: { tips },
  setup(props) {
    const state = reactive({
      data: [],
      formRef: null,
      tipsData: [],
      tipsOpen: false
    })
    onMounted(() => {
      state.data = storage.get('shopdata')
      state.data.forEach(item => {
        item.company = 1
        item.newDomain = item.domain.replace(/^(http|https):\/\//, '')
      })
    })
    const rules = {
      domain: [...ruleUrl('请输入主域名'),
        {
          validator: (rule, value, callback) => {
            const row = state.data[rule.field.split('.')[0]]
            let fd = state.data.filter(item => item.shopId != row.shopId)
            if (fd.some(item => item.newDomain == row.newDomain)) {
              callback('域名重复')
            } else {
              callback()
            }
          }
        }
      ],
      amount: [{
          validator: (rule, value, callback) => {
            const row = state.data[rule.field.split('.')[0]]
            if (row.newDomain == row.domain.replace(/^(http|https):\/\//, '') && !row.amount && typeof row.domainStatus != 'number' && !row.domainTime) {
              // 域名未做更改，且金额，状态，时间为空 则直接通过
              return callback()
            }
            if (!row.amount) return callback('请输入金额')
            const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[0-9][0-9]*\.\d{1,2})))$/
            if ((value && !reg.test(value)) || value < 0) {
              return callback(new Error('请输入数字最多保留两位小数!'))
            }
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
          trigger: ['change']
        },

      ],
      domainStatus: [{
        validator: (rule, value, callback) => {
          const row = state.data[rule.field.split('.')[0]]
          console.log(row);
          if (row.newDomain == row.domain.replace(/^(http|https):\/\//, '') && !row.amount && typeof row.domainStatus != 'number' && !row.domainTime) {
            // 域名未做更改，且金额，状态，时间为空 则直接通过
            return callback()
          }
          if (typeof row.domainStatus != 'number') {
            console.log(row.domainStatus);
            return callback('请选择状态')
          } else {
            callback()
          }
        },
        trigger: 'change'
      }],
      domainTime: [{
        validator: (rule, value, callback) => {
          const row = state.data[rule.field.split('.')[0]]
          if (row.newDomain == row.domain.replace(/^(http|https):\/\//, '') && !row.amount && typeof row.domainStatus != 'number' && !row.domainTime) {
            // 域名未做更改，且金额，状态，时间为空 则直接通过
            return callback()
          }

          if (!row.domainTime) return callback('时间不能为空')
          let domainOpenTime = row.domainOpenTime
          let domainEndTime = row.domainEndTime
          let nowTime = new Date(row.domainTime).getTime()
          let oldOpenTime = new Date(row.domainOpenTime).getTime()
          let oldStartTime = new Date(row.domainStartTime).getTime()
          let oldEndTime = new Date(row.domainEndTime).getTime()
          let nowMonthTime = new Date(`${new Date().getFullYear()}-${new Date().getMonth()+1}-01 00:00:00`).getTime()
            domainIsRepeat({ domain: 'https://' + row.newDomain }).then(res => {
              if (typeof res.data == 'object') {
                domainOpenTime = res.data.openTime
                domainEndTime = res.data.endTime
                oldOpenTime = new Date(domainOpenTime).getTime()
                oldEndTime = new Date(domainEndTime).getTime()
              }
              if (row.domainStatus == 0) {
                if (nowTime < nowMonthTime) {
                  callback('启用时间不得于当前月份')
                } else if (nowTime <= oldOpenTime) {
                  console.log(domainOpenTime);
                  callback('启用时间需晚于' + domainOpenTime.split(' ')[0])
                } else if (nowTime > oldEndTime) {
                  console.log(domainEndTime);
                  callback(`当前域名有效期的到期时间是${domainEndTime.split(' ')[0]}`)
                } else {
                  callback()
                }
              } else {
                // 停用逻辑 不得早于域名的开始时间 不得晚于域名的到期时间
                if (nowTime < oldStartTime || nowTime > oldEndTime) {
                  callback(`停用时间区间${row.domainStartTime.split(' ')[0]}~${row.domainEndTime.split(' ')[0]}`)
                } else {
                  callback()
                }
              }
            })

        },
        trigger: 'change'
      }, ]
    }

    function submit() {
      if (!state.data.length) return ElMessage.error('当前无数据')
      state.formRef.validate().then(_ => {
        let arr = []
        state.data.forEach(item => {
          console.log(item);
          if (item.amount) {
            arr.push({
              domain: 'https://' + item.newDomain,
              shopId: item.shopId,
              company: item.company,
              amount: item.amount,
              domainTime: item.domainTime,
              domainStatus: item.domainStatus
            })
          }
        })
        if (!arr.length) return ElMessage.error('部分信息未填写完整，请填写完成后再提交！')
        const data = {
          changeType: 1,
          shopChangeDTOS: arr
        }
        changeCheck(data).then(res => {
          if (typeof res.data == 'string') {
            ElMessage.success('变更成功')
            props.backRoute()
          } else {
            state.tipsData = res.data
            state.tipsOpen = true
          }
        })
      })
    }

    function towSubmit() {
      let arr = []
      state.data.forEach(item => {
        arr.push({
          domain: 'https://' + item.newDomain,
          shopId: item.shopId,
          company: item.company,
          amount: item.amount,
          domainTime: item.date + " 23:59:59",
          domainStatus: item.domainStatus
        })
      })
      const data = {
        changeType: 1,
        isBlock: 0,
        shopChangeDTOS: arr
      }
      change(data).then(res => {
        ElMessage.success('变更成功')
        props.data.domain = state.formData.domain
        closeTips()
      })
    }

    function closeTips() {
      state.tipsOpen = false
    }
    provide('towSubmit', towSubmit)
    provide('closeTips', closeTips)

    function delRow(i) {
      state.data.splice(i, 1)
    }
    return {
      ...toRefs(state),
      delRow,
      submit,
      ...rules,
      towSubmit

    }
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: red;
}

.flex {
  display: flex;

  .ipt {
    flex: 7;

  }

  .sle {
    flex: 5;
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
