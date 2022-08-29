<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 14:10:27
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-25 21:55:21
-->

<template>
  <div class="extraHeader">
    <el-row>
      <el-col :span="6">
        <div class="left">
          <el-tooltip placement="top">
            <template #content>
              <p style="cursor:pointer" v-copy="scope.row.packageId">复制</p>
            </template>
            <div class="orderNum">{{ scope.row.packageId }}</div>
          </el-tooltip>
          <div class="tagBox">
            <template v-for="(item, index) in remarkList" :key="index">
              <el-popover placement="top" :width="800" trigger="hover">
                <template #reference>
                  <div class="tag" :style="`background:${item.color}`" @mouseenter="getPackageRemarks(item.id)">
                    {{ item.word }}
                  </div>
                </template>

                <el-table :data="packageList">
                  <el-table-column align="center" min-width="300" property="content" label="内容">
                    <template #default="scope">
                      <span>{{scope.row.content}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" width="170" property="createTime" label="时间"></el-table-column>
                  <el-table-column align="center" width="90" property="typeName" label="类型"></el-table-column>
                  <el-table-column align="center" width="90" property="createUser" label="操作人"></el-table-column>
                </el-table>
              </el-popover>
            </template>

            <el-popover placement="top" :width="200" trigger="hover" v-if="scope.row.type ===2">
              <template #reference>
                <div class="remarkBF">补</div>
              </template>
              <p>
                补发包裹，{{
									scope.row.deductFlag == 1
										? '扣库存'
										: '不扣库存'
								}}
              </p>
              <p>补发原因:{{ scope.row.remark }}</p>
            </el-popover>

            <el-popover placement="top" :width="200" trigger="hover" v-if="scope.row.type ===3">
              <template #reference>
                <div class="remarkBF">补</div>
              </template>
              <p>
                补发赠品，{{
									scope.row.deductFlag == 1
										? '扣库存'
										: '不扣库存'
								}}
              </p>
              <p>补发原因:{{ scope.row.remark }}</p>
            </el-popover>

            <el-popover placement="top" :width="200" trigger="hover" v-if="scope.row.blacklistFlag ===1">
              <template #reference>
                <div class="black">黑</div>
              </template>
              <p>黑名单:</p>
              <p>{{ scope.row.blacklistReason }}</p>
            </el-popover>
            <div class="yellowGreen" v-if="scope.row.type === 1 && scope.row.packageRels.every(v=>!v.remark)">手</div>
            <el-popover placement="top" :width="200" trigger="hover" v-if="scope.row.type === 1 && scope.row.packageRels.some(v=>v.remark)">
              <template #reference>
                <div class="yellowGreen">
                  手
                </div>
              </template>
              <div>
                <p v-for="(v,i) in scope.row.packageRels" :key="i">{{v.remark}}</p>
              </div>
            </el-popover>

          </div>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="ordertType">
          <span style="color:#F4B500" v-if="scope.row.packageStatus === 0">待审核</span>
          <span style="color:#60A7FF" v-if="scope.row.packageStatus === 1">待处理</span>
          <span style="color:#60A7FF" v-if="scope.row.packageStatus === 2">申请中</span>
          <span style="color:#ED6060" v-if="scope.row.packageStatus === 3">申请失败</span>
          <span style="color:#6ACA00" v-if="scope.row.packageStatus === 4">申请成功</span>
          <span style="color:#60A7FF" v-if="scope.row.packageStatus === 5">待打单 (<span style="color:#7ED000">有货</span>) </span>
          <span style="color:#60A7FF" v-if="scope.row.packageStatus === 6">待打单 (<span style="color:#E08C00">缺货</span>) </span>
          <span style="color:#44D7B6" v-if="scope.row.packageStatus === 7">待发货</span>
          <span style="color:#6ACA00" v-if="scope.row.packageStatus === 8">已发货 <span style="margin-left:10px">重量：{{ scope.row.deliveryWeight }}g</span></span>
          <span :style="`color:${getColor()}`" v-if="scope.row.packageStatus === 9">
            {{getTitle(9)}}
          </span>
          <span style="color:#44D7B6" v-if="scope.row.packageStatus === 10">已退款</span>
          <span style="color:#32ADF4" v-if="scope.row.packageStatus === -1">{{status(0)}}</span>
          <span style="color:#78B1FF" v-if="scope.row.packageStatus === -2">{{status(1)}}</span>
          <span style="color:#44D7B6" v-if="scope.row.packageStatus === -3">{{status(2)}}</span>
          <span style="color:#6ACA00" v-if="scope.row.packageStatus === -4">{{status(3)}} <span style="margin-left:10px">重量：{{ scope.row.deliveryWeight }}g</span> </span>
          <p v-if="showSheleve">
            {{ scope.row.reason }}
          </p>
        </div>

      </el-col>
      <el-col :span="6" class="right">
        <div class="orderOption">
          <div class="optionSwitch" v-if="isShow('priorityFlag') && showSwitch" v-permission="'orderManagement/priorityFlag'">
            <span class="switchTitle">优先分配库存</span>

            <el-switch style="display: block" v-model="priorityFlag" :active-value="1" :inactive-value="0" active-color="#1890FF" :beforeChange="changePr" :disabled="isDisabled('priorityFlag')" />
          </div>
          <div class="optionSwitch" v-if="isShow('forbidFlag') && showSwitch" v-permission="'orderManagement/forbidFlag'">
            <span class="switchTitle">禁止处理</span>
            <el-switch style="display: block" v-model="forbidFlag" :active-value="1" :inactive-value="0" active-color="#1890FF" :beforeChange="changeFor" />
          </div>

          <div class="optionSwitch" v-if="isShow('deductFlag') && showSwitch" v-permission="'orderManagement/deductFlag'">
            <span class="switchTitle">扣库存</span>
            <el-switch style="display: block" v-model="deductFlag" :active-value="1" :inactive-value="0" active-color="#1890FF" :beforeChange="changeDe" :disabled="isDisabled('deductFlag')" />
          </div>

          <div class="optionSwitch" v-if="isChangeLogist">
            <span class="switchTitle">打单</span>
            <el-switch style="display: block" v-model="printFlag" :active-value="1" :inactive-value="0" active-color="#1890FF" :beforeChange="changePrint" :disabled="isDisabled('printFlag')" />
          </div>
        </div>

        <div v-if="allShelev" class="shelev">
          <p>(搁置中)</p>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onMounted,
  computed,
  watch,
  inject,
  getCurrentInstance
} from 'vue'
import btnFunList from '@/views/order/orderManagement/util/btnFunList.js'
import orderOptions from '../../util/options.js'
import optionsDisabled from '../../util/optionsDisabled.js'
import { useStore } from 'vuex'
import {
  updatePriorityFlag,
  cancelPriorityFlag,
  updateDeductFlag,
  cancelDeductFlag,
  cancelForbidFlag,
  updateForbidFlag,
  isPrint,
  packageRemarks
} from '@/api/order/orderManagement.js'
export default {
  props: {
    type: {
      type: String,
      default: 'allOrder'
    },
    scope: {
      type: Object,
      default: null
    },
    spans: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const { proxy } = getCurrentInstance()
    const store = useStore()
    const formOptions = inject('formOptions')
    // 获取的formOptions 组件
    const orderTable = inject('orderTable')
    // 获取的orderTable 组件
    const btnFunction = btnFunList(orderTable, formOptions)
    const isChangeLogist = computed(() => store.getters.isChangeLogist)
    let disabledFun = optionsDisabled()
    const data = reactive({
      priorityFlag: 0,
      forbidFlag: 0,
      deductFlag: 0,
      printFlag: 0,
      packageList: []
    })
    const showSwitch = computed(() => {
      if (store.getters.isChangeLogist) return false
      if (store.getters.merageStatus !== '0') return false
      return true
    })

    const remarkList = computed(() => {
      if (props.scope.row?.packageRemarkTypes)
        return props.scope.row?.packageRemarkTypes
      return []
    })

    watch(
      () => props.scope.row,
      (a, b) => {
        data.priorityFlag = a.priorityFlag
        data.forbidFlag = a.forbidFlag
        data.deductFlag = a.deductFlag
        data.printFlag = a.printFlag
      }
    )

    const row = computed(() => props.scope.row)

    const getTitle = val => {
      let text = ''
      if (val == 9) {
        let order = row.value.packageRels[0]
        const { paymentStatus } = order
        switch (paymentStatus) {
          case 'voided':
            text = '取消订单'
            break
          case 'unpaid':
            text = '待支付'
            break
          case 'pay_fail':
            text = '支付失败'
            break
          case 'pending':
            text = '支付处理中'
            break
          case 'refunded':
            text = '未付款'
            break
        }
      }
      return text
    }

    const getColor = val => {
      let color = ''
      let order = row.value.packageRels[0]
      const { paymentStatus } = order
      switch (paymentStatus) {
        case 'voided':
          color = '#B620E0'
          break
        case 'unpaid':
          color = '#5878F6'
          break
        case 'pay_fail':
          color = '#ED6060'
          break
        case 'pending':
          color = '#32ADF4'
          break
      }
      return color
    }


    const isDisabled = type => {
      return disabledFun[type](null, props.scope.row, store.getters.orderType)
    } //是否disabled

    const parent = computed(() => {
      return props.scope.row
    })

    function confirm(text, callback) {
      proxy
        .$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(res => {
          callback()
        })

    } //封装的提示弹窗

    const changePr = val => {
      return new Promise((resolve, reject) => {
        const { packageId } = parent.value
        if (data.priorityFlag == 0) {
          confirm('确认优先分配库存？', () => {
            updatePriorityFlag({ packageIds: packageId })
              .then(res => {
                if (res.code == 200) {
                  proxy.$message.success(res.message)
                  formOptions.value.init()
                  data.priorityFlag = 1
                  return resolve(true)
                }
              })
              .catch(err => {
                return reject(new Error('error'))
                proxy.$notify.error({
                  title: '请求错误',
                  message: err.message
                })
              })
          })
        } else {
          confirm('确认正常分配库存？', () => {
            cancelPriorityFlag({ packageIds: packageId })
              .then(res => {
                if (res.code == 200) {
                  proxy.$message.success(res.message)
                  formOptions.value.init()
                  data.priorityFlag = 0
                  return resolve(true)
                }
              })
              .catch(err => {

                return reject(new Error('error'))
              })
          })
        }
      })
    }
    const changeFor = val => {
      return new Promise((resolve, reject) => {
        const { packageId } = parent.value
        if (data.forbidFlag == 0) {
          confirm(
            '禁止处理，当前包裹将不可执行其他任何操作，确认禁止处理？   ',
            () => {
              updateForbidFlag({ packageIds: packageId })
                .then(res => {
                  if (res.code == 200) {
                    proxy.$message.success(res.message)
                    formOptions.value.init()
                    data.forbidFlag = 1
                    return resolve(true)
                  }
                })
                .catch(err => {

                  return reject(new Error('error'))
                })
            }
          )
        } else {
          confirm('确认正常处理？', () => {
            cancelForbidFlag({ packageIds: packageId })
              .then(res => {
                if (res.code == 200) {
                  proxy.$message.success(res.message)
                  formOptions.value.init()
                  data.forbidFlag = 0
                  return resolve(true)
                }
              })
              .catch(err => {

                return reject(new Error('error'))
              })
          })
        }
      })
    }

    const changeDe = val => {
      return new Promise((resolve, reject) => {
        const { packageId } = parent.value
        if (data.deductFlag == 0) {
          confirm('确认正常扣库存？', () => {
            updateDeductFlag({ packageIds: packageId })
              .then(res => {
                if (res.code == 200) {
                  proxy.$message.success(res.message)
                  formOptions.value.init()
                  data.deductFlag = 1
                  return resolve(true)
                }
              })
              .catch(err => {

                return reject(new Error('error'))
              })
          })
        } else {
          confirm('确认不扣库存？', () => {
            cancelDeductFlag({ packageIds: packageId })
              .then(res => {
                if (res.code == 200) {
                  proxy.$message.success(res.message)
                  formOptions.value.init()
                  data.deductFlag = 0
                  return resolve(true)
                }
              })
              .catch(err => {
                return reject(new Error('error'))
                proxy.$notify.error({
                  title: '请求错误',
                  message: err.message
                })
              })
          })
        }
      })
    }

    const changePrint = val => {
      return new Promise((resolve, reject) => {
        if (val) {
          confirm('确认不要打单？', () => {
            upadate(resolve, reject)
          })
        } else {
          confirm('确认要打单？', () => {
            upadate(resolve, reject)
          })
        }
      })

      function upadate(resolve, reject) {
        const { packageId } = parent.value
        isPrint({ packageId })
          .then(res => {
            if (res.code == 200) {
              proxy.$message.success(res.message)
              formOptions.value.init()
              data.priorityFlag = 1
              return resolve(true)
            }
          })
          .catch(err => {
            return reject(new Error('error'))

          })
      }
    }

    const isShow = types => {
      const { orderTabType } = store.getters
      const list = orderOptions[orderTabType].switch
      if (list.indexOf(types) !== -1) {
        return true
      } else {
        return false
      }
    } // 是否显示开关

    const showSheleve = computed(() => {
      const { orderTabType } = store.getters
      if (props.scope.row.layFlag == 1) return true
      return false
    }) // 显示搁置原因

    const getPackageRemarks = typeId => {
      const { packageId } = parent.value
      let param = {
        packageId,
        typeId
      }
      packageRemarks(param).then(res => {
        if (res.code == 200) {
          data.packageList = res.data
        }
      })
    }
    const allShelev = computed(() => {
      const { layFlag } = parent.value
      const { orderType } = store.getters
      if (layFlag == 1 && orderType == '') return true
      return false
    })

    const status = val => {
      let name = '已发货'
      let list = ['更换待处理', '更换待打单', '更换待发货', '更换已交运成功']
      const { orderType, isChangeLogist } = store.getters
      if (orderType == '') return list[val]
      if (orderType == 8 && !isChangeLogist) return name
      if (orderType == 8 && isChangeLogist) return list[val]
    }


    onMounted(() => {
      let a = props.scope.row
      data.priorityFlag = a.priorityFlag
      data.forbidFlag = a.forbidFlag
      data.deductFlag = a.deductFlag
      data.printFlag = a.printFlag
    })
    return {
      ...toRefs(data),
      changeDe,
      changePr,
      changeFor,
      isShow,
      showSwitch,
      isChangeLogist,
      changePrint,
      isDisabled,
      showSheleve,
      remarkList,
      getPackageRemarks,
      getTitle,
      allShelev,
      status,
      getColor
    }
  }
}
</script>

<style lang="scss" scoped>
.extraHeader {
  min-height: 40px;
  padding: 0 15px;
  cursor: pointer;
  background: #f5f7fa;
  .ordertType {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 40px;
  }
  .orderNum {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    min-height: 40px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
  }
  .orderOption {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-height: 40px;

    .optionSwitch {
      display: flex;
      align-items: center;
      margin-right: 5px;
      .switchTitle {
        margin-right: 5px;
        font-size: 12px;
      }
      :deep(.el-switch) {
        height: auto;
      }
    }
  }
}
.left {
  display: flex;
  align-items: center;
}
.tagBox {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  .tag {
    width: 26px;
		height: 21px;
    padding: 1px 6px;
    color: white;
    margin-left: 5px;
    border-radius: 4px;
  }
}
.remarkBF {
  background: #9e9e99;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 4px;
  color: white;
  margin-left: 5px;
}
.black {
  background: black;
  padding: 1px 6px;
  color: white;
  margin-left: 5px;
}
.yellowGreen {
  background: yellowgreen;
  padding: 1px 6px;
  color: white;
  margin-left: 5px;
  border-radius: 2px;
}
.right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.shelev {
  text-align: right;
  color: #9e9e99;
}
</style>
