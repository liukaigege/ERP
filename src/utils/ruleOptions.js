/*
 * @Descripttion:
 * @version:
 * @Author: 韦剑
 * @Date: 2021-07-26 14:03:17
 * @LastEditors: 韦剑
 * @LastEditTime: 2021-08-02 13:54:49
 */
export const rules = {
  price: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[0-9][0-9]*\.\d{1,2})))$/,
  rate: /^(([0-9][0-9]*)|(([0]\.\d{1,4}|[0-9][0-9]*\.\d{1,4})))$/,
  discount: /^[0-9]\.[0-9]$|^[0-9]$|10$|10.0$/,
  number: /^[1-9]\d*$/
}
// 校验数字
export function checkNumber(rule, value, callback) {
  const reg = new RegExp(/^[0-9]+$/)
  if (value && !reg.test(value)) {
    callback('请输入数字!')
  }
  callback()
}

// 校验非数字
export function uncheckNumber(rule, value, callback) {
  const reg = new RegExp(/^(?!.*[0-9])/)
  if (value && !reg.test(value)) {
    callback('请输入非数字!')
  }
  callback()
}

export function checkInteger(rule, value, callback) {
  const reg = new RegExp(/^([1-9]\d*|[0]{1,1})$/)
  if (value && !reg.test(value)) {
    callback('请输入正整数!')
  }
  callback()
}
// 校验数字保留二位小数
export function checkNumber_2(rule, value, callback) {
  const reg = rules.price
  if ((value && !reg.test(value)) || value < 0) {
    callback(new Error('请输入数字最多保留两位小数!'))
  } else {
    callback()
  }
}
// 校验数字保留4位小数
export function checkNumber_4(rule, value, callback) {
  const reg = rules.rate
  if ((value && !reg.test(value)) || value < 0 || value >= 10) {
    callback(new Error('请输入数字最多保留4位小数!'))
  } else {
    callback()
  }
}
// 校验数字保留三位小数
export function checkNumber_3(rule, value, callback) {
  const reg = /^(([0-9][0-9]*)|(([0]\.\d{1,3}|[0-9][0-9]*\.\d{1,3})))$/

  if (value && !reg.test(value)) {
    callback(new Error('请输入数字最多保留三位小数!'))
  } else {
    callback()
  }
}
// 校验数字保留二位小数整数6
export function checkNumber_6_2(rule, value, callback) {
  const reg = /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/
  if ((value && !reg.test(value)) || value < 0) {
    callback(new Error('请输入数字最多保留两位小数,整数位最多6位'))
  } else {
    callback()
  }
}

// 校验数字保留二位小数整数4
export function checkNumber_4_2(rule, value, callback) {
  const reg = /(^[0-9]{1,4}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/
  if ((value && !reg.test(value)) || value < 0) {
    callback(new Error('请输入数字最多保留两位小数,整数位最多4位'))
  } else {
    callback()
  }
}
// 校验全字母
export function checkLetter(rule, value, callback) {
  const reg = new RegExp(/^[a-zA-Z]+$/g)
  if (value && !reg.test(value)) {
    callback('请输入字母!')
  }
  callback()
}

// 校验纯小写字母
export function checkLowercase(rule, value, callback) {
  const reg = new RegExp(/^[a-z]+$/g)
  if (value && !reg.test(value)) {
    callback('请输入小写字母!')
  }
  callback()
}

// 校验纯大写字母
export function checkUppercase(rule, value, callback) {
  const reg = new RegExp(/^[A-Z]+$/g)
  if (value && !reg.test(value)) {
    callback('请输入大写字母!')
  }
  callback()
}

// 校验汉字
export function checkWords(rule, value, callback) {
  const reg = new RegExp(/^[\u4E00-\u9FA5]+$/g)
  if (value && !reg.test(value)) {
    callback('请输入汉字!')
  }
  callback()
}

// 校验手机号
export function checkPhone(rule, value, callback) {
  const reg = new RegExp(/^1[3456789]\d{9}$/g)
  if (value && !reg.test(value)) {
    callback('请输入正确的手机号!')
  }
  callback()
}

// 校验url
export function checkLink(rule, value, callback) {
  const reg = new RegExp(/(http|https):\/\/([\w.]+\/?)\S*/)
  if (!reg.test(value)) {
    callback('请输入正确的url格式如：https://...')
  } else {
    callback()
  }
}
// 校数字或者字母
export function checkNumOrWords(rule, value, callback) {
  const reg = new RegExp(/^[A-Za-z0-9]+$/)
  if (value && !reg.test(value)) {
    callback('只能输入字母或者数字')
  }
  callback()
}

export function handleUsernameOrEmail(rule, value, callback) {
  const { state } = this
  const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
  if (regex.test(value)) {
    state.loginType = 0
  } else {
    state.loginType = 1
  }
  callback()
}

// 校数小数
// 不包含0： \b0(\.\d{ 1, 2}) \b

// 包含0： \b0(\.\d{ 1, 2}) ?\b

// 包含0和1： \b(0(\.\d{ 1, 2}) ?) | 1\b
export function checkDecimal(rule, value, callback) {
  const reg = rules.discount
  console.log(!reg.test(value) || +value === 0)
  if (!reg.test(value) || +value === 0) {
    callback('输入0-10且保留一位小数')
  }
  callback()
}

// 校验密码
export function validateToNextPassword(rule, value, callback) {
  const reg = new RegExp(/^\S+$/)
  if (value && !reg.test(value)) {
    callback('密码不能含有空格')
  }
  callback()
}

// 校验中文/大小写字母/数字（不包含标点符号）
export function validataPunctuation(rule, value, callback) {
  const reg = new RegExp(/^[\u4E00-\u9FA5A-Za-z0-9]+$/)
  if (value && !reg.test(value)) {
    callback('不能包含标点符号')
  }
  callback()
}
