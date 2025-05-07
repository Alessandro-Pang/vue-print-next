import { PrintAreaOption, PrintAreaWindow, Standards } from '../../../types';

const FUNC_NAME = '[VuePrintNext]'
let printCount = 0;

// 预设常见纸张尺寸（单位：mm）
const PAPER_SIZES = {
	A0: { width: '841mm', height: '1189mm' },
	A1: { width: '594mm', height: '841mm' },
	A2: { width: '420mm', height: '594mm' },
	A3: { width: '297mm', height: '420mm' },
	A4: { width: '210mm', height: '297mm' },
	A5: { width: '148mm', height: '210mm' },
	A6: { width: '105mm', height: '148mm' },
	A7: { width: '74mm', height: '105mm' },
	A8: { width: '52mm', height: '74mm' },
	Letter: { width: '215.9mm', height: '279.4mm' },
	Legal: { width: '215.9mm', height: '355.6mm' },
	Tabloid: { width: '279.4mm', height: '431.8mm' }
};
export default class VuePrintNext {
	// html 文档标准
	private readonly standards: Standards = {
		strict: 'strict',
		loose: 'loose',
		html5: 'html5'
	};

	// 打印窗口的 iframe id
	private iframeId: string = '';
	// 预览窗口的 body
	private previewBody: HTMLElement | null = null;
	// 预览窗口的 关闭按钮
	private close: HTMLElement | null = null;
	// 用户设置
	private readonly settings: PrintAreaOption;

	constructor(option: PrintAreaOption) {
		// Destructure and set default values for settings
		const { 
			vue, 
			standard = 'html5', 
			zIndex = 20002, 
			previewTitle = '打印预览', 
			previewPrintBtnLabel = '打印', 
			preview = false, 
			popTitle = document.title,
			paperSize = 'A4',
			orientation = 'portrait',
			customSize,
			...otherOptions 
		} = option;
		this.settings = {
			standard,
			zIndex,
			previewTitle,
			previewPrintBtnLabel,
			preview,
			popTitle,
			paperSize,
			orientation,
			customSize,
			...otherOptions,
			previewBeforeOpenCallback: () => option.previewBeforeOpenCallback?.(vue),
			previewOpenCallback: () => option.previewOpenCallback?.(vue),
			openCallback: () => option.openCallback?.(vue),
			closeCallback: () => option.closeCallback?.(vue),
			beforeOpenCallback: () => option.beforeOpenCallback?.(vue),
		};
		this.init();
	}

	private init() {
		this.iframeId = `printArea_${++printCount}`;
		const { el, url, asyncUrl } = this.settings;

		if (el) {
			this.handlePrintWindow('');
		} else if (url) {
			this.handlePrintWindow(url);
		} else if (asyncUrl) {
			asyncUrl((url) => this.handlePrintWindow(url), this.settings.vue);
		} else {
			throw new Error(`${FUNC_NAME}: Either "el", "url", or "asyncUrl" parameter must be provided in the settings.`);
		}
	}

	private handlePrintWindow(url: string) {
		const printAreaWindow = this.getPrintWindow(url);
		!url && this.write(printAreaWindow.doc);
		this.settings.preview ? this.previewIframeLoad() : this.print(printAreaWindow);
	}

	private addEvent(element: HTMLElement | null, type: string, callback: EventListenerOrEventListenerObject): void {
		if (!element) return;
		element.addEventListener(type, callback, false);
	}

	private previewIframeLoad() {
		const box = document.getElementById('vue-print-next-previewBox');
		if (!box) return;

		const iframe = box.querySelector('iframe');
		this.settings.previewBeforeOpenCallback?.();
		this.addEvent(iframe, 'load', () => {
			this.previewBoxShow();
			this.settings.previewOpenCallback?.();
		});
		this.addEvent(box.querySelector('.previewBodyUtilPrintBtn'), 'click', () => {
			this.settings.beforeOpenCallback?.();
			this.settings.openCallback?.();
			iframe?.contentWindow?.print();
			this.settings.closeCallback?.();
		});
	}

	private print(iframe: PrintAreaWindow) {
		const iframeDom = document.getElementById(this.iframeId) || iframe.f;
		const iframeWin = (iframeDom as HTMLIFrameElement)?.contentWindow;
		if (!iframeWin) return;
		const _loaded = () => {
			const timer = setTimeout(() => {
				iframeWin.focus();
				this.settings.openCallback?.();
				iframeWin.print();
				iframeDom.remove(); // 删除iframe元素
				this.settings.closeCallback?.();
				clearTimeout(timer)
			}, 0)
		};

		this.settings.beforeOpenCallback?.();
		this.addEvent(iframeDom, 'load', _loaded);
	}

	/**
	 * 获取打印需要隐藏的 css
	 * @private
	 */
	private getNoPrintMediaStyle(): string {
		const { noPrintSelector } = this.settings;
		if (!noPrintSelector) return '';
		const selectors = Array.isArray(noPrintSelector) ? noPrintSelector : [noPrintSelector];
		const validSelectors = selectors.filter((selector) => selector.trim());
		if (!validSelectors.length) {
			console.error(new TypeError(`${FUNC_NAME}: The "noPrintSelector" must be a non-empty string or an array of strings.`));
			return '';
		}
		return `${validSelectors.join(',')} { display: none; }`;
	}

	private write(PADocument: Document) {
		PADocument.open();
		PADocument.write(
			`${this.docType()}<html lang='zh'>${this.getHead()}${this.getBody()}</html>`
		);
		PADocument.close();
	}

	private docType(): string {
		if (this.settings.standard === this.standards.html5) {
			return '<!DOCTYPE html>';
		}
		const transitional = this.settings.standard === this.standards.loose ? ' Transitional' : '';
		const dtd = this.settings.standard === this.standards.loose ? 'loose' : 'strict';
		return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
	}

	/**
	 * 获取媒体打印独有样式
	 * @private
	 */
	private getPrintMediaStyle() {
		const { paperSize = 'A4', orientation = 'portrait', customSize } = this.settings;
		
		// 修复打印时背景色失效
		const fixBackgroundColorFailure = `body {-webkit-print-color-adjust: exact; -moz-print-color-adjust: exact; -ms-print-color-adjust: exact; print-color-adjust: exact;}`;
		
		// 获取纸张尺寸
		let paperSizeStyle = '';
		if (paperSize === 'custom' && customSize) {
			const { width, height, unit = 'mm' } = customSize;
			const w = width.endsWith(unit) ? width : `${width}${unit}`;
			const h = height.endsWith(unit) ? height : `${height}${unit}`;
			paperSizeStyle = orientation === 'portrait' 
				? `@page { size: ${w} ${h}; }`
				: `@page { size: ${h} ${w}; }`;
		} else if (paperSize in PAPER_SIZES) {
			const size = PAPER_SIZES[paperSize as keyof typeof PAPER_SIZES];
			paperSizeStyle = orientation === 'portrait' 
				? `@page { size: ${size.width} ${size.height}; }`
				: `@page { size: ${size.height} ${size.width}; }`;
		} else {
			// 默认使用 A4
			const defaultSize = PAPER_SIZES.A4;
			paperSizeStyle = orientation === 'portrait' 
				? `@page { size: ${defaultSize.width} ${defaultSize.height}; }`
				: `@page { size: ${defaultSize.height} ${defaultSize.width}; }`;
		}
		
		return `${fixBackgroundColorFailure}${paperSizeStyle}`;
	}

	private getHead(): string {
		const { extraHead = '', extraCss = '', popTitle } = this.settings;
		const links = Array.from(document.querySelectorAll('link[href$=".css"]'))
			.map((item) => `<link type="text/css" rel="stylesheet" href='${(item as HTMLLinkElement).href}'>`)
			.join('');
		const styles = Array.from(document.querySelectorAll('style'))
			.map((style) => style.outerHTML)
			.join('');
		const extraCssLinks = extraCss.split(',')
			.filter((m) => m.trim())
			.map((m) => `<link type="text/css" rel="stylesheet" href='${m.trim()}'>`)
			.join('');
		const printMediaStyle = this.getPrintMediaStyle();
		const noPrintMediaStyle = this.getNoPrintMediaStyle();

		return `<head>
					<title>${popTitle}</title>
					${extraHead}${links}${styles}
					<style type="text/css">${noPrintMediaStyle}${printMediaStyle}</style>
					${extraCssLinks}
				</head>`;
	}

	/**
	 * 获取打印区的 DOM
	 */
	getPrintAreaDom(): HTMLElement[] {
		const el = this.settings.el;
		const isSelector = typeof el === 'string'
		if (el instanceof HTMLElement) return [el]
		if (!isSelector) {
			throw new TypeError(`${FUNC_NAME}: The "el" property should be either a string (CSS selector) or an HTMLElement, but received type "${typeof el}".`);
		}

		let contentDom: HTMLElement[] = Array.from(document.querySelectorAll(el));
		if (!contentDom?.length) {
			throw new Error(`${FUNC_NAME}: No elements found matching the selector: "${el}".`);
		}

		return contentDom;
	}

	private getBody(): string {
		const printAreaDom = this.getPrintAreaDom();
		// 复制一份 dom
		const copyPrintAreaDom: HTMLElement = document.createElement('div')
		printAreaDom.forEach((item) => {
			const copy = item.cloneNode(true) as HTMLElement;
			this.removeScriptHandler(copy)
			this.canvasToImgHandler(item, copy)
			this.formDataHandler(item, copy)
			copyPrintAreaDom.appendChild(copy)
		})
		return `<body>${copyPrintAreaDom.innerHTML}</body>`;
	}

	/**
	 * 移除 script 标签
	 * @param clonedElement
	 */
	removeScriptHandler(clonedElement: HTMLElement) {
		const clonedScripts = clonedElement.querySelectorAll('script')
		clonedScripts.forEach((script) => {
			script.remove()
		})
	}

	/**
	 * 复制 Canvas 内容到新的 Canvas 元素
	 * @param originalElement
	 * @param clonedElement
	 * @private
	 */
	canvasToImgHandler(originalElement: HTMLElement, clonedElement: HTMLElement) {
		const originalCanvases = originalElement.querySelectorAll('canvas');
		const clonedCanvases = clonedElement.querySelectorAll('canvas');

		clonedCanvases.forEach((clonedCanvas, index) => {
			const originalCanvas = originalCanvases[index];
			const _parent = clonedCanvas.parentNode;
			const _canvasUrl = originalCanvas.toDataURL('image/png');
			const _img = new Image();
			_img.className = 'canvasImg';
			_img.style.display = 'block';
			_img.src = _canvasUrl;
			_parent?.appendChild(_img);
			clonedCanvas.remove();
		});
	}

	/**
	 * 根据type去处理form表单
	 * @param originalElement
	 * @param clonedElement
	 * @private
	 */

	private formDataHandler(originalElement: HTMLElement, clonedElement: HTMLElement) {
		const copiedInputs = clonedElement.querySelectorAll<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input,select,textarea');
		let selectCount = -1;

		copiedInputs.forEach((item) => {
			const formValue = item.value;
			let typeInput = item.getAttribute('type') ?? item.tagName.toLowerCase();
			switch (typeInput) {
				case 'select':
					selectCount++;
					const select = originalElement.querySelectorAll<HTMLSelectElement>('select')[selectCount];
					if (select) {
						const opSelectedIndex = select.selectedIndex;
						(item as HTMLSelectElement).options[opSelectedIndex].setAttribute('selected', 'selected');
					}
					break;
				case 'textarea':
					(item as HTMLTextAreaElement).innerHTML = formValue;
					item.setAttribute('html', formValue);
					break;
				case 'radio':
				case 'checkbox':
					if ((item as HTMLInputElement).checked) {
						item.setAttribute('checked', 'checked');
					}
					break;
				default:
					(item as HTMLInputElement).value = formValue;
					item.setAttribute('value', formValue);
					break;
			}
		});
	}

	// 生成并返回打印窗口的 iframe 和文档对
	private getPrintWindow(url: string): PrintAreaWindow {
		const iframe = this.createIframe(url);
		// @ts-ignore
		const doc = iframe.contentDocument || iframe.contentWindow?.document || iframe.document;
		if (!doc) {
			throw new Error(`${FUNC_NAME}: Unable to find the document object within the created iframe. Please ensure the iframe is correctly created and loaded.`);
		}
		return { f: iframe, win: iframe.contentWindow || iframe, doc };
	}

	// 显示预览窗口
	private previewBoxShow() {
		const box = document.getElementById('vue-print-next-previewBox');
		if (box) {
			document.querySelector('html')?.setAttribute('style', 'overflow: hidden');
			box.style.display = 'block';
		}
	}

	// 隐藏预览窗口
	private previewBoxHide() {
		const box = document.getElementById('vue-print-next-previewBox');
		if (box) {
			document.querySelector('html')?.setAttribute('style', 'overflow: visible;');
			box.querySelector('iframe')?.remove();
			box.style.display = 'none';
		}
	}

	// 创建或获取打印预览的框架
	private previewBox(): { close: HTMLElement | null; previewBody: HTMLElement | null } {
		let box = document.getElementById('vue-print-next-previewBox');
		if (box) {
			box.querySelector('iframe')?.remove();
			return { close: box.querySelector('.previewClose'), previewBody: box.querySelector('.previewBody') };
		}

		// 创建预览框架
		box = document.createElement('div');
		box.setAttribute('id', 'vue-print-next-previewBox');
		box.setAttribute(
			'style',
			'position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background: white; display: none; z-index: ' + this.settings.zIndex
		);

		// 预览框架的头部
		const previewHeader = document.createElement('div');
		previewHeader.setAttribute('class', 'previewHeader');
		previewHeader.setAttribute('style', 'padding: 5px 20px;');
		previewHeader.innerHTML = this.settings.previewTitle || '';

		// 关闭按钮
		this.close = this.createCloseButton();
		previewHeader.appendChild(this.close);
		box.appendChild(previewHeader);

		// 预览框架的主体内容
		this.previewBody = this.createPreviewBody();
		box.appendChild(this.previewBody);

		document.body.appendChild(box);

		return { close: this.close, previewBody: this.previewBody };
	}

	// 创建iframe元素
	private createIframe(url: string): HTMLIFrameElement {
		const iframe = document.createElement('iframe');
		iframe.id = this.iframeId;
		iframe.src = url || new Date().getTime().toString();
		iframe.style.display = 'none';
		if (!this.settings.preview) {
			document.body.appendChild(iframe);
		} else {
			iframe.style.cssText = 'border: 0px; flex: 1;';
			const { close, previewBody } = this.previewBox();
			previewBody?.appendChild(iframe);
			this.addEvent(close, 'click', this.previewBoxHide.bind(this));
		}
		return iframe;
	}

	// 创建关闭按钮
	private createCloseButton(): HTMLElement {
		const close = document.createElement('div');
		close.setAttribute('class', 'previewClose');
		close.setAttribute('style', 'position: absolute; top: 5px; right: 20px; width: 25px; height: 20px; cursor: pointer;');

		const closeBefore = document.createElement('div');
		const closeAfter = document.createElement('div');
		const closeStyles = 'position: absolute; width: 3px; height: 100%; background: #040404; top: 0px; left: 50%;';

		closeBefore.setAttribute('class', 'closeBefore');
		closeBefore.setAttribute('style', `${closeStyles} transform: rotate(45deg);`);

		closeAfter.setAttribute('class', 'closeAfter');
		closeAfter.setAttribute('style', `${closeStyles} transform: rotate(-45deg);`);

		close.appendChild(closeBefore);
		close.appendChild(closeAfter);

		return close;
	}

	// 创建预览主体
	private createPreviewBody(): HTMLElement {
		const previewBody = document.createElement('div');
		previewBody.className = 'previewBody';
		previewBody.style.cssText = 'display: flex; flex-direction: column; height: 100%;';

		const previewBodyUtil = document.createElement('div');
		previewBodyUtil.className = 'previewBodyUtil';
		previewBodyUtil.style.cssText = 'height: 32px; background: #474747; position: relative;';

		const previewBodyUtilPrintBtn = document.createElement('div');
		previewBodyUtilPrintBtn.className = 'previewBodyUtilPrintBtn';
		previewBodyUtilPrintBtn.style.cssText =
			'position: absolute; padding: 2px 10px; margin-top: 3px; left: 24px; font-size: 14px; color: white; cursor: pointer; background: rgba(0,0,0,.12); border: 1px solid rgba(0,0,0,.35); box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05), inset 0 0 1px hsla(0,0%,100%,.15);';
		previewBodyUtilPrintBtn.innerHTML = this.settings.previewPrintBtnLabel || '';

		previewBodyUtil.appendChild(previewBodyUtilPrintBtn);
		previewBody.appendChild(previewBodyUtil);

		return previewBody;
	}
}
