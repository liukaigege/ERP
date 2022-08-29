<!--
* @Descripttion: Vango ERP  exportCustom
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    title="导出定制信息"
    v-model="dialogVisible"
    width="480px"
    @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="container">
      <el-progress :percentage="percentage" v-if="percentage > 0"></el-progress>
      <el-radio-group v-model="exportType">
        <el-radio label="1" size="large">当前查询数据</el-radio>
        <el-radio label="2" size="large">当前勾选数据</el-radio>
      </el-radio-group>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogHandOk" :loading="loading"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { exportCustomized } from '@/api/purchase/outOfStock.js'
import { purchaseProgress } from '@/api/purchase/purchase.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    selectedList: {
			type:Array,
			default:[],
		},
		dataList: {
			type:Array,
			default:[],
		}
  },
  emits: ['closeBack'],
  setup(props, { emit }) {
		let searchParams = {
			type: 2,
			supplierId: null,
			warehouseId: 1,
			skuCode: null,
			goodsId: null,
			goodsName: null,
			supplierName: null
		}
		if(sessionStorage.getItem('searchParams')) searchParams = JSON.parse(sessionStorage.getItem('searchParams'))._value
    const state = reactive({
      percentage: 0,
      dialogVisible: true,
      loading: false,
			exportType:'1',
			timer:null
    })
    function close() {
      emit('closeBack', false)
    }
    function dialogHandOk() {
      if(state.exportType === '1') {
				exportCustomized({query:searchParams,value:'',subType:1}).then(res=>{
					state.loading = true
					state.timer = setInterval(() => {
							getBasicProgress(res.data)
						}, 500)
				})
			}else{
				if(!props.selectedList.length) return ElMessage.warning({ message: '请选择SKU' })
				let idList = []
				props.selectedList.forEach(v=>{
					idList = [...idList,...v.idList]
				})
				console.log(searchParams)
				exportCustomized({query:searchParams,value:idList.join(','),subType:2}).then(res=>{
					state.loading = true
					state.timer = setInterval(() => {
							getBasicProgress(res.data)
						}, 500)
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
						close()
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
    return {
      ...toRefs(state),
      close,
      dialogHandOk
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
