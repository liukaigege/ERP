<template>
  <div class="goodsList">
    <el-form
      :inline="true"
      ref="from"
      :model="form"
      class="demo-form-inline"
      @keyup.enter="init"
    >
      <el-form-item label="时间范围:">
        <el-select
          v-model="form.timeType"
          style="width: 140px; margin-right: 16px"
        >
          <el-option label="搁置时间" :value="5"></el-option>
          <el-option label="刊登时间" :value="2"></el-option>
          <el-option label="上架时间" :value="3"></el-option>
          <el-option label="下架时间" :value="4"></el-option>
        </el-select>
        <el-date-picker
          class="daterange"
          style="width: 256px"
          v-model="time"
          value-format="YYYY-MM-DD"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="changeTime"
          unlink-panels
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="商品来源:">
        <el-cascader
          v-model="goodsSource"
          :options="sourceData"
          clearable
          :props="{ checkStrictly: true }"
          @change="changeSource"
        />
      </el-form-item>
      <el-form-item label="商品类型:">
        <el-select v-model="form.skuType" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="普通商品" :value="1"></el-option>
          <el-option label="定制商品" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品品类:">
        <el-cascader
          v-model="form.categoryId"
          :options="categoryIdArr"
          clearable
          :props="{
            checkStrictly: true,
            value: 'id',
            label: 'name',
            children: 'child'
          }"
          @change="checkedDept"
        />
      </el-form-item>
      <el-form-item label="刊登状态:">
        <el-select v-model="form.isPublish" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="已刊登" :value="1"></el-option>
          <el-option label="未刊登" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品状态:">
        <el-select v-model="form.goodsStatus" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="已上架" :value="5"></el-option>
          <el-option label="已下架" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索内容:">
        <el-select
          v-model="form.searchType"
          style="width: 140px; margin-right: 16px"
        >
          <el-option label="商品名" :value="1"></el-option>
          <el-option label="商品编码" :value="2"></el-option>
          <el-option label="商品spu" :value="3"></el-option>
          <el-option label="商品标签" :value="4"></el-option>
        </el-select>
        <el-input
          class="keyword"
          clearable
          maxlength="500"
          v-model="form.searchText"
          style="width: 318px"
          placeholder="请输入要检索的内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="侵权筛选:">
        <el-select v-model="form.tortStatus" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option label="侵权可用" :value="2"></el-option>
          <el-option label="未侵权" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="刊登店铺:">
        <el-select v-model="form.shopId" clearable>
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in publishShop"
            :key="index"
            :label="item.name"
            :value="item.ShopId"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="form_btn">
        <el-form-item label="备注:">
          <el-checkbox
            v-model="item.checked"
            :label="item.label"
            v-for="(item, index) in remakeOptions"
            :key="index"
            @change="changeRemake"
          ></el-checkbox>
        </el-form-item>
        <el-form-item>
          <div class="btnL">
            <el-button type="primary" @click="init">查 询</el-button>
            <el-button @click="reset">重 置</el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div class="middle">
      <div style="color: #606266">
        排序：
        <el-button type="text" @click="sort(form.sortType)">
          搁置时间
          <i :class="generateClass(form.sortType)" />
        </el-button>
      </div>
      <el-button type="primary" @click="batchRemove()">批量下架</el-button>
    </div>
    <div class="pageView">
      <vxe-table
        border
        :loading="loading"
        :data="dataList"
        auto-resize
        :span-method="colspanMethod"
        :expand-config="{ visibleMethod: expandVisibleMethod }"
        style="margin-bottom: 30px"
        :scroll-y="{ enabled: false }"
      >
        <vxe-column field="name" title="商品信息" width="360" type="expand">
          <template #header>
            <el-checkbox
              v-model="checkedList"
              :indeterminate="isIndeterminate"
              @change="handleCheckAllChange"
            ></el-checkbox>
            <span style="margin-left: 20px">商品信息</span>
          </template>
          <template #default="{ row, rowIndex }">
            <div v-if="rowIndex % 2 === 0">
              <div class="extraHeader">
                <el-checkbox
                  v-model="row.isChecked"
                  style="margin-right: 10px"
                  @change="val => handleCheckedChange(val, row)"
                ></el-checkbox>
                <el-tooltip placement="top">
                  <template #content>
                    <p style="cursor: pointer" v-copy="row.goodsId">复制</p>
                  </template>
                  <div class="orderNum">{{ row.goodsId }}</div>
                </el-tooltip>
                <div class="tagBox">
                  <el-popover
                    placement="top"
                    :width="557"
                    trigger="hover"
                    v-for="(item, index) in row.remarkList"
                    :key="index"
                    @after-enter="showEvent(row.goodsId, item.typeId)"
                  >
                    <template #reference>
                      <div
                        class="remarkLabel"
                        :style="{
                          backgroundColor: item.color
                        }"
                      >
                        {{ item.word }}
                      </div>
                    </template>
                    <el-table
                      :data="remarkLists"
                      :header-cell-style="{
                        background: '#F5F7FA',
                        color: '#000',
                        'text-align': 'center'
                      }"
                      :cell-style="{ 'text-align': 'center' }"
                    >
                      <el-table-column
                        width="170"
                        property="content"
                        label="内容"
                      >
                        <template #default="{ row }">
                          <div class="textOverflow" :title="row.content">
                            {{ row.content }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        width="170"
                        property="createTime"
                        label="时间"
                      >
                        <template #default="{ row }">
                          <div class="textOverflow" :title="row.createTime">
                            {{ row.createTime }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column
                        width="90"
                        property="typeName"
                        label="类型"
                      ></el-table-column>
                      <el-table-column
                        width="100"
                        property="createUserName"
                        label="操作人"
                      >
                        <template #default="{ row }">
                          <div class="textOverflow" :title="row.createUserName">
                            {{ row.createUserName }}
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-popover>
                </div>
              </div>
            </div>
            <div v-else class="mainImg">
              <span
                class="vxe-table--expanded hidden"
                v-if="
                  Object.prototype.toString
                    .call(row.publishShops)
                    .slice(8, -1) != 'Array'
                "
                ><i class="vxe-table--expand-btn vxe-icon--arrow-right"></i
              ></span>
              <div class="left" :class="{ dot: row.layRed }">
                <el-popover
                  placement="right-start"
                  trigger="hover"
                  width="auto"
                >
                  <el-image
                    style="width: 200px; height: 200px"
                    :src="row.url"
                    fit="contain"
                  ></el-image>
                  <template #reference>
                    <el-image
                      style="width: 70px; height: 70px"
                      :src="row.url"
                      fit="contain"
                    ></el-image>
                  </template>
                </el-popover>
              </div>
              <div class="right">
                <el-tooltip placement="top">
                  <template #content>
                    <p
                      style="cursor: pointer"
                      v-copy="row.nameEn ? row.nameEn : row.nameCn"
                    >
                      复制
                    </p>
                  </template>
                  <h3 :title="row.nameEn ? row.nameEn : row.nameCn">
                    {{ row.nameEn ? row.nameEn : row.nameCn }}
                  </h3>
                </el-tooltip>
                <div>
                  <el-tag v-if="row.isTort == 0" type="danger">侵</el-tag>
                  <div class="labelTag">
                    <el-tag
                      v-for="(item, index) in row.labelList"
                      :key="index"
                      >{{ item.name }}</el-tag
                    >
                  </div>
                </div>
                <div
                  v-if="row.enableCustom == 1"
                  style="color: rgb(24 144 255)"
                >
                  定制品
                </div>
              </div>
            </div>
          </template>
          <template #content="{ row }">
            <vxe-table align="center" auto-resize :data="row.publishShops">
              <vxe-column field="shopName" title="店铺名称">
                <template #default="{ row }">
                  <div class="publishShops" :title="row.shopName">
                    {{ row.shopName }}
                  </div>
                </template>
              </vxe-column>
              <vxe-column field="tempDomain" title="临时域名"></vxe-column>
              <vxe-column field="shopPlatform" title="店铺平台">
                <template #default="{ row }">
                  {{ shopPlatformWord(row.shopPlatform) }}
                </template>
              </vxe-column>
              <vxe-column field="firstTime" title="刊登时间"></vxe-column>
              <vxe-column field="status" title="状态">
                <template #default="{ row }">
                  <span>{{ statusName(row.status) }}</span>
                </template>
              </vxe-column>
              <vxe-column field="createTime" title="上架/下架时间">
              </vxe-column>
              <vxe-column field="operation" title="操作">
                <template #default="item">
                  <div class="operate">
                    <el-popconfirm
                      title="是否下架商品？"
                      @confirm="pullShelves(row, item.row)"
                    >
                      <template #reference>
                        <el-button
                          type="text"
                          class="primaryBtn"
                          :disabled="item.row.status == 4"
                        >
                          下架
                        </el-button>
                      </template>
                    </el-popconfirm>
                    <el-popconfirm
                      title="是否删除该店铺？"
                      @confirm="deleteList(row, item.row)"
                    >
                      <template #reference>
                        <el-button type="text" class="deleteBtn"
                          >删除
                        </el-button>
                      </template>
                    </el-popconfirm>
                  </div>
                </template>
              </vxe-column>
            </vxe-table>
          </template>
        </vxe-column>
        <vxe-column field="code" title="商品SPU" align="center">
          <template #default="{ row }">
            <el-tooltip placement="top">
              <template #content>
                <p style="cursor: pointer" v-copy="row.code">复制</p>
              </template>
              <p>{{ row.code }}</p>
            </el-tooltip>
          </template>
        </vxe-column>
        <vxe-column field="categoryName" title="品类" align="center">
        </vxe-column>
        <vxe-column field="source" title="来源" align="center">
          <template #default="{ row }">
            <p class="mode">{{ mode(row.mode) }}</p>
            <p class="mode">{{ row.source }}</p>
          </template>
        </vxe-column>
        <vxe-column field="price" title="商品售价 / 原价（USD）" align="center">
          <template #default="{ row }">
            {{ row.expectPrice ? row.expectPrice : '-' }} /
            {{ row.originalPrice ? row.originalPrice : '-' }}
          </template>
        </vxe-column>
        <vxe-column field="layTime" title="搁置时间" align="center">
        </vxe-column>
        <vxe-column title="操作" align="center" width="160">
          <template #default="{ row }">
            <div class="operate">
              <el-button
                type="text"
                class="primaryBtn"
                @click="openDetail(row)"
              >
                详情
              </el-button>
              <el-popconfirm title="是否下架商品？" @confirm="pullShelves(row)">
                <template #reference>
                  <el-button
                    type="text"
                    class="primaryBtn"
                    :disabled="
                      Object.prototype.toString
                        .call(row.publishShops)
                        .slice(8, -1) != 'Array'
                    "
                  >
                    下架
                  </el-button>
                </template>
              </el-popconfirm>
              <el-button type="text" class="primaryBtn" @click="remarks(row)">
                查看备注
              </el-button>
              <el-popconfirm title="是否删除该商品?" @confirm="deleteList(row)">
                <template #reference>
                  <el-button type="text" class="deleteBtn"> 删除 </el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <div class="flex-pagination page-fixed">
      <div>
        <el-checkbox
          v-model="checkedList"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          已选<span style="color: #1890ff">{{
            selectGoodsId ? selectGoodsId.length : 0
          }}</span
          >条
        </el-checkbox>
      </div>
      <div>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          :page-sizes="paginationArr"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginationTotal"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { sourceData } from '@/assets/js/staticData.js'
import { reactive, toRefs, onMounted, computed, watch } from 'vue'
import ElTableList from '@/components/elTable/index.vue'
import { useRouter } from 'vue-router'
import { getRemarkTypes as remarkTypes } from '@/api/goods/quotedPrice.js'
import {
  updateStatus, // 搁置批量下架
  del // T08:刊登商品删除
} from '@/api/goods/goodsPublish.js'
import Hooks from '../../js/hooks.js'
import TableHandle from '../../js/tableHandle.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { resetForm } from '@/utils/tool.js'
export default {
  components: { ElTableList },
  setup(props, { emit }) {
    let router = useRouter()
    const state = reactive({
      sourceData,
      categoryIdArr: [], // 品类
      showSlot: false,
      time: [], // 时间范围
      form: {
        sortName: 1,
        layFlag: 1,
        timeType: 5,
        mode: '',
        source: '',
        skuType: '',
        categoryId: '',
        isPublish: '',
        goodsStatus: '',
        searchType: 1,
        searchText: '',
        tortStatus: '',
        remarkTypeIds: '',
        sortType: 'desc',
        start: '',
        shopId: '',
        end: '',
        page: {
          pageNo: 1,
          pageSize: 30
        }
      },
      ischeck: false,
      dataList: [],
      packageList: [],
      ivtPurchaseDetailId: [],
      current: 1, //当前页码
      size: 30, //一页多少条
      paginationTotal: 0, //分页总数据条数
      paginationArr: [30, 100, 300, 500], //分页每页选择条数默认数据
      selectGoodsId: [], // 当前勾选的商品id
      checkOptions: [], // 所有可能选择的商品
      checkedList: false, // 全选按钮
      isIndeterminate: false, // 全选按钮状态
      remakeOptions: [], // 备注列表
      publishShop: [],
      remarkLists: [],
      goodsSource: '',
      loading: false
    })
    let hooks = Hooks(state)
    let tableHandle = TableHandle(state, hooks)
    function initHook() {
      hooks.init()
    }
    const getPackageRemarks = ({ glayRemark }) => {}
    // 删除
    const deleteList = ({ id }, pamamsId = '') => {
      let pamams = { goodsId: id }
      if (pamamsId) {
        pamams.id = pamamsId.id
      }
      del(pamams).then(res => {
        if (res.code == 200) {
          ElMessage.success('删除成功！')
          hooks.init()
          state.selectGoodsId = []
          emit('changeRedPoint')
        } else {
          ElMessage.error({ message: res.message })
        }
      })
    }

    // 当勾选状态发生变化时
    watch(
      () => state.selectGoodsId,
      newVal => {
        if (state.dataList.length) {
          state.ischeck = newVal.length ? true : false
        }
      },
      { deep: true }
    )

    // 打开弹框
    const batchRemove = () => {
      if (!state.selectGoodsId.length) {
        ElMessage.warning('请选择商品! ')
      } else {
        ElMessageBox.confirm('是否批量下架商品？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }).then(() => {
          const params = {
            goodsId: state.selectGoodsId.toString(),
            status: 0
          }
          pullShelvesApi(params)
        })
      }
    }
    // 打开弹框
    const pullShelves = ({ id }, item = '') => {
      const params = {
        goodsId: id,
        status: 0
      }
      if (item) {
        params.id = item.id
      }
      pullShelvesApi(params)
    }
    // 下架接口
    const pullShelvesApi = params => {
      updateStatus(params).then(res => {
        if (res.code == 200) {
          emit('changeRedPoint')
          hooks.init()
          if (res.data == '') {
            ElMessage.success('操作成功！')
          } else {
            ElMessage.error({ message: res.data })
          }
        } else {
          ElMessage.error({ message: res.message })
        }
      })
    }
    // 备注
    const remarks = ({ glayRemark }) => {
      ElMessageBox.alert(glayRemark, '备注', {
        confirmButtonText: '关闭',
        callback: action => {}
      })
    }
    onMounted(() => {
      hooks.categoryIdList()
      hooks.getRemarkTypes()
      hooks.publishShopSelects()
      hooks.init()
    })
    // 获取品类选择信息
    const checkedDept = param => {
      if (param) {
        state.form.categoryId = param[param.length - 1]
      } else {
        state.form.categoryId = ''
      }
    }
    // 查询备注类型
    const getRemarkTypes = () => {
      let params = {
        useScope: '1'
      }
      remarkTypes(params).then(res => {
        if (res.code == 200) {
          let arr = []
          res.data.forEach(item => {
            let obj = {
              color: item.color,
              value: item.id,
              label: item.name,
              checked: false,
              word: item.word
            }
            arr.push(obj)
          })
          state.remakeOptions = arr
        } else {
          ElMessage.error(res.message)
        }
      })
    }
    const remarkListNew = computed(() => val => {
      const list = state.remakeOptions.find(item => {
        return item.value == val
      })
      return list
    })
    // 进入详情
    let openDetail = ({ id }) => {
      router.push({
        path: '/goods/goodsPublish/detail/index',
        query: {
          id,
          type: 'layList'
        }
      })
    }
    // 重置
    const reset = () => {
      const resetForms = {
        sortName: 1,
        layFlag: 1,
        timeType: 5,
        searchType: 1,
        sortType: 'desc',
        mode: '',
        skuType: '',
        isPublish: '',
        goodsStatus: '',
        tortStatus: '',
        remarkTypeIds: '',
        shopId: ''
      }
      state.goodsSource = ''
      state.time = []
      state.remakeOptions.forEach(item => {
        item.checked = false
      })
      resetForm(state.form, resetForms)
      hooks.init()
    }
    return {
      ...toRefs(state),
      getPackageRemarks,
      remarks,
      pullShelves,
      batchRemove,
      deleteList,
      checkedDept,
      remarkListNew,
      getRemarkTypes,
      openDetail,
      reset,
      ...hooks,
      ...tableHandle,
      initHook
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-form-inline {
  background: #fff;
  padding: 16px 24px;
  .el-select {
    :deep(.el-input__inner) {
      width: 140px;
    }
  }

  .el-cascader {
    :deep(.el-input__inner) {
      width: 120px;
    }
  }
  :deep(.daterange) {
    .el-range-separator {
      box-sizing: content-box;
    }
  }
  .form_btn {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    :deep(.el-form-item) {
      margin-bottom: 10px;
    }
  }
}
.pullShelves {
  color: #ff0000;
}
.middle {
  padding: 16px 0;
  background: #f8fafbff;
}
.extraHeader {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
}
.tagBox {
  display: flex;
  margin-left: 16px;
  .tag {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    width: 20px;
    height: 20px;
    color: white;
    margin-left: 5px;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--el-tag-font-size);
  }
}
:deep(.vxe-cell) {
  .vxe-table--expanded {
    width: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      color: #3a8ee6;
    }
  }
  .mode {
    flex-basis: 100%;
    width: 100%;
    text-align: center;
  }
}
.mainImg {
  display: flex;
  .left {
    width: 70px;
    height: 70px;
    display: flex;
    align-content: center;
    justify-content: center;
    background: #fff;
    flex-basis: 70px;
    margin-right: 10px;
    position: relative;
    img {
      display: block;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .dot::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 6px;
    background: #ff0000;
    border-radius: 50%;
    transform: translateX(-110%);
  }
  .right {
    width: 200px;
    flex-basis: 200px;
    text-align: left;
    h3 {
      width: 200px;
      height: 22px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 5px;
    }
    div {
      span {
        margin-right: 8px;
        margin-bottom: 6px;
      }
      margin-bottom: 5px;
    }
  }
}
.hidden {
  .vxe-table--expand-btn {
    color: #b3b5b9 !important;
    cursor: no-drop;
  }
}
:deep(.col--last .vxe-cell) {
  flex-wrap: wrap;
  .primaryBtn {
    cursor: pointer;
    text-align: center;
    padding: 2px 0;
    flex-basis: 100%;
    min-height: 28px;
    margin-left: 0;
  }
  .deleteBtn {
    display: block;
    cursor: pointer;
    color: #fd4c60ff;
    text-align: center;
    padding: 2px 0;
    flex-basis: 100%;
    margin-left: 0;
    min-height: 28px;
  }
}
.operate {
  display: flex;
  flex-wrap: wrap;
}
:deep(.col--expand) {
  .vxe-cell {
    display: flex;
    flex-wrap: nowrap;
  }
}
.labelTag {
  max-height: 60px;
  overflow: hidden;
}
.remarkLabel {
  padding: 0px 5px;
  border-radius: 4px;
  margin-left: 10px;
  color: #fff;
  min-width: 24px;
  text-align: center;
}
.pageView {
  padding: 20px;
}
:deep(.vxe-table--render-default .vxe-body--expanded-cell) {
  padding: 20px;
}
:deep(.el-form--inline .el-form-item) {
  margin-bottom: 16px;
}
.demo-form-inline {
  padding: 0 24px;
}
</style>
