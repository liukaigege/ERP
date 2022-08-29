| 文档名称 | 《Vango-ERP 前端框架技术手册》 |
| -------- | ------------------------------ |
| 文档版本 | V1.0                           |
| 编辑人员 | 前端组                         |
| 更新历史 | 2021-06-07 文档创建            |

# 1. 前言

## 1.1 背景和阅读对象

jsp -> El-admin -> antdesign vue

## 1.2 现有框架问题

ant 社区不活跃、可参考文档较少，市场使用量少，组件存在 bug

权限部分实现待完善

路由未打开三级

组件封装度不够

...

## 1.3 技术选型

阐述 Vue3.0 和 element Plus 或其他技术选型理由，并附上相关技术点文档参考链接

如 渲染优化、打包体积启动快、vite 介绍等

```
**1.3.1** 项目技术选型
项目框架使用vue3
vue3中文文档:https://vue3js.cn/docs/zh/guide/migration/introduction.html

vue3相对于vue2 来说更小、更快、加强TypeScript支持、加强API设计一致性、提高自身可维护性、开放更多底层功能
压缩包体积将缩小到原来的将近一半，vue3将vue2的拦截监听使用的Object.defineProperty换成了ES6的新特性 Proxy(代理),proxy代理了对象,而不是代理了对		象的属性,这样可以将原本对对象属性的操作变为对整个对象的操作，颗粒度变大。javascript引擎在解析的时候希望对象的结构越稳定越好，如果对象一直在变，可优化性	 降低，proxy不需要对原始对象做太多操作。
Virtual DOM 重构
部分指令更改或者去除
Composition API的引入
hooks的使用
Teleport的引入
生命周期更改



```

## 1.4 参考 志芳

https://adminpro.iviewui.com/

https://preview.pro.ant.design/

https://el-admin.xin/
https://element-plus.gitee.io/#/zh-CN/component/infiniteScroll -element-plus 官网

https://vue3js.cn/docs/zh/ -vue3.0 中文文档

https://next.vuex.vuejs.org/ -vueX4.0 文档

https://cn.vitejs.dev/ -Vite 官方中文文档

http://www.axios-js.com/ -axios 中文文档

https://next.router.vuejs.org/zh/index.html -Vue Router

http://lesscss.cn/ -Less 中文网

https://www.sass.hk/ -Sass 中文网

https://www.stylus-lang.cn/ -Stylus 中文网

https://www.iconfont.cn/ -iconfont 图标库

https://antv.vision/zh -蚂蚁数据可视化

https://echarts.apache.org/zh/index.html -Echarts 5.0 可视化图表库

# 2. 全局说明

## 2.1 概述

介绍项目整体技术点，特性，服务行业对象等

```
**2.1.1** 项目架构特点和整体技术点
ERP 项目采用自行搭建的后台管理架构进行开发,架构上和大多数管理系统模板相似,以高效、便捷、灵活为搭建理念。
   1：灵活的路由设计、权限设计、人员角色管理
    以管理员账号身份进入角色管理，和菜单管理界面进行角色和权限的管理，用表格设计建立角色的树形结构体系和各个角色以及角色标识
    以表格设计建立菜单树形结构体系且可灵活关联上用户角色的权限。
   2：项目采用vue3框架
    vue3相对于vue2 来说更小、更快、加强TypeScript支持、加强API设计一致性、提高自身可维护性、开放更多底层功能
    diff算法的重构
    监听拦截的重构
    Virtual DOM 重构
    vue3 引入 Composition API
   3：项目采用Vite编译
   	之前项目通常采用webpack编译，Webpack Dev Server 在启动时，需要先 build 一遍，而 build 的过程是需要耗费很多时间的。
   	而 Vite 则完全不同，当我们执行 vite serve 时，内部直接启动了 Web Server，并不会先编译所有的代码文件。
	Webpack 这类工具的做法是将所有模块提前编译、打包进 bundle 里，换句话说，不管模块是否会被执行，都要被编译和打包到 bundle 里。随着项目越来越大打包后的     bundle 也越来越大，打包的速度自然也就越来越慢。
	Vite 利用现代浏览器原生支持 ESM 特性，省略了对模块的打包。对于需要编译的文件，Vite 采用的是另外一种模式：即时编译。也就是说，只有具体去请求某个文件时才     会编译这个文件。所以，这种「即时编译」的好处主要体现在：按需编译.

	Vite提供了一个子命令 optimize 这个命令的作用就是单独的去「优化依赖」

	HRM热更新方面
	Vite 只需要立即编译当前所修改的文件即可，所以响应速度非常快。
	Webpack 修改某个文件过后，会自动以这个文件为入口重写 build 一次，所有的涉及到的依赖也都会被加载一遍，所以反应速度会慢很多

**2.1.2** 服务行业对象
	该项目的架构的初衷就是为了服务大型多模块应用,因为此次立项的ERP系统涉及版块过多,本可以尽力往微前端方向靠近,使用模块化开发,后为了减少工作时间以及架构     设计时间,决定只用一个项目架构供应ERP的开发,但是在文件目录、vuex、权限和路由的设计上都力求保证模块化、清晰化。这样即可供应ERP开发且不会紊乱冗余。


```

​

## 2.2 目录

截图并说明项目详细目录结构，以及对后续业务和功能拆分拓展可能涉及到的目录说明

![](http://vshoptest.oss-cn-hangzhou.aliyuncs.com/0daf740bd89f55e9ad1fc0b9887159cd4d18922aca26b7e0d6099e95d6d0b03b-o.png)

| 文件夹/文件 名称         | 文件夹/文件 功能               | 备注 |
| ------------------------ | ------------------------------ | ---- |
| assets 文件夹            | 存放静态文件(img,js,css 等)    |      |
| mixins                   | 存放混入文件                   |      |
| router                   | 存放路由配置文件               |      |
| router/index.js          | 路由主配置文件                 |      |
| router/router.config.js  | 基础路由配置文件               |      |
| router/permission.js     | 权限校验文件                   |      |
| store                    | 存放 vuex 配置文件             |      |
| store/module             | vuex 模块存放                  |      |
| utils                    | 公用方法以及工具函数存放处     |      |
| utils/AbnormalMonitoring | 全局报错捕捉的配置文件存放     |      |
| utils/commonDirective    | 全局配置自定义指令             |      |
| utils/commonMixins       | 全局配置混入                   |      |
| utils/request.js         | 请求方法配置文件               |      |
| utils/elComponents.js    | element 组件按需引入           |      |
| utils/device.js          | 屏幕缩放比例监听和校正配置文件 |      |
| utils/vite.js            | 环境变量引入和配置文件         |      |
| views                    | 页面组件存放                   |      |
| views/Layout             | Layout 布局组件                |      |
| App.vue                  | 全局入口组件                   |      |
| main.js                  | 全局配置文件                   |      |
| .env.development         | 本地环境变量                   |      |
| .env.production          | 正式环境变量                   |      |
| vite.config.js           | vite 配置文件                  |      |

## 2.3 全局配置

vue 配置，vite 配置等

## 2.4 兼容性 朱涛

### 2.4.1 浏览器兼容性

对浏览器及版本号的兼容特性进行说明

### 2.4.2 分辨率适配

对可正常适配的最小分辨率以及最佳使用分辨率进行说明

简单介绍实现机制

```
在 utils 下新建了 device.js 文件用于监控页面大小缩,然后校正
```

## 2.5 环境变量 朱涛

列举一下环境涉及的全局变量和相关作用

**dev**

测试环境: _NODE_ENV = "development"_

构建后的基本公共路径: ITE_BASE = "/"\*

是否禁用 console: _VITE_DROP_CONSOLE = false_

是否禁用 debugger: _VITE_DROP_DEBUGGER = false_

api 地址: _VITE_API_URL = "/api"_

反向代理: _VITE_PROXY = [["/api", "http://xxx.xx.xxx"]]_

**test**

**prod**

测试环境: _NODE_ENV = "development"_

构建后的基本公共路径: _VITE_BASE = "/"_

是否禁用 console: _VITE_DROP_CONSOLE = false_

是否禁用 debugger: _VITE_DROP_DEBUGGER = false_

api 地址,完整服务端域名: _VITE_API_URL = "http://xx.xx.xx:8083"_

## 2.6 组件 朱涛 新国

对项目下回使用到的常用组件和样式选择进行说明（尽可能屏蔽不同开发人员组件使用的差异）

https://element-plus.gitee.io/#/zh-CN/component/installation

## 2.7 命令 朱涛

开发环境启动和关闭

_npm run dev_

_npm run build-dev_

部署环境（测试和生产）启动和关闭

_npm run build-prd_

# 3. 规范

## 3.1 命名规范 朱涛 王杰

代码规范

命名规范

## 3.2 注释规范 陈斌

格式化 插进配置

注释 文件注释，方法注释，代码注释

参考链接： https://blog.csdn.net/zxBlogs/article/details/106097389

```json
{
  "Print to vue temaplate": {
    "prefix": "vue",
    "body": [
      "/*",
      " *@Author: chenbin",
      " *@Date: ${CURRENT_YEAR}-${CURRENT_MONTH}-${CURRENT_DATE} ${CURRENT_HOUR}:${CURRENT_MINUTE}:${CURRENT_SECOND}",
      " *@Description: $0",
      "*/",
      "<template>",
      "  <div class=\"wrapper\">$0</div>",
      "</template>",
      "",
      "<script>",
      "export default {",
      "  name: '',",
      "  data () {",
      "    return {",
      "    }",
      "  },",
      "  methods: {},",
      "  mounted () {}",
      "}",
      "</script>",
      "<style lang=\"less\" scoped>",
      "</style>\r"
    ],
    "description": "A vue2 file template"
  }
}
```

文件注释规范：

文件注释用于告诉不熟悉这段代码的读者这个文件中包含哪些东西。 应该提供文件的大体内容, 它的作者, 依赖关系和兼容性信息。如下:
/\*\*

- @fileoverview Description of file, its uses and information
- about its dependencies.
- @author user@meizu.com (Firstname Lastname)
- Copyright 2015 Meizu Inc. All Rights Reserved.
  \*/

代码注释规范：

单行注释

- 注释单独一行的情况下，注释的//后面要跟一个空格
- 注释如果和代码同一行，代码分号结束后，要跟一个空格，注释的//后也要跟一个空格

多行注释

多行注释使用下面这种形式：

- 总是保持星号纵向对齐（结束符前留一个空格）
- 不要在开始符、结束符所在行写注释
- 尽量使用单行注释代替多行注释
- 注释函数时，推荐使用多行注释

函数注释

- 其间每一行都以 `*` 开头，且与第一行第一个 `*` 对齐

- 注释内容与 `*` 间留一个空格

- 必须包含标签注释。

/\*\*
_这是一个求和函数
_@param {Number} a 第一个数字
_@param {Number} b 第一个数字
_@return {Number} 返回两个数字之和
\*/
var sum = function(a,b){
return a + b;
}

# 4. 公共

## 4.1 公共组件 朱涛 新国

列举二次封装的组件和使用说明

##### 4.1.1 上传组件

##### 4.1.2 下载组件

##### 4.1.3 富文本组件

##### 4.1.4 日期选择器

##### 4.1.5 分页列表

##### 4.1.6 弹框（提示/警告/报错等）

## 4.2 共用工具

列举常用工具类

时间

字符串处理

小数处理

缓存封装

提示/弹框

防抖/限流

# 5. 架构设计

## 5.1 界面配置

菜单

在 views/layout 文件夹里自定义菜单样式和菜单渲染

图片

皮肤

现在 vuex 里配置了 theme 主题字段,在 App.vue 声明了一个基础的 --themeColor: #008cff;

可通过 vuex 全局更改这个样式

## 5.2 路由设计

1、安装

```
npm install vue-router@next
```

2、使用

```
// router/index.js
import { createRouter } from 'vue-router'
import routes from './routes'

import Login from "../pages/login"
import Home from "../pages/home"
import NotFound from "../pages/errorPage/404"
import Forbidden from "../pages/errorPage/403"
import Layout from "../pages/layout"

// 初始化路由
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

// 准备动态加载的路由
export const DynamicRoutes = [
    {
        path:"",
        component:Layout,
        name:'container',
        redirect:"home",
        meta:{
            requiresAuth:true,
            name:"首页"
        },
        children:[
            {
                path:"home",
                component:Home,
                name:"home",
                meta:{
                    // 匹配规则
                    name:"首页",
                    icon:"icon-name"
                }
            }
        ]
    },
    {
        path:"/403",
        component:Forbidden
    },
    {
        path:"*",
        component:NotFound
    }
]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```

## 5.3 权限设计

路由权限的业务

1.定义好全部的路由地址

2.通过用户不同像后台请求不同的用户权限数据

3.对用户权限做对比：请求数据 <==> 全部的路由 筛选出来作为路由配置

```
// permission.js
import router from "./index"
import store from "../store/index"

router.beforeEach((to,from,next) =>{
    if(!store.state.UserToken){ // 未登录
    	next({path:"/login"})
    }else{
        // 用户已经登录  路由的访问权限
        if(!store.state.permission.permissionList){
            store.dispatch("permission.FETCH_PERMISSION").then(() =>{
                next()
            })
        }else{
            // store存在权限
            next();
        }
    }
})
```

```
// store/modules/permission.js
import { fetchPermission } from "../../api/index"
import router,{ DynamicRoutes } from "../../router/index"
import dynamicRouter from "../../router/dynamic-router"
import { recursionRouter,setDefaultRoute } from "../../utils/recursion-router"

export default {
    namespaced:true,
    state:{
        permissionList:null,
        sidebarMenu:[],// 导航菜单
        currentMenu:'' // 高亮
    },
    getters:{},
    mutations:{
        SET_PERMISSION(state,routes){
            state.permissionList = routes;
        },
        CLEAR_PERMSSION(state){
            state.permissionList = null;
        },
        SET_MENU(state,menu){
            state.sidebarMenu = menu;
        },
        CLEAR_MENU(state){
            state.sidebarMenu = []
        }
    },
    // 异步访问
    actions:{
        async FETCH_PERMISSION({ commit,state }){
        	// 获取后台返回的路由权限数据
            let permissionList = await fetchPermission();
            // 筛选
            let routes = recursionRouter(permissionList,dynamicRouter);
            let MainContainer = DynamicRoutes.find(v => v.path === "");
            let children = MainContainer.children;
            children.push(...routes)

            // 生成菜单
            commit("SET_MENU",children);

            // 设置默认路由
            setDefaultRoute([MainContainer]);
            // 初始化路由
            let initialRoutes = router.options.routes;
            router.addRoutes(DynamicRoutes);
            commit("SET_PERMISSION",[ ...initialRoutes , ...DynamicRoutes])
        }
    }
}
```

```
// @utils/recursion-router.js
/**
 * 方法一：比对路由权限
 * 方法二：指定返回的默认路由
 */

/**
 *
 * @param {Array} userRouter 后台返回的路由权限json
 * @param {Array} allRouter 前端配置好的路由权限数据
 * @return {Array} realRoutes 过滤之后的符合条件的路由
 */

export function recursionRouter(userRouter = [],allRouter = []){
    var realRoutes = [];
    allRouter.forEach((v,i) =>{
        userRouter.forEach((item,index) =>{
            if(item.name === v.meta.name){
                if(item.children && item.children.length > 0){
                    v.children = recursionRouter(item.children,v.children);
                }
                realRoutes.push(v)
            }
        })
    })
    return realRoutes;
}


export function setDefaultRoute(routes){
    routes.forEach((v,i) =>{
        if(v.children && v.children.length > 0){
            v.redirect = { name : v.children[0].name}
            setDefaultRoute(v.children);
        }
    })
}
```

## 5.4 Vuex 设计

列举 vuex 中可能存放的数据

##### 5.4.1 两个 token 令牌

##### 5.4.2 权限

##### 5.4.3 商品信息

##### 5.4.4 订单信息

##### 5.4.5 店铺基本信息（含用户个人信息）

##### 5.4.6 其他多个组件公用数据

## 5.5 文件上传 王杰

oss

## 5.6 富文本 朱涛 韦健

列举富文本框集成和完善的功能

## 5.7 异常处理 朱涛

5.7.1 全局异常捕获

​ 全局 app.config 绑定上了 error 和 warn 的报错监听方法,可统一处理,也可以分析报错原因和出错位置

​ 全局 app.config 绑定了自定义的 $throwError 方法,用于手动抛出报错信息

5.7.2 http 请求异常拦截

​ 在 axios 的 interceptors.response 和 interceptors.request 进行拦截,并可手动抛出报错信息

5.7.3 try..catch 和 .catch 使用

​ 在业务代码中可以使用 try..catch 进行代码块的测试运行,报错则抛出错误信息

​ 或者 promise 的 reject 抛出

# 6. FAQ
