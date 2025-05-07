import type { App, DirectiveBinding } from 'vue';

// 纸张常见尺寸类型
export type PaperSize = 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7' | 'A8' | 'Letter' | 'Legal' | 'Tabloid' | 'custom';

// 纸张方向类型
export type Orientation = 'portrait' | 'landscape';

// 自定义尺寸接口
export interface CustomSize {
	width: string;
	height: string;
	unit?: 'mm' | 'cm' | 'in' | 'px';
}

export interface PrintAreaOption {
	// 局部打印的元素，支持 css 选择器或 dom 节点
	el?: string | HTMLElement,
	// 文档类型，默认是html5，可选 html5，loose，strict
	standard?: 'strict' | 'loose' | 'html5';
	// 忽略打印元素的的选择器
	noPrintSelector?: string[] | string;
	// 打印指定的网址，这里不能跟id共存 如果共存id的优先级会比较高
	url?: string;
	// 异步 URL 回调函数
	asyncUrl?: (callback: (url: string) => void, vueInstance: any) => void;
	// 是否启动预览模式
	preview?: boolean;
	// 附加在head标签上的额外标签,使用逗号分隔
	extraHead?: string;
	// 额外的css连接，多个逗号分开
	extraCss?: string;
	// 打印时页眉的title
	popTitle?: string;
	// 打印预览的标题
	previewTitle?: string;
	// 打印预览的标题
	previewPrintBtnLabel?: string;
	// 预览窗口的 z-index
	zIndex?: number;
	// 纸张尺寸，默认为 A4
	paperSize?: PaperSize;
	// 纸张方向，默认为纵向
	orientation?: Orientation;
	// 自定义纸张尺寸，仅当 paperSize 为 'custom' 时生效
	customSize?: CustomSize;
	// 预览窗口打开之前的 callback
	previewBeforeOpenCallback?: (vue?: any) => void;
	// 预览窗口打开之后的 callback
	previewOpenCallback?: (vue?: any) => void;
	// 调用打印工具的成功回调函数
	beforeOpenCallback?: (vue?: any) => void;
	// 调用打印之后的回调事件
	openCallback?: (vue?: any) => void;
	// 关闭打印工具成功的回调函数
	closeCallback?: (vue?: any) => void;
	// vue 实例，使用指令时自动获取，当使用方法调用时需手动传入
	vue?: any;
}

export interface PrintAreaWindow {
	f: HTMLIFrameElement;
	win: Window | HTMLIFrameElement;
	doc: Document;
}

export type Standards = {
	strict: 'strict';
	loose: 'loose';
	html5: 'html5';
};

export class VuePrintNext {
	private readonly standards: Standards;
	private iframeId: string;
	private previewBody: HTMLElement | null;
	private close: HTMLElement | null;
	private counter: number;
	private settings: PrintAreaOption;
	constructor(option: PrintAreaOption);

	private init(): void;
	private addEvent(element: HTMLElement | null, type: string, callback: EventListenerOrEventListenerObject): void;
	private previewIframeLoad(): void;
	private removeCanvasImg(): void;
	private print(iframe: PrintAreaWindow): void;
	private write(PADocument: Document): void;
	private docType(): string;
	private getHead(): string;
	private getBody(): string;
	private beforeHandler(printContentDom: HTMLElement): HTMLElement;
	private getFormData(ele: HTMLElement): HTMLElement;
	private getPrintWindow(url: string): PrintAreaWindow;
	private previewBoxShow(): void;
	private previewBoxHide(): void;
	private previewBox(): { close: HTMLElement | null; previewBody: HTMLElement | null };
	private iframeBox(frameId: string, url: string): HTMLIFrameElement;
}

export const vPrint: {
	directiveName: string;
	mounted(el: HTMLElement, binding: DirectiveBinding<PrintAreaOption | string>): void;
	bind(el: HTMLElement, binding: DirectiveBinding<PrintAreaOption | string>, vnode: any): void;
}

export const printPlugin: {
	install(vue: App): void;
}
