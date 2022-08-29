<template>
  <div class="supplier-detail-container">
    <erp-nav :title="title" :goBack="goBack" :routeOpt="{ name: 'PurchaseSMSupplier' }"></erp-nav>
    <div class="supplier-detail-tabs-box">
      <el-tabs v-model="activeName" class="supplier-detail-tabs">
        <el-tab-pane :disabled="disabled && activeName !== tab.key" v-for="tab in supplierPartnerTypes" :label="tab.label" :name="tab.key" :key="tab.key"></el-tab-pane>
      </el-tabs>
      <div class="right-box"></div>
    </div>
    <el-form class="supd-form" ref="formRef" :model="form" :label-width="140"  :rules="rules">
      <div class="supd-item">
        <div class="supd-item-title">基础信息</div>
        <div class="supd-item-info big-padding">
          <div class="space-div">
            <el-form-item prop="name" label="供应商名称:">
              <el-input :disabled="activeName === '1688' || isGenerateOrder" class="big-input" type="text" v-model="form.name"></el-input>
              <span class="ml-10 color-info" v-if="activeName === '1688'">（填写店铺主页自动获取名称）</span>
            </el-form-item>
            <el-form-item prop="settlementType" label="结算方式:">
              <el-select :disabled="activeName !== 'cooperation'" class="big-input" v-model="form.settlementType" clearable>
                <el-option v-for="spp in supplierPayTypeOptions" :key="spp.value" :label="spp.label" :value="spp.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="space-div">
            <el-form-item prop="techType" label="供应商类型:" v-if="activeName === 'cooperation'">
              <el-select class="big-input" v-model="form.techType" clearable>
                <el-option v-for="supplier in supplierTypeOptions" :key="supplier.value" :label="supplier.label" :value="supplier.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="storeHomePage" label="店铺主页:" v-else>
              <el-input @blur="getName" :disabled="isGenerateOrder" class="big-input" type="text" v-model="form.storeHomePage"></el-input>
            </el-form-item>
            <el-form-item prop="categoryIds" label="供应商商品品类:">
              <el-select v-model="form.categoryIds" multiple class="big-input">
                <el-option v-for="category in categoryIdOptions" :key="category.value" :label="category.label" :value="category.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="supd-item">
        <div class="supd-item-title">联系方式</div>
        <div class="supd-item-info big-padding">
          <div class="space-div">
            <el-form-item :required="activeName === 'cooperation'" prop="contacts" label="联系人:">
              <el-input class="big-input" type="text" v-model="form.contacts"></el-input>
            </el-form-item>
            <el-form-item :required="activeName === 'cooperation'" prop="phone" label="联系电话:">
              <el-input class="big-input" type="text" v-model="form.phone"></el-input>
            </el-form-item>
          </div>
          <div class="space-div">
            <el-form-item prop="address" label="地址:">
              <el-input class="big-input" maxlength="100" type="text" v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item prop="webAddress" label="网页地址:">
              <el-input class="big-input" maxlength="100" type="text" v-model="form.webAddress"></el-input>
            </el-form-item>
          </div>
        </div>
      </div>
      <div class="supd-item" v-if="activeName === 'cooperation'">
        <div class="supd-item-title flex">
          <div>付款方式</div>
          <el-button @click="addPayItem" type="text">+ 添加</el-button>
        </div>
        <div class="supd-item-info flex-wrap">
          <div class="pay-item" v-for="(payItem, index) in form.supplierPayments" :key="`payItem_${index}`">
            <div class="pay-item-top">
              <div class="left-title">方式{{index + 1}}</div>
              <el-button v-if="index > 0" @click="deletePayItem(index)" type="text"  class="color-danger">删除</el-button>
            </div>
            <div class="pay-item-info">
              <div class="space-div">
                <el-form-item :rules="dynamicRules.bankUserName" :prop="`supplierPayments.${index}.bankUserName`" :label-width="80" label="户名:">
                  <el-input class="mid-input" type="text" v-model="payItem.bankUserName"></el-input>
                </el-form-item>
                <el-form-item :rules="dynamicRules.bankAccount" :prop="`supplierPayments.${index}.bankAccount`" :label-width="100" label="银行卡号:">
                  <el-input class="mid-input" type="text" v-model="payItem.bankAccount"></el-input>
                </el-form-item>
              </div>
              <el-form-item :rules="dynamicRules.bankName" :prop="`supplierPayments.${index}.bankName`" :label-width="80" label="开户行:">
                <el-input type="text" v-model="payItem.bankName"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
      </div>
      <div class="supd-item">
        <div class="supd-item-title">备注</div>
        <div class="supd-item-info">
          <el-input type="textarea" class="text-area" v-model="form.remark" maxlength="100"></el-input>
        </div>
      </div>
    </el-form>
    <erp-footer>
      <div style="text-align: right; padding-right: 24px">
        <el-button  @click="goBack">取消</el-button>
        <el-button  type="primary" @click="savePartner">保存</el-button>
      </div>
    </erp-footer>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { reactive, toRefs, computed, watch, nextTick } from 'vue'
import { supplierPartnerTypes, supplierPayTypeOptions, supplierTypeOptions } from '@/assets/js/staticData.js'
import { deepCopy, assignTool } from 'tool'
import { add, getSupplier, edit, getThirdSupplier } from '@/api/purchase/supplier.js'
import { getCategoryTree } from '@/api/goods/quotation.js'
import ErpNav from '@/components/erpNav/index.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  name: 'PurchaseSMSupplierDetail',
  components: { ErpNav, ErpFooter },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const type = route.query?.type
    const title = type === 'detail' ? '供应商详情' : type === 'edit' ? '编辑供应商' : '新增供应商'
    let store = useStore()
    let sideBarWidth = computed(() => store.state.menu.sideBarWidth)

    const state = reactive({
      form: {
        name: null, // 供应商名称
        storeHomePage: null, // 店铺主页
        partnerType: null, // 供应商种类
        settlementType: null, // 结算方式
        techType: null, // 供应商类型
        categoryIds: [], // 供应商商品品类
        contacts: null, // 联系人
        phone: null, // 联系电话
        address: null, // 地址
        webAddress: null, // 网页地址
        remark: null, // 备注
        thirdPlatformSupplierId: null, // 第三方id
        thirdPlatformLoginId: null, // 第三方id
        supplierPayments: [
          {
            bankName: null, // 开户行
            bankAccount: null, // 银行卡号
            bankUserName: null // 户名
          }
        ] // 供应商结算方式
      },
      rules: {
        name: [{
          required: true, validator(rule, value, callback) {
            const message = state.activeName === '1688' ? '请填写正确的店铺主页获取供应商名称' : '请输入供应商名称，最多100字'
            value && value.length <= 100 ? callback() : callback(new Error(message))
          }
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }],
        storeHomePage: [{
          required: true, validator(rule, value, callback) {
            value && value.length <= 1000 ? callback() : callback(new Error(rule.message))
          }, message: '请输入店铺主页，最多1000字'
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }],
        settlementType: [{ required: true, message: '请选择结算方式' }],
        techType: [{ required: true, message: '请选择供应商类型' }],
        categoryIds: [{
          required: true, message: '请选择供应商商品品类', validator(rule, value, callback) {
            value && value.length ? callback() : callback(new Error(rule.message))
          }
        }],
        contacts: [{
          validator(rule, value, callback) {
            if (state.activeName === 'cooperation') {
              value && value.length <= 10 ? callback() : callback(new Error(rule.message))
            } else {
              callback()
            }
          }, message: '请输入联系人，最多10字'
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }],
        phone: [{
          validator(rule, value, callback) {
            if (state.activeName === 'cooperation') {
                (value && value.length <= 11) || (value && value.replace(/(^\s*)|(\s*$)/g, '').length <= 11) ? callback() : callback(new Error(rule.message))
            } else {
              callback()
            }
          }, message: '请输入联系电话，最多11字'
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }]
      },
      dynamicRules: {
        bankAccount: [{
          required: true, validator(rule, value, callback) {
            value && /^[0-9]{1,19}$/.test(value) ? callback() : callback(new Error(rule.message))
          }, message: '请输入银行卡号，最多19个数字'
        }],
        bankName: [{
          required: true, validator(rule, value, callback) {
            value && value.length <= 50 ? callback() : callback(new Error(rule.message))
          }, message: '请输入开户行，最多50字'
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }],
        bankUserName: [{
          required: true, validator(rule, value, callback) {
            value && value.length <= 10 ? callback() : callback(new Error(rule.message))
          }, message: '请输入户名，最多10字'
        }, { pattern: /^(?!(\s+$))/, message: '不能全为空字符' }]
      },
      formRef: null,
      activeName: route.query?.active || 'cooperation',
      disabled: type !== 'add',
      categoryIdOptions: [],
      oldPage: null,
      isChange: false,
      hadInited: false,
      isGenerateOrder: false // 编辑时 判断当前供应商是否生成过采购单
    })

    if (route.query?.active !== 'cooperation' && route.query?.type === 'add') {
      state.form.settlementType = 4
    }

    watch(() => state.activeName, _ => {
      state.formRef.resetFields()
      if (state.activeName !== 'cooperation') {
        state.form.settlementType = 4
      }
    })

    watch(() => state.form, _ => {
      if (type === 'add' || (type === 'edit' && state.hadInited)) {
        state.isChange = true
      }
    }, {
      deep: true
    })

    if (type === 'edit') {
      getSupplier({ id: route.query?.id }).then(r => {
        if (r.data.settlementType === 2) {
          const val = r.data.settlementValue
          r.data.settlementType = val === '30' ? 5 : (val === '45' ? 6 : 7)
        }
        state.isGenerateOrder = r.data.isGenerateOrder
        state.form = assignTool(state.form, r.data, ['id'])
        nextTick(_ => {
          state.hadInited = true
        })
      })
    }

    const staticState = {
      title,
      type,
      supplierTypeOptions,
      supplierPayTypeOptions,
      sideBarWidth,
      supplierPartnerTypes
    }

    getCategoryTree().then(r => {
      r.data.forEach(item => {
        state.categoryIdOptions.push({
          label: item.name,
          value: item.id
        })
      })
    })

    function addPayItem() {
      if (state.form.supplierPayments.length >= 5) {
        ElMessage.error({ message: '最多添加五种付款方式' })
        return false
      }
      state.form.supplierPayments.push({
        bankName: null, // 开户行
        bankAccount: null, // 银行卡号
        bankUserName: null // 户名
      })
    }

    function deletePayItem(index) {
      state.form.supplierPayments.splice(index, 1)
    }

    function getName() {
      if (!state.form.storeHomePage) {
        return false
      }
      if (!/^(?!(\s+$))/.test(state.form.storeHomePage)) {
        return false
      }
      if (state.form.storeHomePage === state.oldPage) {
        return false
      }
      if (state.activeName === '1688') {
        getThirdSupplier({
          url: state.form.storeHomePage
        }).then(r => {
          state.oldPage = state.form.storeHomePage
          state.form.name = r.data?.companyName
          state.form.address = r.data?.detailAddress
          state.form.thirdPlatformSupplierId = r.data?.sellerUserId
          state.form.thirdPlatformLoginId = r.data?.sellerLoginId
        })
      }
    }

    function savePartner() {
      state.formRef.validate(val => {
        // 数据校验成功调用接口
        if (val) {
          // 拷贝一份数据不影响页面内容展示
          const form = deepCopy(state.form)
          // 处理供应商种类数据
          form.partnerType = supplierPartnerTypes.find(t => t.key === state.activeName).value
          // 处理settlement数据
          if (form.settlementType >= 5 && form.settlementType <= 7) {
            form.settlementValue = form.settlementType === 5 ? '30' : (form.settlementType === 6 ? '45' : '60')
            form.settlementType = 2
          } else {
            form.settlementType = form.settlementType
            form.settlementValue = null
          }
          const func = type === 'edit' ? edit : add
          const str = type === 'edit' ? '编辑' : '创建'
          Object.keys(form).forEach(key => {
            if (form[key] && typeof form[key] === 'string') {
              form[key] = form[key].replace(/(^\s*)|(\s*$)/g, '')
            }
          })
          func(form).then(_ => {
            ElMessage.success({ message: `${str}供应商成功` })
            setTimeout(_ => {
              router.push({ name: 'PurchaseSMSupplier', params: { active: state.activeName } })
            }, 1000)
          })
        } else {
          ElMessage.warning({ message: '数据校验失败，请检查填写后重新提交' })
        }
      })
    }

    function goBack() {
      if (state.isChange) {
        ElMessageBox.confirm('未保存的数据将会被清除，确认离开吗？', {
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false
        }).then(_ => {
          router.push({ name: 'PurchaseSMSupplier' })
        })
      } else {
        router.push({ name: 'PurchaseSMSupplier' })
      }
    }

    return {
      ...toRefs(state),
      ...staticState,
      addPayItem,
      deletePayItem,
      savePartner,
      goBack,
      getName
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-detail-tabs-box {
  position: fixed;
  top: 185px;
  z-index: 15;
  left: v-bind(sideBarWidth);
  right: 0;
  display: flex;
  border-bottom: 1px solid #e9e9e9;
  .right-box {
    width: 550px;
    padding: 0 30px 5px 0;
    text-align: right;
    background: #fff;
  }
}
.supplier-detail-tabs {
  flex-grow: 1;
  background: #fff;
  ::v-deep(.el-tabs__nav-wrap) {
    padding: 0 40px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
  ::v-deep(.el-tabs__header) {
    margin-bottom: 0;
  }
}
.supd-form {
  margin-top: 64px;
}
.supplier-detail-container {
  .supd-item {
    background: #fff;
    margin-top: 24px;
    border-radius: 2px;
    &-title {
      padding: 15px 30px;
      border-bottom: 1px solid #e9e9e9;
      font-size: 16px;
      &.flex {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
    &-info {
      padding: 25px 30px;
      &.big-padding {
        padding-left: 200px;
        padding-right: 200px;
      }
      .space-div {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      &.flex-wrap {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding-top: 0;
      }
    }
    .pay-item {
      width: 48%;
      border-radius: 2px;
      border: 1px solid #e9e9e9;
      margin-top: 20px;
      &-top {
        background: #fafafa;
        padding: 10px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e9e9e9;
      }
      &-info {
        padding: 20px 24px 0 24px;
      }
    }
    .large-input {
      width: 600px;
    }
    .big-input {
      width: 300px;
    }
    .mid-input {
      width: 240px;
    }
    .text-area {
      width: 700px;
    }
  }
}
</style>
