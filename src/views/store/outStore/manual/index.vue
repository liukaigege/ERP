<!--
 * @Descripttion: 手动出库页面
 * @version: 
 * @Author: 韦剑
 * @Date: 2021-07-08 11:27:26
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-07-26 10:33:51
-->
<template>
  <div>
		<div class="pageView">
			<el-form >
				<el-form-item label="仓库名称:">
					<el-select v-model="storeNameValue" placeholder="请选择" style="width: 320px">
						<el-option
							v-for="item in storeNameOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="探索类型:">
						<el-select v-model="typeValue" placeholder="请选择" style="width: 140px; margin-right: 16px">
							<el-option
								v-for="item in typeOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						<el-input v-model="searchValue" placeholder="请输入要检索的内容,多条可用逗号或空格隔开" clearable style="width:318px"></el-input>
				</el-form-item>
				<el-form-item label="创建时间:" style="margin-bottom: 0">
					<el-date-picker
						v-model="dateValue"
						type="daterange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="width: 224px">
					</el-date-picker>
					<el-button type="primary" style="margin-left: 14px">查询</el-button>
					<el-button style="margin-left: 14px">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="btnList">
			<el-button  type="primary">批量出库</el-button>
			<el-button  type="primary">打印</el-button>
			<el-button  type="primary" @click="openOutStoreList('add')">新建出库单</el-button>
			<el-button  type="primary">导入\导出</el-button>
		</div>
		<div class="pageView">
			<Table :ifShowCheckbox="true" :ifShowDetail="true" :ifShowList="ifShowList" :columns="columns">
				<template v-slot:goodsDetailHead>
					商品详情
					<a class="ifShow" @click="ifShowList = !ifShowList">
						<span v-if="ifShowList">（收起<i class="el-icon-arrow-up"></i>）</span>
						<span v-else>（展开<i class="el-icon-arrow-down"></i>）</span>
					</a>
				</template>
				<template v-slot:extraHeader>
					<div class="extraHeader">
						<div>入库单号：438239842</div>
						<div>【仓库：大大撒大声地】</div>
					</div>
				</template>
				<template v-slot:goodsDetail>
					<div class="goodsDetail">
						<el-image style="width: 70px; height: 70px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="contain"></el-image>
						<div class="right">
							<div>商品种类：5</div>
							<div>入库数量：6</div>
							<a>
								<i class="el-icon-document"></i>
								货品详情
								<i class="el-icon-arrow-up"></i>
								<i class="el-icon-arrow-down"></i>
							</a>
						</div>
					</div>
				</template>
				<template v-slot:outStoreType>
					<div class="outStoreType">
						手动入库
					</div>
				</template>
				<template v-slot:date>
					<div class="date">
						创建：2017-10-34 23:12:30
					</div>
				</template>
				<template v-slot:operation>
					<div class="operation">
						<a>确认入库</a>
						<a @click="openOutStoreList('edit')">编辑</a>
						<el-dropdown>
							<a style="margin: 0">更多<i class="el-icon-arrow-down"></i></a>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="ifShowRemark = !ifShowRemark">备注</el-dropdown-item>
									<el-dropdown-item>删除</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
				<template v-slot:detail>
					<div class="detailList">
						<div class="item" v-for="(item, index) in 6" :key="index">
							<el-image style="width: 60px; height: 60px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="contain"></el-image>
							<div class="right">
								<div>iuwehsfs iuwehsfsfs iuwehsfsfs iuwehsf</div>
								<div>子弹项链</div>
								<div>入库数量：1</div>
								<div>【货架位 货区】</div>
							</div>
						</div>
					</div>
				</template>
			</Table>
			<el-dialog title="备注" v-model="ifShowRemark" :width="800" custom-class="myDialog" :close-on-click-modal="false">
				<Remark />
				<template #footer>
					<span class="dialog-footer">
						<el-button  @click="ifShowRemark = false">取 消</el-button>
						<el-button  type="primary" @click="ifShowRemark = false">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script>
import { reactive, toRefs } from "vue"
import { useRouter } from 'vue-router'
import Table from '@/components/elTable/index.vue'
import Remark from './components/remark.vue'
export default {
	setup() {
		let router = useRouter()
		let state = reactive({
			storeNameOptions: [
				{
					value: 0,
					label: '全部'
				},
				{
					value: 1,
					label: '万众智谷仓库'
				}
			],
			storeNameValue: 0,
			typeOptions: [
				{
					value: 0,
					label: '商品名称',
				},
				{
					value: 1,
					label: '商品SKU'
				},
				{
					value: 2,
					label: '出库单号'
				}
			],
			typeValue: 0,
			searchValue: '',
			dateValue: '',
			columns: [
				{
					title: '商品详情',
					key: 'goodsDetail',
					width: '350px',
					slotTh: 'goodsDetailHead'
				},
				{
					title: '出库类型',
					key: 'outStoreType',
					width: '300px',
				},
				{
					title: '时间',
					key: 'date',
					width: '300px'
				},
				{
					title: '操作',
					key: 'operation',
					width: '200px'
				}
			],
			ifShowList: true,
			ifShowRemark: false
		})
		function setUpEvent() {
			router.push('/store/outStore/manual/setupList')
		}
		function openOutStoreList(type) {
			router.push({
				name: '新建出库单',
				params: {
					type
				}
			})
		}
		return {
			...toRefs(state),
			setUpEvent,
			openOutStoreList
		}
	},
	components: {
		Table,
		Remark
	}
}
</script>


<style lang="scss" scoped>
	.pageView{
		.flex {
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
	}
	.btnList{
		text-align: right;
		margin: 24px 0;
	}
	.ifShow{
		color: #409eff;
	}
	.extraHeader{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 54px;
		background-color: #f5f7fa;
		font-size: 14px;
		padding: 0 20px;
	}
	.goodsDetail, .outStoreType, .date, .operation{
		font-size: 14px;
		color: rgba(0,0,0,.65);
	}
	.goodsDetail{
		display: flex;
		justify-content: center;
		font-size: 14px;
		color: rgba(0,0,0,.65);
		.right{
			margin-left: 16px;
			text-align: left;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			a{
				color: #409eff;
			}
		}
	}
	.operation{
		a{
			margin-right: 10px;
			color: #409eff;
		}
	}
	.detailList{
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		.item{
			display: flex;
			width: calc((100% - 48px)/4);
			height: 110px;
			border: 1px solid #eee;
			padding: 12px;
			margin-right: 16px;
			margin-bottom: 10px;
			.right{
				flex: 1;
				font-size: 14px;
				color: rgba(0,0,0,.45);
				margin-left: 16px;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				div{
					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
		.item:nth-of-type(4){
			margin-right: 0;
		}
	}
</style>
