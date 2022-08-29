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

		<el-dialog title="移入搁置" v-model="dialogVisible" width="40%" @close="close"
							 :close-on-click-modal="false"
							 :close-on-press-escape="false"
		>
			<div class="container">
				<div class="content">
					<p class="titles">请选择搁置原因</p>

					<div class="radioList">
						<div
							class="radioItem"
							v-for="(item, index) in radioList"
							:key="index"
						>
							<el-radio v-model="checked" :label="item.id">{{
									item.lable
								}}</el-radio>
						</div>
					</div>
				</div>

				<div v-if="checked == 12" style="display: flex;align-items: center;justify-content: center">
					<span style="color:red;">*&nbsp;</span><span>搁置原因:</span>
					<el-input type="textarea" maxlength="30" v-model="otherRemark"
										style="margin-left: 10px;width: 70%"></el-input>

				</div>
			</div>

			<template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
					>取 消</el-button
					>
          <el-button type="primary"  @click="dialogHandOk"
					>确 定</el-button
					>
        </span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup>
import { reactive, toRefs, defineProps,defineEmits } from 'vue'
import {setShelve} from '@/api/purchase/outOfStock.js'
import {ElMessage} from 'element-plus'
const props = defineProps({
	query:Object,
	status:{
		type:Number,
		default:0
	}
})
console.log(props.status)
const emit = defineEmits(['cancel','ok'])

const data = reactive({
	checked: 1,
	dialogVisible:true,
	otherRemark:null,
	radioList: [
		{
			lable: '采购不到',
			id: 1
		},
		{
			lable: '其他',
			id: 12
		},

	]
})
const {checked,radioList,dialogVisible,otherRemark} = toRefs(data)

function dialogHandOk (){
			let idList = []
			let skuIdList = []
			props.query.selectedList?.forEach(item=>{
				if(item.idList&&item.idList.length){
					idList = [...idList,...item.idList]
				}else{
					idList.push(item.id)
				}
				skuIdList.push(item.skuId)
			})
			let statusDesc = null
			if(data.checked === 12) {
				if(!data.otherRemark) return ElMessage.error('请输入搁置原因')
				statusDesc = data.otherRemark
			}else{
				statusDesc = data.radioList.find(v=>v.id === data.checked).lable
			}

			const param = {
				skuIdList,
				idList,
				status:0,
				statusDesc,
				customization:props.status
			}
	setShelve(param).then(res=>{
			console.log(res)
		if(res.code == 200) {
			ElMessage.success('操作成功')
			cancel()
			emit('ok')
		}
	})
}


function close(){
	cancel()
}

function cancel(){
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
