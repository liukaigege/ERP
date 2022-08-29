<template>
  <el-dialog title="导出订单" v-model="show" width="680px" @close="close" :close-on-click-modal="false">
    <div class="contentView">
      <el-tabs v-model="form.type" @tab-click="handleClick">
        <el-tab-pane label="当前数据导出" name="1">
          <el-radio v-model="form.subType" :label="1">当前查询数据</el-radio>
          <el-radio v-model="form.subType" :label="2">当前勾选数据</el-radio>
        </el-tab-pane>
        <el-tab-pane label="按天导出" name="2">
          <el-form :model="form" :rules="rules" ref="formRef1">
            <el-form-item label="选择日期:" prop="date">
              <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择日期" clearable></el-date-picker>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="自定义导出" name="3">
          <el-radio v-model="form.subTypes" :label="1">按采购单号导出</el-radio>
          <el-radio v-model="form.subTypes" :label="2">按平台订单号导出</el-radio>
          <el-form :model="form" :rules="rules" ref="formRef2">
            <!-- <el-form-item prop="purchaseNum" v-if="form.subType == 1" style="margin-top: 10px;">
							<el-input type="textarea" placeholder="请输入采购订单号" v-model="form.purchaseNum" show-word-limit clearable />
						</el-form-item> -->
            <el-form-item prop="purchaseNum" style="margin-top: 10px;">
              <el-input type="textarea" :placeholder="form.subTypes==1?'请输入采购单号':'请输入平台订单号'" v-model="form.purchaseNum" show-word-limit clearable />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 选择模版 -->
    <div style="padding:15px 0;">选择模板： <el-select v-model="checkSelect" clearable filterable @change="selectChange">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.field">
        </el-option>
      </el-select>
    </div>
    <div class="drag-box">
      <draggable class="list-group" tag="transition-group" :component-data="{tag: 'ul', type: 'transition-group', name: !drag ? 'flip-list' : null }" v-model="list" v-bind="dragOptions" @start="drag = true" @end="drag = false" :item-key="itemKey" group="namec">
        <template #item="{ element }">
          <li class="list-group-item" style="width:100%">
            <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed = !element.fixed" aria-hidden="true"></i>
            <!-- 子集 -->
            <el-row class="row">
              <el-col :span="3" class="col-3">
                <span class="font-w">{{ element.nameCn }}</span>
                <el-checkbox v-model="element.checked" label="全选" :indeterminate="element.indeterminate" @change="checkChange($event,element)"></el-checkbox>
              </el-col>
              <el-col :span="21" class="col-21">
                <draggable class="list-group" tag="transition-group" :component-data="{tag: 'ul', type: 'transition-group',name: !drag ? 'flip-list' : null}" v-model="element.list" v-bind="dragOptions" @start="drag = true" @end="drag = false" :item-key="itemKey" group="nameCn">
                  <template #item="{ element: item }">
          <li class="list-group-item">
            <i :class="item.fixed ? 'fa fa-anchor': 'glyphicon glyphicon-pushpin'" @click="item.fixed = !item.fixed" aria-hidden="true"></i>
            <el-checkbox v-model="item.checked" :class="item.nameEn=='mainImg'?'redColor':''" :label="item.nameCn" :key="item.valueEn" @change="checkChange($event,item)"> </el-checkbox>
          </li>
        </template>
      </draggable>
      </el-col>
      </el-row>
      </li>
</template>
</draggable>
</div>
<template #footer>
  <el-button @click="close">取消</el-button>
  <el-button type="primary" @click="exportHandle">导出</el-button>
</template>
<progressDialog :progress="percent" :progressDesc="description" @closeEvent="progressClose" v-if="progressShow" />
</el-dialog>
</template>

<script>
import { inject, onMounted, reactive, toRefs, computed, ref } from 'vue'
import { getItems } from '@/views/BI/bulletinBoard/logistics/api/api.js'
import { getuuid, deepCopy } from '@/utils/tool.js'
import {
  queryExpotInfos, //P15:查询导出模板
  queryExportItems,//P18:获取导出选项列表
  submitExportList,//P04:采购对账导出
  warehousesExport,//待入库导出
} from '../api/api'
import draggable from 'vuedraggable'
import progressDialog from './progress'
import { progressInfo } from '@/api/basic.js'
import { purchaseProgress } from '@/api/purchase/purchase.js'

import { ElMessage } from 'element-plus'
export default {
  components: { draggable, progressDialog },
  props: {
    selectList: {
      type: Array,
      default: []
    },
    formData: {},
    status: {
      type: Number
    }
  },
  setup(props, context) {

    const formRef1 = ref(null)
    const formRef2 = ref(null)
    const state = reactive({
      checkSelect: [],
      options: [],
      show: true,
      list: [],
      drag: false,
      form: {
        type: '1',
        subType: 1,
        subTypes: 1,//tab值为3的时候
        purchaseNum: null,//备注内容
        date: '',
      },
      percent: 0,
      uuid: null,
      progressShow: false,
      description: '正在处理'
    })
    const rules = {
      date: [{ required: true, message: '请选择日期', trigger: 'change' }],
      purchaseNum: [{ required: true, message: state.form.subTypes == 1 ? '请输入采购单号' : '请输入平台订单号', trigger: 'blur' }],
      purchaseOrderNum: [{ required: true, message: '请输入平台订单号', trigger: 'blur' }]
    }
    onMounted(() => {
      console.log(props.status, '状态')
      queryExpotInfos({ type: 6 }).then(res => {//模版
        state.options = res.data
      })
      queryExportItems({ type: 6, remarkType: props.status == 0 ? 5 : 4 }).then(res => {//选项
        state.list = res.data.purchaseVerifyItem
      })
    })
    const closeDialog = inject('closeDialog')

    function close() {
      state.show = false
      setTimeout(() => {
        closeDialog('dialogExport')
      }, 500)
    }
    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    })

    function itemKey(e) {
      return e
    }

    function checkChange(e, val) {
      if (val.list) {
        val.indeterminate = false
        val.list.map(item => item.checked = e)
      } else {
        let list = state.list.find(item => item.list.find(v => v.nameEn == val.nameEn))
        let filterList = list.list.filter(item => item.checked)
        list.checked = list.list.length == filterList.length
        list.indeterminate = !list.checked && filterList.length > 0
      }
    }
    // const exportDetail = inject('exportDetail')
    function exportHandle() {
      let bole = true
      if (state.form.type == 1 && state.form.subType == 2 && props.selectList.length == 0) {
        ElMessage.error('请勾选列表数据')
        return false
      }
      if (state.form.type == 2) {
        formRef1.value.validate((valid) => {
          if (!valid) bole = false
        })
      }
      if (state.form.type == 3) {
        formRef2.value.validate((valid) => {
          if (!valid) bole = false
        })
      }
      if (!bole) {
        ElMessage.error('信息填写错误，提交失败')
        return false
      }
      // state.uuid = getuuid()
      let fieldArray = []
      let remarkArray = []
      state.list.forEach(v => {
        if (v.nameEn == 'remarkInfo') {
          v.list.forEach(item => {
            if (item.checked) {
              remarkArray.push(item.nameEn)
            }
          })
        } else {
          v.list.forEach(item => {
            if (item.checked) {
              fieldArray.push(item.nameEn)
            }
          })
        }
      })
      let obj = {
        type: state.form.type - 0,
        //  uuid:state.uuid,
        subType: state.form.type == 1 ? state.form.subType : state.form.subTypes,
        remarkArray,
        fieldArray,
        query: deepCopy(props.formData)
      }
      //value值
      if (state.form.type == 1 && state.form.subType == 2) {
        obj.value = props.selectList.map(item => item.id).join(',')
      } else if (state.form.type == 2) {
        obj.value = state.form.date
      } else {
        obj.value = state.form.purchaseNum
      }
      if (fieldArray.length == 0 && remarkArray.length == 0) {
        return ElMessage.warning('请勾选导出内容')
      }
      if (props.status === 0) {//待入库导出
        warehousesExport(obj).then(res => {
          downDetail(res.data)
        })
      } else {
        submitExportList(obj).then(res => {
          downDetail(res.data)
        })
      }
    }
    function handleClick(val) {
      //切换清空
      state.form.subType = 1
      state.form.date = ''
      state.form.purchaseNum = null
    }
    //选择模版
    function selectChange(e) {
      let data = []
      state.list.forEach(item => {
        data = data.concat(item.list)
      })
      if (!e) {
        data.map(item => item.checked = false)
        state.list.forEach(item => {
          item.checked = false
          item.indeterminate = false
        })
        return
      }
      let model = []
      const outterList = []
      e.split('|').forEach(item => {
        let s = item.split(':')
        model = model.concat(s[1].split(','))
        outterList.push(s[0])
      })
      data.forEach(item => {
        item.checked = false
        item.indeterminate = false
      })
      data.forEach(item => {
        if (model.includes(item.nameEn)) {
          item.checked = true
        }
      })
      //
      let allList = []
      if (outterList.length) {
        const outterCheckList = []
        const outterUnCheckList = []
        outterList.forEach(v => {
          state.list.forEach(val => {
            if (val.nameEn == v) {
              let checkedList = []
              const unCheckList = val.list.filter(it => !it.checked)
              model.forEach(it => {
                if (val.list.some(value => value.nameEn == it)) {
                  checkedList = [...checkedList, ...val.list.filter(value => value.nameEn == it)]
                }
              })
              val.list = [...checkedList, ...unCheckList]
              outterCheckList.push(val)
              val.checked = checkedList.length == val.list.length
              val.indeterminate = !val.checked && Boolean(checkedList.length)
            }
          })
        })
        state.list.forEach(v => {
          if (outterList.every(val => val != v.nameEn)) {
            v.checked = v.indeterminate = false
            outterUnCheckList.push(v)
          }
        })
        allList = [...outterCheckList, ...outterUnCheckList]
        state.list = allList
      }
      // state.list.forEach(item => {
      // 	if(outterList.some(it => it == item.nameEn)){
      // 		const checkList = item.list.filter(val => val.checked)
      // 		let checkedList = []
      // 		model.forEach(val=>{
      // 			if(item.list.some(v=>v.nameEn == val)){
      // 				checkedList= [...checkedList ,...item.list.filter(v=>v.nameEn == val)]
      // 			}
      // 		})
      // 		const unCheckList = item.list.filter(val => !val.checked)
      // 		let checkLen = checkList.length
      // 		let listLen = item.list.length
      // 		item.checked = checkLen == listLen
      // 		item.indeterminate = !item.checked && Boolean(checkLen)
      // 		item.list = [...checkedList,...unCheckList]
      // 	}else{
      // 		allList.push(item)
      // 	}
      // })
    }
    let time = null
    function downDetail(key) {
      state.progressShow = true
      time = setInterval(() => {
        purchaseProgress({ key }).then(res => {
          state.percent = res.data.percent
          state.description = res.data.description
          if (res.data.percent == 100 || res.data.url) {
            setTimeout(() => {
              window.open(res.data.url, '_self')
              close()
            }, 700)
          } else if (typeof res.data.percent != 'number' || res.data.errorCode == 404) {
            ElMessage.error('进度获取失败')
            close()
          }
        }).catch(err => {
          close()
        })
      }, 800)
    }

    function progressClose() {
      state.progressShow = false
      state.percent = 0
      state.description = '正在处理'
      clearInterval(time)
    }
    return {
      close,
      ...toRefs(state),
      dragOptions,
      rules,
      formRef1,
      formRef2,
      itemKey,
      checkChange,
      exportHandle,
      handleClick,
      selectChange,
      progressClose
    }
  }
}
</script>

<style lang="scss" scoped>
.contentView {
  margin-bottom: 10px;
}
.list-group {
  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 25%;
    }
  }
}

.row {
  border: 1px solid rgb(232, 234, 236);

  .el-col-3 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-right: 1px solid rgb(232, 234, 236);
    background-color: #fafafa;
  }
}

li + li {
  .row {
    border-top: unset;
  }
}

.col-21 {
  padding: 0 10px;
}

.drag-box {
  max-height: 500px;
  overflow: hidden;
  overflow-y: auto;
}
.redColor {
  color: red;
}
</style>
