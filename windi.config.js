import { defineConfig } from 'windicss/helpers'

export default defineConfig({
	darkMode: 'class',
	attributify: true,
	preflight: false, // 禁止预检样式，防止与组件库造成冲突
	// 自定义快捷class类
	shortcuts: {},
	theme: {
		extend: {
			screens: {
				sm: '1200px',
				md: '1440px',
				lg: '1680px',
			},
			colors: {
				// 定义主要的颜色class，文字：text-primary   背景：bg-primary
				primary: {
					DEFAULT: '#3673f5'
				}
			}
		}
	},
	safelist: [],
	extract: {
		include: ['src/**/*.{vue,tsx}', 'examples/views/*.{vue,tsx}']
	}
})
