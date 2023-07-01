import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import esBuild from './cyber-tools/es-build.js';

export default defineConfig({
  plugins: [
		vue(),
		vueJsx({
			transformOn: true,
		}),
		esBuild(),
	],
	css: {
		preprocessorOptions: {
			less: {
				modifyVars: {}, // 全局主题色
				javascriptEnabled: true,
			},
		},
	},
	server: {
		host: true,
		hmr: true,
	},
  build: {
		outDir: 'dist',
		lib: {
			entry: './components/index.js', //指定组件编译入口文件
			name: 'CyberWebUi',
			// formats: ['umd'],
			fileName: (format) => `index.${format}.js`
		},
		//库编译模式配置
		rollupOptions: {
			// 确保外部化处理那些你不想打包进库的依赖
			external: ['vue'],
			output: {
				// 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
				globals: {
					vue: 'Vue',
				},
				exports: "named",
			},
		},
		copyPublicDir: false,
		emptyOutDir: true,
	},
});
