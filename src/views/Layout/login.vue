<!--
 * @Descripttion:
 * @version:
 * @Author: 朱涛
 * @Date: 2021-07-05 10:33:46
 * @LastEditors: 朱涛
 * @LastEditTime: 2021-08-22 16:41:46
-->
<template>
	<div class="loginView">

		<div class="login_box">
			<div class="box_left">
				<img src="../../assets/image/loginLogo.png" alt="" srcset="">
			</div>
			<div class="box_right">
				<p class="right_title">欢迎登录ERP后台</p>
				<p class="right-version">VANGO-ERP&nbsp;&nbsp;V1.5.11</p>

				<el-form :model="form" class="form" @keyup.enter="loginFun">
					<el-form-item>
						<el-input v-model="form.userName" size="large" prefix-icon="el-icon-user" placeholder="请输入账户名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-input v-model="form.passWord" type="password" size="large" prefix-icon="el-icon-lock" placeholder="请输入密码"></el-input>
					</el-form-item>
					<el-form-item>
						<SliderCheck :successFun="handleSuccessFun" :errorFun="handleErrorFun"></SliderCheck>
					</el-form-item>
					<el-form-item>
						<el-checkbox v-model="form.autoLogin">自动登录</el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button class="login_btn" type="primary" @click="loginFun">登 录</el-button>
					</el-form-item>
				</el-form>

			</div>
		</div>

	</div>
</template>

<script>
	import SliderCheck from '@/views/Layout/components/SliderCheck.vue'
	import { reactive, toRefs } from 'vue'
	import { useRouter } from 'vue-router'
	import { useStore } from 'vuex'
	import { ElMessage } from 'element-plus'
	export default {
		components: {
			SliderCheck
		},
		setup() {
			const router = useRouter()
			const store = useStore()
			const data = reactive({
				form: {
					userName: '',
					passWord: '',
					autoLogin: false,
					slider: false,
				}
			})
			const handleSuccessFun = (e) => {
				data.form.slider = true
				if (data.form.userName && data.form.passWord) loginFun()
			}
			const handleErrorFun = (err) => {
				data.form.slider = false
			}

			const loginFun = () => {
				const {
					userName,
					passWord,
					autoLogin,
					slider
				} = data.form
				if (!userName) {
					ElMessage.error({
						message: '请输入用户名'
					})
					return
				}
				if (!passWord) {
					ElMessage.error('请输入密码')
					return
				}
				if (!slider) {
					ElMessage.error('请完成滑块验证')
					return
				}
				const params = {
					username: userName,
					password: passWord
				}
				store.dispatch('user/loginByActions', params).then(res => {
					store.commit('menu/setHeaderMenu', res.sysUser)
					router.replace({
						path: '/index'
					})
					store.dispatch('user/authPath')
				})
			}
			return {
				...toRefs(data),
				handleSuccessFun,
				handleErrorFun,
				loginFun,
			}
		}
	}
</script>

<style lang="scss" scoped>
	.loginView {
		width: 100vw;
		height: 100vh;
		background: url('../../assets/image/loginBg.png') no-repeat;
		background-size: 100% 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.login_box {
		display: flex;
		align-items: center;

		.box_left {
			width: 498px;
			height: 533px;
			background: rgba(0, 0, 0, 0.3);
			border-radius: 4px 0px 0px 4px;
			display: flex;
			align-items: center;
			justify-content: center;

			img {
				width: 322px;
				height: 201px;
			}
		}

		.box_right {
			width: 498px;
			height: 533px;
			background: #ffffff;
			border-radius: 0px 4px 4px 0px;
			padding: 76px 65px 0 65px;
			display: flex;
			align-items: center;
			flex-direction: column;

			.right_title {
				font-size: 24px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.65);
			}
			.right-version {
				font-size: 14px;
				margin-top: 10px;
				color: rgba(0, 0, 0, 0.45);
				line-height: 22px;
			}
		}
	}

	.el-input__icon {
		color: #1890ff !important;
	}

	:deep(.form) {
		width: 100%;
		margin-top: 34px;
		.login_btn {
			width: 100%;
		}
	}
</style>
