import { checkNumber_2 } from '@/utils/ruleOptions.js'
import {checkDomain} from '@/api/goods/shop.js'

export function requiredValue(msg) { // 必填
    return { required: true, message: msg, trigger: ['blur', 'change'] }
}

export function moneyRules(data, msg) {
    return [requiredValue(msg), {
        validator: (rule, value, callback) => {
            if (data.company == 1) {
                if (value < 0 || value > 9999999.99) {
                    return callback('请输入0到9999999.99之间的数字')
                } else {
                    return callback()
                }
            } else {
                if (value < 0 || value > 999999.99) {
                    return callback('请输入0到999999.99之间的数字')
                } else {
                    return callback()
                }
            }
        },
        trigger: ['blur', 'change']
    }, { validator: checkNumber_2, trigger: ['blur', 'change'] }]
}

export function fee(msg) { // 手续费
    return [requiredValue(msg), {
        validator: (rule, value, callback) => {

            if (value < 0 || value > 99.99) {
                callback('请输入0-99.99之间的数字')
            } else {
                callback()
            }
        },
        trigger: ['blur', 'change']
    }, { validator: checkNumber_2, trigger: ['blur', 'change'] }]
}

export function ruleUrl(msg,type,data) { // type:域名校验类型
    return [
        requiredValue(msg), {
            validator: (rule, value, callback) => {
                const url = RegExp(/^(http|https):\/\//)
                if (url.test(value)) {
                    callback('请勿输入http://或https://')
                } else {
                    callback()
                }
            }, trigger: 'blur'
        },{
            validator:(rule,value,callback)=>{
                const url = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/g
                if(url.test(value)){
                    callback()
                }else{
                    callback('请输入一个合法的域名')
                }
            },trigger:'blur'
        },{
            validator:(rule,value,callback)=>{
                if(type !== 0 &&  type !== 1) return callback()
                checkDomain({type,domain:'https://' + value}).then(res=>{
                    callback()
                }).catch(err=>{
                    callback(err.message)
                })
            },trigger:'blur'
        }
    ]
}