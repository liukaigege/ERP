
<template>
	<div class="erp-number-input">
		<el-input-number v-bind="$attrs" v-model="numValue" :size="size" :controls="false" @change="setValue"></el-input-number>
		<div class="erp-number-slot" :class="'erp-number-'+size " v-if="$slots.append">
			<slot name="append"></slot>
		</div>
	</div>
</template>

<script>
	import { useSlots, ref, watch } from 'vue'
	export default {
		props: {
			modelValue: {
				type: [Number, String],
				default: undefined
			},
			size: {
				type: String,
				default: 'default'
			}
		},
		setup(props, ctx) {
			let slot = useSlots()
			let radius = ref('4px')
			let numValue = ref(undefined)
			if (slot.append) {
				radius.value = '4px 0 0 4px'
			}

			watch(() => props.modelValue, (v) => {
				numValue.value = props.modelValue === ''  ? undefined : props.modelValue
			})

			function setValue(v) {
				ctx.emit('update:modelValue', v)
			}
			return {
				radius,
				numValue,
				setValue,
			}
		}

	}
</script>

<style lang="scss" scoped>
	.erp-number-input {
		display: flex;
		align-items: center;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		::v-deep(.el-input__inner) {
			border: none;
		}
		.erp-number-slot {
			background-color: #f5f7fa;
			color: #909399;
			border-left: 1px solid #dcdfe6;
			flex-grow: 1;
      white-space: nowrap;
		}
		.erp-number-large {
			padding: 0 20px;
			height: 40px;
			line-height: 40px;
		}

		.erp-number-default {
			padding: 0 15px;
			height: 32px;
			line-height: 32px;
		}
		.erp-number-small {
			padding: 0 10px;
			height: 24px;
			line-height: 24px;
		}
	}
</style>
