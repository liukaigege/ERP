import { baiduTranslate } from '@/utils/translate'
import {ElMessage}  from 'element-plus'

const options = {
		"addGoods":{
			columns:[
				'name',//名称
				'nameCn',//中文名称
				'nameEn',// 英文名称
				'image',// 图片
				'material',//材质
				'remark',// 备注
			],
			disabled:false
		},// 新增商品
		"ConfirmNewSpe":{
			columns:[
				'name',//名称
				'image',// 图片
				'material',//材质
			],
			disabled:false
		},// 待报价更改类型
	"ApplyGoodsDetail":{
		disabled:true
	},//待报价申请人
	"EditDetail":{
		disabled:false
	} ,// 待申请
 }

 const rules = {
	 goodsCustomTypeList:[
		 {required:true,message:'请选择定制类型!' ,trigger:'blur' },
	 ],
	 enableCustom:[
		 {required:true,message:'请选择是否为定制品!' ,trigger:'blur' }
	 ],
	 enableContainFitting:[
		 {required:true,message:'请选择是否含有配件!' ,trigger:'blur' }
	 ]

 } // 表单校验
const validateNameCn = ({ row }) => {
	if (!row.nameCn?.trim()) return new Error('配件中文名称必填!')
}

const validateNameEn = ({ row }) => {
	if (!row.nameEn?.trim()) return new Error('配件中文名称必填!')
}

const validRules = {
	nameCn:[{required: true,message:'配件中文名称必填!'},
		{ validator: validateNameCn, trigger: 'blur' }
	],
	nameEn:[{ required: true,message:'配件英文名称必填!'},
		{ validator: validateNameEn, trigger: 'blur' }
	]


} // 表格校验


 function translateAll(list,type,cb){
		/**
		 * list 需要翻译的列表
		 * type 希望翻译为该类型 cn /en
		 * */
		if(list?.length === 0) return  false
		let to,from
	 	if(type === 'en'){
			 to = 'en'
			 from = 'zh'
		}else{
			to = 'zh'
			from = 'en'
		}
	 let promiseList = list?.map(v=>{
		 return baiduTranslate(v,from,to,false)
	 })
	 Promise.all(promiseList).then(res=>{
		 if(res?.length === promiseList.length){
			 ElMessage.success('翻译成功')
			 cb(res)
		 }else{
			 ElMessage.error('规格值翻译出错!')
		 }
	 })

 } // 批量翻译

function translateSingal(val,type,cb){
	let to,from
	if(type === 'en'){
		to = 'en'
		from = 'zh'
	}else{
		to = 'zh'
		from = 'en'
	}
	 baiduTranslate(val,from,to,true).then(res=>{

			if(res){
				cb(res)
			}else{
				ElMessage.error('翻译失败!')
			}
	 })
}


export {
	options,
	translateAll,
	translateSingal,
	rules,
	validRules
}
