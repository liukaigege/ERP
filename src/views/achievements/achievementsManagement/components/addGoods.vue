<template>
<el-dialog title="添加商品" v-model="show" width="850px" @close="close" :close-on-click-modal="false">

  <div class="search">
    <div>
      <el-select v-model="searchData.searchType"  style="width:110px">
        <el-option label="商品名称" :value="1"></el-option>
        <el-option label="商品SKU" :value="2"></el-option>
        <el-option label="SKU编码" :value="3"></el-option>
      </el-select>
      <el-input v-model="searchData.search"  clearable style="width:270px"></el-input>
    </div>
    <div>
      <span>选择品类：</span>
      <elSelectTree :data="treeData" :treeProps="treeProps"  :width="240" filterable :checkStrictly="true" @ok="check" />
      <el-button type="primary"  @click="search">查询</el-button>
    </div>
  </div>
  <div class="checkGoods">
    <div class="left">
      <p v-if="!tableData.length" style="text-align:center;line-height:80px">
        未查询到商品
      </p>
      <div v-for="(item,index) in tableData" :key="index" class="goods">
        <div class="goodsinfo">
          <img :src="item.mainImgUrl" alt="">
          <div class="goodsSku">
            <p class="text-row" :title="item.goodsName">{{item.goodsName}}</p>
            <p class="text-row" :title="item.skuCode">{{item.skuCode}}</p>
            <p class="text-row" :title="item.skuId">{{item.skuId}}</p>
          </div>
        </div>
        <span style="color:#1890FF;cursor: pointer;" @click="addGoods(item)" v-if="!item.checked"> 选择</span>
        <span v-else>已选择</span>
      </div>

    </div>
    <div class="right">
      <div class="fixed">
        <span>已选 <span style="color:#1890FF;"> {{checkList.length}} </span> 个SKU</span>
        <span style="color:#1890FF;cursor: pointer;" @click="clearGoods"> 清空</span>
      </div>
      <div v-for="(item,index) in checkList" :key="index" class="goods">
        <div class="goodsinfo">
          <img :src="item.mainImg" alt="">
          <div class="goodsSku">
            <p class="text-row" :title="item.goodsName">{{item.goodsName}}</p>
            <p class="text-row" :title="item.skuCode">{{item.skuCode}}</p>
            <p class="text-row" :title="item.skuId">{{item.skuId}}</p>
          </div>
        </div>
        <span style="color:#FD4C60;cursor: pointer;" @click="delGoods(item,index)"> 删除</span>
      </div>
    </div>
  </div>
  <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :pager-count="5" :page-sizes="[10, 20, 30, 50,100]" :page-size="pagination.pageSize" small layout="total, prev, pager, next,sizes ,jumper" :total="pagination.totalCount">
  </el-pagination>
  <template #footer>
    <el-button  @click="close">取消</el-button>
    <el-button type="primary" @click="returnGoods" >确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { goodsBases } from '@/api/order/orderManagement.js'
import { erpElTable } from '@/utils/hooks.js'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { rulecClassify } from '@/api/goods/rules.js'
export default {
  emits: ['closeEvent', 'returnGoods'],
  components: { elSelectTree },
  props: {
    checkData: Array
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      searchData: {
        searchType: 1,
        search: "",
        categoryId: '',
        authFlag: 1,
        skuTypeFlag:3
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
      handleSizeChange,
      handleCurrentChange
    } = erpElTable(goodsBases, state.searchData, {
      dataFilter: data => {
        data.map(item => {
          item.checked = state.checkList.find(val => val.skuId == item.skuId) ? true : false
        })
        console.log(data);
        return data
      },
      checkList: state.checkList
    })
    onMounted(() => {
      rulecClassify().then(res => {
        state.treeData = res.data
      })
      props.checkData.forEach(item=>{
        item.goodsName = item.nameCn
      })
      state.checkList = [...props.checkData]
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function check(e) {
      state.searchData.categoryId = e
    }

    function addGoods(item) {
      item.checked = true
      state.checkList.push({
        skuId: item.skuId,
        num: '',
        subGross: '',
        currency: 'USD',
        mainImg: item.mainImgUrl,
        goodsName: item.goodsName,
        skuCode: item.skuCode
      })
    }

    function returnGoods() {
      ctx.emit('returnGoods', state.checkList)
      close()
    }

    function delGoods(item, index) {
      if (tableData.value.find(val => val.skuId == item.skuId)) {
        tableData.value.find(val => val.skuId == item.skuId).checked = false
      }
      state.checkList.splice(index, 1)
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
      handleCurrentChange
    }
  }
}
</script>

<style lang="scss" scoped>
.checkGoods {
  display: flex;
  margin-top: 16px;
}

.left,
.right {

  position: relative;
  width: 400px;
  height: 400px;
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

.search>div {
  width: 398px;
  display: flex;
  align-items: center;
}
</style>
