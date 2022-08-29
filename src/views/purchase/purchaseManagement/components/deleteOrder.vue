<!--
* @Descripttion: Vango ERP deleteOrder 生成采购单页面删除商品的列表
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="customOderContainer">
    <div v-if="!detailListShow" class="customOderinfoContainer">
      <ErpNav title="订单信息" :goBack="goBack" />
      <div class="header-container">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="搜索内容:">
            <div class="searchContent">
              <el-select v-model="form.searechType" placeholder="全部" clearable>
                <el-option label="订单SKU" value="2" />
                <el-option label="订单号" value="3" />
              </el-select>&nbsp;&nbsp;
              <el-input v-model="form.searechText" placeholder="请输入要检索的内容多条可用逗号或空格隔开" clearable @keydown.enter="queryDetail" />
            </div>
          </el-form-item>&nbsp;&nbsp;
          <el-form-item label="团队:">
            <el-cascader v-model="form.deptIds" :options="oraganziationList" :show-all-levels="false" clearable :props="{
                checkStrictly: true,
                expandTrigger: 'click',
                label: 'deptName',
                value: 'deptId',
                children: 'children',
								emitPath:false
              }">
            </el-cascader>
          </el-form-item>&nbsp;&nbsp;
          <el-form-item>
            <el-button type="primary" @click="queryDetail">查询</el-button>
            <el-button @click="init">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tableContainer">
        <el-table ref="multipleTableRef" v-if="oraganziationList" :data="list" style="width: 100%" border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="商品信息" align="center" min-width="363">
            <template #default="scope">
              <div class="goodsInfo">
                <div class="goodsImagesContainer">
                  <el-popover placement="right-start" trigger="hover" width="auto">
                    <el-image style="width: 200px; height: 200px" :src="scope.row.mainImg" fit="contain"></el-image>
                    <template #reference>
                      <el-image class="ml-10" style="width: 70px; height: 70px" :src="scope.row.mainImg" fit="contain"></el-image>
                    </template>
                  </el-popover>
                </div>
                <div class="goodsContent" style="width: 80%">
                  <el-tooltip placement="top">
                    <template #content>
                      <p style="cursor: pointer" v-copy="scope.row.skuCode">
                        复制
                      </p>
                    </template>
                    <p :title="scope.row.skuCode" class="pClass">
                      {{ scope.row.skuCode }}
                    </p>
                  </el-tooltip>
                  <p>&yen; {{ scope.row.lastPurchasePrice ?? scope.row.purchasePrice }}</p>
                  <p v-if="scope.row.skuValue">
                    <span v-for="v in scope.row.skuValue" :key="v.id">{{ v.spe }}:{{ v.speVal }}&nbsp;&nbsp;
                    </span>
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="orderId" label="订单号" align="center" width="150">
            <template #default="{row}">
              <el-tooltip effect="dark" placement="top-start">
                <template #content>
                  <p style="cursor: pointer" v-copy="row.orderId">复制</p>
                </template>
                <p>{{ row.orderId }} </p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="付款时间" align="center" width="150">
            <template #default="scope">
              <div v-if="scope.row.paymentTime">
                <p>{{ scope.row.paymentTime?.split(' ')[0] }}</p>
                <p>{{ scope.row.paymentTime?.split(' ')[1] }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column property="quantity" label="数量" align="center" width="100" show-overflow-tooltip />
          <el-table-column label="定制属性" align="center" width="300">
            <template #default="{row}">
              <el-popover placement="left-end" trigger="hover" width="auto">
                <div>
                  <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                    <span v-if="v.type == 'upload_img' || v.type == 'img_options' || v.value?.indexOf('http://') != -1 || v.value?.indexOf('https://') != -1">
                      {{v.field}}：
                      <el-popover placement="right-start" trigger="hover" width="auto">
                        <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                        <template #reference>
                          <el-icon style="font-size: 20px;position: relative;top: 3px;">
                            <PictureFilled />
                          </el-icon>
                        </template>
                      </el-popover>
                    </span>
                    <span v-else>{{v.field}}：{{v.value}}</span>
                  </div>
                </div>
                <template #reference>
                  <div class="customValueContainer">
                    <div class="customValueList" v-for="(v,i) in row.customValue" :key="i">
                      <span v-if="v.type == 'upload_img' || v.type == 'img_options' || v.value?.indexOf('http://') != -1 || v.value?.indexOf('https://') != -1">
                        {{v.field}}：
                        <el-popover placement="right-start" trigger="hover" width="auto">
                          <el-image style="width: 200px; height: 200px" :src="v.value" fit="contain"></el-image>
                          <template #reference>
                            <el-icon style="font-size: 20px;position: relative;top: 3px;">
                              <PictureFilled />
                            </el-icon>
                          </template>
                        </el-popover>
                      </span>
                      <span v-else>{{v.field}}：{{v.value}}</span>
                    </div>
                  </div>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template #default="scope">
              <el-button type="text" @click="showCustomInfo(scope.row)">查看定制信息</el-button>
              <p>
                <el-button type="text" style="color: red" @click="tempDeleteFn([scope.row],false)">删除</el-button>
              </p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <CustomInfo v-if="!!customInfoData" :data="customInfoData" :nobtn="true" :tabPosition="tabPosition" @customInfoClose="customInfoClose" />
      <ErpFooter>
        <div class="footer">
          <div class="left-box">
            <div>已选{{ selectList?.length || 0 }}条</div>
            <div style="margin-left: 35px">
              <el-button type="primary" @click="tempDeleteFn(selectList,true)">批量删除
              </el-button>
              <el-button @click="goBack"> 退 出 </el-button>
            </div>
          </div>
          <div class="right-box">
            <el-pagination :total="totalNum" :current-page="form.page.pageNo" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[100, 200, 300, 400, 500]" layout="total, sizes, prev, pager, next, jumper" :page-size="form.page.pageSize"></el-pagination>
          </div>
        </div>
      </ErpFooter>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, onMounted } from 'vue'
import { purchaseOfOrders } from '../customOder/composables/api'
import { deepCopy, treeToArr,renderCustomInfo } from '@/utils/tool'
import { ArrowLeft, PictureFilled } from '@element-plus/icons-vue'
import CustomInfo from '../customOder/components/customInfo.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOrganizationTree } from '@/api/user'
import ErpNav from '@/components/erpNav/index.vue'
import { direct, renderCat } from '@/api/purchase/outOfStock.js'

export default {
  props: {
    deleteOrderData: {
      type: Object,
      default: null
    },
    submitType: 0, // 1. 购物车过来的 ,0 直购过来的
    searchData: Object,//获取列表的查询数据
  },
  emits: ['deleteOrderBack'],
  components: {
    CustomInfo,
    ErpFooter,
    ErpNav,
    PictureFilled
  },
  setup(props, { emit }) {
    props.deleteOrderData?.orderInfoList.forEach(v => {
      if (v.customValue) {
        const copyCustomValue = JSON.parse(v.customValue)
        v.customValue = renderCustomInfo(copyCustomValue, 2)
      } else {
        v.customValue = []
      }
    })
    const form = {
      deptIds: null, //团队ID
      searechType: '2',
      searechText: null,
      page: {
        pageNo: 1,
        pageSize: 100
      }
    }
    const tabPosition = 1 //是否搁置 （1：正常、0：搁置中）
    const state = reactive({
      pageType: 5, // 1查看订单信息 2加入采购计划 3生成采购单 4标记普货 5订单信息(删除功能)
      form: deepCopy(form),
      searechType: '1',
      list: [],
      totalNum: 0,
      customInfoData: null,
      selectList: [],
      detailList: [],
      detailListShow: false,
      oraganziationList: [], // 组织架构列表
      oraganziationArr: [],
      setOrderData: null,
      sigleData: null,
      needdelData: null,
      dataChange: false, // page data been changed
      submitData: null,
      deleteList: []
    })
    getOrganizationTree().then(res => {
      if (res.code === 200) {
        state.oraganziationList = deleteChildren(res.data)
        state.oraganziationArr = [
          ...treeToArr(deepCopy(state.oraganziationList), 'children', true)
        ]
      }
    })

    onMounted(() => {
      queryDetail()
    })

    function deleteChildren(arr) {
      arr.forEach(v => {
        if (v?.children?.length > 0) {
          v.children = deleteChildren(v.children)
        } else {
          v.children = null
        }
      })
      return arr
    }

    // query the order's infomation list data
    function queryDetail() {
      state.totalNum = 0 // 列表总数
      // 使用deepCopy防止深拷贝问题，切换搜索props保持不变
      let arr = deepCopy(props.deleteOrderData).orderInfoList.filter(val => {
        if (!state.deleteList.some(v => v.id == val.id && v.relId == val.relId)) {
          // state.totalNum++
          //customValue json字符串转json
          val.lastPurchasePrice = props.deleteOrderData.lastPurchasePrice
          val.customValue = val.customValue ? val.customValue : []
          return val
        }
      })
      let searechTextArr = []
      if (state.form.searechText) {
        if (!!~state.form.searechText.indexOf(',')) {
          searechTextArr = state.form.searechText.split(',')
        } else if (!!~state.form.searechText.indexOf(' ')) {
          searechTextArr = state.form.searechText.split(' ')
        } else if (!!~state.form.searechText.indexOf('，')) {
          searechTextArr = state.form.searechText.split('，')
        } else if (!!~state.form.searechText.indexOf(' ')) {
          searechTextArr = state.form.searechText.split(' ')
        } else {
          searechTextArr = [state.form.searechText]
        }
      }
      if (state.form.searechType == '2' && searechTextArr.length) {
        // 有搜索内容，且搜索订单SKU
        arr = arr.filter(v => searechTextArr.some(it => !!~v.sku.indexOf(it)))
      } else if (state.form.searechType == '3' && searechTextArr.length) {
        // 有搜索内容，且搜索订单号
        arr = arr.filter(v => searechTextArr.some(it => !!~v.orderId.indexOf(it)))
      }
      // 有团队部门搜索
      if (state.form.deptIds) arr = arr.filter(v => v.deptPids.some(val => val == state.form.deptIds))
      state.totalNum = arr.length
      // 过滤符合page:{pageNo: ***,pageSize: ***}分页条件的数据
      arr = arr.filter((v, i) => i >= (state.form.page.pageNo - 1) * state.form.page.pageSize && i < state.form.page.pageNo * state.form.page.pageSize)
      // 将最终的数据赋值给表单
      state.list = arr
    }

    // init page search data
    function init() {
      state.form = deepCopy(form)
      queryDetail()
    }

    // click back
    function goBack() {
      if (state.deleteList.length) deleteData(state.deleteList)
      else emit('deleteOrderBack', false)
    }

    // select the rows
    function handleSelectionChange(rows) {
      state.selectList = rows
    }

    // close the custom infomation dialog
    function customInfoClose(val) {
      state.customInfoData = null
      if (val) queryDetail()
    }

    // query custom infomation dialog
    function showCustomInfo(val) {
      state.customInfoData = val
    }

    // change page size
    function handleSizeChange(val) {
      state.form.page.pageSize = val
      queryDetail()
    }

    // change page current
    function handleCurrentChange(val) {
      state.form.page.pageNo = val
      queryDetail()
    }

    function tempDeleteFn(data, status) {
      if (!data.length) ElMessage.warning({ message: '请选择商品' })
      let skuNum = 0
      const arr = [...state.deleteList, ...data]
      props.searchData.skuList.forEach(val => {
        val.relIdList.forEach(v => {
          if (arr.every(item => item.id != val.id || v != item.relId)) skuNum++
        })
      })
      if (skuNum === 0) return ElMessage.warning({ message: '商品不能全部删除' })
      state.deleteList = [...state.deleteList, ...data]
      queryDetail()
      if (status) goBack()
    }

    // delete data list
    function deleteData(data) {
      // verification sku's number
      const skuList = props.searchData.skuList.filter(v => {
        if (data.some(item => item.id == v.id)) {
          v.relIdList = v.relIdList.filter(val => data.every(item => item.relId != val))
          if (v.relIdList.length) return v
        } else return v
      })

      if (!skuList.length) return ElMessage.warning({ message: '商品不能全部删除' })

      // submitType: 0, // 1. 购物车过来的 ,0 直购过来的
      if (props.submitType == 1) // 1. 购物车过来的
        renderCat({ skuList, customizationType: 1 }).then(res => {
          if (res.code == 200) {
            emit('deleteOrderBack', {
              setOrderData: {
                data: res.data,
                param: [],
                type: 0,
                searchData: { skuList, customizationType: 1 }
              }
            })
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      else // 0 直购过来的
        direct({ skuList, customizationType: 1 }).then(res => {
          if (res.code == 200) {
            emit('deleteOrderBack', {
              setOrderData: {
                data: res.data,
                param: [],
                type: 0,
              },
              searchData: { skuList, customizationType: 1 }
            })
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
    }

    return {
      ...toRefs(state),
      tabPosition,
      ArrowLeft,
      queryDetail,
      goBack,
      init,
      tempDeleteFn,
      deleteData,
      showCustomInfo,
      handleSelectionChange,
      customInfoClose,
      handleSizeChange,
      handleCurrentChange,
			renderCustomInfo
    }
  }
}
</script>
<style lang='scss' scoped>
.header-container {
  background-color: #fff;
  padding: 20px 10px 0;
  box-sizing: border-box;
  margin-top: 20px;
}
.customOderContainer {
  :deep(.el-page-header__content) {
    width: 90%;
    text-align: center;
  }
}
.searchContent {
  display: flex;
}
// .demo-form-inline {
//   padding-top: 30px;
// }
.pClass {
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.goodsInfo {
  display: flex;
  .goodsContent {
    text-align: left;
    box-sizing: border-box;
    padding: 0 15px;
  }
}
.tableContainer {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px;
  margin-top: 20px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
  .left-box {
    display: flex;
    align-items: center;
  }
  .right-box {
    flex-grow: 1;
  }
}
.customValueContainer {
  text-align: center;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  width: max-content;
  margin: 0 auto;
}
</style>
