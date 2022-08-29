<template>
<el-card shadow="never" class="none-border-card mt-20">
  <template #header>
    <span>定制品报价</span>
  </template>
  <div class="parts-quotation">
    <span class="required">
      配件报价
    </span>
    <el-radio-group v-model="partsQuotationSwitch" :disabled="!isEdit">
      <el-radio :label="1" :disabled="!enableContainFitting">开启</el-radio>
      <el-radio :label="0">关闭</el-radio>
    </el-radio-group>
  </div>
  <div class="config-info" v-if="partsQuotationSwitch">
    <div class="title">配件信息</div>
    <div class="batch-options">
      <div class="batch-option" v-for="(item,index) in batchOptions" :key="index">
        <el-checkbox v-model="configInfo[item.model].checked" :disabled="!isEdit">{{item.label}}</el-checkbox>
        <el-input :type="item.type" v-model="configInfo[item.model].value" @blur="batchInputChange(item.min,item.max,item.model)" :maxlength="item.maxLength" :disabled="!isEdit">
          <template #append v-if="item.company">
            {{item.company}}
          </template>
        </el-input>
      </div>
      <el-button type="primary" @click="batchFill" :disabled="!isEdit">批量填充</el-button>
      <el-button type="primary" @click="openBatchSwitch" :disabled="!isEdit">批量设置开关</el-button>
    </div>
    <div>
      <vxe-table border :data="goodsCustomFittingList" v-bind="tableOptions" :checkbox-config="{checkAll:true}" ref="vxeTable">
        <vxe-column type="checkbox" width="60"></vxe-column>
        <vxe-column field="nameCn" title="配件名称" :edit-render="{name:'$input',props:{type:'text',maxLength:50,controls: false,disabled:!isEdit}}">
        </vxe-column>
        <vxe-column field="imageUrl" title="图片">
          <template #default="{ row }">
            <div class="flex-items-center">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="row.imageUrl" fit="contain">
                  <template #error>
                    <img src="@/assets/image/mr_bg@2x.png" alt="" style="width: 200px; height: 200px">
                  </template>
                </el-image>
                <template #reference>
                  <el-image style="width: 70px; height: 70px" :src="row.imageUrl" fit="contain">
                    <template #error>
                      <img src="@/assets/image/mr_bg@2x.png" alt="" style="width: 70px; height: 70px">
                    </template>
                  </el-image>
                </template>
                
              </el-popover>
            </div>
          </template>
        </vxe-column>
        <vxe-column field="material" title="材质">
          <template #defalut="{ row }">
            <div class="textOverflow_2" :title="row.material">{{row.material}}</div>
          </template>
        </vxe-column>
        <vxe-column field="purchaseWeight" title="重量(g)" :edit-render="{name:'$input',props:{type:'float',min:0.01,max:9999.99,controls: false,disabled:!isEdit}}">
        </vxe-column>
        <vxe-colgroup title="商品体积">
          <vxe-column field="purchaseLength" title="长(cm)" :edit-render="{name:'$input',props:{type:'float',min:0.01,max:999.99,controls: false,disabled:!isEdit}}">
          </vxe-column>
          <vxe-column field="purchaseWidth" title="宽(cm)" :edit-render="{name:'$input',props:{type:'float',min:0.01,max:999.99,controls: false,disabled:!isEdit}}">
          </vxe-column>
          <vxe-column field="purchaseHeight" title="高(cm)" :edit-render="{name:'$input',props:{type:'float',min:0.01,max:999.99,controls: false,disabled:!isEdit}}">
          </vxe-column>
        </vxe-colgroup>
        <vxe-column field="purchasePrice" title="默认采购价(CNY)" :edit-render="{name:'$input',props:{type:'float',min:0.01,max:9999999.99,controls: false,disabled:!isEdit}}">
        </vxe-column>
        <vxe-column field="enableCustomImage" title="定制图片">
          <template #default="{ row }">
            <el-switch v-model="row.enableCustomImage" :active-value="1" :inactive-value="0" :disabled="!isEdit"></el-switch>
          </template>
        </vxe-column>
        <vxe-column field="enableCustomText" title="定制文本">
          <template #default="{ row }">
            <el-switch v-model="row.enableCustomText" :active-value="1" :inactive-value="0" :disabled="!isEdit"></el-switch>
          </template>
        </vxe-column>
        <vxe-column field="purchaseLink" title="采购链接" :edit-render="{name:'$input',props:{type:'text',maxlength:500,controls:false,controls: false,disabled:!isEdit,clearable:true}}">
        </vxe-column>
        <vxe-column field="purchaseRemark" title="报价备注" :edit-render="{name:'$input',props:{type:'text',maxlength:300,controls:false,controls: false,disabled:!isEdit}}">
        </vxe-column>
      </vxe-table>
    </div>
  </div>
  <!-- <el-button type="primary" size="default" @click="fullValidate">21312</el-button> -->
  <!-- 批量设置开关 -->
  <el-dialog title="批量设置开关" v-model="batchDialog" width="500px" @close="batchDialog = false">
    <div class="batch">
      <div class="batch-item">定制图片开关: <el-switch v-model="batchSwitchOptions.enableCustomImage" :active-value="1" :inactive-value="0" inline-prompt></el-switch>
      </div>
      <div class="batch-item">定制文本开关： <el-switch v-model="batchSwitchOptions.enableCustomText" :active-value="1" :inactive-value="0" inline-prompt> </el-switch>
      </div>
    </div>
    <template #footer>
      <el-button @click="batchDialog = false">取消</el-button>
      <el-button type="primary" @click="batchSwitch">确定</el-button>
    </template>
  </el-dialog>
</el-card>
</template>

<script>
import { onMounted, reactive, toRefs, nextTick } from 'vue'
import {
  batchOptions,
  tableOptions
} from './composables/options.js'
import { ElMessage } from 'element-plus'
export default {
  props: {
    isQuote: Boolean,
    goodsCustomFittingList: Array,
    enableContainFitting: Number,
    isEdit:Boolean,
    offerFittingSwitch:Number,
  },
  setup(props) {
    const state = reactive({
      partsQuotationSwitch: 1,
      configInfo: {
        purchaseWeight: { value: null, checked: true }, // 重量
        purchaseLength: { value: null, checked: true }, // 长
        purchaseWidth: { value: null, checked: true }, // 宽
        purchaseHeight: { value: null, checked: true }, // 高
        purchasePrice: { value: null, checked: true }, // 默认采购价
        purchaseLink: { value: null, checked: true }, // 采购链接
        purchaseRemark: { value: null, checked: true }, // 采购备注
      },
      vxeTable: null,
      batchDialog: false,
      batchSwitchOptions: {
        enableCustomImage: 1,
        enableCustomText: 1
      },
      goodsCustomFittingList: props.goodsCustomFittingList
    })

    onMounted(() => {
      state.partsQuotationSwitch = props.offerFittingSwitch
    })

    function getSelectRows(){
      return state.vxeTable.getCheckboxRecords(true)
    }

    function fullValidate(type) {
      let data = {
        offerFittingSwitch: state.partsQuotationSwitch,
        offerFittingSwitchChange: state.partsQuotationSwitch == props.offerFittingSwitch ? 0 : 1
      }
      return new Promise((resolve, reject) => {
        if (!state.partsQuotationSwitch || type == 0) {
          resolve(data)
        } else {
          state.vxeTable.fullValidate(props.goodsCustomFittingList, (e) => {
            if (!e) {
              resolve(data)
            }
          })
        }

      })
    }

    function batchFill() {
      let rows = getSelectRows()
      if (!rows.length) return ElMessage.error('请勾选配件')
      for (let key in state.configInfo) {
        if (state.configInfo[key].checked) {
          rows.forEach(item => {
            item[key] = state.configInfo[key].value
          })
        }
      }
    }

    function openBatchSwitch() {
      let rows = getSelectRows()
      if (!rows.length) return ElMessage.error('请勾选配件')
      state.batchDialog = true
    }

    function batchSwitch() {
      let rows = getSelectRows()
      rows.forEach(item => {
        item.enableCustomImage = state.batchSwitchOptions.enableCustomImage
        item.enableCustomText = state.batchSwitchOptions.enableCustomText
      })
      state.batchDialog = false
    }

    function batchInputChange(min,max,key){
      if(state.configInfo[key].value < min) state.configInfo[key].value = min
      if(state.configInfo[key].value > max) state.configInfo[key].value = max
    }
    return {
      ...toRefs(state),
      batchOptions,
      tableOptions,
      fullValidate,
      batchFill,
      batchSwitch,
      openBatchSwitch,
      batchInputChange
    }
  }
}
</script>

<style lang="scss" scoped>
.required {
  margin-right: 16px;

  &::before {
    content: '*';
    color: red;
  }
}

.parts-quotation {
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px dashed #d3d4d3;
}

.config-info {
  .title {
    padding: 16px 0;
  }
}

.batch-options {
  display: flex;
  margin-bottom: 16px;

  .batch-option {
    display: flex;
    align-items: center;
    margin-right: 12px;

    :deep(.el-input) {
      margin-left: 12px;
      width: 100px;

      .el-input-group__append {
        padding: 0 10px;
      }
    }
  }

  .batch-option+.batch-option {
    margin-left: 10px;
  }
}

.flex-items-center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
}

.batch {
  display: flex;

  .batch-item {
    flex: 1;
  }
}
</style>
