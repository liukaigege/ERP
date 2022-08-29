<template>
<el-dialog title="更改采购人" v-model="show" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
  <div class="contentView">
    <el-form  :model="form" ref="formRef">
      <el-form-item label="采购人:" prop="purchaseUserId">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 90%" clearable maxlength="20"></el-input>
        <el-tree class="filter-tree disable-item" :data="userList" :expand-on-click-node="false" :props="defaultProps" default-expand-all :filter-node-method="filterNode" @node-click="nodeChange" ref="treeRef"></el-tree>
      </el-form-item>
    </el-form>
  </div>
  <template #footer>
    <span class="dialog-footer">
      <el-button  @click="closeEvent">取消</el-button>
      <el-button type="primary"  @click="submit">确定</el-button>
    </span>
  </template>
</el-dialog>
</template>

<script>
import { reactive, toRefs, ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { shopUserList } from '@/api/goods/shop.js'
import { userUpdate } from '@/api/commodity.js'
export default {
  props: {
    skuIds: {
      type: Array,
      default: []
    }
  },
  emits: ['closeEvent','search'],
  setup(props, ctx) {
    let state = reactive({
      show: true,
      userList: [],
      filterText: '',
      defaultProps: {
        value: 'deptId',
        children: 'children',
        label: 'deptName',
        disabled: 'disabled'
      },
      form: {
        skuIdList: props.skuIds.map(item=>item.skuId),
        purchaseUserId: '',
        purchaseUser:'',
        purchaseInfo:props.skuIds
      },
      formRef: null,
      treeRef: null
    })

    watch(() => state.filterText, (newVal) => {
      state.treeRef.filter(newVal)
    })

    let filterNode = (value, data) => {
      if (!value) return true
      return data.deptName.indexOf(value) !== -1
    }

    // 关闭弹框
    function closeEvent() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }

    function nodeChange(e) { //节点选择
    if(e.disabled) return 
      state.form.purchaseUserId = e.deptId
      state.form.purchaseUser = e. deptName
    }

    function loop(data) {
      data.forEach(item => {
        if (item.children?.length) loop(item.children)
        let arr = []
        if (item.userVos?.length) {
          item.userVos.forEach(val => {
            arr.push({ deptId: val.userId, deptName: val.fullName })
          })
        }
        item.disabled = true
        item.children = arr.concat(item.children)
      })
    }

    onMounted(() => {
      shopUserList().then(res => {
        if (res.code == 200) {
          loop(res.data)
          state.userList = res.data
        } else {
          ElMessage.error(res.message)
        }
      })
    })

    function submit() {
      if(!state.form.purchaseUserId) return ElMessage.error('请选择采购人员！')
      console.log(state.form);
       userUpdate(state.form).then(res=>{
          ElMessage.success('采购人员更换成功！')
          ctx.emit('search')
          closeEvent()
        })
    }

    return {
      ...toRefs(state),
      filterNode,
      closeEvent,
      nodeChange,
      submit
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-warning {
  font-size: 14px;
  color: #faad14;
  margin-right: 8px;
}

.text {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}

// .contentView {
//   height: 300px;
//   overflow-y: scroll;
// }
</style><style scoped>
.disable-item>>>[aria-disabled='true']>.el-tree-node__content {
  cursor: not-allowed;
  background: #fff !important;
}
.disable-item{
  height: 300px;
  overflow: auto;
  width: 90%;
}
</style>
