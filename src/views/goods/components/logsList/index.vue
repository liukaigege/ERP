<!--
 * @Descripttion: 'logsList 日志列表'
 * @version: 2.0
 * @Author: 王新国
 * @Date: 2021-09-06 00:00:00
 * @LastEditors: 王新国
 * @LastEditTime: 2021-09-06 00:00:00
-->
<template>
  <div class="container">
    <vxe-table
      :data="form.list"
      keep-source
      align="center"
      :height="tableH"
      show-overflow
      class="erp-vxe-table"
      :export-config="{}"
      :scroll-y="{ enabled: true, gt: 20 }"
      highlight-hover-row
      :auto-resize="true"
      border="inner"
    >
      <vxe-table-column align="center" title="操作内容" width="70%">
        <template #default="{ row }">
          <div class="font12" v-if="row.content">
            <p>{{ row.content }}</p>
            <!-- <el-tooltip
              class="item"
              effect="light"
              :content="row.content"
              placement="top-end"
            >
              <p>{{ row.content }}</p>
            </el-tooltip> -->
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column align="center" title="操作人" width="15%">
        <template #default="{ row }">
          <div class="font12" v-if="row.userName">
            <p>{{ row.userName }}</p>
            <!-- <el-tooltip
              class="item"
              effect="light"
              :content="row.userName"
              placement="top-end"
            >
              <p>{{ row.userName }}</p>
            </el-tooltip> -->
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column align="center" title="操作时间" width="15%">
        <template #default="{ row }">
          <div class="font12" v-if="row.createTime">
            <!-- <el-tooltip
              class="item"
              effect="light"
              :content="row.createTime"
              placement="top-end"
            >
              <p>{{ row.createTime }}</p>
            </el-tooltip> -->
            <p>{{ row.createTime }}</p>
          </div>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import { reactive, toRefs, onMounted } from 'vue'
import { logsList } from './composables/api.js'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
export default {
  props: {
    tableHeight: {
      //表单高度
      type: String,
      default: '0'
    },
    goodsId: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const route = useRoute()
    const goodsId = route.query.id || props.goodsId || null
    const state = reactive({
      tableH: '400',
      form: {
        list: []
      }
    })
		initFn()
		function initFn(id=null){
			logsList({
				goodsId:id||goodsId,
				logType: 2,
				page: {
					pageNo: 1,
					pageSize: 1000
				}
			})
				.then(res => state.form.list = res.data.dataList)
		}

    onMounted(() => {
      //动态设置表单高度
      if (props.tableHeight == '0') {
        state.tableH = document.body.clientHeight - 300 + ''
      } else {
        state.tableH = props.tableHeight
      }
    })
    return {
			initFn,
      ...toRefs(state)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  background-color: #fff;
  z-index: 6;
}
.font12 {
  font-size: 12px;
}
</style>
