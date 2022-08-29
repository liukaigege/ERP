<template>
  <!-- 未通过 -->
  <div class="headfailTable">
    <el-table :data="data" default-expand-all border row-key="serialNumber" tooltip-effect @selection-change="handleSelectionChange" ref="xTable1">
      <el-table-column type="expand" width="1">
        <template #default="{row}">
          <p class="expand-content" v-if="row.reason!=null">{{row.reason}}</p>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="50px" align="center"></el-table-column>
      <el-table-column prop="serialNumber" label="对账单号" align="center" min-width="150"> </el-table-column>
      <el-table-column label="供应商" prop="supplierName" show-overflow align="center" min-width="120"></el-table-column>
      <el-table-column label="结算方式" prop="settlementTypeName" width="120" align="center">
        <template #default="{row}">
          <p v-if="row.settlementType == '2'">账期({{row.settlementValue}}天)
          </p>
          <span v-else>
            {{{"1":'预付',"3":"货到付款","4":"款到发货"}[row.settlementTypeName]}}
            <span v-if="row.settlementType==1">({{row.settlementValue}}{{{'1':'%','2':'元'}[row.settlementUnit]}})</span>
        </span>
      </template>
      </el-table-column>
			<el-table-column label="采购单数" prop="purchaseQuantity" width="100" align="center"></el-table-column>
			<el-table-column label="入库单数" prop="putInStorageQuantity" width="100" align="center"></el-table-column>
			<el-table-column label="SKU种类" prop="skuQuantity" width="100" align="center"></el-table-column>
			<el-table-column label="对账商品数" prop="goodsQuantity" width="100" align="center"></el-table-column>
			<el-table-column label="对账金额" prop="totalAmount" width="100" align="center">
        <template #default="{row}">
        <div >¥{{row.totalAmount?row.totalAmount:'0'}}</div>
        </template>
      </el-table-column>
			<el-table-column label="创建时间" prop="createTime" width="110" align="center">
        <template #default="{row}">
        <div :class="!timeLimt(row.createTime)?'redColor':''">{{row.createTime}}</div>
        </template>
      </el-table-column>
			<el-table-column label="申请人" prop="createByName" width="100" align="center"></el-table-column>
			<el-table-column label="回执文件" prop="fileQuantity" width="100" align="center"></el-table-column>
			<el-table-column label="操作" align="center" width="320" fixed="right">
				<template #default="{row}">
         <div class="tableOption">
					<el-button type="text" @click="resubmit(row.id,2)" v-permission="'reconciliationApplication_singleAudit:btn'">提交审核</el-button>
            	<UploadImg ref="uploadImg" :data="[]" id="uploadImg" moduleName="spe" :addNameWithSize="true" :isTrigger="true" :showFileList="false" :isCompress="true" :isNoFilieList="true" @getFileList="getImgList"  :limit="10" :maxSize="20" :notAcceptedType="notAcceptedType">
						<template #trigger>
							<el-button type="text" @click="clearn(row.id)" >上传回执</el-button>
						</template>
					</UploadImg>
					<!-- <el-button type="text">打印</el-button> -->
					<el-button type="text" @click="jumpEdit(row.id)">编辑</el-button>
					<el-popconfirm icon="el-icon-info" title="是否删除对账单？" @confirm="deleteList(row)">
						<template #reference>
							<el-button type="text" style="color:#FD4C60;" v-permission="'reconciliationApplication_singleDelete:btn'">删除</el-button>
						</template>
					</el-popconfirm>
          </div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import UploadImg from '@/components/uploadImg/index.vue'
import { queryBatchDelete, queryBatchUploadReceipt } from '../api/api.js'
import { onActivated, onMounted, reactive, ref, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
export default {
  props: {
    tabelData: { // 列表数据
      type: Array,
      default: () => []
    },
    notAcceptedType: {
      Type: Array,
      default: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'jfif']
    }
  },
  components: {
    UploadImg
  },
  emits: ['selecDataList', 'deleteInit', 'batchApprove', 'updateList'],
  setup(props, context) {
    //  const dataProps = props
    const uploadImg = ref(null)
    const router = useRouter()
    const state = reactive({
      xTable1: null,
      data: [],
      checkedList: false,
      indeterminate: false,
      checkData: [],//选择数据
      listRepet: [],//去重
      imgId: '',
    })
    //监听头部按钮改变清空选择框
    watch(() => props.tabelData, val => {
      // if (val.length) {
      // 	state.data = val.map(item => ([
      // 		{ ...item, orderItemsFlag: false, isChecked: false, content: '222' },
      // 		{ ...item, orderItemsFlag: true, content: '222' }])).flat()
      // }
      let arr = []
      if (val.length) {
        val.forEach(item => {
          arr.push({ ...item, orderItemsFlag: false, isChecked: false })
          // arr.push({...item,orderItemsFlag:true})
        })
      }
      state.data = arr
    })
    onMounted(() => {

    })
    //提交审核
    function resubmit(id, type) {
      context.emit('batchApprove', id, type)
    }
    function handleSelectionChange(row) {
      console.log(row, 'row')
      state.checkData = row.map(item => item.id)
      context.emit('selecDataList', state.checkData)
    }
    function jumpEdit(id) {
      router.push({ name: 'reconciliationEdit', params: { id: id, active: 2 } })
    }
    //删除
    function deleteList(row) {
      context.emit('deleteInit', row.id)
    }
    //图片
    function clearn(id) {
      state.imgList = []
      state.imgId = id
      resertUpload()
    }
    function resertUpload() {
      uploadImg.value.resert()
    }
    function getImgList(value) {
      if (state.imgList?.length >= 10) {
        ElMessage.error('最多可添加10张图片')
        return false
      }
      value = value.filter(val => val != undefined)
      state.imgList = value.map(item => item.fileUrl)
      // console.log(state.imgList,'图片');
      if (state.imgList.length == 0) return
      let params = {
        id: state.imgId,
        urlList: state.imgList
      }
      queryBatchUploadReceipt(params).then(res => {
        context.emit('updateList')
      })
    }
    function timeLimt(data = '2021-11-25 17:09:00') {
      const inTimestamp = new Date(data).getTime()
      const nowTimestamp = new Date().getTime()
      if (inTimestamp + (1 * 24 * 60 * 60 * 1000) >= nowTimestamp) {
        return true
      } else {
        return false
      }
    }
    return {
      ...toRefs(state),
      resubmit,
      jumpEdit,
      deleteList,
      getImgList,
      clearn,
      uploadImg,
      timeLimt,
      handleSelectionChange
      // getFileUrl
    }

  }
}
</script>

<style lang="scss" scoped>
.headfailTable {
  background: #fff;
  padding: 16px;
  margin-top: 24px;
  margin-bottom: 60px;
  ::v-deep(.el-table__expand-icon) {
    display: none;
  }
  ::v-deep(.el-table__expanded-cell) {
    padding: 0;
    border-bottom: none;
  }
  ::v-deep(.el-table--border .el-table__cell) {
    border-right: none;
  }
  ::v-deep(.el-table th.el-table__cell>.cell) {
    color: #606266;
  }
  .expand-content {
    padding: 10px 20px;
    border-bottom: var(--el-table-border);
    background-color: #fafafa;
  }
  .redColor {
    color: #f56c6c;
  }
  .tableOption {
    display: flex;
    justify-content: space-between;
    padding: 0 5px;
    ::v-deep(.el-button + .el-button) {
      margin: 0;
    }
  }
}
</style>>
