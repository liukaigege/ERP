<template>
	<div>
		<el-dropdown-item v-bind="$attrs">
			<slot></slot>
		</el-dropdown-item>
	</div>
</template>
<script>
import {ElDropdownItem} from 'element-plus'
export default {
  components: {ElDropdownItem}
}
</script>