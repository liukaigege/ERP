<!--
* @Descripttion: Vango ERP
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="导出建议"
    v-model="exportShow"
    width="800px"
    @close="closeModal"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
  >
    <div class="container">
      <el-progress :percentage="percentage" v-if="percentage > 0"></el-progress>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="当前数据导出" name="first">
          <el-radio-group v-model="exportType">
            <el-radio label="1" size="large">当前查询数据</el-radio>
            <el-radio label="2" size="large">当前勾选数据</el-radio>
          </el-radio-group>
          <div>
            <span>选择模板：</span>
            <el-select filterable v-model="modalType" class="m-2" placeholder="请选择" @change="typeChange" clearable>
              <el-option
                v-for="item in exportTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
					<div class="tableContainer">
          <draggable
            class="list-group tableDataContainer"
            tag="transition-group"
            :component-data="{
              tag: 'ul',
              type: 'transition-group',
              name: 'tr'
            }"
            v-model="tableData"
            v-bind="dragOptions"
            @start="drag = true"
            @end="drag = false"
            :item-key="itemKey"
            group="leftList"
          >
            <template #item="{ element }">
              <li class="tableDataList clearfix" :key="element.nameCn">
                <div class="tableDataListLeft">
                  <p>{{ element.nameCn }}</p>
                  <el-checkbox
                    v-model="element.checkAll"
										:indeterminate="!(element.list.every(v=>v.checked) || element.list.every(v=>!v.checked))"
                    @change="
                      handleCheckAllChange(element.nameEn, element.checkAll)
                    "
                  >
                    全选
                  </el-checkbox>
                </div>
                <div class="fr tableDataListRight">
                  <draggable
                    class="list-group"
                    tag="transition-group"
                    :component-data="{
                      tag: 'div',
                      type: 'transition-group',
                      name: element.nameEn
                    }"
                    v-model="element.list"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                    :item-key="itemKey"
                    :group="
                      element.nameEn == 'remarkInfo'
                        ? 'remarkInfo'
                        : 'unremarkInfo'
                    "
                  >
                    <template #item="{ element: item }">
                      <el-checkbox
                        :key="item.nameCn"
                        v-model="item.checked"
                        :class="item.nameEn == 'mainImg' ? 'redColor' : ''"
                        @change="
                          handleCheckedRightChange(
                            element.nameEn,
                            item.nameEn,
                            item.checked
                          )
                        "
                      >
                        <p
                          :title="item.nameCn ? item.nameCn : item.nameEn"
                          class="listStr"
                        >
                          {{ item.nameCn ? item.nameCn : item.nameEn }}
                        </p>
                      </el-checkbox>
                    </template>
                  </draggable>
                </div>
              </li>
            </template>
          </draggable>
        </div>
        </el-tab-pane>
        <el-tab-pane
          label="自定义导出"
          name="second"
          :disabled="true"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="exportShow = false">取 消</el-button>
        <el-button type="primary" @click="dialogHandOk" :loading="loading"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs, computed, watch } from 'vue'
import { exportInfos, exportItems, exportOrder } from '@/api/purchase/outOfStock.js'
import { purchaseProgress } from '@/api/purchase/purchase.js'
import { deepCopy } from '@/utils/tool.js'
import { ElMessage } from 'element-plus'
import draggable from 'vuedraggable'
export default {
  props: {
		btnType: String,//outStockBtnOne 正常采购 & outStockBtnTwo 搁置中
    types: {
      type: Number,
      default: 4
    }, //模板类型（1 标准订单 2商品开发已报价 3商品管理 4缺货采购 5采购单 6采购对账 7对账申请）
		status:{// 0普通商品 1定制商品
			type:String,
			default:'0'
		},
		selectedList:{
			type:Array,
			default:[]
		},
  },
	emits:['closeBack'],
	components: { draggable },
  setup(props, { emit }) {
		console.log('outStockBtnOne 正常采购 & outStockBtnTwo 搁置中',props.btnType)
		let searchParams = {
			type: 2,
			supplierId: null,
			warehouseId: 1,
			skuCode: null,
			goodsId: null,
			goodsName: null,
			supplierName: null
		}
		if(sessionStorage.getItem('searchParams')) searchParams = JSON.parse(sessionStorage.getItem('searchParams'))
    const state = reactive({
      activeName: 'first', //是否自定义
      exportShow: true, //导出弹框是否显示
      exportType: '1', //导出类型
      percentage: 0, //进度条
      loading: false, //按钮loading效果开关
      modalType: null, //选择模板类型
			exportTypeList:[],//导出类型下拉列表
			tableData:[],//导出数据列表
			timer:null,
			uuid: null,
    })
		const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    })
    exportInfos({
      type: props.types
    }).then(res => {
			state.exportTypeList = res.data
    })
		exportItems({type: props.types}).then(res => {
			if (res.code == 200) {
          state.tableData = deepCopy(res.data.purchaseSuggest)
          state.tableData?.forEach(item =>{
            	item.list?.forEach(v => (v.checked = false))
						})
        } else {
          ElMessage.warning({ message: res.message })
        }
    })
    function closeModal() {
      emit('closeBack',false)
    }
    function dialogHandOk() {
			// exportOrder state.tableData
			const fieldArray = []
			state.tableData.forEach(val => {
				val.list.forEach(v=> {
					if(v.checked) fieldArray.push(v.nameEn)
				})
			})
			if(fieldArray.length === 0) return ElMessage.warning('请选择导出内容')
			state.uuid = new Date().getTime() + ''
      state.percentage = 0
			const {selectedList} = props
			let idList = []
			var params = {
				type:props.status - 0,// 0普通商品 1定制商品
				value:null,//自定义查询内容
				subType:state.exportType - 0,//1当前查询数据 2当前勾选数据
				uuid: state.uuid,
				fieldArray,
				status:props.btnType === 'outStockBtnTwo' ? 0 : 1 // outStockBtnOne 正常采购 & outStockBtnTwo 搁置中
			}
			if(state.activeName === 'first'){
				if(state.exportType =='1'){
					params = {...searchParams._value,...params}
				}else{
					if (selectedList.length == 0) return ElMessage.error('请选择导出数据')
					if(props.status == '1'){
						// 0普通商品 1定制商品
						selectedList?.forEach(v => {
							idList = [...idList,...v.idList]
						})
					}else{
						idList = selectedList?.map(v => v.id)
					}
					params= {...params,idList}
				}
				exportOrder(params).then(res=>{
					if (res.code == 200) {
						state.timer = setInterval(() => {
							getBasicProgress(res.data)
						}, 500)
					}
				})

			}
    }
		function getBasicProgress(key){
			purchaseProgress({ key }).then(res =>{
				if (res.code == 200) {
					state.percentage = res.data.percent
					if (res.data.percent == 100 || res.data.url) {
						state.percentage = 100 // 有为99的时候就文件生成了,所以当文件链接出来了,就直接重置成100
						state.loading = false
						clearInterval(state.timer)
						window.open(res.data.url)
						ElMessage.success({ message: '导出成功！', type: 'success' })
						emit('closeBack',false)
					}
				} else {
					state.loading = false
					clearInterval(data.timer)
					ElMessage.error(res.message)
				}

			}).catch(err => {
				state.loading = false
				clearInterval(state.timer)
			})
		}
    function handleClick(tab, event) {
      console.log(tab, event)
    }
		const itemKey = e => {
      return e
    }
		// 选择了全选
    const handleCheckAllChange = (id, val) => {
      state.tableData
        .filter(item => item.nameEn == id)[0]
        ?.list?.forEach(v => (v.checked = val))
    }

		// 右边多选框选择
    const handleCheckedRightChange = (parentNameEn, nameEn, val) => {
      let childrenList = state.tableData.filter(
        item => item.nameEn == parentNameEn
      )[0].list
      if (
        childrenList.length ==
        childrenList.filter(v => v.checked == true).length
      ) {
        state.tableData.filter(
          item => item.nameEn == parentNameEn
        )[0].checkAll = true
      } else {
        state.tableData.filter(
          item => item.nameEn == parentNameEn
        )[0].checkAll = false
      }
    }


		function typeChange(){
			if (
        state.exportTypeList.filter(
          v => v.id == state.modalType
        ).length
      ) {
        let list = state.exportTypeList
          .filter(v => v.id == state.modalType)[0]
          .field.split('|')
        let obj = {}
        let sortList = []
        list.forEach(v => {
          sortList.push((obj[v.split(':')[0]] = v.split(':')[0]))
          obj[v.split(':')[0]] = v.split(':')[1].split(',')
        })
        state.tableData?.forEach(v => (v.checkAll = false))
        for (var i = sortList.length - 1; i >= 0; i--) {
          state.tableData = [
            ...state.tableData.filter(v => v.nameEn == sortList[i]),
            ...state.tableData.filter(v => v.nameEn != sortList[i])
          ]
        }
        state.tableData?.forEach((item, index) => {
          item.list?.forEach(v => (v.checked = false))
          let tempList = []
          if (obj[item.nameEn])
            obj[item.nameEn]?.forEach(v => {
              item.list?.forEach(key => {
                if (key.nameEn == v) {
                  key.checked = true
                  tempList.push(key)
                }
              })
            })
          item.list = [
            ...tempList,
            ...item.list.filter(val => val.checked == false)
          ]
          if (tempList.length == item.list.length) item.checkAll = true
        })
      }else{
				console.log(state.tableData)
				state.tableData?.forEach(item => {
					item.checkAll = false
          item.list?.forEach(v => (v.checked = false))
				})
			}
		}
    return {
			itemKey,
			typeChange,
      closeModal,
      handleClick,
			dragOptions,
      dialogHandOk,
			handleCheckAllChange,
			handleCheckedRightChange,
      ...toRefs(state)
    }
  }
}
</script>
<style lang='scss' scoped>
.tableContainer {
      margin-top: 10px;
      .tableDataContainer {
        border: 1px solid #e8e8e8;
        background-color: #f5f7fa;
        box-sizing: border-box;
        border-bottom: none;
        max-height: 350px;
        overflow: auto;
        .tableDataList {
          line-height: 32px;
          border-bottom: 1px solid #e8e8e8;
          position: relative;
          .tableDataListLeft {
            box-sizing: border-box;
            text-align: center;
            padding: 10px 0;
            width: 10%;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            p {
              font-weight: bold;
            }
          }
          .tableDataListRight {
            width: 90%;
            min-height: 84px;
            box-sizing: border-box;
            padding: 0 10px;
            border-left: 1px solid #e8e8e8;
            background-color: #fff;
            position: relative;
          }
        }
      }
    }
	.list-group{
		display: flex;
		flex-wrap: wrap;
		.listStr{
			width: 125px;
			overflow: hidden;
			white-space: nowrap;
			-o-text-overflow: ellipsis;
			text-overflow: ellipsis;
		}
	}
	.redColor{
		color: red;
	}
</style>
