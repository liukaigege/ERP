<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: zhangzhifang
 * @Date: 2021-07-12 19:17:48
 * @LastEditors: zhangzhifang
 * @LastEditTime: 2021-07-14 20:10:03
-->
<template>
  <div class="headContain">
    <!-- <div class="headBody">
      <div class="headOne">
        <div class="mainImg" style="width: 80px; height: 80px" fit="contain">
          <el-image
            class="headImg"
            src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
          ></el-image>
        </div>
        <div class="mainFont">
          <p class="fontOne">N6-双面呼吸阀口罩-黑色</p>
          <p>USD 14.98</p>
          <p>重量：100g</p>
          <p>体积：25*16*4</p>
        </div>
        <div class="mainNumber">
          <p>X4</p>
        </div>
        <div class="mainTime">
          <p>定制时间</p>
          <p>到货时间</p>
          <p>周期</p>
          <p>供应商</p>
        </div>
      </div>
    </div> -->
    <div style=" font-size: 16px">
      <!-- <p>定制内容</p> -->
    </div>
    <!-- 表格部分 -->
    <div >
      <el-table
        :data="data"
        style="width: 100%"
        :header-cell-style="{
          background: '#FAFAFA',
          color: '#606266'
        }"
      >
        <el-table-column prop="custName" align="center" label="规格名称">
        </el-table-column>
        <el-table-column align="center" label="规格值">
          <template #default="scope">
            <div>
              <el-image
                v-if="scope.row.type == '1'"
                style="width: 90px; height: 90px"
                :src="scope.row.custValue"
                fit="contain"
              >
              </el-image>
              <p v-else>{{ scope.row.custValue }}</p>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { toRefs, reactive } from 'vue'
import { onMounted } from 'vue'
import {
  productGoods //出入记录页面定制
} from '@/api/store.js'
export default {
  props: {
    productId: {
      type: String,
      default: String
    },
    productType: {
      type: String,
      default: String
    },
    type:{
      type: String,
      default: String
    }
  },
  setup(props) {
    const productId = props.productId
    const productType = props.productType
    const types=props.type
    const state = reactive({
      data: []
    })
    const init = () => {
      let params = {
        type:productType+''  ,
        serialNumber: productId
      }
      console.log(params)
      productGoods(params, types).then(res => {
        console.log(res)
        if(res.code==200){
          state.data=res.data
         
        }
      })
    }
     onMounted(() => {
        init()
      })
    return { ...toRefs(state), productType, productId,types }
  }
}
</script>
<style scoped lang="scss">
.headContain {
  // :deep(.el-dialog__header) {
  //   border: 1px solid #ebebeb !important;
  // }
 
  .headBody {
    width: 752px;
    height: 96px;
    border: 1px solid #e8e8e8;
  }
  .headOne {
    display: flex;
    align-items: center;
  }
  .headOne .mainImg {
    position: relative;
    margin-left: 16px;
    width: 80px;
    height: 80px;
    border: 1px solid #e8e8e8;
    margin-top: 8px;
  }
  .headOne .mainFont {
    margin-left: 16px;
  }
  .headOne .mainImg .headImg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .mainFont {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
  }
  .mainFont .fontOne {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .mainNumber {
    margin-left: 90px;
    font-size: 12px;
  }
  .mainTime {
    margin-left: 140px;
    font-size: 12px;
    padding-top: 8px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
  }
  .mainTime p {
    padding-top: 2px;
  }
}
</style>
