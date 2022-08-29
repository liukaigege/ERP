<template>
  <el-dialog title="打印多发标签" v-model="ifShow" :width="850" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="printLabelView">
      <ElTableSimple v-if="goodsInfo.length > 0">
        <template v-slot:extraHeader>
          <div class="extraHeader">
            <div>商品列表 <span class="printTotal">打印总数: {{printTotal}}</span></div>
            <el-button type="text" @click="setPrintNum">数量设为1</el-button>
          </div>
        </template>
        <template v-slot:infoList>
          <div class="infoList">
            <div class="item" v-for="(item, index) in goodsInfo" :key="item.uuId">
              <el-image style="width: 60px; height: 60px" :src="item.mainImg" fit="contain"></el-image>
              <div class="info">
                <div class="textOverflow" :title="item.goodsName">{{item.goodsName}}</div>
                <div class="textOverflow" :title="item.goodsSku">{{item.goodsSku}}</div>
                <div class="textOverflow" :title="item.speVal">{{item.speVal}}</div>
              </div>
              <div class="right">
                <div class="gridName">【{{item.gridName}}】</div>
                <el-input-number size="small" :precision="0" v-model="item.quantity" style="width: 110px" controls-position="right" :min="0" :max="item.maxNum" @blur="printNumBlur(item.quantity, index)"></el-input-number>
                <el-button type="text" @click="delEvent(item.uuId)" :disabled="goodsInfo.length == 1">移除</el-button>
              </div>
            </div>
          </div>
        </template>
      </ElTableSimple>
		</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="closeEvent">取 消</el-button>
        <el-button type="primary"  :disabled="goodsInfo.length == 0" @click="affirmEvent" :loading="loading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs, computed } from 'vue'
import ElTableSimple from '@/components/elTableSimple/index.vue'
import { deepCopy } from '@/utils/tool.js'
import { onMounted } from 'vue'
import { printQrCode } from '@/api/store.js'
import { ElMessage } from 'element-plus'
import Moment from 'moment'
export default {
  emits: ['closeEvent', 'affirmEvent'],
  props: {
    selectGoodsInfo: {
      type: Array,
      default: []
    },
  },
  setup(props, context ) {
    let ifShow = ref(true)
    let state = reactive({
      goodsInfo: deepCopy(props.selectGoodsInfo),
      loading: false
		})

    let printTotal = computed(() => {
      let num = 0
      state.goodsInfo.forEach(item => {
        num = num + item.quantity
      })
      return num
    })

    let closeEvent = () => {
      context.emit('closeEvent')
    }

    let setPrintNum = () => {
      state.goodsInfo.forEach(item => {
        item.quantity = 1
      })
    }

    let affirmEvent = () => {
      console.log(state.goodsInfo)
      let arr = []
      state.goodsInfo.forEach(item => {
        if (item.quantity !== 0) {
          let obj = {
            packageType: '4',
            goodsName: item.goodsName,
            goodsSku: item.goodsSku,
            shelfPosition: item.areaName + item.gridName,
            printTime: Moment().format('YYYY-MM-DD H:mm:ss'),
            num: item.quantity,
            qrcode: '',
            skuValue: item.speVal,
            purchaseOrderNumber: item.purchaseOrderNumber
          }
          arr.push(obj)
        }
      })
      if (arr.length == 0) {
        ElMessage.error('请输入打印数量！')
        return false;
      }
      let params = {
        list: arr
      }
      state.loading = true
      printQrCode(params).then(res => {
        state.loading = false
        if (res.code == 200) {
          window.open(res.data)
          ElMessage.success({ message: '打印多发标签成功！', type: 'success' });
          context.emit('closeEvent')
        }
      }).catch(err => {
        state.loading = false
      })
    }

    let delEvent = (uuId) => {
      state.goodsInfo = state.goodsInfo.filter(item => item.uuId !== uuId)
    }

    let printNumBlur = (value, index) => {
      if (value == undefined) state.goodsInfo[index].quantity = 0
    }

    return {
      ifShow,
      ...toRefs(state),
      closeEvent,
      affirmEvent,
      printNumBlur,
      delEvent,
      setPrintNum,
      printTotal
    }
  },
  components: {
    ElTableSimple
  }
}
</script>

<style lang="scss" scoped>
.printLabelView{
  width: 100%;
  max-height: 600px;
  overflow-y: scroll;
  .extraHeader{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 37px;
    background-color: #F5F7FA;
    font-size: 14px;
    font-weight: 600;
    padding: 0 20px;
    span{
      margin-right: 16px;
    }
    .printTotal{
      color: #f81e0f;
      margin-left: 30px;
    }
  }
  .infoList{
    display: flex;
    flex-wrap: wrap;
    .item{
      width: 50%;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #dcdfe6;
      border-right: 1px solid #dcdfe6;
      .info{
        width: 160px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        color: rgba(0,0,0,.65);
      }
      .right{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-end;
        font-size: 14px;
        .gridName{
          margin-bottom: 5px;
        }
        a{
          color: #1890ff;
          margin-top: 5px;
        }
        .el-button{
          min-height: 20px;
          padding: 4px;
        }
      }
    }
  }
}
</style>