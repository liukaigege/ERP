<template>
  <div class="headMenu">
    <div class="headContainer">
      <div class="headContent">
        <!-- 表头输入框 -->
        <el-input
          v-model="query.keyword"
          class="head-input"
          clearable
          
          placeholder="请输入菜单名称"
          style="width: 200px"
        />
        <!-- 表头日期时间选择组件 -->
        <el-date-picker
          v-model="query.createTime"
          unlink-panels
          type="daterange"
          class="date-item"
          style="width: 300px; margin-left: 10px"
          
          range-separator="→"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="onChanges"
        >
        </el-date-picker>
        <el-select
          v-model="query.menuType"
          placeholder="菜单属性"
          
          style="width: 150px; margin-left: 10px"
          filterable
          clearable
        >
          <el-option label="目录" value="M" />
          <el-option label="菜单" value="C" />
          <el-option label="按钮" value="F" />
          <el-option label="字段" value="D" />
        </el-select>
        <!-- 搜索和重置 -->
        <el-button
          style="margin-left: 10px"
          type="success"
          icon="el-icon-search"
          size="small"
          @click="search()"
          >搜索</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-refresh"
          size="small"
          @click="reset"
          >重置</el-button
        >
      </div>
    </div>
    <!-- 按钮 -->
    <div style="display: flex; margin-bottom: 20px" class="buttonStyle">
      <slot name="left" />
      <el-button size="small" type="primary" icon="el-icon-plus" v-if="authPath('/v1/menu/inMenu')" @click="add">
        新增
      </el-button>
      <el-button
        size="small"
        type="danger"
        icon="el-icon-delete"
        :disabled="multipleSelection.length == 0"
        v-if="authPath('/v1/menu/dmByIds')"
        @click="deleteList"
      >
        删除
      </el-button>
    </div>
    <!-- 表格渲染 -->
    <div class="pageTables">
    <el-table
      :ref="formRef"
      row-key="menuId"
      :data="data"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @select-all="selectAll"
      @select="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        :show-overflow-tooltip="true"
        label="菜单名称"
        width="200px"
        prop="menuName"
      />
      <!-- <el-table-column prop="icon" label="图标" align="center" width="60px" /> -->
      <el-table-column prop="menuType" label="菜单属性" align="center">
        <template #default="scope">
          <div>{{ getValue(scope.row.menuType) }}</div>
          <!-- <div v-if="scope.row.menuType='C'">菜单</div>
         <div v-if="scope.row.menuType='M'">目录 </div>
         <div v-if="scope.row.menuType='F'">按钮 </div>
         <div v-if="scope.row.menuType='D'">字段</div> -->
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" align="center" />
      <el-table-column prop="routeUrl" label="路由地址" align="center" />
      <el-table-column prop="requestUrl" label="权限标识" align="center" />
      <el-table-column prop="componentUrl" label="组件路径" align="center" />
      <el-table-column prop="visible" label="可见" align="center">
        <template #default="scope">
          <div v-if="scope.row.visible == '0'">是</div>
          <div v-else>否</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="200px"
        align="center"
      />
      <el-table-column label="操作" align="center" width="150px">
        <template #default="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            v-if="authPath('/v1/menu/upMenu')"
            @click="edit(scope)"
          />
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            v-if="authPath('/v1/menu/dmByIds')"
            @click="del(scope.row.menuId, scope)"
          />
        </template>
      </el-table-column>
    </el-table>
    </div>
    <!-- 删除的弹框 -->
    <CancelModel
      v-if="dialogRemarks"
      :message="message"
      :cancelList="cancelList"
      @closeDialog="closeRemarks"
      @handOkRemarks="handOkRemark"
    />

    <!-- 弹框 -->
    <editMenu
      v-if="show"
      :routerType="routerType"
      :datas="data"
      :row="row"
      @close="close"
    />

  </div>
</template>
<script>
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { reactive, toRefs, ref, toRaw } from 'vue'
import { resetForm } from '@/utils/tool.js'
import { onMounted } from 'vue'
import editMenu from '@/views/configure/systemManagement/menu/components/editMenu.vue'
import CancelModel from '@/views/configure/systemManagement/menu/components/cancelModel.vue'
import { TableTools, toTree } from '@/utils/tool.js'
import {
  getMenus, //查询所有菜单
  deleteMenu //删除菜单
} from '@/api/user.js'
export default {
  name:'Menu',
  components: {
    editMenu,
    CancelModel
  },
  setup() {
    const routerType = ref('')
    const state = reactive({
      message: '确定删除当前所选中的菜单吗，此操作不能撤销',
      row: {}, //编辑时候带过去的值
      cancelList: false, //点击删除时候判断删除输入框是否显示
      show: false,
      cancelType: '', //控制点的是批量还是单选
      dialogRemarks: false,
      cancelId: '',
      checkedKeys: false, //是否全部选中
      data: [],
      multipleSelection: [], //批量删除时候存
      selectionAll: [], //多选的时候存
      query: {
        keyword: '',
        createTime: [],
        start: '', //开始时间
        end: '', //结束时间
        menuType: ''
      },
      select: null,
      isCheckedAll: false
    })
    const close = val => {
      state.show = false
      if(val) init()
    }
    //点击搜索时候
    const search = () => {
      init()
    }
    //表格的多选框
    const handleSelectionChange = selection => {
      state.selectionAll = selection
      state.multipleSelection = []
      selection.forEach(v => {
        state.multipleSelection.push(v.menuId)
      })
      console.log(state.multipleSelection)
      //  state.select.selectTableAll(val, true)
    }
    let formR = ''
    const formRef = el => {
      formR = el
    }
    //选择全部
    function selectAll(selection) {
      state.selectionAll = selection
      console.log(state.selectionAll, 666)
      state.isCheckedAll = !state.isCheckedAll
      // console.log(state.isCheckedAll)
      if (state.isCheckedAll) {
        loop(state.data)
        function loop(data) {
          data.forEach((item, index) => {
            state.multipleSelection.push(item.menuId)
            if (item.children) {
              loop(item.children)
            }
          })
        }
      } else {
        state.multipleSelection = []
      }
      state.select.selectTableAll(state.data, state.isCheckedAll)
    }
    //上方的删除
    const deleteList = () => {
      state.cancelType = '1'
      if (state.selectionAll) {
        // state.selectionAll.forEach((item, index) => {
        //   console.log(item,9999)
        //   state.cancelList = item.children.length ? true : false
        //   state.message = state.cancelList
        //     ? '当前所选中的菜单下还有未处理的数据，请处理后再进行删除操作'
        //     : '确定删除当前所选中的菜单吗，此操作不能撤销'
        //   state.dialogRemarks = true
        // })
        for (let i = 0; i < state.selectionAll.length; i++) {
          const item = state.selectionAll[i]
          if (item.children && item.children.length) {
            state.cancelList = true
            state.message =
              '当前所选中的菜单下还有未处理的数据，请处理后再进行删除操作'
            break
          }
        }
      }
      state.dialogRemarks = true
    }
    //表格的行删除
    const del = (val, scope) => {
      state.cancelType = '2'
     state.cancelList =!!(scope.row.children&&scope.row.children.length)
      state.message = state.cancelList
        ? '当前所选中的菜单下还有未处理的数据，请处理后再进行删除操作'
        : '确定删除当前所选中的菜单吗，此操作不能撤销'
      state.cancelId = val
      state.dialogRemarks = true
    }
    ///点击弹框确定
    const handOkRemark = val => {
      //如果有子级点确定就关闭弹框
      if (state.cancelList) {
        state.dialogRemarks = false
      } else {
        //否则就删除

        //对数据进行处理
        let menuIds = []
        if (state.cancelType == '2') {
          //表行的刪除
          menuIds = [state.cancelId]
        } else {
          menuIds = state.multipleSelection
        }
        deleteMenu({
          menuIds,
          remark: val
        }).then(res => {
          if (res.code == 200) {
            /////
            // state.data = (loopstate.data, state.cancelId)
            //   return data
            // }
            ////
            state.dialogRemarks = false
            menuIds.forEach((item, index) => {
              loop(state.data, item)
            })
            init()
            ElMessage.success(res.message)
          } else {
            ElMessage.error(res.message)
          }
        })
      }
    }
    //递归开始
    function loop(data, id) {
      data.forEach((item, index) => {
        if (item.menuId == id) {
          data.splice(index, 1)
          return
        }
        if (item.children) {
          item.children = loop(item.children, id)
        }
      })
    }
    // 递归结束
    //利用过滤器来过滤目录
    const getValue = val => {
      switch (val) {
        case 'M':
          return '目录'
          break
        case 'C':
          return '菜单'
          break
        case 'F':
          return '按钮'
          break
        default:
          return '字段'
          break
      }
    }
    //重置方法
    const reset = () => {
      resetForm(state.query)
    }
    //页面初始进入时候
    const init = () => {
      let params = {
        keyword: state.query.keyword,
        start: state.query.start,
        end: state.query.end,
        menuType: state.query.menuType
      }
      getMenus(params).then(res => {
        console.log(res)
        // if (res.code == 200) {
        //   state.data = toTree(res.data, 'menuId')
        // }
        let arr=[]
        res.data.forEach((item,index)=>{
          let flag=true
          res.data.forEach((val,key)=>{
            if(item.parentId==val.menuId){
              val.children.push(item)
              item.filter=1
              flag=false
            }
          })
          if(flag){
            arr.push(item)
          }
        })
        state.data=arr.filter(item=>{
          return item.filter!=1
        })
      })
    }
    //点击编辑按钮
    const edit = val => {
      state.row = val.row
      state.show = true
      routerType.value = 1
    }
    //点击新增按钮
    const add = () => {
      state.show = true
      routerType.value = 2
    }
    //关闭备注的弹框事件(子传父)
    const closeRemarks = () => {
      state.dialogRemarks = false
    }
    onMounted(() => {
      state.select = new TableTools(formR)
      init()
    })
    //日期选择事件
    const onChanges=(e)=>{
      state.query.start=e?e[0]+' 00:00:00' : ''
      state.query.end=e?e[1] + ' 23:59:59' : ''
   console.log(e);
    }
    return {
      ...toRefs(state),
      handleSelectionChange,
      del,
      edit,
      add,
      close,
      selectAll,
      routerType,
      formRef,
      handOkRemark,
      closeRemarks,
      search,
      getValue,
      deleteList,
      reset,
      onChanges,
      init //页面初始方法
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.headMenu {
  .headContainer {
    .head-input {
      margin-top: -1px;
    }
    .headContent {
      display: flex;
      background: #fff;
      padding: 20px 30px;
    }
  }
  .pageTables{
    // margin-top: 30px;
    background-color: #fff;
    border-radius: 2px 2px 2px 2px;
    padding: 20px 25px;
  }
  :deep(.el-button) {
    height: 32px;
  }
  .buttonStyle {
    margin-top: 20px;
    :deep(.el-button) {
      height: 32px;
    }
  }
  :deep(.el-dialog__title) {
    // font-size: 14px !important;
  }
  :deep(.el-range-editor--small .el-range-separator){
    width: 38px;
  }
}
</style>
