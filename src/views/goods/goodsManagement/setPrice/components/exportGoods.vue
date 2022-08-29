<template>
<el-dialog title="导出商品" v-model="show" width="800px" @close="close" :close-on-click-modal="false" append-to-body>
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
          <el-checkbox v-model="item.checked" :label="item.nameCn" :key="item.nameEn"  @change="checkChange($event,item)"> </el-checkbox>
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
</el-dialog>
<progressDialog :progress="progress" :progressDesc="progressDesc" @closeEvent="closeEvent" v-if="progressDialogShow" />
</template>

<script>
import { exportFields, exportSkuInfo } from '@/api/goods/quotedPrice.js'
import { progressInfo } from '@/api/basic.js'
import { onMounted, reactive, toRefs, computed } from 'vue'
import draggable from 'vuedraggable'
import { ElMessage } from 'element-plus'
import { getuuid } from '@/utils/tool.js'
import progressDialog from './progress.vue'
import {
  checkExportTemplate,
  exportItemsList
} from '@/api/order/exportOrder.js'
export default {
  emits: ['closeEvent'],
  props: {
    goodsIds: {},
    formData: {}
  },
  components: { draggable, progressDialog },
  setup(props, ctx) {
    const state = reactive({
      show: true,
      list: [],
      drag: false,
      progress: 0,
      progressDialogShow: false,
      time: null,
      progressDesc: undefined,
      checkSelect: [],
      options: [],
      radioValue: '1'
    })

    onMounted(() => {
      exportItemsList({ type: 2 }).then(res => {
        state.list = res.data.goods
      })
      checkExportTemplate({
        type: 2,
      }).then(res => {
        state.options = res.data
      })
    })

    function close() {
      state.show = false
      console.log(state.time);
      if (state.time) clearInterval(state.time)
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
      console.log(props.skuIds);
      let arr = []
      state.list.forEach(item => {
        item.list.forEach(val => {
          if (val.checked) arr.push(val.nameEn)
        })
      })
      if (!arr.length) return ElMessage.error('请选择导出字段')
      if(state.radioValue == 1&& !props.goodsIds.length)  return ElMessage.error('请勾选商品')
      state.uuid = getuuid()
      let data = {
        goodsIds: props.goodsIds,
        fieldArray: arr,
        uuid: state.uuid,
        exportType:1
      }
      if (state.radioValue == 2) data = Object.assign(data,props.formData,{exportType:2})
      exportSkuInfo(data).then(res => {
        state.progressDialogShow = true
        state.time = setInterval(() => {
          progressInfo(state.uuid).then(res => {
            state.progress = res.data.percent
            state.progressDesc = res.data.description
            if (res.data.percent == 100 || res.data.url) {
              setTimeout(() => {
                clearInterval(state.time)
                state.progressDesc = undefined
                window.open(res.data.url, '_self')
                close()
              }, 700)
            } else if (!res.data.percent) {
              ElMessage.error('进度获取失败！')
              closeEvent()
            }
          }).catch(err => {
            closeEvent()
          })
        }, 1000);
      })
    }

    function closeEvent() {
      clearInterval(state.time)
      state.progressDialogShow = false
      state.progress = 0
      state.progressDesc = undefined
    }

    function selectChange(e) {
      
      let data = []
      state.list.forEach(item => {
        data = data.concat(item.list)
      })
      if(!e){
         state.list.forEach(item=>{
          item.checked = false
          item.indeterminate = false
          console.log(item);
        })
         data.map(item=>item.checked = false)
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
      state.list.forEach(item => {
        let checkLen = item.list.filter(val => val.checked).length
        let listLen = item.list.length
        item.checked = checkLen == listLen
        item.indeterminate = !item.checked && Boolean(checkLen)
      })
    }
    return {
      ...toRefs(state),
      close,
      itemKey,
      checkChange,
      exportHandle,
      dragOptions,
      closeEvent,
      selectChange
    }
  }
}
</script>

<style lang="scss" scoped>
.drag-box {
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
</style>
