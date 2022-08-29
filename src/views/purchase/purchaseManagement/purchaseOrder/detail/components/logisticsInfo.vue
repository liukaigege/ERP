<template>
  <div class="page">
    <div class="headBox">物流信息</div>
    <div class="contentBox">
      <div class="logisticsList">
        <div class="item" :class="item.ifShow ? 'actived' : ''" v-for="(item, index) in props.info" :key="index">
          <div class="left">
            <div>{{item.name}}: <span>{{item.trackNum}}</span></div>
            <div>{{trackStatusOptions(item.trackStatus)}} <span v-if="item.trackStatus !== 3">{{item.estimateArrivalTime}}</span></div>
          </div>
          <div class="right">
            <div class="track" v-for="(it, ind) in JSON.parse(item.trackInfo)" :key="ind">
              <div>{{it.time}}</div>
              <div class="textOverflow" :title="it.context">{{it.context}}</div>
            </div>
            <div v-if="item.trackInfo == null">暂无物流信息</div>
          </div>
          <div class="line"></div>
          <el-button type="text" :class="item.ifShow ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" @click="clickEvent(index)" :disabled="item.trackInfo == null"></el-button>
        </div>
        <div class="hint" v-if="props.info == null || !props.info.length">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
  let props = defineProps({
    info: {
      type: Array,
      default: []
    }
  })
  let trackStatusOptions = computed(() => {
    return (type) => {
      switch (type) {
        case 0:
          return '在途'
        case 1:
          return '揽收'
        case 2:
          return '疑难'
        case 3:
          return '签收'
        case 4:
          return '退签'
        case 5:
          return '派件'
        case 6:
          return '退回'
        case 7:
          return '转单'
        case 10:
          return '待清关'
        case 11:
          return '清关中'
        case 12:
          return '已清关'
        case 13:
          return '清关异常'
        case 14:
          return '收件人拒签'

      }
    }
  })
  let clickEvent = (index) => {
    props.info[index].ifShow = !props.info[index].ifShow
  }
</script>

<style lang="scss" scoped>
  .page{
    background-color: #fff;
    margin-bottom: 24px;
    border-radius: 2px;
    .headBox{
      padding: 0 24px;
      height: 55px;
      line-height: 55px;
      color: rgba(0,0,0,.85);
      font-size: 16px;
      border-bottom: 1px solid #E9E9E9;
    }
    .contentBox{
      .logisticsList{
        padding: 16px 24px;
        .item {
          position: relative;
          display: flex;
          border-bottom: 1px solid #E9E9E9;
          padding: 18px 24px;
          background-color: #fafafa;
          height: 56px;
          overflow: hidden;
          .left {
            width: 50%;
            display: flex;
            div:nth-of-type(1){
              margin-right: 30px;
              span{
                color: #1890FF;
              }
            }
          }
          .right {
            width: 50%;
            padding-right: 50px;
            color: rgba(0,0,0,.45);
            .track{
              display: flex;
              margin-bottom: 16px;
              div:nth-of-type(1) {
                width: 150px;
                margin-right: 16px;
              }
              div:nth-of-type(2) {
                flex: 1;
                overflow: hidden;
                margin-right: 16px;
              }
            }
            .track:last-of-type{
              margin-bottom: 0;
            }
          }
          .el-icon-arrow-down, .el-icon-arrow-up{
            // color: #1890FF;
            font-size: 18px;
            position: absolute;
            right: 40px;
          }
        }
        .actived{
          height: auto;
        }
        .item:last-of-type{
          border: none;
        }
        .line{
          position: absolute;
          left: 48%;
          top: 16px;
          height: calc(100% - 32px);
          width: 1px;
          border-left: 1px dashed #E9E9E9;
        }
        .el-button {
          margin-left: 0;
          min-height: 20px;
          padding: 4px;
        }
        .hint{
          text-align: center;
          font-size: 14px;
          color: #606266;
        }
      }
    }
  }
  
</style>