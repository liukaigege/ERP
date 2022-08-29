<!--
* @Descripttion: Vango ERP querySimilar 相似品查询
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
    <div class="query-similar-query">
      <div class="query-similar-query-header">
        <span class="query-similar-query-header-title">相似品查询</span>
        <span>请输入商品名称或至少上传一张商品图片</span>
      </div>
      <el-form :model="queryData" :inline="true" label-width="110px">
        <el-form-item label="商品名称：">
          <el-input
            v-model.trim="queryData.name"
            placeholder="请输入商品名称"
            :maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品品类：">
          <ElSelectTree
            :data="categoryData"
            slPlaceholder="请选择"
            :treeProps="{
              value: 'id',
              label: 'name',
              children: 'child'
            }"
            @ok="checkedSupplier"
            :defaultExpandAll="true"
            :width="200"
            :slClearable="true"
            displayStyle="inline-block"
            ref="ElSelectTreeRef"
          />
        </el-form-item>
        <el-form-item label="商品图片：">
          <div class="images-list-content">
            <UploadImg
              :style="{ width: '70px', height: '70px' }"
              :limit="4"
              @add="getFileUrl"
              @del="getFileUrl"
              :maxSize="10"
              ref="UploadImgRef"
            />
          </div>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="queryBtns" @click="queryList(true)"
        >查 询</el-button
      >
      <el-button class="resetBtns" @click="resetFn">重 置</el-button>
    </div>
    <div class="query-similar-query">
      <div class="query-similar-query-header">
        <span class="query-similar-query-header-title">查询信息</span>
      </div>
      <div class="query-similar-query-container">
        <div class="copy-container">
          <!--  -->
          <el-button
            type="primary"
            v-if="authPath('copyCodeQuerySimilar:btns')"
            :disabled="selectList.length < 1"
            @click="copy(selectList.join(','))"
            >复制编码（{{ selectList.length }}）</el-button
          >
        </div>
        <vxe-table
          ref="myTable"
          keep-source
          align="center"
          :max-height="480"
          show-overflow="tooltip"
          :export-config="{}"
          :scroll-y="{ enabled: true, gt: 20 }"
          highlight-hover-row
          :auto-resize="true"
          :data="list"
          :row-config="{ height: 100 }"
          @checkbox-change="selectChangeEvent"
          @checkbox-all="checkAll"
        >
          <vxe-table-column width="40" type="checkbox"> </vxe-table-column>
          <vxe-table-column
            title="商品编码"
            width="90"
            v-if="authPath('querySimilarGoodsCode:btn')"
          >
            <template #default="{ row }">
              <el-tooltip placement="top" :offset="10">
                <template #content>
                  <a style="color: #fff" v-copy="row.id">复制</a>
                </template>
                <div class="overflowDIV">{{ row.id }}</div>
              </el-tooltip>
            </template>
          </vxe-table-column>
          <vxe-table-column title="商品名称">
            <template #default="{ row }">
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.nameCn"
                placement="top"
              >
                <div class="overflowDIV">{{ row.nameCn }}</div>
              </el-tooltip>
            </template>
          </vxe-table-column>
          <vxe-table-column field="createUserName" width="90" title="开发人">
          </vxe-table-column>
          <vxe-table-column
            field="purchaseUserName"
            width="90"
            title="采购报价人"
          >
          </vxe-table-column>
          <vxe-table-column
            field="logisticsUserName"
            width="90"
            title="物流报价人"
          >
          </vxe-table-column>
          <vxe-table-column field="categoryName" width="90" title="品类">
          </vxe-table-column>
          <vxe-table-column field="类型" width="90" title="类型">
            <template #default="{ row }">
              <div :class="row.skuType == 3 ? 'blueColor' : ''">
                {{ goodsTypeList.filter(v => v.value == row.skuType)[0].label }}
              </div>
            </template>
          </vxe-table-column>
          <vxe-table-column title="商品形式" width="150">
            <template #default="{ row }">
              <div :class="row.combineType == 2 ? 'blueColor' : ''">
                {{
                  row.combineType == 1
                    ? '单品'
                    : row.combineType == 2
                    ? '组合品'
                    : ''
                }}
              </div>
            </template>
          </vxe-table-column>
          <vxe-table-column field="goodsPosition" width="90" title="商品位置">
          </vxe-table-column>
          <vxe-table-column width="360" title="商品图片">
            <template #default="{ row }">
              <div v-if="row.imgList">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                  v-for="(item, index) in row.imgList"
                  :key="index"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="item"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      class="ml-10"
                      style="width: 70px; height: 70px"
                      :src="item"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
            </template>
          </vxe-table-column>
          <vxe-table-column
            width="90"
            title="商品详情"
            v-if="authPath('querySimilarDetail:btn')"
          >
            <template #default="{ row }">
              <el-button type="text" @click="toDetail(row)">查看</el-button>
            </template>
          </vxe-table-column>
          <vxe-table-column title="打回原因" width="90">
            <template #default="{ row }">
              <div>
                {{
                  row.refuseType == 1
                    ? '采购打回'
                    : row.refuseType == 2
                    ? '物流打回'
                    : ''
                }}
              </div>
              <el-tooltip
                class="item"
                effect="dark"
                :content="row.refuseReason"
                placement="top"
              >
                <div class="overflowDIV">{{ row.refuseReason }}</div>
              </el-tooltip>
            </template>
          </vxe-table-column>
          <vxe-table-column
            width="90"
            title="操作"
            v-if="authPath('querySimilarApplyAnthor:btn')"
          >
            <template #default="{ row }">
              <el-button
                type="text"
                :disabled="row.authFlag == 0"
                @click="applyAnthor(row.id, row.goodsPosition)"
                >申请权限</el-button
              >
            </template>
          </vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <Application
      v-if="applicationShow"
      :id="applicationId"
      :successStr="successStr"
      @applicationBack="applicationBack"
    />
  </div>
</template>
<script>
import { reactive, toRefs, ref, onMounted } from 'vue'
import UploadImg from '@/components/uploadImg/index.vue'
import Application from './components/application.vue'
import ElSelectTree from '@/components/elSelectTree/index.vue'
import { queryData } from './composables/data'
import { getCategory } from '@/api/goods/quotedPrice'
import { similarList } from './composables/api'
import { goodsTypeList } from '@/assets/js/staticData'
import { deepCopy } from '@/utils/tool'
import { setPermission } from '@/api/goods/addGoods'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { copy } from '@/utils/tool.js'
import { authPath } from '@/utils/hooks'
export default {
  name: 'querySimilar',
  components: {
    UploadImg,
    Application,
    ElSelectTree
  },
  setup() {
    const ElSelectTreeRef = ref(null)
    const UploadImgRef = ref(null)
    const router = useRouter()
    const state = reactive({
      queryData: deepCopy(queryData),
      categoryData: null,
      indeterminate: false,
      list: [],
      checked: false,
      applicationShow: false,
      applicationId: '',
      selectList: [],
      successStr: '',
      applyAnthorDebounce: true
    })
    //获取商品品类列表
    getCategory().then(res => {
      state.categoryData = res.data
    })
    // 查询列表
    queryList(false)
    function queryList(s) {
      state.selectList = []
      if (state.queryData.name || state.queryData.urls.length) {
        similarList(state.queryData).then(res => {
          state.list = res.data.map(v => {
            v.checked = false
            return v
          })
        })
      } else {
        if (s)
          ElMessage.warning({ message: '请输入商品名称或至少上传1张商品图片' })
      }
    }
    function checkAll(val) {
      state.selectList = val.records.map(item => item.id)
    }
    function selectChangeEvent(val) {
      state.selectList = val.records.map(item => item.id)
    }
    function checkedSupplier(val, title) {
      state.queryData.categoryId = val
    }
    function toDetail(row) {
      // layFlag 商品搁置状态 0正常 1搁置中
      // status 商品状态 0待激活 -1激活失败 1未报价(待申请) 2待采购报价() 3采购打回() 4待物流报价 5物流打回 6已报价
      if (row.layFlag == 1) {
        // 1搁置中
        router.push({
          name: 'LayAsideDetail',
          query: {
            id: row.id
          }
        })
      } else {
        let name = '',
          query = {}
        switch (row.status) {
          case 5:
            // 5物流打回
            name = 'EditDetail'
            query = {
              goodsId: row.id,
              type: 'layList',
              combineType: 1
            }
            break
          case 4:
            // 4待物流报价
            name = 'logisticsQuote'
            query = {
              id: row.id,
              isedit: 0,
              combine: 1
            }
            break
          case 3:
            // 3采购打回
            name = 'EditDetail'
            query = {
              goodsId: row.id,
              type: 'layList',
              combineType: 1
            }
            break
          case 2:
            // 2待采购报价
            name = 'PurchaseQuote'
            query = {
              id: row.id,
              isedit: 0,
              combine: 1
            }
            break
          case 1:
            // 1未报价
            name = 'EditDetail'
            query = {
              goodsId: row.id,
              type: 'layList',
              combineType: 1
            }
            break
          case -1:
            // -1激活失败
            ElMessage.warning({ message: '激活失败商品无跳转' })
            break
          case 0:
            // 0待激活
            ElMessage.warning({ message: '待激活商品无跳转' })
            break
          default:
            name = 'setPriceDetail'
            query = {
              id: row.id,
              status: 0,
              sourceRoute: 1,
              combine: 1
            }
            break
        }
        router.push({
          name,
          query
        })
      }
    }
    function applyAnthor(id, str) {
      if (state.applyAnthorDebounce) {
				state.applyAnthorDebounce = false
        setTimeout(() => (state.applyAnthorDebounce = true), 1000)
        setPermission({
          goodsIds: id,
          goodsId: '1',
          authType: 0,
          similarGoods: 1
        }).then(res => {
          state.applicationId = id
          state.successStr = str
          state.applicationShow = true
          state.list.forEach(v => {
            v.authFlag = 0
          })
        })
      }
    }
    function applicationBack() {
      state.applicationId = ''
      state.applicationShow = false
    }
    // 重置
    function resetFn() {
      ElSelectTreeRef.value.init(false)
      UploadImgRef.value.resert()
      state.queryData = deepCopy(queryData)
      state.list = []
      state.selectList = []
    }
    function getFileUrl(val) {
      state.queryData.urls = val.map(v => v.url)
    }
    onMounted(() => {
      resetFn()
    })
    function copyCodeFn() {
      if (
        state.list.every(v => {
          v.authFlag == 0
        })
      )
        return ElMessage.warning({ message: '您没有当前查询商品的品类权限' })
      copy(state.selectList.join(','))
    }
    return {
      ...toRefs(state),
      UploadImgRef,
      queryList,
      checkAll,
      selectChangeEvent,
      toDetail,
      resetFn,
      copy,
      copyCodeFn,
      getFileUrl,
      applyAnthor,
      goodsTypeList,
      checkedSupplier,
      ElSelectTreeRef,
      applicationBack
    }
  }
}
</script>
<style lang='scss' scoped>
.blueColor {
  color: #5fadff;
}
.overflowDIV {
  white-space: nowrap;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
}
.query-similar-query {
  background-color: #fff;
  margin-bottom: 20px;
  position: relative;
  .query-similar-query-header {
    border-bottom: 1px solid #f9f9fb;
    color: #ff3b30;
    font-size: 12px;
    line-height: 50px;
    margin-bottom: 20px;
    .query-similar-query-header-title {
      color: #262626;
      font-size: 16px;
      font-weight: 550;
      margin: 0 20px 0 30px;
    }
  }
  .images-list-content {
    border: 1px solid #ededed;
    height: 86px;
    box-sizing: border-box;
    padding: 8px 16px;
    :deep(.el-upload) {
      width: 100%;
      height: 100%;
    }
    :deep(.imgItem) {
      width: 70px;
      height: 70px;
      img {
        width: 70px;
        height: 70px;
      }
      .icon {
        transform: translate(-50%, -50%);
      }
    }
  }
  .queryBtns {
    position: absolute;
    right: 100px;
    bottom: 24px;
  }
  .resetBtns {
    position: absolute;
    right: 30px;
    bottom: 24px;
  }
  .query-similar-query-container {
    box-sizing: border-box;
    padding: 0 30px;
    .copy-container {
      padding-bottom: 20px;
    }
  }
  .item-info {
    position: relative;
    box-sizing: border-box;
    padding-left: 120px;
    height: 120px;
    border-bottom: 1px dashed #e9e9e9;
    margin-bottom: 20px;
    .item-info-images {
      width: 100px;
      height: 100px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
</style>
