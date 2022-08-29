<!--
* @Descripttion: Vango ERP
* @version: 1.0
* @Author: 王新国
* @Date: 2021-11-01 15:16:38
* @LastEditors: 王新国
* @LastEditTime: 2021-11-01 17:07:46
-->
<template>
  <div>
		<el-dialog
    v-model="dialogVisible"
    title="批量修改"
    width="480px"
    @closed="handleClose"
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="82px">
      <el-form-item label="单价：">
        <el-switch size="large" v-model="form.signlePriceChange" />
        <el-input-number
          :disabled="!form.signlePriceChange"
          class="widthAttr"
          v-model="form.signlePrice"
          :min="0"
          :max="99999.99"
          size="large"
          :precision="2"
        />
      </el-form-item>
      <el-form-item label="商品属性：">
        <el-switch size="large" v-model="form.goodAttributeChange" />
        <el-select
          :disabled="!form.goodAttributeChange"
          v-model="form.goodAttribute"
          placeholder="请选择商品属性"
          class="widthAttr"
          size="large"
        >
          <el-option
            v-for="item in goodAttributeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
			<el-form-item label="配件金额：" v-if="customization === 1">
        <el-switch size="large" v-model="form.partSwitchChange" />
        <el-switch style="margin-left:15px;" :disabled="!form.partSwitchChange" v-model="form.partSwitch" :active-value="1" :inactive-value="0" />
      </el-form-item>
			<el-form-item label="收货地址：" v-if="goodsSources">
        <el-switch size="large" v-model="form.accountIdChange" />
				<el-select
          :disabled="!form.accountIdChange"
          v-model="form.accountId"
          placeholder="全部"
          class="widthAttr"
          size="large"
					clearable
        >
          <el-option
            v-for="item in accounts"
            :key="item.id"
            :label="item.accountName"
            :value="item.id"
          />
        </el-select>
				<div class="addressContainer">
					<el-input class="addressinps" clearable size="large" :disabled="true" v-model="form.address" placeholder="请选择地址" />
					<el-button class="addressbtns" :disabled="!form.accountId || !form.accountIdChange" size="large" @click="() => (addressdialogVisible = true)" type="text">选择地址</el-button>
				</div>
      </el-form-item>
			<el-form-item label="备注：">
				<el-switch size="large" v-model="form.remarkTypeIdChange" />
        <el-select
          :disabled="!form.remarkTypeIdChange"
          v-model="form.remarkTypeId"
          placeholder="全部"
          class="widthAttr"
          size="large"
					clearable
        >
          <el-option
            v-for="item in remarkList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
				<div class="remarkContainer">
					<el-input
						:disabled="!form.remarkTypeIdChange"
						v-if="form.remarkTypeId"
						v-model="form.remark"
						:rows="2"
						type="textarea"
						placeholder="请输入备注内容"
						maxlength="100"
					/>
				</div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="ok">确定</el-button>
      </span>
    </template>
  </el-dialog>
	<AddressList
			:id="form.accountId"
			v-if="addressdialogVisible"
			@close="() => (addressdialogVisible = false)"
			@change="getAddress"
		/>
	</div>
</template>
<script>
import { reactive, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import AddressList from '../../components/AddressList.vue'
export default {
	components:{ AddressList },
  props: {
    selectedList: Array,
		customization:Number,
		remarkList: Array,
		accounts: Array
  },
	emits:['editBack'],
  setup(props, { emit }) {
		//是否含有1688商品
		const goodsSources = props.selectedList.some(v=>v.partnerType == 2)
    const goodAttributeList = [
      {
        label: '原品',
        value: 1
      },
      {
        label: '相似品',
        value: 2
      },
      {
        label: '替代品',
        value: 3
      }
    ]
    const state = reactive({
      dialogVisible: true,
      form: {
        signlePrice: 0,
        signlePriceChange: false,
        goodAttribute: 1,
        goodAttributeChange: false,
				partSwitchChange:false,
				partSwitch:0,
				accountId:null,
				accountIdChange:false,
				address:null,
				addressId:null,
				remarkTypeId:null,
				remarkTypeIdChange:false,
				remark:null
      },
      isOk: false,
			addressdialogVisible:false
    })
    function handleClose(val) {
      if (
        (state.form.signlePriceChange || state.form.goodAttributeChange || state.form.partSwitchChange || state.form.accountIdChange || state.form.remarkTypeIdChange) &&
        state.isOk
      ) {
        // 确定
        emit('editBack', state.form)
      } else {
        // 取消
        emit('editBack', false)
      }
    }
    function ok() {
      if (state.form.signlePriceChange || state.form.goodAttributeChange || state.form.partSwitchChange || state.form.accountIdChange || state.form.remarkTypeIdChange) {
				if(state.form.accountIdChange && !state.form.address) return ElMessage.warning('收货地址不能为空！')
        state.isOk = true
        state.dialogVisible = false
      }else{
				// 单价和商品属性至少一个开启
				ElMessage.warning('修改属性至少一个开启!')
			}
    }
		watch(() => state.form,v => {
			if(v.partSwitchChange && v.partSwitch === 1) state.form.signlePriceChange = false
		},{ deep: true })

		// 获取选取的地址
		function getAddress(val) {
			const { id, address } = val
			state.form.addressId = id
			state.form.address = address
		}
    return {
      ...toRefs(state),
      handleClose,
      goodAttributeList,
			goodsSources,
			getAddress,
      ok
    }
  }
}
</script>
<style lang='scss' scoped>
.widthAttr {
  width: 70%;
  margin-left: 15px;
}
.addressContainer{
	text-align: right;
	margin-top: 20px;
	.addressinps{
		width: 55%;
	}
	.addressbtns{
		width: 25%;
	}
}
.remarkContainer{
	width: 70%;
	margin:20px 0 0 17%;
}
</style>
