<template>
<div>

  <div class="head">
    <el-tabs v-model="active" tab-position="top" @tab-click="tabClick">
      <el-tab-pane label="进程跟踪" name="1">
      </el-tab-pane>
      <el-tab-pane label="异常环节总结" name="2">
      </el-tab-pane>
      <el-tab-pane label="签收率统计" name="3">
      </el-tab-pane>
    </el-tabs>
    <div class="tabs-item">
      <el-form :model="formData[active]" :inline="true" ref="formRef">
        <el-form-item label="发货时间:">
          <el-date-picker v-model="formData[active].date" type="daterange" range-separator="~" value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" unlink-panels @change="dateHandle">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="物流商:">
          <el-cascader ref="cascaderRef" style="width:300px" v-model="formData[active].logistics" :options="logsList" collapse-tags :props="{multiple:true,label:'name',children:'billWays'}" clearable />
        </el-form-item>
        <el-form-item label="物流状态" v-if="active == 1">
          <el-select v-model="formData[active].trackStatusList" multiple collapse-tags clearable filterable>
            <el-option v-for="item in logsStatusList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <div class="operation">
    <div>
      <el-button type="primary" @click="exportHandle">导出报表</el-button>
      <el-button type="primary" @click="exportItemShow = true" v-if="active == 1">导出异常</el-button>
    </div>

  </div>
  <div class="table-box">
    <tracks :tableData="tableData[1]" v-if="active == '1'" />
    <abnormalLink :tableData="tableData[2]" v-if="active == '2'" />
    <statistics :tableData="tableData[3]" v-if="active == '3'" />
    <progressDialog :progress="percent" :progressDesc="percentDesc" v-if="progressShow" @closeEvent="closeEvent" />
  </div>
  <exportReport v-if="exportReportShow" />
  <exportItem v-if="exportItemShow" />
</div>
</template>

<script>
import { onMounted, provide, reactive, ref, toRefs } from 'vue'
import tracks from "./components/track.vue";
import statistics from "./components/statistic.vue";
import abnormalLink from './components/abnormalLink.vue'
import {
  getBiAllLogistics,
  queryNotSignedTrackSummary,
  queryNodeStatusSummary,
  querySignInRateSummary,
  exprotNodeStatusSummary,
  exprotNotSignedTrackSummary,
  exprotSignInRateSummary,
  progress,
  getTrackStatus
} from './api/api.js'
import { channelWithManual } from '@/api/order/orderManagement.js'
import moment from 'moment';
import { ElMessage } from 'element-plus';
import progressDialog from '../components/progress.vue'
import { getuuid } from '@/utils/tool.js'
import exportReport from './components/exportReport.vue'
import exportItem from './components/exportItem.vue'
export default {
  components: { tracks, statistics, abnormalLink, progressDialog, exportReport, exportItem },
  setup() {
    const state = reactive({
      tableData: {
        1: [],
        2: [],
        3: []
      },
      formData: {
        1: {
          date: [moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
          logistics: [],
          startTime: moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'),
          endTime: moment().format('YYYY-MM-DD 23:59:59'),
          uuid: '',
          logisticsList: [],
          lgtcLineList: [],
          trackStatusList: '',
        },
        2: {
          date: [moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
          logistics: [],
          startTime: moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'),
          endTime: moment().format('YYYY-MM-DD 23:59:59'),
          uuid: '',
          logisticsList: [],
          lgtcLineList: [],
        },
        3: {
          date: [moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
          logistics: [],
          startTime: moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'),
          endTime: moment().format('YYYY-MM-DD 23:59:59'),
          uuid: '',
          logisticsList: [],
          lgtcLineList: [],
        }
      },
      active: '1',
      logsList: [],
      logsStatusList: [],
      percent: 0, // 进度条
      progressShow: false,
      time: null,
      percentDesc: undefined,
      exportReportShow: false,
      exportItemShow: false
    })

    let formRef = ref(null)

    onMounted(() => {
      channelWithManual().then(res => {
        state.logsList = res.data
        search()
      })
      getTrackStatus().then(res => {
        state.logsStatusList = res.data
      })
    })

    function dateHandle(e) {
      state.formData[state.active].date = ''
      state.formData[state.active].startTime = ''
      state.formData[state.active].endTime = ''
      if (!e) return
      state.formData[state.active].date = e
      state.formData[state.active].startTime = e[0] + ' 00:00:00'
      state.formData[state.active].endTime = e[1] + ' 23:59:59'
    }

    function tabClick() {
      if (!state.tableData[state.active].length) search()
    }

    function search() {
      if (!state.formData[state.active].startTime) return ElMessage.error('请选则查询日期！')
      switch (state.active) {
        case '1':
          getTableList(queryNotSignedTrackSummary)
          break;
        case '2':
          getTableList(queryNodeStatusSummary)
          break;
        case '3':
          getTableList(querySignInRateSummary)
          break;
      }
    }

    function getTableList(api) {
      let lgl = state.formData[state.active].logisticsList = []
      let lll = state.formData[state.active].lgtcLineList = []
      if (state.formData[state.active].logistics) {
        state.formData[state.active].logistics.forEach(item => {
          lgl.includes(item[0]) || lgl.push(item[0])
          item[1] && lll.push(item[1])
        })
      }

      api(state.formData[state.active]).then(res => {
        let arr = []
        res.data.forEach(item => {
          item.parent = true
          arr.push(item)
          if (item.subList) {
            arr.push(...item.subList)
          }
        })
        state.tableData[state.active] = arr
      })
    }

    function exportDetail(type, data) {
      if (!state.formData[state.active].startTime) return ElMessage.error('请选则导出日期！')
      switch (state.active) {
        case '1':
          getDetail(exprotNotSignedTrackSummary, Object.assign(state.formData[state.active], type))
          break;
        case '2':
          getDetail(exprotNodeStatusSummary, data)
          break;
        case '3':
          getDetail(exprotSignInRateSummary, data)
          break;
      }
    }

    function getDetail(api, data) {
      state.formData[state.active].uuid = getuuid()
      api(data).then(res => {
        state.progressShow = true
        state.time = setInterval(() => {
          progress({ uuid: state.formData[state.active].uuid }).then(res => {
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
    let cascaderRef = ref(null)

    function reset() {
      console.log(cascaderRef);
      state.formData[state.active] = {
        date: [moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')],
        logistics: "",
        startTime: moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        uuid: ''
      }
      search()
    }

    function closeEvent() {
      clearInterval(state.time)
      state.percentDesc = undefined
      state.progressShow = false
      state.exportReportShow = false
      state.exportItemShow = false
      state.percent = 0
    }

    provide('closeDialog', closeDialog)
    provide('exportDetail', exportDetail)

    function closeDialog(key) {
      state[key] = false
      console.log(state, key);
    }

    function exportHandle() {
      if (state.active == 1) {
        state.exportReportShow = true
      } else {
        let data = state.formData[state.active]
        let lgl = data.logisticsList = []
        let lll = data.lgtcLineList = []
        if (data.logistics) {
          data.logistics.forEach(item => {
            lgl.includes(item[0]) || lgl.push(item[0])
            item[1] && lll.push(item[1])
          })
        }

        exportDetail(null, data)
      }
    }
    return {
      ...toRefs(state),
      dateHandle,
      search,
      tabClick,
      exportDetail,
      formRef,
      reset,
      closeEvent,
      cascaderRef,
      exportHandle
    }
  }
}
</script>

<style lang="scss" scoped>
.table-box {
  padding: 24px;
  background-color: #fff;
}

.head {
  background-color: #fff;
  padding-bottom: 0;
}

.operation {
  padding: 16px 0;
  display: flex;
  justify-content: space-between;
}

.tabs-item {
  padding: 0 16px;
}

::v-deep(.el-tabs__item) {
  padding: 0 24px !important;
}

::v-deep(.el-form-item) {
  margin-right: 16px;
}
::v-deep(.lgtc-line-name){
  background-color: #f8f8f9;
}

::v-deep(.logistics-name){
  color:#000;
  font-weight: 700;
}
</style>
