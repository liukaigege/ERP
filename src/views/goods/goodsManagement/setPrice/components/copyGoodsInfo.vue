<template>
	<el-dialog title="复制基本信息" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
      <div>
        <el-radio v-model="value" label="0">复制信息</el-radio>
        <el-radio v-model="value" label="1">不复制信息</el-radio>
      </div>
      <vxe-table border ref="xTable1" height="300" :data="tableData" :radio-config="{highlight: true}" row-id="id" :radioConfig="{checkRowKey: defaultSelecteRow}" @radio-change="radioChangeEvent" v-if="value == '0'">
        <vxe-column type="radio" width="50"></vxe-column>
        <vxe-column field="mainImgUrl" title="商品图片" width="90">
          <template #default="{ row }">
            <el-image style="width: 70px; height: 70px" :src="row.mainImgUrl" fit="contain"></el-image>
          </template>
        </vxe-column>
        <vxe-column field="nameEn" title="商品名称">
          <template #default="{ row }">
            <div class="textOverflow_3" :title="row.nameEn">{{ row.nameEn }}</div>
          </template>
        </vxe-column>
      </vxe-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading">继续</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
  import { ref, reactive, toRefs } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useStore } from 'vuex'

  const props = defineProps({
    selectRows: {
      type: Array,
      default: {}
    }
  })
  const emit = defineEmits(['closeEvent'])
  let store = useStore()
  let state = reactive({
    ifShow: true,
    loading: false,
    value: '0',
    tableData: props.selectRows,
    selectRows: props.selectRows[0],
    defaultSelecteRow: props.selectRows[0].id
  })
  let router = useRouter()

  let radioChangeEvent = ({ row }) => {
    state.selectRows = row
  }

  // 关闭弹框
  let closeEvent = (refresh = false) => { // refresh为true则刷新列表
    state.ifShow = false
    setTimeout(() => {
      emit('closeEvent', refresh)
    }, 500)
  }

  // 取消回调
  let cancelEvent = () => {
    closeEvent()
  }

  // 确认回调
  let affirmEvent = () => {
    closeEvent()
    store.dispatch('goodsInfo/setAddGoodsInfoActions', props.selectRows)
    if (state.value == '0') {
      store.dispatch('goodsInfo/setCopyGoodsInfoActions', state.selectRows)
    } else {
      store.dispatch('goodsInfo/setCopyGoodsInfoActions', {})
    }
    router.push({
      name: 'AddGroupgoods'
    })
  }

  let { ifShow, loading, value, tableData, defaultSelecteRow } = toRefs(state)
</script>

<style lang="scss" scoped>
</style>