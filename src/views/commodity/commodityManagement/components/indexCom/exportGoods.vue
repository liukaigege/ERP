<template>
<el-dialog title="导出商品" v-model="show" width="800px" @close="close" :close-on-click-modal="false">
  <div>
    <el-radio v-model="radioValue" label="1">按当前勾选导出</el-radio>
    <el-radio v-model="radioValue" label="2">按当前查询导出</el-radio>
  </div>
  <div style="padding:10px 0;">选择模板： <el-select v-model="checkSelect" clearable filterable  @change="selectChange">
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
          <el-checkbox v-model="item.checked" :label="item.nameCn" :key="item.valueEn"  @change="checkChange($event,item)"> </el-checkbox>
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
    <el-button @click="close" >取消</el-button>
    <el-button type="primary"  @click="exportHandle">导出</el-button>
  </template>
  <progressDialog :progress="percent" :progressDesc="description" @closeEvent="progressClose" v-if="progressShow"/>
</el-dialog>
</template>

<script>
import { exportList, exportText } from '@/api/commodity.js'
import {
  checkExportTemplate,
  exportItemsList
} from '@/api/order/exportOrder.js'
import { onMounted, reactive, toRefs, computed } from 'vue'
import draggable from 'vuedraggable'
import { ElMessage } from 'element-plus'
import { getuuid } from '@/utils/tool.js'
import progressDialog from './progress.vue'
import {progressInfo} from '@/api/basic.js'
export default {
  emits: ['closeEvent'],
  components: { draggable, progressDialog},
  props: {
    skuIds: {
      type: Array,
      default: []
    },
    goodsIdList: {},
    formData: {}
  },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      list: [],
      drag: false,
      checkSelect: [],
      options: [],
      radioValue: '1',
      percent:0,
      uuid:null,
      progressShow:false,
      description:'正在处理'
    })

    onMounted(() => {
      exportItemsList({ type: 3 }).then(res => {
        state.list = res.data.goodsManage
      })
      checkExportTemplate({
        type: 3,
      }).then(res => {
        state.options = res.data
      })
    })

    function close() {
      state.show = false
      clearInterval(time)
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
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

    function exportHandle() {
     state.uuid = getuuid()
      let arr = []
      state.list.forEach(item => {
        item.list.forEach(val => {
          if (val.checked) arr.push(val.nameEn)
        })
      })
      if(state.radioValue == 1 && !props.goodsIdList.length) return ElMessage.error('请选择商品')
      if (!arr.length) return ElMessage.error('请选择导出字段')
      let data = {
        exportFieldList: arr,
        skuIdList: props.skuIds.map(item => item.skuId),
        warehouseId: 1,
        goodsIdList: props.goodsIdList,
        exportType:state.radioValue,
        uuid:state.uuid
      }
      if (state.radioValue == 2) {
        data = Object.assign(data, props.formData)
      }
      exportText(data).then(res => {
       downDetail()
      })
    }

    function selectChange(e) {
      let data = []
      state.list.forEach(item => {
        data = data.concat(item.list)
      })
      console.log(e);
      if(!e){
        data.map(item=>item.checked = false)
        state.list.forEach(item=>{
          item.checked = false
          item.indeterminate = false
          console.log(item);
        })
        return 
      }
      let model = []
      e.split('|').forEach(item => {
        let s = item.split(':')
        model = model.concat(s[1].split(','))
      })
      data.forEach(item => {
        item.checked = false
      })
      data.forEach(item => {
        if (model.includes(item.nameEn)) {
          item.checked = true
        }
      })
      state.list.forEach(item=>{
        let checkLen = item.list.filter(val=>val.checked).length
        let listLen = item.list.length
        item.checked = checkLen == listLen
        item.indeterminate = !item.checked&& Boolean(checkLen)
      })
    }
    
    let time = null
    function downDetail() {
        state.progressShow = true
        time = setInterval(() => {
          progressInfo( state.uuid ).then(res => {
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
        }, 800);
    }
    
    function progressClose() {
      state.progressShow = false
      state.percent = 0
      state.description = '正在处理'
      clearInterval(time)
    }
    
    return {
      ...toRefs(state),
      close,
      itemKey,
      checkChange,
      exportHandle,
      dragOptions,
      selectChange,
      progressClose
    }
  }
}
</script>

<style lang="scss" scoped>
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
    background-color: #FAFAFA;
  }
}

li+li {
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
</style>
