<template>
	<div class="headdailyPurchase">
		<!-- 第二部分 -->
		<div class="contentTwo">
			<div class="contentTim">T+0下单率</div>
			<div class="storeTim">
				<div class="contentHead">
					<el-form :model="form" :inline="true">
						<el-form-item label="品类:" prop="catagoryId">
							<el-cascader @change="queryPurchaseRate"  ref="cascaderRef" :options="categoryList" collapse-tags :props="{ emitPath:true, multiple:true,label:'name',value:'id',children:'child' }"  v-model="categoryIds" clearable />
						</el-form-item>
						<el-form-item label="时间:" style="margin-left:8px">
							<el-date-picker v-model="form.date" type="date"  value-format="YYYY-MM-DD" placeholder="选择日期" style="width:224px;" @change="changeDate">
							</el-date-picker>
						</el-form-item>
					</el-form>
					<div>
						<el-button type="text"  @click="orderDetails">查看详情 <i class="el-icon-arrow-right"></i></el-button>
					</div>
				</div>
				<div class="cardClass">
					<el-card class="box-card cardBacgordOne">
						<template #header>
							<div class="fontSizeTime">{{data.date?data.date:0}}</div>
						</template>
						<div>
							<span class="fontPrcent">{{data.shouldPurchaseCount?data.shouldPurchaseCount:0}}</span>
						</div>
						<div class="fontSizeZero">应下单量</div>
					</el-card>
					<el-card class="box-card cardBacgordTwo">
						<template #header>
							<div class="fontSizeTime">{{data.date?data.date:0}}</div>
						</template>
						<div>
							<span class="fontPrcent">{{data.validPurchaseCount?data.validPurchaseCount:0}}</span>
						</div>
						<div class="fontSizeZero">有效下单量</div>
					</el-card>
					<el-card class="box-card cardBacgordThree">
						<template #header>
							<div class="fontSizeTime">{{data.date?data.date:0}}</div>
						</template>
						<div>
							<span class="fontPrcent">{{data.rate?data.rate:0}}</span>
							<span class="fontSizeTime">%</span>
						</div>
						<div class="fontSizeZero">T+0下单率</div>
					</el-card>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import { getPurchaseRate } from './api/api.js'
	import moment from 'moment'
	import { rulecClassify } from "@/api/goods/rules.js";
	import { reactive, toRefs, ref, onActivated } from 'vue'
	import { useRouter } from 'vue-router'
	export default {
		name: 'dailyWorkPurchase',
		setup() {
			const router = useRouter()
			let cascaderRef = ref(null)
			const state = reactive({
				form: {
					categories: [],
					date: moment().endOf('day')
						.subtract(1, 'days').format('YYYY-MM-DD')
				},
				categoryList: [],//品类的数据 
				data: {},//页面渲染的数据
                categoryIds:[]
			})
			//品类接口
			rulecClassify().then(res => {
				state.categoryList = res.data
			})
			//打单发货明细表打开
			function orderDetails() {
				router.push({ name: 'orderDetails' })
			}
			//初始查询打单率接口
			function queryPurchaseRate() {
                state.form.categories=cascaderRef.value.getCheckedNodes().map(v => v.value)
				getPurchaseRate(state.form).then(res => {
					state.data = res.data
				}).catch(err => {
                   state.data = {
                       date:'--',
                       shouldPurchaseCount:'--',
                       rate:'--',
                       validPurchaseCount:'--'
                   } 
                })
			}
			onActivated(() => {
				queryPurchaseRate()
			})
			//选择日期
			function changeDate(date) {
				if (!date) {
					state.form.date = moment().endOf('day')
						.subtract(1, 'days').format('YYYY-MM-DD')
				} else {
					state.form.date = date
				}
				queryPurchaseRate()
			}
			return {
				...toRefs(state),
				orderDetails,
				cascaderRef,
				changeDate,
				queryPurchaseRate
			}
		}
	}
</script>

<style lang="scss" scoped>
.headdailyPurchase {
	:deep(.el-card__header) {
		border-bottom: 2px solid rgba(221, 225, 238, 0.5);
	}
	//第1部分样式
	.contentTwo {
		background: #fff;
		// margin-top: 24px;
		.contentHead {
			display: flex;
			justify-content: space-between;
			padding-bottom: 10px;
		}
		.contentTim {
			padding: 15px 30px;
			font-size: 16px;
			color: rgba(0, 0, 0, 0.85);
			border-bottom: 1px solid #e9e9e9;
		}
		.storeTim {
			padding: 24px 30px 46px;
			.cardClass {
				height: 219px;
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				grid-column-gap: 51px;
				.cardBacgordOne {
					background: linear-gradient(
						311deg,
						#89c3f8 0%,
						#7cbdff 100%
					);
				}
				.cardBacgordTwo {
					background: linear-gradient(
						311deg,
						#c16fe7 0%,
						#bc8eee 100%
					);
				}
				.cardBacgordThree {
					background: linear-gradient(
						135deg,
						#8693f3 0%,
						#6a79e9 100%
					);
				}
				.box-card {
					// width: 490px;
					border-radius: 14px;
					color: #fff;
					.cardBacgordOne {
						background: linear-gradient(
							311deg,
							#89c3f8 0%,
							#7cbdff 100%
						);
					}
					.fontSizeTime {
						font-size: 24px;
					}
					.fontPrcent {
						font-size: 48px;
					}
					.fontSizeZero {
						font-size: 24px;
						font-weight: 100;
					}
				}
			}
		}
	}
}
</style>