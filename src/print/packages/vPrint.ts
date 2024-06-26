/*
 * @Author: lee
 * @Date: 2021-05-10 11:45:50
 * @LastEditors: lee
 * @LastEditTime: 2021-05-20 15:41:51
 * @Description: file content
 */
import VuePrintNext from './VuePrintNext.ts';
import type { DirectiveBinding} from "vue";
import {PrintAreaOption} from "../../../types";

/**
 * @file 打印
 * 指令`v-print`,默认打印整个窗口
 * 传入参数`v-print="'#id'"` , 参数为需要打印局部的盒子标识.
 */
const addEvent = (element: HTMLElement, type: string, callback: () => void) => {
	if (element.addEventListener) {
		element.addEventListener(type, callback, false);
	} else if ((element as any).attacattachEventhEvent) {
		(element as any).attachEvent('on' + type, callback);
	} else {
		(element as any)['on' + type] = callback;
	}
}

export default {
	directiveName: 'print',
	mounted(el: HTMLElement, binding: DirectiveBinding<PrintAreaOption | string>) {
		let id = '';
		let options: PrintAreaOption = {} as PrintAreaOption
		addEvent(el, 'click', () => {
			if (typeof binding.value === 'string') {
				// 全局打印
				id = binding.value;
			} else if (typeof binding.value === 'object' && !!binding.value.id) {
				// 局部打印
				id = binding.value.id;
				options = binding.value;
				let ids = id.replace(new RegExp("#", "g"), '');
				let contentDom = document.getElementById(ids);
				if (!contentDom) console.log("id in Error");
			} else {
				window.print();
				return
			}
			new VuePrintNext({...options, id, vue: binding.instance});
		})
	}
};
