import {reactive, toRefs, onMounted, watch} from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

export function authPath(e) {
    const store = useStore()
    const route = useRoute()
    const authPath = store.state.user.authPath
    return authPath[e] || false
}

//判断用户对该菜单是否有权限
export function menuAuthPath(e) {
    const store = useStore()
    const menus = store.state.user.userInfo.menus || []
    return menus.length && menus.filter(v => v.requestUrl == e).length
}

export function getPermissionList() {
    const store = useStore()
    const route = useRoute()
    const authPath = store.state.user.authPath
	// console.log(authPath)
  //   const path = route.path
    return authPath
} // 获取当前路由下的权限集合

/**
 * @param apiCall Function 必传 请求数据的api方法
 * @param extraParams Object 非必传 默认为 {} 页面筛选的参数或请求数据的额外参数
 * @param options Object 非必传 默认为 { autoSearch: true }
    * @param pagination Object 非必传 默认为 {} 页面分页需要定制的内容 常见为pageSizes
    * @param dataFilter Function 非必传 处理表格数据的函数 函数的返回值是处理好的表格数据
    * @param autoSearch Boolean 非必传 默认为true 是否需要在onMounted里默认执行获取表格数据的方法
    * @param formHandle Function 非必传 处理除分页数据外的请求数据 返回值为处理好的数据
    * @param callBack Function 非必传 回调函数 目前已知待报价页面特殊场景需要
 */
 export function erpElTable(apiCall, extraParams = {}, options = {}) {
    const opts = Object.assign({
        autoSearch: true
    }, options)

	const state = reactive({
		tableData: [],  // 表格数据
		pagination: {
			currentPage: 1,
			nextPage: 1,
			offset: 0,
			pageSize: 10,
			prePage: 1,
			totalCount: 0,
			totalPage: 0,
			pageSizes: [10, 20, 30, 40, 100]
		}, // 分页常用数据及后台分页数据返回拼接
        tableLoading: false, // 表格loading状态
				tab_masker_show:true
	})

	state.pagination = Object.assign(state.pagination, opts.pagination || {})

  watch(() => extraParams, _ => {
    state.pagination.currentPage = 1
  }, { deep: true })
	// 获取表格数据
	function search() {
		state.tab_masker_show = true
        const extra = opts.formHandle &&  typeof opts.formHandle === 'function' ? opts.formHandle(extraParams) : extraParams
		// 拼接请求参数
		const params = Object.assign({
			page: {
				pageNo: state.pagination.currentPage,
				pageSize: state.pagination.pageSize
			}
		}, extra)
        state.tableLoading = true
		apiCall(params).then(r => {
			state.tab_masker_show = false
			const response = r.data
            state.tableData = opts.dataFilter && typeof opts.dataFilter === 'function' ? opts.dataFilter(response.dataList) : response.dataList
			state.pagination = Object.assign(state.pagination, response.page)
		}).finally(_ => {
			state.tab_masker_show = false
            state.tableLoading = false
            opts.callBack && opts.callBack(state.tableData)
		})
	}

	// 分页切换操作
	function handleSizeChange(val) {
		state.pagination.pageSize = val
		search()
	}

	function handleCurrentChange(val) {
		state.pagination.currentPage = val
		search()
	}

    opts.autoSearch && search()


	return {
		...toRefs(state),
		search,
		handleSizeChange,
		handleCurrentChange,

	}
}
