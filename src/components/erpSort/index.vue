<template>
  <div class="erp-sort-line">
    <span class="mr-10">排序:</span>
    <el-button :class="opt.type ? '' : 'color-text'" @click="changeSort(opt)" type="text" v-for="opt in sortOptions" :key="opt.value">{{opt.label}}<i :class="generateClass(opt)"></i></el-button>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
export default {
  emits: ['sort'],
  props: {
    // 排序类型 [{ value: 1, label: '排序1' }, { value: 2, label: '排序2' }]
    options: {
      type: Array,
      default: []
    },
    // 默认排序方式 [{ value: 1, type: 'asc' }]
    defaultSort: {
      type: Object,
      default: {}
    },
    defaultValue: {
      default: true
    }
  },
  setup(props, ctx) {

    const sortOptions = ref([])
    pushSortOptions()

    watch(() => props.defaultSort, _ => {
      sortOptions.value.splice(0)
      pushSortOptions()
    }, {
      deep: true
    })

    watch(() => props.options, _ => {
      sortOptions.value = []
      pushSortOptions()
    }, {
      deep: true
    })

    function pushSortOptions() {
      props.options.forEach(opt => {
        const obj = Object.assign(opt, {
          type: opt.value === props.defaultSort.value ? props.defaultSort.type : null
        })
        sortOptions.value.push(obj)
      })
    }

    function changeSort(opt) {
      // 清空其他选中状态
      sortOptions.value.forEach(o => {
        if (o.value !== opt.value) o.type = null
      })
      opt.type = opt.type ? (opt.type === 'asc' ? 'desc' : 'asc') : 'desc'
      if (props.defaultValue) ctx.emit('sort', opt.value, opt.type)
      else ctx.emit('sort', { val: opt.value, type: opt.type })
    }

    function generateClass(opt) {
      return opt.type ? (opt.type === 'asc' ? 'el-icon-caret-top' : 'el-icon-caret-bottom') : ''
    }

    function resetSort() {
      sortOptions.value.forEach(o => o.type = null)
    }

    return {
      sortOptions,
      changeSort,
      generateClass,
      resetSort
    }
  }
}
</script>

<style lang="scss" scoped>
.erp-sort-line {
  display: flex;
  align-items: center;
	&>span{
		line-height: 32px;
	}
}
.mr-10 {
  margin-right: 10px;
}
.color-text {
  color: #606266;
}
</style>
