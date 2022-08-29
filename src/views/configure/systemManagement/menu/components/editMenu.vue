<template>
	<el-dialog :title="routerType == 1 ? '编辑菜单' : '新增菜单'" width="600px" v-model="centerDialogVisible" :before-close="close" :close-on-click-modal="false">
		<el-form :model="form" :ref="formRef" :inline="true"  label-width="80px" :rules="rules">
			<el-form-item label="菜单类型:" prop="menuType">
				<el-radio-group v-model="form.menuType" >
					<el-radio-button label="M">目录</el-radio-button>
					<el-radio-button label="C">菜单</el-radio-button>
					<el-radio-button label="F">按钮</el-radio-button>
					<el-radio-button label="D">字段</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<br />
			<!-- 菜单图标 -->
			<el-form-item label="菜单图标:" v-if="form.menuType == 'M'">
				<el-popover placement="bottom" :width="400" popper-class='menu-icon-content' trigger="click" v-model:visible="visible">
					<div style="display:flex;justify-content:space-between;align-items:center;">
             <el-input v-model="name" @input="filterIcons" style="width:340px;"/>
          <i class="el-icon-close" style="font-size:22px;cursor: pointer;color:#1880E7" @click="iconClose"></i>
          </div>
         
					<ul class="vango-icon-view">
						<li v-for="item in iconJson" class="icon-box" :key='item'>
							<i :class="['vango-icon', item]"></i>
							<span @click="setIcon(item)">{{item}}</span>
						</li>
					</ul>
					<template #reference>
						<el-input style="width: 448px" readonly v-model="form.icon" @click="visible = !visible">
							<template #prefix>
								<i :class="['vango-icon',form.icon]"></i>
							</template>
						</el-input>
					</template>
				</el-popover>
			</el-form-item>
			<!-- 菜单可见 -->
			<el-form-item v-if="form.menuType == 'C'" label="菜单可见:" prop="visible">
				<el-radio-group v-model="form.visible" size="small">
					<el-radio-button label="0">是</el-radio-button>
					<el-radio-button label="1">否</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<!-- 是否缓存 -->
			<el-form-item v-if="form.menuType == 'C'" label="是否缓存:" prop="isKeepAlive">
				<el-radio-group v-model="form.isKeepAlive" size="small">
					<el-radio-button label="0">是</el-radio-button>
					<el-radio-button label="1">否</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<!-- 是否是路由 -->
			<el-form-item v-if="form.menuType == 'F'" label="是否是路由:" prop="isRoute" label-width="100px">
				<el-radio-group v-model="form.isRoute" size="small">
					<el-radio-button :label="0">否</el-radio-button>
					<el-radio-button :label="1">是</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<!-- 是否可设置数据权限 -->
			<el-form-item v-if="form.menuType == 'C'" label=" 是否可设置数据权限:" prop="dsFlag" label-width="150px">
				<el-radio-group v-model="form.dsFlag " size="small">
					<el-radio-button label="1">是</el-radio-button>
					<el-radio-button label="0">否</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<br />
			<!-- 菜单标题 -->
			<el-form-item label-width="100" v-if="form.menuType == 'M' || form.menuType == 'C'" label="菜单标题:" prop="menuName">
				<el-input v-model="form.menuName" :style="form.menuType == 'M' ? 'width: 178px' : 'width: 178px'" placeholder="菜单标题" />
			</el-form-item>
			<!-- 按钮名称 -->
			<el-form-item label-width="100" v-if="form.menuType == 'F' || form.menuType == 'D'" label="按钮名称:" prop="menuName">
				<el-input v-model="form.menuName" placeholder="按钮名称" style="width: 450px" />
			</el-form-item>

			<!-- 唯一标识 -->
			<el-form-item v-if="form.menuType == 'D'" label="唯一标识:" prop="uniqueId">
				<el-input v-model="form.uniqueId" placeholder="唯一标识" style="width: 178px" />
			</el-form-item>
			<!-- 字段宽度 -->
			<el-form-item label="宽度:" prop="fontWidth" v-if="form.menuType == 'D'">
				<el-input-number v-model.number="form.width" :min="0" :max="999" controls-position="right" style="width: 178px" />
			</el-form-item>
			<!-- 权限标识 -->
			<el-form-item v-if="
          form.menuType == 'C' || form.menuType == 'F' || form.menuType == 'D'
        " label="权限标识:" prop="requestUrl">
				<el-input v-model="form.requestUrl" placeholder="权限标识" style="width: 178px" />
			</el-form-item>

			<!-- 路由地址 -->
			<el-form-item label-width="100" v-if="form.menuType == 'C' || form.isRoute== 1" label="路由地址:" prop="routeUrl">
				<el-input v-model="form.routeUrl" placeholder="路由地址" style="width: 178px" />
			</el-form-item>
			<!-- 菜单排序 -->
			<el-form-item label="显示排序:" prop="orderNum">
				<el-input-number v-model.number="form.orderNum" :min="0" :max="999" controls-position="right" style="width: 178px" />
			</el-form-item>
			<!-- 组件名称 -->
			<el-form-item label-width="100" label="组件名称:" prop="componentName" v-if="form.menuType == 'C' || form.isRoute== 1">
				<el-input v-model="form.componentName" style="width: 178px" placeholder="匹配组件内Name字段" />
			</el-form-item>

			<!-- 组件路径 -->
			<el-form-item label="组件路径:" prop="componentUrl" v-if="form.menuType == 'C' || form.isRoute== 1">
				<el-input v-model="form.componentUrl" :style="form.menuType == 'C' ? 'width: 178px' : 'width:450px'" placeholder="组件路径" />
			</el-form-item>
			<!-- 上级类目 -->
			<el-form-item label="上级类目:">
				<elSelectTree @ok="getValue" :multiple="false" :data="dataList" :width="425" :treeProps="{
            value: 'menuId',
            label: 'menuName',
            children: 'children'
          }" :defaultCheckedKeys="defaultCheckedKeys" :checkStrictly="true" />
			</el-form-item>
			<el-form-item label="备注:" prop="remark">
				<el-input v-model="form.remark" style="width: 450px" type="textarea" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button  @click="close">取 消</el-button>
				<el-button  type="primary" @click="submitForm">确 定</el-button>
			</span>
		</template>
	</el-dialog>
</template>
<script>
	import iconJson from '@/assets/js/iconJson'
	import { ElMessage } from 'element-plus'
	import { reactive, toRefs, ref, toRaw } from 'vue'
	import elSelectTree from '@/components/elSelectTree/index.vue'
	import {
		addMenus, //新增菜单
		updateMemus, // 修改菜单
		searchMenuList //查询所有菜单列表
	} from '@/api/user.js'
	import { nextTick, onMounted } from 'vue'
	export default {
		components: { elSelectTree },
		props: {
			routerType: {
				type: Number,
				default: 1
			},
			datas: {
				type: Array,
				default: []
			},
			row: {
				type: Object,
				default: {}
			}
		},
		emits: ['close'],
		setup(props, { attrs, emit }) {
			const routerType = props.routerType
			const row = props.row
			const state = reactive({
				name: '',
				visible: false,
				iconJson: iconJson,
				//回显菜单
				defaultCheckedKeys: [],
				dataList: [], //类目的树形结构
				//表单验证
				rules: {
					menuName: [
						{ required: true, message: '请输入', trigger: 'blur' },
						{ max: 200, message: '长度16个字符', trigger: 'blur' }
					],
					routeUrl: [
						{ required: true, message: '请输入', trigger: 'blur' },
						{ max: 200, message: '长度16个字符', trigger: 'blur' }
					],
					componentName: [{ required: true, message: '请输入', trigger: 'blur' }]
				},
				menus: [],
				centerDialogVisible: true, //控制弹框的显示和隐藏

				form: {
					menuName: '', //菜单名称
					menuType: 'M', //菜单类型
					orderNum: undefined, //显示顺序
					width: undefined, //宽度
					requestUrl: '', //权限标识
					routeUrl: '', //路由
					componentUrl: '', //组件地址
					isKeepAlive: '0', //是否缓存
					visible: '0', //菜单状态
					remark: '', //备注
					uniqueId: '', //唯一标识
					parentId: null, //父菜单ID
					componentName: '', //组件名称
					isRoute: 0,
					icon: '',
					dsFlag: '0'
				}
			})
			//初始进入判断是编辑页面时候回显
			const init = () => {
				if (routerType == '1') {
					; (state.form.menuName = row.menuName ? row.menuName : ''),
						(state.form.routeUrl = row.routeUrl ? row.routeUrl : ''),
						(state.form.menuType = row.menuType ? row.menuType : ''),
						(state.form.orderNum = row.orderNum ? row.orderNum - 0 : undefined),
						(state.form.requestUrl = row.requestUrl ? row.requestUrl : ''),
						(state.form.componentUrl = row.componentUrl ? row.componentUrl : ''),
						(state.form.visible = row.visible ? row.visible : ''),
						(state.form.remark = row.remark ? row.remark : ''),
						(state.form.isKeepAlive = row.isKeepAlive ? row.isKeepAlive : '0'), //是否缓存
						(state.form.width = row.width ? row.width - 0 : undefined),
						(state.form.componentName = row.componentName
							? row.componentName
							: ''),
						(state.form.uniqueId = row.uniqueId ? row.uniqueId : ''),
						(state.form.parentId = row.parentId ? row.parentId : null),
						(state.form.icon = row.icon ? row.icon : ''),
						(state.form.dsFlag = row.dsFlag ? row.dsFlag : ''),
            (state.form.isRoute = row.isRoute ),
						state.defaultCheckedKeys = row.parentId ? [row.parentId] : []
				}
			}
			//页面加载后
			onMounted(() => {
				init()
			})
			//关闭弹框事件
			const close = () => {
				emit('close', false)
			}
			//选择菜单类目
			const getValue = e => {
				state.form.parentId = e
			}
			//提交时候
			let formR = ''
			const formRef = el => {
				formR = el
			}
			const submitForm = () => {
				formR
					.validate()
					.then(() => {
						//当进入的是新增菜单点击提交时候
						//不会存在深浅拷贝问题
						let {
							menuType,
							visible,
							menuName,
							requestUrl,
							routeUrl,
							componentUrl,
							parentId,
							remark,
							componentName,
							uniqueId,
							isKeepAlive,
							icon,
              isRoute,
              dsFlag
						} = state.form,
							params = {
								menuType,
								visible,
								menuName,
								requestUrl,
								routeUrl,
								componentUrl,
								parentId,
								remark,
								componentName,
								uniqueId,
								isKeepAlive,
								icon,
                isRoute,
                dsFlag
							}
						params.orderNum = state.form.orderNum ? state.form.orderNum + '' : '0'
						params.width = state.form.width ? state.form.width + '' : '0'
						if (routerType == '2') {
							addMenus(params).then(res => {
								if (res.code == 200) {
									emit('close', true)
								} else {
									ElMessage.error(res.message)
								}
							})
						} else {
							params.menuId = row.menuId
							updateMemus(params).then(res => {
								if (res.code == 200) {
									emit('close', true)
									ElMessage.success(res.message)
								} else {
									ElMessage.error(res.message)
								}
							})
						}
					})
			}
			//查询所有菜单列表
			searchMenuList().then(res => {
				if (res.code == 200) {
					state.dataList = res.data
				} else {
					ElMessage.error(res.message)
				}
			})
			//查询菜单图标
			const filterIcons = () => {
				if (state.name) {
					state.iconJson = state.iconJson.filter(item =>
						item.includes(state.name)
					)
				} else {
				}
			}
			// 设置体表
			function setIcon(item) {
				state.form.icon = item
				state.visible = false
			}
      //编辑弹框的关闭
      function iconClose(){
       state.visible=false
      }
			return {
				...toRefs(state),
				routerType,
				row,
				close,
				submitForm,
				formRef,
				getValue,
				filterIcons,
				setIcon,
        iconClose
			}
		}
	}
</script>

<style lang="scss" scoped>
	.menu-icon-content {
		.vango-icon-view {
			max-height: 250px;
			overflow: auto;
			li {
				cursor: pointer;
				line-height: 2;
				display: flex;
				align-items: center;
        
			}
			.vango-icon {
				margin-right: 10px;
			}
		}
	}
</style>