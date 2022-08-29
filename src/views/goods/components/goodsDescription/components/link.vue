<!--
 * @Descripttion: 'link 商品信息=>参考/采集产品链接'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="linkContainer">
    <div class="linkHeader">
      {{ linkData.mode != 2 ? '采集产品' : '参考产品' }}
    </div>
    <div class="linkContent">
      <el-form class="demo-ruleForm">
        <el-form-item
          label="采集产品链接："
          v-if="linkData.mode != 2 && linkData.mode != 3 && linkData.copyStatus == 0"
        >
          <a target="_blank" :href="linkData.collectionUrl">{{
            linkData.collectionUrl
          }}</a>
        </el-form-item>
        <el-form-item
          label="参考产品链接："
          prop="linkData"
          v-else
        >
          <div v-if="routerName === 'setPriceDetail'">
            <div v-for="(item, index) in linkData.referenceUrls" :key="item">
              <el-input
                v-model="item.val"
                :style="styleCss"
                :disabled="!isEdit"
              ></el-input>
              <el-button
                v-if="index == 0 && linkData.referenceUrls.length < 5 && isEdit"
                type="text"
                icon="el-icon-plus"
                
                @click="addUrlFn"
              ></el-button>
              <el-button
                v-if="index != 0 && isEdit"
                type="text"
                icon="el-icon-delete"
                
                style="color: #fd4c60"
                @click="delUrlFn(index)"
              ></el-button>
            </div>
          </div>
          <div v-else>
            <a v-for="item in linkData.referenceUrls" :key="item" target="_blank" :href="item.val">{{
              item.val
            }}</a>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
export default {
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
    const router = useRoute()
    // router.name != 'setPriceDetail'
    let list = []
    if (!props.data.referenceUrls || props.data.referenceUrls.length == 0) {
      list = [{ val: '' }]
    } else {
      props.data.referenceUrls.forEach(v => {
        list.push({ val: v ? v : '' })
      })
    }
    const styleCss = 'width:850px;margin-right:15px;'
    const state = reactive({
      linkData: {
        collectionUrl: props.data.collectionUrl,
        mode: props.data.mode,
        referenceUrls: list,
        copyStatus:props.data.copyStatus
      },
      routerName: router.name
    })

    watch(state.linkData, () => {
      context.emit('changeBack', state.linkData)
    })

    function addUrlFn() {
      state.linkData.referenceUrls.push({ val: '' })
    }

    function delUrlFn(i) {
      state.linkData.referenceUrls.splice(i, 1)
    }
    function clickInput(val) {
      if (val && !isEdit) window.open(val, '_blank')
    }

    return {
      ...toRefs(state),
      addUrlFn,
      delUrlFn,
      styleCss,
      clickInput
    }
  }
}
</script>
<style lang="scss" scoped>
.linkContainer {
  box-sizing: border-box;
  .linkHeader {
    background-color: #fff;
    border-bottom: 1px solid #e8eaec;
    box-sizing: border-box;
    padding: 0 40px;
    line-height: 50px;
    margin: 0 -30px;
  }
  .linkContent {
    box-sizing: border-box;
    padding: 20px 10px 0;
    overflow: hidden;
  }
}
</style>