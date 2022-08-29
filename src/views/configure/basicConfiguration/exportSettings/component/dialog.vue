<template>
  <div class="dialog-box">
    <el-dialog
      :close-on-click-modal="false"
      :title="dialogNum == 1 ? '新增模板' : '编辑模板'"
      v-model="isShow"
      width="850px"
      @close="closeDialog"
    >
      <div class="input-box">
        <div>
          <span style="color: red">*</span> 模板类型：<el-select
            :disabled="dialogNum == 2"
            v-model="type"

            @change="selectType"
            style="width: 160px; margin-right: 16px"
          >
            <el-option label="标准订单" :value="1"></el-option>
            <el-option label="商品开发已报价" :value="2"></el-option>
            <el-option label="商品管理" :value="3"></el-option>
            <el-option label="缺货采购" :value="4"></el-option>
            <el-option label="采购订单" :value="5"></el-option>
            <el-option label="采购对账" :value="6"></el-option>
            <el-option label="对账申请" :value="7"></el-option>
          </el-select>
        </div>
        <div>
          <span style="color: red">*</span> 模板名称：<el-input
            placeholder="请输入模板名称"
            style="width: 300px"

            maxlength="30"
            v-model="tempName"
          ></el-input>
        </div>
      </div>
      <div
        style="
          padding: 10px;
          height: 400px;
          overflow-y: scroll;
          position: relative;
        "
      >
        <div class="text" v-show="!list.length">请选择模板类型</div>
        <draggable
          class="list-group"
          tag="transition-group"
          :component-data="{
            tag: 'ul',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null
          }"
          v-model="list"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          item-key="nameCn"
        >
          <template #item="{ element }">
            <li class="list-group-item" style="width: 100%">
              <i
                :class="
                  element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
                "
                @click="element.fixed = !element.fixed"
                aria-hidden="true"
              ></i>
              <!-- 子集 -->
              <el-row class="row">
                <el-col :span="3">
                  <span class="font-w">{{ element.nameCn }}</span>
                  <el-checkbox
                    :indeterminate="element.indeterminate"
                    v-model="element.checkAll"
                    :key="element.name"
                    @change="handleCheckAllChange(element)"
                    >全选</el-checkbox
                  >
                </el-col>
                <el-col :span="21">
                  <draggable
                    class="list-group"
                    tag="transition-group"
                    :component-data="{
                      tag: 'ul',
                      type: 'transition-group',
                      name: !drag ? 'flip-list' : null
                    }"
                    v-model="element.list"
                    v-bind="dragOptions"
                    @start="drag = true"
                    @end="drag = false"
                    :item-key="itemKey"
                    :group="element.nameCn"
                  >
                    <template #item="{ element: item }">
                      <li class="list-group-item">
                        <i
                          :class="
                            item.fixed
                              ? 'fa fa-anchor'
                              : 'glyphicon glyphicon-pushpin'
                          "
                          @click="item.fixed = !item.fixed"
                          aria-hidden="true"
                        ></i>
                        <el-checkbox-group
                          v-model="element.listAll"
                          @change="handleCheckedCitiesChange($event, element)"
                        >
                          <el-checkbox
                            :label="item.nameEn"
                            :key="item.nameCn"
                            style="margin: 3px"
                          >
                          <p class="fontClass" :title="item.nameCn">{{ item.nameCn }}</p>
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
      </div>

      <template #footer>
        <el-button  @click="closeDialog">取消</el-button>
        <el-button type="primary"  @click="editOrAdd"
          >确定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, toRefs, computed, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'
import { exportAdd, exportEdit, exportItem } from '@/api/order/orderProcessing'
import { ElMessage } from 'element-plus'

export default {
  name: 'Dialog',
  emits: ['closeDialog', 'createTemp', 'clearTemp', 'editTepm', 'getlist'],
  components: {
    draggable
  },
  props: {
    dialogNum: {
      required: true
    },
    temp: {
      type: [Object]
    },
    itemlist: {
      required: true
    },
    itemArrlist: { type: Object },
    row: {
      type: [Object]
    }
  },
  setup(props, { attrs, emit }) {
    const state = reactive({
      drag: false,
      isShow: false,
      tempName: '', //模板名称
      //   弹窗数据
      type: '',
      list: []
    })
    onMounted(() => {
      state.isShow = true
      if (props.dialogNum == 2) {
        const { name, type, field } = props.row
        state.tempName = name
        state.type = type
        state.list = props.itemlist
      }
    })
    const closeDialog = () => {
      state.isShow = false
      emit('closeDialog')
      emit('clearTemp')
      //去除历史遗留
      for (let index = 0; index < state.list.length; index++) {
        state.list[index].listAll = []
        state.list[index].indeterminate = false
        state.list[index].checkAll = false
        state.tempName = ''
      }
    }
    function selectType() {
      const { order, goods, goodsManage,purchaseSuggest,purchaseOrdersCustomized,purchaseVerifyItem,purchaseVerifyApplyItem } = props.itemArrlist
      switch (state.type) {
        case 1:
          return (state.list = order)
        case 2:
          return (state.list = goods)
        case 3:
          return (state.list = goodsManage)
        case 4:
          return (state.list = purchaseSuggest)
        case 5:
          return (state.list = purchaseOrdersCustomized)
        case 6:
          return (state.list = purchaseVerifyItem)
        case 7:
          return (state.list = purchaseVerifyApplyItem)
      }
    }
    //全选事件
    const handleCheckAllChange = row => {
      const flag = row.listAll.length === row.list.length
      row.listAll = flag ? [] : row.list.map(item => item.nameEn)
      row.indeterminate = false
    }

    //复选框事件
    const handleCheckedCitiesChange = (e, row) => {
      const countLength = e.length
      row.checkAll = countLength === row.list.length
      row.indeterminate =
        countLength > 0 && row.list.length != row.listAll.length
    }

    const itemKey = e => {
      return e
    }
    const dragOptions = computed(() => {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    })

    const editOrAdd = e => {
      let arr = []
      for (let i = 0; i < state.list.length; i++) {
        if (state.list[i].listAll.length) {
          let arr2 = []
          state.list[i].list.forEach(item => {
            state.list[i].listAll.forEach(val => {
              if (item.nameEn == val) arr2.push(item)
            })
          })
          arr2 = arr2.map(item => item.nameEn)
          state.list[i].listAll = arr2
          arr.push(`${state.list[i].nameEn}:${state.list[i].listAll.join(',')}`)
        }
      }

      // 判断是否可以提交
      if (!arr.length && !state.tempName.trim()) {
        return ElMessage.error('请输入模板名称并勾选模板内容')
      }
      if (!state.tempName.trim()) {
        return ElMessage.error('请输入模板名称')
      }
      if (!arr.length) {
        return ElMessage.error('请选择模板内容')
      }

      const data = {
        name: state.tempName,
        field: arr.join('|'),
        type: state.type
      }
      if (props.dialogNum == 1) {
        exportAdd(data).then(res => {
          emit('getlist')
          closeDialog()
          ElMessage.success(res.message)
        })
      } else {
        data.id = props.temp.id
        exportEdit(data).then(res => {
          emit('getlist')
          closeDialog()
          ElMessage.success(res.message)
        })
      }
    }
    return {
      ...toRefs(state),
      closeDialog,
      handleCheckAllChange,
      handleCheckedCitiesChange,
      dragOptions,
      itemKey,
      editOrAdd,
      selectType
    }
  }
}
</script>

<style lang="scss" scoped>
.input-box {
  padding-bottom: 30px;
  display: flex;
}

:deep(table) {
  border-color: #000;
}
.fontClass{
  width: 130px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-right: 1px solid #e8e8e8;
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
  border: 1px solid #e8e8e8;
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
  width: 25%;
  cursor: move;
  display: inline-block;
}

.list-group-item i {
  cursor: pointer;
}
.text {
  font-size: 28px;
  color: #d7d7d7;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%);
}
</style>
