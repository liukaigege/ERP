<!--
 * @Descripttion: 打印二维码弹框
 * @version: 
 * @Author: 韦剑
 * @Date: 2021-07-15 09:58:03
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-22 21:56:29
-->
<template>
  <el-dialog title="打印商品标签" v-model="ifShow" :width="850" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
    <div class="printLabelView">
      <template v-for="(item, index) in PackageArr">
        <ElTableSimple :key="item.packageId" style="margin-bottom: 5px" v-if="item.relGoodsInfo?.length > 0">
          <template v-slot:extraHeader>
            <div class="extraHeader">
              <div>包裹号：{{item.packageId}}<span class="printTotal">打印总数: {{item.printTotal}}</span></div>
              <el-button type="text" @click="setPrintNum(index)">数量设为1</el-button>
            </div>
          </template>
          <template v-slot:infoList>
            <div class="infoList">
              <div class="item" v-for="(it, ind) in item.relGoodsInfo" :key="it.uuId">
                <el-image style="width: 60px; height: 60px" :src="it.mainImg" fit="contain"></el-image>
                <div class="info">
                  <div class="textOverflow" :title="it.goodsName">{{it.goodsName}}</div>
                  <div class="textOverflow" :title="it.speVal">{{it.speVal}}</div>
                  <div class="textOverflow" :title="it.goodsSku">{{it.goodsSku}}</div>
                </div>
                <div class="right">
                  <div class="gridName">【{{it.gridInfo.gridName}}】</div>
                  <el-input-number size="small" :precision="0" v-model="it.gridInfo.originQuantity" style="width: 110px;margin: 5px 0;" controls-position="right" :min="0" :max="it.gridInfo.maxNum" @blur="printNumBlur(it.gridInfo.originQuantity, index, ind)"></el-input-number>
                  <a @click="delEvent(index, item.packageId, it.uuId)">移除</a>
                </div>
              </div>
            </div>
          </template>
        </ElTableSimple>
      </template>
		</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeEvent" >取 消</el-button>
        <el-button type="primary" @click="affirmEvent"  :disabled="disabled == 0" :loading="loading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs, computed, watch } from 'vue'
import { defineComponent, onMounted } from 'vue'
import ElTableSimple from '@/components/elTableSimple/index.vue'
import { deepCopy, _debounce } from '@/utils/tool.js'
import { printQrCode } from '@/api/store.js'
import { ElMessage } from 'element-plus'
import Moment from 'moment'
export default defineComponent({
	emits: ['closeEvent', 'affirmEvent'],
  props: {
    selectPackageArr: {
      type: Array,
      default: []
    }
  },
	setup(props, context) {
    console.log(props.selectPackageArr)
		let ifShow = ref(true)
		let state = reactive({
			value: '',
      PackageArr: deepCopy(props.selectPackageArr),
      loading: false
		})

    let closeEvent = () => {
      context.emit('closeEvent')
    }

    let affirmEvent = _debounce(() => {
      let arr = []
      state.PackageArr.forEach(item => {
        item.relGoodsInfo.forEach((it, ind) => {
          if (it.gridInfo.originQuantity !== 0) {
            let obj = {
              packageType: item.packageType+'',
              goodsName: it.goodsName,
              goodsSku: it.goodsSku,
              shelfPosition: it.gridInfo.areaName + ' ' + it.gridInfo.gridName,
              printTime: Moment().format('YYYY-MM-DD H:mm:ss'),
              num: it.gridInfo.originQuantity,
              qrcode: '',
              skuValue: it.speVal
            }
            arr.push(obj)
          }
        })
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
          ElMessage.success({ message: '打印二维码成功！', type: 'success' });
          window.open(res.data)
          context.emit('affirmEvent')
        }
      }).catch(err => {
        state.loading = false
    
      })
    })

    // 批量设置打印数量
    let setPrintNum = (index) => {
      state.PackageArr[index].relGoodsInfo.forEach(item => {
        item.gridInfo.originQuantity = 1
      })
    }
    
    let delEvent = (index, selectPackageId, uuId) => {
      let packageId = state.PackageArr[index].packageId
        state.PackageArr[index].relGoodsInfo = state.PackageArr[index].relGoodsInfo.filter(item => packageId + '-' + item.uuId !== selectPackageId + '-' + uuId)
    }

    let printNumBlur = (value, index, ind) => {
      if (value == undefined) state.PackageArr[index].relGoodsInfo[ind].gridInfo.originQuantity = 1
    }

    // 判断是否禁止置灰确认按钮
    let disabled = computed(() => {
      let arr = []
      state.PackageArr.forEach(item => {
        item.printTotal = 0
        item.relGoodsInfo.forEach((it, ind) => {
          arr.push(it)
          item.printTotal = item.printTotal + it.gridInfo.originQuantity
        })
      })
      return arr.length
    })
		return {
			...toRefs(state),
			ifShow,
			closeEvent,
      affirmEvent,
      setPrintNum,
      delEvent,
      printNumBlur,
      disabled,
		}
	},
  components: {
    ElTableSimple
  }
})
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
        a{
          color: #1890ff;
        }
      }
    }
  }
}
</style>