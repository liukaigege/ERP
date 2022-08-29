
<template>
  <div class="headStation">
    <div class="headContainer"></div>
    <!-- 按钮 -->
    <div style="display: flex; margin-bottom: 24px" class="buttonStyle">
      <slot name="left" />
      <el-button size="small" type="primary" icon="el-icon-plus" v-if="authPath('/v1/post/inPost')" @click="add">
        新增
      </el-button>
      <el-button
        size="small"
        type="danger"
        icon="el-icon-delete"
        :disabled="multipleSelection.length == 0"
        v-if="authPath('/v1/post/dpByIds')"
        @click="deleteList"
      >
        删除
      </el-button>
    </div>
    <div class="headTable">
      <!-- 表格渲染 -->
      <el-table
        :ref="formRef"
        row-key="postId"
        :data="data"
        max-height="800"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          :show-overflow-tooltip="true"
          label="岗位名称"
          align="center"
          width="200px"
          prop="postName"
        />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <div class="switchStatus">
              <el-switch
                v-model="scope.row.status"
                active-color="#1890FF"
                inactive-color="#C0C0C0"
              ></el-switch>
              <div
                class="statusMasker"
                @click="
                  changeStatus(
                    scope.row.postId,
                    scope.row.postName,
                    scope.row.status,
                    scope
                  )
                "
              ></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建日期"
          align="center"
          width="200px"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              v-if="authPath('/v1/post/upPost')"
              @click="edit(scope,scope.row.postId)"
            />
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              v-if="authPath('/v1/post/dpByIds')"
              @click="del(scope.row.postId)"
            />
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
     <div class="flex-pagination page-fixed">
         <div></div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="current"
            :page-sizes="paginationArr"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="paginationTotal"
        >
        </el-pagination>
      </div>
      <!-- 状态修改 -->
      <div class="dialogStatus">
      <el-dialog
        title="提示"
        v-model="statusChangeShow"
        width="30%"
        :close-on-click-modal="false"
        :before-close="closeFormStatusChangeFn"
      >
      <div style="margin-bottom:10px">
          <span class="el-icon-warning"></span>
          <span>{{statusChangeUserTitle}}</span>
      </div>
        <div class="tipsContent" v-if="showInput">
          <el-form ref="form">
            <el-form-item label="备注:">
              <el-input
                type="textarea"
                maxlength="140"
                show-word-limit
                v-model="statusChangeMessage"
              />
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeFormStatusChangeFn" 
              >取 消</el-button
            >
            <el-button type="primary"  @click="sureChangeStatusFn"
              >确 定</el-button
            >
          </span>
        </template>
      </el-dialog>
      </div>
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
    <EditStation
      v-if="show"
      :row="row"
      :editStatus="editStatus"
      :routerType="routerType"
      @close="close"
    />
  </div>
</template>
<script>
import {del,deleteList,state1,handleSelectionChange} from '@/views/configure/systemManagement/station/composable/useDelete.js'
import { ElMessage } from 'element-plus'
import { reactive, toRefs, ref, toRaw } from 'vue'
import EditStation from '@/views/configure/systemManagement/station/components/editStation.vue'
import CancelModel from '@/views/configure/systemManagement/menu/components/cancelModel.vue'

import {
  getStation, //查询岗位
  updateStation, //修改岗位信息
  deleteStaion, //删除岗位信息
  checkStation, //岗位删除校验
  updateStationStatus //岗位状态修改
} from '@/api/user.js'
import { onMounted } from 'vue'
export default {
  name:'Station',
  components: {
    EditStation,
    CancelModel
  },
  setup() {
    const routerType = ref('')
    const state = reactive({
      editStatus:'1',//编辑页面判断是否有用户
      statusTexts:'',//启用禁用保存的字
      showInput:false,
      statusLists:false,//判断状态下是否有用户的时候
      row: {}, //编辑进去的时候带的数据
      statusChangeShow: false, //确认是否开启关闭列表状态提示框显示/隐藏
      statusList: true, //存储点击的对象用于下一步确认时候校验弹框
      statusChangeUserTitle: '', //选择修改状态的用户
      statusChangeUser: '', //选择修改状态的用户(flag)
      statusChangeMessage: '', //列表状态提示框备注
      paginationTotal: 0, //分页总数据条数
      paginationArr: [10, 20, 30, 50], //分页每页选择条数默认数据
      show: false, //控制编辑弹框显示
      checkedKeys: false, //是否全部选中
      data: [],
      query: {
        blurry: '',
        createTime: '',
        searchForm: ''
      },
      current: 1, //当前页码
      size: 10, //一页多少条
    })
     let formR = ''
    const formRef = el => {
      formR = el
    }
    const init = () => {
      formR.clearSelection()
      let params = {}
      params.page = {
        pageNo: state.current,
        pageSize: state.size
      }
      getStation(params).then(res => {
        if (res.code == 200) {
          state.data = res.data.dataList
          state.paginationTotal = res.data.page.totalCount
          res.data.dataList.forEach(item => {
            if (item.status == '0') {
              item.status = true
            } else {
              item.status = false
            }
          })
          console.log(res)
        }
      })
    }
    onMounted(() => {
      init()
    })
    // 取消 列表中 修改 状态的提示弹框
    const closeFormStatusChangeFn = () => {
      state.statusChangeShow = false
      state.statusChangeMessage = ''
    }
    ////开关状态
    const changeStatus = (id, name, status, scope) => {
      state.statusChangeMessage = ''
      state.statusLists=status //判断弹框是开启还是关闭
      state.statusList = scope
      state.statusChangeUser = id
      let params={
        postIds:[state.statusChangeUser]
      }
      checkStation(params).then(res=>{
        if(res.code==200){
          state1.check='1'
          state.statusChangeShow = true
          state.showInput=true
       // 启用禁用需要根据具体的状态值判断
      let statusText = status ? '停用' : ' 启用'
      state.statusTexts=statusText
      state.statusChangeUserTitle =
        '此操作将' + statusText + '“' + name + '”，是否继续?'
        }
      }).catch(err=>{
        state.statusChangeShow = true
          console.log(state.statusLists,'state.statusLists')
          state1.check='2'
        state.showInput=false
        state.statusChangeUserTitle=name + '岗位下还存在未处理数据，请处理后再进行操作'
      })
    }
    //弹框确定修改状态
    const sureChangeStatusFn = () => {
      if(state1.check=='2'&&state.statusList){
        state.statusChangeShow=false
      }else{
      state.data.forEach(item => {
        if (item.postId == state.statusChangeUser) {
          if (item.status) {
            item.status = false
          } else {
            item.status = true
          }
        }
      })
      ///调接口
      let params = {
        postId: state.statusChangeUser,
        postName: state.statusList.row.postName,
        status: state.statusList.row.status ? '0' : '1',
        remark: state.statusChangeMessage
      }
      updateStationStatus(params).then(res => {
        if (res.code == 200) {
          state.statusChangeShow = false
          ElMessage.success(`${state.statusTexts}成功`)
          init()
        } else {
          ElMessage.error(res.message)
        }
      })
      }
      
    }
    //编辑的弹框
    const close = val => {
      if(!val){
        init()
      }
      state.show = false
    }
    // 分页
    const handleSizeChange = val => {
      state.size = val
    //   state.current = 1
      init()
    }
    const handleCurrentChange = val => {
      state.current = val
      init()
     
    }
    ///删除弹框的确定按钮
    const handOkRemark = val => {
        console.log(2323);
      if(state1.check=='2'){
        state1.dialogRemarks=false
        console.log('第一个if');
      }else{
        let postIds = []
      if (state1.cancelType == '2') {
        postIds = [state1.cancelId]
      } else {
        postIds = state1.multipleSelection
      }
      deleteStaion({ postIds, remark: val }).then(res => {
        if (res.code == 200) {
          state1.dialogRemarks = false
          init()
          ElMessage.success('删除成功')
          console.log('删除成功')
        } 
      })
      }
    }
    //关闭备注的弹框事件(子传父)
    const closeRemarks = () => {
      state1.dialogRemarks = false
    }

    //点击编辑按钮
    const edit = async (val,id )=> {
      state.row = val.row
      routerType.value = 1
      let params={
        postIds: [id]
      }
     await checkStation(params).then(res=>{
       if(res.code==200){
         state.editStatus='1'
       }
     }).catch(err=>{
       clearTimeout(err.timeId)//优化接口报错信息弹出问题
       state.editStatus='2'
        
     })
     console.log(state.editStatus,'state.editStatus');
    state.show = true
    }
    //点击新增按钮
    const add = () => {
      state.show = true
      routerType.value = 2
    }
    return {
      ...toRefs(state1),
      ...toRefs(state),
      handleSelectionChange,
      del,
      deleteList, //批量删除
      edit,
      add,
      close,
      formRef,
      routerType,
      handOkRemark, //删除弹框事件
      closeRemarks, //关闭删除弹框
      changeStatus, //开关状态
      handleCurrentChange, //分页当前页函数
      handleSizeChange, //分页切换每页条数函数
      sureChangeStatusFn, // 确定修改状态
      closeFormStatusChangeFn, // 取消 列表中 修改 状态的提示弹框
      formRef,
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
.headStation {
    .dialogStatus{
        .el-icon-warning {
		color: #f5b70d;
		font-size: 20px;
	}
    :deep(.el-dialog__body) {
		padding: 16px 24px;
		padding-top: 0px;
	}
    }

  .headContainer {
    .head-input {
      margin-top: -1px;
    }
    .headContent {
      display: flex;
    }
  }
  :deep(.el-button) {
    height: 32px;
  }
  .buttonStyle {
    // margin-top: 20px;
    :deep(.el-button) {
      height: 32px;
    }
  }
  .headTable {
    background-color: #fff;
    border-radius: 2px 2px 2px 2px;
    padding: 20px 25px;
    padding-bottom: 60px;
  }
}
.switchStatus {
  position: relative;
  .statusMasker {
    position: absolute;
    width: 30%;
    height: 100%;
    top: 0;
    right: 35%;
    cursor: pointer;
  }
}
</style>


