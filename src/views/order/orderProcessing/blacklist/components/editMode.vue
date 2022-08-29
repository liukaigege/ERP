<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="title"
      width="640px"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div>
        <el-form
          :model="formInline"
          class="demo-form-inline"
          ref="formRef"
          :rules="rules"
        >
          <el-form-item label="类型:" v-if="!isAdd">
            <el-radio-group v-model="formInline.type" @change="changeOption">
              <el-radio :label="2">邮箱</el-radio>
              <el-radio :label="3">联系电话</el-radio>
              <el-radio :label="4">收货地址</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型:" v-if="isAdd">
            <el-radio-group v-model="formInline.type">
              <el-select
                v-model="formInline.type"
                
                style="width: 140px"
                @change="changeOption"
              >
                <el-option label="邮箱" :value="2"></el-option>
                <el-option label="联系电话" :value="3"></el-option>
                <el-option label="收货地址" :value="4"></el-option>
              </el-select>
            </el-radio-group>
          </el-form-item>
          <div id="content-box">
            <div
              v-for="(item, index) in formInline.contentArr"
              :key="index"
              class="content-list"
            >
              <el-form-item
                :prop="'contentArr.' + index + '.content'"
                label="内容:"
                :rules="rules.content"
              >
                <el-input
                  v-model="item.content"
                  
                  clearable
                  style="width: 260px"
                  :maxlength="maxlength"
                ></el-input>
              </el-form-item>
              <div class="add-btn">
                <i
                  class="el-icon-delete"
                  style="color: #ff0000"
                  v-if="formInline.contentArr.length > 1"
                  @click="deleteBtn(index)"
                ></i>
              </div>
            </div>
            <el-button
              type="primary"
              v-if="isAdd != 1"
              
              @click="addBtn"
              ><i class="el-icon-plus"></i>增加</el-button
            >
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog" >取 消</el-button>
          <el-button
            type="primary"
            
            @click="handleClose"
            :loading="loading"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineComponent, onMounted, reactive, toRefs, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addOrUpdate } from '../composables/api.js'
import { deepCopy } from '@/utils/tool'
const porps = defineProps({
  selectRow: {
    type: Object,
    default: {}
  },
  isAdd: {
    type: Number
  }
})
const formRef = ref(null)
const emit = defineEmits(['close'])
const state = reactive({
  dialogVisible: false,
  formInline: {
    type: 2,
    contentArr: [{ content: '', show: true }]
  },
  title: '',
  maxlength: 100,
  loading: false
})
const rules = reactive({
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur'
    }
  ]
})
onMounted(() => {
  state.title = '新增黑名单信息'
  state.dialogVisible = true
  if (porps.isAdd == 1) {
    state.title = '编辑黑名单信息'
    state.formInline.contentArr[0].content = porps.selectRow.content
    state.formInline.type = porps.selectRow.type
  }
})
const handleClose = () => {
  formRef.value.validate(valid => {
    state.loading = true
    if (valid) {
      const params = []
      if (porps.isAdd == 1) {
        params.push({
          content: state.formInline.contentArr[0].content,
          type: state.formInline.type,
          isAdd: porps.isAdd,
          id: porps.selectRow.id
        })
      } else {
        state.formInline.contentArr.forEach(element => {
          const arr = {
            isAdd: porps.isAdd,
            content: element.content,
            type: state.formInline.type
          }
          params.push(arr)
        })
      }
      addOrUpdateFun(params)
      //
    } else {
      state.loading = false
    }
  })
}
function addOrUpdateFun(params) {
  addOrUpdate({ blacklistDTOList: params }).then(res => {
    if (res.code == 200) {
      if (res.data.data != 0) {
        let tip = ''
        if (state.formInline.contentArr.length != 1 || res.data.data != 1) {
          tip = `已帮你过滤${res.data.data}条重复上传信息！`
        } else {
          tip = `该条内容已存在黑名单中，请勿重复提交！`
        }
        ElMessage.warning(tip)
      } else {
        ElMessage.success('操作成功！')
      }
    } else {
      ElMessage.error(res.message)
    }
    state.loading = false
    if (state.formInline.contentArr.length != 1 || res.data.data != 1) {
      emit('close')
    }
  })
}
function addBtn() {
  if (state.formInline.contentArr.length < 50) {
    state.formInline.contentArr.push({ content: '', show: false })
  } else {
    ElMessage.error('最大只能添加50条！')
  }
}
function deleteBtn(index) {
  state.formInline.contentArr.splice(index, 1)
}
function changeOption() {
  switch (state.formInline.type) {
    case 2:
      state.maxlength = 100
      break
    case 3:
      state.maxlength = 60
      break
    case 4:
      state.maxlength = 300
      break
  }
  state.formInline.contentArr = [{ content: '', show: true }]
}
const closeDialog = () => {
  emit('close')
}
const { dialogVisible, formInline, title, maxlength, loading } = toRefs(state)
</script>

<style lang="scss" scoped>
.add-btn {
  cursor: pointer;
  color: #1880e7;
  width: 40px;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.content-list {
  display: flex;
}
#content-box {
  max-height: 400px;
  overflow: auto;
}
</style>