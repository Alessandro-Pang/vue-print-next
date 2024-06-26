import {PrintAreaOption, PrintAreaWindow, Standards} from "../../../types";

export default class VuePrintNext {
	// html 文档标准
	private readonly standards: Standards = {
		strict: 'strict',
		loose: 'loose',
		html5: 'html5'
	}
	// 打印窗口的 iframe id;
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
		const vue = option.vue
		this.settings = Object.assign({}, this.settings, option, {
			previewBeforeOpenCallback() {
				option.previewBeforeOpenCallback?.(vue)
			},
			previewOpenCallback() {
				option.previewOpenCallback?.(vue)
			},
			openCallback() {
				option.openCallback?.(vue)
			},
			closeCallback() {
				option.closeCallback?.(vue)
			},
			beforeOpenCallback() {
				option.beforeOpenCallback?.(vue)
			}
		});
		this.init();
	}

	init() {
		this.counter++;
		this.iframeId = `printArea_${this.counter}`;
		let url = ''
		if (this.settings.url && !this.settings.asyncUrl) {
			url = this.settings.url
		}
		// 如果是异步的
		if (this.settings.asyncUrl) {
			this.settings.asyncUrl((url) => {
				let PrintAreaWindow = this.getPrintWindow(url); // 创建iframe
				if (this.settings.preview) {
					// 打开预览弹窗
					this.previewIframeLoad()
				} else {
					// 直接打印
					this.print(PrintAreaWindow);
				}
			}, this.settings.vue)
			return
		}
		const PrintAreaWindow = this.getPrintWindow(url); // 创建iframe

		if (!this.settings.url) {
			this.write(PrintAreaWindow.doc); // 写入内容
		}

		if (this.settings.preview) {
			// 打开预览弹窗
			this.previewIframeLoad()
		} else {
			// 直接打印
			this.print(PrintAreaWindow);
		}
	}

	addEvent(element: HTMLElement | null, type: string, callback: EventListenerOrEventListenerObject): void {
		if (!element) return
		if (element.addEventListener) {
			element.addEventListener(type, callback, false);
		} else if ((element as any).attachEvent) {
			(element as any).attachEvent('on' + type, callback);
		} else {
			(element as any)['on' + type] = callback;
		}
	}

	previewIframeLoad() {
		let box = document.getElementById('vue-pirnt-next-previewBox')
		if (box) {
			let iframe = box.querySelector('iframe')
			this.settings.previewBeforeOpenCallback?.()
			this.addEvent(iframe, 'load', () => {
				this.previewBoxShow()
				this.removeCanvasImg()
				this.settings.previewOpenCallback?.()
			})

			this.addEvent(box.querySelector('.previewBodyUtilPrintBtn'), 'click', () => {
				this.settings.beforeOpenCallback?.()
				this.settings.openCallback?.();
				iframe?.contentWindow?.print();
				this.settings.closeCallback?.()
			})
		}
	}

	// 删除所有 canvas 转换的图片
	removeCanvasImg() {
		try {
			if (this.printContentDom) {
				// 删除 canvas 转变图片的dom节点
				let canvasList = this.printContentDom.querySelectorAll('.canvasImg')
				for (let i = 0; i < canvasList.length; i++) {
					canvasList[i].remove()
				}
			}
		} catch (e) {
			console.log(e);
		}
	}

	print(iframe: PrintAreaWindow) {
		let iframeDom = document.getElementById(this.iframeId) || iframe.f;
		let iframeWin = (iframeDom as HTMLIFrameElement)?.contentWindow;
		if (!iframeWin) return
		const _loaded = () => {
			iframeWin.focus();
			this.settings.openCallback?.();
			iframeWin.print();
			iframeDom.remove() // 删除iframe元素
			this.settings.closeCallback?.()
			this.removeCanvasImg()
		}
		this.settings.beforeOpenCallback?.()
		this.addEvent(iframeDom, 'load', () => _loaded())
	}

	write(PADocument: Document) {
		PADocument.open();
		PADocument.write(`${this.docType()}<html lang="zh">${this.getHead()}${this.getBody()}</html>`);
		PADocument.close();
	}

	docType() {
		if (this.settings.standard === this.standards.html5) {
			return '<!DOCTYPE html>';
		}
		const transitional = this.settings.standard === this.standards.loose ? ' Transitional' : '';
		const dtd = this.settings.standard === this.standards.loose ? 'loose' : 'strict';
		return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01${transitional}//EN" "http://www.w3.org/TR/html4/${dtd}.dtd">`;
	}

	getHead() {
		let extraHead = '';
		let links = '';
		let style = '';
		if (this.settings.extraHead) {
			extraHead = this.settings.extraHead.split(',')
				.map(m => m.trim())
				.filter(m => m.length > 0)
				.join('');
		}
		// 复制所有link标签
		links = Array.from(document.querySelectorAll('link'))
			.filter(item => item.href.includes('.css'))
			.map(item => `<link type="text/css" rel="stylesheet" href="${item.href}">`)
			.join('');

		// 循环获取style标签的样式
		let domStyle = document.styleSheets;
		if (domStyle && domStyle.length > 0) {
			for (let i = 0; i < domStyle.length; i++) {
				try {
					if (domStyle[i].cssRules || domStyle[i].rules) {
						let rules = domStyle[i].cssRules || domStyle[i].rules;
						for (let b = 0; b < rules.length; b++) {
							style += rules[b].cssText;
						}
					}
				} catch (e) {
					console.log((domStyle[i]?.href || '') + e);
				}
			}
		}

		if (this.settings.extraCss) {
			links += this.settings.extraCss.split(',')
				.filter(m => m.trim().length > 0)
				.map(m => `<link type="text/css" rel="stylesheet" href="${m.trim()}">`)
				.join('')
		}

		return `<head><title>${this.settings.popTitle}</title>${extraHead}${links}<style>${style}</style></head>`;
	}

	getBody() {
		const id = this.settings.id;
		const idStr = id.replace(new RegExp("#", "g"), '');
		const dom = document.getElementById(idStr);
		if (!dom) {
			throw new Error('dom is not found！')
		}
		this.printContentDom = this.beforeHandler(dom);
		let ele = this.getFormData(this.printContentDom);
		let htm = ele.outerHTML;
		return '<body>' + htm + '</body>';
	}

	// 处理 canvas 转成图片
	beforeHandler(printContentDom: HTMLElement): HTMLElement {
		let canvasList = printContentDom.querySelectorAll('canvas');
		// canvas转换png图片
		for (let i = 0; i < canvasList.length; i++) {
			if (!canvasList[i].style.display) {
				let _parent = canvasList[i].parentNode
				let _canvasUrl = canvasList[i].toDataURL('image/png')
				let _img = new Image()
				_img.className = 'canvasImg'
				_img.style.display = 'none'
				_img.src = _canvasUrl
				_parent?.appendChild(_img)
			}
		}
		return printContentDom
	}

	// 根据type去处理form表单
	getFormData(ele: HTMLElement): HTMLElement {
		let copy = ele.cloneNode(true) as HTMLElement;
		let copiedInputs = copy.querySelectorAll('input,select,textarea');
		let canvasImgList = copy.querySelectorAll('.canvasImg,canvas');
		let selectCount = -1;
		// 处理所有canvas
		for (let i = 0; i < canvasImgList.length; i++) {
			let _parent = canvasImgList[i].parentNode
			let item = canvasImgList[i] as HTMLElement
			// 删除克隆后的canvas节点
			if (item.tagName.toLowerCase() === 'canvas') {
				_parent?.removeChild(item)
			} else {
				item.style.display = 'block'
			}
		}
		// 处理所有输入框
		for (let i = 0; i < copiedInputs.length; i++) {
			const item = copiedInputs[i] as HTMLElement;
			const formValue = (item as HTMLInputElement).value;
			const copiedInput = copiedInputs[i] as HTMLInputElement;
			let typeInput = item.getAttribute('type');
			// 获取select标签
			if (!typeInput) {
				typeInput = item.tagName === 'SELECT' ? 'select' : item.tagName === 'TEXTAREA' ? 'textarea' : '';
			}
			// 处理input框
			if (item.tagName === 'INPUT') {
				// 除了单选框 多选框比较特别
				if (typeInput === 'radio' || typeInput === 'checkbox') {
					if ((item as HTMLInputElement).checked) {
						copiedInput.setAttribute('checked', String((item as HTMLInputElement).checked));
					}

				} else {
					copiedInput.value = formValue;
					copiedInput.setAttribute('value', formValue);
				}
				// 处理select
			} else if (typeInput === 'select') {

				selectCount++;
				for (let b = 0; b < ele.querySelectorAll('select').length; b++) {
					let select = ele.querySelectorAll('select')[b]; // 获取原始层每一个select
					!select.getAttribute('newbs') && select.setAttribute('newbs', b.toString()) // 添加标识
					if (select.getAttribute('newbs') === selectCount.toString()) {
						let opSelectedIndex = ele.querySelectorAll('select')[selectCount].selectedIndex;
						(item as HTMLSelectElement).options[opSelectedIndex].setAttribute('selected', 'true');
					}
				}
				// 处理textarea
			} else {
				copiedInput.innerHTML = formValue;
				copiedInput.setAttribute('html', formValue);
			}
		}

		return copy;
	}

	getPrintWindow(url: string): PrintAreaWindow {
		const iframe = this.Iframe(url);
		// @ts-ignore
		const doc = iframe.contentDocument || iframe.contentWindow?.document || iframe.document;
		if (!doc) {
			throw new Error('Cannot find document.');
		}
		return {
			f: iframe,
			win: iframe.contentWindow || iframe,
			doc: doc
		};
	}

	previewBoxShow() {
		let box = document.getElementById('vue-pirnt-next-previewBox')
		if (box) {
			document.querySelector('html')?.setAttribute('style', 'overflow: hidden')
			box.style.display = 'block'
		}
	}

	previewBoxHide() {
		let box = document.getElementById('vue-pirnt-next-previewBox')
		if (box) {
			document.querySelector('html')?.setAttribute('style', 'overflow: visible;')
			box.querySelector('iframe')?.remove()
			box.style.display = 'none'
		}
	}

	previewBox(): { close: HTMLElement | null; previewBody: HTMLElement | null } {
		let box = document.getElementById('vue-pirnt-next-previewBox')
		let previewBodyClass = 'previewBody'
		if (box) {
			box.querySelector('iframe')?.remove()
			return {
				close: box.querySelector('.previewClose'),
				previewBody: box.querySelector(`.${previewBodyClass}`)
			}
		}
		let previewContent = document.createElement('div');
		previewContent.setAttribute('id', "vue-pirnt-next-previewBox")
		previewContent.setAttribute('style', 'position: fixed;top: 0px;left: 0px;width: 100%;height: 100%;background: white;display:none')
		previewContent.style.zIndex = this.settings.zIndex?.toString() || "1"
		// 打印预览弹窗的header
		let previewHeader = document.createElement('div');
		previewHeader.setAttribute('class', "previewHeader")
		previewHeader.setAttribute('style', "padding: 5px 20px;")
		previewHeader.innerHTML = this.settings.previewTitle || ''
		previewContent.appendChild(previewHeader)
		// close关闭按钮
		this.close = document.createElement('div');
		let close = this.close
		close.setAttribute('class', "previewClose")
		close.setAttribute('style', "position: absolute;top: 5px;right: 20px;width: 25px;height: 20px;cursor: pointer;")
		let closeBefore = document.createElement('div');
		let closeAfter = document.createElement('div');
		closeBefore.setAttribute('class', "closeBefore")
		closeBefore.setAttribute('style', "position: absolute;width: 3px;height: 100%;background: #040404;transform: rotate(45deg); top: 0px;left: 50%;")
		closeAfter.setAttribute('class', "closeAfter")
		closeAfter.setAttribute('style', "position: absolute;width: 3px;height: 100%;background: #040404;transform: rotate(-45deg); top: 0px;left: 50%;")
		close.appendChild(closeBefore)
		close.appendChild(closeAfter)
		previewHeader.appendChild(close)

		// 打印预览弹窗的body
		this.previewBody = document.createElement('div');
		let previewBody = this.previewBody
		previewBody.setAttribute('class', previewBodyClass)
		previewBody.setAttribute('style', "display: flex;flex-direction: column; height: 100%;")
		previewContent.appendChild(previewBody)
		// 打印预览弹窗的body的工具栏
		let previewBodyUtil = document.createElement('div');
		previewBodyUtil.setAttribute('class', "previewBodyUtil")
		previewBodyUtil.setAttribute('style', "height: 32px;background: #474747;position: relative;")
		previewBody.appendChild(previewBodyUtil)
		// 打印的按钮
		this.previewBodyUtilPrintBtn = document.createElement('div');
		let previewBodyUtilPrintBtn = this.previewBodyUtilPrintBtn
		previewBodyUtilPrintBtn.setAttribute('class', 'previewBodyUtilPrintBtn')
		previewBodyUtilPrintBtn.innerHTML = this.settings.previewPrintBtnLabel || ''
		previewBodyUtilPrintBtn.setAttribute('style', 'position: absolute;padding: 2px 10px;margin-top: 3px;left: 24px;font-size: 14px;color: white;cursor: pointer;background-color: rgba(0,0,0,.12);background-image: linear-gradient(hsla(0,0%,100%,.05),hsla(0,0%,100%,0));background-clip: padding-box;border: 1px solid rgba(0,0,0,.35);border-color: rgba(0,0,0,.32) rgba(0,0,0,.38) rgba(0,0,0,.42);box-shadow: inset 0 1px 0 hsla(0,0%,100%,.05), inset 0 0 1px hsla(0,0%,100%,.15), 0 1px 0 hsla(0,0%,100%,.05);')
		previewBodyUtil.appendChild(previewBodyUtilPrintBtn)

		// 添加整个预览到body
		document.body.appendChild(previewContent);

		return {
			close: this.close,
			previewBody: this.previewBody
		}
	}

	iframeBox(frameId: string, url: string): HTMLIFrameElement {
		let iframe = document.createElement('iframe');
		iframe.style.border = '0px';
		iframe.style.position = 'absolute';
		iframe.style.width = '0px';
		iframe.style.height = '0px';
		iframe.style.right = '0px';
		iframe.style.top = '0px';
		iframe.setAttribute('id', frameId);
		iframe.setAttribute('src', url);
		return iframe
	}

	Iframe(url: string): HTMLIFrameElement {
		// 局部打印 用当前的时间做iframe的url
		url = !url ? new Date().getTime().toString() : url
		let iframe = this.iframeBox(this.iframeId, url)
		try {
			// 直接打印 不预览
			if (!this.settings.preview) {
				document.body.appendChild(iframe);
			} else {
				iframe.setAttribute('style', 'border: 0px;flex: 1;')
				// 预览打印
				let previewBox = this.previewBox()
				let previewBody = previewBox.previewBody
				let close = previewBox.close
				// 添加iframe到预览弹窗
				previewBody?.appendChild(iframe);
				this.addEvent(close, 'click', () => {
					this.previewBoxHide()
				})
			}
		} catch (e) {
			throw new Error(e + '. iframes may not be supported in this browser.');
		}
		return iframe;
	}
}
