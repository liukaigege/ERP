<!--
 * @Descripttion: 'reissueGifts 补发赠品'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-11 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-11 00:00:00
-->
<template>
  <div class="reissueGifts">
    <div class="modalList">
      <p class="listTitle">订单信息</p>
      <div class="contentContainer">
        <Order v-if="orderData" :data="orderData" />
      </div>
    </div>
    <div class="modalList">
      <p class="listTitle">客户信息</p>
      <div class="contentContainer">
        <Custom
          v-if="customData"
          :data="customData"
          @changeOrder="customDataCustomData"
        />
      </div>
    </div>
    <div class="modalList">
      <p class="listTitle">
        补发赠品
				<span class="btns">
					扣库存：<el-switch v-model="deductFlag" :active-value="1" :inactive-value="0"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					<el-button
						type="primary"
						@click="check(false)"
						>增加商品</el-button
					>
				</span>
      </p>
      <div class="contentContainer">
        <Gift v-if="giftData" :data="giftData" @del="delList" />
        <!-- <Gift v-if="!giftData" /> -->
      </div>
    </div>
    <div class="modalList">
      <p class="listTitle">备注</p>
      <div
        class="contentContainer"
        style="padding: 20px; box-sizing: border-box"
      >
        <el-input
          v-model="remark"
          type="textarea"
          :rows="2"
          placeholder="请输入备注内容"
          show-word-limit
          :maxlength="100"
        ></el-input>
      </div>
    </div>
    <footer class="footerContainer">
      <span>订单成本：CNY {{ totalPrice }}</span>
      <el-button class="cancelBtns" @click="backFn">取 消</el-button>
      <el-button type="primary" class="sureBtns" @click="preservation"
        >保 存</el-button
      >
    </footer>
    <AddGoods v-if="show" :isGift="true" @setData="check" />
  </div>
</template>
<script>
import { reactive, toRefs, computed, getCurrentInstance, toRaw } from 'vue'
import Gift from './components/gift.vue'
import Custom from './components/custom.vue'
import Order from './components/order.vue'
import AddGoods from './components/addGoods.vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getOrderInfo } from './composables/addGoodsApi.js'
import { setData } from './composables/index.js'
import { dataTool, computedTotalPrice } from './composables/gift.js'
import { ElMessage } from 'element-plus'
import { getCountries } from '@/api/order/orderDetail.js'
import { patternFn, deepCopy } from '@/utils/tool'
export default {
  components: { Gift, Custom, Order, AddGoods },
  setup() {
    let store = useStore()
    const router = useRouter()
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const route = useRoute() //获取route
    const packageId = route.query.packageId || '' //从route中获取路由传参的包裹id
    const orderId = route.query.orderId || ''
    const { proxy } = getCurrentInstance()
    const state = reactive({
      show: false,
      data: {},
      countryList: [],
      orderData: null,
      customData: null,
      giftData: null,
      remark: '',
			deductFlag:1
    })
    //获取国家列表
    getCountries().then(res => {
      if (res.code == 200) {
        state.countryList = res.data
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    //获取订单信息
    getOrderInfo({ packageId, orderId }).then(res => {
      if (res.code == 200) {
        state.data = res.data
        const data = dataTool(res.data)
        //订单信息
        state.orderData = data.orderData
        // 客户信息
        state.customData = data.customData
      } else {
        ElMessage.warning({ message: res.message })
      }
    })

    const totalPrice = computed(() => computedTotalPrice(state.giftData))
    //删除选择的商品
    function delList(data) {
      if (data.length) {
        state.giftData = data
      }
    }

    //客户信息修改
    function customDataCustomData(data) {
      state.customData = data
    }

    //选择商品
    function check(data) {
      // giftFlag/customValue
      console.log(11, deepCopy(data))
      state.show = !state.show
      if (data && data.length) {
        if (state.giftData && state.giftData.length) {
          let list = data
          data.forEach((v, i) => {
            v.giftFlag = 1
            if (state.giftData.filter(item => item.skuId == v.skuId).length) {
              state.giftData.forEach(val => {
                if (val.skuId == v.skuId) {
                  val.goodsQuantity += v.goodsQuantity
                  val.goodsNumber += v.goodsNumber
                }
              })
              list.splice(i, 1)
            }
          })
          state.giftData = [...state.giftData, ...list]
        } else {
          state.giftData = data
        }
      }
    }
    //取消并返回上一页
    function backFn() {
      router.go(-1)
    }

    function preservation() {
      //订单信息及备注信息 orders
      const { source, tempDomain, type } = state.data
      const remark = state.remark
      const orders = { source, tempDomain, type, remark,deductFlag:state.deductFlag }
      orders.packageId = state.data.packageId
      orders.orderId = state.data.orderId
      //客户信息 packageReceiveInfo
      const packageReceiveInfo = state.customData
      if (!packageReceiveInfo.name || packageReceiveInfo.name.length > 60)
        return ElMessage.warning({ message: '请输入正确的客户姓名' })
      if (!packageReceiveInfo.phone || packageReceiveInfo.phone.length > 60)
        return ElMessage.warning({ message: '请输入正确的联系电话' })
      if (
        !packageReceiveInfo.postcode ||
        packageReceiveInfo.postcode.length > 40
      )
        return ElMessage.warning({ message: '请输入正确的邮编' })
      if (!packageReceiveInfo.countryEn)
        return ElMessage.warning({ message: '请选择国家' })
      if (
        packageReceiveInfo.taxNum &&
        !patternFn(packageReceiveInfo.taxNum, 'taxNumber')
      )
        return ElMessage.warning({
          message: '请输入0-30位数字加英文字符的税号'
        })
      if (!packageReceiveInfo.street1 && !packageReceiveInfo.street2)
        return ElMessage.warning({ message: '请输入收货地址' })
      //商品信息
      let goodsUpdates = deepCopy(state.giftData)
      if (!state.giftData || state.giftData.length == 0)
        return ElMessage.warning({ message: '请添加商品' })
      goodsUpdates.map(v => {
        v.giftFlag = 1
        if (v.skuValueEn) v.skuValue = v.skuValueEn
        return v
      })
      const preservationData = { orders, packageReceiveInfo, goodsUpdates }
      // preservationData.goodsUpdates.forEach(v=>{
      //   v.skuValue = JSON.stringify(v.skuValue)
      // })
      setData(preservationData).then(res => {
        if (res.code == 200) {
          ElMessage.success({ message: res.message })
          backFn()
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }

    return {
      ...toRefs(state),
      sideBarWidth,
      check,
      delList,
      backFn,
      preservation,
      customDataCustomData,
      totalPrice
    }
  }
}
</script>
<style lang="scss" scoped>
.reissueGifts {
  padding-bottom: 80px;
}
.modalList {
  background-color: #fff;
  margin-bottom: 20px;
  border-radius: 4px;
  overflow: hidden;
  .listTitle {
    line-height: 55px;
    border-bottom: 1px solid #e9e9e9;
    text-indent: 30px;
    color: #262626;
    font-size: 16px;
    font-weight: 550;
    letter-spacing: 2px;
    position: relative;
    .btns {
			font-size: 14px;
			font-weight: normal;
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .contentContainer {
    box-sizing: border-box;
    padding: 0 30px;
  }
}
.footerContainer {
  position: fixed;
  bottom: 0;
  box-sizing: border-box;
  padding: 10px;
  background-color: #fff;
  left: v-bind(sideBarWidth);
  width: calc(100% - v-bind(sideBarWidth));
  z-index: 4;
}
.cancelBtns,
.sureBtns {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
}
.cancelBtns {
  right: 80px;
}
.sureBtns {
  right: 10px;
}
</style>
