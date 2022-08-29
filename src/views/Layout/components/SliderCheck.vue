<!--
 * @Descripttion: 滑块验证组件
 * @version: 
 * @Author: 朱涛
 * @Date: 2021-07-09 15:18:03
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-07-16 10:00:47
--> 
<template>
	<div class="slider-check-box">
		<div class="slider-check" :class="rangeStatus ? 'success' : ''">
			<i @mousedown="rangeMove" :class="rangeStatus ? successIcon : startIcon"></i>
			{{ rangeStatus ? successText : startText }}
		</div>
	</div>
</template>

<script>
	import { reactive, toRefs } from 'vue'
	export default {
		props: {
			// 成功之后的函数
			successFun: {
				type: Function
			},
			//成功图标
			successIcon: {
				type: String,
				default: 'el-icon-success'
			},
			//成功文字
			successText: {
				type: String,
				default: '验证成功'
			},
			//开始的图标
			startIcon: {
				type: String,
				default: 'el-icon-right'
			},
			//开始的文字
			startText: {
				type: String,
				default: '向右滑动完成验证'
			},
			//失败之后的函数
			errorFun: {
				type: Function
			},
			//或者用值来进行监听
			status: {
				type: String
			}
		},
		setup(props, context) {
			const data = reactive({
				disX: 0,
				rangeStatus: false,
			})

			const rangeMove = e => {
				let ele = e.target
				let startX = e.clientX
				let eleWidth = ele.offsetWidth
				let parentWidth = ele.parentElement.offsetWidth
				let MaxX = parentWidth - eleWidth
				if (data.rangeStatus) {
					//不运行
					return false
				}

				document.onmousemove = e => {
					let endX = e.clientX
					data.disX = endX - startX
					if (data.disX <= 0) {
						data.disX = 0
					}
					if (data.disX >= MaxX - eleWidth) {
						//减去滑块的宽度,体验效果更好
						data.disX = MaxX
					}
					ele.style.transition = '.1s all'
					ele.style.transform = 'translateX(' + data.disX + 'px)'

					e.preventDefault()
				}

				document.onmouseup = () => {
					if (data.disX !== MaxX) {
						ele.style.transition = '.5s all'
						ele.style.transform = 'translateX(0)'
						//执行成功的函数

						props.errorFun && props.errorFun()
					} else {
						data.rangeStatus = true
						if (props.status) {
							context.$parent[props.status] = true
						}
						//执行成功的函数
						props.successFun && props.successFun()
					}
					document.onmousemove = null
					document.onmouseup = null
				}
			}

			return {
				...toRefs(data),
				rangeMove
			}
		}

	}

</script>
<style lang="scss" scoped>
	$blue: #198eeb;
	@mixin jc-flex {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.slider-check-box {
    width: 100%;
		.slider-check {
			background-color: #e9e9e9;
			position: relative;
			transition: 1s all;
			user-select: none;
			color: #585858;
			@include jc-flex;
			height: 40px;
			&.success {
				background-color: $blue;
				color: #fff;
				i {
					color: $blue;
				}
			}
			i {
				position: absolute;
				left: 0;
				width: 50px;
				height: 100%;
				color: $blue;
				background-color: #fff;
				border: 1px solid #d8d8d8;
				cursor: pointer;
				font-size: 24px;
				@include jc-flex;
			}
		}
	}
</style>