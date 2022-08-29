<template>
  <el-dialog title="SPU备注" v-model="dialogVisible" width="35%" @close="close" :close-on-click-modal="false" :close-on-press-escape="false">
    <div class="remarks">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="备注类型：" class="setLineHeight">
          <el-radio-group v-model="form.type" class="radioBox" @change="radioChange">
            <el-radio class="radioItem" :label="item.id" v-for="(item, index) in remarkNames" :key="index">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注内容：" prop="content">
          <el-input style="width: 520px" type="textarea" :rows="3" :placeholder="required ? '请输入起订量' : '请输入内容'" maxlength="100" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="dialogHandOk" :loading="loading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  reactive,
  toRefs,
  defineProps,
  onMounted,
  defineEmits,
  watch,
  ref
} from 'vue'
import { ElMessage } from 'element-plus'
import { getRemarkTypes, batchRemark, batchEditRemark } from '@/api/order/orderManagement.js'
import { setReamrkList } from '../hooks/hooks.js'
const props = defineProps({
  query: Object,
	status:{
			type:String,
			default:'0' // 0普通商品 1定制商品
		},
})
const emit = defineEmits(['cancel', 'ok'])
const data = reactive({
  remarkNames: [],
  form: {
    type: null,
    content: ''
  },
  loading: false,
  dialogVisible: true,
  required: false,
  rules: {
    content: [{ required: false, message: '请输入起订量', trigger: 'blur' }]
  }
})
let formRef = ref(null)

watch(() => data.form.type, (newVal, oldVal) => {
  data.remarkNames.some(item => {
    if (newVal == item.id) {
      if (item.name == '起订量') {
        data.required = true
        data.rules.content[0].required = true
      } else {
        data.required = false
        data.rules.content[0].required = false
      }
      return true
    }
  })
})


function dialogHandOk() {
  const { type, content } = data.form
  const { selectedList } = props.query
  data.form.content = data.form.content.trim()
  let arr = []
  selectedList.forEach(item => {
    if (!arr.includes(item.goodsId)) {
      arr.push(item.goodsId)
    }
  })
  formRef.value.validate((valid) => {
    if (valid) {
      data.loading = true
      const {editItem} = props.query

      if (!editItem) { // 新增
        let params = {
          remarkTypeId: type,
          remark: content,
          goodsIds: arr,
					customization:props.status - 0
        }
        batchRemark(params).then(res => {
          data.loading = false
          if (res.code == 200) {
            cancel()
            emit('ok')
          }
        }).catch(err => {
          data.loading = false
        })
      } else {
        let params = {
          id: editItem.id,
          remarkTypeId: type,
          remark: content,
        }
        batchEditRemark(params).then(res => {
          data.loading = false
          if (res.code == 200) {
            cancel()
            emit('ok')
          }
        }).catch(err => {
          data.loading = false
        })
      }

    } else {
      ElMessage.error('信息填写错误，提交失败')
    }
  })
}

function radioChange() {
  formRef.value.clearValidate()
}

function getRemark(callback) {
  getRemarkTypes({ useScope: '3' }).then(res => {
    if (res.code == 200) {
      data.remarkNames = res.data
      res.data.some(item => {
        if (item.name == '无货源') {
          data.form.type = item.id
          return true
        }
      })
      callback()
    }
  })
} // 获取备注

function close() {
  cancel()
}

function cancel() {
  data.dialogVisible = false
  setTimeout(() => {
    emit('cancel')
  }, 500)
}

onMounted(() => {
  getRemark(()=>{
		const {editItem} = props.query
		if(editItem){
			const {remarkTypeId,remark} = editItem
			console.log(props.query)
			if(data.remarkNames.some(v=>v.id === remarkTypeId)){
				data.form.type = remarkTypeId
			}
			data.form.content = remark
		}
	})
})

const { remarkNames, form, loading, dialogVisible, rules, required } = toRefs(data)

</script>

<style scoped></style>
