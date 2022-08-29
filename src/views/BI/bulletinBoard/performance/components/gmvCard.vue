<template>
<div class="card-box">
  <div class="top">
    <div class="text-container">
      <span class="st">{{obj[active]}}:</span>
      <span class="bt">{{active==1?data.quarterDeliveryRate:active==2?data.quarterCorrectDistributeRate:data.quarterHonourAnAgreementRate}}</span>
      <span class="st">%</span>
    </div>
  </div>
  <div class="bottom">
    <div class="quarter" v-for="item in data.list" :key="item.month">
      <p class="mrb">
        <span class="quarter-b">{{item[active==1?'deliveryRate':active==2?'correctDistributeRate':'honourAnAgreementRate']}}</span>
        <span class="quarter-s">%</span>
      </p>
      <p class="quarter-s  font-small">{{item.month}}月</p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props:{
    active:{},
    data:{}
  },
  setup(){
    const obj = {1:'T+6发货率',2:'T+14妥投率',3:'T+20履约率'}
    return {
      obj
    }
  }
}
</script>

<style scoped lang="scss">
.card-box {
  width: 600px;
  height: 240px;
  margin-top: 12px;
  margin-bottom: 16px;;
  background: linear-gradient(311deg, #89C3F8 0%, #7CBDFF 100%);
  border-radius: 14px;

  .top {
    height: 126px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bottom {
    height: 114px;
    border-top: 2px solid rgba($color: #DDE1EE, $alpha:.6);
    display: flex;
    justify-content: space-around;

    .quarter {
      width: 33%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      color: #FFF;

      .mrb {
        margin-bottom: 10px;
      }

      .quarter-b {
        font-size: 28px;
      }

      .quarter-s {
        font-size: 24px;

      }
    }
  }

}

.text-container {
  color: #fff;

  .st {
    font-size: 36px;
  }

  .bt {
    font-size: 48px;
    margin-left: 10px;
  }
}
.font-small{
  font-weight: 100;
}
</style>
