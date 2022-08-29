<template>
  <div>
    <div class="heard">
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="状态:">
          <el-select
            v-model="form.state"
            
            clearable
            style="width: 140px"
          >
            <el-option label="已开启" :value="1"></el-option>
            <el-option label="未开启" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select
            v-model="form.type"
            
            clearable
            style="width: 140px"
          >
            <el-option label="全部" :value="5"></el-option>
            <el-option label="邮箱" :value="2"></el-option>
            <el-option label="联系电话" :value="3"></el-option>
            <el-option label="收货地址" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="搜索内容:">
          <el-input
            class="keyword"
            v-model="form.content"
            maxlength="500"
            clearable
            
            style="width: 318px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" 
            >查询</el-button
          >
          <el-button type="primary" @click="resetForm" 
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="btnList">
      <div>
        <el-popconfirm title="是否批量开启？" @confirm="batchSwith(1)">
          <template #reference>
            <el-button
              type="primary"
              
              :disabled="!selectIdArr.length"
              >批量开启
            </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm title="是否批量关闭？" @confirm="batchSwith(2)">
          <template #reference>
            <el-button
              type="primary"
              :disabled="!selectIdArr.length"
              
              >批量关闭
            </el-button>
          </template>
        </el-popconfirm>
        <el-popconfirm title="是否批量删除黑名单？" @confirm="batchDelete(row)">
          <template #reference>
            <el-button
              type="primary"
              
              :disabled="!selectIdArr.length"
              >批量删除
            </el-button>
          </template>
        </el-popconfirm>
      </div>
      <div>
        <el-button type="primary" @click="addList" 
          >新增标签</el-button
        >
      </div>
    </div>
    <div class="table">
      <el-table
        :data="data"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="content" label="内容" align="center" />
        <el-table-column label="类型" align="center">
          <template #default="{ row }">
            <p>{{ transformType(row.type) }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.state" @change="stateChange(row)" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="createUser" label="创建人" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row }">
            <el-button type="text" class="primaryBtn" @click="edit(row)"
              >编辑</el-button
            >
            <el-popconfirm
              title="是否删除该黑名单？"
              @confirm="deleteItem(row)"
            >
              <template #reference>
                <el-button type="text" class="deleteBtn" style="color: #fd4c60"
                  >删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ErpPage
      ref="erpPage"
      :count="selectCount"
      :total="totalCount"
      @updateData="updateData"
    />
    <EditMode
      :selectRow="selectRow"
      v-if="isshow"
      @close="dialogClose"
      :isAdd="isAdd"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import EditMode from './components/editMode.vue'
import ErpPage from '@/components/erpPage/index.vue'
import { listPage, addOrUpdate, deleteOrder } from './composables/api.js'
const state = reactive({
  form: {
    state: 1,
    type: 5,
    content: '',
    page: {
      pageNo: 1,
      pageSize: 10
    }
  },
  selectCount: 0,
  selectIdArr: [],
  totalCount: 0,
  isshow: false,
  selectId: '',
  data: [],
  isAdd: 0,
  selectRow: {}
})
function resetForm() {
  state.form.state = 1
  state.form.type = 5
  state.form.content = ''
  submitForm()
}
function submitForm() {
  listPage(state.form).then(res => {
    if (res.code == 200) {
      state.data = res.data.dataList
      state.data.forEach(item => {
        item.state = item.state == 2 ? false : true
      })
      state.totalCount = res.data.page.totalCount
    } else {
      ElMessage.error(res.message)
    }
  })
}
function deleteItem({ id }) {
  const params = {
    ids: [id]
  }
  deleteFun(params)
}
function deleteFun(params) {
  deleteOrder(params).then(res => {
    if (res.code == 200) {
      ElMessage.success('删除成功！')
    } else {
      ElMessage.error(res.message)
    }
    submitForm()
  })
}
function edit(val) {
  state.selectId = val.id
  state.isAdd = 1
  state.isshow = true
  state.selectRow = val
}
function transformType(val) {
  switch (val) {
    //   类型 1 买家姓名 2邮箱 3 联系电话 4收货地址
    case 1:
      return '买家姓名'
    case 2:
      return '邮箱'
    case 3:
      return '联系电话'
    case 4:
      return '收货地址'
  }
}
// 批量打开 批量关闭
function batchSwith(val) {
  if (!state.selectIdArr.length) {
    ElMessage.info('请先勾选！')
    return false
  }
  const params = []
  state.selectIdArr.forEach(element => {
    const item = {
      content: element.content,
      type: element.type,
      state: val,
      isAdd: 1,
      id: element.id
    }
    params.push(item)
  })
  addOrUpdateFun(params)
}
// 批量删除
function batchDelete() {
  if (!state.selectIdArr.length) {
    ElMessage.info('请先勾选！')
    return false
  }
  const params = {
    ids: []
  }
  state.selectIdArr.forEach(item => {
    params.ids.push(item.id)
  })
  deleteFun(params)
}
const handleSelectionChange = val => {
  state.selectCount = val.length
  state.selectIdArr = val
}
function updateData(v) {
  state.form.page = v
  submitForm()
}
function dialogClose() {
  state.isshow = false
  submitForm()
}
function addList() {
  state.isAdd = 0
  state.isshow = true
}
function stateChange(val) {
  const params = [
    {
      content: val.content,
      type: val.type,
      state: val.state ? 1 : 2,
      isAdd: 1,
      id: val.id
    }
  ]
  addOrUpdateFun(params)
}
function addOrUpdateFun(params) {
  addOrUpdate({ blacklistDTOList: params }).then(res => {
    if (res.code == 200) {
      ElMessage.success('操作成功！')
    } else {
      ElMessage.error(res.message)
    }
    submitForm()
  })
}
onMounted(() => {
  submitForm()
})
const {
  form,
  selectCount,
  totalCount,
  isshow,
  selectId,
  data,
  isAdd,
  selectRow,
  selectIdArr
} = toRefs(state)
</script>

<style lang="scss" scoped>
.heard {
  padding: 10px 30px 0 30px;
  background: #fff;
}
.table {
  padding: 24px 30px;
  background: #fff;
}
.btnList {
  margin: 24px 0 16px;
  display: flex;
  justify-content: space-between;
}
</style>