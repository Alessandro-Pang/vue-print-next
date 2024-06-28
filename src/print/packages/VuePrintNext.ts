import {PrintAreaOption, PrintAreaWindow, Standards} from '../../../types';

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
	// 打印按钮
	private previewBodyUtilPrintBtn: HTMLElement | null = null;
	// 调用次数，用于生成唯一 Id
	private counter = 0;
	// 需要打印的 DOM 内容
	private printContentDom: HTMLElement | null = null;
	// 用户设置
	private readonly settings: PrintAreaOption = {
		standard: 'html5',
		zIndex: 20002,
		previewTitle: '打印预览',
		previewPrintBtnLabel: '打印',
		preview: false,
	} as PrintAreaOption;

	constructor(option: PrintAreaOption) {
		const vue = option.vue;
		this.settings = {
			...this.settings,
			...option,
			previewBeforeOpenCallback() {
				option.previewBeforeOpenCallback?.(vue);
			},
			previewOpenCallback() {
				option.previewOpenCallback?.(vue);
			},
			openCallback() {
				option.openCallback?.(vue);
			},
			closeCallback() {
				option.closeCallback?.(vue);
			},
			beforeOpenCallback() {
				option.beforeOpenCallback?.(vue);
			},
		};
		this.init();
	}

	private init() {
		this.counter++;
		this.iframeId = `printArea_${this.counter}`;

		if (!this.settings.asyncUrl) {
			const printAreaWindow = this.getPrintWindow(this.settings.url || '');
			if (!this.settings.url) {
				this.write(printAreaWindow.doc); // 写入内容
			}
			this.settings.preview ? this.previewIframeLoad() : this.print(printAreaWindow);
		} else {
			this.settings.asyncUrl((url) => {
				const printAreaWindow = this.getPrintWindow(url); // 创建iframe
				this.settings.preview ? this.previewIframeLoad() : this.print(printAreaWindow);
			}, this.settings.vue);
		}
	}

	private addEvent(
		element: HTMLElement | null,
		type: string,
		callback: EventListenerOrEventListenerObject
	): void {
		if (!element) return;
		if (element.addEventListener) {
			element.addEventListener(type, callback, false);
		} else if ((element as any).attachEvent) {
			(element as any).attachEvent('on' + type, callback);
		} else {
			(element as any)['on' + type] = callback;
		}
	}

	private previewIframeLoad() {
		const box = document.getElementById('vue-pirnt-next-previewBox');
		if (!box) return;

		const iframe = box.querySelector('iframe');
		this.settings.previewBeforeOpenCallback?.();
		this.addEvent(iframe, 'load', () => {
			this.previewBoxShow();
			this.removeCanvasImg();
			this.settings.previewOpenCallback?.();
		});
		this.addEvent(box.querySelector('.previewBodyUtilPrintBtn'), 'click', () => {
			this.settings.beforeOpenCallback?.();
			this.settings.openCallback?.();
			iframe?.contentWindow?.print();
			this.settings.closeCallback?.();
		});
	}

	// 删除所有 canvas 转换的图片
	private removeCanvasImg() {
		if (this.printContentDom) {
			[...this.printContentDom.querySelectorAll('.canvasImg')].forEach((canvasImage) => canvasImage.remove());
		}
	}

	private print(iframe: PrintAreaWindow) {
		const iframeDom = document.getElementById(this.iframeId) || iframe.f;
		const iframeWin = (iframeDom as HTMLIFrameElement)?.contentWindow;
		if (!iframeWin) return;
		const _loaded = () => {
			iframeWin.focus();
			this.settings.openCallback?.();
			iframeWin.print();
			iframeDom.remove(); // 删除iframe元素
			this.settings.closeCallback?.();
			this.removeCanvasImg();
		};

		this.settings.beforeOpenCallback?.();
		this.addEvent(iframeDom, 'load', _loaded);
	}

	/**
	 * 获取打印需要隐藏的 css
	 * @private
	 */
	private getNoPrintMediaStyle() {
		const noPrintSelector = this.settings.noPrintSelector;
		if (!noPrintSelector) return
		const isArray = Array.isArray(noPrintSelector);
		const isString = typeof noPrintSelector ==='string';
		if(!isArray && !isString) {
			console.error('noPrintSelector 必须是数组或者字符串');
			return
		}
		const noPrintSelectorList = Array.isArray(noPrintSelector)? noPrintSelector : [noPrintSelector];
		const selectorStr = noPrintSelectorList.filter((selector) => selector.trim()).join(',');
		return `@media print { ${selectorStr} { display: none; } }`;
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

	private getHead(): string {
		const extraHead = (this.settings.extraHead || '')
			.split(',')
			.filter((m) => m.length > 0)
			.join('');

		const links = Array.from(document.querySelectorAll('link'))
			.filter((item) => item.href.includes('.css'))
			.map((item) => `<link type="text/css" rel="stylesheet" href='${item.href}'>`)
			.join('');

		const style = Array.from(document.styleSheets)
			.reduce((acc, styleSheet) => {
				try {
					if (styleSheet.cssRules || styleSheet.rules) {
						const rules = styleSheet.cssRules || styleSheet.rules;
						acc += Array.from(rules).reduce((innerAcc, rule) => innerAcc + rule.cssText, '');
					}
				} catch (e) {
					console.log((styleSheet.href || '') + e);
				}
				return acc;
			}, '');

		const extraCss = (this.settings.extraCss || '')
			.split(',')
			.filter((m) => m.trim().length > 0)
			.map((m) => `<link type="text/css" rel="stylesheet" href='${m.trim()}'>`)
			.join('');

		const noPrintMediaStyle = this.getNoPrintMediaStyle()
		return `<head>
							<title>${this.settings.popTitle}</title>
							${extraHead}${links}
							<style type="text/css">${style}${noPrintMediaStyle}</style>
							${extraCss}
						</head>`;
	}

	/**
	 * 获取打印区的 DOM
	 */
	getPrintAreaDom() {
		const el = this.settings.el;
		const isSelector = typeof el === 'string'
		const divBox = document.createElement('div');
		if (el instanceof HTMLElement) {
			divBox.appendChild(el.cloneNode(true));
			return divBox
		}

		if (!isSelector)  {
			throw new Error("el type is not string or HTMLElement, but " + typeof el);
		}

		let contentDom: Element[] = Array.from(document.querySelectorAll(el));
		if (!contentDom?.length) {
			throw new Error(`Can't find element with selector: ${el}`);
		}

		contentDom.forEach((item) => divBox.appendChild(item.cloneNode(true)));
		return divBox;
	}

	private getBody(): string {
		const printAreaDom = this.getPrintAreaDom();
		this.canvasToImgHandler(printAreaDom);
		this.formDataHandler(printAreaDom)
		this.printContentDom = printAreaDom;
		return `<body>${printAreaDom.innerHTML}</body>`;
	}

	/**
	 * 处理 canvas 转成图片
	 * @param element
	 * @private
	 */
	private canvasToImgHandler(element: HTMLElement) {
		element.querySelectorAll('canvas').forEach((canvas) => {
			const _parent = canvas.parentNode;
			const _canvasUrl = canvas.toDataURL('image/png');
			const _img = new Image();
			_img.className = 'canvasImg';
			_img.style.display = 'none';
			_img.src = _canvasUrl;
			_parent?.appendChild(_img);
		});
	}

	/**
	 * 根据type去处理form表单
	 * @param element
	 * @private
	 */
	private formDataHandler(element: HTMLElement) {
		const copiedInputs = element.querySelectorAll<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input,select,textarea');
		const canvasImgList = element.querySelectorAll<HTMLElement>('.canvasImg, canvas');
		let selectCount = -1;

		canvasImgList.forEach((item) => {
			const _parent = item.parentNode;
			// 删除克隆后的canvas节点
			if (item.tagName.toLowerCase() === 'canvas') {
				_parent?.removeChild(item);
			} else {
				item.style.display = 'block';
			}
		});

		copiedInputs.forEach((item) => {
			const formValue = item.value;
			let typeInput = item.getAttribute('type') ?? item.tagName.toLowerCase();

			switch (typeInput) {
				case 'select':
					selectCount++;
					const select = element.querySelectorAll<HTMLSelectElement>('select')[selectCount];
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
				case 'input':
					(item as HTMLInputElement).value = formValue;
					item.setAttribute('value', formValue);
					break;
			}
		});
	}

	// 生成并返回打印窗口的 iframe 和文档对象
	private getPrintWindow(url: string): PrintAreaWindow {
		const iframe = this.createIframe(url);
		// @ts-ignore
		const doc = iframe.contentDocument || iframe.contentWindow?.document || iframe.document;
		if (!doc) {
			throw new Error('Cannot find document.');
		}
		return {f: iframe, win: iframe.contentWindow || iframe, doc: doc};
	}

	// 显示预览窗口
	private previewBoxShow() {
		const box = document.getElementById('vue-pirnt-next-previewBox');
		if (box) {
			document.querySelector('html')?.setAttribute('style', 'overflow: hidden');
			box.style.display = 'block';
		}
	}

	// 隐藏预览窗口
	private previewBoxHide() {
		const box = document.getElementById('vue-pirnt-next-previewBox');
		if (box) {
			document.querySelector('html')?.setAttribute('style', 'overflow: visible;');
			box.querySelector('iframe')?.remove();
			box.style.display = 'none';
		}
	}

	// 创建或获取打印预览的框架
	private previewBox(): { close: HTMLElement | null; previewBody: HTMLElement | null } {
		let box = document.getElementById('vue-pirnt-next-previewBox');
		if (box) {
			box.querySelector('iframe')?.remove();
			return {close: box.querySelector('.previewClose'), previewBody: box.querySelector('.previewBody')};
		}

		// 创建预览框架
		box = document.createElement('div');
		box.setAttribute('id', 'vue-pirnt-next-previewBox');
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

		return {close: this.close, previewBody: this.previewBody};
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
			iframe.setAttribute('style', 'border: 0px; flex: 1;');
			const {close, previewBody} = this.previewBox();
			// 添加iframe到预览弹窗
			if (previewBody) previewBody.appendChild(iframe);
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

		this.previewBodyUtilPrintBtn = document.createElement('div');
		this.previewBodyUtilPrintBtn.className = 'previewBodyUtilPrintBtn';
		this.previewBodyUtilPrintBtn.style.cssText =
			'position: absolute; padding: 2px 10px; margin-top: 3px; left: 24px; font-size: 14px; color: white; cursor: pointer; background: rgba(0,0,0,.12); border: 1px solid rgba(0,0,0,.35); box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05), inset 0 0 1px hsla(0,0%,100%,.15);';
		this.previewBodyUtilPrintBtn.innerHTML = this.settings.previewPrintBtnLabel || '';

		previewBodyUtil.appendChild(this.previewBodyUtilPrintBtn);
		previewBody.appendChild(previewBodyUtil);

		return previewBody;
	}
}
