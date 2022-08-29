<template>
<div class="card-box">
  <div class="top">
    <div class="text-container">
      <span class="st">客单价:</span>
      <span class="bt">{{unitPrice}}</span>
      <span class="st">$</span>
    </div>
  </div>
  <div class="bottom">
    <div class="quarter" v-for="item in data" :key="item.months">
      <p class="mrb">
        <span class="quarter-b">{{item.unitPrice}}</span>
        <span class="quarter-s">$</span>
      </p>
      <p class="quarter-s  font-small">{{item.months}}月</p>
    </div>
  </div>
</div>
</template>

<script>
import { computed } from 'vue-demi'
export default {
  props: {
    data: {
      default: []
    }
  },
  setup(props) {
    const unitPrice = computed(() => {
      let num1 = 0 // GMV总和
      let num2 = 0 // 订单量
      props.data.forEach(item =>{
        num1 += +item.gmvTotalPrice
        num2 += +item.totalNum
      } )
      console.log(num1,num2);
      return !num1 && !num2 ? 0 : (num1/num2).toFixed(2)
    })
    
    return {
      unitPrice
    }
  }
}
</script>

<style lang="scss" scoped>
.card-box {
  width: 600px;
  height: 240px;
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
    vertical-align: sub;
  }
}

.font-small {
  font-weight: 100;
}
</style>
