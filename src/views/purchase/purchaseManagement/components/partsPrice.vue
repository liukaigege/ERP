<!--
* @Descripttion: Vango ERP partsPrice.vue
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <el-dialog
      title="配件价格"
      v-model="dialogVisible"
      width="1200px"
      @close="close"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="partsPriceContainer">
        <div class="btnsContainer">
          <el-button
            type="primary"
            :disabled="
              !selectedList.length ||
              selectedList.every(v => v.partList.length > 1)
            "
            @click="innerVisible = true"
            >添加配件</el-button
          >
          <el-button
            type="primary"
            :disabled="!selectedList.length"
            @click="delAllParts"
            >清空配件</el-button
          >
        </div>
        <vxe-table
					keep-source
          ref="ptableRef"
          border
          max-height="1000"
          align="center"
          :data="list"
          :scroll-y="{ gt: 60, oSize: 50 }"
          :checkbox-config="{}"
          show-overflow
          :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }"
          :edit-rules="tableRules"
          :span-method="colSpanMethond"
          @checkbox-all="selectAllChangeEvent"
          @checkbox-change="selectChangeEvent"
        >
          <vxe-column type="checkbox" width="50"></vxe-column>
          <vxe-column title="主件信息" width="250">
            <template #default="{ row }">
              <div class="goodsInfoContainer">
                <div class="images-container">
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
                        class="ml-10"
                        style="width: 70px; height: 70px"
                        :src="row.mainImg"
                        fit="contain"
                      ></el-image>
                    </template>
                  </el-popover>
                </div>
                <div>
                  <p class="shortP" :title="row.orderSku">{{ row.orderSku }}</p>
                  <p>{{ row.currency }} {{ row.price }}</p>
                  <p>x{{ row.goodsQuantity }}</p>
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column field="orderId" title="订单号"> </vxe-column>
          <vxe-column field="partList">
						<template #header>
							<div><span style="color:red;">*&nbsp;</span>配件名称</div>
						</template>
            <template #default="{ row, rowIndex, columnIndex }">
              <div
                class="partsInfoContainer"
                v-for="(v, i) in row.partList"
                :key="i"
              >
                <div class="partsNameContainer">
                  <vxe-input
                    style="width: 100px"
                    v-model.trim="v.partsName"
                    type="text"
                    align="center"
                    maxlength="50"
                  ></vxe-input>
                </div>
                <div class="partsQuantityContainer">
                  <vxe-input
                    style="width: 100px"
                    v-model="v.partsNum"
                    type="number"
                    :max="999"
                    :min="1"
                    align="center"
                  ></vxe-input>
                </div>
                <div class="partsPriceContainer">
                  <vxe-input
                    style="width: 100px"
                    v-model="v.partsPrice"
                    type="number"
                    :max="99999.99"
                    :min="0.01"
										precision="2"
                    align="center"
                  ></vxe-input>
                </div>
                <div class="deleteContainer">
                  <i
                    class="el-icon-delete"
                    @click="delParts({ rowIndex, columnIndex, i })"
                  ></i>
                </div>
              </div>
            </template>
          </vxe-column>
          <vxe-column>
						<template #header>
							<div><span style="color:red;">*&nbsp;</span>配件数量</div>
						</template>
					</vxe-column>
          <vxe-column>
						<template #header>
							<div><span style="color:red;">*&nbsp;</span>配件单价</div>
						</template>
					</vxe-column>
          <vxe-column title="操作">
            <template #default="{ row }">
              <p>
                <el-button type="text" @click="queryInfo(row)"
                  >定制信息</el-button
                >
              </p>
              <el-button
                type="text"
                :disabled="row.partList.length > 1"
                @click="addParts(row)"
                >添加配件</el-button
              >
            </template>
          </vxe-column>
        </vxe-table>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogHandOk">保 存</el-button>
          <el-button @click="dialogVisible = false">退 出</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- add parts dialog -->
    <div v-if="innerVisible">
			<el-dialog
				title="添加配件"
				v-model="innerVisible"
				width="480px"
				@close="closeDialog"
				:close-on-click-modal="false"
				:close-on-press-escape="false"
			>
				<el-form :model="form" label-width="120px" ref="formRef" :rules="rules">
					<el-form-item label="配件名称:" prop="partsName">
						<el-input
							v-model="form.partsName"
							maxlength="50"
							clearable
							style="width: 180px"
						/>
					</el-form-item>
					<el-form-item label="配件数量:" prop="partsNum">
						<el-input
							v-model="form.partsNum"
							clearable
							style="width: 180px"
						/>
					</el-form-item>
					<el-form-item label="配件单价:" prop="partsPrice">
						<el-input
							placeholder="CNY"
							v-model="form.partsPrice"
							clearable
							style="width: 180px"
						/>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="closeDialog">取 消</el-button>
						<el-button type="primary" @click="ok">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
    <CustomInfo
      v-if="!!customInfoData"
      :data="customInfoData"
      :nobtn="true"
      :tabPosition="1"
      @customInfoClose="customInfoClose"
    />
  </div>
</template>
<script>
import { reactive, toRefs, ref } from 'vue'
import { deepCopy } from '@/utils/tool'
import {
  purchasePartsList,
  purchaseAddOrUpdate
} from '@/api/purchase/outOfStock.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import CustomInfo from '../customOder/components/customInfo.vue'
export default {
  components: { CustomInfo },
  props: {
    changePartsPriceData: Object,
		submitType:Number
  },
  emits: ['closeBack'],
  setup(props, { emit }) {
    const form = {
      id: null,
      partsName: null,
      partsNum: null,
      partsPrice: null,
      relId: null,
			emptyPartsShow:false
    }

    const state = reactive({
      dialogVisible: true,
      list: [],
      tableRules: {
        partList: [{ validator: valitorPartList, trigger: 'blur' }]
      },
      innerVisible: false,
      selectedList: [],
      form: deepCopy(form),
      rules: {
        partsName: [
          { required: true, message: '请填写配件名称', trigger: 'blur' }
        ],
        partsNum: [
          { required: true, message: '请填写配件数量', trigger: 'blur' },
          {
            validator(rule, value, callback) {
							let nPartent = new RegExp(/^[1-9]{1}\d{0,2}?$/)
              !nPartent.test(value)
                ? callback(new Error(rule.message))
                : callback()
            },
            message: '配件数量为1-999之间正整数'
          },
        ],
        partsPrice: [
          { required: true, message: '请填写配件单价', trigger: 'blur' },
					{
            validator(rule, value, callback) {
							let numPartent = new RegExp(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/)
							!numPartent.test(value) || value <= 0 || value > 99999.99
                ? callback(new Error(rule.message))
                : callback()
            },
            message: '配件单价为0.01-99999.99之间数字'
          }
        ],
      },
      formRef: null,
      sigleChange: null,
      customInfoData: null,
			ptableRef:null
    })

		function closeDialog(){
			state.sigleChange = null
			state.form = deepCopy(form)
			state.innerVisible = false
		}

		getPurchasePartsList()
    function getPurchasePartsList() {
			let  datas= props.changePartsPriceData.orderInfoList.map(v=>{
				return {suggestId:v.id + '',orderIdList:[v.orderId],type:props.submitType -0 + 1}
			})
      purchasePartsList({paramList:datas}).then(res => {
        if (res.code == 200) {
          state.list = res.data.map(v=>{
						v.emptyPartsShow = false
						return v
					})
        } else {
          ElMessage.warning({ message: res.message })
        }
      })
    }
    function close() {
      emit('closeBack', false)
    }
    async function dialogHandOk() {
      //符合条件
			new Promise((resolve, reject) => {
				state.ptableRef.validate(true, res => {
						if (res) {
							ElMessage.warning({ message: '配件信息必填' })
							reject(false)
						} else {
							resolve(true)
							let disabledStatus = 0
							let numberStatus = false
							let repeatName = false
							let orderRepeatName = false
							const partInfoList = state.list.map(v => {
								if(!orderRepeatName && valitorBlur(v,false)) orderRepeatName = valitorBlur(v,false)
								if(!repeatName)
									if(v.partList && v.partList.length) {
										v.partList.forEach(a=>{
											state.list.forEach(val=>{
												if(val.partList && val.partList.length) {
													val.partList.find(item=>{
														if(item.partsName == a.partsName && item.partsPrice != a.partsPrice) {
															console.log(item,a)
															repeatName = a.partsName
														}
													})
												}
											})
										})
										if(v.partList.some(it => !it.partsName)) disabledStatus = 1
										if(v.partList.some(it => !it.partsNum)) disabledStatus = 2
										if(v.partList.some(it => !it.partsPrice)) disabledStatus = 3
										let nPartent = new RegExp(/^[1-9]{1}\d{0,2}?$/)
										if(v.partList.some(it => it.partsNum && !nPartent.test(it.partsNum))) numberStatus = true
									}
									const obj = {
										id: v.relId,
										partList: v.partList?.map(a=>{
											a.relId = v.relId
											return a
										}) || []
									}
								return obj
							})
							if(orderRepeatName) return ElMessage.warning({ message: `同一订单内的两个配件名称不可重复，请核实订单【${orderRepeatName}】数据！` })
							if(repeatName) return ElMessage.warning({ message: `相同配件名称配件单价需保持一致，请核实配件【${repeatName}】数据！` })
							if(disabledStatus === 1) {
								return ElMessage.warning({ message: '请输入配件名称' })
							} else if(disabledStatus === 2) {
								return ElMessage.warning({ message: '请输入配件数量' })
							} else if(disabledStatus === 3) {
								return ElMessage.warning({ message: '请输入配件单价' })
							}
							if(numberStatus) return ElMessage.warning({ message: '配件数量为1-999正整数' })
							purchaseAddOrUpdate({ partInfoList }).then(res => {
								if (res.code == 200) {
									ElMessage.success({ message: res.message })
									emit('closeBack', state.list)
								} else {
									ElMessage.warning({ message: res.message })
								}
							})
						}
					})
			})
    }
		function valitorBlur(row,tips = true){
			if(row.partList.length === 2 && row.partList[0].partsName === row.partList[1].partsName) {
				if(tips) ElMessage.warning({ message: `同一订单内的两个配件名称不可重复，请核实订单【${row.orderId}】数据！` })
				return row.orderId
			}
			return false
		}
    function valitorPartList({ cellValue, rule, row,column }) {
			// if(row.partList.some(v=>!v.partsName)) return new Error('请输入配件名称')
			// if(row.partList.some(v=>!v.partsNum)) return new Error('请输入配件数量')
			// if(row.partList.some(v=>!v.partsPrice)) return new Error('请输入配件单价')
			if(row.partList.some(v=>!v.partsName || !v.partsNum || !v.partsPrice)) return false
    }

    function colSpanMethond({ row, rowIndex, columnIndex }) {
      if (columnIndex == 3) {
        return { rowspan: 1, colspan: 3 }
      } else if (columnIndex == 4) {
        return { rowspan: 0, colspan: 0 }
      } else if (columnIndex == 5) {
        return { rowspan: 0, colspan: 0 }
      }
    }
    function ok() {
      state.formRef.validate(val => {
        if (val) {
					state.form.emptyPartsShow = false
          if (state.sigleChange) {
            // 单条加配件
            state.form.relId = state.sigleChange.relId
            if (state.sigleChange.partList.length < 2){
							if(state.sigleChange.partList.some(v=>v.partsName === state.form.partsName)) ElMessage.warning({ message: `同一订单内的两个配件名称不可重复，请核实订单【${state.sigleChange.orderId}】数据！` })
							else state.sigleChange.partList.push(deepCopy(state.form))
						}
          } else {
            // 批量新加配件
						let canNotStatus = false
            state.list.forEach(v => {
							if(state.selectedList.some(a=>a.orderId == v.orderId && a.relId == v.relId)){
								state.form.relId = v.relId
								if (v.partList.length < 2) {
									if(v.partList.some(it=>it.partsName === state.form.partsName)) canNotStatus  = true
									else v.partList.push(deepCopy(state.form))
									// if(v.partList.every(it=>it.partsName != state.form.partsName)) v.partList.push(deepCopy(state.form))
								}
							}
            })
          }
          state.innerVisible = false
					closeDialog()
        }
      })
    }
    function selectAllChangeEvent(val) {
      state.selectedList = val.records
    }
    function selectChangeEvent(val) {
      state.selectedList = val.records
    }
    function addParts(val) {
      state.sigleChange = val
      state.innerVisible = true
    }
    function delParts(val) {
      if (val) {
        state.list[val.rowIndex].partList.splice(val.i, 1)
      } else {
        state.list.forEach(v => {
          if (state.selectedList.some(it => it.orderId === v.orderId))
            v.partList = []
        })
      }
    }
    function delAllParts() {
      delParts(false)
    }

    function queryInfo(val) {
      state.customInfoData = val
    }
    function customInfoClose() {
      state.customInfoData = null
    }
    return {
      ...toRefs(state),
      ok,
      close,
      addParts,
      delParts,
      queryInfo,
			valitorBlur,
			closeDialog,
      delAllParts,
      dialogHandOk,
      valitorPartList,
      colSpanMethond,
      selectAllChangeEvent,
      selectChangeEvent,
      customInfoClose
    }
  }
}
</script>
<style lang='scss' scoped>
:deep(.vxe-table--render-default .vxe-body--column.col--ellipsis > .vxe-cell) {
  max-height: 300px;
}
.btnsContainer {
  margin-bottom: 20px;
}
.goodsInfoContainer {
  display: flex;
  align-items: center;
  padding-top: 10px;
}
.partsInfoContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  .partsNameContainer,
  .partsQuantityContainer {
    width: 135px;
  }
  .partsPriceContainer {
    width: 100px;
  }
  .deleteContainer:hover {
    cursor: pointer;
    opacity: 0.75;
  }
}
.emptyParts{
	color: red;
	text-align: center;
}
.shortP{
	width: 140px;
	white-space: nowrap;
	overflow: hidden;
	-o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.images-container{
	margin-right: 10px;
}
</style>
