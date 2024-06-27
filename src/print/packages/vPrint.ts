/*
 * @Author: lee
 * @Date: 2021-05-10 11:45:50
 * @LastEditors: lee
 * @LastEditTime: 2021-05-20 15:41:51
 * @Description: file content
 */
import VuePrintNext from './VuePrintNext';
import type { DirectiveBinding } from 'vue';
import { PrintAreaOption } from '../../../types';

/**
 * @file 打印
 * 指令 `v-print`，默认打印整个窗口。
 * 传入参数 `v-print="'#id'"` ，参数为需要打印的局部容器标识符。
 */
const addEvent = (element: HTMLElement, type: string, callback: () => void) => {
	if (element.addEventListener) {
		element.addEventListener(type, callback, false);
	} else if ((element as any).attachEvent) {
		(element as any).attachEvent('on' + type, callback);
	} else {
		(element as any)['on' + type] = callback;
	}
};

const vPrint = {
	directiveName: 'print',
	// vue3 指定挂载
	mounted(el: HTMLElement, binding: DirectiveBinding<PrintAreaOption | string>) {
		let id = binding.value;
		let options: PrintAreaOption = {} as PrintAreaOption;

		addEvent(el, 'click', () => {
			if (typeof binding.value === 'string') {
				// 全局打印
				id = binding.value;
			} else if (typeof binding.value === 'object' && binding.value.id) {
				// 局部打印
				id = binding.value.id;
				options = binding.value;
				const ids = id.replace(/#/g, '');
				const contentDom = document.getElementById(ids);

				if (!contentDom) {
					console.error("Can't find element with id", id);
					return;
				}
			} else {
				window.print();
				return;
			}
			new VuePrintNext({ ...options, id, vue: binding.instance });
		});
	},
	// 兼容 Vue2 指定挂载
	bind(el: HTMLElement, binding: DirectiveBinding<PrintAreaOption | string>, vnode: any) {
		binding.instance = vnode.context;
		vPrint.mounted(el, binding);
	},
};

export default vPrint;
