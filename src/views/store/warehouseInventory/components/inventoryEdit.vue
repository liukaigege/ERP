<!--
* @Descripttion: Vango ERP inventoryEdit.vue 盘库编辑
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div v-loading="loading">
    <ErpNav
			v-if="!pageType"
      title="添加商品"
      routeOpt="./"
      :goBack="goBack"
    />
    <div class="contentContainer" :style="!pageType ? 'margin-top: 20px;' : ''">
      <el-form
        :model="form"
        class="demo-form-inline demo-ruleForm"
        :inline="true"
      >
        <el-form-item label="盘点编号:" v-if="!pageType">
          {{ form.inventoryCheckNumber }} </el-form-item
        ><span v-if="!pageType">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-form-item :label="!pageType ? '仓库:':'仓库位置:'">
          {{ form.warehouseName }} </el-form-item
        ><span v-if="!pageType">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <el-form-item label="盘点类型:" v-if="!pageType">
          {{ activeName === '0' ? '整仓盘点' : '按商品SKU' }}
        </el-form-item>
      </el-form>
			<el-tabs v-if="!!pageType" v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="整仓盘点" name="0"></el-tab-pane>
				<el-tab-pane label="按商品SKU" name="1"></el-tab-pane>
			</el-tabs>
			<el-radio-group v-if="!!pageType" v-model="searchForm.goodsType" class="ml-4">
				<el-radio :label="1" size="large">普通商品盘点</el-radio>
				<el-radio :label="2" size="large" disabled>定制商品盘点</el-radio>
			</el-radio-group>
			<!-- 按商品SKU -->
      <div class="innerContainer" v-show="activeName === '1'">
        <div class="leftContainer">
          <el-form
            :model="searchForm"
            class="demo-form-inline demo-ruleForm"
            :inline="true"
          >
            <el-form-item label="搜索内容:" style="width: 500px">
              <el-select
                style="width: 120px"
                v-model="searchForm.searchType"
                placeholder="请选择"
								clearable
              >
                <el-option
                  v-for="item in searchTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                style="width: 290px; margin-left: 10px"
                v-model="searchForm.searchText"
								clearable
                :placeholder="searchForm.searchType < 4 ? '请输入要检索的内容，多条请用逗号或空格隔开' : '请输入要检索的内容'"
              />
            </el-form-item>
            <el-form-item label="品类:">
              <el-cascader
                ref="categoryIdListRef"
                @change="removeTag"
                v-model="searchForm.categoryIds"
                :options="categoryList"
                collapse-tags
                :props="categoryProps"
                style="width: 200px"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item>
              <div>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <el-button type="primary" @click="querygoodsList(false)">查询</el-button>
                <el-button @click="initFn">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
          <div class="goodsTable">
            <vxe-table
              border
              :height="440"
              align="center"
              ref="tableRef"
              :data="list"
              :scroll-y="{ enabled: false }"
              @checkbox-change="handleSelectionChange"
              @checkbox-all="handleSelectionAll"
            >
              <vxe-column type="checkbox" width="50"></vxe-column>
              <vxe-column title="商品信息">
                <template #default="{ row }">
                  <div class="goodsInfo">
                    <div>
                      <el-popover
                        placement="right-start"
                        trigger="hover"
                        width="auto"
                      >
                        <el-image
                          style="width: 200px; height: 200px"
                          :src="row.mainImg"
                          fit="contain"
                        ></el-image>
                        <template #reference>
                          <el-image
                            style="width: 67px; height: 67px"
                            :src="row.mainImg"
                            fit="contain"
                          ></el-image>
                        </template>
                      </el-popover>
                    </div>
                    <div>
                      <el-tooltip placement="top" :offset="10">
                        <template #content>
                          <span style="color: #fff" v-copy="row.goodsName"
                            >复制</span
                          >
                        </template>
                        <p class="goodsName twoLine" :title="row.goodsName">
                          {{ row.goodsName }}
                        </p>
                      </el-tooltip>
											<p class="oneLine goodsName" style="text-align: left;" :title="row.goodsCode">
												{{ row.goodsCode }}
											</p>
                    </div>
                  </div>
                </template>
              </vxe-column>
              <vxe-column title="商品SKU" width="180">
                <template #default="{ row }">
                  <p class="twoLine" :title="row.skuCode">
                    {{ row.skuCode || '-' }}
                  </p>
									<p class="oneLine" :title="row.goodsSku">
										{{ row.goodsSku || '-' }}
									</p>
                </template>
              </vxe-column>
              <vxe-column title="品类/规格" width="180">
                <template #default="{ row }">
                  <p class="oneLine" :title="row.categoryName">{{row.categoryName}}</p>
                  <p
                    class="oneLine"
                    v-if="row.skuValue"
                    :title="
                      JSON.parse(row.skuValue).reduce(
                        (prev, cur) => prev + cur.spe + ':' + cur.speVal + ' ',
                        ''
                      )
                    "
                  >
                    {{
                      JSON.parse(row.skuValue).reduce(
                        (prev, cur) => prev + cur.spe + ':' + cur.speVal + ' ',
                        ''
                      )
                    }}
                  </p>
                  <p v-else>-</p>
                </template>
              </vxe-column>
              <vxe-column title="货架位" width="130">
                <template #default="{ row }">
									<p class="oneLine" v-if="row.shelfGridName">拣货区</p>
                  <p class="oneLine" :title="row.shelfGridName">{{row.shelfGridName || '-'}}</p>
                </template>
              </vxe-column>
              <vxe-column field="stockQuantity" title="当前库存" width="90">
              </vxe-column>
            </vxe-table>
          </div>
          <el-pagination
						style="margin-right:20px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchForm.page.pageNo"
            :page-sizes="[100, 200, 300, 400, 500]"
            :page-size="searchForm.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNum"
          >
          </el-pagination>
        </div>
        <div class="rightContainer">
          <p class="rightTitle">
            已选择商品 [<span style="color: #70b603">{{
              selectList.length
            }}</span
            >]
          </p>
          <ul class="selectContainer">
            <li
              class="selectContainerList"
              v-for="item in selectList"
              :key="item.skuCode"
            >
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="item.mainImg"
                  fit="contain"
                ></el-image>
                <template #reference>
                  <el-image
                    style="width: 67px; height: 67px"
                    :src="item.mainImg"
                    fit="contain"
                  ></el-image>
                </template>
              </el-popover>
              <div class="selectInfo">
                <p class="oneLine" :title="item.skuCode">{{ item.skuCode }}</p>
                <p class="oneLine" :title="item.goodsSku">{{ item.goodsSku }}</p>
                <p
                  class="oneLine"
                  v-if="item.skuValue"
                  :title="
                    JSON.parse(item.skuValue).reduce(
                      (prev, cur) => prev + cur.spe + ':' + cur.speVal + ' ',
                      ''
                    )
                  "
                >
                  {{
                    JSON.parse(item.skuValue).reduce(
                      (prev, cur) => prev + cur.spe + ':' + cur.speVal + ' ',
                      ''
                    )
                  }}
                </p>
              </div>
              <div class="selectBtn">
                <el-button type="text" style="color: red" @click="delFn(item.skuCode)">删除</el-button>
              </div>
            </li>
          </ul>
        </div>
      </div>
			<!-- 整仓盘点 -->
			<div v-show="activeName === '0'">
				<h3 class="allInventory">整仓盘点将盘点【<span style="color:red;">{{form.warehouseName}}</span>】拣货区中所有商品SKU，共【<span style="color:red;">{{totalNumber}}</span>】个</h3>
			</div>
    </div>
    <ErpFooter>
      <div class="footerContainer">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="ok">{{pageType === 1 ? '创建任务' : '确定'}}</el-button>
      </div>
    </ErpFooter>
  </div>
</template>
<script>
import { reactive, toRefs, nextTick } from 'vue'
import ErpNav from '@/components/erpNav/index.vue'
import { getCategory } from '@/api/goods/quotedPrice.js'
import ErpFooter from '@/components/erpFooter/index.vue'
import { createInfoApi, getGoodsBases, addGoodsApi } from '../composables/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { searchTypeList, searchForm, categoryProps } from '../composables/data'
import { deepCopy } from '@/utils/tool.js'
export default {
	props:{
		pageType:{ //1 仓库盘点   0 编辑任务/添加商品（编辑任务取消开发，改为添加商品，逻辑不变）
			type:Number,
			default:1
		},
		inventoryCheckNumber:{ //盘点编号 (添加商品使用)
			type:String,
			default:null
		}
	},
  components: { ErpNav, ErpFooter },
	emits:['editBack'],
  setup(props,{ emit }) {
    const state = reactive({
			activeName:props.pageType === 1 ? '0' :'1',
			totalNumber:0,//整仓盘点总sku
      form: {
        inventoryCheckNumber: props.inventoryCheckNumber,
        warehouseName: '万众智谷仓库'
      },
      searchForm: deepCopy(searchForm),
      categoryProps,
      categoryList: [],
      list: [],
      totalNum: 0,
      selectList: [],
			tableRef:null,
			categoryIdListRef:null,
			loading:false
    })
    getCategoryEvent()
    function getCategoryEvent() {
      getCategory().then(res => {
        if (res.code == 200) {
          state.categoryList = res.data
        } else {
          ElMessage.error(res.message)
        }
      })
    }
    querygoodsList(true)
    function querygoodsList(status = false) {
			state.loading = true
      getGoodsBases({...state.searchForm,stockFlag:props.pageType === 1 ? null :1}).then(res => {
        state.list = res.data.dataList
        state.totalNum = res.data.page.totalCount
				if(status) state.totalNumber = res.data.page.totalCount
				if(state.selectList.length > 0) {
					setTimeout(()=>{
						state.list.forEach(v=>{
							if(state.selectList.some(it => it.skuCode == v.skuCode)) state.tableRef.setCheckboxRow(v,true)
						})
					},500)
				}
				state.loading = false
      })
    }
		function initFn(){
			state.searchForm = deepCopy(searchForm)
			querygoodsList()
		}
    // 级联选择器 clear 后清除之前选择痕迹 Start
    function removeTag(e) {
      if (!e.length) renderClear(state.categoryIdListRef?.popperPaneRef)
    }
    function renderClear(DOM_popperPaneRef) {
      if (Array.from(DOM_popperPaneRef?.children).length)
        Array.from(DOM_popperPaneRef?.children).forEach(v => {
          if (
            typeof v?.className === 'string' &&
            ~v.className.indexOf('-active-')
          )
            nextTick(() => (v.className = v.className.replace('-active-', '-')))
          if (v?.children.length) renderClear(v)
        })
    }
    // 级联选择器 clear 后清除之前选择痕迹 End
    function goBack() {
      emit('editBack',false)
    }
    function handleSizeChange(val) {
      state.searchForm.page.pageSize = val
			querygoodsList()
    }
    function handleCurrentChange(val) {
      state.searchForm.page.pageNo = val
			querygoodsList()
    }
		function handleSelectionChange(val){
			if(val.checked) state.selectList.push(val.row)
			else state.selectList = state.selectList.filter(v => v.skuCode != val.row.skuCode)
		}
		function handleSelectionAll(val){
			if(val.checked) state.list.forEach(v=>{ if(!state.selectList.some(it => it.skuCode == v.skuCode)) state.selectList.push(v) })
			else state.selectList = state.selectList.filter(v => !state.list.some(it => it.skuCode == v.skuCode ))
		}
		function delFn(skuCode){
			const row = state.selectList.filter(v => skuCode == v.skuCode)[0]
			state.selectList = state.selectList.filter(v => skuCode != v.skuCode)
			state.tableRef.setCheckboxRow(row,false)
		}
		function ok(){
			let skuIds = []
			if(state.activeName === '0') skuIds = null
			else skuIds = state.selectList.map(v=>v.goodsSku)
			if(!!skuIds && !skuIds.length) return ElMessage.warning({ message: '请选择商品!' })
			ElMessageBox.confirm(
          `${props.pageType === 1 ? '确认创建盘点任务？' : '确认添加商品？'}`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }
        ).then(() => {
					if(props.pageType === 1){
						const obj = {
							type: state.activeName - 0 + 1 ,//盘点类型 1 整仓盘点 2按商品SKU
							goodsType: state.searchForm.goodsType - 1 ,//盘点商品类型 0普货 1定制品
							skuIds,//按商品SKU盘点的SKUID集合
							skuIdSize:skuIds?.length || state.totalNumber
						}
						// 仓库盘点 => 创建盘点单
						createInfoApi(obj)
							.then(res => {
								if(res.code === 200){
									ElMessage.success({ message: res.message })
									emit('editBack',true)
								}else{
									ElMessage.warning({ message: res.message })
								}
							})
					}else{
						// 添加商品
						const obj = {
							inventoryCheckNumber: props.inventoryCheckNumber, //盘点编号
							skuIds //按商品SKU盘点的SKUID集合
						}
						addGoodsApi(obj)
							.then(res => {
								if(res.code === 200){
									ElMessage.success({ message: res.message })
									emit('editBack',true)
								}else{
									ElMessage.warning({ message: res.message })
								}
							})
					}
        })
		}

		function handleClick(){
			//
		}
    return {
			ok,
			delFn,
      goBack,
			initFn,
      removeTag,
			handleClick,
      querygoodsList,
      handleSizeChange,
			handleSelectionAll,
      handleCurrentChange,
			handleSelectionChange,
      ...toRefs(state),
			searchTypeList,
    }
  }
}
</script>
<style lang='scss' scoped>
.contentContainer {
  background-color: #fff;
  box-sizing: border-box;
  padding: 20px 20px 0;
}
.innerContainer {
  display: flex;
  justify-content: space-between;
  // border-top: 1px solid #d7d7d7;
  .leftContainer {
    flex: 3;
    padding: 20px 0;
    border-right: 1px solid #d7d7d7;
  }
  .rightContainer {
    flex: 2;
    padding: 20px;
    box-sizing: border-box;

    .rightTitle {
      font-weight: 550;
    }
    .selectContainer {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
      flex-wrap: wrap;
      max-height: 500px;
      overflow-y: auto;
      .selectContainerList {
        width: 300px;
        border: 1px solid #d7d7d7;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        box-sizing: border-box;
        padding: 10px;
        .selectInfo {
          width: 150px;
        }
        .selectBtn {
          width: 40px;
          text-align: right;
          padding-top: 20px;
        }
      }
    }
  }
}
.goodsTable {
  margin-bottom: 15px;
  box-sizing: border-box;
  padding-right: 20px;
  .goodsInfo {
    display: flex;
    .goodsName {
      text-align: left;
      max-width: 147px;
      margin-left: 15px;
    }
    .goodsSku {
      max-width: 147px;
      text-align: left;
      margin-left: 15px;
    }
  }
}
.footerContainer {
	width: 100%;
  text-align: right;
  box-sizing: border-box;
  padding: 0 20px;
}
.oneLine {
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.twoLine {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.allInventory{
	font-size: 24px;
	margin-top: 20px;
	padding-bottom: 20px;
}
</style>
