<template>
	<el-dialog title="选择采购单" width="850px" v-model="dialogShelfSpace" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeSelectPurase">
		<div class="headPuraseClass">
			<div class="radioButton">
				<el-radio-group v-model="selectRadio" @change="radioChange">
					<el-radio  :label="1">ERP采购单</el-radio>
					<el-radio  :label="2">其他采购单</el-radio>
				</el-radio-group>
			</div>
			<!-- 绑定商品品类和sku -->
			<!-- sku选择 -->
			<el-row :gutter="10" v-if="selectRadio==1">
				<!-- 左边 -->
				<el-col :span="12">
					<div class="skuClass">
						<div style="padding:0px 12px;background: #FAFAFA;font-weight: 600;">采购单</div>
						<div class="searchFlex">
							<el-input placeholder="请输入采购单号多条空格或逗号" style="width:330px;" :maxlength="500" @keydown.enter="searchPurase" v-model="searchText" clearable>
								<template #append>
									<el-button icon="el-icon-search" @click="searchPurase"></el-button>
								</template>
							</el-input>
							<!-- <el-button icon="el-icon-search"></el-button> -->
						</div>
					</div>
					<div class="imgClass">
						<div class="fontTag" v-if="skuList&&!skuList.length">请输入采购订单号搜索</div>
						<div class="imgContent" v-for="item in skuList" :key="item.purchaseId">
							<div class="qualityImages">
								<el-popover placement="right-start" trigger="hover" width="auto">
									<el-image style="width:200px;height:200px" :src="item.picUrl" fit="contain" />
									<template #reference>
										<el-image style="width:80px;height:80px" :src="item.picUrl" fit="contain" />
									</template>
								</el-popover>
								<div>
									<p class="skuFont" :title="item.purchaseId" style="font-weight: 600;">{{item.purchaseId}}</p>
									<div class="detailClass">
										<p>{{item.supplierName}}</p>
									</div>
									<p class="skuFont" :title="item.purchaseName">{{item.purchaseName}}</p>
									<p class="skuFont">采购数量:{{item.purchaseNum}}
										<span style="margin-left:40px">{{item.purchaseCreateTime}}</span>
									</p>
								</div>
							</div>
							<div>
								<el-button type="text" style="text-align:center;" @click="selectList(item,item.purchaseId)" :style="item.selectSkuList?'color:#9e9e9e':'color:#1890FF'">{{item.selectSkuList?'已选':'选择'}}</el-button>
							</div>
						</div>
					</div>

				</el-col>
				<!-- 右边 -->
				<el-col :span="12">
					<div class="selectGoodClass">已选
						<span style="color: #1890FF;">{{skuCopy.length?skuCopy.length:0}}</span>
						个采购单
					</div>
					<div class="imgClass">
						<div class="imgContent" v-for="item in skuCopy" :key="item.purchaseId">
							<div class="qualityImages">
								<!-- 图片放大 -->
								<el-popover placement="right-start" trigger="hover" width="auto">
									<el-image style="width:200px;height:200px" :src="item.picUrl" fit="contain" />
									<template #reference>
										<el-image style="width:80px;height:80px" :src="item.picUrl" fit="contain" />
									</template>
								</el-popover>
								<div>
									<p class="skuFont" :title="item.purchaseId" style="font-weight: 600;">{{item.purchaseId}}</p>
									<div class="detailClass">
										<p>{{item.supplierName}}</p>
									</div>

									<p class="skuFont" :title="item.purchaseName">{{item.purchaseName}}</p>
									<p class="skuFont">采购数量:{{item.purchaseNum}}
										<span style="margin-left:40px">{{item.purchaseCreateTime}}</span>
									</p>
								</div>
							</div>
							<div>
								<el-button type="text" style="text-align:center;color: #FD4C60;" @click="deleteGoods(item.purchaseId)">删除</el-button>
							</div>
						</div>
					</div>
				</el-col>
			</el-row>
			<!-- 其他采购单 -->
			<el-form :rules="rules" :model="form" ref="formRef1" v-if="selectRadio==2" style="padding:30px 0">
				<el-form-item label="采购单号:" prop="purchaseNumer">
					<el-input style="width:310px" v-model="form.purchaseNumer" placeholder="请输入采购单号"></el-input>
				</el-form-item>
				<el-form-item label="采购员:" prop="purchaseUserId" style="margin-left:15px;">
					<elSelectTree filterable isDisableItem clearable :data="userList" :treeProps="treeProps" :defaultCheckedKeys="defaultCheckedKeys" checkStrictly :width="286" @ok="getValue" />
				</el-form-item>
				<div class="bottomClass" style="margin-top:100px">
					<div style="display:flex">
						<div>物流方式：{{rows.name?rows.name:'-'}}</div>
						<div class="fontClass" :title="rows.trackNum" style="margin-left:40px">运单号：{{rows.trackNum?rows.trackNum:'-'}}</div>
					</div>
					<div class="bottomForm">
						<el-form-item label="发货箱数:" prop="planBox">
							<el-input placeholder="请输入发货箱数" v-model="form.planBox"></el-input>
						</el-form-item>
					</div>
				</div>
			</el-form>
			<div class="bottomClass" v-if="selectRadio==1">
				<div style="display:flex">
					<div>物流方式：{{rows.name?rows.name:'-'}}</div>
					<div class="fontClass" :title="rows.trackNum" style="margin-left:40px">运单号：{{rows.trackNum?rows.trackNum:'-'}}</div>
				</div>
				<div class="bottomForm">
					<el-form :rules="rules" :model="form" :inline="true" ref="formRef">
						<el-form-item label="发货箱数:" prop="planBox">
							<el-input placeholder="请输入发货箱数" v-model="form.planBox"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
		</div>

		<!-- 底部 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="closeSelectPurase">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import elSelectTree from '@/components/elSelectTree/index.vue'
	import { shopUserList } from '@/api/goods/shop.js'
	import { storage } from '@/utils/storage.js'
	import { nextTick, onMounted, reactive, ref, toRefs } from 'vue'
	import { requiredValue, ruleUrl } from '@/views/shop/shopRules/rules.js'
	import {
		associatedSign, //采购单关联操作(确定)
		queryPurchaseInfo,//采购订单-待到货查询
	} from '@/api/store.js'
	import { ElMessage } from 'element-plus'
	export default {
		props: {
			rows: {
				type: Object,
				default: {}
			},
		},
		components: {
			elSelectTree
		},
		emits: ['closeSelectPurase'],
		setup(props, context) {
			const formRef = ref(null)
			const formRef1 = ref(null)
			const rows = props.rows
			const rules = {
				planBox: [requiredValue('发货箱数不能为空'), {
					validator: (rule, value, callback) => {
						const reg = new RegExp(/^[1-9]\d{0,2}$/)
						if (reg.test(value)) {
						} else {
							if (value > 999) { return setValue(999) }
							if (value <= 0) { return resetValueNull() }
							resetValueNull(rule)
						}
						callback()
					},
					trigger: 'blur'
				}],
				purchaseNumer: [
					{ required: true, message: '请输入采购单号', trigger: 'blur' },
					{ max: 20, message: '长度20个字符', trigger: 'blur' },
					{ pattern: /^[0-9A-Za-z]+$/, message: '采购单号格式不正确', trigger: 'blur' }
				],
				purchaseUserId: [
					{ required: true, message: '请选择采购员', trigger: 'change' },

				]
			}
			const state = reactive({
				dialogShelfSpace: true,
				catagoryChecked: false,//品类头部全选框
				selectRadio: 1,
				treeProps: {
					value: 'deptId',
					label: 'deptName',
					children: 'children',
					disabled: 'disabled'
				},
				defaultCheckedKeys: [],
				form: {
					planBox: 1,
					purchaseNumer: '',
					purchaseUserId: '',
				},
				userList: [],//采购员(接口数据)
				searchText: '',
				bindSkuName: [],//sku编码的存储
				checkCode: {},//最后提交比对的编码值
				paginationTotal: 0, //分页总数据条数
				paginationArr: [10, 20, 30, 50], //分页每页选择条数默认数据
				current: 1, //当前页码
				size: 10, //一页多少条
				skuCopy: [],
				skuList: [],
				loginName: '',
				loginId: null,
			})
			function resetValueNull() {
				state.form.planBox = ''
			}
			function setValue(value) {
				state.form.planBox = value
			}
			//弹框关闭事件
			function closeSelectPurase() {
				context.emit('closeSelectPurase', false)
			}
			//sku选择事件
			function selectList(item, id) {
				item.selectSkuList = !item.selectSkuList
				if (item.selectSkuList) {
					state.skuCopy.push(item)
				} else {
					deleteGoods(id)
				}
			}
			//sku删除事件
			function deleteGoods(purchaseId) {
				state.skuCopy = state.skuCopy.filter(item => item.purchaseId != purchaseId)
				const item = state.skuList.find(e => e.purchaseId === purchaseId)
				if (item) item.selectSkuList = false
			}

			onMounted(() => {
				//  console.log(props.rows,props.selectGoodsId);
				let list = storage.get('ERP_USERINFO')
				state.loginName = list.fullName
				console.log(list);
				console.log(state.loginName, 'state.loginName');
				shopUserList().then(res => {
					loop(res.data)
					state.userList = res.data
					init()
					console.log(state.userList, 'state.userList');
				})

			})
			function init() {
				loopUserId(state.userList)
				function loopUserId(data) {
					data.forEach(item => {
						if (state.loginName == item.deptName) {
							state.loginId = item.deptId
						}
						if (item.children && item.children.length) {
							loopUserId(item.children)
						}
					})
				}
				state.defaultCheckedKeys = [state.loginId]
				state.form.purchaseUserId  = state.loginId?.split('user')[0]
			}
			//处理员工接口
			function loop(data) {
				data.forEach(item => {
					item.disabled = true
					if (item.children && item.children.length) loop(item.children)
					let arr = []
					if (item.userVos && item.userVos.length) {
						item.userVos.forEach(val => {
							arr.push({ deptId: val.userId + 'user', deptName: val.fullName, disabled: false })
						})
					}
					item.children = arr.concat(item.children)
				})
			}
			//搜索
			function searchPurase() {
				if (!state.searchText) return ElMessage.error('请输入采购单号')
				queryPurchaseInfo({ purchaseIds: state.searchText }).then(res => {
					res.data.forEach(item => {
						item.selectSkuList = state.skuCopy.some(s => s.purchaseId === item.purchaseId)
					})
					state.skuList = res.data
				}).catch(err => {
					state.skuList = []
				})
			}
			//提交
			function submit() {
				let flag = true
				if (state.selectRadio == 2) {
					formRef1.value.validate((valid) => {
						if (!valid) flag = false
					})
				}
				if (state.selectRadio == 1) {
					formRef.value.validate((valid) => {
						if (!valid) flag = false
					})
				}
				if (!flag) {
					ElMessage.error('请检查校验信息')
					return false;
				}
				let ivtPurchaseInfo;
				ivtPurchaseInfo = {
					id: rows.id,
					purchaseIds: state.selectRadio == 1 ? state.skuCopy.map(item => item.purchaseId) : [state.form.purchaseNumer],
					name: rows.name,
					trackNum: rows.trackNum,
					boxesNum: state.form.planBox,
          purchaseType:state.selectRadio
				}
        ivtPurchaseInfo.purchaseUserInfo=[]
        //ERP采购单增加采购员字段
        if(state.selectRadio==1){
          state.skuCopy.forEach(item=>{
            ivtPurchaseInfo.purchaseUserInfo.push({purchaseId:item.purchaseId,purchseUserName:item.purchaseName})
          })
        }
				if (state.selectRadio == 2) {
					ivtPurchaseInfo.purchaseUserId  = state.form.purchaseUserId 
				}
				if (state.selectRadio == 1 && !ivtPurchaseInfo.purchaseIds.length) return ElMessage.error('请选择采购单')
       
				associatedSign(ivtPurchaseInfo).then(res => {
					setTimeout(() => {
						context.emit('closeSelectPurase', true)
					}, 500)
				})
			}
			const getValue = e => {
				state.form.purchaseUserId  = e.split('user')[0]
			}
      function radioChange(val){
         console.log(val,'val');
         if(val==1){
           state.form.purchaseNumer=''
         }else{
           state.skuCopy=[]
           state.skuList=[]
           state.searchText=''
         }
      }
			return {
				...toRefs(state),
				closeSelectPurase,
				rules,
				formRef,
				formRef1,
				selectList,
				deleteGoods,
				submit,
				searchPurase,
				rows,
				getValue,
        radioChange
			}
		}
	}
</script>

<style lang="scss" scoped>
.headPuraseClass {
	.radioButton {
		margin-bottom: 24px;
	}
	.bottomClass {
		display: flex;
		// align-items: center;
		position: relative;
		margin-top: 25px;
		height: 50px;
		.fontClass {
			width: 210px;
			overflow: hidden;
			white-space: nowrap; //表示不换
			text-overflow: ellipsis; //加省略号
		}
		.bottomForm {
			position: absolute;
			right: 90px;
			top: -5px;
		}
	}
	.skuClass {
		display: flex;
		align-items: center;
		border: 1px solid #e8e8e8;
		border-bottom: 0;
		background: #fafafa;

		.searchFlex {
			height: 100%;
			display: flex;
			align-items: center;
		}
	}
	// sku选择
	.imgClass {
		height: 320px;
		padding: 8px 12px;
		padding-right: 24px;
		border: 1px solid #e8e8e8;
		font-size: 12px;
		overflow: auto;
		.fontTag {
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.imgContent {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 80px;
			margin-bottom: 25px;
		}
		p {
			margin: 0;
			// padding-top: 3px;
			padding-left: 10px;
		}
		.skuFont {
			width: 240px;
			overflow: hidden;
			white-space: nowrap; //表示不换
			text-overflow: ellipsis; //加省略号;
		}
		.detailClass {
			width: 240px;
			p {
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
		.qualityImages {
			display: flex;
			align-items: center;
		}
	}
	.selectGoodClass {
		padding: 7px 12px;
		border: 1px solid #e8e8e8;
		border-bottom: 0;
		background: #fafafa;
		font-weight: 600;
	}
}
</style>
