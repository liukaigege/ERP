<!--
 * @Descripttion: 'specTable.vue 规格信息=>表格'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="specTable">
    <vxe-table
      ref="multipleTable"
      row-id="id"
      @checkbox-change="handleSelectionChange"
      @checkbox-all="handleSelectionChange"
      keep-source
      align="center"
      :max-height="500"
      show-overflow="ellipsis"
      :export-config="{}"
      :scroll-y="{ enabled: true, gt: 20 }"
      highlight-hover-row
      :auto-resize="true"
      :row-config="{ height: 100 }"
      border
    >
      <vxe-table-column v-if="isEdit" type="checkbox" width="55">
      </vxe-table-column>
      <vxe-table-column field="skuId" title="商品SKU">
        <template #default="{ row }">
          <div>
            <p>{{ row.skuId }}</p>
            <div class="sku-item" :title="row.sku">{{ row.sku }}</div>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="url" title="图片" width="100">
        <template #default="{ row }">
          <div
            v-if="row.url"
            style="width: 70px; height: 70px; margin: 5px 0; position: relative"
          >
            <el-popover placement="right-start" trigger="hover" width="auto">
              <el-image
                style="width: 200px; height: 200px"
                :src="row.url"
                fit="contain"
              ></el-image>
              <template #reference>
                <el-image
                  class="ml-10"
                  style="width: 70px; height: 70px"
                  :src="row.url"
                  fit="contain"
                ></el-image>
              </template>
            </el-popover>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="speVal"
        title="规格值"
        width="180"
        show-overflow="tooltip"
      >
        <template #default="{ row }">
          {{
            language == 1 && row.speValCn
              ? row.speValCn
              : row.speValEn
              ? row.speValEn
              : '-'
          }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="skuSwitch" title="状态" width="100">
        <template #default="{ row }">
          <div class="re" v-if="skuStatus">
            <el-switch
              v-model="row.skuSwitch"
              active-color="#1890FF"
              inactive-color="#C0C0C0"
            ></el-switch>
            <div class="ab" @click="changeStatus(row.id)"></div>
          </div>
          <div class="" v-if="!skuStatus">
            {{ row.skuSwitch ? '开启' : '关闭' }}
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column
        v-if="hideStatus"
        field="codeVal"
        title="国码"
        width="110"
      >
      </vxe-table-column>
      <vxe-table-column field="weight" width="100" title="重量（g）">
        <template #header>
          <div><span style="color: red">* </span>重量（g）</div>
        </template>
      </vxe-table-column>

      <vxe-table-colgroup width="300">
        <template #header>
          <div><span style="color: red">* </span>商品体积</div>
        </template>
        <vxe-table-column field="length" title="长（cm）" width="100">
        </vxe-table-column>
        <vxe-table-column field="width" title="宽（cm）" width="100">
        </vxe-table-column>
        <vxe-table-column field="height" title="高（cm）" width="100">
        </vxe-table-column>
      </vxe-table-colgroup>

      <vxe-table-column field="expectPrice" title="期望售价(USD)：" width="130">
      </vxe-table-column>
      <vxe-table-column field="price" title="建议售价(USD)：" width="140">
        <template #default="{ row }">
          <div>
            {{
              (
                goodsData.rate *
                row.price *
                goodsData.suggestPriceFactor
              ).toFixed(2)
            }}
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="id" title="商品配对" width="90">
        <template #default="{ row }">
          <div>
            <el-button type="text" @click="closePairing(row)">查看</el-button>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column
        field="id"
        title="组合商品"
        width="90"
        v-if="goodsData.combineType == 2"
      >
        <template #default="{ row }">
          <div>
            <el-button type="text" @click="queryDetail(row)">查看</el-button>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column field="purchaseRemark" title="报价备注" width="90">
        <template #default="{ row }">
          <div>
            <el-button
              type="text"
              :disabled="!row.purchaseRemark"
              @click="queryRemark(row.purchaseRemark)"
              >查看</el-button
            >
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>
    <Pairing v-if="pairingShow" @close="closePairing" :data="pairingData" />
    <el-dialog
      v-model="close_open_visible"
      title="更改SKU状态"
      width="30%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <span>{{ tipWords }}</span>
      <el-input
        style="margin-top: 20px"
        v-model="remark"
        :placeholder="
          tipWords == tips.closeTips ? '请输入关闭原因' : '请输入开启原因'
        "
        :maxlength="100"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="dialogVisible">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <RelationDialog
      v-if="queryData.mainSkuIds"
      :info="queryData"
      @close="close"
    />
    <Remark
      :purchaseRemark="purchaseRemark"
      v-if="remarkShow"
      @close="queryRemark"
    />
  </div>
</template>
<script>
import { reactive, toRefs, onMounted, ref, computed } from 'vue'
import { listFn, cartesianProductOf } from '../composables/tools.js'
import { statusUpdate } from '../composables/api.js'
import Pairing from './pairing.vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import RelationDialog from '@/views/components/RelationDialog.vue'
import Remark from './remark.vue'
export default {
  components: { Pairing, RelationDialog, Remark },
  props: {
    dataValue: {
      type: Object,
      default: null
    },
    skuStatus: {
      type: Boolean,
      default: false
    },
    language: {
      type: Number,
      default: 1
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    skuType: {
      type: Number,
      default: 2
    },
    modelValue: {
      type: Array,
      default: []
    },
    goodsData: {
      type: Object,
      default: null
    }
  },
  setup(props, context) {
    const route = useRoute()
    const goodsId = route.query.id || null
    let multipleTable = ref(null)
    const tips = {
      closeTips: '确认关闭商品SKU?',
      openTips: '确认开启商品SKU?'
    }

    const state = reactive({
      purchaseRemark: '',
      remarkShow: false,
      checkedList: [],
      value: '美码',
      country: '美国',
      list: null,
      pairingShow: false,
      pairingData: null,
      tipWords: tips.closeTips,
      close_open_visible: false,
      remark: '',
      val: props.dataValue,
      changeStatusId: null,
      hideStatus: null,
      queryData: {
        way: 'detail', // 可选值：detail 查看关联 edit 修改关联 add 新增关联
        mainGoodsId: props.goodsData.id, // 组合品商品编码 way 为 edit 和 detail 时必传
        mainSkuIds: '', // 组合品的某条skuId way 为 edit 和 detail 时必传
        childGoodsIdList: [], // 选中的需要关联的商品编码数组 way 为 add 时必传
        goodsSkuCombinationRelation: [] // 已关联数据
      }
    })
    function queryRemark(val) {
      if (val) {
        state.purchaseRemark = val
        state.remarkShow = true
      } else {
        state.remarkShow = val
      }
    }
    function closePairing(data) {
      if (data) {
        let obj = state.list.filter(v => v.id === data.id)[0] || {}
        state.pairingData = {
          skuId: obj.skuId || null,
          // 优先取当前sku图片，没有的话取商品主图
          url: data.url || props.dataValue.goodsInfo.goodsImage || null,
          nameCn: props.dataValue.goodsInfo.nameCn || null,
          nameEn: props.dataValue.goodsInfo.nameEn || null,
          speVal: obj.speVal || null
        }
      }
      state.pairingShow = !state.pairingShow
    }

    function changeStatus(id) {
      if (state.list.filter(v => v.id == id)[0].skuSwitch) {
        state.tipWords = tips.closeTips
      } else {
        state.tipWords = tips.openTips
      }
      state.close_open_visible = !state.close_open_visible
      state.remark = ''
      state.changeStatusId = id
    }
    function handleClose() {
      state.close_open_visible = !state.close_open_visible
      state.remark = ''
    }
    function dialogVisible() {
      if (state.changeStatusId) {
        const { skuSwitch, skuId } = state.list.filter(
          v => v.id == state.changeStatusId
        )[0]
        statusUpdate({
          skuSwitch: skuSwitch ? 0 : 1,
          skuId,
          goodsId,
          reason: state.remark
        }).then(res => {
          if (res.code == 200) {
            state.list.forEach(v => {
              if (v.id == state.changeStatusId) {
                v.skuSwitch = !v.skuSwitch
                state.close_open_visible = !state.close_open_visible
              }
            })
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      }
    }

    //选择表单列表中的项
    function handleSelectionChange(val) {
      let list = multipleTable.value.getCheckboxRecords()?.map(v => v.id)
      context.emit('update:modelValue', list)
    }
    function setCheckboxRowFn(ids) {
      let arr = []
      multipleTable.value.setCheckboxRow(state.list, false)
      state.list.map(v => {
        if (ids.filter(item => item == v.id).length) {
          arr.push(v)
        }
      })
      multipleTable.value.setCheckboxRow(arr, true)
    }

    // 查看组合品
    function queryDetail(val) {
      state.queryData.mainSkuIds = [val.skuId]
    }
    // 关闭查看组合品
    function close() {
      state.queryData.mainSkuIds = ''
    }
    onMounted(() => {
      state.list = listFn(props.dataValue.offerSku)
      state.hideStatus = state.list?.filter(v => v.codeVal).length > 0
      setTimeout(() => {
        multipleTable.value.loadData(state.list)
        setCheckboxRowFn(props.modelValue)
      })
    })
    return {
      ...toRefs(state),
      closePairing,
      changeStatus,
      handleClose,
      dialogVisible,
      tips,
      handleSelectionChange,
      multipleTable,
      setCheckboxRowFn,
      queryDetail,
      close,
      queryRemark
    }
  }
}
</script>
<style lang="scss" scoped>
.sku-item {
  color: #909399;
  text-overflow: ellipsis;
  overflow: hidden;
}
.specTable {
  width: 100%;
}
.re {
  position: relative;
  .ab {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
