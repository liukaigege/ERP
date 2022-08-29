<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-29 15:36:16
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 23:20:23
-->
<template>
  <div class="outterContainer">
    <div class="btnList">
      <div class="btnLeft">
        <el-button
          type="primary"
          @click="clickBtn('remark')"
          v-if="isShow('remark')"
          v-permission="'orderManagement/remark'"
          >备注</el-button
        >
        <el-button
          v-permission="'orderManagement/examine'"
          v-if="isShow('examine')"
          @click="clickBtn('examine')"
          type="primary"
          >审核</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('shelve')"
          @click="clickBtn('shelve')"
          v-permission="'orderManagement/shelve'"
          >移入搁置</el-button
        >
        <el-button @click="clickBtn('refund')" type="primary"   v-if="isShow('refund')"  v-permission="'orderManagement/refund'" >批量退款</el-button>

        <el-button
          type="primary"
          v-if="isShow('applyWayNum')"
          @click="clickBtn('applyNum')"
          v-permission="'orderManagement/applyWayNum'"
          >申请运单号</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('selLogistics')"
          @click="clickBtn('selLogistics')"
          v-permission="'orderManagement/selLogistics'"
          >选择物流方式</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('reduction')"
          @click="clickBtn('reduction')"
          v-permission="'orderManagement/reduction'"
          >还原</el-button
        >
        <el-button
          @click="clickBtn('applyNum')"
          type="primary"
          v-if="isShow('getAgain')"
          v-permission="'orderManagement/getAgain'"
          >重新获取</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('toPlay')"
          @click="clickBtn('addPrinted')"
          v-permission="'orderManagement/toPlay'"
          >移入待打单</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('print')"
          @click="clickBtn('print')"
          v-permission="'orderManagement/print'"
          :loading="printLoading"
          >打印面单</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('reissuePrinted')"
          @click="clickBtn('reissuePrinted')"
          v-permission="'orderManagement/reissuePrinted'"
          >补打单</el-button
        >
        <el-button
          @click="clickBtn('selLogistics')"
          type="primary"
          v-if="isShow('logistics')"
          v-permission="'orderManagement/logistics'"
          >更换物流</el-button
        >
        <el-dropdown
          style="margin: 0 10px"
          v-if="isShow('all') && showAboutPermission('orderManagement/all')"
          @visible-change="visibleDropDown"
        >
          <el-button type="primary">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <div style="padding: 10px 10px">
                <el-cascader-panel
                  ref="batchRef"
                  v-model="batchVal"
                  :props="{
                    expandTrigger: 'hover',
                  }"
                  :multiple="true"
                  :options="batch"
                  @change="getBatch"
                >
                </el-cascader-panel>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-button
          type="text"
          v-if="isShow('logisticsMan')"
          v-permission="'orderManagement/logisticsMan'"
          @click="changeLogistic"
          >更换物流管理</el-button
        >
				<el-button type="primary" v-permission="'cusToNor'"  v-if="isShow('cusToNor')" @click="changeGoodsType(true)">定制转普货</el-button>
				<el-button type="primary" v-permission="'norToCus'"  v-if="isShow('norToCus')" @click="changeGoodsType(false)">普货转定制</el-button>

        <!-- <el-button

        type="primary"
        @click="showDialog('SplitOrder', '拆分订单', '40%')"
        >拆分订单</el-button
      >
      <el-button

        type="primary"
        @click="showDialog('MergeOrder', '合并订单', '40%')"
        >合并订单</el-button
      > -->
        <!-- <el-button

        type="primary"
        v-if="isShow('logisticsMan')"
        @click="showDialog('ImportOrder', '导入订单', '30%')"
        >导入订单</el-button
      > -->
        <!-- <el-button

        type="primary"
        @click="showDialog('MatchOrder', '匹配商品', '40%')"
        >匹配商品</el-button
      >
      <el-button

        type="primary"
        @click="showDialog('CustomInfo', '定制商品', '40%')"
        >定制商品</el-button
      > -->
      </div>
      <div class="btnBox btnRight">
        <el-button
          type="primary"
          v-if="isShow('importLogistics')"
          @click="showDialog('ImportLogistic', '导入更换物流', '30%')"
          v-permission="'orderManagement/importLogistics'"
          >导入更换物流</el-button
        >
        <el-button
          type="primary"
          @click="matchDeduct"
          v-if="isShow('refreshInv')"
          v-permission="'orderManagement/refreshInv'"
          >刷新库存</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('importShipment')"
          @click="showDialog('ImportDeliver', '导入发货', '30%')"
          v-permission="'orderManagement/importShipment'"
          >导入发货</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('changePayType')"
          @click="clickBtn('changeMorePay')"
          v-permission="'orderManagement/changePayType'"
          >变更支付状态</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('reacquire')"
          v-permission="'orderManagement/reacquire'"
          >重新获取</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('importOrder')"
          @click="exportOrder"
          v-permission="'orderManagement/exportOrder'"
          >导出订单</el-button
        >
        <el-button
          type="primary"
          v-if="isShow('importDXM')"
          @click="clickBtn('exportDian')"
          v-permission="'orderManagement/exportDXM'"
          >导出店小秘订单</el-button
        >
      </div>

    </div>
    <ExportOrder
      :showExportOrder="showExportOrder"
      v-if="showExportOrder"
      @closeExportOrderView="closeExportOrderView"
      :jsonStr="jsonStr"
      :packageIdList="packageIdList"
    />

  </div>
</template>

<script>
import {
  reactive,
  toRefs,
  onMounted,
  computed,
  inject,
  getCurrentInstance,
  watch,
  ref,
} from "vue";
import ExportOrder from "@/views/order/orderManagement/components/exportOrder.vue";
import { useStore } from "vuex";
import { updateExamine, delivery, match } from "@/api/order/orderManagement.js";
import orderOptions from "../util/options.js";
import btnFunList from "@/views/order/orderManagement/util/btnFunList.js";
import refund from "./refund.vue";
import { ElMessageBox } from "element-plus";
import { authPath } from "@/utils/hooks.js";
import { useRouter } from 'vue-router'

export default {
  components: { ExportOrder, refund },
  props: {},
  setup(props) {
    const { proxy } = getCurrentInstance();
    const store = useStore();
		const router = useRouter()
    const formOptions = inject("formOptions");
    // 获取的formOptions 组件
    const orderTable = inject("orderTable");
    // 获取的orderTable 组件
    const btnFunction = btnFunList(orderTable, formOptions);
    const data = reactive({
      showExportOrder: false,
      batchVal: "",
      printLoading: false, // 打印loading
      ifShow: false,
    });
    const isSelected = () => {
      if (orderTable.value.selectRows.length == 0) {
        proxy.$message.error({
          message: "请勾选包裹",
        });
        return false;
      }
      return true;
    };
    // 校验是否勾选订单

    const jsonStr = computed(() => {
      return JSON.stringify(formOptions.value.getForm());
    });

    const packageIdList = computed(() => {
      if (orderTable.value.selectRows.length > 0) {
        return orderTable.value.selectRows.join(",");
      } else {
        return "";
      }
    });

		// change the orders' goods type, custom to normal or normal to custom.
		function changeGoodsType(val){
			if (orderTable.value.selectRows.length == 0)
        return proxy.$message.error({
          message: "请勾选包裹",
        });
			if(val){
				// custom to normal
				router.push({
          path: '/order/orderManagement/cusToNor/index',
					query:{
						packageIds:orderTable.value.selectRows.join(",")
					}
        })
			}else {
				// normal to custom
				router.push({
          path: '/order/orderManagement/norToCus/index',
					query:{
						packageIds:orderTable.value.selectRows.join(",")
					}
        })
			}
		}

    const examine = () => {
      if (!isSelected()) return;
      const packageIds = orderTable.value.selectRows.join(",");
    }; // 审核

    const showDialogFooter = computed(() => {
      return true;
    });
    const showDialog = (val, title, width) => {
      // if (!isSelected()) return
      orderTable.value.showDialog(val, title, width);
    };

    const matchDeduct = () => {
      ElMessageBox.confirm(
        "刷新库存后,有货和缺货订单将根据库存实际情况调整,确认刷新?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then((res) => {
        match().then((res) => {
          if (res.code == 200) formOptions.value.init();
        });
      });
    }; // 刷新库存

    const isShow = (types) => {
      const { orderTabType } = store.getters;
      const list = orderOptions[orderTabType].button;
      if (list.indexOf(types) !== -1) {
        return true;
      } else {
        return false;
      }
    }; // 是否显示按钮

    const batch = computed(() => {
      const { orderTabType } = store.getters;
      // showAboutPermission
      // let x =orderOptions[orderTabType].batch

      let x =
        orderOptions[orderTabType].batch?.filter((v) => authPath(v.permission)) || [];
      //过滤权限
      //  console.log(x,123)
      return x;
    });

    const batchRef = ref();

    const getBatch = (val) => {
			console.log(val)
      if (val === null) return;
      if (!isSelected()) return;
      const packageIds = orderTable.value.selectRows.join(",");
      if (val[1]) {
        btnFunction[val[1]](packageIds, orderTable.value.tableData);
      } else if(val[0] === 'refund'){
				btnFunction[val[0]](orderTable.value.selectInfo, orderTable.value.tableData); // 退款按钮单独处理
      }else{
				btnFunction[val[0]](packageIds, orderTable.value.tableData);
			}
    };

    const clickBtn = (val) => {
      if (val) {
        let packageIds = [];

        packageIds = orderTable.value.selectRows.join(",");
        if (val == "print" && packageIds?.length > 0) {
          data.printLoading = true;
        }
        let whiteList = ["changeMorePay", "exportDian"];
        if (whiteList.indexOf(val) !== -1) {
          btnFunction[val](packageIds);
          return;
        }
        if (!isSelected()) return;

        if (val == "refund") {
          let selectInfo = orderTable.value.selectInfo;
          btnFunction[val](selectInfo)?.finally((res) => {
            data.printLoading = false;
          });
          return false;
        }

        btnFunction[val](packageIds)?.finally((res) => {
          data.printLoading = false;
        });
      }
    };

    const visibleDropDown = (val) => {
      if (!val) {
        data.batchVal = "";
      }
      batchRef.value.clearCheckedNodes();
    };

    const changeLogistic = () => {
      formOptions.value.form.orderStatus = -1;
      formOptions.value.init(1);
      store.dispatch("orderManage/setIsChangeLogistByActions", true);
    };

    //点击导出订单按钮
    const exportOrder = () => {
      data.showExportOrder = true;
    };

    //关闭导出订单弹框
    const closeExportOrderView = (res) => {
      data.showExportOrder = res;
    };

    const showAboutPermission = (val) => {
      return authPath(val) || false;
    };

    onMounted(() => {
      console.log(btnFunction);
    });
    return {
      ...toRefs(data),
      exportOrder, //点击导出订单按钮
      closeExportOrderView, //关闭导出订单弹框
      showDialog,
      showDialogFooter,
      examine,
      isShow,
      batch,
      getBatch,
      visibleDropDown,
      batchRef,
      clickBtn,
      matchDeduct,
      changeLogistic,
      jsonStr,
      packageIdList,
      showAboutPermission,
			changeGoodsType
    };
  },
};
</script>

<style scoped lang="scss">
.btnList {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .btnLeft {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .btnRight {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
.el-dropdown {
  vertical-align: top;
}
.el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.outterContainer {
  width: 100%;
}
</style>
