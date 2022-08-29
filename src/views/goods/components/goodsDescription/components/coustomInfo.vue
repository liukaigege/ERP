<!--
* @Descripttion: Vango ERP coustomInfo
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div class="coustomInfoContainer">
    <div class="coustomInfoHeader">
      <span>定制规格信息</span>
    </div>
    <div class="coustomInfoContent">
      <el-form>
        <el-form-item label="定制类型：">
          <el-button
            v-for="item in goodsCustomTypeList"
            :key="item"
            :disabled="true"
            type="primary"
            >{{ item == 1 ? '定制图片' : '定制文本' }}</el-button
          >
        </el-form-item>
        <el-form-item label="是否含有配件：">
          <el-radio
            v-model="enableContainFitting"
            :label="1"
            size="large"
            :disabled="true"
            >是</el-radio
          >
          <el-radio
            v-model="enableContainFitting"
            :label="0"
            size="large"
            :disabled="true"
            >否</el-radio
          >
        </el-form-item>
      </el-form>
      <vxe-table
        border
        keep-source
        ref="xTable"
        align="center"
        :edit-rules="validRules"
        :data="goodsCustomFittingList || []"
        :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
      >
        <vxe-column
          title="配件中文名称"
          width="250"
          :edit-render="{ autofocus: '.vxe-input--inner' }"
          field="nameCn"
        >
          <template #edit="{ row }">
            <vxe-input
              v-if="routeName === 'setPriceDetail' && isEdit"
              v-model="row.nameCn"
              type="text"
            ></vxe-input>
            <div v-else class="tooltipContent" :title="row.nameCn">
              {{ row.nameCn }}
            </div>
          </template>
        </vxe-column>
        <vxe-column
          title="配件英文名称"
          width="250"
          :edit-render="{ change: '.vxe-input--inner' }"
          field="nameEn"
        >
          <template #edit="{ row }">
            <vxe-input
              v-if="routeName === 'setPriceDetail' && isEdit"
              v-model="row.nameEn"
              type="text"
            ></vxe-input>
            <div v-else class="tooltipContent" :title="row.nameEn">
              {{ row.nameEn }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="图片" width="110">
          <template #default="{ row }">
            <div
              v-if="row.imageUrl"
              style="
                width: 70px;
                height: 70px;
                margin: 5px 0;
                position: relative;
              "
              @click="selectImages(row.id)"
            >
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="row.imageUrl || '@/assets/image/mr_bg@2x.png'"
                  fit="contain"
                ></el-image>
                <template #reference>
                  <el-image
                    class="ml-10"
                    style="width: 70px; height: 70px"
                    :src="row.imageUrl || '@/assets/image/mr_bg@2x.png'"
                    fit="contain"
                  ></el-image>
                </template>
              </el-popover>
            </div>
          </template>
        </vxe-column>
        <vxe-column
          title="材质"
          width="200"
          :edit-render="{ autofocus: '.vxe-input--inner' }"
          field="material"
        >
          <template #edit="{ row }">
            <vxe-input
              v-if="routeName === 'setPriceDetail' && isEdit"
              v-model="row.material"
              type="text"
            ></vxe-input>
            <div v-else class="tooltipContent" :title="row.material">
              {{ row.material }}
            </div>
          </template>
        </vxe-column>
        <vxe-column
          title="默认采购价(CNY)"
          width="200"
          v-if="routeName != 'PurchaseQuote'"
        >
          <template #default="{ row }">
            <div
              class="tooltipContent"
              v-if="row.purchasePrice"
              :title="row.purchasePrice"
            >
              {{ row.purchasePrice }}
            </div>
          </template>
        </vxe-column>
        <vxe-column title="商品备注">
          <template #default="{ row }">
            <div class="tooltipContent" v-if="row.remark" :title="row.remark">
              {{ row.remark }}
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <p>没有更多数据了！</p>
        </template>
      </vxe-table>
    </div>
    <SelectImg
      :dialogVisible="dialogVisible"
      v-if="dialogVisible"
      :multiple="false"
      @selectImg="selectImgsBack"
      :skuQuery="selectImageData"
    />
  </div>
</template>
<script>
import { reactive, toRefs, ref, watch } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import SelectImg from '@/views/goods/components/sku/components/selectImg.vue'
export default {
  components: { SelectImg },
  props: {
    isEdit: Boolean, // 是否编辑状态
    goodsCustomFittingList: Array, //定制品信息
    enableContainFitting: Number, //是否包含配件 0：否 1：是
    goodsCustomTypeList: Array //定制品类型 定制类型 0：默认 1：定制图片 2：定制文本
  },
  setup(props, { emit }) {
    const route = useRoute()
    const routeName = route.name
    const xTable = ref(null)
    const validRules = ref({
      nameCn: [
        {
          required: true,
          message: '配件中文名称必须填写'
        }
      ],
      nameEn: [
        {
          required: true,
          message: '配件英文名称必须填写'
        }
      ]
    })
    const state = reactive({
      dialogVisible: false,
      selectImageData: null,
      changeId: null
    })
    function selectImages(id) {
      if (props.isEdit) {
        state.changeId = id
        state.dialogVisible = true
      }
    }
    function selectImgsBack(val) {
      state.dialogVisible = false
      props.goodsCustomFittingList.find(v => {
        if (state.changeId == v.id) {
          v.imageUrl = val.url[0]?.url
          return true
        }
      })
    }
    watch(
      () => props.goodsCustomFittingList,
      val => {
        if (val) {
          emit('callBack', props.goodsCustomFittingList)
        }
      },
      { deep: true }
    )
    return {
      ...toRefs(state),
      Delete,
      Plus,
      routeName,
      xTable,
      validRules,
      selectImgsBack,
      selectImages
    }
  }
}
</script>
<style lang='scss' scoped>
.coustomInfoContainer {
  box-sizing: border-box;
  padding: 0 30px 0 30px;
  background-color: #fff;
  margin-bottom: 20px;
  padding-bottom: 20px;
  font-weight: 500;
  .coustomInfoHeader {
    border-bottom: 1px solid #e8eaec;
    height: 50px;
    padding: 0 40px;
    margin: 0 -30px;
    line-height: 50px;
  }
  .coustomInfoContent {
    margin-top: 20px;
  }
  .btnContainer {
    margin-bottom: 20px;
  }
  .tooltipContent {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* 这里是超出几行省略 */
    overflow: hidden;
  }
}
.redColor {
  color: #f56c6c;
}
</style>
