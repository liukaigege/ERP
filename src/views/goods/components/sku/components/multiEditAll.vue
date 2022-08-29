<!--
 * @Descripttion: 弹框模板
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-15 17:01:59
 * @LastEditors: 朱涛（梅溪）
 * @LastEditTime: 2021-10-24 18:24:58
-->

<template>
  <div>

    <el-dialog :title="dialogTitle" v-model="show" :width="width" @close="close"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    >
     <el-form :model="form" label-position="right"  label-width="100px">
       <el-form-item label="图片修改：">
         <div class="imgBox">
              <el-switch v-model="form.url.switch" style="margin-right:20px"></el-switch>

              <div class="img">
                  	<div class="selectImg"  @click="showSelectImg()" v-if="!form.url.value.url">
												<i class="el-icon-plus"></i>
										</div>

                    	<div class="imgItem" v-else>
											<img :src="form.url.value.url" alt="" />
											<div class="mask"></div>
											<div class="icons">
												<i
													class="el-icon-delete"
													@click="delImg()"
												></i>
											</div>
              </div>
         </div>
         </div>


       </el-form-item>
        <el-form-item :label="getPriceTitle()+':'">
           <div>
             <el-switch v-model="form.expectPrice.switch" style="margin-right:20px"></el-switch>
              <el-input-number v-model="form.expectPrice.value"
               :min="1"
               :max="999999.99"
								:precision="2"

               placeholder="USD">
            </el-input-number>
           </div>
        </el-form-item>
         <el-form-item label="成本价：" v-if="form.costPrice && !showCombineGoods">
             <div>
             <el-switch v-model="form.costPrice.switch" style="margin-right:20px"></el-switch>
              <el-input-number v-model="form.costPrice.value"
               :min="1"
               :max="999999.99"
								:precision="2"

               placeholder="USD">
            </el-input-number>
           </div>
         </el-form-item>
          <el-form-item label="原价：" v-if="form.originalPrice">
             <div>
             <el-switch v-model="form.originalPrice.switch" style="margin-right:20px"></el-switch>
              <el-input-number v-model="form.originalPrice.value"
               :min="1"
               :max="9999999.99"
								:precision="2"

               placeholder="USD">
            </el-input-number>
           </div>
         </el-form-item>
     </el-form>


      <template #footer >
        <span class="dialog-footer">
          <el-button  @click="cancel"
            >取 消</el-button
          >
          <el-button type="primary"  @click="dialogHandOk"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>

   <SelectImg :dialogVisible="dialogVisible" :multiple="false" v-if="dialogVisible" :skuQuery="skuQuery" @selectImg="selectImg"/>
  </div>
</template>

<script>
import { reactive, toRefs, getCurrentInstance ,inject,onMounted} from 'vue'
import SelectImg from '@/views/goods/components/sku/components/selectImg.vue'
import { deepCopy } from '../../../../../utils/tool';

  export default {
    components:{SelectImg},
    props:{
      dialog:{
        type:Object,
        default:null
      },
      dialogTitle:{
        type:String,
        default:'批量修改'
      },
      show:{
        type:Boolean,
        default:false
      },
      width:{
        type:String,
        default:'30%'
      },
    },
    setup(props,{emit}){
      const {proxy} = getCurrentInstance()
      const routeOption = inject("routeOption");
       const routeName = inject('routeName')
			const showCombineGoods = inject('showCombineGoods')
      const data = reactive({
          form: deepCopy(routeOption.multi.editAll),
          dialogVisible:false,
          skuQuery:{}
      })


      function showSelectImg(){
          data.dialogVisible = true
      }

      function delImg(){
          data.form.url.value.url = null
          data.form.url.value.pictureId = null
      }

      function  selectImg(val){
          console.log(val)
          const {url} = val
					emit('selectImgEditAll',val)
          if(url[0]) {
						emit('selectImgEditAll',val)
            data.form.url.value.url = url[0].url
            data.form.url.value.pictureId = url[0].pictureId
          }
      }


      const dialogHandOk = () => {
          for(var i in data.form){
              let x = false
              if(i =='url' && !data.form[i].value.url && data.form[i].switch) x = true
							let keyName
							switch (i){
									case 'url':
									keyName = '图片';
									break;
									case  'expectPrice':
									keyName = getPriceTitle();
									break;
									case 'costPrice':
									keyName = '成本价'
									break;
									case 'originalPrice':
									keyName = '原价'
									break;
							}

              if(x){

                proxy.$message.error('请上传图片')
                return
              }
              if(data.form[i].switch && !data.form[i].value) {
                proxy.$message.error(`请填写${keyName}`)
                return
              }
          }

          emit('editAllEmit',data.form)
          cancel()
      }


      const close = () =>{
        proxy.$parent.dialogVisible = false
     }
      const cancel = () =>{
          proxy.$parent.dialogVisible = false
      }

       function getPriceTitle(){
        // 售价（USD）
        let bole = '售价'
        let list = ['addGoods','detNewSpes']
        if(list.indexOf(routeName) !==-1) bole= '期望售价'
        return bole
    }
      onMounted(()=>{
        console.log(routeOption)
      })

      return {
        ...toRefs(data),
        dialogHandOk,
        cancel,
        close,
        showSelectImg,
        delImg,
        selectImg,
        routeOption,
        getPriceTitle,
				showCombineGoods
      }
    }
  }
</script>


<style lang="scss" scoped>
.imgBox{
  display: flex;
  align-items: center;
}
.selectImg{
	background: rgba(0, 0, 0, 0.04);
	width: 60px;
	height: 60px;
	border: 1px solid #E8E8E8;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 10px auto;

}


.imgItem {
	position: relative;
	width: 60px;
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: center;
		margin: 10px auto;
	img {
		width: auto;
		height: auto;
		max-width: 60px;
		max-height: 60px;
	}
	.mask {
		position: absolute;
		width: 100%;
		height: 100%;
		max-width: 110px;
		max-height: 110px;
		top: 0;
	}
	.icons {
		display: none;
		position: absolute;
		top: 35%;
		left: 50%;
		transform: translateX(-50%);
	}
}
.imgItem:hover {
	.mask {
		background-color: rgba(0, 0, 0, 0.5);
		transition: all 0.3s;
	}
	.icons {
		display: block;
		transition: all 0.3s;
		i {
			color: white;
			font-size: 18px;
		}
	}
}

:deep(.el-form-item){
  display: flex;
  align-items: center;
}
</style>
