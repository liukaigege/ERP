<!--
* @Descripttion: Vango ERP singleItem 订单详情 组合品中单品的弹框
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <ul class="single_item_container">
    <li class="single_item_list" v-for="(item, index) in list" :key="index">
      <div class="image_container">
        <el-popover placement="right-start" trigger="hover" width="auto">
          <el-image
            style="width: 200px; height: 200px"
            :src="item.mainImgUrl || item.mainImg"
            fit="contain"
          ></el-image>
          <template #reference>
            <el-image
              class="ml-10"
              style="width: 70px; height: 70px"
              :src="item.mainImgThumbUrl || item.mainImg"
              fit="contain"
            ></el-image>
          </template>
        </el-popover>
        <el-button class="replaceBtn" size="mini" v-if="item.goodAttribute == 3"
          >替代</el-button
        >
        <el-button
          class="replaceBtn"
          size="mini"
          v-else-if="item.goodAttribute == 2"
          >相似</el-button
        >
      </div>
      <div class="item_info_container">
        <p class="item_title">{{ item.skuCode }}</p>
				<p class="item_title">SKU ID：{{item.skuId}}</p>
        <p class="item_title">
          {{ item.skuValue ? skuShow(item.skuValue) : '-' }}
        </p>
        <p class="item_title">CNY：{{ item.purchasePrice }}<span>&nbsp;&nbsp;&nbsp;&nbsp;货架位：{{item.shelfGridName||'-'}}</span></p>
        <p class="item_title">
          <span>仓库库存：</span>
          <span style="color: #ff4d4f">{{ item.stockQuantity || 0 }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <span>到货：</span>
          <span style="color: #67c23a">{{ item.matchQuantity || 0 }}</span>
        </p>
      </div>
      <div class="item_number">x{{ item.goodsQuantity || item.quantity || 0 }}</div>
    </li>
  </ul>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { skuShow } from '@/utils/tool.js'
export default {
  props: {
    list: Array,
    quantity: {
      type: Number,
      default: 1
    }
  },
  setup(props) {
		console.log(props.list)
    const state = reactive({})
    return {
      ...toRefs(state),
      skuShow
    }
  }
}
</script>
<style lang='scss' scoped>
.single_item_container {
  width: 420px;
  .single_item_list {
    border-top: 1px solid #dedede;
    padding-top: 5px;
    display: flex;
    .image_container {
      position: relative;
      .replaceBtn {
        position: absolute;
        top: 0;
        left: 0;
        width: 30px;
        height: 20px;
        color: #ff4d4f;
        border-color: #ff4d4f;
      }
    }
    .image_container,
    .item_number {
      flex: 1;
      line-height: 100px;
      text-align: center;
    }
    .item_info_container {
      flex: 4;
      box-sizing: border-box;
      padding: 0 10px;
    }
    .item_title {
      width: 280px;
      height: 25px;
      line-height: 25px;
      white-space: nowrap;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }
  .single_item_list:first-child {
    border-top: none;
  }
}
</style>
