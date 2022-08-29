<!--
 * @Descripttion: 
 * @version: 
 * @Author: 韦剑
 * @Date: 2021-07-22 14:38:56
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-22 15:11:25
-->
<template>
	<div>
		<el-affix :offset="110">
			<div class="header">
				<a @click="back()" class="el-icon-arrow-left" style="color: #000"></a>
				<span>批量修改报关信息</span>
			</div>
		</el-affix>
		<div class="pageView">
			<vxe-table ref="myTable" :auto-resize="true" keep-source align="center" :height="tableH" show-overflow :export-config="{}" :scroll-y="{enabled: true, gt: 20}" highlight-hover-row
       :edit-config="{trigger: 'click', mode: 'row', showStatus: true}" :loading="loading" :edit-rules="validRules">
				<vxe-table-column title="主图" width="100">
					<template #default="{ row }">
						<el-image style="width: 60px; height: 60px" :src="row.mainImg" fit="contain"></el-image>
					</template>
				</vxe-table-column>
				<vxe-table-column title="商品SKU" width="200">
					<template #default="{ row }">
						<div class="textOverflow_2">{{row.goodsSku}}</div>
					</template>
				</vxe-table-column>
				<vxe-table-column field="customsInfoCn" title="中文报关名" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '80', clearable: true}}"></vxe-table-column>
				<vxe-table-column field="customsInfoEn" title="英文报关名" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '80', clearable: true}}"></vxe-table-column>
				<vxe-table-column field="customsWeight" title="重量(g)" :edit-render="{name: '$input', props: {type: 'float', placeholder: '请输入', min: 0, max: 999999.99, step: 1, clearable: true}}"></vxe-table-column>
				<vxe-table-column field="customsAmount" title="价格(USD)" :edit-render="{name: '$input', props: {type: 'float', placeholder: '请输入', min: 0, max: 999999.99, step: 1, clearable: true}}"></vxe-table-column>
        <vxe-table-column field="customsMatetial" title="材质" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '60', clearable: true}}"></vxe-table-column>
				<vxe-table-column field="customsPurpose" title="用途" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '60', clearable: true}}"></vxe-table-column>
				<vxe-table-column field="customsCode" title="海关编码" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '20', clearable: true}}"></vxe-table-column>
				<vxe-table-column title="报关属性" width="170">
          <template #default="{ row, _rowIndex }">
						<div class="formBox">
              <div style="text-align: left; position:relative;">
                <el-checkbox v-model="row.checked1" @change="checkboxChange()">含电</el-checkbox>
              </div>
              <div style="text-align: left;">
                <el-checkbox v-model="row.checked2" @change="checkboxChange()">含非液体化妆品</el-checkbox>
              </div>
              <div style="text-align: left;">
                <el-checkbox v-model="row.checked3" @change="checkboxChange()">特货（敏感货）</el-checkbox>
              </div>
              <el-select size="small" v-model="row.select" placeholder="请选择" style="width: 80px;" class="mySelect" @change="checkboxChange(row.select, _rowIndex)">
                <el-option label="内电" :value="0"></el-option>
                <el-option label="纯电" :value="1"></el-option>
              </el-select>
            </div>
					</template>
        </vxe-table-column>
				<vxe-table-column title="永久生效">
          <template #header>
            <div>
              永久生效
              <el-tooltip class="item" effect="dark" content="[永久生效]将对之后所有相同SKU，都应用此报关信息" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </div>
          </template>
          <template #default="{ row, _rowIndex }">
            <el-switch v-model="row.permanent" :active-value="1" :inactive-value="0" @change="switchChange(row, _rowIndex)" />
          </template>
        </vxe-table-column>
				<vxe-table-column title="操作">
          <template #default="{ row, _rowIndex }">
            <div class="operation">
              <el-dropdown>
                <el-button type="text">批量填充</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="bitchEvent(0, row, _rowIndex, row.goodsSku)">所有商品</el-dropdown-item>
                    <el-dropdown-item @click="bitchEvent(1, row, _rowIndex, row.goodsSku)">相同商品</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <div>
                <el-popconfirm title="确定移除该商品吗？" @confirm="del(row.packageGoodsId)">
                  <template #reference>
                    <el-button type="text" style="color: #EC5F74" :disabled="tableData.length <= 1">移除</el-button>
                  </template>
                </el-popconfirm>
              </div>
            </div>
          </template>
        </vxe-table-column>
			</vxe-table>
		</div>
		<div class="footer">
			<div class="left"></div>
			<div class="right">
				<el-button  @click="back()">取消</el-button>
				<el-button type="primary"  style="margin-left: 16px" @click="submitEvent(1)" v-if="$route.query.status != 8">保存并申请运单号</el-button>
				<el-button type="primary"  style="margin-left: 16px" @click="submitEvent(0)">保存</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import { ref, reactive, toRefs, onMounted } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import { customInfobatch, customSavebatch } from '@/api/order/orderManagement.js'
	import { ElMessageBox, ElMessage } from 'element-plus';
	import { storage } from '@/utils/storage.js'
  import { _debounce } from '@/utils/tool.js'
	export default {
		setup() {
      let myTable = ref(null)
			let route = useRoute()
			let BatchCustomsInfo = storage.get('BatchCustomsInfo')
			let packageIds = route.query.packageIds
      let router = useRouter()
			let state = reactive({
				tableData: [],
				validRules: {
					customsInfoCn: [
						{ required: true, message: '请输入中文报关名', trigger: 'blur' }
					],
					customsInfoEn: [
						{ required: true, message: '请输入英文报关名', trigger: 'blur' }
					],
					customsWeight: [
						{ required: true, message: '请输入重量', trigger: 'blur' }
					],
					customsAmount: [
						{ required: true, message: '请输入价格', trigger: 'blur' }
					]
				},
        loading: false,
        tableH: '610'
			})

			// 报关属性发生变化时
			let checkboxChange = () => {
				state.tableData.forEach(item => {
					let customsAttribute = []
					if (item.checked1 && item.select == 0) customsAttribute.push('含电内电')
					if (item.checked1 && item.select == 1) customsAttribute.push('含电纯电')
					if (item.checked2) customsAttribute.push('含非液体化妆品')
					if (item.checked3) customsAttribute.push('特货（敏感货）')
					item.customsAttribute = customsAttribute.join(',')
				})
			}

			// 永久生效发生变化时
			let switchChange = (value, index) => {
				if (value.permanent) { // 同一商品，开关状态只能存在一个为ture
					state.tableData.forEach((item, ind) => {
						if (index !== ind && item.goodsId == value.goodsId) {
							item.permanent = 0
						}
					})
				}
			}

			let initFun = (data) => {
				data.forEach(item => {
					BatchCustomsInfo.forEach(it => {
						if (it.packageIds == item.packageId) {
							item.lgtcLine = it.lgtcLine
							item.logisticsId = it.logisticsId
							item.logistics = it.logistics
						}
					})
					let customsAttribute = item.customsAttribute
					if (customsAttribute) {
						item.checked1 = customsAttribute.indexOf('含电') == -1 ? false : true
						item.checked2 = customsAttribute.indexOf('含非液体化妆品') == -1 ? false : true
						item.checked3 = customsAttribute.indexOf('敏感') == -1 ? false : true
						item.select = customsAttribute.indexOf('内电') !== -1 ? 0 : customsAttribute.indexOf('纯电') !== -1 ? 1 : 0 // 若为undefind则默认为内电
					} else {
						item.checked1 = item.checked2 = item.checked3 = false
						item.select = 0
					}
				})
				return data
			}

			// 获取报关信息列表
			let getCustomInfo = () => {
        state.loading = true
				customInfobatch({packageIds}).then(res => {
					if (res.code == 200) {
						state.tableData = initFun(res.data)
            myTable.value.loadData(state.tableData)
					} else {
						ElMessage.error(res.message)
					}
          state.loading = false
				}).catch(err => {
          state.loading = false
					
				})
			}

			// 批量填充
			let bitchEvent = _debounce((type, itemInfo, ind, goodsSku) => {
				function bitch(item) {
					item.customsInfoCn = itemInfo.customsInfoCn
					item.customsInfoEn = itemInfo.customsInfoEn
					item.customsWeight = itemInfo.customsWeight
					item.customsAmount = itemInfo.customsAmount
					item.customsMatetial = itemInfo.customsMatetial
					item.customsPurpose = itemInfo.customsPurpose
					item.customsCode = itemInfo.customsCode
					item.customsAttribute = itemInfo.customsAttribute
				}
				state.tableData.forEach((item, index) => {
					if (type == 1) { // 相同商品
						if (ind !== index && item.goodsSku == goodsSku) {
							bitch(item, index)
							if (itemInfo.permanent) {
								item.permanent = 0
							} else {
								item.permanent = itemInfo.permanent
							}
						}
					} else { // 所有商品
						if (ind !== index) {
							bitch(item, index)
							if (item.goodsSku == goodsSku && itemInfo.permanent) {
								item.permanent = 0
							} else {
								item.permanent = itemInfo.permanent
							}
						}
					}
				})
				initFun(state.tableData)
				ElMessage.success({ message: '提交成功！', type: 'success' })
			})
      
      // 删除商品
			let del = _debounce((packageGoodsId) => {
				state.tableData = state.tableData.filter(item => item.packageGoodsId !== packageGoodsId)
        myTable.value.loadData(state.tableData)
			})
      
      // 返回
			let back = () => {
				router.push({
        name: 'OrderManagement',
        params: {
          status: '98'
        }
      })
			}

      let saveEvent = _debounce(async (apply) => {
        const errMap = await myTable.value.validate(true).catch(errMap => errMap)
        if (errMap) {
          ElMessage.error('信息填写错误，提交失败')
        } else {
            let params = {
            customGoodsList: state.tableData,
            apply
          }
          customSavebatch(params).then(res => {
            if (res.code == 200) {
              ElMessage.success({ message: '提交成功！', type: 'success' });
              let status;
              if (route.query.status == 1 && apply == 1) {
                status = 2
              } else {
                status = route.query.status
              }
              back()
            } else {
              ElMessage.error(res.message)
            }
          })
        }
			})

      let submitEvent = (apply) => {
        if (route.query.status == 8) {
					ElMessageBox.confirm('确认修改？内容修改后必须[更换运单号]才能生效！', '提示', {
						confirmButtonText: '继续',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(() => {
							saveEvent(apply)
						})
					
				} else {
					saveEvent(apply)
				}
      }

      onMounted(() => {
        state.tableH = document.body.clientHeight - 320 + ''
				getCustomInfo()
			})

			return {
				...toRefs(state),
        myTable,
				back,
				bitchEvent,
				checkboxChange,
				switchChange,
				del,
        submitEvent,
        saveEvent
			}
		}
	}
</script>

<style lang="scss" scoped>
.header {
	height: 76px;
	background-color: #fff;
	display: flex;
	align-items: center;
	padding: 0 24px;
	font-size: 20px;
	.el-icon-arrow-left {
		margin-right: 10px;
	}
}
.pageView {
	margin: 0 0 50px 0;
	.el-form-item {
		margin-bottom: 0px !important;
	}
	.is-error {
		margin-bottom: 20px !important;
	}
	.colorRed {
		color: #ec5f74;
	}
	.mySelect {
		position: absolute;
		left: 60px;
		top: 5px;
	}
  .formBox{
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .operation{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.footer {
	position: fixed;
	width: 100%;
	// bottom: 0;
	top: 100vh;
  right: 0;
  transform: translateY(-100%);
	z-index: 1000;
	width: calc(100% - var(--sideBarWidth));
	height: 52px;
	background-color: #fff;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-top: 1px solid #e8e8e8;
	padding: 0 24px;
}
// :deep(.vxe-cell){
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
:deep(tbody tr) {
  height: 100px;
}
:deep(.vxe-cell, .c--tooltip){
  max-height: 90px !important;
}
:deep(.vxe-header--row){
  background-color: #F5F7FA;
  color: #000
}
</style>