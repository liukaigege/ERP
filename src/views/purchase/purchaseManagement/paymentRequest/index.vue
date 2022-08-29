<template>
  <div>
    <AffixTab>
      <template v-slot:tabSlot>
        <el-button :type="combineType == 0 ? 'primary' : 'default'" @click="tabSelectEvent(0)" class="btn">
          <div>草稿</div>
          <div class="num">
            (<span :class="combineType == 0 ? 'active-num' : 'noactive-num'">{{
              count0
            }}</span>)
          </div>
        </el-button>
        <div class="tab_left_box">
          <p class="title">审核</p>
          <div class="btn">
            <el-button :type="combineType == 1 ? 'primary' : 'text'" @click="tabSelectEvent(1)">
              待审核 (<span :class="combineType == 1 ? 'active-num' : 'noactive-num'">{{ count1 }}</span>)
            </el-button>
            <el-button :type="combineType == 2 ? 'primary' : 'text'" @click="tabSelectEvent(2)">
              未通过 (<span :class="combineType == 2 ? 'active-num' : 'noactive-num'">{{ count2 }}</span>)
            </el-button>
          </div>
        </div>
        <el-button :type="combineType == 3 ? 'primary' : 'default'" @click="tabSelectEvent(3)" class="btn">
          <div>已付款</div>
          <div class="num">
            (<span :class="combineType == 3 ? 'active-num' : 'noactive-num'">{{
              count3
            }}</span>)
          </div>
        </el-button>
      </template>
    </AffixTab>
    <div class="form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="form" @keyup.enter="submitForm" >
        <el-form-item class="timeSelect">
          <el-select v-model="formInline.timeType" style="width: 120px; margin-right: 16px">
            <el-option v-for="(item, index) in timeList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-date-picker clearable class="daterange" unlink-panels style="width: 256px" v-model="formInline.start_end" value-format="YYYY-MM-DD" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="搜索内容:">
          <el-select v-model="formInline.type" clearable style="width: 140px">
            <el-option label="采购单号" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.keyword" placeholder="多个采购单号用逗号隔开" @keydown.enter="submitForm" clearable></el-input>
        </el-form-item>
        <el-form-item label="采购员:">
          <el-select v-model="formInline.userIds" clearable style="width: 200px" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算方式:">
          <el-select style="width: 130px" v-model="formInline.settlement" clearable @change="settlementChange">
            <el-option label="款到发货" :value="4"></el-option>
            <el-option label="预付" :value="1"></el-option>
            <el-option label="货到付款" :value="3"></el-option>
            <el-option label="账期（30天）" value="5,30"></el-option>
            <el-option label="账期（45天）" value="6,45"></el-option>
            <el-option label="账期（60天）" value="7,60"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商:" prop="supplierModel">
          <el-cascader ref="cascaderRef" v-model="formInline.supplierModel" :options="supplierOptions" :props="defaultProps" filterable collapse-tags @change="changeSupplier" clearable style="width: 200px"></el-cascader>
        </el-form-item>
        <el-form-item label="创建人:">
          <el-select v-model="formInline.createByIds" clearable style="width: 200px" multiple collapse-tags collapse-tags-tooltip>
            <el-option v-for="item in createByList" :key="item.id" :label="item.userName" :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div>
            <el-button type="primary" @click="submitForm">查询</el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <component :is="currentComponent" :form="formInline" :dataList="dataList" @selectCount="multipleSelection" @openDetail="openDetail" @listRefresh="listRefresh"></component>
    <ErpPage :total="total" :count="selectCount" @updateData="updateData" :pageSizes="[10, 20, 30, 40, 100, 300]" />
  </div>

</template>

<script>
import {
  reactive,
  toRefs,
  computed,
  onMounted,
  onActivated,
  onDeactivated
} from 'vue'
import AffixTab from '@/components/affixTab/index.vue'
import Draft from './components/draft/index.vue'
import Applying from './components/applying/index.vue'
import Failing from './components/failing/index.vue'
import Paid from './components/paid/index.vue'
import ErpPage from '@/components/erpPage/index.vue'
import { supplierPayTypeOptions } from '@/assets/js/staticData'
import { useRouter, useRoute } from 'vue-router'
import Hooks from './composables/hooks.js'
import { buyer, getCreateByList, purchaseUser } from './composables/api.js'
import { supplierGetTree } from '@/api/purchase/purchase.js'
import { ElMessage } from 'element-plus'
export default {
  name: 'PaymentRequest',
  components: {
    AffixTab,
    Draft,
    Applying,
    Failing,
    Paid,
    ErpPage
  },
  setup() {
    const stateList = ['Draft', 'Applying', 'Failing', 'Paid']
    const route = useRoute()
    const state = reactive({
      ifShow: true,
      combineType: route.params.combineType || 0,
      count0: 0,
      count1: 0,
      count2: 0,
      count3: 0,
      cascaderRef: null,
      currentComponent: 'Draft',
      defaultProps: {
        value: 'id',
        label: 'name',
        children: 'childs',
        expandTrigger: 'hover',
        multiple: true
      },
      supplierOptions: [],
      selectCount: 0,
      timeSelect: 0,
      formInline: {
        status: 0,
        timeType: 1,
        type: 1,
        start_end: [],
        userIds: null,//采购员
        keyword: '',
        start: '',
        end: '',
        partnerType: '',
        supplierId: '',
        sortName: 'ppa.create_time',
        sortType: 'asc',
        settlement: '',
        settlementEnum: null,
        settlementValue: '',
        supplierIdList: [],
        supplierModel: [],
        page: {
          pageNo: 1,
          pageSize: 10
        },
        createByIds: null//创建人
      },
      dataList: [],
      userList: [],
      userRef: null,
      total: 0,
      createByList: [],
      scroll: 0
    })
    //创建人
    function queryCreatBy() {
      purchaseUser({ type: 1, status: state.combineType }).then(res => {
        state.createByList = res.data == 'dubbo has not return value!' ? [] : res.data
      })
    }
    supplierGetTree().then(res => {
      state.supplierOptions = res.data
    })
    let hooks = Hooks(state)

    function tabSelectEvent(num) {
      combineType(num)
      state.formInline.sortName = 'ppa.create_time'
      state.formInline.sortType = 'asc'
      buyerInfo()
      queryCreatBy()
      resetForm()
    }
    function combineType(num) {
      state.combineType = num
      state.formInline.status = num
      state.currentComponent = stateList[num]
      if (num > 1) {
        state.selectCount = null
      } else {
        state.selectCount = 0
      }
    }
    // 选择供应商
    function changeSupplier(value) {
      state.formInline.supplierIdList = state.cascaderRef.getCheckedNodes().map(v => v.value)
    }
    //结算方式
    function settlementChange(val) {
      if (typeof val == 'number') {
        state.formInline.settlementEnum = val
      } else {
        state.formInline.settlementEnum = val.split(',')[0]
        state.formInline.settlementValue = val.split(',')[1]
      }
    }
    function submitForm() {
      state.formInline.page.pageNo = 1
      state.formInline.page.pageSize = 10
      state.formInline.createBy = state.formInline.createBy
        ? state.formInline.createBy - 0
        : ''
      state.selectCount = 0
      hooks.init(state.formInline)
    }
    function resetForm() {
      state.formInline.start_end = []
      state.formInline.userIds = []
      state.formInline.keyword = ''
      state.formInline.start = ''
      state.formInline.end = ''
      state.formInline.type = 1
      state.formInline.createByIds = []
      state.formInline.timeType = 1
      state.formInline.supplierModel = []
      state.formInline.settlement = ''
      state.formInline.page.pageNo = 1
      state.formInline.page.pageSize = 10
      hooks.init(state.formInline)
    }

    function multipleSelection(params) {
      state.selectCount = params.length
    }
    let router = useRouter()
    // 进入详情
    let openDetail = params => {
      let name = 'PaymentRequestDeatil'
      if (params.settlementType == 2) name = 'PaymentDeatils'
      router.push({
        name,
        query: {
          ...params,
          combineType: state.combineType,
          form: JSON.stringify(state.formInline)
        }
      })
    }
    function updateData(v) {
      state.formInline.page = v
      hooks.init(state.formInline)
    }
    function ok(value) {
      state.formInline.userIds = value
    }
    //采购员
    function buyerInfo() {
      purchaseUser({ type: 0, status: state.combineType }).then(res => {
        if (res.code == 200) {
          state.userList = res.data
					console.log(state.userList)
        } else {
          ElMessage.error(res.message)
        }
      })
    }
    function listRefresh(params) {
      if (params) {
        state.formInline.sortName = params.sortName
        state.formInline.sortType = params.sortType
      }
      hooks.init(state.formInline)
    }
    onMounted(() => {
      if (route.params.form) {
        state.formInline = JSON.parse(route.params.form)
        combineType(Number(route.params.combineType))
      }
      hooks.init(state.formInline)
      buyerInfo()
      queryCreatBy()
    })
    const timeList = computed(() => {
      switch (Number(state.combineType)) {
        case 0:
          return [
            {
              label: '创建时间',
              value: 1
            }
          ]
        case 1:
          return [
            {
              label: '创建时间',
              value: 1
            },
            {
              label: '申请时间',
              value: 2
            }
          ]
        case 2:
          return [
            {
              label: '创建时间',
              value: 1
            },
            {
              label: '申请时间',
              value: 2
            }
          ]
        case 3:
          return [
            {
              label: '创建时间',
              value: 1
            },
            {
              label: '申请时间',
              value: 2
            },
            {
              label: '付款时间',
              value: 3
            }
          ]
      }
    })
    onActivated(() => {
      if (route.params.type == 1) {
        hooks.init(state.formInline)
      }
    })
    return {
      ...toRefs(state),
      tabSelectEvent,
      submitForm,
      resetForm,
      multipleSelection,
      openDetail,
      updateData,
      ok,
      listRefresh,
      timeList,
      supplierPayTypeOptions,
      changeSupplier,
      settlementChange
    }
  }
}
</script>

<style lang="scss" scoped>
.tab_left_box {
  margin: 0 16px;
  height: 80px;
  border: 1px solid #dcdfe6;
  color: #606266;
  border-radius: 3px;
  padding: 7px 15px;
  .title {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #606266;
    margin-top: 7px;
    text-align: center;
  }
  .btn {
    margin-top: 7px;
    height: 14px;
    :deep(.el-button) {
      border: none;
      display: inline-block;
      min-height: 24px;
      padding: 0;
    }
    :deep(.el-button--text) {
      color: #606266;
    }
  }
}
.active-num {
  color: #fff;
  font-size: 12px;
}
.noactive-num {
  font-size: 12px;
  color: red;
}
.btn {
  height: 80px;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  .num {
    height: 12px;
    margin-top: 10px;
  }
}
.form {
  padding: 24px 30px 0 30px;
  background: #fff;
  margin: 15px 0;
  display: flex;
  justify-content: space-between;
  ::v-deep(.el-cascader__search-input) {
    opacity: 0;
  }
}
:deep(.daterange) {
  .el-range-separator {
    box-sizing: content-box;
  }
}
.unSelectActive {
  color: #909399;
}
.middle {
  display: flex;
  margin-bottom: 16px;
}

.timeSelect {
  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
  }
}
</style>
