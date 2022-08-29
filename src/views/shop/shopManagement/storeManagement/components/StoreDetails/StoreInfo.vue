<template>
<el-card class="box-card data" shadow="never">
  <template #header>
    <div class="card-header">
      <span>基本信息</span>
    </div>
  </template>
  <div class="formBox">
    <el-form :model="data" ref="formRef" label-width="120px">
      <div class="flex-form-item">
        <el-form-item label="店铺名称:" prop="name" :rules="{required:true,message:'请输入店铺名称',trigger:'blur'}">
          <el-input v-model="data.name" class="w310" :disabled="data.shopStatus==0" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="店铺ID:">
          <el-input v-model="data.platformId" class="w310" disabled></el-input>
        </el-form-item>
      </div>

      <div class="flex-form-item">
        <el-form-item label="所属平台:">
          <el-select v-model="data.platform" class="w310" placeholder="请选择" disabled>
            <el-option v-for="item in platform" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="临时域名:">
          <el-input placeholder="请输入内容" class="w310" v-model="data.tempDomain" disabled>
          </el-input>
        </el-form-item>
      </div>

      <div class="flex-form-item">
        <el-form-item label="发货仓库:">
          <el-select v-model="data.warehouseId" class="w310 remove" placeholder="请选择" :disabled="data.shopStatus==0">
            <el-option v-for="item in storeSelect" :key="item.id" :label="item.warehouseName" :value="+item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权状态:">
          <el-input v-model="data.authorStatusStr" class="w310" disabled></el-input>
        </el-form-item>
      </div>

      <div class="flex-form-item">
        <el-form-item label="店铺状态:">
          <el-input v-model="data.shopStatusStr" class="w310" disabled></el-input>
          <a href="javascript:;" class="click-a" @click="openStatusDialog">更改</a>
        </el-form-item>
        <el-form-item label="开店时间:">
          <el-input v-model="data.openTime" disabled class="w310"></el-input>
        </el-form-item>
      </div>

      <div class="flex-form-item editpr">
        <el-form-item label="使用部门:">
          <el-input v-model="data.useDeptName" disabled class="w310"></el-input>
          <a href="javascript:;" class="click-a" @click="userDialogShow=true" v-if="data.shopStatus!=0">更改</a>
        </el-form-item>
        <el-form-item label="负责人:">
          <el-input v-model="data.leaderName" disabled class="w310"></el-input>
            <a href="javascript:;" class="click-a" @click="openDetail">明细 <i :class="dataDetails?'el-icon-arrow-up':'el-icon-arrow-down'"></i></a>
        </el-form-item>
      </div>

    </el-form>

    <DetailsTable :tableData="tableData" isSec :tableKey="['useDeptName','startTime','endTime','leaderName']" :tableName="['使用部门','使用时间','停用时间','负责人']" isDelete :isOpen="dataDetails" :className="'data'" :type="{api:ownerLogDel,callback:detailData,data}" @detail="detail" />
  </div>
  <!-- 店铺状态修改弹框 -->
  <StatusDialog v-if="statusDialogShow" @closeEvent="closeEvent" :data="data" @detail="detail" />
  <!-- 负责人修改弹框 -->
  <UserDialog v-if="userDialogShow" @closeEvent="closeEvent" :data="data" @detail="detail" />
</el-card>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue'
import DetailsTable from './components/DetailsTable.vue'
import StatusDialog from './components/StatusDialog.vue'
import UserDialog from './components/UserDialog.vue'
import { getWareHouse } from '@/api/store.js'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { shopsMsg, ownerLogDel } from '@/api/goods/shop.js'
export default {
  props: {
    is_Submit: {
      type: Boolean
    },
    data: {
      type: Object
    },
    defaultCheckedKeys: {
      default: null
    },
    userList: {},
    editShop: {}
  },
  components: {
    DetailsTable,
    UserDialog,
    StatusDialog,
    elSelectTree
  },
  emits: ['detail', 'flag'],
  setup(props, context) {
    const state = reactive({
      tableData: [],
      data: props.data,
      formRef: '',
      dataDetails: false,
      statusDialogShow: false,
      userDialogShow: false,
      storeSelect: [],
      treeProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        disabled: 'disabled'
      },
      fullName: ''
    })
    const rules = {
      name: [{ required: true, message: '请输入', trigger: 'blur' }]
    }
    const platform = [
      { value: 'shopify', label: 'shopify' },
      { value: 'shoplazza', label: 'shoplazza' },
      { value: 'vshop', label: 'vshop' },
      { value: 'shopline', label: 'shopline' },
      { value: 'funpinpin', label: 'funpinpin' },
      { value: 'xshoppy', label: 'xshoppy' },
      { value: 'shopyy', label: 'shopyy' },
      { value: 'shopbase', label: 'shopbase' }
    ]

    watch(() => props.editShop, val => {
      if (val) {
        state.formRef.validate().then(res => {
          context.emit('flag', true)
        }).catch(res => {
          context.emit('flag', false)
        })
      }
    })
    onMounted(() => {

      getWareHouse({
        page: {
          pageNo: 1,
          pageSize: 100
        }
      }).then(res => {
        state.storeSelect = res.data.dataList
      })
      props.data.authorStatus == 0 ? '未授权' : '已授权'
    })

    watch(() => props.userList, val => {
      function loop(data) {
        data.forEach(item => {
          if (item.children && item.children.length) loop(item.children)
          if (item.userVos && item.userVos.length) {
            item.userVos.forEach(val => {
              if (val.userId == props.data.leader) {
                state.fullName = val.fullName
              }
            })
          }
        })
      }
      loop(val)
    }, { deep: true })

    function openStatusDialog() {
      state.statusDialogShow = true
    }

    // 弹出框关闭事件
    function closeEvent(key) {
      state[key] = false
    }

    function detail() {
      state.dataDetails = false
      context.emit('detail')
    }

    function openDetail() {
      state.dataDetails = !state.dataDetails
      if (state.dataDetails) {
        detailData()
      }
    }

    function detailData() {
      shopsMsg({ shopId: props.data.shopId }).then(res => {
        state.tableData = res.data
      })
    }

    return {
      ...toRefs(state),
      rules,
      platform,
      openStatusDialog,
      closeEvent,
      detail,
      openDetail,
      ownerLogDel,
      detailData
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  background-color: var(--el-disabled-fill-base) !important;
  border-color: var(--el-disabled-border-base) !important;
  text-align: left;
}

.flex {
  display: flex;
}
.editpr{
  padding-right: 118px !important;
}
</style>
