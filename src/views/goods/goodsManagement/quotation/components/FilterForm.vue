<template>
  <div>
    <el-card shadow="never" class="none-border-card">
      <el-form  :model="filterForm" ref="filterFormRef" inline>
        <el-form-item prop="date" label="时间范围:">
          <el-select @change="_ => filterForm.start_end = []" v-model="filterForm.timeType" clearable  class="quotation-same-select">
            <el-option v-for="time in timeTypeOptions" :key="time.value" :label="time.label" :value="time.value">
            </el-option>
          </el-select>
          <el-date-picker unlink-panels  class="sperator-big-date-picker ml-10" v-model="filterForm.start_end" value-format="YYYY-MM-DD" type="daterange" range-separator="→" start-placeholder="开始时间" end-placeholder="结束时间" :clearable="false" />
        </el-form-item>
        <el-form-item prop="enableCustom" label="商品类型:">
          <el-select v-model="filterForm.enableCustom"  clearable class="quotation-same-select">
            <el-option v-for="enableCustom in enableCustomOptions" :key="enableCustom.value" :label="enableCustom.label" :value="enableCustom.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsSrc" label="商品来源:">
          <el-cascader @change="changeSource" clearable  class="quotation-same-select" v-model="filterForm.goodsSrc" :options="sourceData"></el-cascader>
        </el-form-item>
        <el-form-item prop="categoryId" label="商品品类:">
          <el-cascader :options="categoryIdOptions" clearable :props="{ checkStrictly: true, value: 'id', label: 'name', children: 'child' }"  v-model="filterForm.preCategory" @change="changeCategory" />
        </el-form-item>
        <el-form-item prop="authType" label="查看权限:">
          <el-select v-model="filterForm.authType"  class="quotation-same-select" clearable>
            <el-option v-for="item in authTypeOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="searchText" label="搜索内容:">
          <el-select v-if="type === 'purchase'" v-model="filterForm.searchType"  class="quotation-same-select" clearable>
            <el-option v-for="search in searchTypeOptions" :key="search.value" :label="search.label" :value="search.value">
            </el-option>
          </el-select>
          <el-select v-else v-model="filterForm.searchType"  class="quotation-same-select" clearable>
            <el-option v-for="search in searchTypeOptions2" :key="search.value" :label="search.label" :value="search.value">
            </el-option>
          </el-select>
          <el-input  class="form-input-big ml-10" v-model="filterForm.searchText" :placeholder="filterForm.searchType !== 2 ? '请输入要检索的内容' : '请输入要检索的内容多条可用逗号或空格隔开'"></el-input>
        </el-form-item>
        <el-form-item prop="tortStatus" label="侵权筛选:">
          <el-select v-model="filterForm.tortStatus"  class="quotation-same-select" clearable>
            <el-option v-for="tort in tortStatusOptions" :key="tort.value" :label="tort.label" :value="tort.value">
            </el-option>
          </el-select>
        </el-form-item>
        <template v-if="type === 'purchase' || type === 'applyUser'">
          <el-form-item>
            <el-form-item prop="costPriceBegin" label="成本价（CNY）:">
              <el-input v-model.number="filterForm.costPriceBegin" type="number"  class="form-input-small" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <span>→</span>
            </el-form-item>
            <el-form-item prop="costPriceEnd">
              <el-input v-model.number="filterForm.costPriceEnd" type="number"  class="form-input-small" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item>
            <el-form-item prop="expectPriceBegin" label="预估售价（USD）:">
              <el-input v-model.number="filterForm.expectPriceBegin" type="number"  class="form-input-small" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <span>→</span>
            </el-form-item>
            <el-form-item prop="expectPriceEnd">
              <el-input v-model.number="filterForm.expectPriceEnd" type="number"  class="form-input-small" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form-item>
        </template>
        <template v-if="type === 'logistic'">
          <el-form-item>
            <el-form-item prop="weightBegin" label="预估重量（g）:">
              <el-input v-model="filterForm.weightBegin"  class="form-input-small" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
              <span>→</span>
            </el-form-item>
            <el-form-item prop="weightEnd">
              <el-input v-model="filterForm.weightEnd"  class="form-input-small" placeholder="请输入"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item prop="attr" label="特殊属性:">
            <el-select v-model="filterForm.attr"  class="quotation-same-select" multiple clearable>
              <el-option v-for="attr in goodsAttrOptions" :key="attr.value" :label="attr.label" :value="attr.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="type === 'applyUser'">
          <el-form-item prop="quotationStatus" label="状态:">
            <el-select v-model="filterForm.quotationStatus"  class="quotation-same-select" clearable>
              <el-option v-for="status in statusOptions" :key="status.value" :label="status.label" :value="status.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <div class="flex-div">
          <div>
            <el-form-item prop="remarkTypeIds" label="备注:" v-if="type === 'purchase' || type === 'applyUser'">
							<el-checkbox v-model="item.checked" :label="item.label" v-for="(item, index) in remarkOptions" :key="index" @change="changeRemark" style="margin-top: 10px"></el-checkbox>
						</el-form-item>
          </div>
          <div class="flex-div-right">
            <el-button type="primary"  @click="search">查询</el-button>
            <el-button  @click="resetForm">重置</el-button>
          </div>
        </div>
      </el-form>
    </el-card>
    <div class="padding-flex-wrap mt-10">
      <template v-if="type === 'purchase'">
        <erp-sort :options="[{ value: '1', label: '开发时间' }, { value: '2', label: '申请时间' }]" @sort="changeSort" :defaultSort="{ value: '2', type: 'asc' }"></erp-sort>
      </template>
      <template v-if="type === 'logistic'">
        <erp-sort :options="[{ value: '4', label: '采购报价时间' }, { value: '2', label: '申请时间' }]" @sort="changeSort" :defaultSort="{ value: '2', type: 'asc' }"></erp-sort>
      </template>
      <template v-if="type === 'applyUser'">
        <erp-sort :options="[{ value: '2', label: '申请时间' }]" @sort="changeSort" :defaultSort="{ value: '2', type: 'desc' }"></erp-sort>
      </template>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { sourceData, authTypeOptions, tortStatusOptions, enableCustomOptions, goodsAttrOptions } from '@/assets/js/staticData.js'
import { timeTypeOptions, searchTypeOptions, searchTypeOptions2, statusOptions } from './composables/static.js'
import { getCategoryTree, remarkTypes } from '@/api/goods/quotation.js'
import { resetForm as toolResetForm, findPathbyId } from 'tool'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import { ElMessage } from 'element-plus'
import ErpSort from '@/components/erpSort/index.vue'

export default {
  components: { ElSelectTree, ErpSort },
  emits: ['search'],
  props: {
    type: { // purchase || logistic || applyUser
      type: String,
      default: '',
      required: true
    },
    form: {
      type: Object,
      default: '',
      required: true
    }
  },
  setup(props, ctx) {
    const state = reactive({
      categoryIdOptions: [],
      remarkOptions: [],
      returnDialogVisible: false,
      filterFormRef: null,
      filterForm: props.form
    })
    const staticOptions = {
      enableCustomOptions,
      sourceData,
      authTypeOptions,
      tortStatusOptions,
      timeTypeOptions,
      searchTypeOptions,
      searchTypeOptions2,
      goodsAttrOptions,
      statusOptions
    }
    const route = useRoute()

    function resetForm() {
      if (state.remarkOptions) {
        state.remarkOptions.forEach(item => {
          item.checked = false
        })
      }
      toolResetForm(state.filterForm, { isApply: state.filterForm.isApply, goodsStatus: state.filterForm.goodsStatus, sortName: state.filterForm.sortName, sortType: state.filterForm.sortType })
      search()
    }

    function changeSource(arr) {
      if (!arr) {
        state.filterForm.mode = null
        state.filterForm.source = null
      } else {
        state.filterForm.mode = arr[0]
        if (arr.length > 1) {
          state.filterForm.source = arr[1]
        } else {
          state.filterForm.source = null
        }
      }
    }

    function changeCategory(value) {
      if (value) {
        state.filterForm.categoryId = value[value.length - 1]
      } else {
        state.filterForm.categoryId = null
      }
    }

    function changeSort(name, type) {
      state.filterForm.sortName = name
      state.filterForm.sortType = type
      search()
    }

    function search() {
      ctx.emit('search')
    }

    function setCateGoryId() {
      if (route.params && route.params.categoryId) {
        const categoryId = Number(route.params.categoryId)
        state.filterForm.categoryId = categoryId
        state.filterForm.preCategory = findPathbyId(state.categoryIdOptions, categoryId)
        search()
      }
    }

    function changeRemark() {
      let arr = []
      state.remarkOptions.forEach(item => {
        if (item.checked) {
          arr.push(item.value)
        }
      })
      state.filterForm.remarkTypeIds = arr.join(',')
    }


    getCategoryTree().then(r => {
      state.categoryIdOptions = r.data
      setCateGoryId()
    })

    if (props.type === 'purchase' || props.type === 'applyUser') {
      remarkTypes({ useScope: '1' }).then(res => {
        let arr = []
        res.data.forEach(item => {
          let obj = {
            value: item.id,
            label: item.name,
            checked: false,
            word: item.word,
            color: item.color
          }
          arr.push(obj)
        })
        state.remarkOptions = arr
      })
    }


    return {
      ...toRefs(state),
      ...staticOptions,
      resetForm,
      changeSource,
      changeSort,
      changeCategory,
      changeRemark,
      search
    }
  }
}
</script>

<style lang="scss" scoped>
// .filter-el-form {
//     :deep(.el-form-item) {
//         margin-bottom: 15px;
//     }
// }
.quotation-same-select {
  width: 140px;
}
.form-input-big {
  width: 320px;
}
.form-input-small {
  width: 80px;
}
.flex-div {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  :deep(.el-form-item--small.el-form-item) {
    display: flex;
    align-items: center;
  }
}
.el-icon-right {
  margin-right: 10px;
}
.padding-flex-wrap {
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
}
</style>
