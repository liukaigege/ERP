<!--
 * @Descripttion: 
 * @version: 
 * @Author: 江澎涛
 * @Date: 2021-08-06 15:53:27
 * @LastEditors: 江澎涛
 * @LastEditTime: 2021-08-22 17:03:24
-->
<template>
	<div class="user">
		<div class="userInfo">
			<el-dropdown @command="getItem">
				<div class="info-box">
					<el-avatar :src="avatar" :size="30"></el-avatar>
					<span class="user-name">{{ userName }}</span>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
						<el-dropdown-item command="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>

		</div>
	</div>
</template>

<script>
	import { userInfo, logout } from './js/user'
	import { useStore } from 'vuex'
	import { useRouter } from 'vue-router'
	import { computed } from 'vue'
	export default {
		setup() {
			let router = useRouter()
			let store = useStore()
			let userName = computed(() => store.state.user.userInfo.userName)
			let avatar = computed(() => store.state.user.userInfo.avatar)
			function getItem(command) {
				if (command == 'userInfo') {
					userInfo(router)
				} else {
					logout(store, router)
				}
			}
			return {
				getItem,
				userName,
				avatar
			}
		}
	}
</script>

<style lang="scss" scoped>
.user {
	height: 60px;
	display: flex;
	align-items: center;
	justify-content: flex-end;

	i {
		color: #909399;
	}
	.info-box {
		display: flex;
		align-items: center;
	}
	.userInfo {
		display: flex;
		align-items: center;
		font-size: 14px;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		line-height: 22px;
	}
	.user-name {
		margin-left: 15px;
	}
}
:deep(.el-dropdown-menu__item:hover) {
	color: #1890ff !important;
}
:deep(.el-avatar){
	background-color: #fff;
}
</style>
