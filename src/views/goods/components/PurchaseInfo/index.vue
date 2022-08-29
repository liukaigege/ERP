<template>
<div>
  <!-- 采购报价和物流报价页面需要显示基本信息模块 -->
  <base-info :goodsStatus="goodsStatus" v-if="isQuote" :isPurchaseQuote="isPurchaseQuote"  :quoteForm="quoteForm" :showApplyUser="isPurchaseQuote" :goods="goods"></base-info>
  <el-card :class="isQuote ? 'none-border-card mt-20' : 'none-border-card'" shadow="never">
    <template #header>
      <div class="pq-card-header">
        <div class="pq-card-title">采购报价</div>
      </div>
    </template>
    <div class="pq-card-body">
      <!-- 已报价页面显示采购报价人信息 -->
      <div v-if="isSetPriceDetail || (!isQuote && !isSetPriceDetail)" style="display: flex; align-items: center; margin-bottom: 10px">
        <div>采购报价人：{{userInfo.purchaseUser}}</div>
        <div class="ml-20">首次报价时间：{{userInfo.firstPurchaseTime}}</div>
        <div class="ml-20">采购报价时间：{{userInfo.purchaseTime}}</div>
        <template v-if="!isEdit">
          <div class="ml-20">报价备注：</div>
          <el-tooltip effect="dark" content="" placement="top" v-if="quoteForm.remark">
            <template #content>
              <div>{{quoteForm.remark}}</div>
            </template>
            <div class="textOverflow text-overflow-remark">{{quoteForm.remark}}</div>
          </el-tooltip>
          <div v-else>无</div>
        </template>
        <template v-else>
          <div class="ml-20">采购报价备注：</div>
          <el-input class="quote-footer-input" maxlength="500" v-model="quoteForm.remark"></el-input>
        </template>
      </div>
      <!-- 已报价页面-定制品显示sku唯一id和商品配对信息 -->
      <div v-if="false" style="display: flex; align-items: center; margin-bottom: 10px">
        <div>SKU唯一ID：{{goods.skuId}}</div>
        <div class="ml-20">
          <span>商品配对：</span>
          <el-button v-if="!isEdit" type="text" @click="openPairDialog(goods, 'see')">查看</el-button>
          <el-button v-else type="text" @click="openPairDialog(goods, 'modify')">修改</el-button>
        </div>
      </div>
      <el-form :model="quoteForm">
        <el-form-item label="商品形式:" prop="combineType" v-if="enableCustom !== 1 && !isPurchaseQuote">
          <!-- 针对新增组合品报价 ｜ 1: 更改品类 2：申请新规格 3：开启并申请报价 的商品不可更改商品形式 -->
          <el-radio-group class="more-clear-disabled" :disabled="!isEdit || combineTypeDisabled" v-model="quoteForm.combineType">
            <el-radio :label="1">单品</el-radio>
            <el-radio :label="2">组合品</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="flex-div">
          <el-form-item label="货源渠道" required></el-form-item>
          <el-select :disabled="!isEdit" v-model="quoteForm.channelId" class="w-140 more-clear-disabled">
            <el-option v-for="path in pathOptions" :key="path.id" :label="path.name" :value="path.id">
            </el-option>
          </el-select>
          <special-info :disabled="!isEdit" class="ml-20" :info="specialInfo"></special-info>
        </div>
        <!-- 编辑时才显示批量填充和快选操作 -->
        <template v-if="isEdit">
          <!-- 采购报价页面批量填充组件默认全部勾选 -->
          <batch-input :showRemark="enableCustom == 1" :defaultSelect="isPurchaseQuote" class="mt-10"  @submitBatch="submitBatch"></batch-input>
          <el-form-item v-for="spe in spes" :key="spe.id" class="mt-10" :label="`${spe.nameCn || spe.nameEn}:`">
            <div @click="selectTag(speValue)" :class="speValue.checked ? 'spe-value-tag active' : 'spe-value-tag'" v-for="speValue in spe.speValues" :key="speValue.id">{{speValue.nameCn || speValue.nameEn}}</div>
          </el-form-item>
        </template>
      </el-form>
      <div class="flex-div mt-10" style="justify-content: space-between">
        <el-checkbox :disabled="!isEdit || codeValDisabled" v-model="showCodeVal" @change="changeCodeType">添加国码</el-checkbox>
        <!-- 采购报价页面显示批量设置开关按钮 -->
        <el-button v-if="isPurchaseQuote" :disabled="!isEdit" type="primary" @click="batchSetSwitch('open')">批量设置开关</el-button>
      </div>
      <!-- 定制品 -->
      <vxe-table class="mt-10" :scroll-y="{enabled: false}" :edit-rules="editRules" align="center" border :data="skus" :edit-config="editConfig" ref="tableRef">
       <template v-if="true">
        <vxe-column field="url" :title="isQuote ? '图片' : '商品SKU'" :width="isQuote ? 120 : 260">
          <template #header>
            <div style="display: flex; align-items: center">
              <el-checkbox v-if="isEdit" v-model="selectAll" :indeterminate="Boolean(!selectAll&&getSelectCount())" @change="tableSelectAll"></el-checkbox>
              <span class="ml-10">{{ isQuote ? '图片' : '商品SKU' }}</span>
            </div>
          </template>
          <template #default="{ row }">
            <div style="display: flex; align-items: center; padding: 10px 0">
              <el-checkbox v-if="isEdit" v-model="row.checked" @change="tableSelectRow"></el-checkbox>
              <template v-if="isQuote">
                <el-popover v-if="row.url" placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="row.url" fit="contain"></el-image>
                  <template #reference>
                    <el-image class="ml-10" style="width: 70px; height: 70px" :src="row.url" fit="contain"></el-image>
                  </template>
                </el-popover>
                <div v-if="row.isAdd === 1" class="new-sku-tag">新</div>
              </template>
              <template v-else>
                <div class="ml-10" style="text-align: left">
                  <div>{{row.skuId}}</div>
                  <div>{{row.sku}}</div>
                </div>
              </template>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="speLabel" title="规格值"></vxe-column>
        <!-- 采购报价物流报价页面显示预估售价 -->
        <vxe-column field="expectPrice" title="预估售价（USD）" width="90" v-if="isQuote"> </vxe-column>
        <vxe-column title="SKU开关">
          <template #header>
            <span>SKU开关</span>
            <!-- 物流报价和采购报价页面才显示sku开关的解释 -->
            <el-tooltip v-if="isQuote" effect="dark" content="针对暂时采购不到的商品SKU可进行关闭，关闭后仍可继续报价并保留报价信息" placement="top">
              <i style="font-size: 14px" class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <!-- 物流报价和采购报价页面才显示开关按钮 -->
            <el-switch v-if="isQuote" :disabled="!isEdit || row.puhStatch === 1" :active-value="1" :inactive-value="0" v-model="row.skuSwitch"></el-switch>
            <span v-else>{{ row.skuSwitch === 1 ? '开启' : '关闭' }}</span>
          </template>
        </vxe-column>
        <!-- 物流报价和采购报价页面才显示报价开关 -->
        <vxe-column title="报价开关" v-if="isQuote">
          <template #header>
            <span>报价开关</span>
            <el-tooltip effect="dark" content="针对不符合报价要求的商品SKU可拒绝报价，关闭后报价信息可不填" placement="top">
              <i style="font-size: 14px" class="el-icon-question"></i>
            </el-tooltip>
          </template>
          <template #default="{ row }">
            <el-switch :disabled="!isEdit || row.puhStatch === 1" @change="changePuhSwitch(row)" :active-value="1" :inactive-value="0" v-model="row.puhSwitch"></el-switch>
          </template>
        </vxe-column>
        <!-- 搁置中页面显示错码列数据 -->
        <vxe-column field="codeVal" width="240" v-if="!isQuote && !isSetPriceDetail && showCodeVal">
          <template #header>{{quoteForm.codeType}}</template>
        </vxe-column>
        <!-- 采购报价物流报价已报价页面显示错码列数据 -->
        <vxe-column width="240" v-if="showCodeVal && (isQuote || isSetPriceDetail)">
          <template #header>
            <div style="display: flex; align-items: center">
              <el-select :disabled="!isEdit" v-model="quoteForm.codeType" size="small" class="w-90" @change="codeValChange">
                <el-option label="服装" value="服装"></el-option>
                <el-option label="鞋子" value="鞋子"></el-option>
              </el-select>
              <el-button :disabled="!isEdit" class="ml-10" type="text" @click="setSkusCodeStyle('select')">选择</el-button>
              <el-button :disabled="!isEdit" type="text" @click="setSkusCodeStyle('input')">填写</el-button>
            </div>
          </template>
          <template #default="{ row }">
            <div class="flex-div">
              <el-select :disabled="!isEdit" v-model="row.codeVal" v-if="row.codeStyle === 'select'">
                <el-option v-for="(opt, index) in quoteForm.codeType=='服装'?codeOptions[1]:codeOptions[2]" :key="index" :label="opt.label" :value="opt.value"></el-option>
              </el-select>
              <el-input :disabled="!isEdit" v-if="row.codeStyle === 'input'" type="text" :maxlength="20" v-model="row.codeVal"></el-input>
              <template v-if="row.codeStyle && spes.length">
                <el-dropdown trigger="click" :disabled="!row.codeVal || !isEdit" placement="bottom">
                  <el-button type="text" :disabled="!row.codeVal || !isEdit">批量填充</el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="batchInputSpe(spe.id, row)" v-for="spe in spes" :key="spe.id">同{{ spe.nameCn || spe.nameEn }}</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="weight" title="重量（g）" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 99999.99,controls: false}}">
        </vxe-column>
        <vxe-colgroup title="商品体积">
          <vxe-column field="length" title="长（cm）" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 999.99,controls: false}}">
          </vxe-column>
          <vxe-column field="width" title="宽（cm）" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 999.99,controls: false}}"></vxe-column>
          <vxe-column field="height" title="高（cm）" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 999.99,controls: false}}"></vxe-column>
        </vxe-colgroup>
        <vxe-column field="price" title="默认采购价（CNY）" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 9999999.99,controls: false}}"></vxe-column>
        <vxe-column field="purchaseBy" title="采购员">
          <template #default="{ row }">
            <el-button :disabled="!isEdit" @click="openPurchaseUserDialog(row.skuId)" type="text">{{!row.purchaseBy ? '未设置' : row.purchaseByUser}}</el-button>
          </template>
        </vxe-column>
        <vxe-column v-if="enableCustomSwitch" :field="isPurchaseQuote?'enableCustomImage':'alreadyOfferEnableCustomImage'" title="定制图片" width="80">
          <template #default="{row}">
            <el-switch v-model="row.enableCustomImage" :disabled="!isEdit" inline-prompt :active-value="1" :inactive-value="0">
            </el-switch>
          </template>
        </vxe-column>
        <vxe-column :visible="enableCustomSwitch"  :field="isPurchaseQuote?'enableCustomText':'alreadyOfferEnableCustomText'" title="定制文本" width="80">
          <template #default="{row}">
            <el-switch v-model="row.enableCustomText" :disabled="!isEdit" inline-prompt :active-value="1" :inactive-value="0">
            </el-switch>
          </template>
        </vxe-column>
        <vxe-column :visible="isEdit" field="purchaseLink" title="采购链接" :edit-render="{name: '$input',props: {type: 'text', clearable: true, maxlength: 300}}"></vxe-column>
        <vxe-column :visible="!isEdit" field="purchaseLink" title="采购链接">
          <template #default="{ row }">
            <a v-if="row.purchaseLink" :href="row.purchaseLink" target="_blank">查看链接</a>
          </template>
        </vxe-column>
        <vxe-column :visible="isEdit" field="purchaseRemark" title="备注" :edit-render="{name: '$input',props: {type: 'text', clearable: true, maxlength: 500}}"></vxe-column>
        <vxe-column :visible="!isEdit" field="purchaseRemark" title="备注">
          <template #default="{ row }">
            <el-popover v-if="row.purchaseRemark" placement="left" title="备注内容" :width="200" trigger="click" :content="row.purchaseRemark">
              <template #reference>
                <el-button type="text">查看</el-button>
              </template>
            </el-popover>
          </template>
        </vxe-column>
        </template>
        <template v-if="true">
          <!-- 已报价页面显示配对信息列 -->
          <vxe-column title="商品配对" width="80" v-if="isSetPriceDetail">
            <template #default="{ row }">
              <el-button v-if="!isEdit" type="text" @click="openPairDialog(row, 'see')">查看</el-button>
              <el-button v-else type="text" @click="openPairDialog(row, 'modify')">修改</el-button>
            </template>
          </vxe-column>
          <vxe-column width="200" title="已关联商品" v-if="isSetPriceDetail && quoteForm.combineType === 2">
            <template #default="{ row }">
              <el-popover placement="left" width="auto" trigger="hover">
                <template #reference>
                  <div>
                    <div :class="idx > 0 ? 'mt-5 textOverflow' : 'textOverflow'" v-for="(str, idx) in row.combinationLabels" :key="idx">{{str}}</div>
                  </div>
                </template>
                <div :class="idx > 0 ? 'mt-5' : ''" v-for="(str, idx) in row.combinationLabels" :key="idx">{{str}}</div>
              </el-popover>
            </template>
          </vxe-column>
          <vxe-column title="组合商品" width="80" v-if="(isPurchaseQuote || isSetPriceDetail) && quoteForm.combineType === 2">
            <template #default="{ row }">
              <div v-if="row.goodsSkuCombinationRelation && row.goodsSkuCombinationRelation.length">
                <el-button v-if="!isEdit || isPurchaseQuote" @click="showRelations({
                  way: 'detail',
                  mainGoodsId: goods.goodsId,
                  mainSkuIds: [row.skuId],
                  childGoodsIdList: [],
                  goodsSkuCombinationRelation: row.goodsSkuCombinationRelation
                }, row)" type="text">查看</el-button>
                <el-button @click="showRelations({
                  way: 'edit',
                  mainGoodsId: goods.goodsId,
                  mainSkuIds: [row.skuId],
                  childGoodsIdList: [],
                  goodsSkuCombinationRelation: row.goodsSkuCombinationRelation
                }, row)" v-else type="text">修改</el-button>
              </div>
            </template>
          </vxe-column>
        </template>
      </vxe-table>
    </div>
  </el-card>
  <QuotationProducts :isQuote="isQuote" :isEdit="isEdit" :isPurchaseQuote="isPurchaseQuote" :offerFittingSwitch="offerFittingSwitch" :enableContainFitting="enableContainFitting" :goodsCustomFittingList="goodsCustomFittingList" v-if="enableCustom == 1" ref="quotationProductsRef" />
  <return-dialog batchType="single" v-if="returnDialogVisible" :selections="[quoteForm.goodsId]" reasonType="purchase" @close="closeReturnDialog"></return-dialog>
  <pair-dialog :data="pairData" v-if="showPairDialog" @close="closePairDialog"></pair-dialog>
  <switch-dialog v-if="showSwitchDialog" @close="batchSetSwitch" :showPubSku="true" :showCustomized="enableCustomSwitch"
 ></switch-dialog>
  <!-- 关联商品信息 -->
  <full-relation-dialog @showRelations="showRelations" @close="closeFullRelationDialog" v-if="showFullRelationDialog" :skus="skus" :specialInfo="specialInfo" :form="quoteForm"></full-relation-dialog>
  <relation-dialog :info="relationInfo" @close="closeRelationDialog" v-if="showRelationDialog"></relation-dialog>
  <purchase-user-dialog v-if="showPurchaseUserDialog" @close="closePurchaseUserDialog"></purchase-user-dialog>
  <!-- 采购报价页面显示采购报价备注编辑 -->
  <erp-footer v-if="isEdit && isPurchaseQuote">
    <div class="quote-footer">
      <span>采购报价备注：</span>
      <el-input class="quote-footer-input" maxlength="500" v-model="quoteForm.remark"></el-input>
      <el-button @click="goBack">取消</el-button>
      <el-button v-if="operateStatus === 0" type="primary" @click="returnDialogVisible = true">拒绝报价</el-button>
      <el-button type="primary" @click="submit(1)">提交报价</el-button>
    </div>
  </erp-footer>
</div>
</template>

<script>
import { reactive, toRefs, nextTick, watch, onActivated, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseInfo from './components/BaseInfo.vue'
import BatchInput from './components/BatchInput.vue'
import SpecialInfo from './components/SpecialInfo.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import ReturnDialog from './components/ReturnDialog.vue'
import { codeOptions } from '@/assets/js/staticData'
import { getPathOptions, getPurchaseInfo, quotePurchase, validateGoodsStatus } from '@/api/goods/quotation.js'
import { handleAttr } from "@/views/goods/goodsManagement/quotation/composables/handle"
import { ElMessage, ElMessageBox } from 'element-plus'
import { editRules } from '../../goodsManagement/quotation/components/composables/static.js'
import PairDialog from './components/PairDialog.vue'
import { storage } from '@/utils/storage.js'
import { assignTool } from 'tool'
import SwitchDialog from './components/SwitchDialog.vue'
import FullRelationDialog from './components/FullRelationDialog.vue'
import RelationDialog from '@/views/components/RelationDialog.vue'
import PurchaseUserDialog from './components/PurchaseUserDialog.vue'
import QuotationProducts from './components/QuotationProducts.vue'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['isChange'],
  components: { BaseInfo, BatchInput, SpecialInfo, ErpFooter, ReturnDialog, PairDialog, SwitchDialog, FullRelationDialog, RelationDialog, PurchaseUserDialog, QuotationProducts },
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      goods: {
        collectionUrl: null,
        referenceUrls: null,
        expectPrice: null,
        costPrice: null,
        goodsName: null,
        goodsId: null,
        skuId: null,
        mainImageUrl: null,
        speLabel: null,
        sku: null,
        mode: null,
        applyUser: null,
        categoryId: null,
        enableCustom: null
      },
      quoteForm: {
        id: null,
        attr: '',
        goodsId: null,
        combineType: null,
        channelId: null,
        codeType: null,
        remark: null
      },
      enableCustom: null, // 0普通 1是定制品
      operateStatus: null, // 操作状态： 0: 正常 1: 更改品类 2：申请新规格 3：开启并申请报价
      goodsStatus: 2, // 商品状态 0待激活 -1激活失败 1未报价 2待采购报价 3采购打回 4待物流报价 5物流打回 6已报价
      userInfo: { // 采购报价人信息
        purchaseUser: null,
        purchaseTime: null,
        applyUser: null,
        firstPurchaseTime: null
      },
      showCodeVal: false, // 是否显示错码列
      codeValDisabled: false, // 错码列是否禁止删除
      selectAll: false, // 是否全选sku
      pathOptions: [],
      specialInfo: {
        electronic: null, // 含电
        electronicType: null, // 内电 / 纯电
        noLiquid: null, // 非液体化妆品
        liquid: null, // 液体
        paste: null, // 膏体
        plant: null, // 植物
        special: null, // 特货
        magnet: null, // 带磁
        powder: null, // 含粉末
        wood: null // 木质
      },
      spes: [], // 普通商品spes
      skus: [], // 普通商品skus
      tableRef: null,
      returnDialogVisible: false,
      isChange: false,
      editRules,
      pairData: null,
      showPairDialog: false,
      showSwitchDialog: false,
      isQuote: route.name.indexOf('Quote') !== -1, // 是否在报价页面 采购报价 ｜ 物流报价
      isSetPriceDetail: route.name === 'setPriceDetail', // 是否在已报价页面
      isPurchaseQuote: route.name === 'PurchaseQuote', // 是否在采购报价页面
      showFullRelationDialog: false,
      showRelationDialog: false,
      relationInfo: {
        childGoodsIdList: [],
        mainGoodsId: '',
        mainSkuId: '',
        way: '',
        goodsSkuCombinationRelation: []
      },
      combineTypeDisabled: false,
      showPurchaseUserDialog: false,
      purchaseDialogSign: null, // skuId
      quotationProductsRef: null,
      goodsCustomFittingList: [],
      goodsCustomTypeList: [],
      enableContainFitting: null,
      skuType: null,
      enableCustomSwitch:false,
      offerFittingSwitch:0,
    })

    let isInit = true
    // 监听数据是否改变
    watch(() => state.skus, _ => {
      watchChange()
    }, { deep: true })

    watch(() => state.quoteForm, _ => {
      watchChange()
    }, { deep: true })

    console.log(state.isQuote);

    const editConfig = {
      trigger: 'click',
      mode: 'cell',
      activeMethod({ row, column }) {
        if (column.property === 'purchaseRemark') {
          return true
        }
        if (state.enableCustom === 1) {
          const bool1 = state.isPurchaseQuote && row.puhSwitch === 1 && row.puhStatch !== 1 // 采购报价需满足
          const bool2 = state.isSetPriceDetail // 已报价 报价开关关闭的数据已被过滤 只用判断是在已报价页面
          const bool = bool1 || bool2
          return bool
        }
        return true
      },
      enabled: props.isEdit
    }

    watch(() => props.isEdit, () => {
      editConfig.enabled = props.isEdit
      nextTick(_ => {
        state.tableRef.refreshColumn()
      })
    })

    function watchChange() {
      if (!isInit) {
        state.isChange = true
        ctx.emit('isChange', true)
      } else {
        state.isChange = false
      }
    }

    function closeReturnDialog(flag) {
      state.returnDialogVisible = false
      if (flag) {
        router.push({ name: 'Quotation' })
      }
    }

    getPathOptions().then(r => {
      state.pathOptions = r.data ?.dataList
    })

    onActivated(() => {
      if (route.params.update) {
        initData()
      }
    })
    onMounted(()=>{
        initData()
    })
    function initData(id=null) {
      isInit = true
      let goodsId = id || route.query ?.id
      getPurchaseInfo({
        goodsId
      }).then(res => {
        let pageData = res.data
        state.goodsCustomFittingList = pageData.goodsCustomFittingList || []
        state.enableCustom =  state.isPurchaseQuote?pageData.enableCustom:pageData.alreadyOfferEnableCustom
        state.enableCustomSwitch = state.enableCustom?true:false
        state.goodsCustomTypeList = pageData.goodsCustomTypeList||[]
        state.enableContainFitting = Number(pageData.enableContainFitting)
        state.offerFittingSwitch = pageData.offerFittingSwitch == null && state.enableContainFitting == 1 ? 1 : Number(pageData.offerFittingSwitch)
        // 类型
        state.skuType = pageData.skuType
        // 操作状态
        state.operateStatus = pageData.operateStatus
        // 商品状态
        state.goodsStatus = pageData.status
        // 采购报价人信息
        state.userInfo = assignTool(state.userInfo, pageData)
        // 基本信息
        state.goods = assignTool(state.goods, pageData, [], {
          goodsName: pageData.goodsName || pageData.goodsNameEn,
          speLabel: '-',
          enableCustom: state.enableCustom
        })
        // 货源渠道
        state.quoteForm = assignTool(state.quoteForm, pageData)
        // 特殊属性
        state.specialInfo = Object.assign(state.specialInfo, handleAttr(pageData.attr))
        // 普通商品数据处理
        if (pageData.commons) {
          // 规格数据
          state.spes = pageData.commons.spes || []
          state.spes.map(spe => {
            spe.speValues?.map(speValue => {
              speValue.checked = true
            })
          })
          // sku数据
          state.skus = pageData.commons.skus || []
          // 非正常报价流程的过滤数据，只保留报价开关打开状态的sku
          if (state.operateStatus !== 0) {
            state.skus = state.skus.filter(sku => sku.isAdd === 1 || (sku.puhSwitch === 1 && sku.lgtSwitch === 1))
          }
          if (state.isSetPriceDetail) { // 已报价 过滤掉未报价的数据
            state.skus = state.skus.filter(sku => sku.puhStatch === 1 && sku.lgtStatch === 1)
          }
          // 数据处理
          let count = 0
          state.skus.map(sku => {
            // 页面属性带过去
            sku.isSetPriceDetail = state.isSetPriceDetail
            // 设置sku是否选中
            sku.checked = true
            // 设置sku codeStyle默认值
            sku.codeStyle = !sku.codeVal ? '' : 'input'
            if (!sku.codeVal) count++
            sku.speLabel = sku.speValues?.sort((a, b) => a.speId - b.speId).map(spe => spe.nameCn || spe.nameEn).join('-') || '-'
            // 组合品做个判断默认采购价为空且有关联关系时 通过关联关系计算一个默认采购价填上
            if (state.quoteForm.combineType === 2) {
              if (!sku.price && sku.goodsSkuCombinationRelation && sku.goodsSkuCombinationRelation.length) {
                sku.price = 0
                sku.goodsSkuCombinationRelation.forEach(g => sku.price += (g.coef * g.purchasePrice))
              }
              // 组合品且有关联关系时 列表显示已关联商品信息
              if (sku.goodsSkuCombinationRelation && sku.goodsSkuCombinationRelation.length) {
                sku.combinationLabels = []
                sku.goodsSkuCombinationRelation.forEach(co => {
                  // 拼接 商品编码 规格值 系数
                  sku.combinationLabels.push(`${co.goodsId} ${co.goodsSpeValList?.map(s => s.nameCn || s.nameEn).join('-') || ''}*${co.coef}`)
                })
              }
            }
          })
          // sku排序，带有新标识的排在前面 按照spe的顺序进行排序
          if (state.skus.length && state.isPurchaseQuote && state.spes.length) {
                let speList = []
                state.spes.forEach(spe=>speList.push(spe.speValues?.map(v=>v.nameCn||v.nameEn)))
                speList.forEach((item,index)=>{
                  speList[index] = Array.from(new Set(item))
                })
                let speSort = [].concat(speList[0])
                for(let i = 1;i<speList.length;i++){
                  speSort = speSort.map(item=>speList[i]?.map(val=>item+'-'+val)).flat()
                }
                const skusSort = state.skus.filter(item=>item.isAdd == 1)
                const noAddSku = state.skus.filter(item=>item.isAdd == 0)
                speSort.forEach(spe=>{
                  noAddSku.forEach(item=>{
                    if(compare(item.speLabel,spe)) 	skusSort.push(item)
                  })
                })
                state.skus = skusSort
          }
					function compare(speLabel,spe) {
						return speLabel.split('-').sort().join(',') ==  spe.split('-').sort().join(',')
					}
          // 是否显示错码列
          console.log(count,state.skus.length);
          state.showCodeVal = count !== state.skus.length
          // 申请新规格报价和开启并申请报价时错码列如果有不可移除 已报价中又可以移除
          if (state.isPurchaseQuote && state.showCodeVal && state.operateStatus > 1) {
            state.codeValDisabled = true
          }
          // 组合品有关联关系的 ｜ 单品被其他组合品关联的 不能修改商品形式 非0的operateStatus 不可修改商品形式
          state.combineTypeDisabled = (state.operateStatus > 0) || (state.quoteForm.combineType === 2 && state.skus.some(s => !!s.goodsSkuCombinationRelation)) || (state.quoteForm.combineType === 1 && pageData.relationCombinationCount > 0)
        }
        // 定制品数据

        // 初次进入默认全选
        const length = state.skus.length
        state.selectAll = length > 0 && true
        // 设置老数据
        storage.set('OLD_PURCHASE_DATA', {
          attr: pageData.attr,
          skus: state.skus,
        })
        nextTick(_ => {
          isInit = false
        })
      })
    }

    // 选择规格tag
    function selectTag(current) {

      const checked = current.checked
      current.checked = !checked
      // 选中的规格值id集合
      let selectSpeValueIds = {}
      state.spes.forEach(spe => {
        spe.speValues.forEach(sp => {
          if (sp.checked) {
            if (selectSpeValueIds[sp.speId]) {
              selectSpeValueIds[sp.speId].add(sp.id)
            } else {
              selectSpeValueIds[sp.speId] = new Set([sp.id])
            }
          }
        })
      })
      state.skus.forEach(sku => {
        let curSpes = {}
        sku.speValues.forEach(spe => {
          curSpes[spe.speId] = spe.id
        })
        const bool = Object.keys(selectSpeValueIds).every(key => selectSpeValueIds[key].has(curSpes[key]))
        // 当selectSpeValueIds为{} 时 every 返回的是true
        sku.checked = Object.keys(selectSpeValueIds).length > 0 && bool
        tableSelectRow()
      })
    }

    // sku选择单行
    function tableSelectRow() {
      const key = 'skus'
      state.selectAll = state[key].length !== 0 && getSelectCount() === state[key].length
    }

    // sku全选
    function tableSelectAll(checked) {
      const key = 'skus'
      state[key].map(item => {
        item.checked = checked
      })
      state.selectAll = state[key].length !== 0 && getSelectCount() === state[key].length
    }

    // 获取选中的sku数量
    function getSelectCount() {
      const key = 'skus'
      let count = 0
      state[key].map(item => {
        if (item.checked) count++
      })
      return count
    }

    // 添加或移除错码列
    function changeCodeType(checked) {
      state.showCodeVal = checked
      nextTick(_ => {
        state.tableRef.refreshColumn()
      })
    }

    // 设置错码输入类型
    function setSkusCodeStyle(type) {
      state.skus.map(sku => sku.codeStyle = type)
    }

    // 批量填充错码列
    function batchInputSpe(id, row) {
      state.skus.map(sku => {
        sku.speValues.map(spe => {
          const arr = row.speLabel.split('-')
          const name = spe.nameCn || spe.nameEn
          if (spe.speId === id && arr.indexOf(name) !== -1) {
            sku.codeVal = row.codeVal
          }
        })
      })
    }

    // 批量填充
    function submitBatch(data) {
      const key = 'skus'
      if (!getSelectCount()) {
        ElMessage.error({ message: '请先勾选' })
        return false
      }
      state[key].map(item => {
        if (key === 'skus') {
          const bool1 = state.isPurchaseQuote && item.puhSwitch === 1 && item.puhStatch !== 1 // 采购报价需满足
          const bool2 = state.isSetPriceDetail // 已报价 报价开关关闭的数据已被过滤 只用判断是在已报价页面
          const bool = bool1 || bool2
          if (item.checked && bool) {
            Object.assign(item, data)
          }
          // 报价备注在任何情况下，只要是勾选上的都可以填充
          if (item.checked && data.purchaseRemark) {
            Object.assign(item, { purchaseRemark: data.purchaseRemark })
          }
        } else {
          if (item.checked) {
            Object.assign(item, data)
          }
        }
      })
    }

    function changePuhSwitch(row) {
      if (row.puhSwitch === 0) {
        row.skuSwitch = 0
      }
    }

    // 返回
    async function goBack() {
      const response = await validateGoodsStatus({
        type: 1,
        goodsIdList: [route.query ?.id]
      })
      if (state.isPurchaseQuote && !response ?.data ?.result) {
        ElMessageBox.confirm('该商品已被其他用户已完成采购报价流程！', '提示', {
          confirmButtonText: '确认并退出',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showCancelButton: false,
          showClose: false
        }).then(_ => {
          router.push({ name: 'Quotation' })
        })
        return false
      }
      if (state.isChange) {
        ElMessageBox.alert('确认终止当前报价流程？', '提示', {
          cancelButtonText: '退出',
          confirmButtonText: '保存并退出',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showCancelButton: true,
          distinguishCancelAndClose: true,
          callback: action => {
            if (action === 'confirm') {
              // 保存并退出
              submit(0, false).then(_ => {
                router.push({ name: 'Quotation' })
              })
            } else if (action === 'cancel') {
              // 退出
              router.push({ name: 'Quotation' })
            }
          }
        })
      } else {
        router.push({ name: 'Quotation' })
      }
    }

    // 提交或保存报价信息
    async function submit(type, needValidate = true) {
      const response = await validateGoodsStatus({
        type: 1,
        goodsIdList: [route.query ?.id]
      })
      if (state.isPurchaseQuote && !response ?.data ?.result) {
        ElMessageBox.confirm('该商品已被其他用户已完成采购报价流程！', '提示', {
          confirmButtonText: '确认并退出',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showCancelButton: false,
          showClose: false
        }).then(_ => {
          router.push({ name: 'Quotation' })
        })
        return Promise.reject()
      }
      if (type === 1) {
        return validateHandle(type).then(_ => {
          ElMessage.success({ message: '提交报价成功' })
          router.push({ name: 'Quotation' })
        }).catch(_ => Promise.reject())
      } else {
        if (needValidate) {
          return validateHandle(type).then(_ => {
            initData()
          }).catch(_ => Promise.reject())
        } else {
          return handle(type).then(_ => {
            initData()
          }).catch(_ => Promise.reject())
        }
      }
    }

    function validateHandle(type) {
      if (!state.quoteForm.channelId) {
        ElMessage.error({ message: '请选择货源渠道' })
        return Promise.reject()
      }
      // 普通商品的额外校验
      if (state.enableCustom === 1) {
        if (state.quoteForm.combineType === null) {
          ElMessage.error({ message: '请选择商品形式' })
          return Promise.reject()
        }
        // 所有报价开关都已经关闭
        if (state.skus.findIndex(sku => sku.puhSwitch === 1) === -1) {
          if (state.operateStatus === 0) {
            ElMessage.error({ message: '当前商品报价状态已被全部关闭，默认为拒绝报价，请执行【拒绝报价】操作' })
            return Promise.reject()
          }
          if (state.operateStatus === 1) {
            ElMessage.error({ message: '【变更品类申请报价】的商品至少开启一个商品SKU报价开关' })
            return Promise.reject()
          }
        }
      }

      return new Promise((resolve, reject) => {
        state.tableRef.validate(true, r => {
          if (r) {
            reject(false)
            ElMessage.warning({ message: '数据校验失败，请检查填写后重新提交' })
          } else {
            if (type === 1) {
              ElMessageBox.confirm('确认提交采购报价?', '提示', {
                closeOnClickModal: false,
                closeOnPressEscape: false,
                showClose: false
              }).then(_ => {
                handle(type).then(_ => resolve(true)).catch(_ => reject(false))
              }).catch(_ => reject(false))
            } else {
              handle(type).then(_ => {
                ElMessage.success({ message: '保存完成' })
                resolve(true)
              }).catch(_ => reject(false))
            }
          }
        })
      })

    }

    function handle(type) {
      const form = JSON.parse(JSON.stringify(state.quoteForm))
      form.type = type
      // 处理特殊属性
      const keys = Object.keys(state.specialInfo)
      let arr = []
      keys.map((key, index) => {
        if (state.specialInfo[key] && state.specialInfo[key] !== 'empty' && key !== 'electronic') {
          arr.push(state.specialInfo[key])
        }
      })
      form.attr = arr.length ? arr.join(',') : ''
      form.skus = JSON.parse(JSON.stringify(state.skus))
      const usefulKeys = ['skuId', 'skuSwitch', 'puhSwitch', 'enableCustomImage', 'enableCustomText', 'weight', 'length', 'width', 'height', 'price', 'codeVal', 'id', 'sku', 'originalPrice', 'purchaseLink', 'purchaseRemark', 'purchaseBy', 'purchaseByUser']
      const insertKeys = ['weight', 'length', 'width', 'height', 'price', 'codeVal', 'purchaseLink']
      form.skus.map(sku => {
        sku.codeVal = state.showCodeVal ? sku.codeVal : null
        Object.keys(sku).map(key => {
          if (insertKeys.indexOf(key) !== -1) {
            sku[key] = sku.puhSwitch === 1 ? sku[key] : null
          }
          if (usefulKeys.indexOf(key) === -1) {
            delete sku[key]
          }
        })
      })
      // 已报价修改信息时的额外判断
      let canContinue = true
      if (type === 2) {
        const oldData = storage.get('OLD_PURCHASE_DATA')
        const key = 'skus'
        if (form.attr !== '' && form.attr !== oldData.attr) {
          canContinue = false
          form.skus.map(sku => sku.flag = 1)
        } else {
          // 比对数据 长、宽、高、重量变化时
          if (form[key].length !== oldData[key].length) {
            canContinue = false
          }
          const keyArr = ['weight', 'length', 'width', 'height']
          const index = form[key].findIndex((obj, idx) => {
            const pair = oldData[key][idx]
            return keyArr.findIndex(k => obj[k] !== pair[k]) !== -1
          })
          if (index !== -1) {
            canContinue = false
            form[key].map((o, i) => {
              const p = oldData[key][i]
              if (keyArr.findIndex(k => o[k] !== p[k]) !== -1) {
                form[key][i].flag = 1
              }
            })
          }
        }
      }
      return new Promise((resolve, reject) => {
        if (!canContinue) {
          ElMessageBox.confirm('商品采购信息已变更，需要重新物流报价，你还要继续吗?', '提示', {
            closeOnClickModal: false,
            closeOnPressEscape: false,
            confirmButtonText: '继续',
            showClose: false
          }).then(_ => {
            quotePurchase(form).then(_ => {
              resolve(true)
            }).catch(e => {
              reject(false)
            })
          }).catch(_ => reject(false))
        } else {
          if (state.enableCustom == 1) {
            state.quotationProductsRef.fullValidate(type).then(res => {
              Object.assign(form, res)
              form.goodsCustomFittingList = state.goodsCustomFittingList
              form.goodsCustomTypeList = state.goodsCustomTypeList
              form.enableCustom = state.enableCustom
              form.enableContainFitting = state.enableContainFitting
              // return
              quotePurchase(form).then(_ => {
                resolve(true)
              }).catch(e => {
                reject(false)
              })
            })
          } else {
            quotePurchase(form).then(_ => {
              resolve(true)
            }).catch(e => {
              reject(false)
            })
          }

        }
      })
    }

    function closePairDialog() {
      state.showPairDialog = false
    }

    function openPairDialog(row, type) {
      // type === 'see' 查看 ‘modify’ 修改
      const goodsName = state.goods.goodsName
      state.pairData = {
        skuId: row.skuId || null,
        sku: row.sku || null,
        url: row.url || state.goods.mainImageUrl,
        goodsName,
        goodsId: row.goodsId,
        speLabel: row.speLabel || null,
        type
      }
      state.showPairDialog = true
    }

    function batchSetSwitch(type) {
      if (type === 'open') {
        if (!getSelectCount()) {
          ElMessage.error({ message: '请选择商品SKU' })
          return false
        }
        state.showSwitchDialog = true
      }
      if (typeof type === 'object') {
        if (type.flag) {
          state.skus.map(sku => {
            if (sku.checked && sku.puhStatch !== 1) {
              sku.puhSwitch = type.batchPuhSwitch
              sku.skuSwitch = type.batchSkuSwitch
            }
            if(sku.checked){
              sku.enableCustomText = type.batchTextSwitch
              sku.enableCustomImage = type.batchImgSwitch
            }
          })
        }
        state.showSwitchDialog = false
      }
    }

    function showRelations(obj, row = null) {
      // 自身关联自身的组合品SKU变体不可查看不可更改
      if (obj.way === 'edit' && row && row.goodsSkuCombinationRelation.some(g => g.mainId === g.childId)) {
        ElMessage.error({ message: '设为单品的SKU变体已默认为本身，不可修改！' })
        return false
      }
      state.relationInfo = Object.assign(state.relationInfo, obj)
      state.showRelationDialog = true
    }

    function getCn(info) {
      let speLabel = ''
      if (info.goodsSpeValList !== undefined) {
        speLabel = info.goodsSpeValList ?.map(s => s.nameCn || s.nameEn).join('-') || ''
      } else {
        speLabel = (info.speCnLabel || info.speLabel) === '-' ? '' : (info.speCnLabel || info.speLabel)
      }
      return speLabel
    }

    function setCombinationLabels(skuInfo) {
      skuInfo.combinationLabels = []
      let price = 0
      skuInfo.goodsSkuCombinationRelation ?.forEach(sku => {
        skuInfo.combinationLabels.push(`${sku.goodsId} ${getCn(sku) === '-' ? '' : getCn(sku)}*${sku.coef}`)
        price = price + sku.coef * sku.price
      })
      skuInfo.price = price
    }

    function closeRelationDialog(flag, arr) {
      if (flag) {
        state.relationInfo.mainSkuIds.forEach(skuId => {
          let skuInfo = state.skus.find(sku => sku.skuId === skuId)
          skuInfo.goodsSkuCombinationRelation = arr.filter(item => item.coef > 0)
          skuInfo.combinationLabels = []
          setCombinationLabels(skuInfo)
        })
      }
      state.showRelationDialog = false
    }

    function closeFullRelationDialog(flag) {
      state.showFullRelationDialog = false
      if (flag) {
        initData()
      }
    }

    function openFullRelationDialog() {
      state.showFullRelationDialog = true
    }

    function openPurchaseUserDialog(skuId) {
      state.purchaseDialogSign = skuId
      state.showPurchaseUserDialog = true
    }

    function closePurchaseUserDialog(flag, obj) {
      state.showPurchaseUserDialog = false
      if (flag && state.purchaseDialogSign) {
        const find = state.skus.find(sku => sku.skuId === state.purchaseDialogSign)
        Object.assign(find, obj)
        state.purchaseDialogSign = null
      }
    }

    function codeValChange(){
      state.skus.forEach(item=>item.codeVal = null)
    }
    return {
      ...toRefs(state),
      submitBatch,
      codeOptions,
      selectTag,
      tableSelectRow,
      tableSelectAll,
      changeCodeType,
      setSkusCodeStyle,
      closeReturnDialog,
      batchInputSpe,
      changePuhSwitch,
      editConfig,
      goBack,
      submit,
      closePairDialog,
      openPairDialog,
      initData,
      batchSetSwitch,
      showRelations,
      closeRelationDialog,
      closeFullRelationDialog,
      openFullRelationDialog,
      openPurchaseUserDialog,
      closePurchaseUserDialog,
      getSelectCount,
      codeValChange
    }

  }
}
</script>

<style lang="scss" scoped>
.pq-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #000;
}

.pq-card-body {
  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.flex-div {
  display: flex;
  align-items: center;
}

.w-140 {
  width: 140px;
}

.w-90 {
  width: 90px;
}

.new-sku-tag {
  background: red;
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 2px;
  margin-left: 10px;
}

.spe-value-tag {
  cursor: pointer;
  background: #fff;
  color: #000;
  padding: 0 16px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin-bottom: 10px;
  margin-right: 10px;

  &.active {
    color: #fff;
    background: #1890ff;
    border-color: transparent;
  }
}

.quote-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 20px;

  &-input {
    width: 600px;
    margin-right: 10px;
  }
}

.text-overflow-remark {
  max-width: 800px;
  word-break: break-all;
}
</style>
