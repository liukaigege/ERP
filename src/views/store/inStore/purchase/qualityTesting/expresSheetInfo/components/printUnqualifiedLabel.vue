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
  import Moment from 'moment'
  import { qualityTexting, unqualified, defectiveCheck } from '@/api/store.js'
import { deepCopy } from '@/utils/tool'
  let userInfo = computed(() => store.state.user.userInfo)
  const emit = defineEmits(['closeEvent', 'affirmEvent'])
  const props = defineProps({
    parentForm: {
      type: Object,
      default: {}
    },
    parentInfo: { // 二次扫码的信息
      type: Object,
      dafault: {}
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
    },
    purchaseInfo: deepCopy(props.parentInfo)
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
    return new Promise((reslove) => {
      let { arrivalNum, qualifiedNum, textarea } = props.parentForm
      let stockInfo = []
      state.purchaseInfo.relPackage.forEach((item, index) => {
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
        warehouseId: 1,
        reason
      }
      state.loading = true
      qualityTexting(params).then((res) => {
        state.loading = false
        if (res.code == 200) {
          ElMessage.success({ message: '提交成功！', type: 'success' });
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
          reslove(res.data.defectiveGridList)
        }
      }).catch(({ timeId, message }) => {
        state.loading = false
        clearTimeout(timeId)
        ElMessage.error(message)
      })
    })
  }

  let printLabel = (defectiveGridList) => {
    let { goodsName, goodsSku, speVal } = state.purchaseInfo.mainGoodsInfo
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
        emit('affirmEvent')
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
      ivtPurchaseDetailId: state.purchaseInfo.mainGoodsInfo.ivtPurchaseDetailId,
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
</style>