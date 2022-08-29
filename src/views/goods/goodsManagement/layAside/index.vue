<template>
  <div>
    <div class="pageView">
			<el-form  :inline="true" :model="form" ref="formRef"  @keyup.enter="searchEvent">
				<el-form-item label="时间范围:" prop="timeType">
					<el-select v-model="form.timeType" style="width: 140px" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in timeType" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="start_end">
					<el-date-picker v-model="form.start_end" type="daterange" value-format="YYYY-MM-DD" unlink-panels range-separator="→" start-placeholder="开始日期" end-placeholder="结束日期" clearable style="width: 245px">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="商品类型:" prop="enableCustom">
					<el-select v-model="form.enableCustom" style="width: 140px" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in enableCustomOptions" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品来源:" prop="goodsSource">
					<el-cascader v-model="form.goodsSource" :options="sourceData" :props="{ checkStrictly: true }" clearable @change="changeSource" style="width: 140px"></el-cascader>
				</el-form-item>
				<el-form-item label="商品品类:" prop="categoryId">
					<el-cascader v-model="form.categoryId" :options="categoryList" :props="categoryProps" style="width: 140px" clearable></el-cascader>
				</el-form-item>
        <el-form-item label="侵权筛选:" prop="tortStatus">
					<el-select v-model="form.tortStatus" style="width: 140px" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in tortStatusOptions" :key="index"></el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="商品属性:" prop="attr">
					<el-select v-model="form.attr" multiple style="width: 140px" clearable>
						<el-option v-for="item in goodsAttrOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="搜索内容:" prop="searchType">
					<el-select v-model="form.searchType" style="width: 140px" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in searchType" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="searchText">
					<el-input v-model="form.searchText" :placeholder="[2, 3, 4, 12].includes(form.searchType) ? '请输入要检索的内容多条可用逗号或者空格隔开' : '请输入要检索的内容'" clearable style="width: 350px"></el-input>
				</el-form-item>
        <el-form-item label="查看权限:" prop="authType">
					<el-select v-model="form.authType" style="width: 140px" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in authTypeOptions" :key="index"></el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="采购价(CNY):" prop="purchasePriceBegin">
					<el-input-number v-model="form.purchasePriceBegin" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable  style="width: 85px" />
				</el-form-item>
				<el-form-item>
          <span>→</span>
        </el-form-item>
				<el-form-item prop="purchasePriceEnd">
				  <el-input-number v-model="form.purchasePriceEnd" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable  style="width: 85px" />
				</el-form-item>
				<!-- <el-form-item label="建议售价(USD):" prop="suggestedPriceBegin">
					<el-input-number v-model="form.suggestedPriceBegin" :controls="false" :min="0" :max="999999.99" :precision="2" placeholder="请输入" clearable  style="width: 85px" />
				</el-form-item>
				<span class="mr-10">→</span>
				<el-form-item prop="suggestedPriceEnd">
					<el-input-number v-model="form.suggestedPriceEnd" :controls="false" :min="0" :max="999999.99" :precision="2" placeholder="请输入" clearable  style="width: 85px" />
				</el-form-item> -->
				<el-form-item label="运费(CNY):" prop="freightBegin">
					<el-input-number v-model="form.freightBegin" :controls="false" :min="0" :max="999999.99" :precision="2" placeholder="请输入" clearable  style="width: 85px" />
				</el-form-item>

				<el-form-item prop="freightEnd">
					<el-input-number v-model="form.freightEnd" :controls="false" :min="0" :max="999999.99" :precision="2" placeholder="请输入" clearable  style="width: 85px" />
				</el-form-item>
				<div class="flex">
          <el-form-item label="备注:">
            <el-checkbox v-model="item.checked" :label="item.label" v-for="(item, index) in remakeOptions" :key="index" @change="changeRemake"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="searchEvent">查询</el-button>
            <el-button  @click="resetForm(7)">重置</el-button>
          </el-form-item>
				</div>
			</el-form>
		</div>
    <div class="operationView">
			<el-form  class="sortForm">
				<el-form-item label="排序:" style="margin-bottom: 8px">
					<el-button type="text" class="sortText" :class="form.sortName == 1 ? '' : 'unSelectActive'" @click="sortEvent(1)">
            开发时间<i class="el-icon--right" :class="form.sortType == 'desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" v-if="form.sortName == 1"></i>
          </el-button>
          <el-button type="text" class="sortText" :class="form.sortName == 5 ? '' : 'unSelectActive'" @click="sortEvent(5)">
            移入时间<i class="el-icon--right" :class="form.sortType == 'desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'" v-if="form.sortName == 5"></i>
          </el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="batchChangeLayAside('BatchChangeLayAside')" v-permission="'layAside/removeLayAside'">移出搁置</el-button>
				</el-form-item>
			</el-form>
		</div>
    <div class="pageView" style="margin-bottom: 55px">
      <vxe-table v-bind="tableOptions" :loading="loading" ref="tableRef" :scroll-y="{enabled: false}">
        <vxe-column title="商品信息" min-width="340">
          <template #header>
            <el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll" style="margin-top: 6px"></el-checkbox>
            <span class="ml-10">商品信息</span>
          </template>
          <template #default="{ row, rowIndex }">
            <div v-if="rowIndex % 2 === 0" class="flexLeft">
              <el-checkbox v-model="row.checked" @change="selectRow(row)"></el-checkbox>
              <el-tooltip placement="top" :offset="10">
                <template #content>
                  <a style="color: #fff" v-copy="row.id">复制</a>
                </template>
                <a style="color: #000">{{row.id}}</a>
              </el-tooltip>
              <el-popover placement="top" :width="800" trigger="hover" v-for="(item, index) in row.remarkList" :key="index" @after-enter="showEvent(row.id, item.typeId)">
                <template #reference>
                  <div class="remarkLabel" :style="{'backgroundColor': item.color}">{{item.word}}</div>
                </template>
                <el-table :data="remarkList" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
                  <el-table-column min-width="300" property="content" label="内容"></el-table-column>
                  <el-table-column width="170" property="createTime" label="时间"></el-table-column>
                  <el-table-column width="90" property="typeName" label="类型"></el-table-column>
                  <el-table-column width="90" property="createUserName" label="操作人"></el-table-column>
                </el-table>
              </el-popover>
            </div>
            <div class="goodsInfo" v-else>
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image style="width: 200px; height: 200px" :src="row.mainImgUrl" fit="contain"></el-image>
              <template #reference>
                <el-image style="width: 70px; height: 70px" :src="row.mainImgUrl" fit="contain"></el-image>
              </template>
            </el-popover>
            <div class="right">
              <el-tooltip placement="top" :offset="10">
                <template #content>
                  <a style="color: #fff" v-copy="row.nameCn ? row.nameCn : row.nameEn">复制</a>
                </template>
                <a class="goodsName textOverflow" :title="row.nameCn ? row.nameCn : row.nameEn">{{row.nameCn ? row.nameCn : row.nameEn}}</a>
              </el-tooltip>
              <div class="tagBox">
                <el-tag type="danger"  v-if="row.tortStatus === 2">侵</el-tag>
                <el-tag  v-for="(item, index) in row.labelList" :key="index">{{item.name}}</el-tag>
              </div>
              <div style="color: #1890FF" v-if="row.enableCustom == 1">定制品</div>
            </div>
          </div>
          </template>
        </vxe-column>
        <vxe-column field="code" title="商品SPU" min-width="240">
          <template #default="{ row }">
            <a class="goodsName textOverflow" :title="row.code" @click="openSpuDetail('SpuList', row.id)">{{row.code}}</a>
          </template>
        </vxe-column>
        <vxe-column field="categoryName" title="品类" width="130"></vxe-column>
        <vxe-column title="来源" width="151">
          <template #default="{ row }">
            <div v-if="row.mode == 0">平台采集</div>
            <div v-if="row.mode == 1">独立站采集</div>
            <div v-if="row.mode == 2">手动</div>
            <div v-if="row.mode == 3">导入</div>
            <div v-if="row.mode == 4">复制</div>
            <div>{{row.source}}</div>
          </template>
        </vxe-column>
        <vxe-column title="开款信息" width="150" v-if="authPath('layAside/openTypeInfo')">
          <template #default="{ row }">
            <div>开发人: {{row.createUserName}}</div>
            <div>{{row.createTime}}</div>
          </template>
        </vxe-column>
        <vxe-column title="查看权限" width="130">
          <template #default="{ row }">
            <div v-if="row.authType == 0">仅维护人可见</div>
            <div v-if="row.authType == 1">仅部门人员可见</div>
            <div v-if="row.authType == 2">所有人可见</div>
            <div v-if="row.authType == 3">部门及以下</div>
          </template>
        </vxe-column>
        <vxe-column title="默认采购价" width="100">
          <template #header>
            <div class="priceHead">
              <div>默认采购价</div>
              <!-- <div>(建议售价)</div> -->
            </div>
          </template>
          <template #default="{ row }">
            <div>￥{{row.purchasePrice}}</div>
            <!-- <div>(${{row.suggestedPrice}})</div> -->
          </template>
        </vxe-column>
        <vxe-column title="维护人" v-if="authPath('layAside/maintainUserName')" width="100">
          <template #default="{ row }">
            <div>{{row.maintainUserName}}</div>
            <div>{{row.maintainDeptName}}</div>
            <!-- <div>{{row.deptName}}</div> -->
          </template>
        </vxe-column>
        <vxe-column title="移入时间" width="150">
          <template #default="{ row }">
            <div>操作人: {{row.layUserName}}</div>
            <div>{{row.layTime}}</div>
          </template>
        </vxe-column>
        <vxe-column title="操作" width="100">
          <template #default="{ row }">
            <el-button type="text"  @click="opneDetail(row.id)">详情</el-button>
            <el-button type="text"  @click="openRemark('LayAsideRemark', row.layRemark)">搁置原因</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <div class="paginationBox">
        <div>
          <el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll">已选{{selections.length}}条</el-checkbox>
        </div>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page.pageNo"
        :page-sizes="[100, 200, 300, 500, 1000]" :page-size="form.page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
    </div>
    <component :is="url" v-if="ifShow" @closeEvent="closeEvent" :goodsIds="selections" :spuId="spuId" :layAsidecause="layAsidecause"></component>
  </div>
</template>

<script>
import { onMounted, ref, reactive, toRefs, computed } from 'vue'
import { useRouter ,useRoute} from 'vue-router'
import { notAllowRouter, _debounce } from '@/utils/tool.js'
import { sourceData, authTypeOptions, tortStatusOptions, enableCustomOptions, goodsAttrOptions } from '@/assets/js/staticData.js'
import { timeType, searchType, categoryProps } from './composables/staticData'
import Hooks from '../js/hooks'
import Handle from './composables/handle'
import tableOptions from './composables/tableOptions'
import TableHandle from '../js/tableHandle'
import BatchChangeLayAside from '@/views/goods/goodsManagement/layAside/components/batchChangeLayAside.vue'
import SpuList from '@/views/goods/goodsManagement/setPrice/components/spuList.vue'
import LayAsideRemark from '@/views/goods/goodsManagement/layAside/components/layAsideRemark.vue'
export default {
  name: 'LayAside',
  components: {
    BatchChangeLayAside,
    SpuList,
    LayAsideRemark
  },
  setup() {
      let router = useRouter()
      let route = useRoute()
			let state = reactive({
        ifShow: false,
        url: '',
				categoryList: [],
        remakeOptions: [],
        remarkList: [],
        form: {
					timeType: null, // 时间类型
          start_end: [], // 时间  start,end拼接
					enableCustom: null, // 商品类型
					mode: null, // 来源 一级
					source: null, // 来源 二级
          goodsSource: null,
					categoryId: null, // 品类ID
					tortStatus: null, // 侵权状态
					attr: null, // 属性
					goodsStatus: 7, // 商品状态
					combineType: null, // 组合标识
					searchType: null, // 搜索类型
					searchText: '', // 搜索内容
					authType: null, // 查看权限
					purchasePriceBegin: undefined, // 采购价 <
					purchasePriceEnd: undefined, // 采购价 >
					suggestedPriceBegin: undefined, // 建议售价 <
					suggestedPriceEnd: undefined, // 建议售价 >
					freightBegin: undefined, // 运费 <
					freightEnd: undefined, // 运费 >
					costPriceBegin: undefined, // 成本价 <
					costPriceEnd: undefined, // 成本价 >
					expectPriceBegin: undefined, // 预估售价 <
					expectPriceEnd: undefined, // 预估售价 >
					remarkTypeIds: null, // 备注类型ID
					sortName: 5, // 排序字段
					sortType: 'desc', // 排序 （desc倒序，asc正序）
					page: {
						pageNo: 1,
						pageSize: 100
					},
				},
        selections: [], // 选中的id集合
        selectRows: [], // 选中的row集合
        selectedAll: false, // 是否全选
        totalCount: 0, // 总条目数
        loading: false,
        spuId: null,
        layAsidecause: '',
        tableData: [],
        stickyOptions: {
          className: '.vxe-table--header-wrapper', // 需要吸顶的节点
          stickyNum: 109 // 吸顶的距离
        }
			})
      let tableRef = ref(null)
			let formRef = ref(null)
      let hooks = Hooks(state, formRef, tableRef,route)
      let tableHandle = TableHandle(state, hooks)
      let handle = Handle(state, hooks, router)

      let remarkText = computed(() => {
        return (typeId) => {
          let obj = {}
          state.remakeOptions.forEach(item => {
            if (typeId == item.value) {
              obj.word = item.word
              obj.color = item.color
              obj.type = item.label
            }
          })
          return obj
        }
      })

      onMounted(() => {
        // notAllowRouter()
        hooks.getCategoryEvent()
        hooks.getRemarkTypes()
        hooks.searchEvent()
      })

			return {
				...toRefs(state),
        remarkText,
        formRef,
        tableRef,
        sourceData,
        authTypeOptions,
        tortStatusOptions,
        enableCustomOptions,
        goodsAttrOptions,
        tableOptions,
        timeType,
        searchType,
        categoryProps,
        ...hooks,
        ...handle,
        ...tableHandle
			}
		}
}
</script>

<style lang="scss" scoped>
.pageView {
  :deep(.vxe-header--column){
    position: relative;
    .el-checkbox{
      position: absolute;
      left: 10px;
    }
  }
  .flexLeft{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .goodsInfo{
    display: flex;
    padding: 16px;
    .right{
      flex: 1;
      overflow: hidden;
      margin-left: 16px;
      text-align: left;
      .goodsName{
        margin-bottom: 10px;
        color: #000
      }
      .tagBox{
        display: flex;
        flex-wrap: wrap;
        max-height: 62px;
        overflow: hidden;
        .el-tag{
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
    }
  }
  .goodsSpu{
    padding: 16px;
    color: #000;
  }
  .remarkLabel{
    padding: 0px 5px;
    border-radius: 4px;
    margin-left: 10px;
    color: #fff;
  }
}
.padding16{
  padding: 0 16px;
}
.operationView {
	margin-top: 16px;
  .unSelectActive{
    color: #909399;
  }
  .sortText{
    font-size: 14px;
  }
}
:deep(.el-range-separator) {
	width: 6%;
}
:deep(.el-checkbox) {
	margin-right: 16px;
}
.flex {
	display: flex;
	justify-content: space-between;
	height: 32px;
}
.el-dropdown-link {
	cursor: pointer;
}
.el-icon-arrow-down {
	font-size: 12px;
}
.paginationBox{
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 1000;
  padding: 0 30px;
  width: calc(100% - var(--sideBarWidth));
  height: 56px;
  background-color: #fff;
  .el-pagination{
    margin-top: 8px;
  }
}
:deep(.sortForm .el-form-item__label){
  font-size: 14px;
}
</style>
