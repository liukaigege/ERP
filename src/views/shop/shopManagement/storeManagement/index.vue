<template>
<div class="contaner">
  <div class="search-header">
    <el-form v-model="formData" :inline="true"  @keyup.enter="search">
      <el-form-item label="搜索内容:">
        <div class="formItem">
          <el-select v-model="formData.searchType" class="select" clearable>
            <el-option label="店铺名称" :value="1"></el-option>
            <el-option label="店铺ID" :value="2"></el-option>
            <el-option label="主域名" :value="3"></el-option>
            <el-option label="临时域名" :value="4"></el-option>
          </el-select>
          <el-input v-model="formData.keyword" class="w318 l16" placeholder="请输入要检索的内容多条可用逗号或空格隔开"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="平台:">
        <el-select v-model="formData.source" class="select" clearable>
					<el-option label="funpinpin" value="funpinpin"></el-option>
          <el-option label="shopify" value="shopify"></el-option>
          <el-option label="shoplazza" value="shoplazza"></el-option>
          <el-option label="shopline" value="shopline"></el-option>
           <el-option label="shopyy" value="shopyy"></el-option>
					<el-option label="vshop" value="vshop"></el-option>
          <el-option label="xshoppy" value="xshoppy"></el-option>
          <el-option label="shopbase" value="shopbase"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺状态:">
        <el-select v-model="formData.shopStatus" clearable style="width:150px">
          <el-option label="关闭" :value="0"></el-option>
          <el-option label="开启" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="授权状态:">
        <el-select v-model="formData.authorStatus" class="select" clearable>
          <el-option label="未授权" :value="0"></el-option>
          <el-option label="已授权" :value="1"></el-option>
          <el-option label="授权异常" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="使用部门:">
        <elSelectTree ref="userRef" v-if="treeShow" filterable :data="deptList" :treeProps="treeProps" checkStrictly :width="200" @ok="ok" />
      </el-form-item>
      <el-form-item label="负责人:">
        <el-select v-model="formData.leaderArr" collapse-tags multiple clearable filterable>
          <el-option v-for="item in userList" :key="item.userId" :label="item.fullName" :value="item.userId">
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="支付方式:">
        <el-cascader v-model="value" style="width:300px" :options="payData" filterable @change="payChange" :props="{label:'name',value:'name',children:'children',checkStrictly: true}"></el-cascader>
        <el-button type="primary" @click="search" style="margin-left:16px">查询</el-button>
        <el-button @click="reSet">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="sort">
    排序：
    <span :class="formData.sortName=='s.open_time'?'c1890FF':'c909399'" @click="sortClick('open_time')">开店时间<i :class="open_time=='desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i></span>
    <span :class="formData.sortName=='s.plat_time'?'c1890FF':'c909399'" @click="sortClick('plat_time')">平台到期时间<i :class="plat_time=='desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i> </span>
    <span :class="formData.sortName=='s.domain_time'?'c1890FF':'c909399'" @click="sortClick('domain_time')">域名到期时间<i :class="domain_time=='desc' ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></i></span>
  </div>

  <div class="tableBox">
    <!-- table组件 -->
    <storeTable :data="tableData" @search="search" :formData="formData" />
  </div>
  <!-- 分页器 -->
  <div class="flex-pagination page-fixed">
    <div></div>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30, 40, 100]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.totalCount">
    </el-pagination>
  </div>

</div>
</template>

<script>
import { onActivated, onMounted, provide, reactive, toRefs, nextTick } from 'vue'
import storeTable from './components/storeTable.vue'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { shopManagmentList, shopUserList, paymentSelect, queryLeader } from '@/api/goods/shop.js'
import { erpElTable } from '@/utils/hooks.js'
import { useRoute } from 'vue-router'
export default {
  name: 'storeManagement',
  components: { storeTable, elSelectTree },
  setup() {
    const route = useRoute()
    const state = reactive({
      is_Init: false,
      formData: {
        searchType: '', // 搜索类别
        keyword: '', // 搜索内容
        source: '', // 平台
        authorStatus: '', //授权状态
        leader: '',
        useDept: '',
        shopStatus: '',
        sortName: 's.open_time',
        type: 'desc',
        payment: '',
        method: '',
        account: '',
        leaderArr: []
      },
      plat_time: 'desc',
      open_time: 'desc',
      domain_time: 'desc',
      deptList: [],
      userList: [],
      treeProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        disabled: 'disabled'
      },
      treeShow: true,
      payData: [],
      value: '',
      userRef: null,
      defaultLeaderList: []
    })

    onActivated(() => {
      if(route.params.isEdit == 'true'){
        search()
      }
    })

    onMounted(()=>{
      const defalut = {
        shopStatus:'',
        authorStatus:''
      }
      const params = route.params.data?JSON.parse(route.params.data):{}
      Object.assign(defalut,params)
      search(defalut)
      createData()
    })

    const {
      tableData,
      pagination,
      search: toSearch,
      handleSizeChange,
      handleCurrentChange
    } = erpElTable(shopManagmentList, state.formData, {
      dataFilter: res => {
        res.map(item => {
          item.domStatus = (new Date(item.domainEndTime).getTime() - new Date().getTime()) < 864000000
          item.platStatus = (new Date(item.platTime).getTime() - new Date().getTime()) < 864000000
          item.domainEndTime = item.domainEndTime.split(' ')[0]
          item.pluginNum = item.pluginList.length
          item.pluginStatus = false
          item.pluginList.forEach(val => {
            if ((new Date(val.endTime).getTime() - new Date().getTime()) < 864000000) {
              item.pluginStatus = true
            }
          })
        })
        return res
      },
      autoSearch: false
    })
    provide('search', search)

    function loop(data) {
      data.forEach(item => {
        if (item.children && item.children.length) loop(item.children)
        console.log(item.deptId, state.formData.useDept);
        if (item.deptId == state.formData.useDept) {
          if (item.userVos) {
            state.userList = item.userVos
          }
        }
      })
    }

    function sortClick(val) {
      if (state.formData.sortName != 's.' + val) {
        state[val] = 'desc'
      } else {
        state[val] = state[val] == 'desc' ? 'asc' : 'desc'
      }
      state.formData.sortName = 's.' + val
      state.formData.type = state[val]
      search()
    }

    function ok(e) {
      state.formData.useDept = e
      state.formData.leaderArr = ''
      state.formData.leader = ''
      state.userList = []
      if (e) {
        loop(state.deptList)
      } else {
        state.userList = state.defaultLeaderList
      }

    }

    function reSet() {
      state.formData.searchType = ''
      state.formData.keyword = ''
      state.formData.source = ''
      state.formData.authorStatus = ''
      state.formData.sortName = 's.open_time'
      state.formData.type = 'desc'
      state.formData.payment = ''
      state.formData.method = ''
      state.formData.account = ''
      state.formData.shopStatus = ''
      state.value = ''
      state.plat_time = 'desc'
      state.open_time = 'desc'
      state.domain_time = 'desc'
      state.formData.leaderArr=[]
      state.formData.leader = ''
      state.userRef.clearHandle()
      search()
    }

    function payChange(e) {
      state.formData.payment = ''
      state.formData.method = ''
      state.formData.account = ''
      if (e) {
        if (e[0] != 'paypal') {
          state.formData.payment = e[0] == 'creditCard' ? 2 : 3
          state.formData.method = e[1] || ''
          state.formData.account = e[2] || ''
        } else {
          state.formData.payment = 1
          state.formData.account = e[1] || ''
        }
      }
      console.log(state.formData);
    }

    function search(value = {}) {
      Object.assign(state.formData,value)
      if(state.formData.leaderArr.length){
        state.formData.leader = state.formData.leaderArr.join(',')
      }else{
        state.formData.leader = ''
      }
      toSearch()
    }

    function createData() {
      queryLeader().then(res => {
        state.defaultLeaderList = res.data
        state.defaultLeaderList.forEach(item => {
          item.fullName = item.leaderName
          item.userId = item.leaderId
        })
        state.userList = state.defaultLeaderList
      })
      shopUserList().then(res => {
        state.deptList = res.data
      })
      paymentSelect().then(res => {
        res.data.forEach(item => {
          if (item.type) item.children = []
        })
        const payData = [
          { name: 'creditCard', children: res.data.filter(item => item.type == 1) },
          ...res.data.filter(item => item.type == 2),
          { name: 'localPayment', children: res.data.filter(item => item.type == 3) }

        ]

        payData.forEach(item => {
          if (item.children.length == 0) {
            item.children = res.data.filter(val => item.id == val.pid)
          } else {
            item.children.forEach(val => {
              val.children = res.data.filter(a => val.id == a.pid)
            })
          }
        })
        state.payData = payData
      })
    }
    return {
      ...toRefs(state),
      sortClick,
      ok,
      tableData,
      pagination,
      search,
      handleSizeChange,
      handleCurrentChange,
      reSet,
      payChange
    }
  }
}
</script>

<style lang="scss" scoped>
.contaner {
  margin-bottom: 60px;
}

.search-header {
  background-color: #fff;
  padding: 24px;
  border-radius: 3px;
  padding-bottom: 1px;
}

.select {
  width: 140px;
}

.formItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.w318 {
  width: 318px;
}

.l16 {
  margin-left: 16px;
}

.c1890FF {
  color: #1890ff;

  span {
    margin-right: 5px;
    cursor: pointer;
  }
}

.c909399 {
  color: #909399;

  &:hover {
    color: #1890ff;
  }

  span {
    margin-right: 5px;
    cursor: pointer;
  }
}

.sort {
  margin-top: 24px;

  span {
    margin-right: 8px;
    cursor: pointer;
  }
}

.el-form-item {
  margin-left: 6px;
}
</style>
