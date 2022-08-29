<!--
 * @Descripttion: 'remarkMessage 备注信息'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="container">
    <vxe-table
      :data="form.list"
      keep-source
      class="erp-vxe-table"
      align="center"
      :height="tableHeight"
      show-overflow
      :scroll-y="{ enabled: true, gt: 20 }"
      :auto-resize="true"
      border= 'inner'
    >
      <vxe-table-column  field="content"  title="内容" width="40%"></vxe-table-column>
      <vxe-table-column  field="updateTime" title="更新时间" width="15%"></vxe-table-column>
      <vxe-table-column  field="createTime" title="创建时间" width="15%"></vxe-table-column>
      <vxe-table-column  field="createUserName" title="创建人" width="10%"></vxe-table-column>
      <vxe-table-column  field="typeName" title="类型" width="10%"></vxe-table-column>
      <vxe-table-column  title="操作" width="10%">
        <template #default="{ row }">
          <div class="font12" v-if="row.id">
            <el-button
              type="text"
              size="small"
              :disabled="routeName == 'LayAsideDetail' || !row.editFlag ||combine ==1 || sourceRoute"
              @click="changeRemark(row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              :disabled="routeName == 'LayAsideDetail' || combine ==1 || !row.editFlag || sourceRoute" 
              style="color: red"
              @click="delFn(row.id)"
            >删除</el-button>
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>
    <AddRemark
      :goodsId="goodsId"
      :id="id"
      :data="data"
      @cancel="addRemark"
      v-if="addRemarkShow"
    />
  </div>
</template>
<script>
import { reactive, toRefs, onMounted } from 'vue'
import AddRemark from './components/addRemark.vue'
import { remarkList, delRemark } from './composables/api.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
export default {
  components: { AddRemark },
  props: {
    tableHeight: {
      //表单高度
      type: String,
      default: '400'
    },
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    var { tableHeight } = props
    const route = useRoute()
    const routeName = route.name
    const goodsId = route.query.id || props.goodsId || null
    const sourceRoute = route.query.sourceRoute ? true : false
    const combine = route.query.combine
    const state = reactive({
      list: [],
      form: {
        list: []
      },
      addRemarkShow: false,
      id: '',
      data: {}
    })

    //获取备注列表
    function getRemarkList() {
      remarkList({ goodsId })
        .then(res => {
          if (res.code == 200) {
            state.form.list = res.data
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
       
    }
    getRemarkList()

    function changeRemark(id) {
      state.id = id
      const { content, typeId } = state.form.list.filter(v => v.id == id)[0]
      state.data = {
        content,
        remarkTypeId: typeId
      }
      state.addRemarkShow = !state.addRemarkShow
    }
    //修改备注信息
    function addRemark() {
      getRemarkList()
      state.addRemarkShow = !state.addRemarkShow
    }

    //删除备注
    function delFn(id) {
      ElMessageBox.confirm('确认删除备注？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRemark({ id })
            .then(res => {
              if (res.code == 200) {
                state.form.list = state.form.list.filter(v => v.id !== id)
                ElMessage.success({
                  message: '删除成功!'
                })
              } else {
                ElMessage.warning({ message: res.message })
              }
            })
          
        })
        
    }

    onMounted(() => {
      //动态设置表单高度
      if (props.tableHeight == '0') {
        tableHeight = document.body.clientHeight - 300 + ''
      }
    })
    return {
      ...toRefs(state),
      delFn,
      changeRemark,
      addRemark,
      getRemarkList,
      tableHeight,
      goodsId,
      routeName,
      combine,
      sourceRoute
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  background-color: #fff;
  z-index: 6;
}
.font12 {
  font-size: 12px;
}
</style>