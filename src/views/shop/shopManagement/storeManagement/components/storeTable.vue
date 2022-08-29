<template>
<div class="buttonbox">
  <el-dropdown style="margin: 0 10px">
    <el-button type="primary">
      批量操作<i class="el-icon-arrow-down el-icon--right"></i>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <div style="padding: 10px 10px">
          <el-cascader-panel ref="batchRef" v-model="batchVal" :props="{expandTrigger: 'hover'}" :multiple="true" :options="batch" @change="getBatch">
          </el-cascader-panel>
        </div>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- <el-button type="primary" @click="deleteShop(idObj.checkId.join(','))">批量删除</el-button> -->

  <el-button type="primary" @click="exportDialog=true" style="dispaly:none">导出</el-button>
</div>
<div class="tableBox">
  <el-table :data="data" ref="tableRef" :border="true" max-height="420px" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" @selection-change="selectionChange">
    <el-table-column type="selection" align="center" width="50">
    </el-table-column>
    <el-table-column label="店铺名称" align="center" prop="name" width="100">
      <template #default="scope">
        <span class="twoText" :title="scope.row.name">{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column label="店铺平台" align="center" prop="platform" width="100"> </el-table-column>
    <el-table-column label="店铺ID" align="center" prop="platformId" width="110"> </el-table-column>
    <el-table-column label="主域名" align="center" prop="domain">
      <template #default="scope">
        <el-tooltip class="item" effect="light" placement="top">
          <template #content>
            <a v-copy="scope.row.domain">复制</a>
          </template>
          <a class="twoText" :title="scope.row.domain" :href="scope.row.domain" target="_blank">{{scope.row.domain}}</a>
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column label="临时域名" align="center" prop="tempDomain" width="90">
      <template #default="scope">
        <el-tooltip class="item" effect="light" placement="top">
          <template #content>
            <a v-copy="scope.row.tempDomain">复制</a>
          </template>
          <a class="twoText" :title="scope.row.tempDomain" :href="scope.row.tempDomain" target="_blank">{{scope.row.tempDomain}}</a>
        </el-tooltip>

      </template>
    </el-table-column>
    <el-table-column label="插件数" align="center" width="85">
      <template #header>
        <span>插件数</span>
        <el-tooltip class="item" effect="light" content="任一插件到期前10天均会标红提示" placement="top">
          <i class="el-icon-question"></i>
        </el-tooltip>

      </template>

      <template #default="{row}">
        <span v-if="row.pluginStatus" style="color:red">{{row.pluginNum}}</span>
        <span v-else>{{row.pluginNum}}</span>
      </template>
    </el-table-column>

    <el-table-column label="套餐到期时间" align="center" prop="platTime" width="135">
      <template #header>
        <span>套餐到期时间</span>
        <el-tooltip class="item" effect="light" content="注意：套餐到期后续费需重新授权（授权状态不做异常提示）" placement="top">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </template>
      <template #default="{row}">
        <!-- 时间小于十天报红 -->
        <span v-if="row.platStatus" style="color:red">{{row.platTime}}</span>
        <span v-else>{{row.platTime}}</span>
      </template>
    </el-table-column>
    <el-table-column label="域名到期时间" align="center" prop="domainEndTime" width="125">
      <template #default="{row}">
        <!-- 时间小于十天报红 -->
        <span v-if="row.domStatus" style="color:red">{{row.domainEndTime}}</span>
        <span v-else>{{row.domainEndTime}}</span>
      </template>
    </el-table-column>
    <el-table-column label="店铺状态" align="center" width="100">
      <template #default="scope">
        {{scope.row.shopStatus==1?'已开启':'未开启'}}
      </template>
    </el-table-column>
    <el-table-column label="授权状态" align="center" width="100">
      <template #default="{row}">
        <span v-if="row.authorStatus<2">{{row.authorStatus==0?'未授权':'已授权'}}</span>
        <span v-else style="color:red">授权异常</span>
      </template>
    </el-table-column>
    <el-table-column prop="firstAuthorTime" label="首次授权时间" align="center" width="110">
    </el-table-column>
    <el-table-column label="异常原因" align="center" width="100">
      <template #default="{row}">
        {{row.error||'--'}}
      </template>
    </el-table-column>
    <el-table-column label="使用部门" align="center" width="90">
      <template #default="scope">
        {{scope.row.useDeptName||'--'}}
      </template>
    </el-table-column>
    <el-table-column label="负责人" align="center" width="90">
      <template #default="scope">
        {{scope.row.leaderName||'--'}}
      </template>
    </el-table-column>
    <el-table-column label="支付方式" align="center" width="150">
      <template #default="scope">
        <div v-for="item in scope.row.paymentMethod" :key="item">
          <div class="overText" :title="item">{{item}}</div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="90" fixed="right">
      <template #default="{row}">
        <div class="operation">
          <a href="javascript:;" @click="routerDetails(row.shopId)">详情</a>
          <a href="javascript:;" @click="openAuth(row)" v-if="row.shopStatus==1">{{row.authorStatus==1?'重新授权':'添加授权'}}</a>
          <a href="javascript:;" class="info" v-else>{{row.authorStatus==1?'重新授权':'添加授权'}}</a>
          <a href="javascript:;" @click="showRenewDialog(row)" v-if="row.shopStatus==1">续费/变更</a>
          <a href="javascript:;" class="info" v-else>续费</a>
          <a href="javascript:;" class="danger" @click="deleteShop([row.shopId],true)" v-if="row.shopStatus==0">删除</a>
          <a href="javascript:;" class="info" v-else>删除</a>
        </div>
      </template>
    </el-table-column>
  </el-table>
</div>
<RenewDialog v-if="showDialog" :data="rowData" @close="showDialog=false" @search="context.emit('search')" />
<ExportDialog v-if="exportDialog" @close="exportDialog = false" :idObj="idObj" :formData="formData" />
<authorDialog v-if="authSwitch" :data="authCheckData" @closeEvent="authSwitch = false" @search="context.emit('search')" />
<batchEditDept v-if="batchEditDeptDialog" @closeEvent="batchEditDeptDialog = false" @search="context.emit('search')" :ids="idObj.checkId"/>
</template>

<script>
import { computed, onMounted, reactive, toRefs, watch, watchEffect } from 'vue'
import RenewDialog from './renewDialog/index.vue'
import ExportDialog from './StoreDetails/components/exportDialog.vue'
import authorDialog from './authorDialog/index.vue'
import { useRouter } from 'vue-router'
import { copy } from '@/directives/erpToolsDirective.js'
import { removeShop } from '@/api/goods/shop.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { storage } from '@/utils/storage.js'
import { authPath } from '@/utils/hooks.js'
import batchEditDept from './components/batchEditDept.vue'
export default {
  components: { RenewDialog, ExportDialog, authorDialog,batchEditDept },
  directives: { copy },
  props: {
    data: {
      type: Array,
      default: []
    },
    formData: {}
  },
  emits: ['search'],
  setup(props, context) {
    const router = useRouter()
    const state = reactive({
      data: props.data,
      showDialog: false,
      exportDialog: false,
      rowData: {},
      idObj: {
        checkId: [],
        allId: []
      },
      checkData: [],
      batchVal: '',
      batchRef: null,
      authSwitch: false,
      authCheckData: {},
      tableRef:null,
      batchEditDeptDialog:false
    })

    watch(() => props.data, val => {
      state.idObj.allId = val.map(item => +item.shopId)
    }, { deep: true })

    function showRenewDialog(row) {
      state.showDialog = true
      state.rowData = row
      console.log(row);
    }

    function routerDetails(id) {
      router.push({
        name: 'storeDetails',
        query: { id }
      })
    }

    function selectionChange(e) {
      state.idObj.checkId = e.map(item => item.shopId)
      state.checkData = e
    }

    function deleteShop(id, is_row) {
      if (!id.length) {
        ElMessage.error('请选择要删除的店铺！')
      } else {
        if (!is_row) {
          let fd = props.data.filter(item => id.includes(item.shopId))
          let flag = fd.every(item => item.shopStatus == 1)
          if (flag) return ElMessage.error('当前选中店铺全部为已开启，无法删除')
        }
        ElMessageBox.confirm(
          '确定删除吗？',
          '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error',
          }
        ).then(res => {
          console.log(id);
          removeShop({ shopId: id.join(',') }).then(res => {
            ElMessage.success('删除成功！')
            context.emit('search')
          })
        })

      }

    }

    const batch = [{
        value: '',
        label: '批量续费',
        disabled: !authPath('batchEditShop'),
        children: [{
            value: '批量域名续费,batchDomainRenewal',
            label: '域名续费',
          },
          {
            value: '批量套餐续费,batchPackageRenewal',
            label: '套餐续费',
          },
          {
            value: '批量插件续费,batchPluginRenewal',
            label: '插件续费',
          },
        ]
      },

      {
        value: '',
        label: '批量变更',
        disabled: !authPath('batchEditShop'),
        children: [{
            value: '批量域名变更,batchDomainChange',
            label: '域名变更',
          },
          {
            value: '批量套餐变更,batchPackageChange',
            label: '套餐变更',
          },
          {
            value: '批量插件新增,batchPluginChange',
            label: '插件新增',
          },
        ]
      },
      {
        value: 'delete',
        label: '批量删除',
        disabled: !authPath('batchEditShopDelete'),
      },
       {
        value: 'editDept',
        label: '批量修改部门',
        disabled: !authPath('batchEditDept'),
      },
    ]

    function getBatch(e) {
      console.log(e);
      state.batchVal = []
      if (e.length == 1) {
        switch (e[0]) {
          case 'delete':
            deleteShop(state.idObj.checkId)
            break;
          case 'editDept':
            if(!state.idObj.checkId.length) return ElMessage.error('请选择店铺')
            state.batchEditDeptDialog = true
            break;
        }
      } else {
        if (state.checkData.length == 0) return ElMessage.error('请选择店铺')
        storage.set('shopdata', state.checkData)
        router.push({
          name: 'batchEditShop',
          query: {
            value: e[1]
          }
        })
      }
    }

    function openAuth(data) {
      state.authSwitch = true
      state.authCheckData = data
    }
    return {
      ...toRefs(state),
      showRenewDialog,
      routerDetails,
      selectionChange,
      deleteShop,
      moment,
      context,
      getBatch,
      batch,
      openAuth
    }
  }
}
</script>

<style lang="scss" scoped>
.operation {
  display: flex;
  flex-direction: column;
  align-items: center;

  .danger {
    color: #fd4c60;
  }
}

.overText {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.twoText {
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.info {
  color: #909399;
  cursor: not-allowed;
}

.buttonbox {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
}

.tableBox {
  background-color: #fff;
  padding: 24px 30px;
  border-radius: 2px 2px 2px 0px;
}
</style>
