<!--
 * @Descripttion: 
 * @version: 
 * @Author: 韦剑
 * @Date: 2021-07-08 14:56:37
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-07-14 10:35:47
-->
<template>
<div>
    <div class="pageView">
    <el-form >
      <el-form-item label="出库仓库:">
        <el-select v-model="storeNameValue" placeholder="请选择出库仓库" style="width: 320px">
					<el-option
						v-for="item in storeNameOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
      </el-form-item>
      <el-form-item label="出库类型:">
        <el-select v-model="storeTypeValue" placeholder="请选择出库类型" style="width: 320px">
					<el-option
						v-for="item in storeTypeOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="扫描\录入:" style="margin-bottom: 0">
        <el-input v-model="inputValue" placeholder="请输入\扫描商品SKU\二维码" clearable style="width: 315px"></el-input>
      </el-form-item>
    </el-form>
  </div>
  <div class="pageView" style="margin-top: 24px">
    <el-table :data="tableData" style="width: 100%" 
			:header-cell-style="{background:'#F5F7FA',color:'#606266','text-align': 'center'}"
			:cell-style="{'text-align': 'center'}">
			<el-table-column prop="goodsName" width="400px" label="商品信息">
        <template #default="scope">
          <div class="goodsName">
            <el-image style="width: 70px; height: 70px" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" fit="contain"></el-image>
            <div class="right">
              <div>{{scope.row.goodsName?.a}}</div>
              <div>{{scope.row.goodsName?.b}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
			<el-table-column prop="a" label="货架位"></el-table-column>
			<el-table-column prop="b" label="仓库分区"></el-table-column>
			<el-table-column prop="c" label="可用库存"></el-table-column>
      <el-table-column prop="d" label="出库数量">
        <template #default="scope">
          <el-input-number v-model="scope.row.d" controls-position="right" :min="1" :max="10"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="">
          <a class="del">删除</a>
        </template>
      </el-table-column>
		</el-table>
  </div>
  <div class="footer">
    <el-form class="form" >
      <el-form-item label="出库备注:" style="margin-bottom: 0">
        <el-input v-model="remark" placeholder="请输入备注" clearable style="width: 315px;margin-right: 16px"></el-input>
        <el-button  type="primary">{{route.params.type == 'add' ? '创建出库单' : '保存'}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRoute } from 'vue-router'
export default {
  setup() {
    let route = useRoute()
    let state = reactive({
      storeTypeOptions: [
        {
					value: 0,
					label: '退货出库'
				},
        {
					value: 1,
					label: '手动出库'
				},
        {
					value: 2,
					label: '样品出库'
				},
        {
					value: 3,
					label: '盘亏出库'
				},
      ],
      storeTypeValue: '',
      storeNameOptions: [
        {
					value: 0,
					label: '全部'
				},
        {
					value: 1,
					label: '万众智谷仓库'
				},
      ],
      storeNameValue: '',
      inputValue: '',
      tableData: [
        {
          goodsName: {
            a: 'sfdfssdfsdffasf',
            b: '第三方所发生'
          },
          a: '无货架位',
          b: '拣货区',
          c: 1,
          d: ''
        }
      ],
      remark: ''
    })
    return {
      ...toRefs(state),
      route
    }
  },
}
</script>

<style lang="scss" scoped>
  .pageView:nth-last-of-type(2) {
    margin: 24px 0 100px 0;
  }
  .goodsName{
    display: flex;
		justify-content: center;
		font-size: 14px;
		color: rgba(0,0,0,.65);
		.right{
      flex: 1;
      overflow: hidden;
			margin-left: 16px;
			text-align: left;
			display: flex;
			flex-direction: column;
			justify-content: center;
      div{
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
		}
  }
  .del{
    color: #FD4C60;
  }
  .footer{
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 100;
    width: calc(100% - 200px);
    height: 52px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .form{
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 20px;
    }
  }
</style>