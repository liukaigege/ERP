<!--
 * @Descripttion: 搁置
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-05 10:00:34
-->

<template>
	<div>

		<el-dialog title="导出订单" v-model="dialogVisible" width="40%" @close="close"
							 :close-on-click-modal="false"
							 :close-on-press-escape="false"
		>
			<div class="container">
				<el-progress :percentage="percentage" v-if="percentage>0"></el-progress>

				<el-tabs v-model="activeName" >
					<el-tab-pane label="当前数据导出" name="1">
						<el-radio-group v-model="checked1">
							<el-radio :label="1">当前查询数据</el-radio>
							<el-radio :label="2">当前勾选数据</el-radio>
						</el-radio-group>
					</el-tab-pane>
					<el-tab-pane label="自定义导出" name="2" disabled>
						<el-radio-group v-model="checked2">
							<el-radio :label="1">按采购单号导出</el-radio>
							<el-radio :label="2">按平台单号导出</el-radio>
						</el-radio-group>

						<el-input type="textarea"></el-input>

					</el-tab-pane>

				</el-tabs>

			</div>

			<template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
					>取 消</el-button
					>
          <el-button type="primary"  @click="dialogHandOk" :loading="loading"
					>确 定</el-button
					>
        </span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import {reactive, toRefs, defineProps, defineEmits} from 'vue'
import {ElMessage} from 'element-plus'
import {exportOrder} from '@/api/purchase/outOfStock.js'
import { getuuid } from '@/utils/tool'
import { basicProgress,purchaseProgress } from '@/api/purchase/purchase.js'
const props = defineProps({
	query:Object
})

const emit = defineEmits(['cancel'])

const data = reactive({
	percentage:0,
	activeName:'1',
	dialogVisible:true,
	checked1:1,
	checked2:1,
	timer:null,
	loading:false
})
const {activeName,dialogVisible,checked1,checked2,percentage,loading} = toRefs(data)

function dialogHandOk (){
	data.percentage = 0
	const {selectedList,searchParams} = props.query
	let idList = []
  var params
	if(data.activeName === '1'){
		if(data.checked1 ==1){
      params = searchParams
		}else{
			if (selectedList.length == 0) return ElMessage.error('请勾选SKU')
			idList = selectedList?.map(v => v.id)
      params= {idList}
		}
		exportOrder(params).then(res=>{
			if (res.code == 200) {
				data.timer = setInterval(() => {
					getBasicProgress(res.data)
				}, 500)
				// const {url, msg, flag} = JSON.parse(res.data)
				// if (url) window.open(url)
			}
		})


	}
}

function getBasicProgress(key){
	purchaseProgress({ key }).then(res =>{
		if (res.code == 200) {
			data.percentage = res.data.percent
			// if(res.data.url) {
			// 	data.loading = false
			// 	clearInterval(data.timer)
			// }
			if (res.data.percent == 100 || res.data.url) {
				data.percentage = 100 // 有为99的时候就文件生成了,所以当文件链接出来了,就直接重置成100
				data.loading = false
				clearInterval(data.timer)
				window.open(res.data.url)
				ElMessage.success({ message: '导出成功！', type: 'success' })
			}
		} else {
			data.loading = false
			clearInterval(data.timer)
			ElMessage.error(res.message)
		}

	}).catch(err => {
		data.loading = false
		clearInterval(data.timer)
	})
}


function close(){
	cancel()
}

function cancel() {
	data.dialogVisible = false
	setTimeout(() => {
		emit('cancel')
	}, 500)
}



</script>


<style lang="scss" scoped>
.flex{
	display: flex;
	align-items: flex-start;

}

.titles {
	font-size: 16px;
	font-family: PingFangSC-Regular, PingFang SC;
	color: rgba(0, 0, 0, 0.85);
}
.radioList {
	padding: 24px 112px;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	.radioItem {
		width: 50%;
		margin-bottom: 14px;
	}
}
</style>
