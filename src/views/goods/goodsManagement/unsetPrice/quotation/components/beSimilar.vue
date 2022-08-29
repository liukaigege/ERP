<template>
<el-dialog title="相似商品" v-model="show" width="80%" @close="close" :close-on-click-modal="false">
  <div class="flex">
    <el-image :src="data.mainImgUrl" fit="contain" style="width:120px;height:120px"></el-image>
    <div class="flex-item">
      <p>{{data.nameEn}}</p>
      <p>{{data.categoryName}}</p>
      <p>
        <el-tag  v-for="item in data.labelList" :key="item.id">{{item.name}}</el-tag>
      </p>
    </div>
  </div>
  <p class="similarText">存在相似的商品</p>
  <p>请选择相同商品进行申请权限，如均不同可关闭弹窗继续激活</p>
  <el-table :data="data.similarGoods" border stripe max-height="400px">
    <el-table-column label="" align="center" width="50px">
      <template #default="{row}">
        <div class="flex-radio">
          <el-radio v-model="radioValue" :disabled="row.tickStatus == 0" :label="row.id">{{null}}</el-radio>
        </div>
      </template>
    </el-table-column>
    <el-table-column  label="序号" align="center" type="index" width="80px"></el-table-column>
    <el-table-column prop="nameEn" label="商品名称" align="center" width="350px">
        <template #default="{row}">
          <p class="textOverflow_2" :title="row.nameEn">
            {{row.nameEn}}
          </p>
        </template>
    </el-table-column>
    <el-table-column prop="categoryName" label="品类" align="center" width="200px"></el-table-column>
    <el-table-column prop="goodsPosition" label="商品位置" align="center" width="200px"></el-table-column>
    <el-table-column prop="" label="商品图片" align="center">
      <template #default="{row}">
          <el-image :src="src" fit="contain" style="width:80px;height:80px" v-for="src in row.imgList" :key="src"></el-image>
      </template>
    </el-table-column>
  </el-table>

  <template #footer>
    <el-button @click="close" >关闭</el-button>
    <el-button type="primary"  @click="submit">申请权限</el-button>
  </template>
</el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import {quotationApplyAuth} from '@/api/goods/quotedPrice.js'
import { ElMessage } from 'element-plus'
export default {
  emits: ['closeEvent','success'],
  props:{
    data:{
      default:{}
    }
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      radioValue:''
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function submit(){
      if(!state.radioValue) return ElMessage.error('请选择相似品')
      quotationApplyAuth({
        goodsIds:[state.radioValue],
        goodsId:props.data.goodsId
      }).then(res=>{
        props.data.historyStatus = '3'
        props.data.goodsPosition = props.data.similarGoods.find(item=>item.id == state.radioValue).goodsPosition
        props.data.authId = state.radioValue
        ctx.emit('success')
        close()
      })
    }
    return {
      ...toRefs(state),
      close,
      submit
    }
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;

  .flex-item {
    margin-left: 16px;
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: space-around;
  }
}
.flex-radio{
  ::v-deep(.el-radio__label){
  padding-left: 0;
}
}

.similarText {
  color: #1890FF;
  margin: 24px 0 20px;
  font-size: 16px;
  font-weight: 600;
}
.el-image + .el-image{
  margin-left: 10px;
}
</style>
