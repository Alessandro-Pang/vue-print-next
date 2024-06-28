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
		let printElement: HTMLElement | string = '';
		let options: PrintAreaOption = {} as PrintAreaOption;

		addEvent(el, 'click', () => {
			if (typeof binding.value === 'string') {
				printElement = binding.value;
			} else if (typeof binding.value === 'object' && binding.value.el) {
				printElement = binding.value.el;
				options = binding.value;
			} else {
				window.print();
				return;
			}
			new VuePrintNext({ ...options, el: printElement, vue: binding.instance });
		});
	},
	// 兼容 Vue2 指令挂载
	bind(el: HTMLElement, binding: DirectiveBinding<PrintAreaOption | string>, vnode: any) {
		binding.instance = vnode.context;
		vPrint.mounted(el, binding);
	},
};

export default vPrint;
