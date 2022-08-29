<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 王新国
 * @Date: 2021-07-09 09:17:31
 * @LastEditors: 王新国
 * @LastEditTime: 2021-07-13 18:21:26
-->
<template>
  <div class="addUserContainer">
    <div>
      <el-form
        :model="userData"
        :rules="rules"
        ref="formRef"
        class="demo-ruleForm demo-form-inline"
        :label-width="80"
        
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名:" prop="userName">
              <el-input
                v-model="userData.userName"
                :maxlength="nameLength"
                @blur="checkUserNameFn"
                autocomplete="new-password"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话:" prop="phoneNumber">
              <el-input
                v-model="userData.phoneNumber"
                :maxlength="phoneNumberLength"
                @blur="checkPhoneFn"
                autocomplete="new-password"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名:" prop="fullName">
              <el-input
                v-model="userData.fullName"
                :maxlength="nameLength"
                autocomplete="new-password"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱:" prop="email">
              <el-input
                v-model="userData.email"
                :maxlength="emailLength"
                @blur="checkEmailFn"
                autocomplete="new-password"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="部门:">
              <ElSelectTree
                :data="deptDataArr"
                slPlaceholder="请选择部门"
                :treeProps="{
                  value: 'deptId',
                  label: 'deptName',
                  children: 'children'
                }"
                :filterable="true"
                @ok="checkedDept"
                :defaultCheckedKeys="userData.deptIds"
                :defaultExpandAll="defaultExpandAll"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别:">
              <el-radio-group v-model="userData.gender">
                <el-radio label="0">男</el-radio>
                <el-radio label="1">女</el-radio>
                <!-- <el-radio label="2">未知</el-radio> -->
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位:">
              <el-select
                v-model="userData.postId"
                placeholder="请选择岗位"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in postList"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                >
                  <span>{{ item.postName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号:" prop="workNum">
              <el-input
                v-model="userData.workNum"
                autocomplete="new-password"
                placeholder="请以V开头加四位数字填写"
                @blur="checkWorkNumFn"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态:">
              <el-radio-group v-model="userData.status">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色:" class="roleContainer">
              <el-select
                v-model="userData.roleIds"
                placeholder="请选择角色"
                :multiple="multiple"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="item in roleData"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                >
                  <span>
                    {{ item.roleName }}
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="特殊权限:" class="roleContainer">
              <el-radio-group v-model="userData.specialFlag">
                <el-radio :label="0">权限正常</el-radio>
                <el-radio :label="1">权限特殊</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="备注:" class="messageContainer">
              <el-input
                type="textarea"
                maxlength="140"
                show-word-limit
                v-model="userData.remark"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs, ref, toRaw, getCurrentInstance, watch } from 'vue'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import { toTree, deepCopy, print } from '@/utils/tool.js'
import {
  addUsersInfo,
  checkRoleInfo,
  checkPostInfo,
  checkUserName,
  checkWorkNum,
  checkAllRole,
  checkAllPost,
  checkEmail,
  checkPhone
} from '@/api/user.js'
import { ElMessage } from 'element-plus'
const userDefaultData = {
  userName: '', //用户名
  phoneNumber: '', //手机号码
  fullName: '', //姓名
  email: '', //邮箱
  deptId: '', //部门Id
  postId: '', //岗位Id
  gender: '0', //用户性别（0男 1女 2未知）
  status: '1', //帐号状态（0正常 1停用）
  roleIds: '', //角色Id
  remark: '', //备注
  reUserName: false, //用户名重复
  workNum: '', //新增工号
  specialFlag:0 //权限特殊标识  0正常 1特殊 空为全部
}
export default {
  components: { ElSelectTree },
  props: {
    deptData: {
      type: Array,
      default: []
    },
    userId: {
      type: Number,
      default: 0
    },
    waitChangeData: {
      type: Object,
      default: {}
    }
  },
  setup(props, context) {
    const state = reactive({
      defaultExpandAll: true,
      multiple: true,
      dialogVisible: false, //弹框
      ruleForm: {
        roleId: '',
        roleName: '',
        dataScope: '',
        status: '',
        remark: '',
        createBy: '',
        createTime: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
        ],
        fullName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { min: 9, max: 30, message: '长度在 9 到 30 个字符', trigger: 'blur' }
        ],
        workNum: [
          { required: true, message: '请输入工号', trigger: 'blur' },
          {
            pattern: /^V[0-9]{4}$/,
            message: '请以大写V开头加上四位数字的格式填写'
          }
        ]
      },
      deptDataArr: [], //部门信息list
      userData: deepCopy(userDefaultData),
      roleData: [], //角色list
      postList: [], //岗位list
      phoneNumberLength: 11,
      nameLength: 10,
      emailLength: 30,
      deptIdStatus: false
    })
    // ***************************************************************************
    if (props.userId) {
      // 修改用户信息
      state.userData = props.waitChangeData
      state.userData.reUserName = false
      state.userData.status = state.userData.status ? '0' : '1'
      state.userData.deptIds = []
      setTimeout(() => {
        state.userData.deptIds.push(state.userData.deptId)
      }, 30)
    } else {
      state.userData = deepCopy(userDefaultData)
    }

    // 获取父组件传递的部门信息，并将部门信息转为下拉选择子组件需要的数据
    // let deptTempData = []
    // props.deptData.forEach(v=>{
    //     v.id = v.deptId
    //     v.title = v.deptName
    //     deptTempData.push(v)
    // })
    // state.deptDataArr = toTree(deptTempData)
    state.deptDataArr = props.deptData

    // 角色信息列表
    checkAllRole()
      .then(res => {
        state.roleData = [...res.data]
        if (state.roleData.length > 0) {
          props.waitChangeData.roleListInfo?.forEach(v => {
            //角色列表内无当前用户的角色信息，将当前角色的信息push进列表
            if (
              state.roleData.filter(item => item.roleId == v.roleId).length == 0
            )
              state.roleData.push(v)
          })
        } else {
          state.roleData = props.waitChangeData.roleListInfo
        }
      })

    // 查询岗位信息集合
    checkAllPost()
      .then(res => {
        state.postList = res.data
      })
    // 获取部门选择信息
    const checkedDept = param => {
      state.deptIdStatus = state.userData.deptId != param
      state.userData.deptId = param
    }
    // ***************************************************************************
    // vue3 监听方法 监听弹框内容变化 发送给父组件
    watch(state.userData, (count, prevCount) =>
      context.emit('modalUserInfo', state.userData, state.deptIdStatus)
    )
    function errorSatus() {
      state.userData.errorSatus = true
      setTimeout(() => {
        state.userData.errorSatus = false
      }, 1000)
    }
    // 判断用户名是否重复
    async function checkUserNameFn() {
      if (state.userData.userName)
        await checkUserName({
          userName: state.userData.userName,
          userId: props.userId || ''
        })
          .then(res => {
            if (!res.data) {
              state.userData.reUserName = true
              errorSatus()
              ElMessage.error('用户名不能重复~~~')
            } else {
              state.userData.reUserName = false
            }
          })
          .catch(res => {
            if (res.code == 100009) {
              errorSatus()
              state.userData.reUserName = true
            }
          })
    }

    //判断手机号是否重复
    async function checkPhoneFn() {
      if (state.userData.phoneNumber)
        await checkPhone({
          userId: props.userId || '',
          phoneNumber: state.userData.phoneNumber
        })
          .then(res => {
            if (!res.data) {
              errorSatus()
              state.userData.reUserPhone = true
              ElMessage.error('手机号不能重复~~~')
            } else {
              state.userData.reUserPhone = false
            }
          })
          .catch(res => {
            if (res.code == 100028) {
              errorSatus()
              state.userData.reUserPhone = true
            }
          })
    }
    //判断工号是否重复
    async function checkWorkNumFn() {
      if (state.userData.workNum)
        await checkWorkNum({
          workNum: state.userData.workNum,
          userId: props.userId || ''
        })
          .then(res => {
            if (!res.data) {
              errorSatus()
              state.userData.reUserWorkNum = true
              ElMessage.error('工号不能重复~~~')
            } else {
              state.userData.reUserWorkNum = false
            }
          })
          .catch(err => {
            errorSatus()
            state.userData.reUserWorkNum = true
          })
    }

    //判断邮箱是否重复
    async function checkEmailFn() {
      if (state.userData.email)
        await checkEmail({
          userId: props.userId || '',
          email: state.userData.email
        })
          .then(res => {
            if (!res.data) {
              errorSatus()
              state.userData.reUserEmail = true
              ElMessage.error('邮箱不能重复~~~')
            } else {
              state.userData.reUserEmail = false
            }
          })
          .catch(res => {
            if (res.code == 100029) {
              errorSatus()
              state.userData.reUserEmail = true
            }
          })
    }

    return {
      ...toRefs(state),
      checkedDept, //获取部门选择信息
      checkUserNameFn, //判断用户名是否重复
      checkPhoneFn, //判断手机号是否重复
      checkEmailFn, //判断邮箱是否重复
      checkWorkNumFn //判断工号是否重复
    }
  }
  // vue2.0+ 监听方法，可用(但vue3提供了新方法)
  // watch: {
  //     userData: {
  //         handler(newVal) {
  //             console.log('=======',newVal)
  //         },
  //         immediate: false,
  //         deep: true,
  //     },
  // },
}
</script>
<style lang="scss" scoped>
.addUserContainer {
  display: inline-block;
  padding-top: 20px;
}
:deep(.el-radio) {
  margin-right: 15px;
}
</style>
