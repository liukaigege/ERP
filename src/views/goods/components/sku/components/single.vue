<!--
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-10-10 23:08:24
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-15 11:25:14
-->
<template>
  <div class="single">
      <!-- <el-table :data="tableData">
        <el-table-column label="sku编码" props="sku"></el-table-column>
        <el-table-column label="重量（g）" props="sku"></el-table-column>
        <el-table-column label="售价(USD)" props="sku"></el-table-column>
        <el-table-column label="原价(USD)" props="sku"></el-table-column>
         <el-table-column label="原价(USD)" props="sku"></el-table-column>
      </el-table> -->

       <vxe-table
            :data="tableData"
            ref="xtable"
            keep-source
            align="center"
            auto-resize
            show-overflow= 'tooltip'
            max-height='400'
            :edit-rules="rules"
            :edit-config="{
              trigger: 'click',
              mode: 'row',
              showStatus: true,
            }"
          >
              <vxe-column field="sku" title="SKU编码" width="180">
              <template #default="{ row }">
                {{ row.sku }}
              </template>
            </vxe-column>


             <vxe-column field="weight" title="重量（g） " width="180">
              <template #default="{ row }">
                {{ row.weight }}
              </template>
            </vxe-column>

             <vxe-column field="lwh" title="体积（cm³） " width="180">
              <template #default="{ row }">
                {{ row.lwh }}
              </template>
            </vxe-column>

            <vxe-column
              field="expectPrice"
              title="售价（USD）"
              width="180"
              :edit-render="{}"
            >
              <template #edit="{ row }">
                <vxe-input
                  type="float"
                  :min="0"
                  :max="999999.99"
                  :step="1"
                  v-model="row.expectPrice"
                  
                >
                </vxe-input>
              </template>
            </vxe-column>
            <vxe-column
              field="originalPrice"
              title="原价(USD)"
              width="180"
              :edit-render="{}"
            >
              <template #edit="{ row }">
                <vxe-input
                  type="float"
                  :min="0"
                  :max="999999.99"
                  :step="1"
                  v-model="row.originalPrice"
                  
                >
                </vxe-input>
              </template>
            </vxe-column>


             <vxe-column field="costPrice" title="成本价（CNY）" width="180">
              <template #default="{ row }">
                {{ row.costPrice }}
              </template>
            </vxe-column>


          </vxe-table>
  </div>

</template>


<script>
import {toRefs,reactive,onMounted, watch,ref} from 'vue'
export default {
    props:{
         skus: {
          type: Array,
          default: [],
        },
    },
    components:{},
    setup(props) {
      const  data = reactive({
        tableData:[],
        rules:{
          suggestPrice:[
             { required: true, message: '请输入售价' },
          ],
          originalPrice:[
             { required: true, message: '请输入原价售价' },
          ],
        }
      })

      const xtable = ref(null)

    function validate() {
      xtable.value
        .validate(true)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } // 校验table



      watch(()=>props.skus,(a)=>{
        data.tableData = a
        console.log(a)
      })

    onMounted(()=>{
    })


      return{
        ...toRefs(data),
        validate,
        xtable
      }
    }

} 
</script>

<style lang="scss" scoped>

</style>