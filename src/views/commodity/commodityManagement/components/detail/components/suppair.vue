<template>
<el-dialog title="建立1688配对关系" v-model="show" width="1000px" @close="close">
  <div class="head">
    <el-image :src="goodsInfo.mainImg" fit="fill" :lazy="true" style="margin-right:8px;width:60px;height:60px">
    </el-image>
    <div>
      <p>{{goodsInfo.skuCode}}</p>
      <p>{{goodsInfo.skuValue}}</p>
    </div>
  </div>
  <div class="search">
    <el-input v-model="url" placeholder="请输入1688商品网址..."  clearable style="width:688px"></el-input>
    <el-button type="primary"  @click="searchGoods">获取</el-button>
  </div>
  <div class="content" v-if="loadSuccess">
    <div class="skuImg">
      <el-image :src="checkImg" fit="fill" style="width: 360px;height: 360px;"></el-image>

    </div>
    <div class="skuBox">
      <div class="goodsName">{{goodsName}}</div>
      <div class="goodsSku">
        <span v-for="item in checkList" :key="item.key" style="margin-right:8px">{{item.spe}}：{{item.speVal}}</span>
      </div>
      <div v-for="item in skuProps" :key="item.prop" class="skuList">
        <span> {{item.prop}}：</span>

        <div class="speInfo">
          <div v-for="value in item.value" :key="value.name" :class="{isCheckSku:value.checked,noCheckSku:!value.checked}" @click="checkSku(item,value)">
            <el-image :src="value.imageUrl" :title="value.name" fit="fill" v-if="value.imageUrl" style="width:38px;height:38px"></el-image>
            <p v-if="!value.imageUrl" style="padding: 0 5px">{{value.name}}</p>
            <i class="el-icon-check" v-if="value.checked"></i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <template #footer>
    <el-button  @click="close">取消</el-button>
    <el-button type="primary"  @click="returnSup">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import { supShop } from '@/api/commodity.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    goodsInfo: {},
    pairInfo: {}
  },
  emits: ['closeEvent', 'returnSup'],
  setup(props, ctx) {
    const state = reactive({
      url: '',
      oldUrl: '',
      show: true,
      data: {},
      checkList: [],
      mainImg: '',
      goodsName: '',
      checkImg: '',
      skuProps: [],
      goodsNum: null,
      loadSuccess: false,
      orderParam:{
        price:'',
        beginAmount:''
      }
    })

    onMounted(() => {
      if (props.pairInfo) {
        state.url = props.pairInfo.link
        searchGoods()
      }
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }

    function checkSku(item, value) {
      item.value.forEach(e => {
        e.checked = false
      })
      value.checked = true
      state.checkList.find(e => e.spe == item.prop).speVal = value.name
      console.log(checkImg.value);
    }

    function searchGoods() {
      if (!state.url.trim()) return ElMessage.error('请输入采购链接')
      state.data = {}
      state.checkList = []
      state.loadSuccess = false
      supShop({ url: state.url }).then(res => {
        state.oldUrl = state.url
        if (typeof res.data == 'string') return ElMessage.error('未获取到数据，请重新尝试') // 没有数据
        // if(res.data.shopInfo?.sellerUserId !=2201498831912) return ElMessage.error('链接配对失败') // 非供应商店铺链接
        if (res.data.shopInfo ?.sellerUserId != props.goodsInfo.thirdPlatformSupplierId) return ElMessage.error('配对失败,非当前供应商商品链接') // 非供应商店铺链接
        ElMessage.success('获取成功')
        // state.mainImg = res.data.goodsSpu.mainImg
        state.goodsName = res.data.goodsSpu.goodsName
        state.checkList = []
        res.data.goodsSku.skuProps.forEach(item => {
          if (props.pairInfo ?.pairInfo && props.pairInfo.link == state.url) {
            let obj = props.pairInfo.pairInfo.speInfo.find(val => item.prop == val.spe)
            let speObj = item.value.find(val => { return val.name == obj.speVal })
            if (speObj) {
              speObj.checked = true
              state.checkList.push(obj)
            } else {
              item.value[0].checked = true
              state.checkList.push({
                spe: item.prop,
                speVal: item.value[0].name
              })
            }
          } else {
            item.value[0].checked = true
            state.checkList.push({
              spe: item.prop,
              speVal: item.value[0].name

            })
          }

        })
        state.loadSuccess = true
        state.data = res.data
        state.skuProps = res.data.goodsSku.skuProps
        state.goodsNum = res.data.goodsSpu.goodsNum
        console.log(res.data.orderParam.skuParam.skuRangePrices);
        state.orderParam.price = Math.min(...res.data.orderParam.skuParam.skuRangePrices.map(item=>item.price))
        state.orderParam.beginAmount = Math.min(...res.data.orderParam.skuParam.skuRangePrices.map(item=>item.beginAmount))
        state.price = Math.min(...res.data.orderParam.skuParam.skuRangePrices.map(item=>item.price))
      })
    }
    let checkImg = computed(() => {
      let key = state.checkList.map(item => item.speVal).join('>')
      return  state.data ?.goodsSku ?.skuInfoMap[key] ?.imageUrl  || state.data ?.goodsSpu ?.mainImg
    })
    let specId = computed(() => {
      let key = state.checkList.map(item => item.speVal).join('>')
      return state.data ?.goodsSku ?.skuInfoMap[key] ?.specId
    })

    function returnSup() {
      if (!state.loadSuccess) return ElMessage.error('无配对信息')
      let speInfoStr = state.checkList.map(item => {
        return `${item.spe}:${item.speVal}`
      }).join(',')
      console.log(speInfoStr);
      let obj = {
        name: state.goodsName,
        img: checkImg.value,
        price:state.price + '',
        speInfo: state.checkList,
        specId: specId.value,
        link: state.oldUrl,
        offerId: state.goodsNum,
        speInfoStr,
        sellerUserId:props.goodsInfo.thirdPlatformSupplierId,
        orderParam:state.orderParam
      }
      console.log(obj);
      ctx.emit('returnSup', obj)
      close()
    }
    return {
      ...toRefs(state),
      close,
      checkSku,
      searchGoods,
      checkImg,
      returnSup
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  border-bottom: 1px dashed #E9E9E9;
  padding-bottom: 16px;
  margin-bottom: 16px;

  img {
    width: 60px;
    height: 60px;
  }
}

.search {
  display: flex;
  margin-bottom: 16px;
}

.content {
  display: flex;
  border: 1px solid #E8E8E8;
  border-radius: 5px;
  padding: 28px 16px;
}

.speInfo {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}

.skuImg {
  margin-right: 16px;

}

.skuBox {
  img {
    width: 38px;
    height: 38px;
  }
}

.skuList {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
}

.noCheckSku {
  position: relative;
  min-width: 40px;
  max-height: 40px;
  border: 1px solid rgba(0, 0, 0, .25);
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
}

.isCheckSku {
  position: relative;
  min-width: 40px;
  max-height: 40px;
  border: 1px solid red;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 2px;

  .el-icon-check {
    position: absolute;
    font-size: 12px;
    right: -2px;
    bottom: -2px;
    z-index: 2;
    color: #fff;
  }

}

.isCheckSku::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  display: inline-block;
  border: 6px solid red;
  border-top: 8px solid transparent;
  border-left: 8px solid transparent;
  z-index: 1;
}

.goodsName,
.goodsSku,
.skuList {
  line-height: 26px;
  margin-bottom: 16px;
}
</style>
