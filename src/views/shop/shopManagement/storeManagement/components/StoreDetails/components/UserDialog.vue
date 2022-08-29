<template>
<!-- 基本信息 负责人弹框-->
<el-dialog title="修改使用部门" v-model="show" width="480px" @close="close" :close-on-click-modal="false">
  <el-form :model="formData" :inline="false" :rules="rules" ref="formRef" label-width="100px">
    <el-form-item label="使用部门:" prop="useDept">
      <elSelectTree :data="deptList" filterable :treeProps="treeProps" @ok="ok" checkStrictly isDisableItem :width="286" />
    </el-form-item>
    <el-form-item label="负责人:" prop="leader">
      <el-select v-model="formData.leader" style="width:310px" clearable filterable>
        <el-option v-for="item in userList" :key="item.userId" :label="item.fullName" :value="item.userId">
        </el-option>
      </el-select>

    </el-form-item>
    <el-form-item label="变更时间:" prop="changeTime">
      <el-date-picker v-model="formData.changeTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="选择日期时间" style="width:310px" >
      </el-date-picker>
    </el-form-item>
  </el-form>

  <template #footer>
    <el-button @click="close">取消</el-button>
    <el-button type="primary" @click="changeUser">确定</el-button>
  </template>
</el-dialog>
</template>

<script scoped>
import { onMounted, reactive, toRefs, watch } from 'vue'
import elSelectTree from '@/components/elSelectTree/index.vue'
import { shopUserList, changeShopUser } from '@/api/goods/shop.js'
import { requiredValue } from '@/views/shop/shopRules/rules.js'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { _debounce } from '@/utils/tool.js'
export default {
  emits: ['closeEvent', 'detail'],
  components: {
    elSelectTree
  },
  props: {
    data: {}
  },
  setup(props, context) {
    const state = reactive({
      show: false,
      formData: {
        leader: '',
        changeTime: '',
        useDept: '',
        shopIds: [props.data.shopId]
      },
      data: props.data,
      treeProps: {
        value: 'deptId',
        label: 'deptName',
        children: 'children',
        disabled: 'disabled'
      },
      deptList: [],
      userList: [],
      formRef: ''
    })

    const rules = {
      leader: [requiredValue('请选择负责人')],
      useDept: [requiredValue('请选择使用部门')],
      changeTime: [requiredValue('请选择变更时间')]
    }
    onMounted(() => {
      state.show = true
      shopUserList().then(res => {
        state.deptList = res.data
      })
    })

    function loop(data) {
      data.forEach(item => {
        if (item.children && item.children.length) loop(item.children)
        if (item.deptId == state.formData.useDept) {
          if (item.userVos) {
            state.userList = item.userVos
          }
        }
      })
    }

    function close() {
      state.show = false
      setTimeout(() => {
        context.emit('closeEvent', 'userDialogShow')
      }, 500)
    }

    let changeUser = _debounce(() => {
      state.formRef.validate().then(res => {
        let newDate = new Date(state.formData.changeTime).getTime()
        let nowDate = new Date().getTime()
        if (nowDate >= newDate) return ElMessage.error('使用时间不得早于当前时刻，请重新修改信息！')
        changeShopUser(state.formData).then(res => {
          context.emit('detail')
          close()
        })
      })
    })

    function ok(e) {
      state.formData.leader = ''
      state.formData.useDept = e
      state.userList = []
      if(e){
        loop(state.deptList)
      }

    }


    return {
      ...toRefs(state),
      close,
      changeUser,
      ok,
      rules,
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  color: #fff;
}

.el-dialog {
  padding: 0 80px;
}

.w320 {
  width: 320px !important;
}
</style>
