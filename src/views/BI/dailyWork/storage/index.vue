<template>
	<div class="headdailyStore">
		<!-- 第一部分 -->
		<div class="contentOne">
			<div class="contentTim">T+0打单率</div>
			<div class="storeTim">
				<div class="contentHead">
					<el-form :model="form" :inline="true">
						<el-form-item label="仓库:">
							<el-select v-model="form.store" style="width:154px" >
								<el-option label="万众智谷仓库" value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="时间:" style="margin-left:8px">
							<el-date-picker v-model="form.time" type="date"  value-format="YYYY-MM-DD" placeholder="选择日期" style="width:224px;" @change="changeDateIntimidate" >
							</el-date-picker>
						</el-form-item>
					</el-form>
					<div>
						<el-button type="text"  @click="deliverGoodsForm">查看详情 <i class="el-icon-arrow-right"></i></el-button>
					</div>
				</div>
				<!-- 卡片 -->
				<div class="cardClass">
					<el-card class="box-card">
						<template #header>
							<div class="fontSizeTime">{{intimidateRate.date?intimidateRate.date:0}}</div>
						</template>
						<div>
							<span class="fontPrcent">{{intimidateRate.rate?intimidateRate.rate:0}}</span>
							<span class="fontSizeTime">%</span>
						</div>
						<div class="fontSizeZero">T+0打单率</div>
					</el-card>
					<!-- 放两个空的标签 ,实现样式放大缩小问题-->
					<div></div>
					<div></div>
				</div>
			</div>
		</div>
		<!-- 第二部分 -->
		<div class="contentTwo">
			<div class="contentTim">T+0发货率</div>
			<div class="storeTim">
				<div class="contentHead">
					<el-form :model="form" :inline="true">
						<el-form-item label="仓库:">
							<el-select v-model="form.store" style="width:154px" >
								<el-option label="万众智谷仓库" value="1"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="时间:" style="margin-left:8px">
							<el-date-picker v-model="form.deliveryTime" type="date"  value-format="YYYY-MM-DD" placeholder="选择日期" style="width:224px;" @change="changeDateDelivery">
							</el-date-picker>
						</el-form-item>
					</el-form>
					<div class="buttonClass">
						<el-button type="text"  @click="surplusGoodsForm">查看详情 <i class="el-icon-arrow-right"></i></el-button>
					</div>
				</div>
				<div class="cardClass">
					<el-card class="box-card cardBacgordOne">
						<template #header>
							<div class="fontSizeTime">{{deliveryRate.date?deliveryRate.date:0}}</div>
						</template>
						<div>
							<span class="fontPrcent">{{deliveryRate.printCount?deliveryRate.printCount:0}}</span>
						</div>
						<div class="fontSizeZero">打单量</div>
					</el-card>
					<el-card class="box-card cardBacgordTwo">
						<template #header>
							<div class="fontSizeTime">{{deliveryRate.date?deliveryRate.date:0}}</div>
						</template>
						<div>
							<span class="fontPrcent">{{deliveryRate.validDeliverCount?deliveryRate.validDeliverCount:0}}</span>
						</div>
						<div class="fontSizeZero">有效发货量</div>
					</el-card>
					<el-card class="box-card cardBacgordThree">
						<template #header>
							<div class="fontSizeTime">{{deliveryRate.date?deliveryRate.date:0}}</div>
						</template>
						<div>
							<span class="fontPrcent">{{deliveryRate.rate?deliveryRate.rate:0}}</span>
							<span class="fontSizeTime">%</span>
						</div>
						<div class="fontSizeZero">T+0发货率</div>
					</el-card>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
    import moment from 'moment'
	import { getBillingRate , getDeliveryRate  } from './api/api.js'
	import { onMounted, reactive, toRefs , onActivated} from 'vue'
	import { useRouter } from 'vue-router'
	export default {
		name: 'dailyWorkStorage',
		components: {

		},
		setup() {
			const router = useRouter()
			const state = reactive({
				form: {
					store: '1',
					time: '',
                    deliveryTime:''
				},
                intimidateRate:{},//保存打单率接口返回数据
                deliveryRate:{},//保存发货率接口返回数据

			})
			//打单发货明细表打开
			function deliverGoodsForm() {
				router.push({ name: 'surplusGoods' })
			}
			//剩余发货数据明细表
			function surplusGoodsForm() {
				router.push({ name: 'deliverGoods' })
			}
            //初始查询打单率接口
            function queryBillingRate () {
                getBillingRate({date:state.form.time}).then( res => {
                   state.intimidateRate=res.data
                }).catch(err => {
                    state.intimidateRate={
                        date:'--',
                        rate:'--'
                    }
                })
            }
            //初始查询发货率接口
            function queryDeliveryRate() {
               getDeliveryRate({date:state.form.deliveryTime}).then( res => {
                   state.deliveryRate=res.data
               }).catch(err => {
                  state.deliveryRate={
                      date:'--',
                      printCount:'--',
                      validDeliverCount:'--',
                      rate:'--'
                  } 
               })
            }
            onActivated ( () => {
                state.form.time=moment().endOf('day')
                .subtract(1, 'days').format('YYYY-MM-DD')
                state.form.deliveryTime=moment().endOf('day')
                .subtract(1, 'days').format('YYYY-MM-DD')
                queryBillingRate()//打单率
                queryDeliveryRate()//发货率
            })
			//打单率日期选择
			function changeDateIntimidate(date) {
                if(!date){
                  state.form.time=moment().endOf('day')
                .subtract(1, 'days').format('YYYY-MM-DD')  
                }else{
                  state.form.time=date
                }
                queryBillingRate()
			}
            //发货率日期选择
            function changeDateDelivery(date){
              if(!date) {
                state.form.deliveryTime=moment().endOf('day')
                .subtract(1, 'days').format('YYYY-MM-DD')
              }else{
                 state.form.deliveryTime=date 
              }
              queryDeliveryRate()
            }
            //清空
           
			return {
				...toRefs(state),
				deliverGoodsForm,
				surplusGoodsForm,
				changeDateIntimidate,
                changeDateDelivery,
			}
		}
	}
</script>

<style lang="scss" scoped>
.headdailyStore {
	//第一部分样式
	:deep(.el-card__header) {
		border-bottom: 2px solid rgba(221, 225, 238, 0.5);
	}
	.contentHead {
		display: flex;
		justify-content: space-between;
	}
	.contentOne {
		background: #fff;
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
				.box-card {
					// width: 490px;
					border-radius: 14px;
					color: #fff;
					background: linear-gradient(
						135deg,
						#f6aa9b 0%,
						#e36f6f 100%
					);
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
	//第二部分样式
	.contentTwo {
		background: #fff;
		margin-top: 24px;
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
