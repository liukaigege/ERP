<template>
<el-dialog title="导出店铺" v-model="show" width="50%" @close="close" :close-on-click-modal="false">
  <div style="margin-bottom:10px">
    <span :class="{blue:dimension ==0,btnCur:true}" @click="titleChange(0)">店铺维度</span>
    <span :class="{blue:dimension ==1,btnCur:true}" @click="titleChange(1)">支付维度</span>
  </div>
  <div>
    <el-radio v-model="exportMethod" label="0">当前查询店铺</el-radio>
    <el-radio v-model="exportMethod" label="1">当前勾选店铺</el-radio>
  </div>
  <draggable class="list-group" tag="transition-group" :component-data="{tag: 'ul', type: 'transition-group', name: !drag ? 'flip-list' : null }" v-model="filesList" v-bind="dragOptions" @start="drag = true" @end="drag = false" item-key="label">
    <template #item="{ element }">
      <li class="list-group-item" style="width:100%">
        <i :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'" @click="element.fixed = !element.fixed" aria-hidden="true"></i>
        <!-- 子集 -->
        <el-row class="row">
          <el-col :span="3">
            <span class="font-w">{{element.label}}</span>
            <el-checkbox :indeterminate="element.indeterminate" v-model="element.checkAll" :key="element.label" @change="handleCheckAllChange(element)">全选</el-checkbox>
          </el-col>
          <el-col :span="21">
            <draggable class="list-group" tag="transition-group" :component-data="{tag: 'ul', type: 'transition-group',name: !drag ? 'flip-list' : null}" v-model="element.list" v-bind="dragOptions" @start="drag = true" @end="drag = false" :item-key="itemKey" :group="element.label">
              <template #item="{ element: item }">
      <li class="list-group-item">
        <i :class="item.fixed ? 'fa fa-anchor': 'glyphicon glyphicon-pushpin'" @click="item.fixed = !item.fixed" aria-hidden="true"></i>
        <el-checkbox-group v-model="element.listAll" @change="handleCheckedCitiesChange($event, element)">
          <el-checkbox :label="item.value" :key="item.value" style="margin:3px">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </li>
    </template>
  </draggable>
  </el-col>
  </el-row>
  <!-- 子集 -->
  </li>
  </template>
  </draggable>
  <template #footer>
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="submit">确定</el-button>
  </template>
</el-dialog>
</template>

<script>
import { queryFields, exportShop } from '@/api/goods/shop.js'
import { onMounted, reactive, toRefs, computed, watchEffect } from 'vue'
import draggable from 'vuedraggable'
import { ElMessage } from 'element-plus'
export default {
  props: {
    idObj: {},
    formData: {}
  },
  components: { draggable },
  emits: ['close'],
  setup(props, context) {
    const state = reactive({
      filesList: [],
      show: false,
      drag: false,
      exportMethod: '0',
      idObj: [],
      dimension: 0
    })
    onMounted(() => {
      state.show = true
      queryFields({
        dimension: state.dimension
      }).then(res => {
        let arr = []
        for (let i in res.data) {
          arr.push({ value: i, label: res.data[i] })
        }
        state.filesList = [{ label: '店铺信息', list: arr, indeterminate: false, checkAll: false, listAll: [] }]
      })
    })

    watchEffect(() => {
      state.idObj = props.idObj
      console.log(state.idObj);
    })

    function close() {
      state.show = false
      setTimeout(() => {
        context.emit('close')

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
    //全选事件
    const handleCheckAllChange = row => {
      const flag = row.listAll.length === row.list.length
      row.listAll = flag ? [] : row.list.map(item => item.value)
      row.indeterminate = false
      console.log(row.listAll, 'listall');
    }

    //复选框事件
    const handleCheckedCitiesChange = (e, row) => {
      const countLength = e.length
      row.checkAll = countLength === row.list.length
      row.indeterminate = countLength > 0 && row.list.length != row.listAll.length
    }

    function submit() {
      console.log(state.idObj);
      if (state.filesList[0].listAll.length == 0) return ElMessage.error('请至少勾选一项导出内容')
      if (state.exportMethod == 1 && state.idObj.checkId.length == 0) return ElMessage.error('请至少勾选一个店铺')
      let data = Object.assign({
        shopIds: state.idObj.checkId,
        fields: state.filesList[0].listAll,
        exportType: state.exportMethod,
        dimension: state.dimension
      }, props.formData)
      exportShop(data).then(res => {
        window.open(res.data, '_self')
        close()
      })
    }

    function titleChange(val){
      state.dimension =val
      state.filesList = []
       queryFields({
        dimension: state.dimension
      }).then(res => {
        let arr = []
        for (let i in res.data) {
          arr.push({ value: i, label: res.data[i] })
        }
        state.filesList = [{ label: '店铺信息', list: arr, indeterminate: false, checkAll: false, listAll: [] }]
      })
    }
    return {
      ...toRefs(state),
      close,
      dragOptions,
      itemKey,
      handleCheckAllChange,
      handleCheckedCitiesChange,
      submit,
      titleChange
    }

  }
}
</script>

<style lang="scss" scoped>
.input-box {
  padding-bottom: 30px;
}

:deep(table) {
  border-color: #000;
}

.rowName-box {
  text-align: center;
  color: #000;

  .rowName {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }

  :deep(.el-checkbox) {
    color: #000;
  }
}

:deep(.el-table__body) {
  .el-table_2_column_5 {
    background-color: rgb(204, 204, 204);
  }
}

:deep(.el-checkbox-group) {
  display: inline-block;
}

:deep(.el-col-3) {
  background-color: #FAFAFA;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-right: 1px solid #E8E8E8;

}

:deep(.el-col-21) {
  padding: 10px;
}

.font-w {
  font-weight: 600;
  font-size: 14px;
  color: #000;
}

.row {
  border: 1px solid #E8E8E8;
  margin-top: -1px;
}

//  过渡
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0.5s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.list-group-item {
  width: calc(100% / 6);
  cursor: move;
  display: inline-block;
}

.list-group-item i {
  cursor: pointer;
}
.blue {
  color: #1890ff;
}

.btnCur {
  font-size: 18px;
  margin-right: 16px;
  cursor: pointer;
}
</style>
