<template>
  <el-dialog title="引用订单" v-model="show" @close="closeDialog(false)">
    <div style="display: flex; align-items: center">
      <el-select size="small" v-model="filterForm.searchType" placeholder="请选择" clearable>
        <el-option v-for="item in searchTypes" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input size="small" style="width: 200px; margin-right: 10px" class="ml-10" v-model="filterForm.searchText" maxlength="50" clearable placeholder="请输入要检索的内容(单条)"></el-input>
      <el-button type="primary" size="small" @click="searchBefore">查询</el-button>
    </div>
    <div class="table-container mt-10">
      <vxe-table max-height="520px" empty-text="输入要检索的内容进行查询（未付款订单包裹和合并包裹暂不支持引用）" :loading="tableLoading" :scroll-y="{enabled: false}" border :data="tableData" :span-method="colspanMethod">
        <vxe-column field="packageId" title="商品信息" width="360">
          <template #default="{ row, rowIndex }">
            <div v-if="rowIndex % 2 === 0">
              <span>{{row.packageId}}</span>
            </div>
            <div v-else class="goodsInfo">
              <div class="goods-div" style="display: flex; align-items: center; justify-content: space-between" v-for="item in row.skuList" :key="item.sku">
                <div class="left" style="display: flex; align-items: center; max-width: 290px">
                  <el-popover placement="right-start" trigger="hover" width="auto">
                    <el-image style="width: 200px; height: 200px" :src="item.skuImg" fit="contain"></el-image>
                    <template #reference>
                      <el-image style="width: 70px; height: 70px" :src="item.skuImg" fit="contain"></el-image>
                    </template>
                  </el-popover>
                  <div class="ml-10" style="width: calc(100% - 80px);">
                    <el-tooltip placement="top">
                      <template #content>
                        <p style="cursor: pointer" v-copy="item.sku">复制</p>
                      </template>
                      <p class="infoTitle">
                        <a :href='item.thirdUrl' target="_blank">{{ item.sku }}</a>
                      </p>
                    </el-tooltip>
                    <div>{{ row.currency }} {{ item.price }}</div>
                    <div v-if="getSkuValue(item.skuValue)?.length > 0">
                      <div class="sku" v-for="(c, d) in getSkuValue(item.skuValue)" :key="d">
                        <p v-if="!c.speValmainImg">
                          {{ c.spe + ':' }} {{ c.speVal }}
                        </p>
                        <p v-else>
                          {{ c.spe + ':' }}
                          <el-popover placement="right" :width="240" trigger="hover">
                            <goodsImg :data="proverDatas(c.speValmainImg)" />
                            <template #reference>
                              <i class="el-icon-picture"></i>
                            </template>
                          </el-popover>
                        </p>
                      </div>
                    </div>
                    <el-button type="text" v-if="item.customization == 1" @click="showCustomInfo(row)">定制</el-button>
                  </div>
                </div>
                <div class="right" style="font-size: 12px; max-width: 60px">
                  <p class="num">X{{ item.quantity }}</p>
                  <p class="type" v-if="showPur(item, row)">
                    {{ pur(item, row) }}
                  </p>
                </div>
              </div>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="orderId" title="订单号" align="center"></vxe-column>
        <vxe-column field="country" title="收件人信息" align="center">
          <template #default="{ row }">
            <div class="address-div">
              <div>[{{row.country}}] {{row.name}} </div>
              <div>{{row.email}}</div>
              <div>{{row.source}}：<a v-if='row.domain' target='_blank' :href='row.domain'>{{row.domain}}</a> </div>
              <div>买家指定：{{row.shippingsName ? row.shippingsName :'暂无'}}</div>
            </div>
          </template>
        </vxe-column>
        <vxe-column title="操作" align="center" width="80">
          <template #default="{ row }">
            <el-button type="text" size="small" @click="closeDialog(true, row)">引用</el-button>
          </template>
        </vxe-column>
      </vxe-table>
<!--      <el-pagination class="mt-10" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">-->
<!--      </el-pagination>-->
    </div>
  </el-dialog>
</template>

<script>
import { reactive } from 'vue'
import { erpElTable } from 'hooks'
import { deepCopy } from '@/utils/tool.js'
import { orderList } from '@/api/order/orderManagement.js'
import { useStore } from 'vuex'
import { packageOrderDetails } from '@/api/order/orderDetail.js'
import goodsImg from '@/views/order/orderManagement/components/components/goodsImg.vue'
import { ElMessage } from 'element-plus'
export default {
  emits: ['showCustomInfo', 'close'],
  components: {
    goodsImg,
  },
  setup(props, ctx) {
    const show = true
    const state = reactive({
      filterForm: {
        searchType: 'packageId',
        searchText: null,
				referenceSearch: 1 // 是否是引用订单查询
      }
    })
    const store = useStore()
    const searchTypes = [
      { label: '包裹号', value: 'packageId' },
      { label: '订单号', value: 'orderId' },
      { label: '交易号', value: 'transcationId' }
    ]

    const erpEltableOpts = erpElTable(orderList, state.filterForm, {
      dataFilter: data => {
        const arr = []
        data.forEach(each => {
          Object.assign(each, each.packageRels[0])
					// each.skuList = each.packageSkus.filter(v => v.isShow === 0)
          each.skuList = each.packageSkus
          arr.push(deepCopy(each))
          arr.push(deepCopy(each))
        })
        return arr
      },
      autoSearch: false
    })

    function colspanMethod({ rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return { rowspan: 1, colspan: 5 }
        } else {
          return { rowspan: 0, colspan: 0 }
        }
      }
    }

    function getSkuValue(val) {
      if (val) {
        return JSON.parse(val) || []
      } else {
        return []
      }
    }

    const proverDatas = val => {
      return {
        goods: {
          skuImg: val
        }
      }
    }

    const showPur = (item, row) => {
      const { orderType } = store.getters
      let bole = true
      let typeList = [1, 2, 3, 4, 5, 6, 7]

      if (typeList.indexOf(Number(orderType)) == -1) {
        bole = false
      } else if (row.deductFlag !== 1) bole = false
      return bole
    }

    const pur = item => {
      let text = ''
      switch (item?.packageGoods[0]?.purchaseStatus) {
        case 0:
          text = '未采购'
          break
        case 1:
          text = '采购在途'
          break
        case 2:
          text = `到货 : ${item?.packageGoods[0]?.actualQuantity}`
      }
      return text
    }

    function searchBefore() {
      if (!state.filterForm.searchText || !state.filterForm.searchType) {
        ElMessage.error({ message: '请输入检索内容' });
        return false
      }
			if (!/^(?!(\s+$))/.test(state.filterForm.searchText)) {
				ElMessage.error({ message: '请输入有效的检索内容' });
				return false
			}
      erpEltableOpts.search()
    }

    function closeDialog(flag, row) {
      if (flag) {
        packageOrderDetails({
          packageId: row.packageId
        }).then(r => {
          let nextObj = Object.assign(r.data, r.data.packageRels[0])
					console.log('nextObj===========', nextObj)
          const arr = []
          nextObj.packageSkus.forEach(sku => {
						if (sku.packageSkuMatch) {
							const gds = Object.assign({}, sku.packageSkuMatch)
							gds.price = 0
							gds.goodsQuantity = gds.quantity
							gds.declareAmount = gds.purchasePrice
							gds.warehouseId = 1
							gds.skuObj = (gds.skuValue && JSON.parse(gds.skuValue)) || null
							gds.mainImgUrl = gds.mainImg
							// 组合品是否为赠品
							gds.giftFlag = sku.packageGoods[0].giftFlag
							gds.goodsSku = gds.skuId
							gds.combineType = 2 // 组合品
							arr.push(gds)
						} else {
							sku.packageGoods?.forEach(goods => {
								// 复制报关信息
								const ob = nextObj.packageGoodsDetailsVOs.find(g => g.id === goods.id)
								goods.price = 0
								goods.declareAmount = goods.purchasePrice
								goods.warehouseId = 1
								goods.skuObj = (goods.skuValue && JSON.parse(goods.skuValue)) || null
								goods.mainImgUrl = goods.mainImg
								goods.combineType = 1 // 单品
								Object.assign(goods, ob)
								arr.push(goods)
							})
						}

          })
					nextObj.orderSource = [ undefined, undefined, nextObj.domain ] // 回显订单来源
          nextObj.goodsUpdates = arr
					nextObj.remark = null // 清空备注
          ctx.emit('close', flag, nextObj)
        })
      } else {
        ctx.emit('close', flag, row)
      }
    }

    function showCustomInfo(row) {
      ctx.emit('showCustomInfo', row)
    }

    return {
      show,
      ...state,
      searchTypes,
      ...erpEltableOpts,
      closeDialog,
      colspanMethod,
      getSkuValue,
      proverDatas,
      showPur,
      pur,
      showCustomInfo,
      searchBefore
    }
  }
}
</script>

<style lang="scss" scoped>
.address-div {
  padding: 0px 10px;
  font-size: 12px;
  line-height: 15px;
}
.goods-div {
  padding: 5px 0;
}
.goods-div + .goods-div {
  border-top: 1px solid #ccc;
}
</style>
