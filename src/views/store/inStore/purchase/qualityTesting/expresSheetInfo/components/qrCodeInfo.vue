<!--
 * @Descripttion:
 * @version:
 * @Author: 韦剑
 * @Date: 2021-07-15 14:42:56
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-22 19:56:58
-->
<template>
  <el-dialog title="定制内容" v-model="ifShow" customClass="my-dialog" :width="958" top="5vh" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="qrCodeInfoView">
      <el-form :model="form" ref="formRef" class="elForm">
        <el-table :data="purchaseInfo.custInfo" style="width: 100%" height="300" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
          <el-table-column prop="custName" label="规格名称"></el-table-column>
          <el-table-column prop="custValue" label="规格值" className="my-cell">
            <template #default="scope">
              <el-popover placement="right-start" trigger="hover" width="auto" v-if="scope.row.type == 1">
                <el-image style="width: 400px; height: 400px" :src="scope.row.custValue" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 70px" :src="scope.row.custValue" fit="contain"></el-image>
                </template>
              </el-popover>
              <div v-else>{{scope.row.custValue}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="infoHead">
          <div class="head_left">
            <span>订单号：{{purchaseInfo.transactionId}}</span>
            <span>仓库：万众智谷仓库</span>
            <span>经办人：{{userInfo.fullName}}</span>
          </div>
          <div class="head_right">
            <a @click="assignmentQualifiedNum">合格数=到货数</a>
          </div>
        </div>
        <el-table :data="[purchaseInfo.mainGoodsInfo]" border style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
          <el-table-column prop="mainImg" label="图片" :resizable="false" :width="91" className="my-cell">
            <template #default="scope" style="position: relative;">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 400px; height: 400px" :src="scope.row.mainImg" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 60px; height: 60px" :src="scope.row.mainImg" fit="contain"></el-image>
                </template>
              </el-popover>
              <!-- <el-tag size="small" type="warning" class="tag" v-if="scope.row.purchaseStatus == 0">未入库</el-tag> -->
              <el-tag size="small" type="warning" class="tag" v-if="scope.row.purchaseStatus == 1 || scope.row.purchaseStatus == 0">未入库</el-tag>
              <el-tag size="small" type="success" class="tag" v-if="scope.row.purchaseStatus == 2">部分入库</el-tag>
              <el-tag size="small" class="tag" v-if="scope.row.purchaseStatus == 3">已入库</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="货品名称" :resizable="false" :width="100">
            <template #default="scope">
              <div class="textOverflow" :title="scope.row.goodsName">{{scope.row.goodsName}}</div>
            </template>
          </el-table-column>
          <el-table-column label="规格sku" :resizable="false" :width="200">
            <template #default="scope">
              <div class="textOverflow_2" :title="scope.row.goodsSku">{{scope.row.goodsSku}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="订单采购数量" :resizable="false" :width="90"></el-table-column>
          <el-table-column label="入库信息" :resizable="false" :width="105">
            <template #default="scope">
              <div><span style="margin-right: 10px">已入库</span>{{scope.row.arrivalNum}}</div>
              <div><span style="margin-right: 10px">未入库</span>{{scope.row.num - scope.row.arrivalNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="到货数量" :resizable="false">
            <template #default="scope">
              <el-form-item prop="arrivalNum">
                <el-input-number size="small" :precision="0" v-model="form.arrivalNum" style="width: 90px" controls-position="right" :min="1" :max="scope.row.num - scope.row.arrivalNum" @input="arrivalNumInput" @blur="arrivalNumBlur"></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="ske" label="本次合格" :resizable="false">
            <template #default>
              <el-form-item prop="qualifiedNum">
                <el-input-number size="small" :precision="0" v-model="form.qualifiedNum" style="width: 90px" controls-position="right" :min="0" :max="form.arrivalNum" @blur="qualifiedNumBlur"></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <div class="formBox">
          <el-form>
            <el-form-item label="备注:">
              <el-input type="textarea" :rows="3" placeholder="请输入备注信息" v-model="form.textarea" :maxlength="60" class="textarea"> </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div style="text-align:right; padding: 16px 30px" :style="{ 'color': distributableNumNow >= 0 ? '#000' : 'red' }">分配余量：{{distributableNumNow}}</div>
        <el-table :data="purchaseInfo.relPackage" border style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
          <el-table-column prop="packageId" label="包裹号码" :resizable="false" :width="330">
            <template #default="scope">
              <div class="flex">
                <div class="textOverflow" style="width: 120px" :title="scope.row.packageId">
                  {{scope.row.packageId}}
                </div>
                <div class="tagBox">
                  <el-tag type="warning" size="small" v-if="scope.row.priorityFlag">优先</el-tag>
                  <el-tag size="small" v-if="scope.row.deductFlag == 0">不扣库存</el-tag>
                  <el-tag effect="dark" size="small">{{packageStatus(scope.row.packageStatus)}}</el-tag>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="包裹类型" :resizable="false">
            <template #default="scope">
              <div>
                {{packageType(scope.row.packageType)}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="logisticsInfo" label="物流信息" :resizable="false" :width="180">
            <template #default="scope">
              <div class="textOverflow_2" :title="scope.row.logisticsInfo">
                {{scope.row.logisticsInfo ? scope.row.logisticsInfo : '无'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="num2" label="商品数量\到货数量" :resizable="false">
            <template #default="scope">
              <div>
                {{scope.row.goodsQuantity}}/{{scope.row.arrivalQuantity}}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分配数量" :resizable="false">
            <template #default="scope">
              <div v-if="!scope.row.distributable">-</div>
              <el-input-number size="small" v-model="scope.row.assignNum" style="width: 80%" controls-position="right" :min="0" :max="scope.row.goodsQuantity - scope.row.arrivalQuantity" :disabled="form.qualifiedNum == undefined" v-else @blur="assignNumBlur(scope.row.assignNum, scope.$index)"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <PrintUnqualifiedLabel v-if="ifShowComp" :parentForm="form" :parentInfo="purchaseInfo" @closeEvent="closeEvent2" @affirmEvent="$emit('affirmEvent')" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEvent">取 消</el-button>
        <el-button type="primary" @click="submitEvent" :loading="loading">保 存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs, computed, watch } from 'vue'
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { qualityTexting, unqualified } from '@/api/store.js'
import PrintUnqualifiedLabel from './printUnqualifiedLabel.vue'
import Moment from 'moment'
export default defineComponent({
  components: {
    PrintUnqualifiedLabel
  },
  props: {
    twicePurchaseInfo: {
      type: Object,
      default: {}
    }
  },
  emits: ['closeEvent', 'affirmEvent'],
  setup(props, context) {
    let ifShow = ref(true)
    let store = useStore()
    let userInfo = computed(() => store.state.user.userInfo)
    let state = reactive({
      purchaseInfo: props.twicePurchaseInfo,
      form: {
        arrivalNum: 0, // 到货数
        qualifiedNum: undefined, // 合格数
        textarea: '',
        checked: false,
      },
      ifShowComp: false,
      distributableNumAll: 0,
      loading: false
    })
    let formRef = ref(null)

    // 匹配包裹类型
    let packageType = computed(() => {
      return function (type) {
        switch (type) {
          case 1:
            return '单品单数'
          case 2:
            return '单品多数'
          case 3:
            return '多品多数'
        }
      }
    })

    // 匹配包裹状态
    let packageStatus = computed(() => {
      return function (status) {
        switch (status) {
          case 0:
            return '待审核'
          case 1:
            return '待处理'
          case 2:
            return '申请中'
          case 3:
            return '申请失败'
          case 4:
            return '申请成功'
          case 5:
            return '待打单有货'
          case 6:
            return '待打单缺货'
          case 7:
            return '待发货'
          case 8:
            return '已发货'
          case 9:
            return '未付款'
          case -1:
            return '更换物流待处理'
          case -2:
            return '更换待打单'
          case -3:
            return '更换待发货'
          case -4:
            return '已发货'
        }
      }
    })

    // 判断包裹中各商品是否可分配，并处理relPackage的数据
    let initRelPackage = () => {
      // 1、包裹有“不扣库存”标识，“分配数量”为‘-’。 
      // 2、包裹有“已发货”标识，“分配数量”为‘-’。 
      // 3、采购数量=到货数量，“分配数量”为‘-’。
      state.form.arrivalNum = state.purchaseInfo.mainGoodsInfo.num - state.purchaseInfo.mainGoodsInfo.arrivalNum
      if (state.purchaseInfo.mainGoodsInfo.num == 1) state.form.qualifiedNum = 1
      state.purchaseInfo.relPackage.forEach(item => {
        if (item.deductFlag == 0 || [8, -1, -2, -3, -4].includes(item.packageStatus) || item.goodsQuantity == item.arrivalQuantity) {
          item.distributable = false
        } else {
          item.distributable = true
        }
      })
    }

    onMounted(() => {
      initRelPackage()
    })

    // 每次更新分配余量总量时，给每个商品自动分配余量
    let distributableGoods = (distributableNumAll) => {
      let distributableNumNow = distributableNumAll // 记录当前剩余分配余额
      state.purchaseInfo.relPackage.forEach((item, index) => {
        if (item.distributable) { // 可扣库存的商品
          item.assignNum = 0
          if (distributableNumNow > 0) { // 未分配完
            let num = item.goodsQuantity - item.arrivalQuantity // 当前商品可分配数
            if (num <= distributableNumNow) {
              item.assignNum = num
              distributableNumNow = distributableNumNow - num
            } else {
              item.assignNum = distributableNumNow
              distributableNumNow = 0
            }
          }
        }
      })
    }

    // 合格数变化时重新计算可分配余量总量
    watch(() => state.form.qualifiedNum, (newVal, oldVal) => {
      if (newVal == undefined) {
        state.distributableNumAll = 0
        state.purchaseInfo.relPackage.forEach(item => {
          item.assignNum = 0
        })
        return false
      }
      let num = 0 // 需求量:所有采购总量-所有到货总量
      state.purchaseInfo.relPackage.forEach((item, index) => {
        if (item.distributable) {
          num = num + (item.goodsQuantity - item.arrivalQuantity)
        }
      })
      if (newVal <= num) { // 若合格数小于等于需求量
        state.distributableNumAll = newVal
      } else { // 否则分配余量等于需求量
        state.distributableNumAll = num
      }
      distributableGoods(state.distributableNumAll)
    })

    // 各商品分配时重新计算分配余量
    let distributableNumNow = computed(() => {
      let num = 0 // 当前所有商品分配总量
      state.purchaseInfo.relPackage.forEach((item, index) => {
        if (item.distributable) num = num + item.assignNum
      })
      return state.distributableNumAll - num
    })

    // 合格数=到货数
    let assignmentQualifiedNum = () => {
      formRef.value.clearValidate(['qualifiedNum'])
      state.form.qualifiedNum = state.form.arrivalNum
    }

    // 到货数更改的监听事件
    let arrivalNumInput = () => {
      state.form.qualifiedNum = undefined
    }

    //到货数失去焦点
    let arrivalNumBlur = () => {
      if (state.form.arrivalNum == undefined) state.form.arrivalNum = 1
    }

    //合格数失去焦点
    let qualifiedNumBlur = () => {
      if (state.form.qualifiedNum == undefined) state.form.qualifiedNum = 0
    }

    //分配数量失去焦点
    let assignNumBlur = (value, index) => {
      if (value == undefined) state.purchaseInfo.relPackage[index].assignNum = 0
    }

    let closeEvent = () => {
      context.emit('closeEvent')
    }

    // 监听合格数，同步不合格标签状态
    watch(() => state.form.qualifiedNum, (newVal) => {
      let { qualifiedNum, arrivalNum } = state.form
      if (qualifiedNum == undefined || qualifiedNum == arrivalNum) {
        state.form.checked = false
      }
    })

    // 打印不合格标签
    let printLabel = () => {
      return new Promise((relove, reject) => {
        let { arrivalNum, qualifiedNum, checked } = state.form
        let { goodsName, goodsSku } = state.purchaseInfo.mainGoodsInfo
        if (checked) {
          let params = {
            goodsName,
            goodsSku,
            num: arrivalNum - qualifiedNum,
            shelfPosition: '无',
            checkBy: userInfo.value.fullName,
            checkTime: Moment().format('YYYY-MM-DD H:mm:ss')
          }
          unqualified(params).then(res => {
            if (res.code == 200) {
              window.open(res.data)
              relove()
            } else {
              ElMessage.error(res.message)
            }
          }).catch(err => {
            ElMessage.error(err.message)
          })
        } else {
          relove()
        }
      })

    }

    let saveEvent = () => {
      let { arrivalNum, qualifiedNum, textarea } = state.form
      let stockInfo = []
      state.purchaseInfo.relPackage.forEach((item, index) => {
        let obj = {
          packageId: item.packageId,
          num: item.assignNum,
          deductFlag: item.deductFlag,
          goodsQuantity: item.goodsQuantity,
          arrivalQuantity: item.arrivalQuantity
        }
        stockInfo.push(obj)
      })
      let { goodsId, ivtPurchaseDetailId, goodsName, goodsSku, mainImg } = state.purchaseInfo.mainGoodsInfo
      let params = {
        goodsName,
        goodsSku,
        mainImg,
        num: arrivalNum,
        arrivalNum: qualifiedNum,
        remark: textarea,
        goodsId,
        ivtPurchaseDetailId,
        stockInfo,
        warehouseId: 1
      }
      state.loading = true
      qualityTexting(params).then((res) => {
        state.loading = false
        if (res.code == 200) {
          ElMessage.success({ message: '提交成功！', type: 'success' })
          // 二次扫描时，B商品的所有包裹对应的一次扫描的包裹内的B商品的到货数需加上二次扫描的b商品的分配数量
          let goodsId_2 = state.purchaseInfo.mainGoodsInfo.goodsId
          let expresSheetInfo = store.getters.purchaseInfo
          state.purchaseInfo.relPackage.forEach(items => {
            if (items.assignNum > 0) { // 分配数量>0
              expresSheetInfo.relPackage.forEach(item => {
                if (items.packageId == item.packageId) {
                  item.relGoodsInfo.forEach(it => {
                    if (goodsId_2 == it.goodsId) {
                      it.arrivalQuantity = it.arrivalQuantity + items.assignNum
                    }
                  })
                }
              })
            }
          })
          expresSheetInfo.relPackage.forEach(item => {
            res.data.relPackageInfo.forEach(it => {
              if (item.packageId == it.packageId) {
                item.packageStatus = it.packageStatus
                item.printCount = it.printCount
              }
            })
          })
          store.dispatch('store/setPurchaseInfoActions', expresSheetInfo)
          context.emit('affirmEvent')
        }
      }).catch(({ timeId, message }) => {
        state.loading = false
        clearTimeout(timeId)
        ElMessage.error(message)
      })
    }

    let closeEvent2 = () => {
      state.ifShowComp = false
    }

    let submitEvent = () => {
      let { arrivalNum, qualifiedNum } = state.form
      if (arrivalNum == undefined) {
        ElMessage.error('请输入商品到货数量！')
        return false
      }
      if (qualifiedNum == undefined) {
        ElMessage.error('请输入商品合格数量！')
        return false
      }
      if (distributableNumNow.value !== 0) {
        ElMessage.error('包裹商品分配错误！分配余量必须等于0！')
        return false
      }
      if (qualifiedNum < arrivalNum) { // 存在不合格
        state.ifShowComp = true
      } else { // 直接入库
        saveEvent()
      }
    }

    return {
      ifShow,
      userInfo,
      formRef,
      ...toRefs(state),
      packageType,
      packageStatus,
      assignmentQualifiedNum,
      arrivalNumInput,
      qualifiedNumBlur,
      arrivalNumBlur,
      assignNumBlur,
      distributableGoods,
      distributableNumNow,
      closeEvent,
      saveEvent,
      closeEvent2,
      submitEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.qrCodeInfoView {
  max-height: 700px;
  overflow-y: scroll;
  padding-bottom: 5px;
  .infoHead {
    width: 100%;
    font-size: 14px;
    padding: 0 30px;
    height: 46px;
    line-height: 46px;
    display: flex;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.65);
    font-weight: 600;
    .head_left {
      span {
        margin-right: 16px;
      }
    }
    a {
      color: #409eff;
    }
  }
  .tag {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .formBox {
    padding: 20px 20px 0 20px;
    .form {
      display: flex;
      justify-content: space-between;
      .textarea {
        flex: 1;
        margin-left: 20px;
        margin-bottom: 10px;
      }
    }
  }
  .flex {
    display: flex;
    .tagBox {
      .el-tag {
        margin-left: 10px;
      }
    }
  }
}
.el-form-item {
  margin-bottom: 0px !important;
}
.is-error {
  margin-bottom: 20px !important;
}
</style>
