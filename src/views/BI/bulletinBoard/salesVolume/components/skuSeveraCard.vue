<template>
<div class="card-box" v-for="(item,index) in data" :key="index" :style="style[index]">
  <div class="top">
    <div class="text-container">
      <span class="bt">{{item.months}}月报告</span>
    </div>
  </div>
  <div class="bottom">
    <div class="quarter">
      <p class="quarter-b">投放量：<i>{{item.launchNum||0}}</i></p>
      <p class="quarter-b"><span class="text-right">未动销量：</span><i>{{item.notMovingPinNum||0}}</i></p>
    </div>
    <div class="quarter">
      <p class="quarter-b">动销量：<i>{{item.movingPinNum||0}}</i></p>
      <p class="quarter-b"><span class="text-right">动销率：</span><i>{{item.movingPinRate||0}}</i><span class="quarter-s" v-if="item.movingPinRate>=0">%</span></p>
    </div>
    <div class="quarter">
      <p class="quarter-b">成功量：<i>{{item.successNum||0}}</i></p>
      <p class="quarter-b"><span class="text-right">成功率：</span><i>{{item.successRate||0}}</i> <span class="quarter-s" v-if="item.successRate>=0">%</span></p>
    </div>
    <div class="quarter">
      <p class="quarter-b">爆品量：<i>{{item.explosiveNum||0}}</i></p>
      <p class="quarter-b"><span class="text-right">爆品率：</span><i>{{item.explosiveRate||0}}</i> <span class="quarter-s" v-if="item.explosiveRate>=0">%</span></p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    style: {
      default: [
        { background: 'linear-gradient(311deg, #C16FE7 0%, #BC8EEE 100%)' },
        { background: 'linear-gradient(135deg, #8693F3 0%, #6A79E9 100%)' },
        { background: 'linear-gradient(135deg, #F6AA9B 0%, #E36F6F 100%)' }
      ]
    },
    data:{
      default:[]
    }
  }
}
</script>

<style lang="scss" scoped>
.card-box {
  width: 452px;
  height: 285px;
  background: linear-gradient(311deg, #89C3F8 0%, #7CBDFF 100%);
  border-radius: 14px;
  margin: 0 10px;
  .top {
    height: 62px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bottom {
    height: 223px;
    border-top: 2px solid rgba($color: #DDE1EE, $alpha:.6);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .quarter {
      display: flex;
      align-items: center;
      color: #FFF;
      padding-left: 24px;
      // .mrb {
      //   margin-bottom: 10px;
      // }

      .quarter-b {
        flex: 1;
        font-size: 20px;
        i{
          font-size: 24px;
          font-weight: 100;
          font-style: normal;
        }
      }

      .quarter-s {
        flex: 1;
        font-size: 24px;

      }
    }
  }

}

.text-container {
  color: #fff;

  .st {
    font-size: 48px;
  }

  .bt {
    font-size: 30px;
  }
}

</style>
