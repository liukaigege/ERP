<template>
<el-dialog title="数据录入" v-model="show" width="800px" @close="close" :close-on-click-modal="false">
  <el-form :model="formData" ref="refform" :rules="rules" label-width="125px" :inline="false" size="normal">

    <div>
      <p>基本信息</p>
      <div class="option">
        <el-form-item label="选择日期："  prop="date" :rules="{required:true,message:'请选择日期',trigger:'blur'}">
          <el-date-picker v-model="formData.date" type="date" placeholder="请选择日期"  style="width:240px" @change="dateChange">
          </el-date-picker>
        </el-form-item>
        <div>
          <span>订单类型：</span>
          <el-select v-model="formData.deliveryType" placeholder="请选择订单类型" filterable  style="width:240px">
            <el-option label="标准" :value="1"> </el-option>
            <el-option label="COD" :value="2"> </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div>
      <p>广告花费</p>
      <div class="option">
        <el-form-item label="FB花费($)：" prop="fbSpend" :rules="rules.spend">
          <el-input v-model="formData.fbSpend"  style="width:240px" />
        </el-form-item>
        <el-form-item label="TikTok花费($)：" prop="tiktokSpend" :rules="rules.spend">
          <el-input v-model="formData.tiktokSpend"  style="width:240px" />
        </el-form-item>
      </div>
      <div class="option">
        <el-form-item label="Google花费($)：" prop="googleSpend" :rules="rules.spend">
          <el-input v-model="formData.googleSpend"  style="width:240px" />
        </el-form-item>
        <el-form-item label="Pinterest花费($)：" prop="pinterestSpend" :rules="rules.spend">
          <el-input v-model="formData.pinterestSpend"  style="width:240px" />
          <!-- <el-input-number v-model="formData.pinterestSpend" :controls="false" :precision="2" :step="0.1" :max="10"  style="width:240px"/> -->
        </el-form-item>
      </div>
      <div class="option">
        <el-form-item label="Bing花费($)：" prop="bingSpend" :rules="rules.spend">
          <el-input v-model="formData.bingSpend"  style="width:240px" />
        </el-form-item>
        <el-form-item label="">
        </el-form-item>
      </div>

    </div>
  </el-form>

  <!-- <div>

    <div class="flex-item">
      <p>销售数据</p>
      <el-button type="primary"  @click="addGoodsShow = true">添加SKU</el-button>
    </div>
    <div class="formBox">
      <el-form :model="formData.skuList" ref="tableForm" label-width="80px" :inline="true" >
        <el-table :data="formData.skuList" border stripe max-height="350px">
          <el-table-column prop="sku" label="SKU" width="275">
            <template #default="{row}">
              <div class="cellSku">
                <img :src="row.mainImg" alt="">
                <span class="text-row" :title="row.skuCode">{{row.skuCode}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sku" label="销售数量/收入" align="center">
            <template #default="{row,$index}">
              <div>
                <el-form-item label=""  :prop="'.' + $index + '.num'" :rules="rules.num">
                  <el-input v-model.number="row.num" type="number"  style="width:130px" placeholder="销售数量" maxlength="5"></el-input>
                </el-form-item>
                <el-form-item label=""  :prop="'.' + $index + '.subGross'" :rules="rules.subGross">
                  <el-input v-model="row.subGross"  style="width:130px" placeholder="收入"></el-input>
                </el-form-item>
                <el-form-item label="" >
                  <el-select v-model="row.currency" filterable  style="width:100px">
                    <el-option v-for="item in currencyList" :key="item.id" :label="item.originalCurrency" :value="item.originalCurrency">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sku" label="操作" width="50">
            <template #default="{$index}">
              <span @click="delItem($index)" style="color:#1890FF;cursor: pointer;">移除</span>
            </template>
          </el-table-column>

        </el-table>

      </el-form>
    </div>

  </div> -->

  <template #footer>
    <span style="margin-right:16px">
      总花费：${{cotalCost}}
    </span>
    <!-- <span style="margin-right:16px">
      SKU数量：{{formData.skuList.length}}
    </span>
    <span style="margin-right:16px">
      产品数量：{{totail}}件
    </span> -->
    <el-button @click="close" >取消</el-button>
    <el-button type="primary"  @click="submit">确定</el-button>
  </template>
</el-dialog>
<addGoods :checkData="formData.skuList" v-if="addGoodsShow" @closeEvent="addGoodsShow = fasle" @returnGoods="returnGoods" />
</template>

<script>
import { computed, onMounted, reactive, toRefs, watch } from 'vue'
import addGoods from './addGoods.vue'
import { getExchangeRataListPage } from '@/api/financial.js'
import { checkNumber_2, checkInteger } from '@/utils/ruleOptions.js'
import { addOrUpdate } from '@/api/achievements.js'
import moment from 'moment'
import { deepCopy } from '@/utils/tool.js'
import { ElMessage } from 'element-plus'
export default {
  emits: ['closeEvent', 'search'],
  components: {
    addGoods
  },
  props: {
    data: {}
  },
  setup(props, ctx) {
    const state = reactive({
      refform: null,
      tableForm: null,
      show: true,
      input: null,
      formData: {
        date: '',
        deliveryType: 1,
        fbSpend: '',
        tiktokSpend: '',
        googleSpend: '',
        pinterestSpend: '',
        bingSpend: '',
        skuList: []
      },
      addGoodsShow: false,
      currencyList: [],
      dataChange: 0
    })

    const rules = {
      spend: [
        { validator: checkNumber_2, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value > 9999999999999.99) return callback('最大输入为9999999999999.99')
            callback()
          },
          trigger: 'blur'
        }
      ],
      num: [
        { required: true, message: '请输入销售数量', trigger: 'blur' },
        { validator: checkInteger, trigger: 'blur' },
        { validator:(rule,value,callback)=>{
          if(value<1) return callback('销售数量最小为1')
          callback()
        }, trigger: 'blur' },
      ],
      subGross: [
        { required: true, message: '请输入收入', trigger: 'blur' },
        { validator: checkNumber_2, trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value>9999999999999.99) return callback('最大为9999999999999.99')
            callback()
          },
          trigger: 'blur'
        }
      ]
    }

    onMounted(() => {
      getExchangeRataListPage({
        page: {
          pageNo: 1,
          pageSize: 9999
        },
        originalCurrency: '',
        baseCurrency: 'CNY'
      }).then(res => {
        state.currencyList = res.data.dataList
      })
      if (props.data) {
        state.formData = props.data
      }
    })

    watch(() => state.formData, val => {
      state.dataChange++
    }, { deep: true })
    const cotalCost = computed(() => {
      // 总花费
      let num = 0
      num = +state.formData.fbSpend +
        +state.formData.tiktokSpend +
        +state.formData.googleSpend +
        +state.formData.pinterestSpend +
        +state.formData.bingSpend
      return num
    })

    const totail = computed(() => {
      let num = 0
      state.formData.skuList.forEach(item => {
        num += item.num ? +item.num : 0
      })
      return num
    })

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500);
    }

    function delItem(i) {
      state.formData.skuList.splice(i, 1)
    }

    function submit() {
      if (state.dataChange == 1) return ElMessage.error('数据未变更不可修改')
      Promise.all([state.refform.validate()]).then(res => {
        let data = deepCopy(state.formData)
        // data.skuList = state.formData.skuList.map(item => {
        //   return {
        //     skuId: item.skuId,
        //     num: item.num,
        //     subGross: +item.subGross,
        //     currency: item.currency
        //   }
        // })
        data.fbSpend = +data.fbSpend
        data.tiktokSpend = +data.tiktokSpend
        data.googleSpend = +data.googleSpend
        data.pinterestSpend = +data.pinterestSpend
        data.bingSpend = +data.bingSpend
        addOrUpdate(data).then(res => {
          ctx.emit('search')
          close()
        })
      })
    }

    function dateChange(e) {
      state.formData.date = moment(e).format('YYYY-MM-DD')
    }

    function returnGoods(e) {
      state.formData.skuList = e
    }
    return {
      ...toRefs(state),
      close,
      delItem,
      submit,
      dateChange,
      returnGoods,
      cotalCost,
      totail,
      rules
    }
  }
}
</script>

<style lang="scss" scoped>
.option {
  display: flex;
  justify-content: space-between;

  span {
    display: inline-block;
    width: 125px;
    text-align: right;
  }
}

.option+.option {
  margin-top: 16px;
}

p {
  color: #000;
  font-weight: 700;

}

.flex {
  display: flex;
}

.flex-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;

}

.cellSku {
  display: flex;
  align-items: center;

  img {
    width: 50px;
    height: 50px;
    margin-right: 16px;
  }
}

.text-row {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 0;

  .el-form-item__label {
    padding: 0;
  }
}

::v-deep(.formBox) {
  .cell {
    overflow: unset;
  }
}
</style>
