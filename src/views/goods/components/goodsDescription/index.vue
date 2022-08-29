<!--
 * @Descripttion: 'goodsDescription 商品信息'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="container">
    <div class="wihteBgc">
      <!-- 采集产品 -->
      <Link
        v-if="linkData"
        :data="linkData"
        @changeBack="getLinkData"
        :isEdit="isEdit"
      />
    </div>
    <div class="wihteBgc">
      <!-- 基本信息 -->
      <BaseInfo
        v-if="baseInfoData"
        :data="baseInfoData"
        @changeBack="getBaseInfoData"
        :isEdit="isEdit"
        :layFlag="goodsData.layFlag"
        :goodsData="goodsData"
        :sourceRoute="sourceRoute"
      />
    </div>
    <div
      class="wihteBgc"
      v-if="
        goodsData &&
        (routeName === 'LayAsideDetail' || routeName === 'setPriceDetail')
      "
    >
      <!-- 已报价规格信息 -->
      <Specification
        v-if="spevData"
        @changeBack="spevDataCallBack"
        @callBack="callBacks"
        @attrImages="attrImagesFn"
        :data="spevData"
        :isEdit="isEdit"
        :layFlag="goodsData.layFlag"
        :skuType="goodsData.skuType"
        :goodsData="goodsData"
        :sourceRoute="sourceRoute"
      />
    </div>
    <!-- 定制规格信息 -->
    <CoustomInfo
      v-if="
        goodsData &&
        ((routeName != 'PurchaseQuote' &&
          goodsData.alreadyOfferEnableCustom == 1) ||
          (routeName == 'PurchaseQuote' && goodsData.enableCustom == 1))
      "
      :enableContainFitting="goodsData.enableContainFitting"
      :goodsCustomTypeList="
        goodsData.goodsCustomTypeList.map(v => v.type) || []
      "
      :goodsCustomFittingList="goodsData.goodsCustomFittingList || []"
      @callBack="coustomInfoBack"
      :isEdit="isEdit"
    />
    <div
      class="wihteBgc"
      v-if="
        goodsData &&
        (routeName === 'LayAsideDetail' || routeName === 'setPriceDetail')
      "
    >
      <!-- 未报价SKU列表 -->
      <SpevInfo
        v-if="unSkuData"
        :data="unSkuData"
        @changeBack="getUnSkuData"
        :isEdit="isEdit"
        :layFlag="goodsData.layFlag"
        :offerStatus="goodsData.offerStatus"
        :goodsData="goodsData"
        :sourceRoute="sourceRoute"
      />
    </div>
    <!-- 定制规格信息 -->
    <!-- <div class="wihteBgc" v-if="goodsData && goodsData.skuType == 3">
      <CusSpecInfo
        v-if="custAttr"
        v-model="custAttr"
        :isEdit="isEdit"
        :pairingData="custPairingData"
        :custSkus="goodsData.custSku"
        :categoryId="goodsData.categoryId"
      />
    </div> -->
    <div class="wihteBgc">
      <!-- 图文信息 -->
      <PicText
        v-if="picTxtData"
        :data="picTxtData"
        @changeBack="getPicTxtData"
        :isEdit="isEdit"
      />
    </div>
    <!-- <RelevanceSku/> -->
  </div>
</template>
<script>
import { reactive, toRefs, onActivated, provide, computed } from 'vue'
import Link from './components/link.vue'
import PicText from './components/picText.vue'
import BaseInfo from './components/baseInfo.vue'
import Specification from './components/specificationInfo.vue'
import SpevInfo from './components/spevInfo.vue'
import SkuRecord from './components/skuRecord.vue'
import CusSpecInfo from './components/cusSpecInfo.vue'
import CoustomInfo from './components/coustomInfo.vue'
import RelevanceSku from './components/relevanceSku.vue'
import {
  goodsDetail,
  saveGoodsInfo,
  saveOtherGoodsInfo
} from './composables/api.js'
import {
  saveData,
  getData,
  linkDataBack,
  otherSaveData
} from './composables/tools.js'
import { deepCopy, isObjectValueEqual } from '@/utils/tool'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'

export default {
  components: {
    Link,
    PicText,
    BaseInfo,
    Specification,
    SkuRecord,
    SpevInfo,
    CusSpecInfo,
    RelevanceSku,
    CoustomInfo
  },
  props: {
    isQuoted: Boolean,
    isEdit: Boolean,
    goodsId: String,
    type: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    const route = useRoute()
    const routeName = route.name

    const sourceRoute = route.query.sourceRoute ? true : false
    const combine = route.query.combine || null
    const state = reactive({
      goodsData: null, //商品数据
      linkData: null, //参考/采集产品
      baseInfoData: null, //基本信息
      spevData: null, //规格信息
      unSkuData: null, //未报价SKU列表
      picTxtData: null, //图文信息
      custAttr: null,
      custPairingData: {
        skuId: null,
        url: null,
        nameCn: null,
        nameEn: null,
        speVal: null
      },
      skuPhoto: null,
      backAttrImages: null,
      getGoodsDetailStatus: false,
      coustomInfoBackData: null
    })
    function coustomInfoBack(data) {
      state.coustomInfoBackData = data
    }
    getGoodsDetail()
    onActivated(() => {
      if (state.getGoodsDetailStatus) {
        getGoodsDetail()
      }
    })
    state.getGoodsDetailStatus = true
    //获取商品信息
    function getGoodsDetail(id = null) {
			const goodsId = id || route.query.id || props.goodsId || null
      state.linkData = null
      state.baseInfoData = null
      state.spevData = null
      state.unSkuData = null
      state.picTxtData = null
      state.custAttr = null
      state.custPairingData = null
      goodsDetail({ goodsId }).then(res => {
        if (res.code == 200) {
          state.goodsData = deepCopy(res.data)
          const data = getData(deepCopy(res.data))
          // layFlag 商品搁置状态 0正常 1搁置中
          // status 商品状态 0待激活 -1激活失败 1未报价 2待采购报价 3采购打回 4待物流报价 5物流打回 6已报价
          // skuType 商品SKU类型 1.单规格 2.多规格 3.定制
          state.linkData = data.linkData
          //基本信息
          state.baseInfoData = data.baseInfoData
          //规格信息
          state.spevData = data.spevData
          //未报价SKU列表
          state.unSkuData = data.unSkuData
          // 图文信息
          state.picTxtData = data.picTxtData
          //定制规格信息
          state.custAttr = data.custAttr
          if (res.data.custSku) {
            state.custPairingData = {
              skuId: res.data.custSku.skuId || res.data.skuId || null,
              url: res.data.mainImageUrl || null,
              nameCn: res.data.nameCn || null,
              nameEn: res.data.nameEn || null,
              speVal: res.data.spes || null
            }
          }
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }

    function initData(id) {
      getGoodsDetail(id)
    }
    const goodsImages = computed(() => state.goodsData.goodsImages)
    provide('goodsImages', goodsImages)
    const attrImages = computed(() => state.goodsData.attrImages)
    provide('attrImages', attrImages)

    //获取参考/采集产品组件的值
    function getLinkData(data) {
      if (!isObjectValueEqual(state.linkData, linkDataBack(data)))
        context.emit('isChange', true)
      state.linkData = linkDataBack(data)
    }
    //获取基本信息组件的值
    function getBaseInfoData(data) {
      if (!isObjectValueEqual(state.baseInfoData, deepCopy(data)))
        context.emit('isChange', true)
      state.baseInfoData = deepCopy(data)
    }
    function callBacks(data) {
      state.skuPhoto = deepCopy(data)
    }
    function attrImagesFn(data) {
      state.backAttrImages = data
    }
    //获取未报价SKU列表组件的值
    function getUnSkuData(data) {
      if (!isObjectValueEqual(state.unSkuData, deepCopy(data)))
        context.emit('isChange', true)
      state.unSkuData = data
    }
    //获取规格信息链接组件的值
    function spevDataCallBack(data) {
      if (!isObjectValueEqual(state.spevData, deepCopy(data)))
        context.emit('isChange', true)
      state.spevData = data
    }
    //获取图文信息链接组件的值
    function getPicTxtData(data) {
      if (!isObjectValueEqual(state.picTxtData, deepCopy(data)))
        context.emit('isChange', true)
      state.picTxtData = data
    }
    // 保存商品信息
    function save() {
      if (state.linkData.mode == 2 || state.linkData.mode == 3) {
        state.linkData.referenceUrls = state.linkData.referenceUrls.filter(
          v => v
        )
        if (state.linkData.referenceUrls.length == 0) {
          return ElMessage.warning({ message: '请填写参考产品链接' })
        }
      }
      if (state.goodsData.status == 6) {
        // 已报价详情保存
        // saveGoodsInfo
        if (state.picTxtData.goodsImages.length < 3) {
          ElMessage.warning({ message: '商品图片最少上传三张' })
          return false
        }
        let obj = saveData(
          state.goodsData,
          state.linkData,
          state.baseInfoData,
          state.spevData,
          state.picTxtData,
          state.backAttrImages
        )
        obj.skuPhoto = state.skuPhoto
        if (
          state.goodsData.enableCustom === 1 &&
          state.coustomInfoBackData &&
          state.coustomInfoBackData.length > 0
        ) {
          // 定制品
          if (state.coustomInfoBackData.some(v => !v.nameCn))
            return ElMessage.warning({ message: '请填写中文名称' })
          if (state.coustomInfoBackData.some(v => !v.nameEn))
            return ElMessage.warning({ message: '请填写英文文名称' })
        }
        // 定制品修改
        const tempObj = {
          enableCustom: state.goodsData.enableCustom,
          enableContainFitting: state.goodsData.enableContainFitting,
          offerFittingSwitch: state.goodsData.offerFittingSwitch,
          offerFittingSwitchChange:
            !state.coustomInfoBackData?.length ||
            !state.goodsData.goodsCustomFittingList?.length
              ? 0
              : isObjectValueEqual(
                  state.coustomInfoBackData,
                  state.goodsData.goodsCustomFittingList
                )
              ? 0
              : 1,
          goodsCustomTypeList: state.goodsData.goodsCustomTypeList,
          goodsCustomFittingList: state.coustomInfoBackData
        }
        obj = { ...obj, ...tempObj }
        return new Promise((res, rej) => {
          saveGoodsInfo(obj)
            .then(() => {
              ElMessage.success({ message: '保存成功' })
              initData()
              res(true)
            })
            .catch(err => rej(false))
        })
      } else {
        const obj = otherSaveData(
          state.goodsData,
          state.linkData,
          state.baseInfoData,
          state.spevData,
          state.picTxtData
        )
        // 其他状态数据保存
        // saveOtherGoodsInfo
        return new Promise((res, rej) => {
          saveOtherGoodsInfo(obj)
            .then(() => {
              ElMessage.success({ message: '保存成功' })
              initData()
              res(true)
            })
            .catch(err => rej(false))
        })
      }
    }



    return {
      ...toRefs(state),
      spevDataCallBack,
      getLinkData,
      getBaseInfoData,
      getUnSkuData,
      getPicTxtData,
      save,
      callBacks,
      routeName,
      attrImagesFn,
      getGoodsDetail,
      sourceRoute,
      initData,
      coustomInfoBack,
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  z-index: 6;
  height: 100%;
}
.wihteBgc {
  box-sizing: border-box;
  padding: 0 30px 0 30px;
  background-color: #fff;
  margin-bottom: 20px;
  font-weight: 500;
}
</style>
