<template>
	<slot></slot>
</template>

<script>
import {useLocale} from 'element-plus'

export default {
	props: {
		// 如果你需要你的应用可以相应式的更新语言，那么这里的 props 必须包含下面这个 props
		// ...useLocaleProps,
	},
	setup() {
		// 不需要任何参数，但是需要你的这个组件可以接受
		// ` { locale?: Language, i18n?: (...args: any[]) => string }` 作为参数
		useLocale()
	}
}
</script>
