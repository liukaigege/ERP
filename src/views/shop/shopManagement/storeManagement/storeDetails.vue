<template>
<div class="contaner">
  <div class="box">
    <erpNav title="店铺详情" :routeOpt="{name:'storeManagement', params: { username: 'eduardo' ,isEdit}}">
      <template #default>
        <div class="creatTime">
          创建时间：{{data.createTime}}
        </div>
      </template>
    </erpNav>
    <StoreInfo :data="data" :defaultCheckedKeys="defaultCheckedKeys" :userList="userList" @detail="detail" :editShop="editSwitch" @flag="flag" />
    <DomainExpenses :data="data" @detail="detail" />
    <PlatformExpenses :data="data" @detail="detail" />
    <UnitExpenses :data="data" @detail="detail" />
    <PaymentMethod :data="data" @detail="detail" />
    <TaxSettings :data="data" @detail="detail" :editShop="editSwitch" @flag="flag" />
  </div>
  <div class="flex-pagination page-fixed">
    <div></div>
    <div>
      <el-button @click="router.push({name:'storeManagement'})">取消</el-button>
      <el-button type="primary" @click="editShop" :disabled="data.shopStatus==0">确定</el-button>
    </div>
  </div>
</div>
</template>

<script>
import StoreInfo from './components/StoreDetails/StoreInfo.vue'
import DomainExpenses from './components/StoreDetails/DomainExpenses.vue'
import PlatformExpenses from './components/StoreDetails/PlatformExpenses.vue'
import UnitExpenses from './components/StoreDetails/UnitExpenses.vue'
import PaymentMethod from './components/StoreDetails/PaymentMethod.vue'
import TaxSettings from './components/StoreDetails/TaxSettings.vue'
import erpNav from '@/components/erpNav/index.vue'
import { onMounted, reactive, toRefs } from 'vue'
import { shopDetail } from '@/api/goods/shop.js'
import { useRoute, useRouter } from 'vue-router'
import { shopUserList, editShopMsg,checkShopName } from '@/api/goods/shop.js'
import { ElMessage } from 'element-plus'
export default {
  components: { StoreInfo, DomainExpenses, PlatformExpenses, UnitExpenses, PaymentMethod, TaxSettings, erpNav },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const state = reactive({
      data: {},
      defaultCheckedKeys: [],
      userList: [],
      editSwitch: false,
      isSubmit: true,
      isEdit:false
    })

    onMounted(() => {
      detail()
      if (!route.query.id) router.push({ name: 'storeManagement' })
    })

    function detail() {
      if(Object.keys(state.data).length) state.isEdit = true
      state.defaultCheckedKeys = []
      shopDetail({ shopId: +route.query.id }).then(res => {
        if (Array.isArray(res.data.shopPlugin)) {
          res.data.shopPlugin.forEach(val => {
            val.unitDetail = false
            val.tableData = []
            val.endTime = val.endTime ?.split(' ')[0]
          })
        }
        res.data.Alipay = { locationName: 'Alipay', locationAccount: '', locationFee: '' }
        res.data.Payssion = { locationName: 'Payssion', locationAccount: '', locationFee: '' }
        res.data.shopLocationMsg ?.forEach(val => {
          res.data[val.locationName] = val
        })
        res.data.openTime = res.data.openTime ?.split(' ')[0]
        res.data.shopPlatterEndTime = res.data.shopPlatterEndTime ?.split(' ')[0]
        res.data.domainTime = res.data.domainTime ?.split(' ')[0]
        res.data.authorStatusStr = res.data.authorStatus == 0 ? '未授权' : '已授权'
        res.data.shopStatusStr = res.data.shopStatus == 0 ? '未开启' : '已开启'

        state.data = res.data
        shopUserList().then(res => {
          loop(res.data)
          state.userList = res.data
          state.defaultCheckedKeys.push(state.data.leader)
        })
      }).catch(res => {
        router.push({ name: 'storeManagement' })

      })

    }

    function loop(data) {
      data.forEach(item => {
        item.disabled = true
        if (item.children && item.children.length) loop(item.children)
        let arr = []
        if (item.userVos && item.userVos.length) {
          item.userVos.forEach(val => {
            arr.push({
              deptId: val.userId,
              deptName: val.userName,
              disabled: false
            })
          })
        }
        item.children = arr.concat(item.children)
      })
    }

    function editShop() {
      state.isSubmit = true
      state.editSwitch = true
      setTimeout(() => {
        state.editSwitch = false
      }, 100);

      setTimeout(() => {
        if (state.isSubmit) {

          checkShopName({ shopId: state.data.shopId, name: state.data.name }).then(res => {
            editShopMsg({
              shopId: state.data.shopId,
              name: state.data.name,
              warehouseId: state.data.warehouseId,
              euVat: state.data.euVat,
              ukVat: state.data.ukVat,
              shopStatus: state.data.shopStatus
            }).then(res => {
              ElMessage.success('店铺信息保存成功')
              setTimeout(() => {
                router.push({ name: 'storeManagement' })
              }, 500)
            })
          })

        }
      }, 200);
    }

    function flag(e) {
      if (!e) {
        state.isSubmit = e
      }
    }
    return {
      ...toRefs(state),
      detail,
      editShop,
      flag,
      router
    }
  }
}
</script>

<style lang="scss" scoped>
.contaner {
  padding-top: 20px;

  ::v-deep(.box) {
    padding-bottom: 45px;

    .el-card {
      border: unset;
    }

    .el-card+.el-card {
      margin-top: 15px;
      
    }

    .card-header {
      display: flex;
      justify-content: space-between;
    }

    .box-card .formBox {
      .flex-form-item {
        display: flex;
        justify-content: space-between;
        padding: 0 180px;
      }

      .card-header {
        font-size: 16px;
      }

      .w310 {
        width: 310px;
      }

      .w204 {
        width: 204px;
      }

      .w98 {
        width: 98px;
        margin-left: 8px;

        .el-input__inner {
          text-align: center;
        }
      }

      .box-card {
        margin-bottom: 24px;
      }

      .float-right {
        position: absolute;
        right: -190px;
        font-size: 16px;
        color: #fd4c60;
      }

      .click-a {
        margin-left: 16px;
      }

      .detailsTableBox {
        height: 0;
        transition: all 0.5s;
      }

      .el-collapse-item__header {
        display: none;
      }
    }

  }
}
.creatTime{
  position: absolute;
  right: 16px;
  bottom: 8px;
}
</style>
