import store from '@/store/index.js'
const globalDirectives = {
	permission: {
		mounted(el, binding) {
			const { value } = binding
			const { authPath } = store.getters
			let flag = authPath[value] || false
			if (!flag) el.style.display = 'none'
		}
	},
	setHeight: {
		mounted(el, { arg = 'height', value }) {
			let clientHeight = document.body.clientHeight
			let offsetTop = el.offsetTop
			let num = clientHeight - offsetTop - value
			el.style[arg] = num + 'px'
		}
	},
	enterHandler: {
		// enter 触发指令，接收事件名称的字符串
		mounted(el, bind, vn) {
			document.enterList ||= []
			document.onkeyup = function (e) {
				if (e.key == 'Enter') {
					bind.instance[bind.value]()
				}
			}
			document.enterList.push(bind)
		},
		unmounted(el, bind) {
			let index = document.enterList.findIndex(item => {
				console.log(item, bind)
				return item.instance == bind.instance
			})
			document.enterList.splice(index, 1)
			if (document.enterList.length) {
				let bind = document.enterList[document.enterList.length - 1]
				document.onkeyup = function (e) {
					if (e.key == 'Enter') {
						bind.instance[bind.value]()
					}
				}
			} else {
				document.onkeyup = null
			}
		}
	},
	// Dialog  拖拽指令
	dragDialog: {
		mounted(el) {
			const dialogHeaderEl = el.querySelector('.el-dialog__header')
			const dragDom = el.querySelector('.el-dialog')
			dialogHeaderEl.style.cursor = 'move'
			// 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
			const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
			dialogHeaderEl.onmousedown = e => {
				// 鼠标按下，计算当前元素距离可视区的距离
				const disX = e.clientX - dialogHeaderEl.offsetLeft
				const disY = e.clientY - dialogHeaderEl.offsetTop
				// 获取到的值带px 正则匹配替换
				let styL, styT
				styL = +sty.left.replace(/\px/g, '')
				styT = +sty.top.replace(/\px/g, '')
				document.onmousemove = function (e) {
					// 通过事件委托，计算移动的距离
					const l = e.clientX - disX
					const t = e.clientY - disY
					// 移动当前元素
					dragDom.style.left = `${l + styL}px`
					dragDom.style.top = `${t + styT}px`
				}
				document.onmouseup = function (e) {
					document.onmousemove = null
					document.onmouseup = null
				}
			}
		}
	},
	enterNumber: { // input框只能输入数字
		mounted(el) {
			el.addEventListener('keypress', function (e) {
				e = e || window.event
				let charcode = typeof e.charCode == 'number' ? e.charCode : e.keyCode
				let re = /\d/
				if (
					!re.test(String.fromCharCode(charcode)) &&
					charcode > 9 &&
					!e.ctrlKey
				) {
					if (e.preventDefault) {
						e.preventDefault()
					} else {
						e.returnValue = false
					}
				}
			})
		}
	}
}
export default globalDirectives
