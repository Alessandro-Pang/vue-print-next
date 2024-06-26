import type {App, DirectiveBinding} from "vue";

export declare interface PrintAreaOption {
	// 局部打印必传入id
	id: string,
	// 文档类型，默认是html5，可选 html5，loose，strict
	standard?: 'strict' | 'loose' | 'html5';
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
	// title的标题
	popTitle?: string;
	// 打印预览的标题
	previewTitle?: string;
	// 打印预览的标题
	previewPrintBtnLabel?: string;
	// 预览窗口的 z-index
	zIndex?: number;
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

export declare interface PrintAreaWindow {
	f: HTMLIFrameElement;
	win: Window | HTMLIFrameElement;
	doc: Document;
}

export declare type Standards = {
	strict: 'strict';
	loose: 'loose';
	html5: 'html5';
};

export declare class VuePrintNext {
	private readonly standards: Standards;
	private iframeId: string;
	private previewBody: HTMLElement | null;
	private close: HTMLElement | null;
	private previewBodyUtilPrintBtn: HTMLElement | null;
	private counter: number;
	private printContentDom: HTMLElement | null;
	private settings: PrintAreaOption;
	constructor(option: PrintAreaOption);
	init(): void;
	addEvent(element: HTMLElement | null, type: string, callback: EventListenerOrEventListenerObject): void;
	previewIframeLoad(): void;
	removeCanvasImg(): void;
	print(iframe: PrintAreaWindow): void;
	write(PADocument: Document): void;
	docType(): string;
	getHead(): string;
	getBody(): string;
	beforeHandler(printContentDom: HTMLElement): HTMLElement;
	getFormData(ele: HTMLElement): HTMLElement;
	getPrintWindow(url: string): PrintAreaWindow;
	previewBoxShow(): void;
	previewBoxHide(): void;
	previewBox(): { close: HTMLElement | null; previewBody: HTMLElement | null };
	iframeBox(frameId: string, url: string): HTMLIFrameElement;
	Iframe(url: string): HTMLIFrameElement;
}

export declare interface vPrint {
	directiveName: string;
	mounted(el: HTMLElement, binding: DirectiveBinding<PrintAreaOption | string>): void;
}

export declare interface printPlugin {
	install(vue: App): void;
}
