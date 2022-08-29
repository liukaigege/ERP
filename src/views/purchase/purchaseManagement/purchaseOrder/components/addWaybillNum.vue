<template>
	<el-dialog :title="props.waybillNumType == 'add' ? '添加运单号' : '编辑运单号'" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <vxe-table v-bind="tableOptions" :data="tableData" :loading="tableLoading" ref="tableRef">
        <vxe-column title="物流方式">
          <template #default="{ row }">
            <div class="logisticses">
              <el-select v-model="row.nameCn" >
                <el-option :label="item.nameCn" :value="item.nameCn" v-for="(item, index) in logisticsesOptions" :key="index"></el-option>
              </el-select>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="trackNum" title="运单号" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '60', clearable: true}}"></vxe-column>
        <vxe-column field="boxesNum" title="发货箱数" :edit-render="{name: '$input', props: {type: 'integer', placeholder: '请输入', min: 1, max: 100, clearable: true}}"></vxe-column>
        <vxe-column title="操作">
          <template #default="{ row, $rowIndex }">
            <el-button type="text" style="color: #FD4C60" @click="del(row)" :disabled="tableData.length == 1 && props.waybillNumType == 'add'">删除</el-button>
          </template>
        </vxe-column>
      </vxe-table>
      <el-button type="primary" plain icon="el-icon-plus"  style="margin-top: 16px" @click="add()" v-if="props.waybillNumType == 'add'">增加</el-button>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
  import { ref, reactive, toRefs, onMounted } from 'vue'
  import { deepCopy, getuuid } from '@/utils/tool'
  import { getLogisticses, ivtLogisticses, saveLogisticses } from '@/api/purchase/purchase.js'
  import { ElMessage } from 'element-plus'
  let props = defineProps({
    purchaseOrderNumber: {
      type: String,
      default: ''
    },
    waybillNumType: {
      type: String,
      default: 'add'
    },
    waybillNumId: {
      type: Number,
      default: null
    }
  })
  let state = reactive({
    ifShow: true,
    loading: false,
    tableLoading: false,
    tableData: [],
    copyData: [],
    logisticsesOptions: [],
    form: {
      orderPurchaseLogisticsDTOS: [
        {
          purchaseOrderNumber: props.purchaseOrderNumber,
          logisticses: [],
          delIds: []
        }
      ]
    }
  })
  let tableRef = ref(null)
  let tableOptions = {
    autoResize: true,
    keepSource: true,
    align: 'center',
    highlightHoverRow: true,
    scrollY: { enabled: false },
    editConfig: {trigger: 'click', mode: 'row'},
    editRules: {
      trackNum: [
        {
          required: true,
          validator({ cellValue, row }) {
            if (cellValue !== 0 && !cellValue && state.tableData.length >0) return new Error('请输入运单号')
          }
        }
      ],
      boxesNum: [
        {
          required: true,
          validator({ cellValue, row }) {
            if (cellValue !== 0 && !cellValue && state.tableData.length >0) return new Error('请输入发货箱数')
          }
        }
      ]
    }
  }
  const emit = defineEmits(['closeEvent'])

  let add = () => {
    state.tableData.push({
      nameCn: state.logisticsesOptions[0].nameCn,
      trackNum: null,
      boxesNum: 1,
      id: getuuid(),
      isAdd: true
    })
    tableRef.value.loadData(state.tableData)
  }

  let del = ( {id, isAdd} ) => { 
    state.tableData = state.tableData.filter(item => item.id != id)
    if (!isAdd) state.form.orderPurchaseLogisticsDTOS[0].delIds.push(id)
  }

  // 获取运单号信息
  let getLogisticsesInfo = () => {
    let { purchaseOrderNumber, waybillNumId } = props
    getLogisticses({ purchaseOrderNumber: purchaseOrderNumber, id: waybillNumId }).then(res => {
      if (res.code == 200) {
        state.tableData = res.data
        state.copyData = deepCopy(res.data)
      } else {
        ElMessage.error(res.message)
      }
    })
  }

  // 获取所有物流方式
  let getIvtLogisticses = () => {
    return new Promise((reslove) => {
      ivtLogisticses().then(res => {
        if (res.code == 200) {
          state.logisticsesOptions = res.data
          reslove()
        } else {
          ElMessage.error(res.message)
        }
      })
    })
  }

  // 关闭弹框
  let closeEvent = (refresh = false) => {
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent', refresh)
    }, 500)
  }

  // 取消回调
  let cancelEvent = () => {
    closeEvent()
  }

  // 确认回调
  let affirmEvent = async() => {
    const errMap = await tableRef.value.validate(true).catch(errMap => errMap)
    if (errMap) {
      ElMessage.error('信息填写错误，提交失败')
      return false;
    }
    let arr = deepCopy(state.tableData)
    arr.forEach(item => {
      item.trackNum = item.trackNum.trim()
      if (item.isAdd) {
        item.id = null
        delete item.isAdd
      }
    })
    state.form.orderPurchaseLogisticsDTOS[0].logisticses = arr
    saveLogisticses(state.form).then(res => {
      state.loading = false
      if (res.code == 200) {
        ElMessage.success({ message: '操作成功！', type: 'success' });
        closeEvent(true)
      } else {
        ElMessage.error(res.message)
      }
    }).catch(err => {
      state.loading = false
   
    })
  }
  onMounted(() => {
    if (props.waybillNumType == 'edit') {
      getIvtLogisticses()
      getLogisticsesInfo()
    } else {
      getIvtLogisticses().then(() => {
        add()
      })
    }
  })
  let { ifShow, loading, tableLoading, tableData, logisticsesOptions } = toRefs(state)
</script>

<style lang="scss" scoped>

</style>