<!--
 * @Descripttion: 'exportTable.vue 导出表格'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-11 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-11 00:00:00
-->
<template>
  <div class="exportTable">
    <draggable
      tag="transition-group"
      :component-data="{ tag: 'ul', type: 'transition-group', name: 'tr' }"
      v-model="tableData.list"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
      :item-key="itemKey"
      group="leftList"
    >
      <template #item="{ element }">
        <el-table
          :data="[element]"
          style="width: 100%;position: relative;top: -1px;"
          :border="true"
          :show-header="false"
        >
          <el-table-column prop="title" width="92">
            <template #default="scope">
              <p class="titleText">{{ scope.row.title }}</p>
              <el-checkbox
                v-model="scope.row.checkAll"
                label="全选"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="children">
            <template #default="scope">
              <draggable
                tag="transition-group"
                :component-data="{
                  tag: 'ul',
                  type: 'transition-group',
                  name: 'tr'
                }"
                v-model="scope.row.children"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
                :item-key="itemKey"
                group="rightList"
              >
                <template #item="{ element: item }">
                  <el-checkbox
                    v-model="item.checked"
                    :style="style"
                    :label="item.title"
                  ></el-checkbox>
                </template>
              </draggable>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </draggable>
  </div>
</template>
<script>
import { reactive, toRefs, computed, watch } from 'vue'
import draggable from 'vuedraggable'
export default {
  components: { draggable },
  props: {
    list: {
      type: Array,
      default: []
    },
    style: {
      type: String,
      default: 'width:170px;line-height:36px;margin-right:10px;'
    }
  },
  setup(props, context) {
    const state = reactive({
      tableData: {
          list:props.list
      },
    })
    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    })
    const itemKey = e => {
      return e
    }
    watch(state.tableData, (count, prevCount) => context.emit('getTableData', state.tableData.list))
    return {
      ...toRefs(state),
      dragOptions,
      itemKey
    }
  }
}
</script>
<style lang="scss" scoped>
.titleText {
  font-size: 14px;
  font-weight: 550;
  color: #262626;
  
}
</style>