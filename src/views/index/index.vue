<template>
	<div class="head-container">
		<!-- 所有权限都没有时候展示占位符图片 -->
		<div class="index-container" v-if="!authPath('index_order:btn') && !authPath('index_warehouse:btn')
  && !authPath('index_Supplier:btn')&&!authPath('index_store:btn')&&!authPath('index_store:btn')
  &&!authPath('index_Finance:btn')&&!authPath('index_purchase_overView:btn')
  &&!authPath('index_purchase_dateList:btn')&&!authPath('index_selectGood_Quoted:btn')
  &&!authPath('index_selectGood_Shelved:btn')&&!authPath('index_shop:btn')
  &&!authPath('index_logistics:btn')&&!authPath('index_goodManagement:btn')&&!authPath('index_statement:btn')">
			<div class="index-middle">
				<img class="index-welcome" src="../../assets/image/welcome.png" />
				<div class="welcome-text">欢迎使用ERP系统</div>
				<div class="version-text" @click="goToDoc">VANGO-ERP V1.5.11</div>
			</div>
		</div>
		<!-- 订单 -->
		<OrderPage v-if="authPath('index_order:btn')" />
		<!-- 采购 -->
		<PurchasePage />
    <!-- 采购定制品 -->
    <!-- <PurchaseCustomized/> -->
		<!-- 在仓库存 -->
		<WarehouseInventory v-if="authPath('index_warehouse:btn')" />
		<!-- 供应商管理 -->
		<SupplierManagement v-if="authPath('index_Supplier:btn')" />
		<!-- 仓储 -->
		<StoragePage v-if="authPath('index_store:btn')" />
		<!-- 仓储入库出库图表 -->
		<StorageInOut v-if="authPath('index_store:btn')" />
		<!-- 选品 -->
		<SelectionGoods />
		<!-- 店铺物流 -->
		<ShopLogistics />
		<!-- 财务审核 -->
		<FinancialAudit />
    <!-- 商品管理 -->
    <GoodsManagement  v-if="authPath('index_goodManagement:btn')"/>
	</div>
</template>
<script>
	import OrderPage from './components/orderPage.vue'
	import PurchasePage from './components/purchasePage.vue'
  // import PurchaseCustomized from './components/purchaseCustomized.vue'
	import WarehouseInventory from './components/warehouseInventory.vue'
	import SupplierManagement from './components/SupplierManagement.vue'
	import StoragePage from './components/storagePage.vue'
	import StorageInOut from './components/storage_In_Out.vue'
	import SelectionGoods from './components/selectionGoodsPage.vue'
	import ShopLogistics from './components/shopLogistics.vue'
	import FinancialAudit from './components/FinancialAudit.vue'
  import GoodsManagement from './components/goodsManagement.vue'
	import { computed } from 'vue'
	export default {
		name: 'home',
		components: {
			OrderPage,//订单模块
			PurchasePage,//采购模块
      // PurchaseCustomized,//采购定制品
			WarehouseInventory,//在仓库存
			SupplierManagement,//供应商管理
			StoragePage,//仓储
			StorageInOut,//仓储入库出库
			SelectionGoods,//选品
			ShopLogistics,//店铺
			FinancialAudit,//财务审核
      GoodsManagement
		},
		setup(props) {
			function goToDoc(params) {
				window.open('https://docs.qq.com/doc/DU1ZVR05vQWtZdmVE')
			}
			return {
				goToDoc
			}
		}
	}
</script>
<style scoped lang="scss">
.head-container {
	.index-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.index-welcome {
		width: 600px;
		height: 384px;
	}
	.welcome-text {
		text-align: center;
		font-size: 24px;
		font-weight: 500;
		color: #000000;
		line-height: 1;
		margin-top: 2em;
	}
	.version-text {
		text-align: center;
		font-size: 16px;
		line-height: 1;
		margin-top: 1em;
		color: #1890ff;
		cursor: pointer;
		text-decoration-line: underline;
		text-underline-offset: 4px;
	}
}
</style>>
