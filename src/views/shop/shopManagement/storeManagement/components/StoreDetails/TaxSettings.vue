<template>
<el-card class="box-card" shadow="never">
    <template #header>
        <div class="card-header">
            <span>税务设置</span>
        </div>
    </template>
    <div class="formBox">
        <el-form :model="data" ref="formRef" :rules="rules" label-width="120px" >
            <div class="flex-form-item">
                <el-form-item label="欧盟VAT账号:" prop="euVat">
                    <!-- <el-input v-model="data.euVat" class="w310"  :disabled="data.shopStatus==0" maxlength="20"></el-input> -->
                    <el-select v-model="data.euVat" class="w310"  :disabled="data.shopStatus==0">
                        <el-option 
                            
                            label="IM2500010798"
                            value="IM2500010798">
                        </el-option>
                    </el-select>
                    
                </el-form-item>
                <el-form-item label="英国VAT账号:" prop="ukVat">
                    <el-input v-model="data.ukVat" class="w310"  :disabled="data.shopStatus==0" maxlength="20"></el-input>
                </el-form-item>
            </div>
        </el-form>
    </div>
</el-card>
</template>

<script>
import { reactive, toRefs, watch } from 'vue'
import { requiredValue} from '@/views/shop/shopRules/rules.js'
import { checkNumOrWords } from '@/utils/ruleOptions.js'
export default {
    props: {
        data: {
            type: Object
        },
        editShop:{}
    },
    emits:['flag'],
    setup(props,context) {
        const state = reactive({
            data: props.data,
            formRef: ''
        })

        watch(()=>props.editShop,val=>{
            if(val){
                state.formRef.validate().then(res=>{
                    context.emit('flag',true)
                }).catch(res=>{
                    context.emit('flag',false)
                })
            }
        })
        const rules = {
            euVat: [requiredValue('请输入欧盟VAT账号'), { validator: checkNumOrWords, trigger: 'blur' }],
            // ukVat: [requiredValue('请输入英国VAT账号'), { validator: checkNumOrWords, trigger: 'blur' }],
        }
        return {
            ...toRefs(state),
            rules
        }
    }
}
</script>

<style>

</style>
