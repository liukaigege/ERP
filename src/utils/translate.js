import axios from 'axios'
import { ElMessage } from 'element-plus'
import { storage } from '../utils/storage.js'

const client_id = 'HljGzvnhYptPibd8hexquoYN'
const client_secret = 'Cpxo0KxYtQmXpKcXnekAhRIzL0GUqFxm'
const translateUrl = '/baidu_tranlate/rpc/2.0/mt/texttrans/v1'
const tokenUrl = '/baidu_tranlate/oauth/2.0/token'
const grant_type = 'client_credentials'

// 获取access_token
function getAccessToken() {
  return new Promise((resolve, reject) => {
    axios.get(tokenUrl, {
      params: {
        grant_type,
        client_id,
        client_secret
      }
    }).then(r => {
      const data = r.data
      storage.set('BAIDU_TOKEN', data.access_token)
      resolve(data.access_token)
    }).catch(e => {
      storage.remove('BAIDU_TOKEN')
      reject(null)
      ElMessage.error('当前翻译异常，请稍后再试')
    })
  })
}

// 返回结果是一个对象 属性 arr 是翻译结果原始数据 str 是翻译结果数据拼接完成的字符串
// 参数说明 q 需要翻译的内容，from 原始语言 to 翻译后语言 msg 是否显示翻译成功的提示语 默认值为true

export function baiduTranslate(q, from, to, msg = true) {
  // 输入为空 或 全为空字符时校验
  if (!q || !/^(?!(\s+$))/.test(q)) {
    ElMessage.error('请先输入需要翻译的文本')
    return Promise.reject(null)
  }
  // 常用 'en' 英文 'zh' 中文
	if(q === "0"){
		console.log(q)
		if (msg) ElMessage.success('翻译成功')
		return  Promise.resolve({
			str:"0"
		})
	} // 为字符串0时,单独处理
  return new Promise((resolve, reject) => {
    if (!storage.get('BAIDU_TOKEN')) {
      getAccessToken().then(_ => {
        baiduTranslate(q, from, to).then(r => {
          resolve(r)
        }).catch(e => reject(null))
      }).catch(e => reject(null))
    } else {
      axios.post(translateUrl + '?access_token=' + storage.get('BAIDU_TOKEN'), {
        q,
        from,
        to
      }).then(r => {
        const data = r.data
        if (data.error_code) {
          // 常规报错
          if (data.error_code !== 100 && data.error_code !== 110 && data.error_code !== 111) {
            ElMessage.error(data.error_msg)
            reject(null)
          } else {
            // token拉取失败 或者 token失效
            getAccessToken().then(_ => {
              baiduTranslate(q, from, to).then(r => {
                resolve(r)
              }).catch(e => reject(null))
            }).catch(e => reject(null))
          }
        } else {
          const { trans_result } = data.result
          const arr = trans_result.map(t => t.dst)
          resolve({
            arr,
            str: arr.join('')
          })
          if (msg) ElMessage.success('翻译成功')
        }
      }).catch(e => {
        storage.remove('BAIDU_TOKEN')
        ElMessage.error('当前翻译异常，请稍后再试')
        reject(null)
      })
    }

  })
}

// querys 需要翻译的文本数组 其他参数同baiduTranslate
export function batchBaiduTranslate(querys, from, to, msg = true) {
  let promises = []
  querys.forEach(element => {
    if (!element || !/^(?!(\s+$))/.test(element)) {
      promises.push(Promise.resolve({
        arr: [],
        str: null
      }))
    } else {
      promises.push(baiduTranslate(element, from, to, false))
    }
  });
  return new Promise((resolve, reject) => {
    Promise.all(promises).then(res => {
      resolve(res)
      if (msg) ElMessage.success('翻译成功')
    }).catch(e => reject(e))
  })
}
