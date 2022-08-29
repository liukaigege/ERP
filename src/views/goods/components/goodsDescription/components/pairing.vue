<!--
 * @Descripttion: 'pairing 商品配对查询弹框'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <el-dialog
    title="商品配对"
    v-model="visible"
    width="800px"
    :close-on-click-modal="visible"
  >
    <div>
      <div
        class="clearfix"
        style="border-bottom: 1px dashed #e9e9e9; padding-bottom: 20px"
      >
        <div class="fl imgContainer">
          <img :src="data.url" alt="" />
        </div>
        <div class="fl title longTitle">
          <p style="font-weight: 550">{{ data.nameCn }}</p>
          <p>{{ data.skuId }}</p>
          <p>{{ data.speVal }}</p>
        </div>
      </div>
      <div class="clearfix outterContainer">
        <ul class="fl tableContainer" v-if="leftList.length">
          <li class="clearfix" v-for="item in leftList" :key="item.sku">
            <div class="fl imgContainer">
              <img :src="item.mainImg" alt="" />
            </div>
            <div class="fl title short">
              <p style="font-weight: 550">{{ item.goodsName }}</p>
              <p>{{ item.sku }}</p>
              <p>
                <span v-for="v in item.skuValues" :key="v.spe">
                  {{ v.spe }}:{{ v.speVal + ' ' }}
                </span>
              </p>
            </div>
          </li>
        </ul>
        <ul class="fr tableContainer" v-if="rightList.length">
          <li class="clearfix" v-for="item in rightList" :key="item.sku">
            <div class="fl imgContainer">
              <img :src="item.mainImg" alt="" />
            </div>
            <div class="fl title short">
              <p style="font-weight: 550">{{ item.goodsName }}</p>
              <p>{{ item.sku }}</p>
              <p>
                <span v-for="v in item.skuValues" :key="v.spe">
                  {{ v.spe }}:{{ v.speVal + ' ' }}
                </span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close" >取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { getSkuMatchList } from '../composables/api.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  setup(props, context) {
    const state = reactive({
      visible: true,
      leftList: [],
      rightList: []
    })
    getSkuMatchList({ skuId: props.data.skuId })
      .then(res => {
        if (res.code == 200) {
          if (res.data) {
            res.data.forEach((v, i) => {
              v.skuValues = JSON.parse(v.skuValue)
              if (i % 2 == 0) {
                state.leftList.push(v)
              } else {
                state.rightList.push(v)
              }
            })
          }
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    
    function close() {
      context.emit('close', false)
    }
    return {
      ...toRefs(state),
      close
    }
  }
}
</script>
<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding-top: 0 !important;
}
.imgContainer {
  width: 70px;
  height: 70px;
  position: relative;
  img {
    max-height: 100%;
    max-width: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
.title {
  line-height: 23px;
  font-size: 12px;
  margin-left: 20px;
  p{
    height: 23px;
    line-height: 23px;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
  }
}
.tableContainer {
  width: 48%;
}
.outterContainer {
  margin-top: 20px;
  .tableContainer {
    border: 1px solid #e8e8e8;
    li {
      border-top: 1px solid #e8e8e8;
      box-sizing: border-box;
      padding: 10px;
    }
    li:first-child {
      border-top: none;
    }
  }
}
.short{
    max-width: 250px;
}
.longTitle{
  max-width: 670px;
}
</style>