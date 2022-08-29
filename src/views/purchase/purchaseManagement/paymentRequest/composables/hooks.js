import { list, statusCount } from '../composables/api.js'
import { ElMessage } from 'element-plus'
import { watch, nextTick } from 'vue'
import { ElLoading } from 'element-plus'
export default function (state, form) {
  function init(form) {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: '#ffffffe6',
    })
    list(form).then(res => {
      if (res.code == 200) {
        state.dataList = res.data.dataList
        statusCounts()
      } else {
        ElMessage.error(res.message)
      }
      loading.close()
      state.total = res.data.page.totalCount
    }).catch(err => {
      loading.close()
    })
  }
  function statusCounts() {
    statusCount().then(res => {
      if (res.code == 200) {
        const { count0, count1, count2, count3 } = res.data
        state.count0 = count0
        state.count1 = count1
        state.count2 = count2
        state.count3 = count3
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  function sort(sortName) {
    form.sortType = form.sortType === 'asc' ? 'desc' : 'asc'
    form.sortName = sortName
    init(form)
  }

  function generateClass(sortName) {
    if (sortName == form.sortName) {
      if (form.sortType === 'asc') {
        return 'el-icon-caret-top'
      } else {
        return 'el-icon-caret-bottom'
      }
    } else {
      return ''
    }
  }

  return {
    init,
    sort,
    generateClass
  }
}

