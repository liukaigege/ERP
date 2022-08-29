<template>
	<div>
		<AffixTab>
			<template v-slot:tabSlot>
				<el-button :type="form.combineType == 1 ? 'primary' : 'default'" @click="tabSelectEvent(1)" class="btn">
					<div>单品</div>
					<div>(<span :style="{'color': form.combineType == 2 ? '#f27869' : '#fff'}">{{quotationSingleNum}}</span>)</div>
				</el-button>
				<el-button :type="form.combineType == 2 ? 'primary' : 'default'" @click="tabSelectEvent(2)" class="btn">
					<div>组合品</div>
					<div>(<span :style="{'color': form.combineType == 1 ? '#f27869' : '#fff'}">{{quotationCombineNum}}</span>)</div>
				</el-button>
			</template>
		</AffixTab>
		<div class="pageView">
			<el-form :inline="true" :model="form" ref="formRef" @keyup.enter="searchEvent()">
				<el-form-item label="时间范围:" prop="timeType">
					<el-select v-model="form.timeType" style="width: 140px" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in timeTypeOptions" :key="index"></el-option>
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
						<el-option v-for="item in goodsAttrOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
        <br/>
				<el-form-item>
					<el-form-item label="搜索内容" prop="searchType">
						<el-select v-model="form.searchType" style="width: 140px" clearable>
							<el-option :label="item.label" :value="item.value" v-for="(item, index) in searchType" :key="index"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="searchText">
						<el-input v-model="form.searchText" :placeholder="[1, 5, 7, 9, 8, 11, 14,null, ''].includes(form.searchType) ? '请输入要检索的内容' : '请输入要检索的内容多条可用逗号或者空格隔开'" clearable style="width: 350px"></el-input>
					</el-form-item>
				</el-form-item>
				<el-form-item label="查看权限:" prop="authType">
					<el-select v-model="form.authType" style="width: 140px" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in authTypeOptions" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="关联采购:" prop="combination" v-if="form.combineType == 2">
					<el-select v-model="form.combination" style="width: 140px" clearable>
						<el-option :label="item.label" :value="item.value" v-for="(item, index) in combinationOptions" :key="index"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="报关信息:" prop="customsComplete" v-if="form.combineType == 2">
					<el-select v-model="form.customsComplete" style="width: 140px" clearable>
						<el-option label="已完善" :value="0"></el-option>
						<el-option label="未完善" :value="1"></el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="维护人部门:" prop="deptIds" class="deptClass">
          <el-cascader  ref="deptIdsRef" filterable v-model="form.deptIds" :options="deptList" collapse-tags :props="{value: 'deptId', label: 'deptName',children: 'children',multiple: true,emitPath: true,}" style="width: 140px" clearable @change="deptChange"></el-cascader>
        </el-form-item>
				<el-form-item>
					<el-form-item label="采购价(CNY):" prop="purchasePriceBegin">
						<el-input-number v-model="form.purchasePriceBegin" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable />
					</el-form-item>
					<el-form-item>
						<span>→</span>
					</el-form-item>
					<el-form-item prop="purchasePriceEnd">
						<el-input-number v-model="form.purchasePriceEnd" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable />
					</el-form-item>
				</el-form-item>
				<!-- <el-form-item label="建议售价(USD):" prop="suggestedPriceBegin">
					<el-input-number v-model="form.suggestedPriceBegin" :controls="false" :min="0" :max="999999.99" :precision="2" placeholder="请输入" clearable  style="width: 85px" />
				</el-form-item>
				<span class="mr-10">→</span>
				<el-form-item prop="suggestedPriceEnd">
					<el-input-number v-model="form.suggestedPriceEnd" :controls="false" :min="0" :max="999999.99" :precision="2" placeholder="请输入" clearable  style="width: 85px" />
				</el-form-item>-->
				<el-form-item>
					<el-form-item label="运费(CNY):" prop="freightBegin">
						<el-input-number v-model="form.freightBegin" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable />
					</el-form-item>
					<el-form-item>
						<span>→</span>
					</el-form-item>
					<el-form-item prop="freightEnd">
						<el-input-number v-model="form.freightEnd" :controls="false" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" clearable />
					</el-form-item>
				</el-form-item>
				<div class="flex">
					<div class="left">
						<el-form-item label="备注:">
							<el-checkbox v-model="item.checked" :label="item.label" v-for="(item, index) in remakeOptions" :key="index" @change="changeRemake"></el-checkbox>
						</el-form-item>
					</div>
					<div class="right">
						<el-button type="primary" @click="searchEvent">查询</el-button>
						<el-button @click="resetForm(6)">重置</el-button>
					</div>
				</div>
			</el-form>
		</div>
		<div class="operationView">
			<el-form class="sortForm">
				<el-form-item label="排序:" style="margin-bottom: 8px;">
					<el-button type="text" @click="sortTypeEvent()" class="sortText">
						开发时间
						<i class="el-icon--right" :class="form.sortType == 'desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i>
					</el-button>
				</el-form-item>
				<el-form-item>
					<div class="flex">
						<div class="left">
							<el-button type="primary" @click="remarkEvent('Remark')" v-permission="'setPrice/remark'" style="margin-right: 16px">备注</el-button>
							<el-button type="primary" style="margin-right: 16px" @click="setPermission('SetPermission')" v-permission="'setPrice/setPermission'">设置权限</el-button>
							<el-button type="primary" style="margin-right: 16px" @click="publishEvent" v-permission="'setPrice/addPublish'">加入刊登</el-button>
							<el-button type="primary" style="margin-right: 16px" @click="goodsMerge('GoodsMerge')" v-permission="'setPrice/goodsMerge'">合并商品</el-button>
							<el-button type="primary" style="margin-right: 16px" @click="addGroupgoods('CopyGoodsInfo')" v-if="form.combineType == 1" v-permission="'/goods/goodsManagement/setPrice/addGroupgoods'">新增组合品</el-button>
							<el-dropdown @command="handleCommand">
								<el-button type="primary">
									批量操作<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item :command="{ handle: batchChangeAddLabel, params: 'AddLabel' }" v-permission="'setPrice/addLabel'">批量修改标签</el-dropdown-item>
										<el-dropdown-item :command="{ handle: batchChangeLayAside, params: 'BatchChangeLayAside' }" v-permission="'setPrice/batchChangeLayAside'">批量移入搁置</el-dropdown-item>
										<el-dropdown-item :command="{ handle: batchCustomsInfo, params: false }" v-permission="'setPrice/batchCustomsInfo'">批量修改报关信息</el-dropdown-item>
										<el-dropdown-item :command="{ handle: batchChangeGoodsSource, params: 'BatchChangeGoodsSource' }" v-permission="'setPrice/batchChangeGoodsSource'">批量修改货源渠道</el-dropdown-item>
										<el-dropdown-item :command="{ handle: batchChangeMaintainman, params: 'BatchChangeMaintainman' }" v-permission="'setPrice/batchChangeMaintainman'">批量修改维护人</el-dropdown-item>
										<el-dropdown-item :command="{ handle: batchChangeCategory, params: 'BatchChangeCategory' }" v-permission="'setPrice/batchChangeCategory'">批量修改商品品类</el-dropdown-item>
										<el-dropdown-item :command="{ handle: syncGoodsInfo, params: 'SyncGoodsInfo' }" v-permission="'setPrice/syncGoodsInfo'">强制同步商品信息</el-dropdown-item>
										<el-dropdown-item :command="{ handle: UpdateSku, params: 'UpdateSku' }" v-permission="'setPrice/updateSku'">批量更新SKU</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
							<el-dropdown  style="margin-left:16px"  v-if="form.combineType == 2&&authPath('declare:btn')" @command="importOrExoprt">
								<el-button type="primary">
									报关信息<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item command="exportCustomsInformation">导出报关信息</el-dropdown-item>
										<el-dropdown-item command="importCustomsInformation/ImportCustomsInformation">导入报关信息</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</div>
						<div class="right">
							<el-button type="primary" @click="exportXlsx" v-permission="'setPrice/exportGoods'">导出商品</el-button>
							<el-button type="primary" @click="exportGoodsEvent" v-permission="'setPrice/exoprtShopHoney'">导出店小秘模板</el-button>
						</div>
					</div>
				</el-form-item>

			</el-form>
		</div>
		<div class="pageView" style="margin-bottom: 55px">
			<vxe-table v-bind="tableOptions" :loading="loading" ref="tableRef" :scroll-y="{enabled: false}">
				<vxe-column title="商品信息" width="339">
					<template #header>
						<el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll" style="margin-top: 6px"></el-checkbox>
						<span class="ml-10">商品信息</span>
					</template>
					<template #default="{ row, rowIndex }">
						<div v-if="rowIndex % 2 === 0" class="flexLeft" :id="'goodsId_' + row.id">
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
								<el-table :data="remarkList" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}" fit>
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
									<el-tag type="danger" v-if="row.tortStatus === 2">侵</el-tag>
									<el-tag v-for="(item, index) in row.labelList" :key="index">{{item.name}}</el-tag>
								</div>
								<div style="color: #1890FF" v-if="row.enableCustom == 1">定制品</div>
							</div>
						</div>
					</template>
				</vxe-column>
				<vxe-column field="code" title="商品SPU" min-width="180">
					<template #default="{ row }">
						<a class="goodsName textOverflow" :title="row.code" @click="openSpuDetail('SpuList', row.id)">{{row.code}}</a>
					</template>
				</vxe-column>
				<vxe-column field="categoryName" title="品类" width="156"></vxe-column>
				<vxe-column title="来源" min-width="120">
					<template #default="{ row }">
						<div v-if="row.mode == 0">平台采集</div>
						<div v-if="row.mode == 1">独立站采集</div>
						<div v-if="row.mode == 2">手动</div>
						<div v-if="row.mode == 3">导入</div>
						<div v-if="row.mode == 4">复制</div>
						<div>{{row.source}}</div>
					</template>
				</vxe-column>
				<vxe-column title="开款信息" width="180">
					<template #default="{ row }">
						<div v-if="authPath(form.combineType == 1 ? 'set-price-item_create-user-name_field' : 'set-price-compose_create-user-name_field')">开发人: {{row.createUserName}}</div>
						<div v-if="authPath(form.combineType == 1 ? 'set-price-item_create-time_field' : 'set-price-compose_create-time_field')">开发: {{row.createTime}}</div>
						<div v-if="authPath(form.combineType == 1 ? 'set-price-item_end-time_field' : 'set-price-compose_end-time_field')">完成: {{row.firstLogisticsTime}}</div>
					</template>
				</vxe-column>
				<vxe-column title="查看权限" width="140">
					<template #default="{ row }">
						<div v-if="row.authType == 0">仅维护人可见</div>
						<div v-if="row.authType == 1">仅部门人员可见</div>
						<div v-if="row.authType == 2">所有人可见</div>
						<div v-if="row.authType == 3">部门及以下</div>
					</template>
				</vxe-column>
				<vxe-column title="默认采购价" width="110">
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
				<vxe-column title="维护人" min-width="200" v-if="authPath(form.combineType == 1 ? 'setPrice/item/maintainMan' : 'setPrice/items/maintainMan')">
					<template #default="{ row }">
						<div>{{row.maintainUserName}}</div>
						<div>{{row.maintainDeptName}}</div>
						<!-- <div>{{row.deptName}}</div> -->
					</template>
				</vxe-column>
				<vxe-column title="关联" :min-width="100" :visible="form.combineType == 2">
					<template #default="{ row }">
						<div v-if="row.combination == 1">已关联</div>
						<div v-if="row.combination == 0">未关联</div>
					</template>
				</vxe-column>
				<vxe-column title="操作" :min-width="60">
					<template #default="{ row }">
						<el-button type="text" @click="openDetail(row,tableData)">详情</el-button>
					</template>
				</vxe-column>
			</vxe-table>
			<div class="paginationBox">
				<div>
					<el-checkbox :indeterminate="selections.length > 0 && !selectedAll" v-model="selectedAll" @change="selectAll">已选{{selections.length}}条</el-checkbox>
					<span class="ml-20">采购超时：<span class="color-danger">{{purchaseOvers}}</span>条</span>
					<span class="ml-20">物流超时：<span class="color-danger">{{logisticOvers}}</span>条</span>
					<span class="ml-20">总超时：<span class="color-danger">{{summaryOvers}}</span>条</span>
				</div>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="form.page.pageNo" :page-sizes="[100, 200, 300, 500, 1000]" :page-size="form.page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
			</div>
		</div>
		<component :is="url" v-if="ifShow" @closeEvent="closeEvent" :goodsIds="selections" :selectRows="selectRows" :goodsCommons="goodsCommons" :goodsCommonsInfo="goodsCommonsInfo" :spuId="spuId" :formData="form" :uuid="uuid"></component>
	</div>
</template>

<script>
	import AffixTab from '@/components/affixTab/index.vue'
	import { computed, onMounted, onActivated, reactive, ref, toRefs, watch } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { notAllowRouter, _debounce } from '@/utils/tool.js'
	import { sourceData, authTypeOptions, tortStatusOptions, enableCustomOptions, goodsAttrOptions } from '@/assets/js/staticData.js'
	import Hooks from '../js/hooks.js'
	import Handle from './composables/handle'
	import TableHandle from '../js/tableHandle'
	import { timeTypeOptions, searchType, categoryProps, combinationOptions } from './composables/staticData'
	import Remark from '@/views/goods/goodsManagement/setPrice/components/remark.vue'
	import SetPermission from '@/views/goods/goodsManagement/setPrice/components/setPermission.vue'
	import GoodsMerge from '@/views/goods/goodsManagement/setPrice/components/goodsMerge.vue'
	import BatchChangeLayAside from '@/views/goods/goodsManagement/setPrice/components/batchChangeLayAside.vue'
	import BatchChangeGoodsSource from '@/views/goods/goodsManagement/setPrice/components/batchChangeGoodsSource.vue'
	import BatchChangeMaintainman from '@/views/goods/goodsManagement/setPrice/components/batchChangeMaintainman.vue'
	import UpdateSku from '@/views/goods/goodsManagement/setPrice/components/updateSku.vue'
	import SyncGoodsInfo from '@/views/goods/goodsManagement/setPrice/components/syncGoodsInfo.vue'
	import AddLabel from '@/views/goods/goodsManagement/setPrice/components/addLabel.vue'
	import BatchChangeCategory from '@/views/goods/goodsManagement/setPrice/components/batchChangeCategory.vue'
	import SpuList from '@/views/goods/goodsManagement/setPrice/components/spuList.vue'
	import exportGoods from '@/views/goods/goodsManagement/setPrice/components/exportGoods.vue'
	import CopyGoodsInfo from '@/views/goods/goodsManagement/setPrice/components/copyGoodsInfo.vue'
	import ImportCustomsInformation from './components/importCustomsInformation.vue'
  import { orderIndexParmas } from '@/utils/tool.js'
	import progressDialog from './components/progressDialog.vue'
  import { getDepartmentList } from '@/api/user'
	export default {
		name: 'SetPrice',
		components: {
			AffixTab,
			Remark,
			SetPermission,
			GoodsMerge,
			BatchChangeLayAside,
			BatchChangeGoodsSource,
			BatchChangeMaintainman,
			UpdateSku,
			SyncGoodsInfo,
			AddLabel,
			BatchChangeCategory,
			SpuList,
			exportGoods,
			CopyGoodsInfo,
			ImportCustomsInformation,
			progressDialog,
		},
		setup() {

			let router = useRouter()
			let route = useRoute()
			let state = reactive({
				url: 'Remark',
				ifShow: false,
				quotationSingleNum: '-',
				quotationCombineNum: '-',
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
					goodsStatus: 6, // 商品状态
					combineType: 1, // 组合标识
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
					sortName: 1, // 排序字段
					sortType: 'desc', // 排序 （desc倒序，asc正序）
					combination: null, // 关联采购
					customsComplete:null,// 报关信息
          deptIds:[],
					page: {
						pageNo: 1,
						pageSize: 100
					}
				},
        deptList: [],//部门
				selections: [], // 选中的id集合
				selectRows: [], // 选中的row集合
				selectedAll: false, // 是否全选
				totalCount: 0, // 总条目数
				loading: false,
				tableData: [],
				goodsCommons: [], // 筛选出普货
				goodsCommonsInfo: [],
				categorySame: true, // 是否是同一品类
				spuId: null,
				stickyOptions: {
					className: '.vxe-table--header-wrapper', // 需要吸顶的节点
					stickyNum: 225 // 吸顶的距离
				},
				purchaseOvers: 0, // 采购报价超时条数
				logisticOvers: 0, // 物流报价超时条数
				summaryOvers: 0, // 总超时条数
				tableOptions: {
					spanMethod: ({ rowIndex, columnIndex }) => {
						if (rowIndex % 2 === 0) {
							if (columnIndex === 0) {
								return { rowspan: 1, colspan: state.form.combineType == 1 ? 9 : 10 }
							} else {
								return { rowspan: 0, colspan: 0 }
							}
						}
					},
					border: true,
					autoResize: true,
					keepSource: true,
					align: 'center',
					highlightHoverRow: true,
					tableData: []
				},
				uuid:null
			})
			let tableRef = ref(null)
			let formRef = ref(null)
      let deptIdsRef = ref(null)
			let hooks = Hooks(state, formRef, tableRef, route,deptIdsRef)
			let tableHandle = TableHandle(state, hooks)
			let handle = Handle(state, hooks, router)

			watch(() => state.selectRows, (newVal) => {
				state.goodsCommons = []
				state.goodsCommonsInfo = []
				state.categorySame = true
				newVal.forEach(item => {
					if (item.enableCustom == 0) {
						state.goodsCommons.push(item.id)
						state.goodsCommonsInfo.push(item)
					}
					if (newVal[0].categoryName !== item.categoryName) state.categorySame = false // 若有一项品类不相同则为false
				})
			}, { deep: true })

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

      let handleCommand = ({ handle, params }) => {
        handle(params)
      }
      getDepartmentList().then(res => {
        state.deptList = res.data
      })
			onActivated(() => {
        let { categoryId, isRefresh, combineType, enableCustom, timeType, start_end, isIndex } = route.params
        if (isIndex == 1) hooks.resetForm(6, false)
				if (categoryId !== undefined && categoryId !== null) {
					state.form.categoryId = parseInt(route.params.categoryId)
				}
				if (isRefresh == 'true') state.form.page.pageNo = 1
        console.log(route.params)
        if (combineType) state.form.combineType = parseInt(combineType)
        if (enableCustom) state.form.enableCustom = parseInt(enableCustom)
        if (timeType) state.form.timeType = parseInt(timeType)
        if (start_end) state.form.start_end = orderIndexParmas[parseInt(start_end)]
				hooks.getGoodsNum(1)
				hooks.getRemarkTypes()
				hooks.getCategoryEvent().then(() => {
          hooks.searchEvent()
        })
			})
      function deptChange(ids){
       state.form.deptIds = deptIdsRef.value.getCheckedNodes().map(v=>{
        return v.data.deptId
       })
       console.log(state.form.deptIds,'state.form.deptIds');
      }
			return {
				...toRefs(state),
				tableRef,
				formRef,
        deptIdsRef,
				remarkText,
				sourceData,
				authTypeOptions,
				tortStatusOptions,
				enableCustomOptions,
				goodsAttrOptions,
				timeTypeOptions,
				searchType,
				categoryProps,
				combinationOptions,
				...handle,
				...hooks,
				...tableHandle,
        handleCommand,
        deptChange
			}
		}
	}
</script>

<style lang="scss" scoped>
.deptClass{
  ::v-deep(.el-cascader__search-input) {
    margin-left: 10px;
  }
}
	.btn {
		width: 87px;
		height: 70px;
	}
	.pageView {
		margin-top: 15px;
		.header {
			display: flex;
			align-items: center;
		}
		:deep(.vxe-header--column) {
			position: relative;
			.el-checkbox {
				position: absolute;
				left: 10px;
			}
		}
		.flexLeft {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
		.goodsInfo {
			display: flex;
			padding: 16px;
			.right {
				flex: 1;
				overflow: hidden;
				margin-left: 16px;
				text-align: left;
				.goodsName {
					margin-bottom: 10px;
					color: #000;
				}
				.tagBox {
					display: flex;
					flex-wrap: wrap;
					max-height: 62px;
					overflow: hidden;
					.el-tag {
						margin-right: 8px;
						margin-bottom: 8px;
					}
				}
			}
		}
		.goodsSpu {
			padding: 16px;
			color: #000;
		}
		.remarkLabel {
			padding: 0px 5px;
			border-radius: 4px;
			margin-left: 10px;
			color: #fff;
		}
	}
	.padding16 {
		padding: 0 16px;
	}
	.operationView {
		margin-top: 16px;
		.sortText {
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
		flex: 1;
		justify-content: space-between;
		height: 32px;
		.left {
			.el-button {
				margin-left: 0;
			}
		}
	}
	.el-dropdown-link {
		cursor: pointer;
	}
	.el-icon-arrow-down {
		font-size: 12px;
	}
	.paginationBox {
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
		.el-pagination {
			margin-top: 8px;
		}
	}
	:deep(.sortForm .el-form-item__label) {
		font-size: 14px;
	}
</style>
