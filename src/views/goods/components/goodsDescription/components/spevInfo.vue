<!--
 * @Descripttion: 'spevInfo.vue 规格信息'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="baseInfoContainer">
    <div class="baseInfoHeader">未报价SKU列表</div>
    <div class="baseInfoContent">
      <el-button
        type="primary"
        @click="applyFn"
        v-if="
          !isEdit &&
          layFlag == 0 &&
          combine != 1 &&
          goodsData.skuType == 2 &&
          authPath('openAndApply:btn')
        "
        style="margin-bottom: 20px"
        :disabled="sourceRoute"
        >开启并申请报价</el-button
      >
      <vxe-table
        ref="unSkuTable"
        row-id="skuId"
        @checkbox-change="handleSelectionChange"
        @checkbox-all="handleSelectionChange"
        keep-source
        align="center"
        :max-height="500"
        show-overflow="tooltip"
        :export-config="{}"
        :scroll-y="{ enabled: true, gt: 20 }"
        highlight-hover-row
        :auto-resize="true"
        :row-config="{ height: 100 }"
        border
      >
        <vxe-table-column type="checkbox" width="55"> </vxe-table-column>
        <!-- <vxe-table-column field="sku" title="SKU编码" width="300">
          <template #default="{ row }">
            <div>
              <p>{{ row.skuId }}</p>
              <p>{{ row.sku }}</p>
            </div>
          </template>
        </vxe-table-column> -->
        <vxe-table-column field="url" title="图片" width="100">
          <template #default="{ row }">
            <div
              v-if="row.url"
              style="
                width: 70px;
                height: 70px;
                margin: 5px 0;
                position: relative;
              "
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
            {{ language == 1 && row.speValCn ? row.speValCn : row.speValEn }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="expectPrice" title="期望售价(USD)" width="150">
        </vxe-table-column>
        <vxe-table-column field="isAdd" title="状态" width="130">
          <template #default="{ row }">
            <div>
              {{ row.isAdd == 1 ? '申请报价中' : '关闭' }}
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="purchaseRemark" title="报价备注">
        </vxe-table-column>
      </vxe-table>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, watch, ref, onMounted } from 'vue'
import { listFn, statusTips } from '../composables/tools.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { apply } from '../composables/api.js'
import { useRoute } from 'vue-router'
import { authPath } from '@/utils/hooks'
export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    layFlag: {
      type: Number,
      default: 0
    },
    offerStatus: {
      type: Number,
      default: null
    },
    goodsData: {
      type: Object,
      default: null
    },
    language: {
      type: Number,
      default: 1
    },
    sourceRoute: Boolean
  },
  setup(props, context) {
    const route = useRoute()
    const goodsId = route.query.id || null
    const combine = route.query.combine || null
    const list = listFn(props.data)
    let unSkuTable = ref(null)
    const state = reactive({
      list,
      checkedList: []
    })
    //选择表单列表中的项
    const handleSelectionChange = val => {
      state.checkedList = unSkuTable.value
        .getCheckboxRecords()
        ?.map(v => v.skuId)
    }
    watch(state.list, () => context.emit('changeBack', state.list))
    function applyFn() {
      if (props.goodsData.operateStatus) {
        statusTips(props.goodsData.operateStatus)
        return false
      }
      if (!state.checkedList.length)
        return ElMessage.warning({ message: '请选择商品' })
      ElMessageBox.confirm('确认将勾选的商品【开启并申请报价】？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apply({
          skuIds: state.checkedList,
          goodsId
        }).then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: '申请成功' })
            state.list.forEach(v => {
              if (state.checkedList.filter(item => item == v.skuId).length)
                v.isAdd = 1
            })
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
      })
    }
    onMounted(() => {
      setTimeout(() => unSkuTable.value.loadData(state.list))
    })
    return {
      ...toRefs(state),
      handleSelectionChange,
      applyFn,
      combine,
      unSkuTable
    }
  }
}
</script>

<style lang="scss" scoped>
.baseInfoContainer {
  box-sizing: border-box;
  .baseInfoHeader {
    border-bottom: 1px solid #e8eaec;
    box-sizing: border-box;
    padding: 0 40px;
    margin: 0 -30px;
    line-height: 50px;
  }
  .baseInfoContent {
    box-sizing: border-box;
    padding: 20px 10px 10px;
  }
}
</style>