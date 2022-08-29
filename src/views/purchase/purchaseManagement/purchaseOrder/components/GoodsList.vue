<template>
  <el-dialog title="添加商品" v-model="show" width="850px" @close="close" :close-on-click-modal="false">
    <div v-loading='tableLoading'>
      <div class="header">
        <el-select v-model="searchData.warehouseId">
          <el-option v-for="item in warehouseList" :label="item.warehouseName" :value="item.warehouseId" :key="item.warehouseId"></el-option>
        </el-select>
      </div>
      <div class="box-warp">
        <el-form label-width="70px" inline>
          <el-form-item label-width="0">
            <el-select v-model="searchData.searchType" style="width:110px">
              <el-option label="商品SKU" :value="2"></el-option>
              <el-option label="SKU编码" :value="3"></el-option>
              <el-option label="商品编码" :value="4"></el-option>
              <el-option label="商品名称" :value="1"></el-option>
            </el-select>
            <el-input v-model="searchData.search" :placeholder="setHolder()" clearable style="width:250px"></el-input>
          </el-form-item>
          <el-form-item label="选择品类">
            <elSelectTree :data="treeData" :treeProps="treeProps" :width="200" filterable :checkStrictly="true" @ok="check" />
          </el-form-item>
          <el-form-item label-width="0">
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="checkGoods">
          <div class="left">
            <p v-if="!tableData.length" style="text-align:center;line-height:80px">
              未查询到商品
            </p>
            <div v-for="(item,index) in tableData" :key="index" class="goods">
              <div class="goodsinfo">
                <img :src="item.mainImgUrl" alt="">
                <div class="goodsSku">
                  <div :title="item.goodsName" class="sku">{{item.goodsName}}</div>
                  <div :title="item.skuCode" class="sku">{{item.skuCode}}</div>
                  <div :title="fmtSpe(item.skuValue)" class="sku">{{fmtSpe(item.skuValue)}}</div>
                  <div :title="item.goodsName" class="sku">{{fmtPartnerTypes(item.partnerType)}} {{item.supplierName}}</div>
                </div>
              </div>
              <span v-if="isSelect(item.skuId)" style="cursor: pointer" @click="delGoods(item.skuId)">已选</span>
              <span style="color:#1890FF;cursor: pointer;" @click="addGoods(item)" v-else> 选择</span>
            </div>

          </div>
          <div class="right">
            <div class="fixed">
              <span>已选 <span style="color:#1890FF;"> {{checkList.length}} </span> 个SKU</span>
              <span style="color:#1890FF;cursor: pointer;" @click="clearGoods"> 清空</span>
            </div>
            <div v-for="(item,index) in checkList" :key="index" class="goods">
              <div class="goodsinfo">
                <img :src="item.mainImgUrl" alt="">
                <div class="goodsSku">
                  <div :title="item.goodsName" class="sku">{{item.goodsName}}</div>
                  <div :title="item.skuCode" class="sku">{{item.skuCode}}</div>
                  <div :title="fmtSpe(item.skuValue)" class="sku">{{fmtSpe(item.skuValue)}}</div>
                  <div :title="item.goodsName" class="sku">{{fmtPartnerTypes(item.partnerType)}} {{item.supplierName}}</div>
                </div>
              </div>
              <div class="action-box">
                <el-button type="text" @click="delGoods(item.skuId)">删除</el-button>
                <el-input-number v-model="item.purchaseQuantity" controls-position="right" style="width:90px" :min="1" :max="99999" size="small"></el-input-number>
              </div>
            </div>
          </div>
        </div>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :pager-count="5" :page-sizes="[10, 20, 30, 50,100]" :page-size="pagination.pageSize" small layout="total, prev, pager, next,sizes ,jumper" :total="pagination.totalCount" style="margin: 25px 0 0 25px">
        </el-pagination>
      </div>
    </div>
    <template #footer>
      <el-button @click="show = false">取消</el-button>
      <el-button type="primary" @click="returnGoods" :disabled='checkList?.length < 1'>确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { goodsBases } from '@/api/order/orderManagement.js'
import { erpElTable } from '@/utils/hooks.js'
import { warehouseList, supplierPartnerTypes } from '@/assets/js/staticData.js'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { categoryId } from '@/api/goods/goodsPublish.js'
export default {
  emits: ['closeEvent', 'returnGoods'],
  components: { elSelectTree },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      searchData: {
        searchType: 2,
        search: "",
        categoryId: '',
        authFlag: 1,
        skuTypeFlag: 3,
        warehouseId: 1,
        combineType: 1
      },
      treeData: [],
      treeProps: {
        value: 'id', // ID字段名
        label: 'name', // 显示名称
        children: 'child', // 子级字段名
        disabled: 'disabled'
      },
      checkList: []
    })
    const {
      tableData,
      pagination,
      search,
      tableLoading,
      handleSizeChange,
      handleCurrentChange
    } = erpElTable(goodsBases, state.searchData)
    // 获取品类列表
    categoryId().then(res => {
      state.treeData = res.data
    })
    function fmtSpe(spes) {
      if (spes) {
        let list = JSON.parse(spes)
        return list.map(item => item.spe + ': ' + item.speVal).join(' ')
      }
      return ''
    }
    function fmtPartnerTypes(id) {
      let item = supplierPartnerTypes.find(item => item.value == id)
      if (item) return item.label
      return ''
    }
    function close() {
      ctx.emit('closeEvent')
    }

    function check(e) {
      state.searchData.categoryId = e
    }

    function addGoods(item) {
      item.purchaseQuantity = 1
      item.mainImg = item.mainImgUrl
      state.checkList.push({
        ...item
      })
    }
    function setHolder() {
      let obj = {
        1: '请输入商品名称,多个用逗号隔开',
        2: '请输入商品SKU,多个用逗号隔开',
        3: '请输入sku编码,多个用逗号隔开',
        4: '请输入商品编码,多个用逗号隔开'
      }
      return obj[state.searchData.searchType]
    }
    function returnGoods() {
      state.checkList.forEach(item => {
        item.goodAttribute = 1
        if (!item.hasOwnProperty("partSwitch")) item.partSwitch = 0
      })
      ctx.emit('returnGoods', state.checkList)
      state.show = false
    }
    function isSelect(id) {
      return state.checkList.findIndex(item => item.skuId == id) > -1
    }
    function delGoods(id) {
      state.checkList = state.checkList.filter(item => item.skuId !== id)
    }

    function clearGoods() {
      state.checkList = []
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
      warehouseList,
      fmtSpe,
      fmtPartnerTypes,
      setHolder,
      tableLoading,
      isSelect
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 15px;
}
.box-warp {
  border: 1px solid #e8e8e8;
  padding-bottom: 15px;
  .el-form {
    background: #fafafa;
    padding: 15px 25px 0 25px;
    border-bottom: 1px solid #e8e8e8;
  }
  .el-form-item {
    margin-bottom: 15px !important;
  }
}
.action-box {
  text-align: right;
  display: flex;
  flex-direction: column;
}
.checkGoods {
  display: flex;
  margin-top: 16px;
}

.left,
.right {
  position: relative;
  width: 50%;
  height: 400px;
  overflow: auto;
}

.right {
  margin: 0 25px;
  border: 2px solid #e8e8e8;
  .fixed {
    height: 32px;
    line-height: 32px;
    top: 0;
    position: sticky;
    background-color: #eee;
    display: flex;
    justify-content: space-between;
    z-index: 2;
    padding: 0 10px;
    border-bottom: 1px solid #e8e8e8;
  }
}

.goods {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 25px;

  span {
    width: 40px;
  }
}

.goodsinfo {
  display: flex;

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .goodsSku {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 10px;
    width: 150px;
    white-space: nowrap;
    .sku {
      overflow: hidden;
      text-overflow: ellipsis;
    }
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
</style>
