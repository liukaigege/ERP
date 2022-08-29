<!--
 * @Descripttion: 匹配商品
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-25 15:35:09
-->

<template>
  <div class="matchOrder" v-dragDialog>
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="900px"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"

    >
      <div class="container">
        <el-tabs
          tab-position="top"
          v-model="form.combineType"
          @tab-click="searchFn"

        >
          <el-tab-pane 	:disabled="clickTab" label="单品" name="1"></el-tab-pane>
          <el-tab-pane 	:disabled="clickTab" label="组合品" name="2"></el-tab-pane>
          <el-tab-pane 	:disabled="clickTab" label="其他" name="3"></el-tab-pane>
        </el-tabs>
				<div 	v-loading="clickTab">
					<div v-if="form.combineType == '3'">
						<div class="tableHeader">
							<el-row>
								<el-col class="titleBox" :span="4">
									<span class="title">商品</span>
								</el-col>
								<el-col class="inputBox" :span="20">
									<el-input
										v-model="searchData.searchText"
										:placeholder="form.combineType == '3'?'请输入商品名称或者商品编码':'请输入商品名称或者SKU'"

										:maxlength="300"
									>
										<template #suffix>
											<i class="el-icon-search" @click="getMatchingList"></i>
										</template>
									</el-input>
								</el-col>
							</el-row>
						</div>
						<div class="listContainer">
							<el-table
								:data="tableList"
								style="width: 100%"
								:show-header="false"
							>
								<el-table-column width="100">
									<template #default="scope">
										<el-popover
											placement="right-start"
											trigger="hover"
											width="auto"
										>
											<el-image
												style="width: 200px; height: 200px"
												:src="scope.row.mainImgUrl"
												fit="contain"
											></el-image>
											<template #reference>
												<el-image
													class="ml-10"
													style="width: 70px; height: 70px"
													:src="scope.row.mainImgThumbUrl"
													fit="contain"
												></el-image>
											</template>
										</el-popover>
									</template>
								</el-table-column>
								<el-table-column>
									<template #default="scope">
										<div class="titleName" :title="scope.row.goodsName">
											{{ scope.row.goodsName }}
										</div>
										<div>{{ scope.row.goodsId }}</div>
										<div>
											开发人：{{
												scope.row.createUserName
											}}&nbsp;&nbsp;&nbsp;申请人：{{ scope.row.applyUserName }}
										</div>
										<div class="titleName" :title="scope.row.refuseReson">
											打回原因:{{ scope.row.refuseReson }}
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
						<el-pagination
							:total="total"
							:current-page="searchData.page.pageNo"
							@size-change="changeSizeChange"
							@current-change="changeCurrentChange"
							:page-size="searchData.page.pageSize"
							layout="total, sizes, prev, pager, next, jumper"
						>
						</el-pagination>
					</div>
					<div v-else>
						<div class="tableHeader">
							<el-row>
								<el-col class="titleBox" :span="4">
									<span class="title">商品</span>
								</el-col>
								<el-col class="inputBox" :span="20">
									<el-input
										v-model="form.search"
										placeholder="请输入商品名称或者SKU"

										:maxlength="200"
									>
										<template #suffix>
											<i class="el-icon-search" @click="search"></i>
										</template>
									</el-input>
								</el-col>
							</el-row>
						</div>

						<div class="listBox">
							<div class="table" width="100%" v-if="tableData.length > 0">
								<div
									:class="form.combineType == '1' ? 'td' : 'td overflow'"
									v-for="(item, index) in tableData"
									:key="index"
								>
									<div class="goodsItem">
										<el-row>
											<el-col :span="5">
												<el-popover
													placement="right"
													:width="240"
													trigger="hover"
												>
													<goodsImg :data="proverData(item)" />
													<template #reference>
														<div class="img">
															<img :src="item.mainImgUrl" alt="" />
														</div>
													</template>
												</el-popover>
											</el-col>
											<el-col :span="15">
												<div class="info">
													<p :title="item.goodsName" class="info_title">
														{{ item.goodsName }}
													</p>
													<p
														:title="item.skuCode"
														class="info_txt"
														style="margin-bottom: 5px; color: rgba(0, 0, 0, 0.85)"
													>
														{{ item.skuCode }}
													</p>

													<div v-if="item.skuValue !=='[]'">
														<div
															class="info_sku"
															:title="getSkuValue(item.skuValue)"
														>
															{{ getSkuValue(item.skuValue) }}
														</div>
													</div>
													<div v-if="item.skuValueEn  !=='[]'">
														<div
															class="info_sku"
															:title="getSkuValue(item.skuValueEn)"
														>
															{{ getSkuValue(item.skuValueEn) }}
														</div>
													</div>

													<p class="info_txt" v-if="form.combineType == '1'">
														CNY {{ item.declareAmount }}
													</p>

													<div v-else-if="item.skuCoef">
														<p
															class="info_txt"
															v-for="(a, b) in item?.skuCoef?.split(',') || []"
															:key="b"
															:title="a"
														>
															<span v-if="b < 2"> {{ a }}</span>
														</p>

														<el-popover
															placement="right"
															:width="300"
															trigger="hover"
															v-if="item?.skuCoef?.split(',').length > 2"
														>
															<p
																class="info_txt"
																v-for="(a, b) in item?.skuCoef?.split(',') || []"
																:key="b"
																:title="a"
															>
																{{ a }}
															</p>

															<template #reference>
																<el-button type="text"
																>查看全部</el-button
																>
															</template>
														</el-popover>
													</div>
													<!-- <p class="info_txt">库存: 22818（万众智谷仓库）</p> -->
												</div>
											</el-col>
											<el-col
												:span="4"
												style="
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                      "
											>
												<el-button type="text" @click="select(item.skuId)">
                        <span
													:style="
                            selected == item.skuId
                              ? 'color:#9e9e9e'
                              : 'color:#1890FF'
                          "
												>
                          {{ item.skuId == selected ? '已选择' : '选择' }}
                        </span>
												</el-button>
												<p class="price" v-if="form.combineType == '2'">
													CNY {{ item.declareAmount }}
												</p>
											</el-col>
										</el-row>
									</div>
								</div>
							</div>

							<p class="noMore" v-else>没有此商品，请确认输入内容是否正确</p>
						</div>

						<!-- <div class="pagin">
						<el-pagination
						background
						layout="prev, pager, next"
						:total="1000">
					</el-pagination>
					</div> -->

						<div class="flex-pagination">
							<div></div>
							<el-pagination
								@size-change="handleSizeChange"
								@current-change="handleCurrentChange"
								:current-page="pagination.currentPage"
								:page-sizes="pagination.pageSizes"
								:page-size="pagination.pageSize"
								layout="total, sizes, prev, pager, next, jumper"
								:total="pagination.totalCount"
							>
							</el-pagination>
						</div>
					</div>
				</div>

      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button  @click="cancel">取 消</el-button>
          <el-button
            type="primary"

            @click="dialogHandOk"
            :disabled="selected && form.combineType != '3' ? false : true"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance, inject, onMounted } from 'vue'
import {
  goodsBases,
  saveGoodsBases,
  matchingList,
  matchAddPackageGoods
} from '@/api/order/orderManagement.js'
import goodsImg from '@/views/order/orderManagement/components/components/goodsImg.vue'
import { debounce } from '@/utils/tool.js'
import { erpElTable } from 'hooks'
export default {
  components: { goodsImg },
  props: {
    dialog: {
      type: Object,
      default: null
    },
    dialogTitle: {
      type: String,
      default: '提示'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '50%'
    },
    data: {
      type: Object,
      default: null
    },
    returnStatus: {
      //是否将结果返回
      type: Boolean,
      default: false
    },
    matchingStatus:{
      // 匹配商品状态 1.待审核匹配商品 2.待处理订单-解除匹配后-再次匹配商品-匹配当前包裹 3.待处理订单-解除匹配后-再次匹配商品-匹配所有包裹
      type:Number,
      default:1
    },
    packageSkuId : Number,
    excludeSkuIds:{
      type:Array,
      default:[]
    },
    orderStatus:{
      // 包裹状态： 0待审核、1待处理、2申请中、3申请失败、 4申请成功、5待打单有货、6带打单缺货、7待发货、8已发货、9未付款、-1更换物流待处理、-2更换待打单、-3更换待发货、-4更换交运成功
      type: Number,
      default: 0
    }
  },

  setup(props, context) {
    const { proxy } = getCurrentInstance()
    if (!props.returnStatus) {
      var orderTable = inject('orderTable')
      // 获取的orderTable 组件
      var formOptions = inject('formOptions')
      // 获取的formOptions 组件
    }
    const data = reactive({
      form: {
        search: '',
        combineType: '1',
        warehouseId: null,
        skuTypeFlag: props.orderStatus == 0 ? 3 : null,
        excludeSkuIds: props.excludeSkuIds,
				skuTypeFlag: 3
      },

      selected: '',
      tableList: [],
      searchData: {
        searchText: '',
        skuTypeFlag: props.orderStatus == 0 ? 3 : null,
        page: {
          pageNo: 1,
          pageSize: 10
        }
      },
      total: 0,
			clickTab:false
    })
    function getMatchingList() {
      matchingList(data.searchData).then(res => {
        data.tableList = res.data.dataList
        data.total = res.data.page.totalCount
				data.clickTab = false
      })
    }
    function changeSizeChange(val) {
      data.searchData.page.pageSize = val
      getMatchingList()
    }
    function changeCurrentChange(val) {
      data.searchData.page.pageNo = val
      getMatchingList()
    }

    const {
      tableData,
      search,
      pagination,
      handleSizeChange,
      handleCurrentChange
    } = erpElTable(goodsBases, data.form, {
      pagination: {
        pageSizes: [10, 20, 30, 40, 100],
        pageSize: 10
      },
			callBack:()=>{
				data.clickTab = false
			}
    })

    const getList = () => {
      const param = {
        search: data.keyWord
      }
      goodsBases(param).then(res => {
        if (res.code == 200) {
          data.list = res.data
        }
      })
    }

    const dialogHandOk = debounce(() => {
      if (!data.selected) {
        proxy.$message.error('请输入选择匹配的商品!')
        return
      }

      let item = tableData.value.find(v => v.skuId == data.selected)



      // const saveGoodsBaseDTo = {
      // 	sku: props.data.query.sku,
      // 	customization: props.data.query.customization,
      // 	skuId: data.selected
      // }

      if(props.matchingStatus == 2) {
        const obj = {...item,...{goodsQuantity:1,exportId:null,giftFlag:0,packageSkuId:props.packageSkuId,currentFlag:1}}
        // param = {
        //   type: props.matchingStatus - 1,
        //   packageSkuId: props.packageSkuId,
        //   saveGoodsBaseDTO: param
        // }
        matchAddPackageGoods(obj).then(res => {
          if (res.code == 200) {
            proxy.$message.success(res.message)
            proxy.$parent.dialogVisible = false
            if (props.returnStatus) {
              // 返回一个值给父组件
              context.emit('initPages', true)
              context.emit('close', false)
            } else {
              formOptions.value.init() // 刷新列表
            }
          }
        })
      }else{
        const {
          skuId,
          goodsName,
          goodsSku,
          mainImgUrl,
          customsInfoCn,
          customsInfoEn,
          declareAmount,
          customsWeight,
          customsCode,
          customsPurpose,
          customsMatetial,
          customsAttribute,
          customsAmount,
          skuType,
					enableCustom
        } = item
        let param = {
          sku: props.data.query.sku,
          skuId,
          goodsName,
          goodsSku,
          mainImgUrl,
          customsInfoCn,
          customsInfoEn,
          declareAmount,
          customsWeight,
          customsCode,
          customsPurpose,
          customsMatetial,
          customsAttribute,
          customsAmount,
          combineType:Number(data.form.combineType),
          customization: enableCustom,
          currentFlag:props.matchingStatus == 3 ? 0 : 1
        }
        saveGoodsBases(param).then(res => {
          if (res.code == 200) {
            proxy.$message.success(res.message)
            proxy.$parent.dialogVisible = false
            if (props.returnStatus) {
              // 返回一个值给父组件
              context.emit('initPages', true)
              context.emit('close', false)
            } else {
              formOptions.value.init() // 刷新列表
            }
          }
        })
      }
    })
    const close = () => {
      proxy.$parent.dialogVisible = false
      context.emit('close', false)
    }
    const cancel = () => {
      proxy.$parent.dialogVisible = false
      context.emit('close', false)
    }

    const select = id => {
      if (data.selected == id) {
        data.selected = ''
        return
      }
      data.selected = id
    }

    const proverData = item => {
      return {
        goods: {
          skuImg: item.mainImgUrl
        }
      }
    }

    const getSkuValue = value => {
      let sku = ''
      if (value) {
        sku = JSON.parse(value).reduce((prev, item) => {
          let i = (item.spe ? item.spe + ':' : '') + item.speVal
          return prev + '  ' + i
        }, '')
      }
      return sku
    } // 渲染skuValue

    const searchFn = () => {
			data.clickTab = true
      if (data.form.combineType == '3') {
        getMatchingList()
      } else {
        search()

      }
    }

    onMounted(() => {
			data.clickTab = true
		})

    return {
      ...toRefs(data),
      dialogHandOk,
      cancel,
      close,
      getList,
      select,
      search,
      searchFn,
      proverData,
      tableData,
      pagination,
      handleSizeChange,
      handleCurrentChange,
      getSkuValue,
      getMatchingList,
      changeSizeChange,
      changeCurrentChange
    }
  }
}
</script>

<style lang="scss" scoped>
.matchOrder {
  cursor: pointer;
}
.tableHeader {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  padding: 5px 10px;
  border-bottom: none;

  .titleBox {
    display: flex;
    align-items: center;
    padding: 0 20px;
  }
  .inputBox {
  }
  .title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
}
.goodsItem {
}
.titleName {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.listBox {
  max-height: 400px;
  overflow-y: scroll;
  .img {
    min-width: 60px;
    height: 60px;
    img {
      width: auto;
      height: auto;
      max-width: 60px;
      max-height: 60px;
      margin: 0 auto;
    }
  }
  .info {
    margin-left: 14px;
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .info_title {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .info_txt {
      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.45);
    }
    .info_sku {

      font-size: 12px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.45);
      display: -webkit-box; /*将对象转为弹性盒模型展示*/
      -webkit-box-orient: vertical; /*设置弹性盒模型子元素的排列方式*/
      -webkit-line-clamp: 2; /*限制文本行数*/
      overflow: hidden;
    }
  }
}

.price {
  font-size: 12px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.45);
}

.table {
  border-spacing: 0; /*去掉单元格间隙*/
  border-top: 1px solid #e8e8e8;
  border-left: 1px solid #e8e8e8;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  .td {
    padding: 10px 24px;
    border-bottom: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
    width: 50%;
  }
}

.pagin {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.noMore {
  text-align: center;
  margin-top: 20px;
}
.tableHeader {
  :deep(.el-icon-search) {
    line-height: 32px;
  }
}
.listContainer {
  max-height: 400px;
  border: 1px solid #e8e8e8;
  overflow: auto;
  margin-bottom: 20px;
}
</style>
