<!--
 * @Descripttion: 用户管理
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-07 11:27:31
 * @LastEditors: 王新国
 * @LastEditTime: 2021-07-14 19:30:58
-->
<!-- v-permission="'/v1/user/inUser'"  -->
<template>
  <div class="usersManagement">
    <!-- 用户管理     -->
    <el-container>
      <!-- 内容顶部 搜索条件输入选择区域 -->
      <el-header style="max-height: 120px; height: auto; margin-bottom: 20px">
        <!-- 搜索条件区域 -->
        <el-row
          :gutter="24"
          style="background-color: #fff; padding: 20px; margin-bottom: 20px"
        >
          <el-col :span="5" style="padding-right: 0">
            <div class="grid-content bg-purple">
              <el-input
                v-model="keyword"
                placeholder="请输入手机号/邮箱/姓名/用户名"
                
                clearable
                @keyup.enter="searchFn"
                class="searchInput"
              ></el-input>
            </div>
          </el-col>
          <el-col :span="6.2" style="padding-right: 0">
            <div class="grid-content bg-purple">
              <el-date-picker
                v-model="searchDate"
                
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD HH:mm:ss"
                unlink-panels
              >
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="3" class="statusContent" style="padding-right: 0">
            <div class="grid-content bg-purple">
              <el-select v-model="status" placeholder="状态" >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="3" class="statusContent" style="padding-right: 0">
            <div class="grid-content bg-purple">
              <el-select v-model="specialFlag" placeholder="状态" >
                <el-option
                  v-for="item in [{value:'',label:'全部'},{value:1,label:'权限特殊'},{value:0,label:'权限正常'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </el-col>
          <el-col :span="3" style="padding-right: 0">
            <div class="grid-content bg-purple">
              <el-button type="success"  @click="searchFn"
                >搜索</el-button
              >
            </div>
          </el-col>
        </el-row>
        <!-- 新增/删除==>按钮区域 -->
        <el-row class="headerBtnsContainer">
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
              <el-button
                icon="el-icon-plus"
                
                @click="addUserVueShowFn"
                type="primary"
                style="margin-right: 15px"
                v-if="authPath('/v1/user/inUser')"
              >
                新增
              </el-button>
              <div class="addUser">
                <el-dialog
                  :title="changUserTitle"
                  v-model="formData.addUserVueShow"
                  width="40%"
                  :close-on-click-modal="closeModal"
                  :before-close="closeTheModalFn"
                >
                  <AddUser
                    v-if="formData.addUserVueShow"
                    :deptData="formData.deptData"
                    :userId="changUserId"
                    :waitChangeData="waitChangeData"
                    @modalUserInfo="modalUserInfo"
                  />
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="closeTheModalFn" >
                        取 消
                      </el-button>
                      <el-button
                        type="primary"
                        
                        @click="sureAddUserFn"
                        :disabled="clickStatus"
                      >
                        确 定
                      </el-button>
                    </span>
                  </template>
                </el-dialog>
              </div>
              <el-button
                icon="el-icon-delete"
                
                @click="deleteTipsShowFn"
                type="danger"
                :disabled="deleteDisabled"
                v-if="authPath('/v1/user/deByIds')"
              >
                删除
              </el-button>

              <el-dialog
                title="确认删除当前所选择的用户？"
                v-model="formData.deleteTipsVueShow"
                width="30%"
                :close-on-click-modal="closeModal"
                :before-close="closeDeleteModalFn"
              >
                <div class="tipsContent">
                  <el-form ref="form">
                    <el-form-item label="备注:">
                      <el-input
                        type="textarea"
                        maxlength="140"
                        show-word-limit
                        v-model="formData.deleteTipsMessage"
                      >
                      </el-input>
                    </el-form-item>
                  </el-form>
                </div>
                <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="closeDeleteModalFn" 
                      >取 消</el-button
                    >
                    <el-button type="primary" @click="sureDeleteFn" 
                      >确 定</el-button
                    >
                  </span>
                </template>
              </el-dialog>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-container style="padding: 20px 0 20px 20px; background-color: #fff">
        <!-- 主题内容左侧栏 公司组织架构 层级 -->
        <el-aside
          style="background-color: #ebebeb; width: 200px; overflow: auto"
        >
          <div style="height: 60vh; overflow-y: scroll">
            <el-tree
              :data="formData.deptData"
              :expand-on-click-node="false"
              :props="formData.defaultDeptData"
              :highlight-current="highlight"
              :default-expand-all="expand"
              node-key="deptId"
              :current-node-key="1"
              :default-checked-keys="defaultKeys"
              @node-click="handleNodeClick"
              style="background-color: #ebebeb"
            ></el-tree>
          </div>
        </el-aside>
        <!-- 主体内容 表格 -->
        <el-main>
          <!-- 表单内容 -->
          <el-table
            ref="multipleTable"
            :data="formData.tableData.data"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="fullName"
              label="姓名"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="gender"
              label="性别"
              width="50"
              align="center"
            >
              <template #default="scope">
                <div>
                  {{
                    scope.row.gender == '0'
                      ? '男'
                      : scope.row.gender == '1'
                      ? '女'
                      : '未知'
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="phoneNumber"
              label="手机号"
              width="130"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="email"
              label="邮箱"
              width="170"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="deptName"
              label="部门"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="postName"
              label="岗位"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="workNum"
              label="工号"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="managerName"
              label="部门负责人"
              width="100"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态"
              width="90"
              align="center"
            >
              <template #default="scope">
                <div class="re switchContainer">
                  <el-switch
                    v-model="scope.row.status"
                    active-color="#1890FF"
                    inactive-color="#C0C0C0"
                  ></el-switch>
                  <div
                    class="ab switchMasker"
                    @click="openFormStatusChangeFn(scope.row.userId)"
                  ></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建日期" align="center">
            </el-table-column>
            <!-- <el-table-column
              prop="logs"
              label="操作日志"
              width="80"
              align="center"
            >
             <template #default="scope">
               <div @click="checkUserLogFn(scope.row.userId)" class="pointClass" :dataid="scope.row.logs" >
                 查看日志
               </div>
             </template>
            </el-table-column> -->
            <el-table-column
              prop="userId"
              label="操作"
              width="200"
              align="center"
            >
              <template #default="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="small"
                  @click="changeUserDataFn(scope.row.userId)"
                  v-if="authPath('/v1/user/upUser')"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="small"
                  @click="deleteSingleDataFn(scope.row.userId)"
                  v-if="authPath('/v1/user/deByIds')"
                ></el-button>
                <el-button
                  type="success"
                  icon="el-icon-lock"
                  size="small"
                  @click="resetFn(scope.row.userId)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页器 -->
          <el-pagination
            class="rightBottom"
            style="margin-top: 15px"
            @size-change="changeUserListSize"
            @current-change="changeUserListCurrent"
            :current-page="formData.tableData.currentPage"
            :page-sizes="formData.tableData.paginationArr"
            :page-size="formData.tableData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="formData.tableData.totlePages"
          >
          </el-pagination>
          <!-- 状态修改 -->
          <el-dialog
            :title="formStatusChangeUserTitle"
            v-model="formStatusChangeShow"
            width="30%"
            :close-on-click-modal="closeModal"
            :before-close="closeFormStatusChangeFn"
          >
            <div class="tipsContent">
              <el-form ref="form">
                <el-form-item label="备注:">
                  <el-input
                    type="textarea"
                    maxlength="140"
                    show-word-limit
                    v-model="formStatusChangeMessage"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="closeFormStatusChangeFn" 
                  >取 消</el-button
                >
                <el-button
                  type="primary"
                  
                  @click="sureChangeStatusFn"
                  >确 定</el-button
                >
              </span>
            </template>
          </el-dialog>
          <!-- 日志查看 -->
          <div class="logListOutterContainer">
            <el-dialog
              :title="logList.logListTitle"
              v-model="logList.logListShow"
              width="786px"
              :close-on-click-modal="closeModal"
              :before-close="closeLogsListModalFn"
            >
              <!-- 日志列表 -->
              <el-table
                :data="logList.logListData"
                :border="true"
                style="width: 100%"
              >
                <el-table-column
                  prop="createTime"
                  label="时间点"
                  align="center"
                  width="180"
                >
                </el-table-column>
                <el-table-column
                  prop="content"
                  label="行为"
                  align="center"
                  width="180"
                >
                </el-table-column>
                <el-table-column prop="remark" align="center" label="备注">
                </el-table-column>
              </el-table>
              <!-- 日志分页器 -->
              <el-pagination
                style="margin-top: 15px"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="logList.currentPage"
                :page-sizes="logList.paginationArr"
                :page-size="logList.pageSize"
                layout="prev, pager, next, sizes, jumper"
                :total="logList.logListDataTotle"
              >
              </el-pagination>
            </el-dialog>
          </div>
          <!-- 重置密码 -->
          <div class="resetOutterContainer">
            <el-dialog
              title="提示"
              v-model="resetShow"
              width="420px"
              :close-on-click-modal="closeModal"
              :before-close="closeResetFn"
            >
              <div class="tipsContent">
                <i class="el-icon-warning"></i
                ><span>确定重置密码吗，是否继续？</span>
              </div>
              <template #footer>
                <span class="dialog-footer">
                  <el-button @click="closeResetFn" 
                    >取 消</el-button
                  >
                  <el-button type="primary"  @click="sureResetFn"
                    >确 定</el-button
                  >
                </span>
              </template>
            </el-dialog>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { reactive, toRefs, getCurrentInstance, computed } from 'vue'
import { ElMessage } from 'element-plus'
import AddUser from './components/addUser.vue'
import {
  checkAllUsersList,
  setUsersInfo,
  deletUsers,
  addUsersInfo,
  resetPwd,
  queryUserMessage,
  getDepartmentList,
  upStatusUser,
  updateAuth
} from '@/api/user.js'
import { checkUserLogs } from '@/api/logs.js'
import { patternFn, deepCopy } from '@/utils/tool.js'
import { authPath } from '@/utils/hooks'
import { useStore } from 'vuex'
export default {
  components: { AddUser },
  name: 'Usersmanagement',
  setup() {
    const { proxy, ctx } = getCurrentInstance()
    const updateData = {
      //修改或者新增用户的数据
      userId: '', //	用户ID
      userName: '', //	用户名
      phoneNumber: '', //	手机号码
      fullName: '', //	姓名
      email: '', // 邮箱
      deptId: '', // 部门Id
      postId: '', // 岗位Id
      gender: '', // 用户性别（0男 1女 2未知）
      status: '', // 帐号状态（0正常 1停用）
      roleIds: '', // 角色Id字符串
      remark: '' // 备注
    }
    let store = useStore()
    const sideBarWidth = computed(() => store.state.menu.sideBarWidth)
    const state = reactive({
      // 开始js Start
      specialFlag:'',
      deptIdStatus:false,
      closeModal: false,
      expand: true, //默认部门结构展开
      highlight: '', //树形结构选择高亮
      deleteDisabled: true, //删除按钮是否停用
      defaultKeys: [],
      formData: {
        addUserVueShow: false, //通过新增用户按钮控制添加用户弹框
        deleteTipsVueShow: false, //通过删除按钮控制删除提示的弹框
        deleteTipsMessage: '', //删除弹框的备注信息文字
        checkedList: [], //将选中的数据添加到此数组
        tableData: {
          //表单数据
          paginationArr: [10, 20, 30, 50], //分页每页选择条数默认数据
          pageSize: 10, //分页-->每页数据条数
          currentPage: 1, //当前页码
          data: [], //表单数据
          totlePages: 0 //数据总条数
        },
        singleCtrlsId: '', //单独对一条数据处理的唯一标识
        defaultDeptData: {
          //数据绑定到树状结构
          label: 'deptName',
          status: 'status',
          parentId: 'parentId',
          deptId: 'deptId',
          children: 'children'
        },
        deptData: [] //组织架构树状数据===》部门数据
      },
      formStatusChangeShow: false, //确认是否开启关闭列表状态提示框显示/隐藏
      formStatusChangeMessage: '', //列表状态提示框备注
      formStatusChangeUser: '', //选择修改状态的用户
      formStatusChangeUserTitle: '', //选择修改状态的用户弹框标题
      updateData, //修改或者新增用户的数据
      logList: {
        //日志弹框数据
        logListShow: false, // 日志弹框的显示/隐藏
        logListTitle: '提示', // 日志弹框的标题
        checkLogListUser: '', //选择查看日志的用户名
        logListData: [],
        logListDataTotle: 100,
        currentPage: 1,
        pageSize: 10,
        paginationArr: [10, 20, 30, 50] //分页每页选择条数默认数据
      },
      resetShow: false, //重置密码弹框
      // 开始js End
      keyword: '', // 搜索关键字(手机号/邮箱/姓名/花名进行搜索)
      deptId: '', //搜索 部门id
      searchDate: '', // 选择日期时间段
      statusOptions: [
        //顶部状态选择下拉框
        {
          value: '',
          label: '全部'
        },
        {
          value: '0',
          label: '启用'
        },
        {
          value: '1',
          label: '停用'
        }
      ],
      status: '', //状态选择值
      toSonModalData: [],
      addChangeData: '', //接收的子组件的数据
      clickStatus: false, //判断点击次数只生效一次
      changUserId: 0, //修改用户信息的id
      waitChangeData: {}, //修改用户信息的数据
      changUserTitle: '新增用户', //弹框标题
      userPageInfo: {
        page: {
          pageNo: 1,
          pageSize: 10
        }
      },
      checkLogs: {
        //查询用户日志数据
        pageQuery: {
          pageNo: 1,
          pageSize: 10
        },
        userId: '',
        userName: '',
        start: '',
        end: '',
        postName: '',
        deptName: '',
        userId: '',
        packageId: ''
      },
      selfUserId: '', //当前操作用户的userId
      buttonStatus: false
    })
    // 部门数据
    const getOrganizationTreeFn = () => {
      getDepartmentList()
        .then(res => {
          state.formData.deptData = res.data
        })
    }
    getOrganizationTreeFn()

    // 获取用户列表数据
    const getUsersListFn = () => {
      if (!state.searchDate) state.searchDate = ['', '']
      let data = {
        keyword: state.keyword || '', //手机号、邮箱、用户名
        start: state.searchDate[0] || '', //	开始时间
        end: state.searchDate[1] || '', //结束时间
        status: state.status, //帐号状态（0正常 1停用）
        deptId: state.deptId, //部门id
        page: {
          pageNo: state.formData.tableData.currentPage,
          pageSize: state.formData.tableData.pageSize
        },
        specialFlag:state.specialFlag
      }
      checkAllUsersList(data)
        .then(res => {
          if (res.code == 200) {
            if (res.data.page.totalCount > 0) {
              state.formData.tableData.data = [...res.data.dataList]
              state.formData.tableData.data.forEach(
                v => (v.status = v.status == '0' ? true : false)
              )
            } else {
              state.formData.tableData.data = []
            }
            state.formData.tableData.totlePages = res.data.page.totalCount
          }
        })
    }

    //查询当前登录操作的用户信息（本人）
    queryUserMessage()
      .then(res => {
        if (res.code == 200) {
          state.selfUserId = res.data.userId
          //进入页面立即调用一次查询用户接口
          getUsersListFn()
        } else {
          ElMessage.warning({ message: res.message })
        }
      })

    // 通过新增用户按钮控制添加用户弹框
    const addUserVueShowFn = () => {
      state.changUserId = 0
      state.waitChangeData = {}
      state.changUserTitle = '新增用户'
      state.formData.addUserVueShow = true
    }
    // 关闭新增用户弹框
    const closeTheModalFn = () => {
      state.formData.addUserVueShow = false
    }

    //通过删除按钮控制删除提示的弹框
    const deleteTipsShowFn = () => {
      state.formData.deleteTipsMessage = ''
      state.formData.deleteTipsVueShow = true
    }

    // 关闭删除提示弹出框
    const closeDeleteModalFn = () => {
      state.formData.deleteTipsVueShow = false
      state.formData.singleCtrlsId = ''
      state.formData.deleteTipsMessage = ''
    }

    // 确定删除
    const sureDeleteFn = () => {
      let userIds = []
      if (state.formData.singleCtrlsId) {
        //单独对一条数据处理的唯一标识 只处理当前一条
        userIds.push(state.formData.singleCtrlsId)
      } else {
        state.formData.checkedList.forEach(v => {
          userIds.push(v.userId)
        })
      }
      deletUsers({ userIds, remark: state.formData.deleteTipsMessage || '' })
        .then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: '删除成功' })
            state.formData.deleteTipsVueShow = false
            state.formData.deleteTipsMessage = ''
            state.formData.singleCtrlsId = ''
            getUsersListFn()
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
    }

    //选择表单列表中的项
    const handleSelectionChange = val => {
      state.formData.checkedList = val
      if (val.length) {
        state.deleteDisabled = false
      } else {
        state.deleteDisabled = true
      }
    }

    // 左侧 部门选择结果
    const handleNodeClick = e => {
      state.formData.tableData.currentPage = 1
      state.deptId = e.deptId
      getUsersListFn()
    }

    //用户分页数
    const changeUserListSize = val => {
      state.formData.tableData.pageSize = val
      if (
        state.formData.tableData.currentPage >
        Math.ceil(state.formData.tableData.totlePages / val)
      )
        state.formData.tableData.currentPage = Math.ceil(
          state.formData.tableData.totlePages / val
        )

      getUsersListFn()
    }
    const changeUserListCurrent = val => {
      state.formData.tableData.currentPage = val
      getUsersListFn()
    }

    // 取消 列表中 修改 状态的提示弹框
    const closeFormStatusChangeFn = () => {
      state.formStatusChangeShow = false
      state.formStatusChangeMessage = ''
    }

    // 点击 取消或者设置 状态的开关
    const openFormStatusChangeFn = id => {
      state.formStatusChangeMessage = ''
      state.formStatusChangeShow = true
      state.formStatusChangeUser = id
      // 启用停用需要根据具体的状态值判断
      let statusText = state.formData.tableData.data.filter(
        v => id == v.userId
      )[0].status
        ? '停用'
        : '启用'
      state.formData.tableData.data.forEach(item => {
        if (item.userId == id) {
          let {
            userId,
            userName,
            phoneNumber,
            fullName,
            email,
            deptId,
            postId,
            gender,
            status,
            roleIds,
            remark
          } = item
          status = status ? '1' : '0'
          state.updateData = {
            userId,
            userName,
            phoneNumber,
            fullName,
            email,
            deptId: deptId[0],
            postId,
            gender,
            status,
            roleIds,
            remark
          }
        }
      })
      state.formStatusChangeUserTitle =
        '此操作将' +
        statusText +
        '“' +
        state.formData.tableData.data.filter(v => id == v.userId)[0].userName +
        '”这个账号，是否继续？'
    }

    // 确定修改状态
    const sureChangeStatusFn = () => {
      state.updateData.remark = state.formStatusChangeMessage
      let changeUserId = '',
        changeStatus = '',
        changeUserName = ''
      state.formData.tableData.data.forEach(item => {
        if (item.userId == state.formStatusChangeUser) {
          changeUserId = item.userId
          changeStatus = item.status ? '1' : '0'
          changeUserName = item.userName
        }
      })
      upStatusUser({
        userId: changeUserId,
        status: changeStatus,
        remark: state.updateData.remark,
        userName: changeUserName
      })
        .then(res => {
          state.formStatusChangeShow = false
          state.formStatusChangeMessage = ''
          state.formData.tableData.data.forEach(item => {
            if (item.userId == state.formStatusChangeUser) {
              if (item.status) {
                item.status = false
                ElMessage.success({ message: '停用成功' })
              } else {
                item.status = true
                ElMessage.success({ message: '启用成功' })
              }
            }
          })
        })
    }

    // 取消日志列表弹框的展示
    const closeLogsListModalFn = () => {
      state.logList.logListShow = false
    }

    //查询用户操作日志函数
    const checkUserLogListFn = () => {
      checkUserLogs(state.checkLogs)
        .then(res => {
          console.log(res)
          state.logList.logListData = [...res.data.dataList]
          state.logList.logListDataTotle = res.data.page.totalCount
        })
    }

    // 分页当前页函数
    const handleCurrentChange = val => {
      state.checkLogs.pageQuery.pageNo = val
      checkUserLogListFn()
    }

    //分页器 选择页面函数(日志)
    const handleSizeChange = val => {
      state.checkLogs.pageQuery.pageSize = val
      state.checkLogs.pageQuery.pageNo = 1
      checkUserLogListFn()
    }

    // 点击查看日志的函数
    const checkUserLogFn = id => {
      state.logList.logListTitle =
        state.formData.tableData.data.filter(v => v.userId == id)[0].userName +
        '的操作日志'
      state.logList.logListShow = true
      state.checkLogs.pageQuery.pageNo = 1
      checkUserLogListFn()
    }

    // 点击删除单条数据
    const deleteSingleDataFn = id => {
      if (id == 1)
        return ElMessage.warning({ message: '无法操作超级管理员角色' })
      state.formData.singleCtrlsId = id
      state.formData.deleteTipsMessage = ''
      state.formData.deleteTipsVueShow = true
    }

    // 点击修改某条数据
    const changeUserDataFn = id => {
      if (id == 1)
        return ElMessage.warning({ message: '无法操作超级管理员角色' })
      state.formData.singleCtrlsId = id
      state.waitChangeData = deepCopy(state.formData.tableData.data).filter(
        v => id == v.userId
      )[0]
      if (
        state.waitChangeData.roleIds &&
        state.waitChangeData.roleIds.length &&
        state.waitChangeData.roleNames &&
        state.waitChangeData.roleNames.length
      ) {
        state.waitChangeData.roleListInfo = []
        state.waitChangeData.roleIds.forEach((v, i) => {
          let obj = {
            roleId: v,
            roleName: state.waitChangeData.roleNames[i]
          }
          state.waitChangeData.roleListInfo.push(obj)
        })
      }
      state.changUserId = id
      state.changUserTitle = '修改用户信息'
      state.formData.addUserVueShow = true
    }

    // 关闭 重置密码弹框
    const closeResetFn = () => {
      state.resetShow = false
    }

    // 确定 重置密码
    const sureResetFn = () => {
      resetPwd({ userId: state.formData.singleCtrlsId })
        .then(res => {
          state.resetShow = false
          if (res.code == 200) {
            ElMessage.success({ message: '重置密码成功' })
          } else {
            ElMessage.warning({ message: res.message })
          }
        })
    }

    // 点击重置用户密码
    const resetFn = id => {
      if (id == 1)
        return ElMessage.warning({ message: '无法操作超级管理员角色' })
      state.formData.singleCtrlsId = id
      state.resetShow = true
    }

    // 点击搜索头部按钮
    const searchFn = () => {
      state.deptId = ''
      getOrganizationTreeFn()
      getUsersListFn()
    }

    // 新增用户时，接收子组件数据
    const modalUserInfo = (data,deptIdStatus = false) => {
      state.deptIdStatus = deptIdStatus
      state.addChangeData = data
      // checkAddStatus()
      if (
        data.reUserEmail ||
        data.reUserWorkNum ||
        data.reUserPhone ||
        data.reUserName
      ) {
        state.clickStatus = true
      } else {
        state.clickStatus = false
      }
      console.log(state.clickStatus)
    }

    // function checkAddStatus(){
    //   if(!state.addChangeData.reUserName
    //   && !state.addChangeData.reUserPhone
    //   && !state.addChangeData.reUserEmail
    //   && !state.addChangeData.reUserWorkNum
    //   && state.addChangeData.deptId
    //   && state.addChangeData.postId
    //   && state.addChangeData.gender
    //   && state.addChangeData.status
    //   && state.addChangeData.roleIds.length
    //   ){
    //     state.buttonStatus = true
    //   }else{
    //     state.buttonStatus = false
    //   }
    // }

    // 确定新增用户
    function sureAddUserFn() {
      if (!state.addChangeData.errorSatus) {
        if (state.addChangeData.reUserName)
          return ElMessage.warning({ message: '用户名不能重复~~~' })
        if (state.addChangeData.reUserPhone)
          return ElMessage.warning({ message: '手机号不能重复~~~' })
        if (state.addChangeData.reUserWorkNum)
          return ElMessage.warning({ message: '工号不能重复~~~' })
        if (state.addChangeData.reUserEmail)
          return ElMessage.warning({ message: '邮箱不能重复~~~' })

        if (!patternFn(state.addChangeData.userName, 'userName'))
          return ElMessage.warning({ message: '用户名长度为2-10位' })
        if (!patternFn(state.addChangeData.phoneNumber, 'mobileNumber'))
          return ElMessage.warning({ message: '请输入正确的手机号码' })
        if (!patternFn(state.addChangeData.fullName, 'userName'))
          return ElMessage.warning({ message: '姓名长度为2-10位' })
        if (!patternFn(state.addChangeData.email, 'email'))
          return ElMessage.warning({ message: '请输入正确的邮箱' })
        if (!state.addChangeData.deptId)
          return ElMessage.warning({ message: '请选择部门' })
        if (!state.addChangeData.postId)
          return ElMessage.warning({ message: '请选择岗位' })
        if (!state.addChangeData.gender)
          return ElMessage.warning({ message: '请选择性别' })
        if (!state.addChangeData.status)
          return ElMessage.warning({ message: '请选择状态' })
        if (!state.addChangeData.roleIds.length)
          return ElMessage.warning({ message: '请选择角色' })
        state.addChangeData.userName = state.addChangeData.userName.trim()
        state.addChangeData.fullName = state.addChangeData.fullName.trim()
        state.addChangeData.phoneNumber = state.addChangeData.phoneNumber.trim()
        state.addChangeData.email = state.addChangeData.email.trim()
        state.addChangeData.workNum = state.addChangeData.workNum?.trim()
        if (state.changUserId == 0) {
          addUsersInfo(state.addChangeData)
            .then(res => {
              state.formData.addUserVueShow = false
              if (res.code == 200) {
                ElMessage.success({ message: '新增成功' })
              } else {
                ElMessage.warning({ message: res.message })
              }
              getUsersListFn()
            })
        } else {
          let {
              userId,
              userName,
              phoneNumber,
              fullName,
              email,
              deptId,
              postId,
              gender,
              status,
              roleIds,
              remark,
              workNum,
              specialFlag
            } = state.addChangeData,
            data = {
              specialFlag,
              userId,
              userName,
              phoneNumber,
              fullName,
              email,
              deptId,
              postId,
              gender,
              status,
              roleIds,
              remark,
              workNum
            }
          setUsersInfo(data)
            .then(res => {
              state.changUserId = 0
              state.formData.addUserVueShow = false
              if (res.code == 200) {
                if(state.deptIdStatus){
                  updateAuth({userId,deptId})
                  .then(res => {
                    if (res.code == 200) {
                      ElMessage.success({ message: '修改成功' })
                    } else {
                      ElMessage.warning({ message: res.message })
                    }
                  })
                }else{
                  ElMessage.success({ message: '修改成功' })
                }
              } else {
                ElMessage.warning({ message: res.message })
              }
              getUsersListFn()
            })
            
        }
      }
    }

    return {
      ...toRefs(state),
      searchFn, // 点击搜索头部按钮
      addUserVueShowFn, //通过新增用户按钮控制添加用户弹框
      closeTheModalFn, //关闭新增用户弹框
      deleteTipsShowFn, //通过删除按钮控制删除提示的弹框
      closeDeleteModalFn, // 关闭删除提示弹出框
      sureDeleteFn, //确认删除
      handleSizeChange, //分页切换每页条数函数
      handleCurrentChange, //分页当前页函数
      handleNodeClick, //左侧 部门选择结果
      handleSelectionChange, //表单选择返回函数
      closeFormStatusChangeFn, // 取消 列表中 修改 状态的提示弹框
      openFormStatusChangeFn, //点击 取消或者设置 状态的开关
      sureChangeStatusFn, // 确定修改状态
      closeLogsListModalFn, // 取消日志列表弹框的展示
      checkUserLogFn, // 点击查看日志的函数
      deleteSingleDataFn, // 点击删除单条数据
      changeUserDataFn, // 点击修改某条数据
      closeResetFn, // 关闭 重置密码弹框
      sureResetFn, // 确定 重置密码
      resetFn, // 点击重置用户密码
      modalUserInfo, //新增用户时，接收子组件数据
      sureAddUserFn, //确定新增用户
      changeUserListCurrent, //用户列表切换页码
      changeUserListSize, //用户列表切换每页数据条数
      sideBarWidth
    }
  }
}
</script>

<style lang="scss" scoped>
.usersManagement {
  :deep(.el-table::before) {
    height: 0;
  }
  .resetOutterContainer {
    :deep(.el-dialog__body) {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .el-icon-warning {
      color: #e6a23c;
      font-size: 24px;
      margin-right: 10px;
      position: relative;
      top: 4px;
    }
  }
  .pointClass {
    cursor: pointer;
    color: #409eff;
  }
  .pointClass:hover {
    color: #174577;
  }
  .switchContainer {
    position: relative;
    .switchMasker {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: pointer;
      z-index: 9;
      // display: none;
    }
  }
  .headerBtnsContainer {
    margin-top: 15px;
  }
  :deep(.el-dialog__header) {
    // border-bottom: 1px solid #EBEBEB;
  }
  :deep(.el-dialog__footer) {
    // border-top: 1px solid #EBEBEB;
    padding-top: 20px;
  }
  :deep(.el-table) {
    :deep(.el-dialog__body) {
      padding: 20px;
    }
  }
  .tipsContent {
    :deep(.el-textarea__inner) {
      width: 475px;
      height: 125px;
    }
    .el-textarea {
      :deep(.el-input__count) {
        right: 26px;
      }
    }
  }
  :deep(.el-table .cell) {
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .logListOutterContainer {
    :deep(.el-dialog__body) {
      padding-top: 0;
    }
    :deep(td) {
      font-size: 14px;
    }
    :deep(.el-pagination__jump) {
      margin-left: 5px;
    }
  }
  .addUser {
    display: inline-block;
    :deep(.el-dialog__body) {
      padding: 0 30px !important;
    }
  }
  :deep(.el-main) {
    padding-top: 0;
    padding-bottom: 0;
  }
  .rightBottom {
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    padding: 10px;
    justify-content: flex-end;
    background-color: #fff;
    left: v-bind(sideBarWidth);
    width: calc(100% - v-bind(sideBarWidth));
  }
}
</style>
<style>
/* .usersManagement .el-switch.is-checked .el-switch__core .el-switch__action{
        margin-left: calc(-1px - var(--el-switch-button-size) - 0.00521rem);
  } */
.usersManagement .el-header {
  padding: 0 10px;
}

.usersManagement .el-table {
  height: 59vh;
  overflow: auto;
}
.usersManagement .el-date-editor .el-range-separator {
  width: 10%;
}
.usersManagement .el-tree-node > .el-tree-node__children {
  overflow: visible;
}
.usersManagement .el-tree > .el-tree-node > .el-tree-node__children {
  overflow-x: 'auto';
}
.usersManagement .el-tree {
  background-color: #fff !important;
}
.usersManagement .el-aside {
  background-color: #fff !important;
}
.usersManagement
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .el-tree-node__label {
  background-color: transparent !important;
  color: #409eff;
}
.usersManagement
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: transparent !important;
}
.usersManagement
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .el-tree-node__label:hover {
  background-color: transparent !important;
}
</style>