<template>
	<div class="addSku">
		<div class="skuList">
			<draggable
				v-model="skuList"
				group="people"
				@start="drag = true"
				@end="dragEnd"
				item-key="frontId"
				handle=".itemHeadLeft"
			>
				<template #item="{ element, index }">
					<SkuItem
						v-model="skuList[index]"
						:index=" index+1 "
						:ref="
							el => {
								if (el) skuRefs[index] = el
							}
						"
						class="sku"
						@delSpe="delSpe"
						@showSelectImg="showSelectImg"
						@selectSpe ="selectSpe"
					/>
				</template>
			</draggable>
		</div>

		<div class="addSkuBtn" @click="addSku" v-if="routeOption.multi.add && !isDisabled">
			<i class="el-icon-plus"></i> 添加规格参数
		</div>

		<div
			:style="{
				position: 'fixed',
				right: 0,
				bottom: 0,
				width: '32%',
				borderTop: '1px solid #e9e9e9',
				padding: '10px 16px',
				background: '#fff',
				textAlign: 'right',
				zIndex: 999
			}"
		>
			<el-button  :style="{ marginRight: '8px' }" @click="cancel">
				取消
			</el-button>
			<el-button  type="primary" @click="submit" :disabled="isDisabled">
				确定
			</el-button>
		</div>
	</div>
</template>

<script>
import { toRefs, reactive,getCurrentInstance,watch,onMounted,inject } from 'vue'
import SkuItem from '@/views/goods/components/sku/components/skuItem.vue'
import draggable from 'vuedraggable'
import skuItemHook from '../hooks/skuItem.js'
import { deepCopy } from '@/utils/tool.js'
import {ElMessage} from 'element-plus'
export default {
	props:{
		query:{
			type:Object,
			default:null
		}
	},
	components: { draggable, SkuItem },
	setup(props,{emit}) {
		const {proxy} = getCurrentInstance()
		const data = reactive({
			skuList: [],
			drag: false,
			skuRefs: [],
			skuRefsCopy: []
		})
		const { createId, confirm,createSku,supplementData,cancel } = skuItemHook(data)
		 const routeOption = inject('routeOption')
     const isDisabled = inject('isDisabled')
		function addSku() {
			let obj = {
				id:null,
				frontId: createId(),
				nameEn: null,
				nameCn: null,
				isPhoto: 0, //是否开启图片参数
				showType: 1, //展示样式
				commonSpeId:null,
				speValues: [],
			}
			data.skuList.push(obj)
		} // 新增规格



		async function submit() {
      if(data.skuRefs.length == 0){
        ElMessage.error('请输入规格参数')
        return
      }
			let promiseArr = []
			await data.skuRefs.map((item, index) => {
				promiseArr.push(item.checkSku())
			})
			Promise.all([...promiseArr])
				.then(res => {
          // console.log(data.skuRefs)
					data.skuRefs.forEach(item => {
						item.emitData()
					})

					emit('ok',{sku:createSku(deepCopy(data.skuList)),spes:supplementData(deepCopy(data.skuList),'nameCn','nameEn','speValues')})
					// 全部校验成功则获取数据
				})
				.catch(err => {
					proxy.$message.error(err)
					console.log('error', err)
				})
		}


		function showSelectImg(val){
			emit('showSelectImg',val)
		}

		function selectSpe(val){
				emit('selectSpe',val)
		}

		function delSpe(val){
			data.skuList.splice(val.index-1,1)
			data.skuRefs.splice(val.index-1,1)
			console.log( data.skuRefs,'refend')
			console.log(data.skuList,'skuend')
		}

		onMounted(()=>{
				if(props.query){
						data.skuList = deepCopy(props.query)
							console.log(data.skuList,'=>')
				}
		})
		function dragEnd(params) {}
		return {
			...toRefs(data),
			dragEnd,
			addSku,
			submit,
			showSelectImg,
			cancel,
			delSpe,
			selectSpe,
			routeOption,
      isDisabled
		}
	}
}
</script>

<style lang="scss" scoped>
.skuList {
}
.sku {
	margin-bottom: 20px;
}

.addSkuBtn {
	cursor: pointer;
	margin-top: 20px;
	margin-bottom: 40px;
	width: 30%;
	display: flex;
	align-items: center;
	justify-content: space-around;
	border: 1px solid #1890ff;
	color: #1890ff;
	padding: 5.5px 10px;
	margin-right: 12px;
}
</style>
