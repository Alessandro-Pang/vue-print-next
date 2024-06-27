/*
 * @Author: lee
 * @Date: 2021-05-10 16:40:30
 * @LastEditors: lee
 * @LastEditTime: 2021-05-11 14:18:45
 * @Description: file content
 */
import vPrint from './packages/vPrint.ts';
import VuePrintNext from './packages/VuePrintNext.ts'
import type {App} from "vue";

/**
 * 用于 vue.use 安装指令插件
 */
const printPlugin = {
	install(Vue: App) {
		Vue.directive(vPrint.directiveName, vPrint);
	}
}


export {
	vPrint,
	printPlugin,
	VuePrintNext,
}
