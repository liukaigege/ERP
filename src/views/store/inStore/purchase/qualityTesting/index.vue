<!--
 * @Descripttion: 扫描二维码或输入物流单号后的质检页面
 * @version:
 * @Author: 韦剑
 * @Date: 2021-07-12 17:38:02
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-22 21:46:14
-->
<template>
  <div>
    <el-form :model="form" :rules="rules" ref="formRef">
      <div class="scanQecodeView">
        <div class="left">
          <div class="pageView">
            <div class="title">定制内容</div>
            <el-table :data="purchaseInfo.custInfo" style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
              <el-table-column prop="custName" label="规格名称"></el-table-column>
              <el-table-column label="规格值" className="my-cell">
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
          </div>
          <div class="pageView2">
            <div class="infoHead">
              <div class="head_left">
                <span>订单号：{{purchaseInfo.transactionId}}</span>
                <span>仓库：万众智谷仓库</span>
                <span>经办人：{{userInfo.fullName}}</span>
              </div>
              <div class="head_right">
                <a @click="assignmentQualifiedNum()">合格数=到货数</a>
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
                  <el-tag size="small" type="danger" class="tag" v-if="scope.row.purchaseStatus == 1 || scope.row.purchaseStatus == 0">未入库</el-tag>
                  <el-tag size="small" type="success" class="tag" v-if="scope.row.purchaseStatus == 2">部分入库</el-tag>
                  <el-tag size="small" class="tag" v-if="scope.row.purchaseStatus == 3">已入库</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="goodsName" label="货品名称" :resizable="false" :width="100">
                <template #default="scope" style="position: relative;">
                  <div class="textOverflow" :title="scope.row.goodsName">
                    {{scope.row.goodsName}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品sku" :resizable="false" :width="200">
                <template #default="scope" style="position: relative;">
                  <div class="textOverflow_2" :title="scope.row.goodsSku">{{scope.row.goodsSku}}</div>
                  <div class="textOverflow" :title="scope.row.skuCode">{{scope.row.skuCode}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="num" label="订单采购数量" :resizable="false" :width="110"></el-table-column>
              <el-table-column label="入库信息" :resizable="false" :width="130">
                <template #default="scope">
                  <div><span style="margin-right: 10px">已入库</span>{{scope.row.arrivalNum}}</div>
                  <div><span style="margin-right: 10px">未入库</span>{{scope.row.num - scope.row.arrivalNum}}</div>
                </template>
              </el-table-column>
              <el-table-column label="到货数量" :resizable="false">
                <template #default="scope">
                  <el-form-item prop="arrivalNum">
                    <el-input-number size="small" :precision="0" v-model="form.arrivalNum" style="width: 90%" controls-position="right" :min="1" :max="scope.row.num - scope.row.arrivalNum" @input="arrivalNumInput" @blur="arrivalNumBlur"></el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="本次合格" :resizable="false">
                <el-form-item prop="qualifiedNum">
                  <el-input-number size="small" :precision="0" v-model="form.qualifiedNum" style="width: 90%" controls-position="right" :min="0" :max="form.arrivalNum || 99999" @blur="qualifiedNumBlur"></el-input-number>
                </el-form-item>
              </el-table-column>
            </el-table>
            <div class="formBox">
              <el-form>
                <el-form-item label="备注:">
                  <div class="form">
                    <el-input type="textarea" :rows="3" placeholder="请输入备注信息" v-model="form.textarea" :maxlength="60" class="textarea"> </el-input>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="title">
            <div>关联包裹</div>
            <div v-if="distributableNumNow >= 0">分配余量: {{distributableNumNow}}</div>
            <div v-else style="color: red">分配余量: {{distributableNumNow}}</div>
          </div>
          <Table :columns="columns" :border="true" :tableData="purchaseInfo.relPackage" fieldName="relGoodsInfo">
            <template v-slot:extraHeader="scoped">
              <div class="extraHeader">
                <div class="textOverflow" :title="scoped.row.packageId">包裹号：{{scoped.row.packageId}}</div>
                <div>{{packageType(scoped.row.packageType)}}</div>
                <div class="textOverflow" :title="scoped.row.logisticsInfo">物流信息：{{scoped.row.logisticsInfo ? scoped.row.logisticsInfo : '无'}}</div>
                <el-tag type="warning" v-if="scoped.row.priorityFlag">优先</el-tag>
                <el-tag v-if="scoped.row.deductFlag == 0">不扣库存</el-tag>
                <el-tag effect="dark">{{packageStatus(scoped.row.packageStatus)}}</el-tag>
              </div>
            </template>
            <template v-slot:mainImg="scoped">
              <el-image style="width: 60px; height: 60px" :src="scoped.row.mainImg" fit="contain"></el-image>
            </template>
            <template v-slot:goodsName="scoped">
              <div class="goodsName textOverflow" :title="scoped.row.goodsName">{{scoped.row.goodsName}}</div>
            </template>
            <template v-slot:goodsSku="scoped">
              <div class="goodsSku textOverflow_2" :title="scoped.row.goodsSku">{{scoped.row.goodsSku}}</div>
              <div class="textOverflow" :title="scoped.row.skuCode">{{scoped.row.skuCode}}</div>
            </template>
            <template v-slot:goodsNum="scoped">
              <div class="goodsNum">{{scoped.row.goodsQuantity}}/{{scoped.row.arrivalQuantity}}</div>
            </template>
            <template v-slot:allocationNum="scoped">
              <div v-if="!scoped.row.distributable">-</div>
              <el-form-item v-else>
                <el-input-number size="small" :precision="0" v-model="scoped.row.assignNum" style="width: 90px" controls-position="right" :min="0" :max="scoped.row.goodsQuantity - scoped.row.arrivalQuantity" :disabled="form.qualifiedNum == undefined" @blur="assignNumBlur(scoped.row.assignNum, scoped.index, scoped.ind)"></el-input-number>
              </el-form-item>
            </template>
          </Table>
        </div>
      </div>
      <div class="footer">
        <el-button type="primary" style="margin-right: 4px" @click="submitEvent" :loading="loading">保存并继续</el-button>
        <el-popconfirm confirmButtonText='继续' title="取消将会清除界面输入数据，是否继续?" @confirm="cancelEvent">
          <template #reference>
            <el-button>取消</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-form>
    <PrintUnqualifiedLabel v-if="ifShow" :parentForm="form" @closeEvent="closeEvent" />
  </div>
</template>

<script>
import { ref, reactive, toRefs, watch, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { qualityTexting } from '@/api/store.js'
import Table from '@/components/elTable/index.vue'
import PrintUnqualifiedLabel from './components/printUnqualifiedLabel.vue'
import Moment from 'moment'
import { _debounce } from '@/utils/tool.js'
export default {
  setup() {
    let router = useRouter()
    let store = useStore()
    let route = useRoute()
    const batchNum = route.query.batchNum
    let userInfo = computed(() => store.state.user.userInfo)
    let purchaseInfo = computed(() => store.getters.purchaseInfo)
    let state = reactive({
      form: {
        arrivalNum: 0, // 到货数
        qualifiedNum: undefined, // 合格数
        remarkVal: 0,
        textarea: '',
      },
      value: false,
      rules: {
      },
      options: [
        {
          label: '图案错误',
          value: 1
        },
        {
          label: '刻字错误',
          value: 2
        },
        {
          label: '其他',
          value: 3
        }
      ],
      columns: [
        {
          title: '图片',
          key: 'mainImg',
          width: '92px'
        },
        {
          title: '货品名称',
          key: 'goodsName',
          width: '100px'
        },
        {
          title: '商品sku',
          key: 'goodsSku',
          width: '200px'
        },
        {
          title: '商品数量/到货数量',
          key: 'goodsNum',
          width: '105px'
        },
        {
          title: '分配数量',
          key: 'allocationNum',
          width: '102px'
        },
      ],
      distributableNumAll: 0,
      ifShow: false,
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
      // 4、包裹内其他商品，“分配数量”为‘-’
      // 5、order !== transactionId
      state.form.arrivalNum = purchaseInfo.value.mainGoodsInfo.num - purchaseInfo.value.mainGoodsInfo.arrivalNum
      if (purchaseInfo.value.mainGoodsInfo.num == 1) state.form.qualifiedNum = 1
      purchaseInfo.value.relPackage.forEach(item => {
        let arr = []
        item.relGoodsInfo.forEach((it, ind) => {
          if (item.deductFlag == 0 || [8, -1, -2, -3, -4].includes(item.packageStatus) || it.goodsQuantity == it.arrivalQuantity || it.goodsId !== purchaseInfo.value.mainGoodsInfo.goodsId || !purchaseInfo.value.transactionId.split(',').includes(it.orderId)) {
            it.distributable = false
          } else {
            it.distributable = true
          }
          if (it.goodsId == purchaseInfo.value.mainGoodsInfo.goodsId && it.orderId == purchaseInfo.value.transactionId) { // 同商品则调整排序到第一位
            arr = it
            item.relGoodsInfo.splice(ind, 1)
            item.relGoodsInfo.unshift(arr)
          }
        })
      })
    }

    // 每次更新分配余量总量时，给每个商品自动分配余量
    let distributableGoods = (distributableNumAll) => {
      let distributableNumNow = distributableNumAll // 记录当前剩余分配余额
      purchaseInfo.value.relPackage.forEach((item, index) => {
        item.relGoodsInfo.forEach((it, ind) => {
          if (it.distributable) { // 可扣库存的商品
            it.assignNum = 0
            if (distributableNumNow > 0) { // 未分配完
              let num = it.goodsQuantity - it.arrivalQuantity // 当前商品可分配数
              if (num <= distributableNumNow) {
                it.assignNum = num
                distributableNumNow = distributableNumNow - num
              } else {
                it.assignNum = distributableNumNow
                distributableNumNow = 0
              }
            }
          }
        })
      })
    }

    // 合格数变化时重新计算可分配余量总量
    watch(() => state.form.qualifiedNum, (newVal, oldVal) => {
      if (newVal == undefined) {
        state.distributableNumAll = 0
        purchaseInfo.value.relPackage.forEach((item, index) => {
          item.relGoodsInfo.forEach((it, ind) => {
            if (it.distributable) it.assignNum = 0
          })
        })
        return false
      }
      let num = 0 // 需求量:所有采购总量-所有到货总量
      purchaseInfo.value.relPackage.forEach((item, index) => {
        item.relGoodsInfo.forEach((it, ind) => {
          if (it.distributable) num = num + (it.goodsQuantity - it.arrivalQuantity)
        })
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
      purchaseInfo.value.relPackage.forEach((item, index) => {
        item.relGoodsInfo.forEach((it, ind) => {
          if (it.distributable) {
            num = num + it.assignNum
          }
        })
      })
      return state.distributableNumAll - num
    })

    // 合格数=到货数
    let assignmentQualifiedNum = () => {
      state.form.qualifiedNum = state.form.arrivalNum
      formRef.value.clearValidate(['qualifiedNum'])
    }

    // 到货数更改的监听事件
    let arrivalNumInput = () => {
      // console.log(111111);
      // state.form.qualifiedNum = undefined
    }

    //到货数失去焦点
    let arrivalNumBlur = () => {
      if (state.form.arrivalNum == undefined) state.form.arrivalNum = 1
    }

    //合格数失去焦点
    let qualifiedNumBlur = () => {
      if (state.form.qualifiedNum == undefined) state.form.qualifiedNum = 0
    }

    // 分配数量失去焦点
    let assignNumBlur = (value, index, ind) => {
      if (value == undefined) purchaseInfo.value.relPackage[index].relGoodsInfo[ind].assignNum = 0
    }

    //保存并继续
    let saveEvent = () => {
      let { arrivalNum, qualifiedNum } = state.form
      let { goodsId, ivtPurchaseDetailId, goodsName, goodsSku, mainImg, speType } = purchaseInfo.value.mainGoodsInfo
      let stockInfo = []
      purchaseInfo.value.relPackage.forEach((item, index) => {
        let obj = {
          packageId: item.packageId,
          deductFlag: item.deductFlag
        }
        item.relGoodsInfo.forEach(it => {
          if (it.goodsId == purchaseInfo.value.mainGoodsInfo.goodsId && purchaseInfo.value.transactionId.split(',').includes(it.orderId)) {
            if (it.distributable) {
              obj.num = it.assignNum
            } else {
              obj.num = 0
            }
            obj.goodsQuantity = it.goodsQuantity,
              obj.arrivalQuantity = it.arrivalQuantity
          }
        })
        stockInfo.push(obj)
      })
      let params = {
        goodsName,
        goodsSku,
        mainImg,
        num: arrivalNum,
        arrivalNum: qualifiedNum,
        remark: state.form.textarea,
        goodsId,
        ivtPurchaseDetailId,
        stockInfo,
        speType,
        warehouseId: 1
      }
      state.loading = true
      qualityTexting(params).then((res) => {
        state.loading = false
        if (res.code == 200) {
          ElMessage.success({ message: '提交成功！', type: 'success' })
          // 处理到货状态
          let { num, arrivalNum } = purchaseInfo.value.mainGoodsInfo
          let unArrivalNum = num - arrivalNum // 未入库数量
          if (unArrivalNum - state.form.qualifiedNum == 0) { // 若未入库数量-本次合格数=0，则到货状态改为已入库
            purchaseInfo.value.mainGoodsInfo.purchaseStatus = 3
          } else if (unArrivalNum - state.form.qualifiedNum > 0 && state.form.qualifiedNum !== 0) { // 若未入库数量-本次合格数>0 && 本次合格数 !== 0，则到货状态改为部分入库
            purchaseInfo.value.mainGoodsInfo.purchaseStatus = 2
          } else if (arrivalNum + state.form.qualifiedNum == 0) { // 若已入库+合格数=0， 则到货状态为未入库
            purchaseInfo.value.mainGoodsInfo.purchaseStatus = 1
          }
          // 处理包裹状态、打单状态
          purchaseInfo.value.relPackage.forEach(item => {
            item.relGoodsInfo.forEach(it => {
              if (it.assignNum) it.arrivalQuantity = it.arrivalQuantity + it.assignNum // 处理到货数量
            })
            // 修改打单状态
            res.data.relPackageInfo.forEach(it => {
              if (item.packageId == it.packageId) {
                item.printCount = it.printCount
                item.packageStatus = it.packageStatus
              }
            })
          })
          store.dispatch('store/setPurchaseInfoActions', purchaseInfo.value)
          router.push({
            path: '/store/inStore/qualityTesting/expresSheetInfo',
            query: {
              arrivalNum: state.form.arrivalNum,
              qualifiedNum: state.form.qualifiedNum,
              type: 1,
              batchNum
            }
          })
        }
      }).catch(({ timeId, message }) => {
        state.loading = false
        clearTimeout(timeId)
        ElMessage.error(message)
      })
    }

    // 保存并继续
    let submitEvent = _debounce(() => {
      let { arrivalNum, qualifiedNum, remarkVal, textarea } = state.form
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
        state.ifShow = true
      } else { // 直接入库
        saveEvent()
      }
    })



    // 取消
    let cancelEvent = () => {
      if (batchNum) {
        router.push({
          name: 'CustomizeBatch',
          query: {
            batchNum
          }
        })
      } else {
        router.push('/store/instore/purchase')
      }
    }

    let closeEvent = () => {
      state.ifShow = false
    }

    onMounted(() => {
      initRelPackage()
    })
    return {
      userInfo,
      purchaseInfo,
      packageType,
      packageStatus,
      distributableNumNow,
      formRef,
      ...toRefs(state),
      assignmentQualifiedNum,
      arrivalNumInput,
      submitEvent,
      cancelEvent,
      arrivalNumBlur,
      qualifiedNumBlur,
      assignNumBlur,
      closeEvent,
      saveEvent
    }
  },
  components: {
    Table,
    PrintUnqualifiedLabel
  }
}
</script>

<style lang="scss" scoped>
.scanQecodeView {
  display: flex;
  // height: 773px;
  height: calc(100vh - 210px);
  .left {
    width: 957px;
    height: 100%;
    overflow: hidden;
    // width: 60%;
    .pageView {
      width: 100%;
      // height: 450px;
      height: calc(100vh - 523px);
      overflow-y: scroll;
      .title {
        margin-bottom: 20px;
        font-weight: 600;
      }
    }
    .pageView2 {
      height: 303px;
      background-color: #fff;
      margin-top: 20px;
      .infoHead {
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
          width: 100%;
          display: flex;
          justify-content: space-between;
          .textarea {
            flex: 1;
            margin-left: 20px;
          }
        }
      }
    }
  }
  .right {
    flex: 1;
    background-color: #fff;
    margin-left: 20px;
    height: 100%;
    overflow-y: scroll;
    .title {
      font-weight: 600;
      height: 60px;
      line-height: 60px;
      padding: 0 30px;
      display: flex;
      justify-content: space-between;
    }
    .extraHeader {
      width: 100%;
      display: flex;
      align-items: center;
      height: 46px;
      background-color: #f5f7fa;
      font-size: 14px;
      padding: 0 20px;
      div {
        margin-right: 16px;
      }
      div:nth-of-type(2n-1) {
        width: 160px;
        text-align: left;
      }
      .el-tag {
        margin-right: 16px;
      }
    }
    .goodsName,
    .goodsSku,
    .goodsNum {
      padding: 0 16px;
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
    }
  }
}
.footer {
  position: fixed;
  width: 100%;
  bottom: 0;
  right: 0;
  z-index: 1000;
  width: calc(100% - var(--sideBarWidth));
  height: 52px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 10px 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-form-item {
  margin-bottom: 0px !important;
}
.is-error {
  margin-bottom: 20px !important;
}
:deep(.el-form-item__content) {
  display: flex;
  justify-content: center;
}
</style>
