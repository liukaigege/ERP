<template>
<div class="salesVolume" v-if="showHandler()">
  <div class="erp-nav">
    <div class="head">

      <div class="tabs-box">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-if="authPath('add_GMV:btn')" label="GMV" name="1"></el-tab-pane>
          <el-tab-pane v-if="authPath('add_CustomerPrice:btn')" label="客单价" name="2"></el-tab-pane>
          <el-tab-pane v-if="authPath('add_OrderQuantity:btn')" label="订单量" name="3"></el-tab-pane>
          <el-tab-pane v-if="authPath('add_JointIndex:btn')" label="连带指标" name="4"></el-tab-pane>
          <el-tab-pane v-if="authPath('add_SKUIndex:btn')" label="动销SKU分布指标" name="5"></el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
  <div class="content">
    <el-card shadow="never">
      <template #header>
        <span class="fontClass">数据看板</span>
      </template>
      <div class="search">
        <el-form :model="form[activeName]" ref="formRef" :inline="true" >
          <el-form-item label="部门:"  prop="deptId">
            <elSelectTree :data="deptList" ref="selectTree" :treeProps="treeProps"  :width="200" filterable :checkStrictly="true" @ok="check($event,1)" :defaultCheckedKeys="form[activeName].deptId?[form[activeName].deptId]:[]" />
          </el-form-item>
          <el-form-item label="时间:" prop="year">
            <el-select v-model="form[activeName].year" style="width:90px" placeholder="年份">
              <el-option v-for="item in dateSelect" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="季度:" prop="quarter">
            <el-select v-model="form[activeName].quarter" placeholder="季度" style="width:80px">
              <el-option v-for="item in quarterSelect" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  label="品类:" prop="categoryIds" v-show="activeName == 1">
            <el-cascader  ref="cascaderRef" :options="categoryList" collapse-tags :props="cascaderProps" clearable @change="categoryChange($event,1)" />
          </el-form-item>
          <el-form-item label="" >
            <el-button type="primary"  @click="search">查询</el-button>
            <el-button  @click="reset(1)">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 卡片 -->
      <!-- 卡片 -->
      <div class="box-card">
        <gbmvCard v-if="activeName == 1" :data="cardData['1']" />
        <guestCard v-if="activeName == 2" :data="cardData['2']" />
        <ordersCard v-if="activeName == 3" :data="cardData['3']" />
        <severalCard v-if="activeName == 4" :data="cardData['4']" />
        <skuSeveraCard v-if="activeName == 5" :data="cardData['5']" />
      </div>
      <!-- 卡片 -->
      <!-- 卡片 -->
    </el-card>
    <el-card shadow="never" class="card">
      <template #header>
        <span class="fontClass">明细下载</span>
      </template>
      <el-form :model="formExport" :inline="true"  ref="downForm">
        <el-form-item label="部门:">
          <elSelectTree ref="downTree" :data="deptList" :treeProps="treeProps"  :width="200" filterable :checkStrictly="true" @ok="check($event,2)" />
        </el-form-item>
        <el-form-item label="时间:">
          <el-date-picker v-model="downDate" type="daterange" value-format="YYYY-MM-DD" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" unlink-panels @change="dateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item  label="品类:" prop="categoryIds" v-show="activeName == 1">
          <el-cascader  :options="categoryList" collapse-tags :props="cascaderProps" ref="downCascader" clearable @change="categoryChange($event,2)" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportDetil">明细下载</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <progressDialog v-if="progressShow" :progress="percent" :progressDesc="percentDesc" @closeEvent="closeEvent" />
</div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, reactive, toRefs, computed, ref, nextTick } from 'vue'
import { rulecClassify } from "@/api/goods/rules.js";
import gbmvCard from "./components/gmvCard.vue";
import guestCard from "./components/guestCard.vue";
import ordersCard from "./components/ordersCard.vue";
import severalCard from "./components/severalCard.vue";
import skuSeveraCard from "./components/skuSeveraCard.vue";
import { getDepartmentList } from '@/api/user.js'
import elSelectTree from "@/components/elSelectTree/index.vue";
import { gmvStatistics, movingPinStatistics, gmvDetail, progress, passengerDetail, movingPinDetail, jointDetail } from './api/api.js'
import { getuuid } from '@/utils/tool.js'
import { ElMessage } from 'element-plus';
import progressDialog from '../components/progress.vue'
import { storage } from '@/utils/storage.js'
export default {
  components: { gbmvCard, elSelectTree, severalCard, guestCard, ordersCard, skuSeveraCard, progressDialog },
  setup() {
    const state = reactive({
      activeName: '1',
      date: '',
      form: {
        1: {
          year: new Date().getFullYear(), // 年份
          quarter: Math.ceil((new Date().getMonth() + 1) / 3), // 季度
          categoryIds: [], // 品类集合
          deptId: ''
        },
        2: {
          year: new Date().getFullYear(), // 年份
          quarter: Math.ceil((new Date().getMonth() + 1) / 3), // 季度
          categoryIds: [], // 品类集合
          deptId: ''
        },
        3: {
          year: new Date().getFullYear(), // 年份
          quarter: Math.ceil((new Date().getMonth() + 1) / 3), // 季度
          categoryIds: [], // 品类集合
          deptId: ''
        },
        4: {
          year: new Date().getFullYear(), // 年份
          quarter: Math.ceil((new Date().getMonth() + 1) / 3), // 季度
          categoryIds: [], // 品类集合
          deptId: ''
        },
        5: {
          year: new Date().getFullYear(), // 年份
          quarter: Math.ceil((new Date().getMonth() + 1) / 3), // 季度
          categoryIds: [], // 品类集合
          deptId: ''
        }
      },
      formExport: {
        deptId: '',
        startTime: '',
        endTime: '',
        categoryIds: [],
        uuid: '',
      },
      categoryList: [],
      deptList: [],
      cardData: { 1: [], 2: [], 3: [], 4: [], 5: [] },
      downDate: '',
      percent: 0, // 进度条
      progressShow: false,
      time: null, // 定时器
      percentDesc: undefined
    })
    let formRef = ref(null)
    let cascaderRef = ref(null)
    let selectTree = ref(null)
    let store = useStore()
    let sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    let downTree = ref(null) // 明细中部门的ref
    let downForm = ref(null)
    let downCascader = ref(null)

    let dateSelect = []
    let quarterSelect = [
      { label: 'Q1', value: 1 },
      { label: 'Q2', value: 2 },
      { label: 'Q3', value: 3 },
      { label: 'Q4', value: 4 }
    ]
    let treeProps = {
      value: 'deptId', // ID字段名
      label: 'deptName', // 显示名称
      children: 'children',
    }

    let cascaderProps = { emitPath: false, multiple: true, label: 'name', value: 'id', children: 'child' }

    function creatDateSelect() {
      let creatTime = 2021
      let time = new Date().getFullYear()
      for (let date = creatTime; date < time + 2; date++) {
        dateSelect.push({
          label: '' + date,
          value: date
        })
      }
    }
    creatDateSelect()

    onMounted(() => {
      if (!showHandler()) return
      rulecClassify().then(res => {
        state.categoryList = res.data
      })
      getDepartmentList().then(res => {
        state.deptList = res.data
      })
      setTabsActive()
      nextTick(() => {
        search()
      })
    })

    function dateChange(e) {
      state.formExport.startTime = ''
      state.formExport.endTime = ''
      if (!e) return
      state.formExport.startTime = e[0] + ' 00:00:00'
      state.formExport.endTime = e[1] + ' 23:59:59'
    }

    function categoryChange(e, num) {
      let arr = []
      if (num == 1) {
        arr = cascaderRef.value.getCheckedNodes().map(item => item.data.id)
      } else {
        arr = downCascader.value.getCheckedNodes().map(item => item.data.id)
      }
      num == 1 ? state.form[state.activeName].categoryIds = arr : state.formExport.categoryIds = arr
    }

    function check(e, num) {
      num == 1 ? state.form[state.activeName].deptId = e : state.formExport.deptId = e
    }

    function handleClick(e) {
      if (!state.cardData[state.activeName].length) search()
    }

    function reset(e) { // 重置提交信息
      formRef.value.resetFields()
      cascaderRef.value.handleClear()
      selectTree.value.clearHandle()
      if (e) search()
    }

    function search() {
      if (state.activeName < 5) {
        gmvStatistics(state.form[state.activeName]).then(res => {
          let arr = []
          for (let index = state.form[state.activeName].quarter * 3 - 2; index <= state.form[state.activeName].quarter * 3; index++) { // 生成顺序时间数组
            arr.push(res.data.find(item => item.months == index) || {
              gmvTotalPrice: 0,
              jointNum: 0,
              jointRate: 0,
              months: index,
              totalNum: 0,
              unitPrice: 0
            })
          }
          arr.forEach(item => {
            item.newGmvTotalPrice = (item.gmvTotalPrice / 10000).toFixed(2)
          })
          state.cardData[state.activeName] = arr
          console.log(arr);
        }).catch(err => {
          let arr = []
          for (let index = state.form[state.activeName].quarter * 3 - 2; index <= state.form[state.activeName].quarter * 3; index++) { // 生成顺序时间数组
            arr.push({
              gmvTotalPrice: '--',
              jointNum: '--',
              jointRate: '--',
              months: index,
              totalNum: '--',
              unitPrice: '--'
            })
          }
          arr.forEach(item => {
            item.gmvTotalPrice = (item.gmvTotalPrice / 10000).toFixed(2)
          })
          state.cardData[state.activeName] = arr
        })
        console.log(state.cardData);
      } else {
        movingPinStatistics(state.form[state.activeName]).then(res => {
          let arr = []
          for (let index = state.form[state.activeName].quarter * 3 - 2; index <= state.form[state.activeName].quarter * 3; index++) { // 生成顺序时间数组
            arr.push(res.data.find(item => item.months == index) || {
              explosiveNum: 0,
              explosiveRate: 0,
              launchNum: 0,
              months: index,
              movingPinNum: 0,
              movingPinRate: 0,
              notMovingPinNum: 0,
              successNum: 0,
              successRate: 0
            })
          }
          state.cardData[state.activeName] = arr
        }).catch(err => {
          let arr = []
          for (let index = state.form[state.activeName].quarter * 3 - 2; index <= state.form[state.activeName].quarter * 3; index++) { // 生成顺序时间数组
            arr.push({
              explosiveNum: '--',
              explosiveRate: '--',
              launchNum: '--',
              months: index,
              movingPinNum: '--',
              movingPinRate: '--',
              notMovingPinNum: '--',
              successNum: '--',
              successRate: '--'
            })
          }
          state.cardData[state.activeName] = arr
        })
      }
    }

    function exportDetil() {
      switch (state.activeName) {
        case '1':
          downDetail(gmvDetail)
          break;
        case '2':
          downDetail(passengerDetail)
          break;
        case '3':
          downDetail(passengerDetail)
          break;
        case '4':
          downDetail(jointDetail)
          break;
        case '5':
          downDetail(movingPinDetail)
          break;
      }
    }

    function downDetail(api) {
      state.formExport.uuid = getuuid()
      if (!state.formExport.startTime) return ElMessage.error('请选择日期')
      api(state.formExport).then(res => {
        state.progressShow = true
        state.time = setInterval(() => {
          progress({ uuid: state.formExport.uuid }).then(res => {
            state.percent = res.data.percent
            state.percentDesc = res.data.description
            if (res.data.percent == 100 || res.data.url) {
              setTimeout(() => {
                clearInterval(state.time)
                state.percent = 0
                state.percentDesc = undefined
                window.open(res.data.url, '_self')
              }, 700)
            } else if (!res.data.percent) {
              ElMessage.error('进度获取失败')
              closeEvent()
            }
          }).catch(err => {
            closeEvent()
          })
        }, 800);
      })

    }

    function closeEvent() {
      clearInterval(state.time)
      state.percent = 0
      state.percentDesc = undefined
      state.progressShow = false
    }
    let authPath = storage.get('ERP_AUTHPATH')
    let arr = [
      'add_GMV:btn',
      'add_CustomerPrice:btn',
      'add_OrderQuantity:btn',
      'add_JointIndex:btn',
      'add_SKUIndex:btn'
    ]

    function setTabsActive() {
      for (let i = 1; i < arr.length + 20; i++) {
        if (authPath[arr[i - 1]]) {
          state.activeName = i + ''
          break
        }
      }

    }

    function showHandler() {
      return authPath[arr[0]] || authPath[arr[1]] || authPath[arr[2]] || authPath[arr[3]] || authPath[arr[4]]
    }
		
    return {
      ...toRefs(state),
      handleClick,
      sideBarWidth,
      dateSelect,
      dateChange,
      quarterSelect,
      categoryChange,
      check,
      treeProps,
      formRef,
      reset,
      cascaderRef,
      selectTree,
      search,
      cascaderProps,
      exportDetil,
      downTree,
      downForm,
      downCascader,
      closeEvent,
      showHandler
    }
  }
}
</script>

<style lang="scss" scoped>
.erp-empty-box {
  margin-top: -23px;
  height: 75px;
}

.erp-nav {
  position: fixed;
  left: v-bind(sideBarWidth);
  right: 0;
  top: 111px;
  transition: left 1s;
  border-top: 1px solid #e8e8e8;
  z-index: 15;

  .head {
    background: #fff;
  }

  .nav-title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    flex-grow: 1;
  }
}

::v-deep(.el-tabs__item) {
  padding: 0 24px !important;
  height: 52px;
  line-height: 52px;
}

::v-deep(.el-card) {
  border: none;
}

.emtpy-box {
  height: 80px;
}

.card {
  margin-top: 30px;

  :deep(.el-card__body) {
    padding-bottom: 0;
  }
}

.box-card {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  margin-bottom: 16px;
}

::v-deep(.el-form-item) {
  margin-right: 16px;
}

.tabs-box {
  ::v-deep(.el-tabs__header) {
    margin: 0;
  }
}

.salesVolume {
  padding-top: 56px;

  .fontClass {
    font-size: 16px;
  }
}
</style>
