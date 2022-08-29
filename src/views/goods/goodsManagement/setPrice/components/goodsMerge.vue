<template>
	<el-dialog title="合并商品" v-model="ifShow" :width="800" custom-class="myDialog" :close-on-click-modal="false" :destroy-on-close="true" @close="closeEvent">
		<div class="contentView">
			<div class="text">
				<span>*</span>
				<span>选择主品</span>
				<span>(合并商品后，所有副品将被主品替代，系统只保留一个主商品)</span>
			</div>
			<vxe-table border height="300" row-id="id" :data="tableData" align="center" :radio-config="{checkRowKey: defaultSelecteRow}" @radio-change="radioChangeEvent" style="margin-top: 24px">
				<vxe-column type="radio" width="60"></vxe-column>
				<vxe-column field="goodsInfo" title="商品信息" width="270">
          <template #default="{ row }">
						<div class="goodsInfo">
              <el-image style="width: 60px; height: 60px" :src="row.mainImgUrl" fit="contain"></el-image>
              <div class="right textOverflow_3" :title="row.nameCn">{{row.nameCn}}</div>
            </div>
					</template>
        </vxe-column>
				<vxe-column field="goodsNum" title="商品编码/品类">
          <template #default="{ row }">
            <div>
              <div class="right textOverflow">{{row.id}}</div>
              <div class="right textOverflow">{{row.categoryName}}</div>
            </div>
          </template>
        </vxe-column>
				<vxe-column field="goodsSource" title="商品来源/权限">
          <template #default="{ row }">
            <div>
              <div class="right textOverflow" :title="row.source">
                <span v-if="row.mode == 0">平台采集</span>
                <span v-if="row.mode == 1">独立站采集</span>
                <span v-if="row.mode == 2">手动</span>
                <span v-if="row.mode == 3">导入</span>
                {{row.source}}
              </div>
              <div v-if="row.authType == 0">仅本人可见</div>
              <div v-if="row.authType == 1">仅部门人员可见</div>
              <div v-if="row.authType == 2">所有人可见</div>
            </div>
          </template>
        </vxe-column>
				<vxe-column field="sku" title="开发时间">
          <template #default="{ row }">
            <div>
              <div class="right textOverflow_2">{{row.createTime}}</div>
            </div>
          </template>
        </vxe-column>
			</vxe-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="cancelEvent" >取消</el-button>
				<el-button type="primary" @click="affirmEvent"  :loading="loading">确定</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script>
	import { onMounted, reactive, toRefs } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus';
  import moment from 'moment'
  import { quotationMerge } from '@/api/goods/quotedPrice'
  import { deepCopy } from '@/utils/tool.js'
	export default {
    props: {
      goodsCommons: {
        type: Array,
        default: []
      },
      goodsCommonsInfo: {
        type: Array,
        default: []
      }
    },
		emits: ['closeEvent'],
		setup(props, context) {
			let state = reactive({
				ifShow: true,
				tableData: [],
        defaultSelecteRow: null,
        form: {
          goodsIds: props.goodsCommons,
          mainId: null
        },
        loading: false
			})

			// 关闭弹框
			let closeEvent = (refresh = false) => {
        state.ifShow = false
				setTimeout(() => {
					context.emit('closeEvent', refresh)
				}, 500)
			}

			// 取消回调
			let cancelEvent = () => {
				closeEvent()
			}

      let radioChangeEvent = ({ row }) => {
        state.form.mainId = row.id
      }

			// 确认回调
			let affirmEvent = () => {
        ElMessageBox.confirm('确认合并商品？', '提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
            let { goodsIds, mainId } = deepCopy(state.form)
            let index = goodsIds.indexOf(mainId)
            goodsIds.splice(index, 1)
            let params = {
              goodsIds,
              mainId
            }
            state.loading = true
            quotationMerge(params).then(res => {
              state.loading = false
              if (res.code == 200) {
								ElMessage.success({ message: '操作成功！', type: 'success' });
								closeEvent(true)
							} else {
								ElMessage.error(res.message)
							}
						}).catch(err => {
              state.loading = false
					
						})
					})
				
			}

      onMounted(() => {
        let arr = props.goodsCommonsInfo
        arr.forEach(item => {
          item.time = moment(item.createTime, 'YYYY-MM-DD HH:mm').valueOf()
        })
        arr.sort((a, b) => {
          return a.time - b.time
        })
        state.defaultSelecteRow = arr[0].id
        state.tableData = arr
        state.form.mainId = arr[0].id
        console.log(arr)
      })

			return {
				...toRefs(state),
				closeEvent,
				cancelEvent,
				affirmEvent,
        radioChangeEvent
			}
		}
	}
</script>

<style lang="scss" scoped>
.contentView {
	.text {
		span {
			color: #fe5467;
			font-size: 16px;
		}
		span:nth-of-type(2) {
			color: #000;
		}
		span:nth-of-type(3) {
			font-size: 12px;
			margin-left: 10px;
		}
	}
  .goodsInfo{
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right{
      width: 182px;
    }
  }
}
</style>