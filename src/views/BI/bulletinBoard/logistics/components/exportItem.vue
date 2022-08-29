<template>
<el-dialog title="导出异常数据" v-model="show" width="680px" @close="close" :close-on-click-modal="false">
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
          <el-checkbox v-model="item.checked" :label="item.nameCn" :key="item.valueEn" @change="checkChange($event,item)"> </el-checkbox>
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
</el-dialog>
</template>

<script>
import { inject, onMounted, reactive, toRefs, computed } from 'vue'
import { getItems } from '../api/api.js'
import draggable from 'vuedraggable'
export default {
  components: { draggable },
  setup() {
    const state = reactive({
      show: true,
      list: [],
      drag: false,
    })
    onMounted(() => {
      getItems({ type: 1 }).then(res => {
        res.data.logistics.forEach(item => {
          item.checkAll = false
          item.indeterminate = false
          item.listAll = []
          item.list.forEach(val => {})
        });
        state.list = res.data.logistics
      })
    })
    const closeDialog = inject('closeDialog')

    function close() {
      state.show = false
      setTimeout(() => {
        closeDialog('exportItemShow')
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
    const exportDetail = inject('exportDetail')
    function exportHandle() {
      let arr = []
      state.list.forEach(item => {
        item.list.forEach(val => {
          if (val.checked) arr.push(val.nameEn)
        })
      })
      if (!arr.length) return ElMessage.error('请选择导出字段')
      exportDetail({type:3,exportNodeFiledList:arr})
    }
    return {
      close,
      ...toRefs(state),
      dragOptions,
      itemKey,
      checkChange,
      exportHandle
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
