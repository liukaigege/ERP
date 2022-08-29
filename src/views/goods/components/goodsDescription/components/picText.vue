<!--
 * @Descripttion: 'picText.vue 图文信息'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="picTextContainer">
    <div class="picTextHeader">图文信息</div>
    <div class="picTextContent">
      <el-radio-group v-model="radioData.radioVal" @change="changeType">
        <el-radio-button
          v-for="item in radioData.radioList"
          :key="item.title"
          :label="item.title"
        ></el-radio-button>
      </el-radio-group>
      <div class="componentsContainer">
        <!-- 图文描述 -->
        <PicTextDetail
          v-show="TabComponent == 1"
          :modelValue="componentsData.ptInfo"
          @change="ptInfoBack"
          :isEdit="isEdit"
        />
        <!-- 产品图片 -->
        <ProductImg
          v-if="TabComponent == 2"
          v-model="componentsData.goodsImages"
          :isEdit="isEdit"
          :imgType="1"
          @callBack="imgBack"
        />
        <!-- 产品视频 -->
        <ProductVideo
          v-if="TabComponent == 3"
          v-model="componentsData.videoInfo"
          :isEdit="isEdit"
        />
        <!-- 属性图片 -->
        <AttibuteImg
          v-if="TabComponent == 4"
          v-model="componentsData.attrImages"
          :isEdit="isEdit"
        />
        <!-- 实物图片 -->
        <ProductImg
          v-if="TabComponent == 5"
          v-model="componentsData.realImages"
          :imgType="2"
          :isEdit="isEdit"
          @callBack="imgBack"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, watch, provide, computed } from 'vue'
import PicTextDetail from './picTextDetail.vue'
import ProductImg from '@/views/goods/components/goodsImg/components/productImg.vue'
import ProductVideo from '@/views/goods/components/goodsImg/components/productVideo.vue'
import AttibuteImg from '@/views/goods/components/goodsImg/components/attributeImg.vue'
import { radioList } from '../composables/data'
import { useRoute } from 'vue-router'
export default {
  components: { PicTextDetail, ProductImg, ProductVideo, AttibuteImg },
  props: {
    data: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const route = useRoute()
    const routeName = route.name
    const combine = route.query.combine || null

    const state = reactive({
      radioData: {
        radioVal: '图文描述', //当前选择的类型
        radioList //可供选择的子组件数组
      },
      TabComponent: 1,
      componentsData: props.data,
      refList: [],
      isDisabled: false
    })

    const isDisabled = computed(() => {
      if (
        routeName == 'PurchaseQuote' ||
        routeName == 'logisticsQuote' ||
        routeName == 'LayAsideDetail' ||
        combine == 1
      ) {
        return true
      } else if (!props.isEdit) {
        return true
      } else {
        return false
      }
    })
    provide('isDisabled', isDisabled)
    function changeType() {
      //切换类型
      state.TabComponent = state.radioData.radioList.filter(
        v => state.radioData.radioVal == v.title
      )[0].components
    }
    function imgBack(data, type) {
      if (type == 1) {
        state.componentsData.goodsImages = data
      } else if (type == 2) {
        state.componentsData.realImages = data
      }
      context.emit('changeBack', state.componentsData)
    }
    function ptInfoBack(data) {
      state.componentsData.ptInfo = data
      context.emit('changeBack', state.componentsData)
    }
    return {
      ...toRefs(state),
      changeType,
      ptInfoBack,
      imgBack
    }
  }
}
</script>
<style lang="scss" scoped>
.picTextContainer {
  box-sizing: border-box;
  .componentsContainer {
    box-sizing: border-box;
    padding: 20px;
    position: relative;
    .maker {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 2;
      cursor: not-allowed;
    }
  }
  .picTextHeader {
    border-bottom: 1px solid #e8eaec;
    box-sizing: border-box;
    padding: 0 40px;
    margin: 0 -30px;
    line-height: 50px;
  }
  .picTextContent {
    box-sizing: border-box;
    padding: 20px 10px 0;
  }
}
</style>
