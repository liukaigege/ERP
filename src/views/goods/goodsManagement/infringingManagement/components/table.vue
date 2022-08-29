<!--
 * @Descripttion: 'table.vue 表单'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-07 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-07 00:00:00
-->
<template>
  <div class="tableContent">
    <el-table
      :data="tableData"
      :border="true"
      :header-row-style="{
        'background-color': '#FAFAFA',
        color: '#242526',
        width: '100%'
      }"
    >
      <!-- <el-table-column type="selection" width="55" align="center">
      </el-table-column> -->
      <el-table-column width="360" label="商品信息" align="center">
        <template #default="{ row }">
          <div class="clearfix goodsInfo" v-if="row.goodPhotoThumbnailUrl">
            <div class="imgContainer fl">
              <el-popover placement="right" :width="230" trigger="hover">
                <template #reference>
                  <el-image
                    style="max-width: 100%; max-height: 100%"
                    :src="row.goodPhotoThumbnailUrl"
                    fit="contain"
                  ></el-image>
                </template>
                <el-image
                  style="width: 200px; height: 200px"
                  :src="row.goodPhotoUrl"
                  fit="contain"
                ></el-image>
              </el-popover>
            </div>
            <div class="goodsInfoDetail fl">
              <el-tooltip effect="light" placement="top-start">
                <template #content>
                  <p style="cursor: pointer" v-copy="row.nameEn">复制</p>
                </template>
                <p
                  class="goodsTitle"
                  :title="row.nameEn ? row.nameEn : row.nameCn"
                >
                  {{ row.nameEn ? row.nameEn : row.nameCn }}
                </p>
              </el-tooltip>
              <p
                class="goodsTags"
                style="max-height: 56px"
                v-if="row.labelName"
              >
                <span v-for="item in labelNames(row.labelName)" :key="item">{{
                  item
                }}</span>
              </p>
              <p class="custom" v-if="row.skuType == 3">
                <span>定制品</span>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="360" label="样例" align="center">
        <template #default="{ row }">
          <div class="clearfix goodsInfo">
            <div class="imgContainer fl" v-if="row.tortPhotoThumbnailUrl">
              <el-popover placement="right" :width="350" trigger="hover">
                <template #reference>
                  <el-image
                    style="max-width: 100%; max-height: 100%"
                    :src="row.tortPhotoThumbnailUrl"
                    fit="contain"
                  ></el-image>
                </template>
                <el-image
                  style="max-width: 350px; max-height: 350px"
                  :src="row.tortPhotoUrl"
                  fit="contain"
                ></el-image>
              </el-popover>
            </div>
            <div class="goodsInfoDetail fl" v-if="row.words">
              <p class="goodsTags">
                <span
                  v-for="item in row.words?.split(',')"
                  :key="item"
                  class="sampleInfoTags"
                  >{{ item }}</span
                >
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="category" label="品类" align="center">
      </el-table-column>
      <el-table-column prop="expectPrice" label="售价（USD）" align="center">
      </el-table-column>
      <el-table-column prop="source" label="来源" align="center">
        <template #default="{ row }">
          <div class="">
            <!-- 添加方式 0平台采集 1独立站采集 2手动添加 3表格导入（一级）	 -->
            <p>
              {{
                row.mode == 1
                  ? '独立站采集'
                  : row.mode == 2
                  ? '手动添加'
                  : row.mode == 3
                  ? '表格导入（一级）'
                  : '平台采集'
              }}
            </p>
            <p class="purpleColor">{{ row.source }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="applyBy" label="申请人" align="center">
      </el-table-column>
      <el-table-column prop="applyTime" label="申请时间" align="center">
      </el-table-column>
      <el-table-column prop="reason" label="侵权原因" align="center" width="80">
        <template #default="{ row }">
          <p>
            {{
              row.reason == 1
                ? '文字侵权'
                : row.reason == 2
                ? '图片侵权'
                : '图文侵权'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column
        v-if="listStatus == 2"
        prop="examineBy"
        label="审核人"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-if="listStatus == 2"
        prop="examineTime"
        label="审核时间"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="审核结果"
        align="center"
        width="150"
        v-if="listStatus == 2"
      >
        <template #default="{ row }">
          <p>
            {{
              row.status == 1
                ? '待审核'
                : row.status == 2
                ? '未侵权'
                : row.status == 3
                ? '侵权不可用'
                : '侵权可用'
            }}
          </p>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center" width="90">
        <template #default="{ row }">
          <el-button type="text" @click="toDetail(row.id)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { reactive, toRefs, getCurrentInstance, toRaw, computed } from 'vue'
import { useRouter } from 'vue-router'
export default {
  props: {
    tableData: {
      type: Array,
      default: []
    },
    listStatus: {
      type: [String , Number],
      default: 1
    }
  },
  setup(props) {
    // const { proxy } = getCurrentInstance()
    let router = useRouter()
    console.log('table data =>', toRaw(props.tableData))
    const state = reactive({
      // list: props.tableData
    })
    function toDetail(id) {
      router.push({
        path: '/goods/goodsManagement/infringingDetail/index',
        query: {
          id,
          listStatus: props.listStatus,
          from: 1
        }
      })
    }
    const labelNames = computed(() => param => {
      let arr = []
      if (param) {
        arr = param.split(',')
      }
      return arr
    })

    return {
      ...toRefs(state),
      toDetail,
      labelNames
    }
  }
}
</script>
<style lang="scss" scoped>
.tableContent {
  margin-top: 10px;
  .imgContainer {
    width: 70px;
    height: 70px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    img {
      max-height: 100%;
      max-width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .goodsInfoDetail {
    margin-left: 8px;
    font-size: 12px;
    width: 260px;
    span {
      display: inline-block;
      color: #1890ff;
      border-radius: 2px;
      margin-right: 8px;
    }
    .goodsTitle {
      height: 26px;
      line-height: 26px;
      white-space: nowrap;
      overflow: hidden;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
      text-align: left;
    }
  }
  .custom {
    text-align: left;
  }
  .goodsTags {
    text-align: left;
    overflow: hidden;
    span {
      padding: 0 10px;
      border: 1px solid #91d5ff;
      background-color: #e6f7ff;
      margin-bottom: 5px;
    }
    .sampleInfoTags {
      border: 1px solid #ffa39e;
      background-color: #fff1f0;
      color: #ff4d4f;
    }
  }
  .purpleColor {
    color: #849cf5;
  }
  .questionIconContainer {
    position: absolute;
    right: 0;
    top: 0;
    .questionIcon {
      color: #000;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background-color: #fff849;
      text-align: center;
      line-height: 16px;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>