<!--
 * @Descripttion: 物流信息
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 15:22:30
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 16:48:16
-->

<template>
  <div class="logisitcs">

    <p class="num line" v-if="showLpl && parent.lplLogisticsName">{{parent.lplLogisticsName}}{{parent.lplLgtcLineName ? '-'+parent.lplLgtcLineName:''}}</p>
    <p class="num line" v-if="showLpl && parent.lplTrackNumber">{{parent.lplTrackNumber}}</p>

      <el-button  v-if="!showNoSelect()" :disabled="!showBtn()" type="text"  @click="seletLogistics">{{parent.logistics ? showName() : '请选择物流方式'}}</el-button>

      <p class="noLogis" v-if="showNoSelect()">未选择物流方式</p>
      <p class="error"  v-if="showError()">{{parent.apiResponse}}</p>


      <el-tooltip placement="top" v-if="showNum()">
        <template #content>
          <p style="cursor:pointer"	v-copy="parent.trackNumber">复制</p>
        </template>
        <p class="num" @click="showInfo">{{parent.trackNumber}}</p>
      </el-tooltip>

      <el-popover
								placement="top"
								:width="200"
								trigger="hover"
                v-if="showStatus && parent.lplApplyStatus !== 2"
							>
              <div class="hisLogi">
                <p class="num" style="color:#1890FF">{{hisLogistic}}</p>
              <p class="num" >{{hisTrackNum}}</p>
              </div>
          <template #reference>
            <p class="noLogis" @mouseenter="getLog">{{getStatus(parent)}}</p>
           </template>
       </el-popover>
       <p class="noLogis" v-if="showStatus && parent.lplApplyStatus !== 1">{{getStatus(parent)}}</p>

      <p class="noLogis" v-if="showPrint"> 补打单次数:{{parent.printCount}}</p>
      <!-- <p class="type" v-if="showChange()">已更换</p> -->
  </div>
</template>

<script>
  import {computed,onMounted, reactive, toRefs,getCurrentInstance,inject} from 'vue'
  import {useStore} from 'vuex'
	import {authPath} from '@/utils/hooks'
	import {orderPackageLogistics} from '@/api/order/orderManagement.js'
  export default {
    props:{
      scope:{
        type:Object,
        default:null
      }
    },
    setup(props){
      const {proxy} = getCurrentInstance()
      const data = reactive({
          hisLogistic:'',
          hisTrackNum:''
      })
      const store = useStore()
      const parent = computed(()=>props.scope.parentRow)
      const orderStatus = computed(()=>props.scope.parentRow.packageStatus)
      const orderTable = inject('orderTable')
      // 获取的orderTable 组件
      const seletLogistics = ()=>{
				let list = orderTable.value.tableData
        const {isChangeLogist} = store.getters
				let  isAllMatching = list.some(item=>{
					if (parent.value.packageId == item.packageId){
						return	item.packageRels?.some(v=>{
							return v?.packageSkus?.some(x=>{
								return x?.packageGoods.length  == 0 || x.quantity<= 0
							})
						})
					}
				})
        let query = {
          logisticsId:parent.value.logisticsId,
          id:parent.value.packageId,
          type:0,
          applyFlag:isChangeLogist ? 1 : 0,
          parent:parent.value,
					isAllMatching:!isAllMatching // 判断是否全部匹配商品
        }
        proxy.$parent.$parent.showDialog('changeLogistics','选择物流','40%',query)
      }

      const tabType = computed(()=> store.getters.orderTabType)
      const showBtn =()=>{
				if(!authPath('orderManagement/selLogistics')) return false  //根据权限判断
				let dsiabledList = ['allOrder','applying','success','shelve','inStock','outStock','toBeDelivered','refunded']
				const {logistics,forbidFlag} = parent.value
				const {isChangeLogist,changeLogisticType} = store.getters //  更换物流\
				let logistWhite = ['waitPrint','toBeDelivered','orderSuccess']
				if(isChangeLogist &&  logistWhite.indexOf(changeLogisticType) !== -1) return  false
				if(forbidFlag === 1) return false
				const {merageStatus} = store.getters
				let bole = true
				if(merageStatus !== '0') return false
				if(dsiabledList.indexOf(tabType.value) !== -1 ) return false
				if(logistics) return  true
				return bole
      }
      const showNoSelect = ()=>{

        const {logistics} = parent.value
        let bole = false
        if(tabType.value == 'allOrder' && !logistics) bole = true
        return bole
      }
      const showError = ()=>{
          const {logistics,applyStatus} = parent.value
          if(applyStatus == 1) return false // 如果申请成功直接隐藏
          let bole = false
          if(orderStatus.value == 3 && logistics  ) bole = true
          if(orderStatus.value == -1) bole = true
          return bole
      }
      const showNum = ()=>{
        const {logistics,trackNumber} = parent.value
        let bole = true
        if(!logistics || !trackNumber) return false
        if(orderStatus.value== 4|| orderStatus.value == 5 || orderStatus.value == 6 || orderStatus.value == 7 || orderStatus.value == 8) return true
        return bole
      }
      const showChange =()=>{
        let bole = false
        if( orderStatus.value == 8) return true
        return bole
      }

      const showName = val=>{
         let type = parent.value.trackType == 1 ? '-手工' :   ''
         let line = parent.value.lgtcLineName ? '-'+parent.value.lgtcLineName : ''
         return parent.value.logisticsName+line+ type
      }

      const showPrint = computed(()=>{
         const {printCount} = parent.value
         const {orderType,isChangeLogist,changeLogisticType} = store.getters
         if(orderType == 7 && printCount) return true
         if(printCount&& orderType == 8 && changeLogisticType == 'toBeDelivered') return true
         return false
      })

      const getStatus = val=>{
        switch(val.lplApplyStatus){
          case 1:
          return '已更换';
          case 2:
          return '更换中';
        }
      }

      const showStatus = computed(()=>{
        const {orderType,isChangeLogist} = store.getters
        const packageRelId = props.scope.parentRow.packageRelId
        if(isChangeLogist) return false // 非已交运显示
       if(parent.value.lplApplyStatus ==0 ||orderType !== 8  || !packageRelId) return false
        return true
      })

      const showLpl = computed(()=>{
        const {isChangeLogist,changeLogisticType} = store.getters
        if(!isChangeLogist || changeLogisticType !=='pending') return false // 非已交运显示
        return true
      })

      const getLog = ()=>{
        const packageId = props.scope.parentRow.packageId

        const {isChangeLogist} = store.getters
        let flag = isChangeLogist ? 0 :1
        orderPackageLogistics({packageId,flag}).then(res=>{
            if(res.code == 200){
                data.hisLogistic = res.data.logisticsName + ( res.data.lgtcLineName ? `-${res.data.lgtcLineName}` : '')
                data.hisTrackNum = res.data.trackNumber
            }
        })
      } // 获取物流追溯信息

      const showInfo = val=>{
        const {orderType,isChangeLogist} = store.getters //
        if(orderType !== 8 || isChangeLogist) return
         orderTable.value.showDialog('LogisticInfo','物流轨迹','40%',{pageId:parent.value})
      } // 打开物流信息弹窗

      onMounted(()=>{

      })
      return {
        ...toRefs(data),
        parent,
        tabType,
        seletLogistics,
        showBtn,
        showNoSelect,
        showError,
        showNum,
        showChange,
        showName,
        showPrint,
        getStatus,
        showStatus,
        getLog,
        showInfo,
        showLpl,

      }
    }
  }
</script>
<style lang="scss" scoped>
.logisitcs{
  text-align: left;
  padding: 5px 20px;
  .num{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.45);
  }
  .type{
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
  }
  .error{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FE585A;
  }
  .noLogis{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.45);
  }
}
.hisLogi{
  text-align: center;
}
.line{
  text-decoration: line-through;
}
</style>
