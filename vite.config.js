import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';

export default defineConfig({
  plugins: [
		vue(),
		vueJsx({
			transformOn: true,
		}),
	],
	css: {
		preprocessorOptions: {
			less: {
				modifyVars: {}, // 全局主题色
				javascriptEnabled: true,
			},
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	server: {
		host: true,
		hmr: true,
		proxy: {
			"/gateway": {
				target: "http://192.168.0.188:8080",
				changeOrigin: true, 
				rewrite: (path) => {
					return path.replace(/\/gateway/, "");
				},
			},
		},
	},
  build: {
		outDir: 'dist',
		lib: {
			entry: './components/index.js', //指定组件编译入口文件
			name: 'CyberWebUi',
			formats: ['cjs'],
			fileName: 'cyber.min.js',
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
			},
		},
		copyPublicDir: false,
		emptyOutDir: true,
	},
});
