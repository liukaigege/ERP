<template>
  <div>
    <erp-nav title="创建采购单" :goBack="goBack"></erp-nav>
    <el-form
      label-width="80px"
      inline
      style="margin-top: 25px; padding-top: 20px; background: #fff"
    >
      <el-form-item label="采购类型">
        <el-input model-value="多发入库" disabled></el-input>
      </el-form-item>
      <el-form-item label="采购员">
        <el-input v-model="info.purchaseUser" disabled></el-input>
      </el-form-item>
      <el-form-item label="供应商:" prop="supplierId">
        <el-cascader
          v-model="info.supplierId"
          disabled
          :options="supplierList"
          :show-all-levels="false"
          :props="{ value: 'id', label: 'name', children: 'childs' }"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="仓库">
        <el-select v-model="info.warehouseId" disabled>
          <el-option
            v-for="item in warehouseList"
            :label="item.warehouseName"
            :value="item.warehouseId"
            :key="item.warehouseId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="1688账号" v-if="info.partnerType === 2">
        <el-select v-model="info.accountId" disabled>
          <el-option
            :label="item.accountName"
            :value="item.id"
            v-for="item in accountList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="address-box" v-if="info.partnerType === 2">
      <label class="title">收货地址：</label>
      <div class="address-info">{{ info.address || '-' }}</div>
    </div>
    <div class="table-warp">
      <vxe-table border="inner" align="center" :data="info.orderItems">
        <vxe-column title="商品信息" min-width="300">
          <template #default="{ row }">
            <div class="info-content">
              <div class="img-content">
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
                      style="width: 80px; height: 80px"
                      :src="row.mainImg"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div class="info-cell">
                <div class="one-line" :title="row.skuCode">
                  {{ row.skuCode }}
                </div>
                <div :title="row.goodsName" class="two-line">
                  {{ row.goodsName }}
                </div>
                <div class="one-line" :title="fmtSpe(row.skuValue)">
                  {{ fmtSpe(row.skuValue) }}
                </div>
                <!-- 国码预留 -->
                <div v-if="row.codeVal" style="color:#2fbba6">
                  国码：{{ row.codeVal }}
                </div>
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="供应商商品信息" min-width="300">
          <template #default="{ row }">
            <!-- 1688 -->
            <div class="info-content" v-if="info.partnerType == 2">
              <div class="img-content">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                  v-if="row.pairInfo"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="row.pairInfo?.img"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      style="width: 80px; height: 80px"
                      :src="row.pairInfo?.img"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div class="info-cell">
                <div class="two-line" :title="row.pairInfo?.name">
                  {{ row.pairInfo?.name }}
                </div>
                <div
                  class="one-line"
                  :title="fmtSpe(JSON.stringify(row.pairInfo?.speInfo))"
                >
                  {{ fmtSpe(JSON.stringify(row.pairInfo?.speInfo)) }}
                </div>
                <div class="btn-content">
                  <el-button
                    type="text"
                    size="small"
                    @click="openDialog(row)"
                    >{{ row.pairInfo ? '更换' : '配对' }}</el-button
                  >
                </div>
              </div>
              <div class="goods-attr">
                <el-select v-model="row.goodAttribute" :disabled="true" style="width: 120px;">
                  <el-option label="原品" :value="1" />
                  <el-option label="相似品" :value="2" />
                  <el-option label="替代品" :value="3" />
                </el-select>
              </div>
            </div>
            <div class="info-content" v-else>
              <div class="img-content">
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
                      style="width: 80px; height: 80px"
                      :src="row.mainImg"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div class="info-cell">
                <div class="two-line" :title="row.goodsName">
                  {{ row.goodsName }}
                </div>
                <div class="one-line" :title="fmtSpe(row.skuValue)">
                  {{ fmtSpe(row.skuValue) }}
                </div>
              </div>
              <div class="goods-attr">
                <el-select v-model="row.goodAttribute" :disabled="true" style="width: 120px;">
                  <el-option label="原品" :value="1" />
                  <el-option label="相似品" :value="2" />
                  <el-option label="替代品" :value="3" />
                </el-select>
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="采购报价/上次采购价(￥)" width="220">
          <template #default="{ row }">
            <div>
              {{ row.purchasePrice || '-' }} /
              {{ row.lastPurchasePrice || '-' }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="单价(￥)" width="150">
          <span>0</span>
        </vxe-column>
        <vxe-column
          field="purchaseQuantity"
          title="数量"
          width="150"
        ></vxe-column>
        <vxe-column title="应付(￥)" width="120">
          <span>0</span>
        </vxe-column>
      </vxe-table>
      <div class="table-footer">
        <el-form ref="form" label-width="100px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="备注类型：">
                <el-select
                  v-model="formState.remarkTypeId"
                  @clear="formState.remark = ''"
                  :disabled="info.remarkUserFlag == 0"
                  clearable
                >
                  <el-option
                    v-for="item in remarkTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="formState.remarkTypeId">
              <el-form-item label="备注内容：">
                <el-input
                  type="textarea"
                  v-model="formState.remark"
                  :autosize="{ minRows: 3, maxRows: 6 }"
                  :maxlength="100"
                  :disabled="info.remarkUserFlag == 0"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <erp-footer>
      <div class="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="commit">提交审核</el-button>
      </div>
    </erp-footer>
  </div>
</template>
<script>
import erpNav from '@/components/erpNav/index.vue'
import erpFooter from '@/components/erpFooter/index.vue'
import { reactive, shallowReactive, toRefs } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { warehouseList } from '@/assets/js/staticData.js'
import { getRemarkTypes } from '@/api/goods/quotedPrice.js'
import { exceptionInfo, placeAnOrder } from '@/api/purchase/order.js'
import { getTree } from '@/api/purchase/outOfStock.js'
import { getAccountList } from '@/api/purchase/platform.js'
import { fmtAddress } from './composables/comFun.js'
import { ElMessage } from 'element-plus'
export default {
  components: { erpNav, erpFooter },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    let { id } = route.query
    let state = shallowReactive({
      remarkTypeList: [],
      supplierList: [],
      accountList: [],
      info: {}
    })
    let formState = reactive({
      remarkTypeId: '',
      remark: ''
    })
    exceptionInfo({ id }).then(res => {
      res.data.address = fmtAddress(res.data.address)
      state.info = res.data
      formState.remarkTypeId = res.data.remarkTypeId
      formState.remark = res.data.remark
    })
    getTree().then(res => {
      state.supplierList = res.data
    })
    getRemarkTypes({ useScope: '2' }).then(res => {
      state.remarkTypeList = res.data
    })
    getAccountList().then(res => {
      state.accountList = res.data
    })

    function goBack() {
      router.push({
        name: 'PurchaseOrders',
        params: {
          status: '5, 6'
        }
      })
    }

    function fmtSpe(spes) {
      if (spes) {
        let list = JSON.parse(spes)
        return list.map(item => item.spe + ': ' + item.speVal).join(' ')
      }
      return ''
    }
    function cancel() {
      goBack()
    }
    function commit() {
      let params = {
        exceptionId: id,
        totalAmount: (
          state.info.orderItems[0].purchaseQuantity *
          state.info.orderItems[0].price *
          (1 + state.info.taxRate / 100)
        ).toFixed(2),
        saveFlag: 2,
        skuQuantity: 1,
        purchaseQuantity: state.info.orderItems[0].purchaseQuantity
      }
      state.info.type = 3 // 多发入库
      state.info.toDeptId = null
      placeAnOrder(Object.assign(params, state.info, formState)).then(_ => {
        ElMessage({
          message: '操作成功',
          type: 'success'
        })
        goBack()
      })
    }
    return {
      goBack,
      commit,
      warehouseList,
      fmtSpe,
      ...toRefs(state),
      cancel,
      formState
    }
  }
}
</script>
<style lang="scss" scoped>
.address-box {
  display: flex;
  align-items: flex-start;
  background-color: #fff;
  padding: 5px 15px 15px;
  .title {
    width: 90px;
    flex-shrink: 0;
  }
  .address-info {
    margin-right: 30px;
  }
  .btn-change {
    cursor: pointer;
    color: #409eff;
    width: 300px;
  }
}
.table-warp {
  background-color: #fff;
  padding: 25px;
}
.table-footer {
  background: rgba(255, 251, 230, 0.7);
  padding: 22px 25px 0 25px;
  margin-top: 15px;
}
.footer {
  text-align: right;
  padding: 0 25px;
}
.info-content {
  display: flex;
  align-items: center;
  width: 200px;
  .img-content {
    width: 80px;
    height: 80px;
    margin-right: 10px;
    flex-shrink: 0;
  }
}
.info-cell {
  color: rgba(0, 0, 0, 0.85);
  line-height: 2;
  min-width: 200px;
  text-align: left;
  div:last-child {
    color: rgba(0, 0, 0, 0.65);
  }
  .two-line {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: break-spaces;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .one-line {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.btn-content {
  flex-grow: 1;
  text-align: right;
  align-self: flex-end;
  line-height: 1;
}
.goods-attr{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  width: 140px;
  height: 80px;
  border-left: 1px solid #e8eaec;
  margin-left: 10px;
}
</style>