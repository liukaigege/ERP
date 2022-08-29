<template>
<div style="padding-bottom:30px">
  <div class="search-header">
    <el-form :model="formData" ref="form" :inline="false" @keyup.enter="search">
      <div>
        <el-form-item label="仓库名称:">
          <el-select v-model="formData.warehouseId">
            <el-option label="万众智谷仓库" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="choice">
        <el-form-item label="搜索内容:" prop="searchType">
          <div class="row">
            <el-select style="width:125px" v-model="formData.searchType" @change="searchTypeChange">
              <el-option v-for="item in headeData.searchType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-input v-model="formData.searchContent" :placeholder="placeholder" clearable style="width:300px;margin-left:16px;"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="商品类型:" prop="goodsType">
          <div class="row">
            <el-select style="width:125px" v-model="formData.goodsType" clearable>
              <el-option label="普通商品" :value="1"></el-option>
              <el-option label="定制商品" :value="2"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="商品来源:">
          <div class="row">
            <el-cascader v-model="cascaderValue" :options="sourceData" @change="cascaderChange" clearable></el-cascader>
          </div>
        </el-form-item>
        <el-form-item label="商品品类:" prop="categoryId">
          <div class="row">
            <el-cascader :options="classify" v-model="categoryIdValue" :props="props" clearable :show-all-levels="false" @change="categoryCheck" ref="selectTreeRef" />
          </div>
        </el-form-item>
        <el-form-item label="侵权筛选:" prop="tortStatus">
          <div class="row">
            <el-select style="width:125px" v-model="formData.tortStatus" clearable>
              <el-option v-for="item in tortStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="商品属性:" prop="attr">
          <div class="row">
            <el-select style="width:125px" v-model="formData.attr" clearable>
              <el-option v-for="item in goodsAttrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="货源渠道:" prop="channelId">
          <div class="row">
            <el-select style="width:125px" v-model="formData.channelId" clearable>
              <el-option v-for="item in sourceChanneList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="开发时间:">
          <div class="row">
            <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" style="width:300px" unlink-panels @change="timeChange">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="默认采购价(CNY):">
          <div class="row">
            <el-input-number v-model="formData.startPurchasePrice" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable style="width: 85px" /><span style="color:#dcdfe6">——</span>
            <el-input-number v-model="formData.endPurchasePrice" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable style="width: 85px" />
          </div>
        </el-form-item>
        <el-form-item label="采购员设置:" prop="purchaseUserSetting">
          <el-select style="width:125px" v-model="formData.purchaseUserSetting" clearable>
            <el-option label="未设置" value="0"></el-option>
            <el-option label="已设置" value="1"></el-option>
          </el-select>
        </el-form-item>
        <div class="btn">
          <el-form-item label="备注:" prop="remarkTypeIdList">
            <el-checkbox-group v-model="formData.remarkTypeIdList">
              <el-checkbox v-for="item in remarkTypes" :key="item.id" :label="item.id">
                {{item.name}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset(false)">重置</el-button>
          </div>
        </div>
      </div>
    </el-form>

  </div>

  <tableBox :data="tableData" @search="search" :page="{warehouseId:formData.warehouseId, tableData,
      pagination,
      search,
      handleSizeChange,
      handleCurrentChange,
      formData,
      tableLoading
      }" ref="tableRef" />

</div>
</template>

<script>
import { nextTick, onActivated, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { categoryId } from '@/api/goods/goodsPublish.js'
import selectTree from '@/components/elSelectTree/index.vue'
import moment from 'moment'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getRemarkTypes } from '@/api/order/orderManagement.js'
import { manageList } from '@/api/commodity.js'
import { sourceData, tortStatusOptions, goodsAttrOptions } from '@/assets/js/staticData.js'
import { erpElTable } from '@/utils/hooks.js'
import { useRoute } from 'vue-router'
import tableBox from './components/indexCom/tableBox.vue'
import {
  getSourceChanne, //查询货源渠道列表
} from '@/api/goods/rules.js'
export default {
  name: 'commodityManagement',
  components: { selectTree, tableBox },
  emits: ['search'],
  setup(props, ctx) {
    const route = useRoute()
    const state = reactive({
      classify: [],
      props: { value: 'id', label: 'name', children: 'child', checkStrictly: true },
      time: '',
      remarkTypes: [],
      formData: {
        warehouseId: 1, //仓库id
        searchType: 1, // 搜索类型
        searchContent: '', //搜索内容
        goodsType: '', //商品类型
        source: '', //商品来源
        mode: '', //添加方式
        categoryId: '', //商品id
        tortStatus: '', //侵权
        attr: '', //商品属性
        startDevTime: '', //开始时间
        endDevTime: '', //开始时间
        startPurchasePrice: undefined, //开始默认采购价
        endPurchasePrice: undefined, //结束默认采购价
        remarkTypeIdList: [], //备注id
        purchaseUserSetting: '', // 采购员设置
        channelId: "", //货源渠道
      },
      cascaderValue: '',
      form: null,
      selectTreeRef: null,
      tableRef: null,
      sourceChanneList: [],
      placeholder: "请输入要检索的内容",
      categoryIdValue:[]
    })


    onMounted(async () => {
      const { data } = await categoryId()
      state.classify = data
      let params = route.params
      if(Object.keys(params).length) reset(true)
      if(params.searchType) params.searchType = +params.searchType
      if(params.categoryId) params.categoryId = +params.categoryId
      Object.assign(state.formData,params)
      nextTick(()=>{
        state.categoryIdValue = [params.categoryId]
      })
      search()
      state.tableRef.vxeTable.reloadData(tableData.value)
      getRemarkTypes({ useScope: '1' }).then(res => {
        state.remarkTypes = res.data
      })
      getSourceChanne({
        page: { pageNo: 1, pageSize: 500 }
      }).then(res => {
        state.sourceChanneList = res.data.dataList.map(item => {
          return {
            name: item.name,
            id: item.id
          }
        })
      })

    })

    const headeData = {
      searchType: [
        { label: "商品名", value: 1 },
        { label: "商品编码", value: 2 },
        { label: "商品SPU", value: 3 },
        { label: "商品SKU", value: 4 },
        { label: "SKU ID", value: 8 },
        { label: "商品标签", value: 5 },
        { label: "默认供应商", value: 6 },
        { label: "采购人员", value: 7 },
        { label: "采购报价人", value: 9 },
        { label: "维护人", value: 10 },
      ],
    }

    const {
      tableData,
      tableLoading,
      search,
      pagination,
      handleSizeChange,
      handleCurrentChange
    } = erpElTable(manageList, state.formData, {
      autoSearch: false,
      dataFilter: data => {
        if(route.params.categoryId){
          data = data.filter(v=>{
            console.log(v.stockInWarehouse);
            return v.stockInWarehouse!=0
          })
        }
        data.forEach((item, index) => {
          item.checkList = []
          item.purchaseGoodsSkuList.map(val => {
            val.index = index
            if (val.skuValue && typeof JSON.parse(val.skuValue) == 'object') {
              val.skuValue = JSON.parse(val.skuValue).map(v => v.speVal).join('-')
            }
          })
        })
        
        let arr = []
        data.forEach(item => {
          arr.push({ goodsId: item.goodsId, rowType: 'title', channelName: item.channelName, purchaseGoodsSkuList: item.purchaseGoodsSkuList, remarkTypeList: item.remarkTypeList, checkList: [] })
          item.rowType = 'parent'
          arr.push(item, { rowType: 'parent' })
          arr.push(...item.purchaseGoodsSkuList)
        })
        arr.forEach(item => {
          item.indeterminate = false
        })
        return arr
      },
      pagination: {
        pageSize: 50,
        pageSizes: [50, 100, 200, 500]
      }
    })

    function categoryCheck(val) {
      console.log(val);
      state.formData.categoryId = val ? val[val.length - 1] : val
      console.log(state.formData.categoryId);
    }

    function timeChange(time) {
      if (time) {
        state.formData.startDevTime = moment(time[0]).format('YYYY-MM-DD 00:00:00')
        state.formData.endDevTime = moment(time[1]).format('YYYY-MM-DD 23:59:59')
      } else {
        state.formData.startDevTime = ''
        state.formData.endDevTime = ''
      }
    }

    function changeCNY(val) {
      if (state.formData[val] < 0 || state.formData[val] > 9999999.99) {
        state.formData[val] = ''
        return ElMessage.error('输入区间0-9999999.99')
      }
      let price = /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[0-9][0-9]*\.\d{1,2})))$/
      if (!price.test(state.formData[val])) {
        state.formData[val] = ''
        return ElMessage.error('最多保留两位小数')
      }
    }

    function cascaderChange(e) {
      if (e) {
        if (e[1]) {
          state.formData.source = e[1]
        } else {
          state.formData.source = ''
        }
        state.formData.mode = e[0]
      } else {
        state.formData.source = ''
        state.formData.mode = ''
      }
    }

    function reset(flag) {
      state.form.resetFields()
      state.selectTreeRef.handleClear()
      state.formData.searchContent = '' //搜索内容
      state.time = ''
      state.formData.source = '' //商品来源
      state.formData.mode = '' //添加方式
      state.formData.startDevTime = '' //开始时间
      state.formData.endDevTime = '' //开始时间
      state.formData.startPurchasePrice = undefined //开始默认采购价
      state.formData.endPurchasePrice = undefined //结束默认采购价
      state.cascaderValue = ''
      state.placeholder = "请输入要检索的内容"
      if(!flag)search()
    }

    function searchTypeChange(value) {
      console.log(value);
      if ([2, 3, 8, 4].includes(value)) {
        state.placeholder = '请输入要检索的内容多条可用逗号或者空格隔开'
      } else {
        state.placeholder = "请输入要检索的内容"
      }
    }

    return {
      ...toRefs(state),
      headeData,
      tableData,
      pagination,
      search,
      tableLoading,
      handleSizeChange,
      handleCurrentChange,
      categoryCheck,
      timeChange,
      changeCNY,
      sourceData,
      cascaderChange,
      tortStatusOptions,
      goodsAttrOptions,
      reset,
      searchTypeChange,
    }

  }
}
</script>

<style lang="scss" scoped>
.search-header {
  padding: 24px;
  background-color: #fff;

  .choice {
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px dashed #E9E9E9;
  }

  .row {

    .title {
      min-width: 80px;
    }
  }

}

.btn,
.remark,
.row {
  width: 100%;
  display: flex;
  align-items: center;
}

::v-deep(.el-form-item) {
  margin-right: 16px;
}

.btn {
  align-items: center;
  justify-content: space-between;

  ::v-deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 16px;

    .el-form-item__content {
      display: flex;
      align-items: center;

      .el-checkbox-group {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
