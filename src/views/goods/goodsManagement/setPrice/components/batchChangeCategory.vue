<template>
	<el-dialog title="批量修改商品品类" v-model="ifShow" :width="640" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<el-dialog :width="800" title="修改品类结果" v-model="innerVisible" append-to-body @close="innerCloseEvent">
      <div class="innerContentView">
        <div>已成功更改品类的商品共<span class="blue">{{resultInfo.successNum}}</span>个，失败<span class="red">{{resultInfo.failNum}}</span>个</div>
        <div>失败原因：更改的商品品类与新品类的常用规格值不匹配，需在<span class="red">商品详情</span>内【更改品类】</div>
        <div>失败商品列表：</div>
        <el-table :data="resultInfo.goodsList" style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#000','text-align': 'center'}" :cell-style="{'text-align': 'center'}">
          <el-table-column prop="id" label="商品编码"></el-table-column>
          <el-table-column prop="nameCn" label="商品中文名称"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <div class="contentView">
			<el-form  :model="form" :rules="rules" ref="formRef">
        <el-form-item label="商品品类:" prop="categoryId">
					<el-cascader v-model="form.categoryId" :options="categoryList" :props="categoryProps" style="width: 200px" clearable></el-cascader>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { onMounted, reactive, ref, toRefs } from 'vue'
	import Hooks from '../../js/hooks.js'
	import { batchEditCategory } from '@/api/goods/quotedPrice.js'
	import { ElMessage, ElMessageBox } from 'element-plus'
	export default {
		props: {
			goodsIds: {
				type: Array,
				default: []
			}
		},
		emits: ['closeEvent'],
		setup(props, context) {
			let state = reactive({
				ifShow: true,
        innerVisible: false,
				categoryList: [],
        categoryProps: {
          value: 'id',
          label: 'name',
          children: 'child',
          emitPath: false
        },
				form: {
					goodsIds: props.goodsIds,
          categoryId: null
				},
        resultInfo: {
          failNum: null,
          successNum: null,
          goodsList: []
        },
        loading: false
			})
			let rules = {
				categoryId: { required: true, message: '请选择备注类型', trigger: 'change' }
			}
			let formRef = ref(null)
			let hooks = Hooks(state)

			// 关闭弹框
			let closeEvent = (refresh = false) => {
        state.ifShow = false
				setTimeout(() => {
					context.emit('closeEvent', refresh)
				}, 500)
			}

      // 关闭内层弹框
      let innerCloseEvent = () => {
        closeEvent(true)
      }

			// 取消回调
			let cancelEvent = () => {
				closeEvent()
			}

      // 确认回调
			let affirmEvent = () => {
        ElMessageBox.confirm('修改品类将会影响部分人员对该商品的查看权限，你还要继续吗？', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
            formRef.value.validate((valid) => {
              if (valid) {
                state.loading = true
                batchEditCategory(state.form).then(res => {
                  state.loading = false
                  if (res.code == 200) {
                    if (res.data.failNum == 0) { // 全部成功直接关闭
                      ElMessage.success({ message: '操作成功！', type: 'success' });
                      closeEvent(true)
                    } else {
                      state.resultInfo = res.data
                      state.innerVisible = true
                    }
                  } else {
                    ElMessage.error(res.message)
                  }
                }).catch(err => {
                  state.loading = false
             
                })
              } else {
                ElMessage.error('信息填写错误，提交失败')
              }
            })
					})
					.catch(() => {
					})
			}

			let changeEvent = () => {
				formRef.value.clearValidate('remarkTypeId')
			}

			onMounted(() => {
        hooks.getCategoryEvent()
			})

			return {
				...toRefs(state),
				rules,
				formRef,
				closeEvent,
				cancelEvent,
				affirmEvent,
				changeEvent,
        innerCloseEvent,
				...hooks
			}
		}
	}
</script>

<style lang="scss" scoped>
:deep(.el-radio) {
	margin-right: 16px;
}
.blue{
  color: #1890FF;
}
.red{
  color: #FF4D4F;
}
.contentView{
  height: 200px;
}
.innerContentView{
  height: 300px;
  overflow-y: scroll;
  div:nth-of-type(1){
    margin-bottom: 20px;
  }
  div:nth-of-type(2){
    margin-bottom: 20px;
  }
  div:nth-of-type(3){
    margin-bottom: 20px;
  }
}
</style>