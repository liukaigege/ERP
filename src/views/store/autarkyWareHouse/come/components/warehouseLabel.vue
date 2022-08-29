<template>
	<el-dialog title="打印标签" width="1200px" v-model="dialogLabel" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeLable">
		<div class="headContent">
			<div class="inGoodClass">
				<div>
                入库商品
                <span style="margin-left:40px;color: #f81e0f;">打印总数:{{printTotal}}</span>
                </div>
				<el-button type="text" @click="numerOne">数量设为1</el-button>
			</div>
			<div class="imgClass">
				<div class="imgContent" v-for="(item,index) in goodList" :key="index">
					<div class="qualityImages">
						<el-image style="width:60px;height:60px" :src="item.goodsImage" />
						<div>
							<p class="skuClass" style="margin-left:10px">{{item.goodsName}}</p>
							<p class="pClass skuClass">{{item.skuValue}}</p>
							<p class="pClass skuClass">{{item.skuId}}</p>
						</div>
					</div>
					<div style="width: 150px">【{{item.shelfGridName}}】</div>
					<div style="margin-top:-10px">
						<el-button type="text" class="buttonDel" :style="delList?'color: rgba(0, 0, 0, 0.45)':'color: #FD4C60;'" @click="deleteLable(item,index)" :disabled="delList">移除</el-button>
						<br>
						<el-input-number :min="0" :max="item.maxNum" style="width:88px;position:relative;top:-10px;" controls-position="right" v-model="item.numbers"></el-input-number>
					</div>
				</div>
			</div>
		</div>
		<!-- 底部 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeLable">取 消</el-button>
				<el-button type="primary" @click="submit">打印</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { computed, onMounted, reactive, toRefs, withDirectives } from 'vue'
	import {
		getPrintMsg,//X01.获取打印入库商品标签信息
		getQrCode,//X02.打印二维码
	} from '@/api/store.js'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			selectLable: {
				type: Array
			}
		},
		emits: ['closeLable'],
		setup(props, context) {
			const state = reactive({
				dialogLabel: true,
				delList: false,
				goodList: []
			})
            //打印总数计算
            let printTotal = computed( ()=>{
                let num = 0
                state.goodList.forEach(item =>{
                    num = num+item.numbers
                })
                return num
            })
			//获取打印入库商品标签信息
			function getPrint() {
				getPrintMsg({ list: props.selectLable }).then(res => {
					res.data.forEach(item => {
						item.maxNum = item.numbers
						if (item.skuValue?.length) {
							item.skuValue = JSON.parse(item.skuValue).map(v => v.speVal).join('-')
						}
					})
					state.goodList = res.data
				})
			}
			onMounted(() => {
				getPrint()
				if (props.selectLable.length == 1) return state.delList = true
			})

			//弹框关闭事件
			function closeLable() {
				context.emit('closeLable')
			}
			//移除标签
			function deleteLable(item, index) {
				state.goodList.splice(index, 1)
				if (state.goodList.length == 1) return state.delList = true
			}
			//快捷键数量设为1
			function numerOne() {
				state.goodList.map(item => {
					item.numbers = 1
				})
			}
			//确定事件
			function submit() {
				let lists = []
				let flag = state.goodList.every(item => {
					return item.numbers == 0
				})
				console.log(flag, 'flag');
				if (flag) {//数量全为0的情况
					ElMessage.warning('请输入打标签数量')
				} else {//剩下的有0的和没有0的情况
					state.goodList.filter(item => {
						return item.numbers > 0
					}).map(v => {
						lists.push({ serialNumber: v.serialNumber, numbers: v.numbers })
					})
					//调接口
					getQrCode({ list: lists }).then(res => {
						window.open(res.data)
						closeLable()
					})
				}

			}
			return {
				...toRefs(state),
				closeLable,
				deleteLable,
				submit,
				numerOne,
                printTotal
			}
		}
	}
</script>

<style lang="scss" scoped>
	.headContent {
		height: 400px;
		overflow: auto;
		:deep(.el-dialog__title) {
			font-weight: 600;
		}
		.inGoodClass {
			padding: 5px;
			border: 1px solid #e8e8e8;
			background: #fafafa;
			font-weight: 600;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.imgClass {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			.imgContent {
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 80px;
				border: 1px solid #e8e8e8;
				border-top: 0;
				padding: 10px 10px;
				.skuClass {
					width: 200px;
					overflow: hidden;
					white-space: nowrap; //表示不换
					text-overflow: ellipsis; //加省略号;
				}
			}
			.pClass {
				margin: 0;
				padding-top: 5px;
				padding-left: 10px;
			}
			.qualityImages {
				display: flex;
				align-items: center;
			}
			:deep(.el-button) {
				margin: 0;
				padding: 0;
			}
			.buttonDel {
				float: right;
			}
		}
	}
</style>