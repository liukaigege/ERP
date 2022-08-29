<!--
 * @Descripttion:
 * @version:
 * @Author: 韦剑
 * @Date: 2021-07-22 09:12:04
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-22 15:14:26
-->
<template>
  <div>
    <el-affix :offset="110">
			<div class="header">
				<a @click="back()" class="el-icon-arrow-left" style="color: #000"></a>
				<span>批量修改收件人信息</span>
			</div>
		</el-affix>
    <div class="pageView">
      <el-form  label-position="right" label-width="60px">
        <vxe-table ref="myTable" keep-source align="center" :auto-resize="true" :height="tableH" show-overflow :export-config="{}" :scroll-y="scrollConfig" highlight-hover-row
          :edit-config="{trigger: 'click', mode: 'row', showStatus: true}" :loading="loading" :edit-rules="validRules">
          <vxe-table-column field="packageId" title="包裹号" width="200" fixed="left"></vxe-table-column>
          <vxe-table-column field="name" title="收件人" width="200" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '60', clearable: true, align: 'left'}}"></vxe-table-column>
					<vxe-table-column field="lastName" title="客户姓" width="150" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '50', clearable: true, align: 'left'}}"></vxe-table-column>
					<vxe-table-column field="firstName" title="客户名" width="150" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '50', clearable: true, align: 'left'}}"></vxe-table-column>
					<vxe-table-column field="phone" title="联系电话" width="200" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '60', clearable: true}}"></vxe-table-column>
          <vxe-table-column field="postcode" title="邮编" width="200" :edit-render="{name: '$input', props: {type: 'text', placeholder: '请输入', maxlength: '40', clearable: true}}"></vxe-table-column>
          <vxe-table-column field="countryEn" title="国家" width="200">
            <template #default="{ row, _rowIndex }">
              <!-- <vxe-select v-model="row.countryEn" placeholder="请选择" @change="changeCountryCn(row.packageId, _rowIndex, row.countryEn)" :transfer="true">
                <vxe-option v-for="item in countryEnList" :key="item.countryEnName" :value="item.countryEnName" :label="item.countryEnName"></vxe-option>
              </vxe-select> -->
              <!-- 筛选需求更改 -->
              <el-select v-model="row.countryEn" filterable placeholder="请选择" @change="changeCountryCn(row.packageId, _rowIndex, row.countryEn)" @visible-change="visibleChange" :transfer="true" :filter-method="filterMethod">
                <el-option v-for="item in countryEnList" :key="item.countryEnName" :value="item.countryEnName" :label="item.countryEnName"></el-option>
              </el-select>
            </template>
          </vxe-table-column>
          <vxe-table-column field="nation" title="州省/城市" width="240">
            <template #header>
              <span>州省/城市</span>
              <el-button type="text" style="margin-left: 10px" @click="dialogVisible = true">修改</el-button>
            </template>
            <template #default="{ row }">
              <el-form-item label="州省:" class="m-b12">
                <el-input v-model="row.state" :maxlength="200" clearable></el-input>
              </el-form-item>
              <el-form-item label="城市:">
                <el-input v-model="row.city" :maxlength="200" clearable></el-input>
              </el-form-item>
            </template>
          </vxe-table-column>
          <vxe-table-column field="company" title="公司/税号" width="240">
            <template #default="{ row }">
              <el-form-item label="公司:" class="m-b12">
                <el-input v-model="row.company" :maxlength="200" clearable></el-input>
              </el-form-item>
              <el-form-item label="税号:">
                <el-input v-model="row.taxNum" :maxlength="60" clearable></el-input>
              </el-form-item>
            </template>
          </vxe-table-column>
          <vxe-table-column field="address" title="地址" width="240">
            <template #default="{ row }">
              <el-form-item label="地址1:" prop="street1" class="m-b12">
                <el-input v-model="row.street1" :maxlength="300" clearable></el-input>
              </el-form-item>
              <el-form-item label="地址2:" prop="street2">
                <el-input v-model="row.street2" :maxlength="300" clearable></el-input>
              </el-form-item>
            </template>
          </vxe-table-column>
          <vxe-table-column field="operation" title="操作" width="120" fixed="right">
            <template #default="{ row }">
              <el-popconfirm title="确定移除该包裹吗？" @confirm="popconfirmConfirm(row.packageId)">
                <template #reference>
                  <el-button type="text" style="margin-left: 10px; color: #EC5F74" :disabled="tableData.length <= 1">移除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </vxe-table-column>
        </vxe-table>
      </el-form>
    </div>
    <div class="footer">
      <el-button  @click="back()">取消</el-button>
      <el-button type="primary"  style="margin-left: 16px" @click="submitEvent()">确定</el-button>
    </div>
    <el-dialog title="批量修改" v-model="dialogVisible" width="30%" :before-close="handleClose">
      <span>当「州省」或「城市」其中一项为空时，用另一项替换</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button  @click="dialogVisible = false">取 消</el-button>
          <el-button  type="primary" @click="saveEvent">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, toRefs, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { receiveInfobatch, receiveSavebatch, countryCode } from '@/api/order/orderManagement.js'
import { ElMessageBox, ElMessage } from 'element-plus';
import { _debounce } from '@/utils/tool.js'
import { deepCopy } from '../../../../utils/tool';
export default {
  setup() {
    let route = useRoute()
    let router = useRouter()
    let packageIds = route.query.packageIds
    let myTable = ref(null)
    let state = reactive({
      tableData: [],
      validRules: {
        name: [
          { required: true, message: '请输入收件人', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
        ],
        countryEn: [
          { required: true, message: '请选择国家', trigger: 'change' }
        ],
        postcode: [
          { required: true, message: '请输入邮编', trigger: 'blur' }
        ],
        firstName: [
          { required: true, message: '请输入客户姓', trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: '请输入客户名', trigger: 'blur' }
        ],
      },
      countryEnList: [],
      countryEnListCopy: [],
      dialogVisible: false,
      tableH: '610',
      loading: false,
      scrollConfig: {
        enabled: true,
        gt: 20
      }
    })
    let initFun = () => {
      state.loading = true
      receiveInfobatch({packageIds}).then(res => {
        if (res.code == 200) {
          state.tableData = res.data
          myTable.value.loadData(state.tableData)
        } else {
          ElMessage.error(res.message)
        }
        state.loading = false
      }).catch(err => {

        state.loading = false
      })
    }

    // 获取国家列表
    let getCountryCnLsit = () => {
      countryCode().then(res => {
        if (res.code == 200) {
          state.countryEnList = res.data
          state.countryEnListCopy = deepCopy(res.data)
        } else {
          ElMessage.error(res.message)
        }
      })
    }

    //移除
    let popconfirmConfirm = _debounce((packageId) => {
      state.tableData = state.tableData.filter(item => item.packageId !== packageId)
      myTable.value.loadData(state.tableData)
    })

    let handleClose = () => {
      state.dialogVisible = false
    }

    // 批量填充州省/城市
    let saveEvent = _debounce(() => {
      state.dialogVisible = false
      state.tableData.forEach(item => {
        if (item.state && !item.city) item.city = item.state
        if (item.city && !item.state) item.state = item.city
      })
    })

    let back = () => {
      router.push({
        name: 'OrderManagement',
        params: {
          status: '97'
        }
      })
    }

    let validStatusEvent = async () =>{
      const errMap = await myTable.value.validate(true).catch(errMap => errMap)
      return new Promise((reslove, reject) => {
        if (errMap) {
          reject('信息填写错误，提交失败')
        } else {
          state.tableData.some((item, index) => {
            if (!item.street1 && !item.street2) {
              reject(`第${index+1}行数据至少填写一个收件人地址！`)
              myTable.value.scrollToRow(item)
              return true
            }
            if (!item.countryEn) {
              reject(`第${index+1}行数据未选择国家！`)
              myTable.value.scrollToRow(item)
              return true
            }
          })
          reslove()
        }
      })
    }

    let batchAddress = _debounce(() => {
      validStatusEvent().then((res) =>{
        let params = {
          packageReceiveInfo: state.tableData
        }
        receiveSavebatch(params).then(res => {
          if (res.code == 200) {
            ElMessage.success({ message: '修改成功！', type: 'success' });
            back()
          } else {
            ElMessage.error(res.message)
          }
        })
      }).catch(err => {
        ElMessage.error(err)
      })
    })

    let submitEvent = () => {
      let status = route.query.status
      if (status == 8) {
        ElMessageBox.confirm('确认修改？内容修改后必须[更换运单号]才能生效！', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            batchAddress()
          })
          .catch(() => {
          })
      } else {
        batchAddress()
      }
    }

    let filterMethod = (value) => {
      state.countryEnList = state.countryEnListCopy.filter(item => item.countryEnName.indexOf(value) !== -1 || item.countryName.indexOf(value) !== -1)
    }

    let visibleChange = (value) => { // 收回下拉框时复原数据
      if (!value) {
        setTimeout(() => {
          state.countryEnList = state.countryEnListCopy
        }, 500)
      }
    }

    onMounted(() => {
      state.tableH = document.body.clientHeight - 320 + ''
      initFun()
      getCountryCnLsit()
    })
    return {
      ...toRefs(state),
      myTable,
      handleClose,
      saveEvent,
      submitEvent,
      popconfirmConfirm,
      back,
      filterMethod,
      visibleChange
    }
  },
  methods: {
    changeCountryCn(packageId, index, countryEn) {
      this.countryEnList.forEach(item => {
        if (countryEn == item.countryEnName) {
          this.tableData[index].countryCn = item.countryName
        }
      })
      // this.$refs['countryEn/postcode' + packageId].clearValidate('countryEn')
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
	height: 76px;
	background-color: #fff;
	display: flex;
	align-items: center;
	padding: 0 24px;
	font-size: 20px;
	.el-icon-arrow-left {
		margin-right: 10px;
	}
}
.pageView{
  .el-form-item {
    margin-bottom: 0 !important
  }
  .is-error {
    margin-bottom: 20px !important
  }
  .m-b12{
    margin-bottom: 20px !important
  }
}
.footer{
  position: fixed;
  width: 100%;
  // bottom: 0;
  top: 100vh;
  right: 0;
  transform: translateY(-100%);
  z-index: 1000;
  width: calc(100% - var(--sideBarWidth));
  height: 52px;
  background-color: #fff;
  display: flex;
  justify-content:flex-end;
  align-items: center;
  border-top: 1px solid #E8E8E8;
  padding: 0 24px;
}
.myForm{
  display: flex;
  flex-wrap: wrap;
}
:deep(tbody tr) {
  height: 110px;
}
:deep(.vxe-cell, .c--tooltip){
  max-height: 100px !important;
}
:deep(.vxe-header--row){
  background-color: #F5F7FA;
  color: #000
}
</style>
