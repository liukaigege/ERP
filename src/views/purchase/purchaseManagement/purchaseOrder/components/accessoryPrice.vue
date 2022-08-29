<template>
  <el-dialog title="配件价格" v-model="show" width="1200px" @close="close" :close-on-click-modal="false">
    <div style="margin-bottom:12px">
      <el-button type="primary" @click="batchAdd">添加配件</el-button>
      <el-button type="primary" @click="batchDel">清空配件</el-button>
    </div>
    <vxe-table keep-source :data="tableData" :max-height="480" :scroll-y="{ enabled: true, gt: 20 }" :edit-config="{ trigger: 'click', mode: 'row', showStatus: true }" align="center" ref="tableRef">
      <vxe-column type="checkbox" width="50px"></vxe-column>
      <vxe-column title="主件信息" width="250px">
        <template #default="{row}">
          <div class="info-box">
            <div class="img-box">
              <el-popover placement="right-start" trigger="hover" width="auto">
                <el-image style="width: 200px; height: 200px" :src="row.skuImg" fit="contain"></el-image>
                <template #reference>
                  <el-image style="width: 80px; height: 80px" :src="row.skuImg" fit="contain"></el-image>
                </template>
              </el-popover>
            </div>
            <div class="item-info">
              <div>{{row.sku}}</div>
              <div>{{row.currency}} {{row.price}}</div>
              <div>x {{row.purchaseQuantity}}</div>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="订单号" field="orderId"></vxe-column>
      <vxe-column title="配件名称">
        <template #default="{row}">
          <div v-for="item in row.partsRels" :key="item.partsId" class="item-box">
            <el-input v-if="item.operation != 3 " v-model="item.partsName" @change="changeItem(item)" maxlength="50"></el-input>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="配件数量">
        <template #default="{row}">
          <div v-for="item in row.partsRels" :key="item.partsId" class="item-box">
            <el-input-number v-if="item.operation !=3 " v-model="item.partsNum" :min="1" :max="999" :controls="false" @change="changeItem(item)"></el-input-number>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="配件单价" width="200">
        <template #default="{ row }">
          <div v-for="(item,index) in row.partsRels" :key="index" class="item-box">
            <div class="del-box" v-if="item.operation !=3 ">
              <el-input-number v-model="item.partsPrice" :min="0.01" :max="99999.99" :controls="false" @change="changeItem(item)"></el-input-number>
              <el-icon :size="22" @click="del(item)">
                <Delete />
              </el-icon>
            </div>
          </div>
        </template>
      </vxe-column>
      <vxe-column title="操作" width="120px">
        <template #default="{row}">
          <div>
            <el-button type="text" @click="showInfo(row)">定制信息</el-button>
          </div>
          <div>
            <el-button type="text" :disabled="row.partsRels.filter(item=>item.operation != 3 && item.partsName != null ).length >= 2" @click="addRow(row)">添加配件</el-button>
          </div>
        </template>
      </vxe-column>
    </vxe-table>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="close">退出</el-button>
    </template>
  </el-dialog>
  <AddAccessory v-if="showAdd" @close="showAdd=false" @addData="addData" :ids="ids" />
  <customInfo @closeEvent="showCustomInfo = false" v-if="showCustomInfo" :info="purchaseInfo" />
</template>

<script>
import { reactive, toRefs, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { deepCopy } from '@/utils/tool'
import AddAccessory from './addAccessory.vue'
import { partsRelForm, savePartsRel } from '@/api/purchase/purchase'
import customInfo from './customInfo.vue'
import { Delete } from '@element-plus/icons-vue'
export default {
  emits: ['closeEvent', 'saveSuccess'],
  components: { AddAccessory, Delete, customInfo },
  props: ['itemId', 'delRelIds'],
  setup(props, ctx) {
    const state = reactive({
      show: true,
      tableData: [],
      select: [],
      showAdd: false,
      ids: [],
      showCustomInfo: false,
      purchaseInfo: {}
    })
    let tableRef = ref(null)

    onMounted(() => {
      getTableData()
    })

    function getTableData() {
      partsRelForm({ itemId: props.itemId, delRelIds: props.delRelIds }).then(res => {
        state.tableData = res.data
        // 删除空信息数据
        state.tableData.forEach(item => {
          item.partsRels = item.partsRels.filter(p => p.partsName != null)
        })
      })
    }

    function close() {
      state.show = false
      setTimeout(() => {
        ctx.emit('closeEvent')
      }, 500)
    }
    function showInfo(info) {
      state.showCustomInfo = true
      state.purchaseInfo = { ...info, goodsQuantity: info.quantity }
    }

    function addRow(row) {
      state.ids = [row.id]
      state.showAdd = true
    }

    function addData(data) {
      let errArray = []
      state.tableData.forEach(item => {
        const partsLength = item.partsRels.filter(v => v.operation != 3 && v.partsName != null).length
        if (state.ids.includes(item.id)) {
          partsLength < 2 ? item.partsRels.push(deepCopy(data)) : errArray.push(item.id)
        }
      })
      if (errArray.length === state.ids.length) return ElMessage.warning({ message: '最多添加两种配件' })
    }

    function changeItem(row) {
      if (row.partsId) row.operation = 2
    }

    function batchAdd() {
      let ids = tableRef.value.getCheckboxRecords().map(item => item.id)
      if (ids.length < 1) return ElMessage.error({ message: '请选择至少一条数据' })
      state.showAdd = true
      state.ids = ids
    }

    function batchDel() {
      if (tableRef.value.getCheckboxRecords().length < 1) return ElMessage.error({ message: '请选择至少一条数据' })
      tableRef.value.getCheckboxRecords().forEach(item => item.partsRels = item.partsRels.filter(sub => sub.partsId).map(sub => ({ ...sub, operation: 3 })))
    }

    function del(item) {
      item.operation = 3
    }

    function save() {
      let savePartsDTO = []
      let repeatName = false
      let repeatOrderNum = []
      state.tableData.forEach(item => {
        let obj = {
          id: item.id,
          partsRels: []
        }
        item.partsRels.forEach((part, index, arr) => {
          // let { partsName, partsNum, partsPrice } = part
          // if (!(partsName && partsNum > 0 && partsPrice > 0)) errMsg = `商品${item.sku}的配件信息不能为空`
          // 同一订单，配件名称不得一样
          const sameNameLen = new Set(arr.map(it => it.operation != 3 && it.partsName).filter(_p => !!_p)).size
          if (sameNameLen < arr.filter(p => p.operation != 3).length) repeatOrderNum.push(item.orderId)

          if (Reflect.has(part, 'operation')) obj.partsRels.push(part)
          state.tableData.forEach(val => {
            if (val.partsRels && val.partsRels.length) {
              val.partsRels.find(item => {
                if (item.partsName === part.partsName && item.partsPrice !== part.partsPrice) repeatName = part.partsName
              })
            }
          })

        })
        if (obj.partsRels.length > 0) savePartsDTO.push(obj)
      })
      if (repeatOrderNum.length) return ElMessage.error({ message: `同一订单内的两个配件名称不可重复，请核实订单【${repeatOrderNum[0]}】数据！` })
      if (repeatName) return ElMessage.error({ message: `相同配件名称配件单价需保持一致，请核实配件【${repeatName}】数据！` })
      // if (errMsg) ElMessage.error({ message: errMsg })
      if (savePartsDTO.length > 0) {
        savePartsRel({ savePartsDTO }).then(_ => {
          ElMessage.success({ message: '保存成功' })
          close()
          ctx.emit('saveSuccess')
        })
      } else {
        close()
      }

    }
    return {
      ...toRefs(state),
      close,
      batchAdd,
      batchDel,
      del,
      addRow,
      tableRef,
      addData,
      save,
      changeItem,
      showInfo,
      getTableData
    }
  }
}
</script>

<style lang="scss" scoped>
.edit {
  display: flex;
  justify-content: space-around;
}
.info-box {
  display: flex;
}
.del-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.img-box {
  margin-right: 15px;
}
.item-info {
  text-align: left;
}
.item-box + .item-box {
  margin-top: 10px;
}
.edit + .edit {
  margin-top: 8px;
}
</style>
