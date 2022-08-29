<template>
  <div class="addTable">
    <el-table
			ref='tableRef'
      :data="dataList"
			current-row-key='goodsId'
			row-key='goodsId'
			style="width: 100%"
			@selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" :selectable="selectable"> </el-table-column>
      <el-table-column label="图片" width="140">
        <template #default="scope">
          <el-popover placement="right" :width="240" trigger="hover">
            <goodsImg :data="proverData(scope.row.url || defaultImg)" />
            <template #reference>
              <div class="goodsImg">
                <img :src="scope.row.url || defaultImg" alt="" />
              </div>
            </template>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
        <template #default="scope">
          <el-tooltip placement="top" :offset="10">
            <template #content>
              <a style="color: #fff" v-copy="scope.row.nameEn || scope.row.nameCn"
                >复制</a
              >
            </template>
            <div class="fmt-title" :title="scope.row.nameEn || scope.row.nameCn">
              {{ scope.row.nameEn || scope.row.nameCn }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="来源平台" width="140">
        <template #default="scope">
          <p >{{ scope.row.source }}</p>
          <el-button
            type="text"

            v-if="scope.row.collectionUrl && (scope.row.mode == 0 || scope.row.mode == 1)"
            @click="goCollectionUrl(scope.row.collectionUrl)"
            >商品来源</el-button
          >

          <el-button
            type="text"

            v-if="scope.row.referenceUrl && (scope.row.mode == 2 || scope.row.mode == 4 || scope.row.mode == 3) "
            @click="goCollectionUrl(scope.row.referenceUrl)"
            >商品来源</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="商品类型" width="140">
        <template #default="scope">
          {{ scope.row.enableCustom === 0 ?'普通商品' :'定制商品' }}
        </template>
      </el-table-column>
      <el-table-column label="添加方式">
        <template #default="scope">
          <p v-if="scope.row.mode == 0">平台采集</p>
          <p v-if="scope.row.mode == 1">独立站采集</p>
          <p v-if="scope.row.mode == 2">手动添加</p>
          <p v-if="scope.row.mode == 3">表格导入</p>
					<p v-if="scope.row.mode == 4">复制</p>
        </template>
      </el-table-column>
      <el-table-column label="售价 (USD)">
        <template #default="scope">
          {{ scope.row.expectPrice }}
        </template>
      </el-table-column>
      <el-table-column label="品类" width="180">
        <template #default="scope">
          <span
            @click="
              scope.row.activationFailed !== 4 ? optionFun('setCategory', scope) : null
            "
            >{{ scope.row.categoryStr }}</span
          >
          <el-button
            :disabled="scope.row.activationFailed == 4"
            v-if="!scope.row.categoryStr"
            type="text"

            @click="optionFun('setCategory', scope)"
            >未设置品类</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="状态" width="140">
        <template #default="scope">
          {{ scope.row.statusName }}
          {{
            scope.row.activationFailedName ? "-" + scope.row.activationFailedName : null
          }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template #header>
          <div @click="handleSortChange" class="sort-box">
            <span>创建时间</span>
            <span class="caret-wrapper">
              <i class="sort-caret ascending" :class="{ isAsc: order }"></i>
              <i class="sort-caret descending" :class="{ isDesc: !order }"></i>
            </span>
          </div>
        </template>
        <template #default="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template #default="scope">
          <div class="btn">
            <!-- :disabled="activeDisabled(scope.row)" -->
            <el-button
              type="text"

              @click="optionFun('activation', scope)"
              :disabled="activeDisabled(scope.row)"
              >激活</el-button
            >
            <el-button type="text" :disabled="scope.row.activationFailed == 4"  @click="optionFun('edit', scope)"
              >编辑</el-button
            >
            <!-- scope.row.categoryStr ? false :true -->
            <!-- <el-button type="text"  style="color: red" @click="optionFun('del', scope)">删除</el-button> -->

            <el-popconfirm
              @confirm="optionFun('del', scope)"
              title="商品删除后将不可恢复，确认删除？ "
            >
              <template #reference>
                <el-button
                  :disabled="scope.row.activationFailed == 4"
                  type="text"

                  style="color: red"
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
						<el-popconfirm
							@confirm="copyGoods(scope.row)"
							title="是否复制该商品？ "
						>
							<template #reference>
								<el-button
									type="text"

								>复制</el-button
								>
							</template>
						</el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, watch ,ref} from "vue";
import {copy} from '@/api/goods/addGoods.js'
import goodsImg from "@/views/order/orderManagement/components/components/goodsImg.vue";
import defaultImg from "../../../../../assets/image/mr_bg@2x.png";
export default {
  props: {
    modelValue: Array,
  },
  components: { goodsImg },
  setup(props, { emit }) {
    const data = reactive({
      order: false,
      dataList: [],
      selected: [],
    });
		const tableRef = ref(null)
    watch(
      () => props.modelValue,
      (a) => {
        data.dataList = a;
				tableRef.value.clearSelection()
				data.selected = []
      }
    );

    const proverData = (item) => {
      return {
        goods: {
          skuImg: item,
        },
      };
    };

    function optionFun(type, scope) {
      const { $index, row } = scope;
      emit(type, { row, index: $index });
    }

    function handleSelectionChange(val) {
			console.log(val)
      data.selected = val;
    }

		function copyGoods(row){
			copy({goodsId:row.goodsId}).then(res=>{
				if(res.code === 200){
					emit('refresh')
				}
			})

		} // 复制商品



		function handleSortChange() {
      data.order = !data.order;
      emit("sort-change", data.order ? "asc" : "desc");
    }

    function goCollectionUrl(url) {
      window.open(url);
    }

    function selectable(row, index) {
      if (row.activationFailed == 4) return false;
      return true;
    }

    function activeDisabled(row) {
      if (!row.categoryStr) return true;
      if (row.activationFailed == 4) return true;
      return false;
    } // 激活的按钮是否置灰

    onMounted(() => {
      data.dataList = props.modelValue;
    });

    return {
      ...toRefs(data),
      proverData,
      optionFun,
      handleSelectionChange,
      handleSortChange,
      defaultImg,
      goCollectionUrl,
      activeDisabled,
      selectable,
			copyGoods,
			tableRef
    };
  },
};
</script>

<style lang="scss" scoped>
.addTable {
}

.fmt-title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.sort-box {
  cursor: pointer;
  .isDesc {
    border-top-color: #409eff;
  }
  .isAsc {
    border-bottom-color: #409eff;
  }
}
.goodsImg {
  min-width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: auto;
    height: auto;
    max-width: 70px;
    max-height: 70px;
  }
}

.btn {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  :deep(.el-button) {
    margin: 0 !important;
  }
}
:deep(.el-table .el-table__cell) {
  text-align: center !important;
}
</style>
