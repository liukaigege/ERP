<template>
	<el-form  :model="form" :rules="rules" ref="formRef" :label-width="110">
		<div class="pageView" v-if="$route.name !== 'goodsPublishDeatil'">
			<div class="title">参考商品</div>
			<div class="content">
        <el-form-item label="采集商品链接:" v-if="[0, 1].includes(form.mode)" style="margin-bottom: 0">
					<el-input v-model="form.collectionUrl" disabled></el-input>
				</el-form-item>
				<el-form-item label="参考商品链接:" style="margin-bottom: 0" :required="true" v-else>
					<div v-for="(item, index) in form.referenceUrls" :key="index" class="items">
						<el-input v-model="form.referenceUrls[index]" :maxlength="500" placeholder="请输入参考商品链接" clearable :disabled="!isEdit"></el-input>
						<el-button type="text" :class="index == 0 ? 'el-icon-plus' : 'el-icon-delete'" @click="clickEvent(index)" :disabled="form.referenceUrls.length >= 5 && index == 0 || !isEdit"></el-button>
					</div>
				</el-form-item>
			</div>
		</div>
		<div class="pageView mt-24">
			<div class="title">基本信息</div>
			<div class="content">
				<el-form-item label="商品标题:" class="goodsName">
					<div class="radioGroupBox">
            <el-radio-group v-model="tabPosition">
              <el-radio-button :label="0">英文</el-radio-button>
              <el-radio-button :label="1">中文</el-radio-button>
            </el-radio-group>
            <el-button type="text" v-if="isEdit" @click="translate()">{{tabPosition == 0 ? '翻译并填充中文' : '翻译并填充英文'}}</el-button>
          </div>
					<el-input v-model="form.nameCn" clearable :maxlength="200" style="width: 850px" placeholder="请输入商品标题" v-if="tabPosition" :disabled="!isEdit" />
					<el-input v-model="form.nameEn" clearable :maxlength="200" style="width: 850px" placeholder="请输入商品标题" v-else :disabled="!isEdit" />
				</el-form-item>
				<el-form-item label="商品品类:" prop="categoryId">
					<el-cascader v-model="form.categoryId" :options="categoryList" :props="categoryProps" :show-all-levels="false" @change="changeCategory" ref="cascaderRef" style="width: 300px" clearable :disabled="!isEdit || type == 'goodsList'"></el-cascader>
				</el-form-item>
				<el-form-item label="商品标签:">
          <el-select v-model="form.labels" multiple style="width: 300px" clearable :multiple-limit="20" :disabled="!isEdit || type == 'goodsList'">
						<el-option v-for="item in labelList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<div class="priceBox">
					<el-form-item :label="$route.name=='goodsPublishDeatil' ? '售价:' :'期望售价:'" style="margin-bottom: 0" prop="expectPrice">
						<NumberInput  v-model="form.expectPrice" :min="0" :max="999999.99" :precision="2" placeholder="请输入" :disabled="!isEdit">
							<template #append>USD</template>
						</NumberInput>
					</el-form-item>
					<el-form-item label="成本价:" style="margin: 0 0 0 150px">
						<NumberInput  v-model="form.costPrice" :min="0" :max="9999999.99" :precision="2" placeholder="请输入" :disabled="!isEdit || $route.name == 'goodsPublishDeatil'">
							<template #append>CNY</template>
						</NumberInput>
					</el-form-item>
          <el-form-item label="原价:" style="margin: 0 0 0 150px" v-show="$route.name == 'goodsPublishDeatil'">
						<NumberInput  v-model="form.originalPrice" :min="0" :max="999999.99" :precision="2" placeholder="请输入" :disabled="type == 'layList'">
							<template #append>USD</template>
						</NumberInput>
					</el-form-item>
				</div>
			</div>
		</div>
		<div class="pageView mt-24">
			<div class="title">图文描述</div>
			<div class="content">
				<el-form-item>
					<template #label>
						<span>简短描述:</span>
						<el-tooltip class="item" effect="dark" content="等同于亚马逊上传产品的Bullet Point, 在详情页购物车按钮下用简单几行阐述产品最大卖点/要点" placement="top">
							<i class="el-icon-info"></i>
						</el-tooltip>
					</template>
          <el-input v-model="form.brief" clearable :maxlength="180" placeholder="请输入" style="width: 845px" :disabled="!isEdit" />
				</el-form-item>
        <el-form-item label="图文描述:" style="margin-bottom: 0">
          <el-radio-group v-model="tabPosition2" @change="radioGroupChange">
						<el-radio-button :label="0">英文</el-radio-button>
						<el-radio-button :label="1">中文</el-radio-button>
					</el-radio-group>
          <div style="width: 1100px">
            <Editor :content="tabPosition2 ? form.descriptionCn : form.descriptionEn" :readonly="!isEdit" @editChange="editChange" ref="myEditor" />
          </div>
				</el-form-item>
			</div>
		</div>
	</el-form>
</template>
<script>
	import { nextTick, onMounted, reactive, ref, toRefs, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { ElMessage } from 'element-plus';
	import NumberInput from '@/components/erpNumberInput/index.vue'
  import Editor from '@/components/editor/index.vue'
  import { deepCopy } from '@/utils/tool'
  import Handle from './composables/handle'
  import Hooks from '@/views/goods/goodsManagement/js/hooks'
  import initEditorInfo from '@/components/editor/js/handle.js'
	export default {
		components: {
			NumberInput,
      Editor
		},
    props: {
      query: {
        type: Object,
        default: {}
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: 'goodsList'
      }
    },
    emits: ['validStatusEvent', 'changeCategory', 'onLoad'],
		setup(props, ctx) {
      let route = useRoute()
			let state = reactive({
        categoryList: [],
        categoryProps: {
          value: 'id',
          label: 'name',
          children: 'child',
          emitPath: false
        },
        categoryName: '',
        labelList: [],
        form: {
          mode: null,
          copyStatus: 0,
          collectionUrl: '',
          referenceUrls: [''],
          nameCn: '',
          nameEn: '',
          categoryId: null,
          labels: '',
          expectPrice: null,
          costPrice: null,
          brief: '',
          descriptionCn: '',
          descriptionEn: '',
          originalPrice: null
        },
				tabPosition: 0,
        tabPosition2: 0,
        rules: {
					nameCn: [
						{required: true, message: '请填写商品标题', trigger: 'blur'}
					],
					categoryId: {required: true, message: '请选择商品品类', trigger: 'change'},
					expectPrice: {
						required: true,
						message: route.name == 'goodsPublishDeatil' ? '请填写售价' : '请填写期望售价',
						trigger: 'blur'
					},
				},
        categoryOldVal: null
			})
      let formRef = ref(null)
      let cascaderRef = ref(null)
      let myEditor = ref(null)
      let handle = Handle(state, formRef, route.name, cascaderRef, ctx, myEditor, initEditorInfo)
      let hooks = Hooks(state)

      let getCategoryname = (info, id) => {
        info.some(item => {
          if (item.id == id) {
            state.categoryName = item.name
            return true
          }
          if (item.child?.length) {
            getCategoryname(item.child, id)
          }
        })
      }

      watch(() => state.form.categoryId, (newVal, oldVal) => {
        state.categoryOldVal = oldVal
        if (newVal == null) {
          state.categoryName = null
        } else {
          getCategoryname(state.categoryList, newVal)
        }
      }, {deep: true}, { immediate: true })

      watch(() => state.form.nameEn, (newVal) => {
        if (newVal == '') {
          state.rules.nameCn.required = true
        } else {
          state.rules.nameCn.required = false
        }
      }, { deep: true })

      watch(() => props.query, (newVal) => {
        state.form = deepCopy(newVal)
        if (state.form.descriptionEn) {
          initEditorInfo(state.form.descriptionEn).then(res => {
            myEditor.value.myContent = res
						ctx.emit('onLoad', res)
          })
        } else {
          state.form.descriptionEn = ''
        }
				if (state.form.descriptionCn) {
					initEditorInfo(state.form.descriptionCn).then(res => {
						state.form.descriptionCn = res
					})
				} else {
					state.form.descriptionCn = ''
				}
				if (state.form.referenceUrls == null || state.form.referenceUrls.length == 0) state.form.referenceUrls = ['']
			}, {deep: true})


			function testName(rule, value, callback) {
				var str = new RegExp("http");
				if (str.test(value)) return new Error('名称中不能输入http')
			}


			onMounted(() => {
				hooks.getCategoryEvent()
				hooks.getLabelList()
			})

			return {
				...toRefs(state),
				formRef,
				cascaderRef,
        myEditor,
        ...handle,
        ...hooks
			}
		},
	}
</script>

<style lang="scss" scoped>
.pageView {
	padding: 0;
	.title {
		border-bottom: 1px solid #e9e9e9;
		padding: 0 25px;
		height: 55px;
		line-height: 55px;
		font-size: 16px;
	}
	.content {
		padding: 25px;
		.el-input {
			width: 850px;
		}
		.items {
			margin-bottom: 10px;
		}
		.items:last-of-type {
			margin-bottom: 0;
		}
		.el-button {
			margin-left: 6px;
		}
		.el-icon-plus {
			color: #1890ff;
		}
		.el-icon-delete {
			color: #fd4c60;
		}
		.priceBox {
			display: flex;
		}
    .radioGroupBox{
      max-width: 840px;
      display: flex;
      justify-content: space-between;
    }
	}
}
.mt-24 {
	margin-top: 24px;
}
:deep(.goodsName .el-form-item__content){
  display: block !important;
}
</style>
