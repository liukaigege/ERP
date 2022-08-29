<!--
 * @Descripttion: 采购入库扫描页面
 * @version:
 * @Author: 韦剑
 * @Date: 2021-07-06 09:18:29
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-22 15:17:35
-->
<template>
  <div>
    <div class="content_top">
      <table class="table table-striped table-bordered">
        <tr>
          <td class="column width_300 color_gray">单号</td>
          <td colspan="3">
            <el-form :model="form" :rules="rules" ref="formRef" class="elForm" @submit.prevent>
              <el-form-item prop="searchVal" style="width: 390px;">
                <el-input ref="input" v-model="form.searchVal" placeholder="扫描或输入物流单号/二维码/采购单号" @blur="blurEvent" @keyup.enter="enterEvent" clearable></el-input>
              </el-form-item>
            </el-form>
          </td>
        </tr>
        <tr>
          <td class="column color_gray">仓库</td>
          <td class="column width_464">万众智谷仓库</td>
          <td class="column width_300 color_gray">经办人</td>
          <td class="column width_464">{{userInfo.fullName}}</td>
        </tr>
      </table>
      <el-dialog title="选择采购类型" v-model="dialogVisible" width="600px" @closed="handleClose" :close-on-click-modal="false">
        <p class="dialog-tip">提示：扫描或者输入的运单号绑定了多个类型采购单，请选择类型以此入库</p>
        <el-radio-group v-model="purchaseType">
          <el-radio :label="1">普通商品采购</el-radio>
          <el-radio :label="2">定制商品采购</el-radio>
        </el-radio-group>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="ok">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, reactive, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { purchaseSearch, inStorageCheck, inStorageList } from '@/api/store.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { notAllowRouter, _debounce } from '@/utils/tool.js'


function initFun() { // 页面初始化
  let input = ref(null)
  let store = useStore()
  let userInfo = computed(() => store.state.user.userInfo)
  onMounted(() => {
    input.value.focus()
    store.dispatch('store/removePurchaseInfoActions')
    store.dispatch('store/removeStageActions')
    notAllowRouter()
  })
  let blurEvent = () => { // 强制让输入框始终聚焦
    input.value ? input.value.focus() : null
  }
  return {
    input,
    userInfo,
    blurEvent
  }
}
function searchFun(proxy) { // 查询
  let router = useRouter()
  let form = reactive({ searchVal: '' })
  let formRef = ref(null)
  let store = useStore()
  let rules = reactive({
    searchVal: [{ required: true, message: '请扫描或输入二维码/物流单号/采购单号', trigger: 'change' }]
  })
  let dialogVisible = ref(false)
  let purchaseType = ref("")
  let enterEvent = _debounce(() => { // 输入框回车
    formRef.value.validate((valid) => {
      if (valid) {
        let result
        try {
          result = JSON.parse(form.searchVal)
        } catch {
          result = form.searchVal
        }
        let params
        if (result.ivtPurchaseDetailId) {
          params = {
            ivtPurchaseDetailId: result.ivtPurchaseDetailId,
            warehouseId: 1,
            flag: 0
          }
          purchaseSearchEvent(params, 'qrcode')
        } else {
          params = {
            ivtPurchaseId: form.searchVal,
            warehouseId: 1,
            flag: 0
          }
          purchaseSearchEvent(params, 'input')
        }
      } else {
        return false
      }
    })
  })

  const purchaseSearchEvent = async (params, type) => {
    type == 'input' ? checkInput(params) : checkQrcode(params)
  }

  const checkQrcode = async (params) => {
    const result = await purchaseSearch(params)
    if (result.code != 200) return ElMessage.error('无当前数据，请重新扫描！')
    store.dispatch('store/setPurchaseInfoActions', result.data)
    ElMessage.success({ message: '扫描成功', type: 'success' })
    const { num, arrivalNum } = result.data.mainGoodsInfo
    if (num - arrivalNum == 0) { // 全部入库直接跳转面单信息界面
      router.push({
        path: '/store/inStore/qualityTesting/expresSheetInfo',
        query: {
          type: 0
        }
      })
    } else { // 存在未入库跳转质检
      router.push({
        name: 'QualityTesting'
      })
    }
  }

  // 验证是够是定制品
  const checkInput = async (params) => {
    const { code, data } = await inStorageCheck({ serialNumber: form.searchVal })
    if (code != 200) return ElMessage.error('无当前数据，请重新扫描！')
    if (data == 2) {
      dialogVisible.value = true
    } else {
      routerTo(data)
    }
  }

  // 跳转页面
  const routerTo = async (type) => {
    if (type == 0) {
      const result = await purchaseSearch({
        ivtPurchaseId: form.searchVal,
        warehouseId: 1,
        flag: 0
      })
      store.dispatch('store/setPurchaseInfoActions', result.data)
      store.dispatch('store/setStageActions', 1)
    }
    ElMessage.success({ message: '输入读取成功', type: 'success' })
    router.push({
      path: type == 0 ? '/store/instore/batch' : '/store/instore/customizeBatch',
      query: {
        batchNum: form.searchVal
      }
    })
  }

  const ok = () => {
    if (!purchaseType.value) return ElMessage.error('请选择采购类型,选择确认后分别进入相应的采购单入库页面!')
    routerTo(purchaseType.value - 1)
  }

  const handleClose = () => {
    purchaseType.value = ""
    dialogVisible.value = false
  }

  return {
    form,
    formRef,
    rules,
    enterEvent,
    purchaseSearchEvent,
    dialogVisible,
    purchaseType,
    handleClose,
    ok
  }
}

export default {
  setup() {
    const { proxy } = getCurrentInstance()
    let { input, userInfo, blurEvent } = initFun()
    let { form, formRef, rules, enterEvent, purchaseSearchEvent, dialogVisible, purchaseType, handleClose, ok } = searchFun(proxy)

    return {
      input,
      userInfo,
      form,
      formRef,
      rules,
      enterEvent,
      purchaseSearchEvent,
      blurEvent,
      dialogVisible,
      purchaseType,
      handleClose,
      ok
    }
  },
}
</script>

<style lang="scss" scoped>
.content_top {
  padding: 20px;
  background-color: #fff;
  border-radius: 2px;
}

::v-deep(.el-dialog__body) {
  padding: 10px 20px;

  .dialog-tip {
    color: #e03e2d;
    margin-bottom: 15px;
  }
}
.table {
  border-collapse: collapse;
  border-spacing: 0;
  background-color: transparent;
  display: table;
  width: 100%;
  max-width: 100%;
  td {
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    padding: 0;
  }
  .elForm {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .column {
    height: 54px;
    border: 1px solid #ebeef5;
    color: rgba(0, 0, 0, 0.65);
  }
  .width_300 {
    width: 300px;
  }
  .width_464 {
    width: 464px;
  }
  .color_gray {
    background-color: #f5f7fa;
    color: #000;
  }
}
.table-bordered {
  border: 1px solid #ebeef5;
}
.btnList {
  text-align: right;
  margin: 24px 0;
}
.el-form-item {
  margin-bottom: 0px !important;
}
.is-error {
  margin-bottom: 20px !important;
}
</style>
