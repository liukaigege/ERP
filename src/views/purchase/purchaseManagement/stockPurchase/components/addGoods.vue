<template>
  <el-dialog
    title="添加商品"
    v-model="show"
    width="850px"
    @close="close"
    :close-on-click-modal="false"
  >
    <div style="margin-bottom: 10px">
      仓库:
      <el-select v-model="warehouseId"  disabled>
        <el-option label="万众智谷仓" :value="1"></el-option>
      </el-select>
    </div>
    <div class="search">
      <div>
        <el-select
          v-model="searchData.searchType"

          style="width: 110px"
        >
          <el-option label="商品SKU" :value="2"></el-option>
          <el-option label="商品名称" :value="1"></el-option>
          <el-option label="SKU编码" :value="3"></el-option>
          <el-option label="商品编码" :value="4"></el-option>
        </el-select>
        <el-input
          v-model="searchData.search"

          clearable
          style="width: 270px"
        ></el-input>
      </div>
      <div>
        <span>选择品类：</span>
        <elSelectTree
          :data="treeData"
          :treeProps="treeProps"

          :width="240"
          filterable
          :checkStrictly="true"
          @ok="check"
        />
        <el-button type="primary"  @click="search">查询</el-button>
      </div>
    </div>

		<div class='selectedAll' v-if='checkedAllObject[pagination.currentPage]'>

			<el-checkbox v-model='checkedAllObject[pagination.currentPage].checked' @change='selected' :indeterminate='checkedAllObject[pagination.currentPage].indeterminate'>全选</el-checkbox>
		</div>


    <div class="checkGoods">
      <div class="left">
        <p
          v-if="!tableData.length"
          style="text-align: center; line-height: 80px"
        >
          未查询到商品
        </p>

        <div v-for="(item, index) in tableData" :key="index" class="goods">
          <div class="goodsinfo">
            <el-image
              style="width: 80px; height: 80px"
              :src="item.mainImgUrl"
              fit="contain"
            ></el-image>
            <div class="goodsSku">

							<p class="text-row" :title="item.goodsName">
								{{ item.goodsName }}
							</p>

							<p style='font-size: 14px;margin: 5px 0 ' >
                 <span
									 style="margin-right: 10px"
									 v-for="(a, b) in jsonData(item.skuValue)"
									 :key="b"
								 >
                    {{ a.spe ? a.spe +':' : ''}}{{ a.speVal }}
                  </span>
							</p>

              <p class="text-row" style="font-size: 12px" :title="item.skuCode">{{ item.skuCode }}</p>
              <p class="text-row" :title="getTitle(item)">
                {{
                  switchPartner(item.partnerType)
                    ? `【${switchPartner(item.partnerType)}】`
                    : ''
                }}{{ item.supplierName || '暂无供应商' }}
              </p>
            </div>
          </div>

          <el-button
            style="margin-right: 20px"
            :style="
              checkList.find(v => v.skuId == item.skuId)
                ? { color: '#C0C4CC' }
                : ''
            "
            type="text"

            @click="addGoods(item)"
            :disabled="item.skuType === 3 || item.combineType === 2"
            >{{
              checkList.find(v => v.skuId == item.skuId) ? '已选择' : '选择'
            }}
          </el-button>
          <!-- <el-button v-else style="margin-right: 20px;" type="text" >已选择</el-button> -->
        </div>
      </div>
      <div class="right">
        <div class="fixed">
          <span
            >已选
            <span style="color: #1890ff"> {{ checkList.length }} </span>
            个SKU</span
          >
          <span style="color: #1890ff; cursor: pointer" @click="clearGoods">
            清空</span
          >
        </div>
        <div class="slecteContainer">
          <div v-for="(item, index) in checkList" :key="index" class="goods">
            <div class="goodsinfo">
              <el-image
                style="width: 80px; height: 80px"
                :src="item.mainImg"
                fit="contain"
              ></el-image>
              <div class="goodsSku">
                <p class="text-row" :title="item.goodsName">
                  {{ item.goodsName }}
                </p>

								<p style='font-size: 10px;margin: 5px 0 '>
                 <span
									 style="margin-right: 10px"
									 v-for="(a, b) in jsonData(item.skuValue)"
									 :key="b"
								 >
                    {{ a.spe ? a.spe +':' : ''}}{{ a.speVal }}
                  </span>
								</p>

                <p class="text-row" :title="item.skuCode">{{ item.skuCode }}</p>
                <p class="text-row" :title="getTitle(item)">
                  {{
                    switchPartner(item.partnerType)
                      ? `【${switchPartner(item.partnerType)}】`
                      : ''
                  }}{{ item.supplierName || '暂无供应商' }}
                </p>
              </div>
            </div>
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-end;
              "
            >
              <span
                style="color: #fd4c60; cursor: pointer"
                @click="delGoods(item, index)"
              >
                删除</span
              >
              <el-input-number
                controls-position="right"
                :min="1"
                :max="99999"
                v-model="item.num"

                step-strictly
              >
              </el-input-number>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.currentPage"
      :pager-count="5"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="pagination.pageSize"
      small
      layout="total, prev, pager, next,sizes ,jumper"
      :total="pagination.totalCount"
    >
    </el-pagination>
    <template #footer>
      <el-button  @click="close">取消</el-button>
      <el-button type="primary" @click="returnGoods"
        >确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs,computed } from 'vue'
import { ElMessage } from 'element-plus'
import { goodsBases } from '@/api/order/orderManagement.js'
import { erpElTable } from '@/utils/hooks.js'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { rulecClassify ,categoryAuthTree} from '@/api/goods/rules.js'

export default {
  emits: ['cancel', 'returnGoods'],
  components: { elSelectTree },
  props: {
    checkData: {
      type: Array,
      default: [],
    }
  },
  setup(props, ctx) {
    const state = reactive({
      warehouseId: 1,
      show: true,
      searchData: {
        searchType: 2,
        search: '',
        categoryId: '',
        authFlag: 1,
        skuTypeFlag: 3,
        combineType: null
      },
			selectedAll:false,
      treeData: [],
      treeProps: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'child', // 子级字段名
        disabled: 'disabled'
      },
			checkedAllObject:{},
      checkList: []
    })
    const {
      tableData,
      pagination,
      search,
      handleSizeChange,
      handleCurrentChange
    } = erpElTable(goodsBases, state.searchData, {
      dataFilter: data => {
        // data.map(item => {
        //   item.checked = state.checkList?.find(val => val.skuId == item.skuId)
        //     ? true
        //     : false
        // })
        console.log(pagination.value.currentPage)
				if(!state.checkedAllObject.hasOwnProperty(pagination.value.currentPage)){
					state.checkedAllObject[pagination.value.currentPage] = {
						checked:false, // 是否全选
						checkList:[],  // 选中列表
						indeterminate:false
					}
				}
				getInter()
        return data
      },
      checkList: state.checkList
    })
    onMounted(() => {
			categoryAuthTree().then(res => {
        state.treeData = res.data
      })
      console.log(props.checkData)
      props.checkData.forEach(item => {
        item.goodsName = item.nameCn
      })
      state.checkList = [...props.checkData]
    })

		const indeterminate = computed(()=>{
			let bole = false
				if( tableData.value.length > state.checkList.length &&  state.checkList?.length > 0 ){
						bole = true
				}else {
						bole = false
				}

				return bole
		})


		function jsonData(info) {
			if (info) return JSON.parse(info)
			return []
		} // 格式化数据


		function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('cancel')
      }, 500)
    }

    function check(e) {
      state.searchData.categoryId = e
    }

    function addGoods(item) {
				let list = state.checkedAllObject[pagination.value.currentPage].checkList || []
      if (list.find(v => v.skuId == item.skuId)) {
        // 取消选择
        list = list.filter(v => v.skuId != item.skuId)
      } else {
      	 list.push({
          skuId: item.skuId,
          num: 1,
          subGross: '',
          currency: 'USD',
          mainImg: item.mainImgUrl,
          goodsName: item.goodsName,
          skuCode: item.skuCode,
          partnerType: item.partnerType, // 供应商平台
          supplierName: item.supplierName, //供应商名称
          declareAmount: item.declareAmount, //采购价
          supplierId: item.supplierId, // 供应商id
          warehouseId: item.warehouseId,
					skuValue:item.skuValue,
					lastPurchasePrice:item.lastPurchasePrice,
					purchasePrice:item.purchasePrice
        })
      }

			state.checkedAllObject[pagination.value.currentPage].checkList = list
			console.log(	state.checkedAllObject)
			state.checkList = getAllCheckList()
			getInter()

    }

    function returnGoods() {
      if (state.checkList.length === 0) return ElMessage.error('请选择商品!')
			for(let i =0; i <state.checkList.length ;i++){
				  let item = state.checkList[i]
					const {declareAmount,num} = item
				if(declareAmount*num  > 100000000) {
					ElMessage.error(`第${i+1}个商品的价格大于一个亿,请修改商品数量!`)
					return false
				}
			}
      ctx.emit('ok', { type: 'AddGoods', data: state.checkList })
      close()
    }

    function delGoods(item, index) {
			console.log(state.checkedAllObject)
			for(let i in state.checkedAllObject){
					if(state.checkedAllObject[i].checkList?.findIndex(v=>v.skuId === item.skuId) !== -1){
						state.checkedAllObject[i].checkList = state.checkedAllObject[i].checkList?.filter(v => v.skuId != item.skuId)
					}
			}
			getInter()
			state.checkList = state.checkList.filter(v => v.skuId != item.skuId)
      //   if (tableData.value.find(val => val.skuId == item.skuId)) {
      //     tableData.value.find(val => val.skuId == item.skuId).checked = false
      //   }
      //   state.checkList.splice(index, 1)
    }

    function clearGoods() {
      //   tableData.value.forEach(v => {
      //     if (state.checkList.some(i => i.skuId === v.skuId)) {
      //       v.checked = false
      //     }
      //   })
      state.checkList = []
			for(let i in state.checkedAllObject){
				state.checkedAllObject[i] ={
					checked:false, // 是否全选
					checkList:[],  // 选中列表
					indeterminate:false
				}
			}
    }

    function getTitle(item) {
      if (item.partnerType && item.supplierName)
        return item.partnerType + '' + item.supplierName
    }

    function switchPartner(v) {
      if (!v) return
      switch (v) {
        case 1:
          return '合作供应商'
          break
        case 2:
          return '1688'
          break
        case 3:
          return '淘宝'
          break
        case 4:
          return '拼多多'
          break
      }
    }

		function selected(val){
			if(!val) 	{
				state.checkedAllObject[pagination.value.currentPage].checkList = []
				state.checkedAllObject[pagination.value.currentPage].indeterminate = false
				state.checkList = getAllCheckList()
				return
			}
			state.checkedAllObject[pagination.value.currentPage].indeterminate = false
			let list =  state.checkedAllObject[pagination.value.currentPage].checkList
			console.log(state.checkedAllObject[pagination.value.currentPage].checkList)
			tableData.value.forEach((item,index)=>{
				let bole = list.findIndex(v=>v.skuId === item.skuId,index+1);
				if(bole === -1){
					list.push(
						{
							skuId: item.skuId,
							num: 1,
							subGross: '',
							currency: 'USD',
							mainImg: item.mainImgUrl,
							goodsName: item.goodsName,
							skuCode: item.skuCode,
							partnerType: item.partnerType, // 供应商平台
							supplierName: item.supplierName, //供应商名称
							declareAmount: item.declareAmount, //采购价
							supplierId: item.supplierId, // 供应商id
							warehouseId: item.warehouseId,
							skuValue:item.skuValue,
							lastPurchasePrice:item.lastPurchasePrice,
							purchasePrice:item.purchasePrice
						}
					);
				}
			})
			state.checkedAllObject[pagination.value.currentPage].checkList = list
			state.checkList = getAllCheckList()

		}

		function getAllCheckList (){
			let checkList = []
			for(let i in state.checkedAllObject){
				// console.log(state.checkedAllObject[i].checkList)
				checkList = checkList.concat(state.checkedAllObject[i].checkList || [])
			}
			return checkList
		} // 获取当前全部checkList

		function getInter(){

			if(state.checkedAllObject[pagination.value.currentPage].checkList.length > 0 && state.checkedAllObject[pagination.value.currentPage].checkList.length < pagination.value.pageSize){
					state.checkedAllObject[pagination.value.currentPage].indeterminate = true
			}else{
					state.checkedAllObject[pagination.value.currentPage].indeterminate = false
			}
			if(state.checkedAllObject[pagination.value.currentPage].checkList.length ==0){
				state.checkedAllObject[pagination.value.currentPage].checked = false
			}else if(state.checkedAllObject[pagination.value.currentPage].checkList.length === pagination.value.pageSize){
				state.checkedAllObject[pagination.value.currentPage].checked = true
			}
		}


    return {
      ...toRefs(state),
      close,
      check,
      addGoods,
      delGoods,
      clearGoods,
      returnGoods,
      tableData,
      pagination,
      search,
      handleSizeChange,
      handleCurrentChange,
      getTitle,
      switchPartner,
			jsonData,
			selected,
			indeterminate
    }
  }
}
</script>

<style lang="scss" scoped>
.selectedAll{
	margin:10px 0 5px 0;
}
.checkGoods {
  display: flex;
  margin-top: 16px;
}

.left,
.right {
  position: relative;
  width: 420px;
  height: 400px;
}
.left {
  overflow: auto;
}
.slecteContainer {
  height: 368px;
  overflow: auto;
}
.right {
  .fixed {
    height: 32px;
    line-height: 32px;
    top: 0;
    position: sticky;
    background-color: #eee;
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
  }
}

.goods {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  padding-left: 16px;

  span {
    width: 80px;
  }
}

.goodsinfo {
  display: flex;

  img {
    width: 80px;
    height: 80px;
  }

  .goodsSku {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    width: 150px;
  }
}

::v-deep(.el-pagination__jump) {
  margin: 0;
}

::v-deep(.el-pagination__total) {
  margin: 0;
}

.psb {
  position: sticky;
  bottom: 0;
  background-color: #fff;
}

.text-row {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search {
  display: flex;
  justify-content: space-between;
}

.search > div {
  width: 398px;
  display: flex;
  align-items: center;
}
</style>
