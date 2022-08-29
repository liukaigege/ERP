/*
 * @Author: 朱涛
 * @Date: 2021-06-20 19:34:13
 * @LastEditTime: 2021-11-15 16:43:14
 * @LastEditors: 韦剑
 * @Description: 工具类自定义指令 后期工具函数中若有预估到使用量较大的指令，则可将其挪至全局的自定指令文件中配置
 * @FilePath: /erp/src/utils/directive/erpToolsDirective.js
 */

import { ElMessage } from 'element-plus'
export const copy = {
  beforeMount(el, binding, vnode, prevVnode) { },
  // 绑定元素的父组件挂载时调用
  mounted(el, binding, vnode, prevVnode) {
    const { value } = binding
    el.$value = value
    el.onclick = () => {
      if (!el.$value) {
        // 值为空的时候，给出提示。可根据项目UI仔细设计
        ElMessage.warning('暂无复制内容')
        return
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea')
      // 将该 textarea 设为 readonly 同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea)
      textarea.select()
      const result = document.execCommand('Copy')
      if (result) {
        ElMessage.success('复制成功') // 可根据项目UI仔细设计
      }
      document.body.removeChild(textarea)
      el.addEventListener('click', el.handler)
    }
  },
  // 在包含组件的 VNode 更新之前调用
  beforeUpdate() { },
  // 在包含组件的 VNode 及其子组件的 VNode 更新之后调用
  updated(el, binding) {
    const { value } = binding
    el.$value = value
  }
  // 在绑定元素的父组件卸载之前调用
} // 复制文本

// 防抖函数 v-debounce 绑定的就是点击触发的事件名
export const debounce = {
  mounted(el, binding) {
    let timer;
    binding.handler = () => {
      if (timer) clearTimeout(timer)
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, 1000)
      if (callNow) binding.value()
    }
    el.addEventListener('click', binding.handler)
  },
  unmounted(el,binding) {
    el.removeEventListener('click', binding.handler)
  },
}

export const inputtrim = (el, binding, vnode, prevVnode) => {
  const input = el.getElementsByTagName('input')[0]
  input.onblur = function (e) {
    if (input.value) {
      input.value = input.value.trim()
    }
    trigger(input, 'input')
  }
} // 去除首位空格

export const numbernint = (el, binding, vnode, prevVnode) => {
  const input = el.getElementsByTagName('input')[0]
  input.onfocus = function (e) {
    if (input.value) {
      input.value = input.value.replace(/[^1-9]/g, '')
    }
    trigger(input, 'input')
  }
} // 输入正整数

function trigger(es, type) {
  const e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  es.dispatchEvent(e)
}

// table表头吸顶
export const theadSticky = {
  mounted(el, binding, vnode, prevVnode) {
    let { className, stickyNum } = binding.value
    let tableHead = document.querySelector(className)
    window.addEventListener('scroll', theadSticky.handleScroll(el, tableHead, stickyNum))
  },
  beforeUnmount() {
    window.removeEventListener('scroll', theadSticky.handleScroll())
  },
  handleScroll(el, tableHead, stickyNum) {
    return () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop >= (el.offsetTop - stickyNum)) {
        tableHead.style.position = 'sticky'
        tableHead.style.top = stickyNum + 'px'
        tableHead.style.zIndex = 10
      } else {
        tableHead.style.position = 'static'
      }
    }
  }
}
