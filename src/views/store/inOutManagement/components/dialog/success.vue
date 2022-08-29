<!--
* @Descripttion: Vango ERP success 手动出入库成功弹框
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="打印标签"
    v-model="dialogVisible"
    width="1000px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <el-row class="listContainer">
      <el-col :span="24">
        <div class="list listHeader">
          <div>入库商品</div>
          <div class="btns">
            <el-button type="text" @click="setNumToOne">数量设为1</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12" v-for="v in dataList" :key="v.skuId + v.gridName"
        ><el-container class="list">
          <el-aside width="100px">
            <el-popover
              v-if="v.mainImgThumbUrl"
              placement="right-start"
              trigger="hover"
              width="auto"
            >
              <el-image
                style="width: 200px; height: 200px"
                :src="v.mainImgUrl"
                fit="contain"
              ></el-image>
              <template #reference>
                <el-image
                  class="ml-10"
                  style="width: 70px; height: 70px"
                  :src="v.mainImgThumbUrl"
                  fit="contain"
                ></el-image>
              </template>
            </el-popover>
          </el-aside>
          <el-main>
            <div class="disF">
              <el-tooltip
                class="item"
                v-if="v.goodsName"
                effect="light"
                :content="v.goodsName"
                placement="top"
              >
                <div class="titleName">{{ v.goodsName || '-' }}</div>
              </el-tooltip>
              <p v-else></p>
              <div class="btns">
                <el-button
                  type="text"
                  :style="{
                    color: dataList.length < 2 ? '#C0C4CC' : '#fd4c60'
                  }"
                  @click="delFn(v.skuId, v.gridName)"
                  :disabled="dataList.length < 2"
                  >移除</el-button
                >
              </div>
            </div>
            <div class="goodsIbnfo">
              <div class="skpContainer">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="v.speVal"
                  placement="top"
                  v-if="v.speVal"
                >
                  <p class="speValP">{{ v.speVal || '-' }}</p>
                </el-tooltip>
                <p v-else></p>
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="v.skuId"
                  placement="top"
                  v-if="v.skuId"
                >
                  <p>{{ v.skuId || '-' }}</p>
                </el-tooltip>
                <p v-else></p>
              </div>
              <div class="gridName">
                <el-tooltip
                  class="item"
                  effect="light"
                  :content="v.gridName"
                  placement="top"
                  v-if="v.gridName"
                >
                  <p class="nowrapClass">{{ v.gridName || '-' }}</p>
                </el-tooltip>
                <p v-else></p>
              </div>
              <div class="inputNum">
                <el-input-number
                  v-model="v.printNumber"
                  controls-position="right"
                  :min="0"
                  :max="v.quantity"
                  style="width: 100px"
                ></el-input-number>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="ok" :loading="loading"
          >打 印</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs, getCurrentInstance } from 'vue'
import { printEqCode } from '../../composables/api'
import { ElMessage } from 'element-plus'
import { deepCopy } from '@/utils/tool.js'
export default {
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  setup(props) {
    const { proxy } = getCurrentInstance()
    const dataList = []
    props.list.forEach(v => {
      v.itemList.forEach(k => {
        const item = deepCopy(v)
        item.quantity = k.quantity
        item.gridName = k.gridName
        item.printNumber = k.quantity
        dataList.push(item)
      })
    })
    const state = reactive({
      dialogVisible: true,
      dataList,
      loading: false
    })
    function handleClose() {
      state.dialogVisible = false
      proxy.$parent.successShow = false
    }

    function ok() {
      const time = new Date()
      const printTime = `${time.getFullYear()}-${
        time.getMonth() + 1
      }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
      var totalNum = 0
      const list = state.dataList.map(v => {
        totalNum += v.printNumber - 0
        const obj = {
          packageType: null, //包裹类型1单品单数，2单品多数，3多品多数
          goodsName: v.goodsName, //商品名称
          goodsSku: v.skuId, //商品sku
          shelfPosition: v.areaName + ' ' + v.gridName, //货架位
          printTime, //打印时间
          num: v.printNumber, //打印数量（三期弃用）
          skuValue: v.speVal //规格值 对应speVal
        }
        return obj
      })
      if (totalNum == 0) {
        return ElMessage.warning({
          message: '请输入打标签数量'
        })
      }
      state.loading = true
      printEqCode({ list })
        .then(res => {
          if (res.data && res.code === 200) {
            state.loading = false
            handleClose()
            window.open(res.data)
            ElMessage.success({
              message: '打印二维码成功！'
            })
          } else {
            state.loading = false
            ElMessage.warning({
              message: res.message
            })
          }
        })
        .catch(err => {
          state.loading = false
        })
    }

    function delFn(skuId, gridName) {
      state.dataList = state.dataList.filter(
        v => v.skuId + v.gridName !== skuId + gridName
      )
    }
    function setNumToOne() {
      state.dataList = state.dataList.map(v => {
        v.printNumber = 1
        return v
      })
    }

    return {
      ...toRefs(state),
      handleClose,
      ok,
      delFn,
      setNumToOne
    }
  }
}
</script>
<style lang='scss' scoped>
.listContainer {
  border-left: 1px solid #e8e8e8;
  border-top: 1px solid #e8e8e8;
  .list {
    border-right: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    padding: 10px;
    box-sizing: border-box;
  }
  .listHeader {
    background-color: #fafafa;
    color: #262626;
    font-weight: 550;
    display: flex;
    div {
      flex: 1;
    }
    .btns {
      text-align: right;
    }
  }
}
.nowrapClass {
  height: 21px;
  line-height: 21px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.disF {
  display: flex;
  height: 32px;
  .titleName {
    flex: 3;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    line-height: 32px;
  }
  .btns {
    flex: 1;
    text-align: right;
  }
}
.goodsIbnfo {
  display: flex;
  .skpContainer {
    flex: 2;
    line-height: 21px;
    max-width: 50%;
    p {
      height: 21px;
      white-space: nowrap;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
    }
    .speValP{
      width: 90%;
    }
  }
  .gridName {
    flex: 1;
    line-height: 42px;
    height: 42px;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
  }
  .inputNum {
    flex: 1;
    padding-left: 10px;
    box-sizing: border-box;
  }
}
</style>