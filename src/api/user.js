import request from '@/api/request.js'

const userApi = {
    login: '/users/v1/login', //登录
    loginOut: '/users/v1/loginOut', //登出
    getOrganization: '/users/v1/dept/list', //查询公司组织架构（公司部门的树状数据）
    checkAllUsers: 'users/v1/user/list', //查询所有用户
    getMenus: '/users/v1/menu/list', //查询所有菜单
    addMenus: '/users/v1/menu/inMenu', //新增菜单
    updateMemus: '/users/v1/menu/upMenu', //修改菜单
    searchMenuList: '/users/v1/menu/listTree', //查询所有菜单列表(tree)
    deleteMenu: '/users/v1/menu/dmByIds', //删除菜单
    setUsersInfo: 'users/v1/user/upUser', //修改保存用户信息
    deletUsers: 'users/v1/user/deByIds', //批量删除用户信息
    addUsersInfo: 'users/v1/user/inUser', //新增保存用户信息
    checkRoleInfo: 'users/v1/role/list', //查询角色列表信息
    checkPostInfo: 'users/v1/post/list', //查询岗位信息集合
    updateStationStatus:'/users/v1/post/upPostStatus',//修改岗位状态
    updateDepartmentStatus:'/users/v1/dept/upDeptStatus',//修改部门状态
    checkUserName: 'users/v1/user/check', //校验用户名的唯一性
    getDepartment: '/users/v1/dept/list', //查询部门信息列表
    deleteRole: 'users/v1/role/drByIds', //批量删除角色信息
    addDepartment: '/users/v1/dept/inDept', //新增部门信息
    updataDepartment: '/users/v1/dept/upDept', //修改部门信息
    deleteDepartment: '/users/v1/dept/ddByIds', //删除部门
    getDepartmentList: '/users/v1/dept/listTree', //查询部门列表(tree)
    getManagerBy:'users/v1/dept/queryUserByDeptId',//查询部门负责人列表
    getStation: '/users/v1/post/list', //查询岗位信息
    updateStation: '/users/v1/post/upPost', //修改岗位信息
    addStation: '/users/v1/post/inPost', //新增岗位信息
    deleteStaion: '/users/v1/post/dpByIds', //删除岗位信息
    resetPwd: 'users/v1/user/resetPwd', //重置用户密码
    searchStationLog: 'users/v1/post/all', //查询操作日志岗位信息
    getOperationLog: 'logs/v1/sysLog/list', //查询日志列表
    checkAllRole: 'users/v1/role/all', //查询所有角色列表
    checkAllPost: 'users/v1/post/all', //查询所有岗位列表
    addRole: 'users/v1/role/inRole', //新增角色
    changeRole: 'users/v1/role/upRole', //修改角色
    checkStation:'users/v1/post/checkIsDelete',//岗位删除校验
    checkDepartment:'/users/v1/dept/checkIsDelete',//删除部门的校验
    checkDeptStuts:'/users/v1/dept/closeCheck',//部门状态关闭校验
    checkPhone:'users/v1/user/checkPhone',//校验手机号
    checkWorkNum:'users/v1/user/checkWorkNum',//校验工号是否重复
    savePerson:'users/v1/user/savePerson',//用户保存资料
    queryUserMessage:'users/v1/user/queryUserMessage',//查询用户资料
    updateEmail:'users/v1/user/updateEmail',//修改用户邮箱
    updatePwd:'users/v1/user/updatePwd',//修改用户密码
    updateHead:'users/v1/user/updateHead',// 修改头像
    checkEmail:'users/v1/user/checkEmail',// 校验邮箱
    checkIsDelete:'users/v1/role/checkIsDelete',//删除角色校验
    sendEmail:'users/v1/user/sendEmail',//发送邮箱验证码
    upStatusUser:'users/v1/user/upStatusUser',//修改用户状态
    selectDataScopeUrl: 'users/v1/role/dataScope',    // 查询角色已设置权限
    updateAuth:'goods/v1/goods/auth/updateAuth'
}

export function updateAuth(data) {
    return request({
        url: userApi.updateAuth,
        method: 'post',
        data: data
    })
}
export function login(data) {
    return request({
        url: userApi.login,
        method: 'post',
        data: data
    })
}

export function loginOut(data) {
    return request({
        url: userApi.loginOut,
        method: 'post',
        data: data
    })
}

// 修改用户状态 Author: 王新国
export function upStatusUser(data) {
    return request({
        url: userApi.upStatusUser,
        method: 'post',
        data: data
    })
}

// 校验邮箱 Author: 王新国
export function checkEmail(data) {
    return request({
        url: userApi.checkEmail,
        method: 'post',
        data: data
    })
}
 
// 查询公司组织架构（公司部门的树状数据）Author: 王新国
export function getOrganizationTree(data) {
    return request({
        url: userApi.getOrganization,
        method: 'post',
        data: data
    })
}
// 新增菜单Author: 张志芳
export function addMenus(data) {
    return request({
        url: userApi.addMenus,
        method: 'post',
        data: data
    })
}
// 查询所有菜单Author: 张志芳
export function getMenus(data) {
    return request({
        url: userApi.getMenus,
        method: 'post',
        data: data
    })
}
// 查询所有菜单列表Author: 张志芳
export function searchMenuList(data) {
    return request({
        url: userApi.searchMenuList,
        method: 'post',
        data: data
    })
}
// 修改菜单Author: 张志芳
export function updateMemus(data) {
    return request({
        url: userApi.updateMemus,
        method: 'post',
        data: data
    })
}
// 删除菜单Author: 张志芳
export function deleteMenu(data) {
    return request({
        url: userApi.deleteMenu,
        method: 'post',
        data: data
    })
}

// 查询部门信息列表Author: 张志芳
export function getDepartment(data) {
    return request({
        url: userApi.getDepartment,
        method: 'post',
        data: data
    })
}

// 新增部门 Author: 张志芳
export function addDepartment(data) {
    return request({
        url: userApi.addDepartment,
        method: 'post',
        data: data
    })
}

// 修改部门 Author: 张志芳
export function updataDepartment(data) {
    return request({
        url: userApi.updataDepartment,
        method: 'post',
        data: data
    })
}

// 删除部门 Author: 张志芳
export function deleteDepartment(data) {
    return request({
        url: userApi.deleteDepartment,
        method: 'post',
        data: data
    })
}


// 查询部门列表(tree) Author: 张志芳
export function getDepartmentList(data) {
    return request({
        url: userApi.getDepartmentList,
        method: 'post',
        data: data
    })
}
// 查询部门负责人列表Author: 张志芳
export function getManagerBy(data) {
    return request({
        url: userApi.getManagerBy,
        method: 'post',
        data: data
    })
}

// 查询岗位列表 Author: 张志芳
export function getStation(data) {
    return request({
        url: userApi.getStation,
        method: 'post',
        data: data
    })
}

// 修改岗位信息 Author: 张志芳
export function addStation(data) {
    return request({
        url: userApi.addStation,
        method: 'post',
        data: data
    })
}
// 新增岗位信息 Author: 张志芳
export function updateStation(data) {
    return request({
        url: userApi.updateStation,
        method: 'post',
        data: data
    })
}
// 删除岗位信息 Author: 张志芳
export function deleteStaion(data) {
    return request({
        url: userApi.deleteStaion,
        method: 'post',
        data: data
    })
}
// 查询操作日志岗位信息 Author: 张志芳
export function searchStationLog(data) {
    return request({
        url: userApi.searchStationLog,
        method: 'post',
        data: data
    })
}
// 查询日志列表 Author: 张志芳
export function getOperationLog(data) {
    return request({
        url: userApi.getOperationLog,
        method: 'post',
        data: data
    })
}
// 岗位删除校验 Author: 张志芳
export function checkStation(data) {
    return request({
        url: userApi.checkStation,
        method: 'post',
        data: data
    })
}
// 修改岗位状态 Author: 张志芳
export function updateStationStatus(data) {
    return request({
        url: userApi.updateStationStatus,
        method: 'post',
        data: data
    })
}
// 修改部门状态 Author: 张志芳
export function updateDepartmentStatus(data) {
    return request({
        url: userApi.updateDepartmentStatus,
        method: 'post',
        data: data
    })
}
// 部门删除校验 Author: 张志芳
export function checkDepartment(data) {
    return request({
        url: userApi.checkDepartment,
        method: 'post',
        data: data
    })
}
// 部门状态关闭校验 Author: 张志芳
export function checkDeptStuts(data) {
  return request({
      url: userApi.checkDeptStuts,
      method: 'post',
      data: data
  })
}

// 用户管理页面的工号校验重复 Author: 张志芳
export function checkWorkNum(data) {
    return request({
        url: userApi.checkWorkNum,
        method: 'post',
        data: data
    })
}

// 查询所有用户 Author: 王新国
export function checkAllUsersList(data) {
    return request({
        url: userApi.checkAllUsers,
        method: 'post',
        data: data
    })
}

// 修改保存用户信息 Author: 王新国
export function setUsersInfo(data) {
    return request({
        url: userApi.setUsersInfo,
        method: 'post',
        data: data
    })
}

// 批量删除用户信息 Author: 王新国
export function deletUsers(data) {
    return request({
        url: userApi.deletUsers,
        method: 'post',
        data: data
    })
}

// 新增保存用户信息 Author: 王新国
export function addUsersInfo(data) {
    return request({
        url: userApi.addUsersInfo,
        method: 'post',
        data: data
    })
}

// 查询角色列表信息 Author: 王新国
export function checkRoleInfo(data) {
    return request({
        url: userApi.checkRoleInfo,
        method: 'post',
        data: data
    })
}

// 查询岗位信息集合 Author: 王新国
export function checkPostInfo(data) {
    return request({
        url: userApi.checkPostInfo,
        method: 'post',
        data: data
    })
}

// 校验用户名的唯一性 Author: 王新国
export function checkUserName(data) {
    return request({
        url: userApi.checkUserName,
        method: 'post',
        data: data
    })
}

// 批量删除角色信息 Author: 王新国
export function deleteRole(data) {
    return request({
        url: userApi.deleteRole,
        method: 'post',
        data: data
    })
}

// 重置用户密码 Author: 王新国
export function resetPwd(data) {
    return request({
        url: userApi.resetPwd,
        method: 'post',
        data: data
    })
}

// 查询所有角色信息 Author: 王新国
export function checkAllRole(data) {
    return request({
        url: userApi.checkAllRole,
        method: 'post',
        data: data
    })
}

// 查询所有岗位信息 Author: 王新国
export function checkAllPost(data) {
    return request({
        url: userApi.checkAllPost,
        method: 'post',
        data: data
    })
}

// 新增角色 Author: 王新国
export function addRole(data) {
    return request({
        url: userApi.addRole,
        method: 'post',
        data: data
    })
}

// 删除角色校验 Author: 王新国
export function checkIsDelete(data) {
    return request({
        url: userApi.checkIsDelete,
        method: 'post',
        data: data
    })
}

// 修改角色 Author: 王新国
export function changeRole(data) {
    return request({
        url: userApi.changeRole,
        method: 'post',
        data: data
    })
}

// 用户资料 Author: 江澎涛
export function checkPhone(data) {
    return request({
        url: userApi.checkPhone,
        method: 'post',
        data: data
    })
}

// 用户资料 Author: 江澎涛
export function savePerson(data) {
    return request({
        url: userApi.savePerson,
        method: 'post',
        data: data
    })
}

// 用户资料 Author: 江澎涛
export function queryUserMessage(data) {
    return request({
        url: userApi.queryUserMessage,
        method: 'post',
        data: data
    })
}

// 用户资料 Author: 江澎涛
export function updateEmail(data) {
    return request({
        url: userApi.updateEmail,
        method: 'post',
        data: data
    })
}

// 用户资料 Author: 江澎涛
export function updatePwd(data) {
    return request({
        url: userApi.updatePwd,
        method: 'post',
        data: data
    })
}

// 用户资料 Author: 江澎涛
export function updateHead(data) {
    return request({
        url: userApi.updateHead,
        method: 'post',
        data: data
    })
}

// 用户资料 Author: 江澎涛
export function sendEmail(data) {
    return request({
        url: userApi.sendEmail,
        method: 'post',
        data: data
    })
}
// 查询角色已设置权限
export function selectDataScope(data) {
    return request({
        url: userApi.selectDataScopeUrl,
        method: 'post',
        data: data
    })
}
