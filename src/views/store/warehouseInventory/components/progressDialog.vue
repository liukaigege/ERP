<!--
* @Descripttion: Vango ERP  progressDialog.vue 进度条组件
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <el-dialog
    :title="pageType === 5 ? '盘盈入库' : '盘亏出库'"
    v-model="dialogVisible"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
		:show-close="false"
  >
		<div>
			<el-progress
				:text-inside="true"
				:stroke-width="24"
				:percentage="progressNum"
				:status="progressNum < 100 ?'' : form.successCount >0 ? 'success' : 'exception'"
			/>
			<div class="tipsContainer">
				<div v-if="tipsStringShow">数据处理中，请耐心等待！</div>
				<div v-if="!tipsStringShow" class="tipsTitle">处理详情：</div>
				<div v-if="!tipsStringShow" class="tipsContent">处理总数：{{form.totalCount}}</div>
				<div v-if="!tipsStringShow" class="tipsContent">{{pageType === 5 ? '入库成功：' : '出库成功：'}}<span style="color:#70B603;">{{form.successCount}}</span></div>
				<div v-if="!tipsStringShow" class="tipsContent">{{pageType === 5 ? '入库失败：' : '出库失败：'}}<span style="color:red;">{{form.failCount}}</span></div>
			</div>
		</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" :disabled="tipsStringShow" @click="ok">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { progressInfo } from '@/api/basic'
import { getAsynchResultApi } from '../composables/api'
export default {
	props:{
		pageType:{
			type:Number,
			default:5
		},
		uuid:{
			type:String,
			default:null
		}
	},
	emits:['closeBack'],
  setup(props,{emit}) {
    const state = reactive({
			dialogVisible:true,
			progressNum:0,
			timer:null,
			tipsStringShow:true,
			form:{
				totalCount:0,
				successCount:0,
				failCount:0
			}
		})
		queryProgress()
		function queryProgress(){
			new Promise((relove, reject) => {
        clearInterval(state.timer)
				state.timer = setInterval(()=>{
					progressInfo(props.uuid)
						.then(res => {
							if(res.code == 200){
								state.progressNum = res.data.percent || 0
								if(res.data.percent == 100) {
									clearInterval(state.timer)
									relove()
								}
							}else{
								clearInterval(state.timer)
								reject()
							}
						})
						.catch(()=>{
							clearInterval(state.timer)
							reject()
						})
				},1000)
      })
			.then(res=>{
				getAsynchResultApi({uuid:props.uuid,type:props.pageType})
				.then(res => {
					if(res.code == 200){
						state.tipsStringShow = !state.tipsStringShow
						state.form = res.data
					}
				})
			})
			.catch(()=> clearInterval(state.timer))
		}
		function handleClose(){
			emit('closeBack',false)
		}
		function ok(){
			state.dialogVisible = false
		}
    return {
      ...toRefs(state),
			handleClose,
			ok
    }
  }
}
</script>
<style lang='scss' scoped>
.tipsContainer{
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
	.tipsTitle{
		flex: 2;
	}
	.tipsContent{
		flex: 3;
	}
}
</style>
