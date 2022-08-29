<template>
	<el-dialog title="打印不合格标签" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <el-form :model="form" :rules="rules"  ref="formRef">
        <el-form-item label="不合格数量: ">{{form.unqualifiedNum}}</el-form-item>
        <el-form-item label="分配货架位: ">
          <div v-for="(item, index) in form.shelfGridList">{{item.areaName}} {{item.gridName}} X <span style="color: #f89595">{{item.num}}</span></div>
          <div v-if="form.shelfGridList.length == 0">货架位不足！</div>
        </el-form-item>
        <el-form-item label="不合格原因: " prop="reason">
          <el-select v-model="form.reason" style="width: 140px;" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in options" :key="index"></el-option>
					</el-select>
          <el-input type="textarea" :rows="3" placeholder="请输入备注信息" v-model="textarea" :maxlength="60" class="textarea" v-if="form.reason == '其他'" style="margin-top: 10px;"> </el-input>
        </el-form-item>
      </el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading" :disabled="form.shelfGridList.length == 0">打印并继续</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
  import { ref, reactive, toRefs, onMounted, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import Moment from 'moment'
  import { qualityTexting, unqualified, defectiveCheck } from '@/api/store.js'
  let router = useRouter()
  let userInfo = computed(() => store.state.user.userInfo)
  let purchaseInfo = computed(() => store.getters.purchaseInfo)
  const emit = defineEmits(['closeEvent', 'saveEvent'])
  const props = defineProps({
    parentForm: {
      type: Object,
      default: {}
    }
  })
  let store = useStore()
  let state = reactive({
    ifShow: true,
    loading: false,
    textarea: '',
    form: {
      unqualifiedNum: props.parentForm.arrivalNum - props.parentForm.qualifiedNum,
      shelfGridList: [],
      reason: null,
      num: props.parentForm.arrivalNum - props.parentForm.qualifiedNum
    }
  })
  let rules = {
    reason: { required: true, message: '请选择不合格原因', trigger: 'change' },
  }
  let formRef = ref(null)

  let options = [
    {
      label: '图案错误',
      value: '图案错误'
    },
    {
      label: '刻字错误',
      value: '刻字错误'
    },
    {
      label: '其他',
      value: '其他'
    }
  ]

  let saveEvent = () => {
    return new Promise(reslove => {
      let { arrivalNum, qualifiedNum, textarea } = props.parentForm
      let { goodsId, ivtPurchaseDetailId, goodsName, goodsSku, mainImg, speType } = purchaseInfo.value.mainGoodsInfo
      let stockInfo = []
      purchaseInfo.value.relPackage.forEach((item, index) => {
        let obj = {
          packageId: item.packageId,
          deductFlag: item.deductFlag
        }
        item.relGoodsInfo.forEach(it => {
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
      let reason = state.form.reason == '其他' ? state.textarea : state.form.reason
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
        speType,
        warehouseId: 1,
        reason
      }
      state.loading = true
      qualityTexting(params).then((res) => {
        state.loading = false
        if (res.code == 200) {
          // 处理到货状态
          let { num, arrivalNum } = purchaseInfo.value.mainGoodsInfo
          let unArrivalNum = num - arrivalNum // 未入库数量
          if (unArrivalNum - qualifiedNum == 0) { // 若未入库数量-本次合格数=0，则到货状态改为已入库
            purchaseInfo.value.mainGoodsInfo.purchaseStatus = 3
          } else if (unArrivalNum - qualifiedNum > 0 && qualifiedNum !== 0) { // 若未入库数量-本次合格数>0 && 本次合格数 !== 0，则到货状态改为部分入库
            purchaseInfo.value.mainGoodsInfo.purchaseStatus = 2
          } else if (arrivalNum + qualifiedNum == 0) { // 若已入库+合格数=0， 则到货状态为未入库
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
          reslove(res.data.defectiveGridList)
        } else {
          ElMessage.error(res.message)
        }
      }).catch(({ timeId, message }) => {
        state.loading = false
        clearTimeout(timeId)
        ElMessage.error(message)
      })
    })
  }

  let printLabel = (defectiveGridList) => {
    let { goodsName, goodsSku, speVal } = purchaseInfo.value.mainGoodsInfo
    let { arrivalNum, qualifiedNum } = props.parentForm
    let reason = state.form.reason == '其他' ? state.textarea : state.form.reason
    let params = {
      goodsName,
      goodsSku,
      num: state.form.num,
      shelfPositionList: defectiveGridList,
      checkBy: userInfo.value.fullName,
      checkTime: Moment().format('YYYY-MM-DD H:mm:ss'),
      skuValue: speVal,
      reason
    }
    state.loading = true
    unqualified(params).then(res => {
      state.loading = false
      if (res.code == 200) {
        window.open(res.data)
        router.push({
          path: '/store/inStore/qualityTesting/expresSheetInfo',
          query: {
            arrivalNum: arrivalNum,
            qualifiedNum: qualifiedNum,
            type: 1
          }
        })
      } else {
        ElMessage.error(res.message)
      }
    }).catch(() => {
      state.loading = false
    })
  }

  // 关闭弹框
  let closeEvent = () => {
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent')
    }, 500)
  }

  // 取消回调
  let cancelEvent = () => {
    closeEvent()
  }

  // 确认回调
  let affirmEvent = () => {
    formRef.value.validate((valid) => {
      if (valid) {
        if (state.form.reason == '其他' && [null, ''].includes(state.textarea.trim())) {
          state.textarea = ''
          ElMessage.error('请输入不合格原因!')
        } else {
          saveEvent().then((defectiveGridList) => {
            printLabel(defectiveGridList)
          })
        }
      } else {
        ElMessage.error('信息填写错误，提交失败')
      }
    })
  }

  let getShelfGridName = () => {
    let params = {
      warehouseId: 1,
      ivtPurchaseDetailId: purchaseInfo.value.mainGoodsInfo.ivtPurchaseDetailId,
      num: state.form.num
    }
    defectiveCheck(params).then(res => {
      if (res.code == 200) {
        let { flag, msg, list } = res.data
        if (!flag) {
          ElMessage.error(msg)
          return false
        }
        state.form.shelfGridList = list
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  onMounted(() => {
    getShelfGridName()
  })

  let { ifShow, loading, form, textarea } = toRefs(state)
</script>

<style lang="scss" scoped>
.contentView{
  max-height: 400px;
  overflow: auto;
}
:deep(.el-form-item__content) {
  justify-content: flex-start !important;
}
</style>