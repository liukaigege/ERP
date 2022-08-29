/*
 * @Descripttion: Vango ERP
 * @version: 1.0
 * @Author: 朱涛（梅溪）
 * @Date: 2021-06-02 11:46:33
* @LastEditors: 韦剑
* @LastEditTime: 2021-08-20 15:59:56
 */
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'
import { loadEnv } from './src/assets/js/vite'
import styleImport from 'vite-plugin-style-import'
import fmtSimplePath from './vite-plugin-simple-path'
//引入
import viteCompression from 'vite-plugin-compression'


/**
 * @type {import('vite').UserConfig}
 */
const viteEnv = loadEnv()
const {
	VITE_BASE,
	VITE_DROP_CONSOLE,
	VITE_DROP_DEBUGGER,
	VITE_OUTPUT_DIR,
	VITE_PORT,
	VITE_PROXY,
	NODE_ENV
} = viteEnv
let timestamp = new Date().getTime()
export default defineConfig({
	server: {
		port: VITE_PORT,
		cors: true, //默认启用并允许任何源，
		force: true, //强制预构建依赖
		// proxy: createProxy(VITE_PROXY)
		proxy: {
			'/baidu_tranlate': {
				target: 'https://aip.baidubce.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/baidu_tranlate/, '')
			}
		}
	},
	resolve: {
		extensions: ['.vue', '.js', '.css'],
		alias: {
			'@': path.resolve(__dirname, './src')
		},
	},
	build: {
		outDir: VITE_OUTPUT_DIR,
		target: "es2020",

		assetsDir: "assets", //指定静态资源存放路径
		cssCodeSplit: true, //css代码拆分,禁用则所有样式保存在一个css里面
		assetsInlineLimit: 4096, //小于4kb的引用或者导入资源会被内联为base64编码，减少http请求
		brotliSize: false, //禁用 brotli 压缩大小报告,压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。
		terserOptions: {
			// 生产环境移除console
			compress: {
				drop_console: true ,
				drop_debugger: true,
			}
		},

		rollupOptions: {
			output: { //静态资源分类打包
				chunkFileNames: `assets/js/[name]-[hash]-${timestamp}.js`,
				entryFileNames: `assets/js/[name]-[hash]-${timestamp}.js`,
				assetFileNames: `assets/[ext]/[name]-[hash]-${timestamp}.[ext]`,
				// manualChunks(id) { //静态资源分拆打包
				// 	if (id.includes('node_modules')) {
				// 		return id.toString().split('node_modules/')[1].split('/')[0].toString();
				// 	}
				// }
			}
		}
	},
	//在plugins配置数组里添加gzip插件

	plugins: [
		fmtSimplePath(),
		vue(),
		styleImport({
			libs: [
				{
					libraryName: 'vxe-table',
					esModule: true,
					resolveComponent: (name) => `vxe-table/es/${name}`,
					//  打包报错  暂时注释
					// resolveStyle: (name) => `vxe-table/es/${name}/style.css`
				}
			]
		}),
		// viteCompression({
		// 	verbose: true,
		// 	disable: false,
		// 	threshold: 10240,
		// 	algorithm: 'gzip',
		// 	ext: '.gz',
		// })
	]
})
