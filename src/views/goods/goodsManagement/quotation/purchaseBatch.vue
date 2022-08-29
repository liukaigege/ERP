<template>
<div class="purchase-batch-container">
  <erp-nav title="批量报价" :goBack="goBack" :routeOpt="{ name: 'Quotation' }"></erp-nav>
  <el-form :model="submitForm">
    <el-card shadow="never" class="none-border-card mt-20">
      <div class="step-box" v-if="goodsType == 1">
        <el-steps :active="setpActive" align-center @change="setpActiveChange">
          <el-step title="主件信息" />
          <el-step title="配件信息" />
        </el-steps>
      </div>
      <special-info :info="specialInfo"></special-info>
      <div class="mt-20" style="display: flex; align-items: center">
        <el-form-item label="货源渠道:" prop="channelId" required>
          <el-select v-model="submitForm.channelId" class="w-140">
            <el-option v-for="path in pathOptions" :key="path.id" :label="path.name" :value="path.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <batch-input :setpActive="setpActive" @submitBatch="submitBatch"></batch-input>
    </el-card>
    <div class="mt-10 flex-betbetween" v-if="pageData.length > 0">
      <div class="flex-align-center">
        <el-checkbox v-model="selectAllGoods" @change="setSelectAllGoods" :indeterminate="getSelectGoods().length>0&&!selectAllGoods">商品全选</el-checkbox>
        <el-button type="text" class="ml-15" @click="addCodeType">添加国码</el-button>
      </div>
      <div>
        <el-button type="primary" @click="openBatchSwitch">批量设置开关</el-button>
      </div>
    </div>
    <el-card shadow="never" class="none-border-card mt-10" v-for="(each,index) in pageData" :key="each.goodsId">
      <div>
        <div class="batch-goods-info">
          <div class="left">
            <div @click="each.expand = !each.expand" :class="!each.expand ? 'el-icon-arrow-down' : 'el-icon-arrow-up'" v-if="setpActive == 1"></div>
            <div class="left-title textOverflow">商品名称：{{each.goodsName}}</div>
            <div class="left-code">商品编码：{{each.goodsId}}</div>
            <div class="left-pub-switch" v-if="setpActive == 2">
              报价开关：
              <el-radio-group v-model="each.offerFittingSwitch" @change="eachPubSwitch($event,each)">
                <el-radio :label="1" :disabled="!each.enableContainFitting">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="right">
            <div>备注:</div>
            <el-input v-model="each.remark" maxlength="500" type="text" class="right-input"></el-input>
            <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon-color="red" title="确定移除吗" @confirm="deleteItem(each)">
              <template #reference>
                <el-button type="text">移除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
        <vxe-table v-show="setpActive == 1?each.expand:each.enableExpand" :scroll-y="{enabled: false}" @checkbox-all="selectAllChange" @checkbox-change="selectChange" :edit-rules="editRules" :ref="(el)=>tableRefs[index] = el" align="center" border :data="setpActive==1? each.tableData:each.goodsCustomFittingList" :edit-config="setpActive ==1? editConfig : {trigger: 'click',
  mode: 'cell',enabled:each.offerFittingSwitch == 1}">
          <vxe-column type="checkbox" width="60"></vxe-column>
          <template v-if="setpActive == 1">
            <vxe-column field="url" title="图片">
              <template #default="{ row }">
                <div class="flex-center" style="padding: 10px 0">
                  <el-popover v-if="row.url" placement="right-start" trigger="hover" width="auto">
                    <el-image style="width: 200px; height: 200px" :src="row.url" fit="contain"></el-image>
                    <template #reference>
                      <el-image style="width: 70px; height: 70px" :src="row.url" fit="contain"></el-image>
                    </template>
                  </el-popover>
                  <div style="display:flex;align-items:center;">
                    <div v-if="row.isAdd === 1" class="new-sku-tag">新</div>
                  </div>
                </div>
              </template>
            </vxe-column>
            <vxe-column field="speLabel" title="规格值"></vxe-column>
            <vxe-column field="expectPrice" title="预估售价（USD）" width="90px"> </vxe-column>
            <vxe-column field="skuSwitch" title="SKU开关">
              <template #header>
                <span>SKU开关</span>
                <el-tooltip effect="dark" content="针对暂时采购不到的商品SKU可进行关闭，关闭后仍可继续报价并保留报价信息" placement="top">
                  <i style="font-size: 14px" class="el-icon-question"></i>
                </el-tooltip>
              </template>
              <template #default="{ row }">
                <el-switch :disabled="row.puhStatch === 1" :active-value="1" :inactive-value="0" v-model="row.skuSwitch"></el-switch>
              </template>
            </vxe-column>
            <vxe-column field="puhSwitch" title="报价开关">
              <template #header>
                <span>报价开关</span>
                <el-tooltip effect="dark" content="针对不符合报价要求的商品SKU可拒绝报价，关闭后报价信息可不填" placement="top">
                  <i style="font-size: 14px" class="el-icon-question"></i>
                </el-tooltip>
              </template>
              <template #default="{ row }">
                <el-switch :disabled="row.puhStatch === 1" @change="changePuhSwitch(row)" :active-value="1" :inactive-value="0" v-model="row.puhSwitch"></el-switch>
              </template>
            </vxe-column>
          </template>
          <!-- 配件页面 -->
          <template v-else>
            <vxe-column field="nameCn" title="配件名称" :edit-render="{name:'$input',props:{maxlength:50}}"></vxe-column>
            <vxe-column field="imageUrl" title="图片">
              <template #default="{row}">
                <el-popover v-if="row.imageUrl" placement="right-start" trigger="hover" width="auto">
                  <el-image style="width: 200px; height: 200px" :src="row.imageUrl" fit="contain"></el-image>
                  <template #reference>
                    <el-image class="ml-10" style="width: 70px; height: 70px" :src="row.imageUrl" fit="contain"></el-image>
                  </template>
                </el-popover>
              </template>
            </vxe-column>
            <vxe-column field="material" title="材质" :edit-render="{name:'$input',props:{maxlength:30}}"></vxe-column>
          </template>
          <vxe-column field="codeVal" width="240" :visible="each.showCodeVal" v-if="goodsType == 0">
            <template #header>
              <div style="display: flex; align-items: center">
                <el-select v-model="submitForm.codeType" size="small" class="w-90" @change="codeValChange(each.tableData)">
                  <el-option label="服装" value="服装"></el-option>
                  <el-option label="鞋子" value="鞋子"></el-option>
                </el-select>
                <el-button class="ml-10" type="text" @click="setSkusCodeStyle('select', each.tableData)">选择</el-button>
                <el-button type="text" @click="setSkusCodeStyle('input', each.tableData)">填写</el-button>
                <el-button type="text" v-if="!each.codeValDisabled" @click="removeCodeType(each)">移除</el-button>
              </div>
            </template>
            <template #default="{ row }">
              <div class="flex-div">
                <el-select v-model="row.codeVal" v-if="row.codeStyle === 'select'">
                  <el-option v-for="(opt, index) in submitForm.codeType=='服装'?codeOptions[1]:codeOptions[2]" :key="index" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
                <el-input v-if="row.codeStyle === 'input'" type="text" :maxlength="20" v-model="row.codeVal"></el-input>
                <template v-if="row.codeStyle && each.commons.spes && each.commons.spes.length">
                  <el-dropdown trigger="click" :disabled="!row.codeVal" placement="bottom">
                    <el-button type="text" :disabled="!row.codeVal">批量填充</el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="batchInputSpe(each, spe.id, row)" v-for="spe in each.commons.spes" :key="spe.id">同{{ spe.nameCn || spe.nameEn }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
              </div>
            </template>
          </vxe-column>
          <vxe-column :field="setpActive == 2?'purchaseWeight':'weight'" title="重量（g）" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 99999.99,controls: false}}"></vxe-column>
          <vxe-colgroup title="商品体积">
            <vxe-column :field="setpActive == 2?'purchaseLength':'length'" title="长（cm）" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 999.99,controls: false}}"></vxe-column>
            <vxe-column :field="setpActive == 2?'purchaseWidth':'width'" title="宽（cm）" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 999.99,controls: false}}"></vxe-column>
            <vxe-column :field="setpActive == 2?'purchaseHeight':'height'" title="高（cm）" width="80" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 999.99,controls: false}}"></vxe-column>
          </vxe-colgroup>
          <vxe-column :field="setpActive == 2?'purchasePrice':'price'" title="默认采购价（CNY）" :edit-render="{name: '$input',props: {type: 'float',min: 0.01,max: 9999999.99,controls: false}}"></vxe-column>
          <vxe-column v-if="setpActive === 1" field="purchaseBy" title="采购员">
            <template #default="{ row }">
              <el-button @click="openPurchaseUserDialog(each, row.skuId)" type="text">{{!row.purchaseBy ? '未设置' : row.purchaseByUser}}</el-button>
            </template>
          </vxe-column>
          <vxe-column field="enableCustomImage" title="定制图片" v-if="goodsType === 1">
            <template #default="{row}">
              <el-switch v-model="row.enableCustomImage" :active-value="1" :inactive-value="0">
              </el-switch>
            </template>
          </vxe-column>
          <vxe-column field="enableCustomText" title="定制文本" v-if="goodsType === 1">
            <template #default="{row}">
              <el-switch v-model="row.enableCustomText" :active-value="1" :inactive-value="0">
              </el-switch>
            </template>
          </vxe-column>
          <vxe-column field="purchaseLink" title="采购链接" :edit-render="{name: '$input',props: {type: 'text', clearable: true, maxlength: 300}}"></vxe-column>
          <vxe-column v-if="setpActive === 2" field="remark" title="报价备注" :edit-render="{name: '$input',props: {type: 'text', clearable: true, maxlength: 300}}"></vxe-column>
          <vxe-column v-else field="purchaseRemark" title="报价备注" :edit-render="{name: '$input',props: {type: 'text', clearable: true, maxlength: 500}}"></vxe-column>
          <vxe-column title="组合商品" width="80" v-if="each.combineType === 2">
            <template #default="{ row }">
              <el-button @click="showRelations({
                  way: 'detail',
                  mainGoodsId: each.goodsId,
                  mainSkuId: row.skuId,
                  childGoodsIdList: [],
                  goodsSkuCombinationRelation: row.goodsSkuCombinationRelation
                })" type="text">查看</el-button>
            </template>
          </vxe-column>
        </vxe-table>

      </div>
    </el-card>
  </el-form>
  <erp-footer>
    <template #default>
      <div class="purchase-batch-footer">
        <div></div>
        <div class="footer-box">
          <el-button v-if="setpActive == 2" type="primary" @click="changeSetp(1)">上一步</el-button>
          <el-button @click="goBack">取消</el-button>
          <el-button v-if="setpActive == 1 && goodsType == 1" type="primary" @click="changeSetp(2)">下一步</el-button>
          <el-button type="primary" v-if="setpActive == 2 || goodsType == 0" @click="submit(0)">保存并退出</el-button>
          <el-button type="primary" v-if="setpActive == 2 || goodsType == 0" @click="submit(1)">提交报价</el-button>
        </div>
      </div>
    </template>
  </erp-footer>
  <purchase-user-dialog v-if="showPurchaseUserDialog" @close="closePurchaseUserDialog"></purchase-user-dialog>
  <relation-dialog :info="relationInfo" @close="closeRelationDialog" v-if="showRelationDialog"></relation-dialog>
  <switch-dialog @close="closeBatchSwitch" v-if="showBatchSwitch" :showPubSku="setpActive == 1" :showCustomized="goodsType ==  1" />
</div>
</template>

<script>
import { reactive, toRefs, nextTick, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ErpNav from '@/components/erpNav/index.vue'
import SpecialInfo from '../../components/PurchaseInfo/components/SpecialInfo.vue'
import BatchInput from '../../components/PurchaseInfo/components/BatchInput.vue'
import ErpFooter from '@/components/erpFooter/index.vue'
import { codeOptions } from '@/assets/js/staticData'
import { getPathOptions, purchaseBatchInfo, purchaseBatchUpdate, validateGoodsStatus } from '@/api/goods/quotation.js'
import { handleAttr } from "./composables/handle.js"
import { deepCopy } from 'tool'
import { ElMessage, ElMessageBox } from 'element-plus'
import { editRules, editConfig } from './components/composables/static.js'
import RelationDialog from '@/views/components/RelationDialog.vue'
import PurchaseUserDialog from '../../components/PurchaseInfo/components/PurchaseUserDialog.vue'
import SwitchDialog from '@/views/goods/components/PurchaseInfo/components/SwitchDialog.vue'
export default {
  name: 'PurchaseBatch',
  components: { ErpNav, SpecialInfo, BatchInput, ErpFooter, RelationDialog, PurchaseUserDialog, SwitchDialog },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
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
      submitForm: {
        channelId: null, // 货源渠道ID
        codeType: null // 错码类型
      },
      pathOptions: [], // 货源渠道,
      pageData: [],
      codeOptions,
      tableRefs: [],
      selectAllGoods: false,
      editRules,
      editConfig,
      deleteCustsIds: [],
      relationInfo: {
        childGoodsIdList: [],
        mainGoodsId: '',
        mainSkuId: '',
        way: '',
        goodsSkuCombinationRelation: []
      },
      showRelationDialog: false,
      showPurchaseUserDialog: false,
      purchaseDialogSign: null, // skuId
      setpActive: 1,
      showBatchSwitch: false
    })

    const ids = route.query ?.ids
    const goodsType = Number(route.query ?.type) // 0 普通商品 1 定制商品

    // 设置商品全选或全不选按钮
    function setSelectAllGoods(value) {
      state.tableRefs.forEach(ref => {
        ref.setAllCheckboxRow(value)
      })
    }

    // 获取选中的数据
    function getSelectGoods() {
      console.log(state.tableRefs);
      let arr = []
      state.tableRefs.forEach(ref => {
        console.log(ref);
        if(ref) arr.push(...ref.getCheckboxRecords(true))
      })
      return arr
    }

    function selectAllChange() {
      let list = []
      state.tableRefs.forEach(ref => list.push(ref.isAllCheckboxChecked()))
      state.selectAllGoods = list.every(blon => blon)
    }

    function selectChange() {
      let list = []
      state.tableRefs.forEach(ref => list.push(ref.isAllCheckboxChecked()))
      state.selectAllGoods = list.every(blon => blon)
    }

    // 批量填充
    function submitBatch(data) {
      const list = getSelectGoods()
      if (!list.length) return ElMessage.error({ message: '请勾选商品' })
      state.pageData.map(each => {
        if (state.setpActive == 1) {
          list.forEach(row => {
            if (row.puhSwitch === 1 && row.puhStatch !== 1) {
              Object.assign(row, data)
            }
          })
        } else {
          list.forEach(row => {
            console.log(row);
            if (row.enableExpand) Object.assign(row, data)
          })
        }

      })
    }

    // 添加错码列
    function addCodeType() {
      const length = getSelectGoods().length
      if (length === 0) return ElMessage.error('请勾选商品')
      state.tableRefs.forEach((item, index) => {
        if (item.getCheckboxRecords(true).length) {
          state.pageData[index].showCodeVal = true
        }
      })
      nextTick(() => {
        state.tableRefs.map(el => {
          el.refreshColumn()
        })
      })
    }

    // 移除错码列
    function removeCodeType(each) {
      each.showCodeVal = false
      nextTick(() => {
        state.tableRefs.map(el => {
          el.refreshColumn()
        })
      })
    }

    // 设置错码样式
    function setSkusCodeStyle(type, skus) {
      skus.map(sku => sku.codeStyle = type)
    }

    // 批量填充错码数据
    function batchInputSpe(each, id, row) {
      each.tableData.map(sku => {
        sku.speValues.map(spe => {
          const arr = row.speLabel.split('-')
          const name = spe.nameCn || spe.nameEn
          if (spe.speId === id && arr.indexOf(name) !== -1) {
            sku.codeVal = row.codeVal
          }
        })
      })
    }

    function changePuhSwitch(row) {
      if (row.puhSwitch === 0) {
        row.skuSwitch = 0
      }
    }

    // 查询批量报价数据
    purchaseBatchInfo({
      goodsIdList: ids.split(','),
      goodsType
    }).then(r => {
      handlePageData(r.data)
    })
    // 获取货源渠道数据
    getPathOptions().then(r => {
      state.pathOptions = r.data ?.dataList
    })

    // 处理渲染数据
    function handlePageData(pageData) {
      // 货源渠道
      state.submitForm = Object.assign(state.submitForm, {
        channelId: pageData[0].channelId,
        codeType: pageData[0].codeType
      })
      // 特殊属性
      state.specialInfo = Object.assign(state.specialInfo, handleAttr(pageData[0].attr))
      // 处理SKU数据 规格 和 是否有错码数据
      pageData.map(each => {
        each.goodsCustomFittingList = each.goodsCustomFittingList || []
        each.offerFittingSwitch = each.enableContainFitting
        each.enableExpand = Boolean(each.offerFittingSwitch)
        each.goodsCustomFittingList.forEach(item => {
          item.enableExpand = each.enableExpand
        })
        // 设置商品是否展开
        each.expand = true
        // 设置商品是否选中
        each.checked = false
        // 非正常报价流程时过滤掉所有报价开关关闭的sku
        if (each.operateStatus !== 0) {
          each.commons.skus = each.commons.skus.filter(sku => sku.puhSwitch === 1 && sku.lgtSwitch === 1)
        }
        let count = 0
        each.commons ?.skus ?.map(sku => {
          // 设置sku是否选中
          sku.checked = false
          // 设置sku codeStyle默认值
          sku.codeStyle = sku.codeVal ? 'input' : ''
          if (!sku.codeVal) count++
          sku.speLabel = sku.speValues ?.map(spe => spe.nameCn || spe.nameEn).join('-')
        })
        // 是否显示错码列
        each.showCodeVal = count !== each.commons.skus.length
        // 是否禁用移除错码列
        each.codeValDisabled = false
        // 申请新规格报价和开启并申请报价时错码列如果有不可移除 已报价中又可以移除
        if (each.showCodeVal && each.operateStatus > 1) {
          each.codeValDisabled = true
        }

        each.tableData = each.commons.skus || []
        // each.parts = [{}, {}]
        // sku排序，带有新标识的排在前面
        if (goodsType === 0) {
          each.tableData.sort((a, b) => b.isAdd - a.isAdd)
        }
      })
      state.pageData = pageData
    }

    // 提交、保存批量采购报价信息
    function submit(type) {
      // 提交报价时需要校验
      validateGoodsStatus({
        type: 1,
        goodsIdList: ids.split(',')
      }).then(r => {
        if (r.data ?.result) {
          if (type === 1) {
            if (!state.submitForm.channelId) {
              ElMessage.error({ message: '请选择货源渠道' })
              return false
            }
            // 若全部报价开关都被关闭，提示必须开启一个
            if (goodsType === 0) {
              let count = 0
              state.pageData.map(each => {
                const index = each.tableData.findIndex(sku => sku.puhSwitch === 1)
                if (index === -1) {
                  count++
                }
              })
              if (state.pageData.length === count) {
                ElMessage.error({ message: '批量报价至少开启一个商品SKU的报价开关' })
                return false
              }
            }
            const promiseArr = state.tableRefs.map(el => new Promise((resolve, reject) => {
              el.validate(true, r => {
                if (r) {
                  reject(r)
                } else {
                  resolve(r)
                }
              })
            }))
            Promise.all(promiseArr).then(_ => {
              ElMessageBox.confirm('确认提交采购报价?', '提示', {
                closeOnClickModal: false,
                closeOnPressEscape: false,
                showClose: false
              }).then(_ => {
                handle(type)
              }).catch(_ => {})
            }).catch(e => {
              ElMessage.warning({ message: '数据校验失败，请检查填写后重新提交' })
            })
          } else {
            handle(type)
          }
        } else {
          ElMessageBox.confirm('商品已被其他用户已完成采购报价流程！', '提示', {
            confirmButtonText: '确认并退出',
            closeOnClickModal: false,
            closeOnPressEscape: false,
            showCancelButton: false,
            showClose: false
          }).then(_ => {
            router.push({ name: 'Quotation' })
          })
        }
      })
    }

    function handle(type) {
      let goods = []
      state.pageData.map(each => {
        const obj = {
          id: each.id,
          goodsId: each.goodsId,
          attr: '',
          channelId: state.submitForm.channelId,
          codeType: each.showCodeVal ? each.codeType : null,
          remark: each.remark,
          enableCustom: each.enableCustom,
          enableContainFitting: each.enableContainFitting,
          offerFittingSwitch: each.offerFittingSwitch,
          offerFittingSwitchChange: each.offerFittingSwitch == each.enableContainFitting ? 0 : 1
        }
        // 处理特殊属性
        const keys = Object.keys(state.specialInfo)
        let arr = []
        keys.map((key, index) => {
          if (state.specialInfo[key] && state.specialInfo[key] !== 'empty' && key !== 'electronic') {
            arr.push(state.specialInfo[key])
          }
        })
        obj.attr = arr.length ? arr.join(',') : ''
        const keys2 = ['weight', 'length', 'width', 'height', 'price', 'purchaseLink']
        each.tableData.map(row => {
          keys2.forEach(key => {
            row[key] = row.puhSwitch === 1 ? row[key] : null
          })
          row.codeVal = each.showCodeVal ? row.codeVal : null
        })
        obj.skus = each.tableData
        obj.goodsCustomFittingList = each.goodsCustomFittingList
        obj.goodsCustomTypeList = each.goodsCustomTypeList
        goods.push(obj)
      })
      purchaseBatchUpdate({
        type,
        goods,
        goodsType,
      }).then(r => {
        ElMessage.success({ message: (type === 0 ? '保存' : '') + '批量报价成功' })
        setTimeout(_ => {
          router.push({ name: 'Quotation' })
        }, 1000)
      })
    }

    function goBack() {
      ElMessageBox.confirm('确认终止当前报价流程？', '提示', {
        cancelButtonText: '停留',
        confirmButtonText: '确认',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        showClose: false
      }).then(_ => {
        router.push({ name: 'Quotation' })
      }).catch(_ => {})
    }

    function showRelations(obj) { // 查看 暂时不清楚
      state.relationInfo = Object.assign(state.relationInfo, obj)
      state.showRelationDialog = true
    }

    function closeRelationDialog() {
      state.showRelationDialog = false
    }

    function openPurchaseUserDialog(each, skuId) {
      state.purchaseDialogSign = each.goodsId + ',' + skuId
      state.showPurchaseUserDialog = true
    }

    function closePurchaseUserDialog(flag, obj) {
      state.showPurchaseUserDialog = false
      if (flag && state.purchaseDialogSign) {
        const [goodsId, skuId] = state.purchaseDialogSign.split(',')
        const find = state.pageData.find(each => each.goodsId === goodsId).tableData.find(sku => sku.skuId === skuId)
        Object.assign(find, obj)
        state.purchaseDialogSign = null
      }
    }

    function changeSetp(num) {
      if (!state.pageData.length) return ElMessage.error('没有商品')
      console.log(state.pageData);
      if (num == 1) {
        state.setpActive = num
      } else {
        const promiseArr = state.tableRefs.map(el => new Promise((resolve, reject) => {
          el.validate(true, r => {
            if (r) {
              reject(r)
            } else {
              resolve(r)
            }
          })
        }))
        Promise.all(promiseArr).then(res => {
          state.setpActive = num
        })
      }
    }

    function openBatchSwitch() {
      if (!getSelectGoods().length) return ElMessage.error('请勾选商品')
      state.showBatchSwitch = true
    }

    function closeBatchSwitch(object) {
      //object : batchPuhSwitch batchSkuSwitch batchImgSwitch batchTextSwitch
      setTimeout(() => {
        state.showBatchSwitch = false
      }, 500);
      if (!object.flag) return false // 仅关闭弹框，不做任何操作
      if (state.setpActive == 1) { // 普通商品和定制品配件
        getSelectGoods().map(item => {
          console.log(item.puhStatch);
          if(item.puhStatch != 1){
            item.puhSwitch = object.batchPuhSwitch
            item.skuSwitch = object.batchSkuSwitch
          }
        })
      }
      if (state.setpActive == 1 && goodsType == 1 || state.setpActive == 2) {
        getSelectGoods().map(item => {
          item.enableCustomImage = object.batchImgSwitch
          item.enableCustomText = object.batchTextSwitch
        })
      }
    }

    function deleteItem(each) {
      state.pageData = state.pageData.filter(item => item.id != each.id)
      state.tableRefs.splice(state.tableRefs.length-1,1)
    }

    function eachPubSwitch($event, each) {
      if (state.setpActive == 1) each.expand = Boolean($event)
      else {
        each.enableExpand = Boolean($event)
        each.goodsCustomFittingList.forEach(item => {
          item.enableExpand = each.enableExpand
        })
      }
    }

    function setpActiveChange() {
      state.selectAllGoods = false
      state.tableRefs = []
    }

    function codeValChange(data){
      data.forEach(item=>item.codeVal = null)
    }
    return {
      ...toRefs(state),
      goodsType,
      submitBatch,
      setSelectAllGoods,
      addCodeType,
      removeCodeType,
      setSkusCodeStyle,
      batchInputSpe,
      goBack,
      submit,
      changePuhSwitch,
      showRelations,
      closeRelationDialog,
      openPurchaseUserDialog,
      closePurchaseUserDialog,
      changeSetp,
      openBatchSwitch,
      closeBatchSwitch,
      deleteItem,
      eachPubSwitch,
      selectAllChange,
      selectChange,
      setpActiveChange,
      getSelectGoods,
      codeValChange
    }
  }
}
</script>

<style lang="scss" scoped>
.w-140 {
  width: 140px;
}

.w-90 {
  width: 90px;
}

.flex-div {
  display: flex;
  align-items: center;
}

.purchase-batch-container {
  padding-bottom: 50px;
}

.batch-goods-info {
  display: flex;
  align-items: center;
  height: 46px;
  justify-content: space-between;
  background: #f5f7fa;
  padding-left: 10px;
  padding-right: 30px;

  .left,
  .right {
    display: flex;
    align-items: center;

    .right-input {
      width: 500px;
      margin: 0 10px;
    }
  }

  .left {
    font-weight: bold;

    .el-icon-arrow-down,
    .el-icon-arrow-up {
      font-size: 20px;
    }

    .left-title {
      margin-left: 15px;
      max-width: 400px;
    }

    .left-code,
    .left-pub-switch {
      margin-left: 30px;
    }
  }
}

.new-sku-tag {
  background: red;
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 2px;
  margin-left: 10px;
}

.purchase-batch-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .footer-box {
    margin-right: 20px;
    line-height: 52px;
  }
}

.step-box {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}

.flex-align-center {
  display: flex;
  align-items: center;
}

.flex-betbetween {
  display: flex;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  justify-content: center;
}
</style>
