<template>
  <div class="publishDialog">
    <el-dialog
      title="刊登商品"
      v-model="dialogVisible"
      width="30%"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <!-- <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="Vshop" name="vshop"> </el-tab-pane>
        <el-tab-pane label="店匠" name="shoplazza"> </el-tab-pane>
        <el-tab-pane label="Shopify" name="shopify"> </el-tab-pane>
        <el-tab-pane label="ShopLine" name="shopline"> </el-tab-pane>
        <el-tab-pane label="FunPinPin" name="funpinpin"> </el-tab-pane>
        <el-tab-pane label="XShoppy" name="xshoppy"> </el-tab-pane>
      </el-tabs> -->
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-form-item label="选择平台:">
          <el-select v-model="shop" @change="tabClick" style="width: 100%">
            <el-option
              v-for="(item, index) in shopArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择店铺:" prop="web">
          <el-select v-model="form.web" style="width: 100%">
            <el-option
              v-for="(item, index) in platform"
              :key="index"
              :label="item.tempDomain"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架:">
          <el-switch v-model="form.up"></el-switch>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="handleClick">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  publishAll, // T06:单个/批量刊登
  shopSelect
} from '@/api/goods/goodsPublish.js'
export default {
  props: {
    chooseIGoods: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const formRef = ref(null)
    const state = reactive({
      dialogVisible: false,
      shop: 'vshop',
      form: {
        web: '',
        up: false
      },
      shops: [],
      platform: []
    })
    const shopArr = [
      {
        label: 'Vshop',
        value: 'vshop'
      },
      {
        label: '店匠',
        value: 'shoplazza'
      },
      {
        label: 'Shopify',
        value: 'shopify'
      },
      {
        label: 'ShopLine',
        value: 'shopline'
      },
      {
        label: 'FunPinPin',
        value: 'funpinpin'
      },
      {
        label: 'XShoppy',
        value: 'xshoppy'
      },
      {
        label: 'Shopyy',
        value: 'shopyy'
      },
      {
        label: 'ShopBase',
        value: 'shopbase'
      }
    ]
    onMounted(() => {
      shopSelects()
      state.dialogVisible = true
    })
    //关闭弹框
    const handleClose = () => {
      emit('close', false)
    }
    // 刊登处理
    const handleClick = () => {
      const params = {
        goodsIds: props.chooseIGoods,
        shopId: state.form.web,
        status: state.form.up ? 1 : 2
      }
      if (state.form.web) {
        publishAll(params).then(res => {
          if (res.code == 200) {
            if (res.data != '') {
              ElMessage.error({ message: res.data })
            } else {
              ElMessage.success('刊登成功！')
            }
            emit('close', true)
          } else {
            ElMessage.error({ message: res.message })
          }
        })
      } else {
        ElMessage.error('请选择店铺！')
      }
    }
    const tabClick = paneName => {
      state.form.up = false
      state.form.web = ''
      state.platform = state.shops.filter(
        element => element.platform == paneName
      )
    }
    function shopSelects() {
      const param = {
        platform: '123',
        type: 1
      }
      shopSelect(param).then(res => {
        if (res.code == 200) {
          state.shops = res.data
          state.platform = state.shops.filter(
            element => element.platform == 'vshop'
          )
        } else {
          ElMessage.error({ message: res.message })
        }
      })
    }
    return {
      ...toRefs(state),
      handleClose,
      handleClick,
      tabClick,
      formRef,
      shopArr
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-form-inline {
  width: 90%;
  margin: 30px auto 0;
}
.publishDialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
}
</style>
