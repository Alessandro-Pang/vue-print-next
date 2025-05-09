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

const commonBtnStyle = (size = 32) => `width: ${size}px; height: ${size}px; border: none; background: transparent; cursor: pointer; border-radius: 4px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease; padding: 0; outline: none;`;

const getFormatSize = (size: string | number, unit: string) => {
	if (typeof size === 'number' || !isNaN(Number(size))) return `${size}${unit}`;
	const sizeUnit = size.toString().match(/[a-zA-Z]+/g)?.[0];
	if(!sizeUnit || !(sizeUnit in PAPER_SIZES)) return `${size}mm`;
	return size;
}

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
	// 预览窗口的缩放比例
	private scale: number = 1;
	// 预览窗口是否为深色模式
	private isDarkMode: boolean = false;
	// 预览窗口是否为全屏模式
	private isFullscreen: boolean = true; // 默认为全屏模式
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
			previewSize,
			darkMode = false,
			windowMode = false,
			defaultScale = 1,
			...otherOptions 
		} = option;
		
		// 设置初始状态
		this.isDarkMode = darkMode;
		this.isFullscreen = !windowMode; // 窗口模式时，不是全屏模式
		this.scale = defaultScale;
		
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
			previewSize,
			darkMode,
			windowMode,
			defaultScale,
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
			// 处理宽度，支持number和string类型
			const w = typeof width === 'number' ? `${width}${unit}` : (width.toString().endsWith(unit) ? width : `${width}${unit}`);
			// 处理高度，支持number和string类型
			const h = typeof height === 'number' ? `${height}${unit}` : (height.toString().endsWith(unit) ? height : `${height}${unit}`);
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
			
			// 添加过渡动画效果
			box.style.opacity = '0';
			box.style.display = 'block';
			
			// 使用setTimeout确保过渡效果生效
			setTimeout(() => {
				box.style.transition = 'opacity 0.3s ease';
				box.style.opacity = '1';
				
				// 应用初始主题设置 - 修复深色模式
				if (this.isDarkMode) {
					// 因为toggleTheme会切换状态，所以如果已经是深色模式，需要先切换回浅色模式
					this.isDarkMode = false;
					this.toggleTheme();
				}
				
				// 应用初始全屏/弹窗模式 - 修复窗口模式
				if (!this.isFullscreen) {
					// 如果设置了窗口模式，确保应用窗口模式样式
					// 因为toggleFullscreen会切换状态，所以如果已经是窗口模式，需要先切换回全屏模式
					this.isFullscreen = true;
					this.toggleFullscreen();
				}
				
				// 应用初始缩放比例
				if (this.scale !== 1) {
					this.updatePreviewScale();
				}
			}, 10);
		}
	}

	// 隐藏预览窗口
	private previewBoxHide() {
		const box = document.getElementById('vue-print-next-previewBox');
		if (box) {
			// 添加淡出动画
			box.style.opacity = '0';
			
			setTimeout(() => {
				// 恢复页面滚动
				document.querySelector('html')?.setAttribute('style', 'overflow: visible;');
				
				// 查找iframe容器并移除iframe
				const paperContainer = box.querySelector('.paperContainer');
				paperContainer?.querySelector('iframe')?.remove();
				box.style.display = 'none';
				
				// 重置按钮状态
				const printBtn: HTMLButtonElement | null = box.querySelector('.previewBodyUtilPrintBtn');
				if (printBtn) {
					printBtn.style.backgroundColor = '#1890ff';
					printBtn.style.boxShadow = 'none';
				}
				
				// 重置缩放
				this.scale = this.settings.defaultScale || 1;
				
				// 重置深色模式
				if (this.isDarkMode) {
					this.toggleTheme();
				}
				
				// 重置全屏模式
				if (this.isFullscreen) {
					this.isFullscreen = false;
					box.style.width = '100%';
					box.style.height = '100%';
					box.style.top = '0';
					box.style.left = '0';
					box.style.borderRadius = '0';
				}
			}, 300); // 与过渡动画时间匹配
		}
	}

	// 创建或获取打印预览的框架
	private previewBox(): { close: HTMLElement | null; previewBody: HTMLElement | null } {
		let box = document.getElementById('vue-print-next-previewBox');
		if (box) {
			box.querySelector('iframe')?.remove();
			// 重新设置纸张尺寸，确保应用最新的previewSize设置
			const paperContainer = box.querySelector('.paperContainer');
			if (paperContainer) {
				this.setPaperSize(paperContainer as HTMLElement);
			}
			return { close: box.querySelector('.previewClose'), previewBody: box.querySelector('.previewBody') };
		}

		// 创建预览框架
		box = document.createElement('div');
		box.setAttribute('id', 'vue-print-next-previewBox');
		box.setAttribute(
			'style',
			'position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background: rgba(250, 250, 250, 0.98); display: none; z-index: ' + this.settings.zIndex + '; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; box-shadow: 0 0 20px rgba(0, 0, 0, 0.1); transition: background-color 0.3s ease;'
		);
		box.setAttribute('data-theme', 'light');

		// 预览框架的头部
		const previewHeader = document.createElement('div');
		previewHeader.setAttribute('class', 'previewHeader');
		previewHeader.setAttribute('style', 'padding: 12px 24px; background: #fff; border-bottom: 1px solid #eaeaea; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); transition: background-color 0.3s ease, border-color 0.3s ease;');
		
		// 标题容器
		const titleContainer = document.createElement('div');
		titleContainer.setAttribute('style', 'font-size: 16px; font-weight: 500; color: #333; transition: color 0.3s ease;');
		titleContainer.innerHTML = this.settings.previewTitle || '';

		// 工具栏容器
		const toolsContainer = document.createElement('div');
		toolsContainer.setAttribute('style', 'display: flex; align-items: center; gap: 12px;');

		// 添加缩放控制
		const zoomControls = this.createZoomControls();
		toolsContainer.appendChild(zoomControls);

		// 添加主题切换按钮
		const themeToggle = this.createThemeToggle();
		toolsContainer.appendChild(themeToggle);

		// 添加全屏切换按钮
		const fullscreenToggle = this.createFullscreenToggle();
		toolsContainer.appendChild(fullscreenToggle);

		// 关闭按钮
		this.close = this.createCloseButton();
		
		// 将标题和工具栏添加到头部
		previewHeader.appendChild(titleContainer);
		previewHeader.appendChild(toolsContainer);
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
			iframe.style.cssText = 'border: 0px; width: 100%; height: 100%; background: white; transition: background-color 0.3s ease;';
			const { close, previewBody } = this.previewBox();
			
			// 查找纸张容器中的iframe容器并添加iframe
			const paperContainer = previewBody?.querySelector('.paperContainer');
			const iframeContainer = paperContainer?.querySelector('div');
			iframeContainer?.appendChild(iframe);
			
			// 设置初始缩放
			this.updatePreviewScale();
			
			// 添加关闭事件
			this.addEvent(close, 'click', this.previewBoxHide.bind(this));
			
			// 监听iframe加载完成事件，更新深色模式
			this.addEvent(iframe, 'load', () => {
				if (this.isDarkMode) {
					// 为iframe内容添加深色模式样式
					try {
						const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
						if (iframeDoc) {
							const darkModeStyle = iframeDoc.createElement('style');
							darkModeStyle.textContent = 'body { color-scheme: dark; }'; 
							iframeDoc.head.appendChild(darkModeStyle);
						}
					} catch (e) {
						console.warn('无法为iframe内容添加深色模式样式', e);
					}
				}
			});
		}
		return iframe;
	}

	// 创建关闭按钮
	private createCloseButton(): HTMLElement {
		const close = document.createElement('div');
		close.setAttribute('class', 'previewClose');
		close.setAttribute('style', 'width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background-color 0.2s ease, color 0.3s ease;');
		close.addEventListener('mouseover', () => {
			close.style.backgroundColor = this.isDarkMode ? '#444' : '#f0f0f0';
		});
		close.addEventListener('mouseout', () => {
			close.style.backgroundColor = 'transparent';
		});

		const closeBefore = document.createElement('div');
		const closeAfter = document.createElement('div');
		const closeStyles = 'position: relative; width: 2px; height: 16px; background: #666; border-radius: 1px; transition: background-color 0.2s ease;';

		closeBefore.setAttribute('class', 'closeBefore');
		closeBefore.setAttribute('style', `${closeStyles} transform: rotate(45deg); margin-left: -1px;`);

		closeAfter.setAttribute('class', 'closeAfter');
		closeAfter.setAttribute('style', `${closeStyles} transform: rotate(-45deg); margin-left: -1px;`);

		close.appendChild(closeBefore);
		close.appendChild(closeAfter);
		
		close.addEventListener('mouseover', () => {
			closeBefore.style.backgroundColor = this.isDarkMode ? '#fff' : '#333';
			closeAfter.style.backgroundColor = this.isDarkMode ? '#fff' : '#333';
		});
		close.addEventListener('mouseout', () => {
			closeBefore.style.backgroundColor = this.isDarkMode ? '#999' : '#666';
			closeAfter.style.backgroundColor = this.isDarkMode ? '#999' : '#666';
		});

		return close;
	}

	// 创建缩放控制
	private createZoomControls(): HTMLElement {
		const zoomContainer = document.createElement('div');
		zoomContainer.setAttribute('class', 'zoomControls');
		zoomContainer.setAttribute('style', 'display: flex; align-items: center; gap: 8px;');

		// 缩小按钮
		const zoomOutBtn = document.createElement('button');
		zoomOutBtn.setAttribute('class', 'zoomOutBtn');
		zoomOutBtn.setAttribute('style', commonBtnStyle(28));
		zoomOutBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
		zoomOutBtn.addEventListener('mouseover', () => {
			zoomOutBtn.style.backgroundColor = this.isDarkMode ? '#444' : '#f0f0f0';
		});
		zoomOutBtn.addEventListener('mouseout', () => {
			zoomOutBtn.style.backgroundColor = 'transparent';
		});
		zoomOutBtn.addEventListener('click', () => {
			this.scale = Math.max(0.5, this.scale - 0.1);
			this.updatePreviewScale();
		});

		// 缩放显示
		const zoomDisplay = document.createElement('span');
		zoomDisplay.setAttribute('class', 'zoomDisplay');
		zoomDisplay.setAttribute('style', 'font-size: 14px; min-width: 40px; text-align: center;');
		zoomDisplay.textContent = '100%';

		// 放大按钮
		const zoomInBtn = document.createElement('button');
		zoomInBtn.setAttribute('class', 'zoomInBtn');
		zoomInBtn.setAttribute('style', commonBtnStyle(28));
		zoomInBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
		zoomInBtn.addEventListener('mouseover', () => {
			zoomInBtn.style.backgroundColor = this.isDarkMode ? '#444' : '#f0f0f0';
		});
		zoomInBtn.addEventListener('mouseout', () => {
			zoomInBtn.style.backgroundColor = 'transparent';
		});
		zoomInBtn.addEventListener('click', () => {
			this.scale = Math.min(2, this.scale + 0.1);
			this.updatePreviewScale();
		});

		// 重置按钮
		const zoomResetBtn = document.createElement('button');
		zoomResetBtn.setAttribute('class', 'zoomResetBtn');
		zoomResetBtn.setAttribute('style', 'font-size: 12px; padding: 2px 6px; border: none; background: transparent; cursor: pointer; border-radius: 4px; transition: background-color 0.2s ease;');
		zoomResetBtn.textContent = '重置';
		zoomResetBtn.addEventListener('mouseover', () => {
			zoomResetBtn.style.backgroundColor = this.isDarkMode ? '#444' : '#f0f0f0';
		});
		zoomResetBtn.addEventListener('mouseout', () => {
			zoomResetBtn.style.backgroundColor = 'transparent';
		});
		zoomResetBtn.addEventListener('click', () => {
			this.scale = this.settings.defaultScale || 1;
			this.updatePreviewScale();
		});

		zoomContainer.appendChild(zoomOutBtn);
		zoomContainer.appendChild(zoomDisplay);
		zoomContainer.appendChild(zoomInBtn);
		zoomContainer.appendChild(zoomResetBtn);

		return zoomContainer;
	}

	// 更新预览缩放比例
	private updatePreviewScale(): void {
		const box = document.getElementById('vue-print-next-previewBox');
		if (!box) return;

		// 更新缩放显示
		const zoomDisplay = box.querySelector('.zoomDisplay');
		if (zoomDisplay) {
			zoomDisplay.textContent = `${Math.round(this.scale * 100)}%`;
		}

		// 更新预览内容缩放
		const paperContainer = box.querySelector('.paperContainer');
		if (paperContainer) {
			(paperContainer as HTMLElement).style.transform = `scale(${this.scale})`;
			(paperContainer as HTMLElement).style.transformOrigin = 'center top';
		}
	}

	// 创建主题切换按钮
	private createThemeToggle(): HTMLElement {
		const themeToggle = document.createElement('button');
		themeToggle.setAttribute('class', 'themeToggle');
		themeToggle.setAttribute('style', commonBtnStyle());
		themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
		themeToggle.setAttribute('title', '切换深色/浅色模式');

		themeToggle.addEventListener('mouseover', () => {
			themeToggle.style.backgroundColor = this.isDarkMode ? '#444' : '#f0f0f0';
		});
		themeToggle.addEventListener('mouseout', () => {
			themeToggle.style.backgroundColor = 'transparent';
		});
		themeToggle.addEventListener('click', () => {
			this.toggleTheme();
		});

		return themeToggle;
	}

	// 切换深色/浅色主题
	private toggleTheme(): void {
		this.isDarkMode = !this.isDarkMode;
		const box = document.getElementById('vue-print-next-previewBox');
		if (!box) return;

		if (this.isDarkMode) {
			box.setAttribute('data-theme', 'dark');
			box.style.backgroundColor = 'rgba(30, 30, 30, 0.98)';
			
			// 更新头部样式
			const header = box.querySelector('.previewHeader');
			if (header) {
				(header as HTMLElement).style.backgroundColor = '#242424';
				(header as HTMLElement).style.borderColor = '#333';
			}

			// 更新标题颜色
			const title = box.querySelector('.previewHeader > div:first-child');
			if (title) {
				(title as HTMLElement).style.color = '#fff';
			}

			// 更新工具栏颜色
			const tools = box.querySelectorAll('.previewHeader button, .previewHeader svg, .zoomDisplay, .zoomResetBtn');
			tools.forEach(tool => {
				(tool as HTMLElement).style.color = '#fff';
			});

			// 更新主体样式
			const bodyUtil = box.querySelector('.previewBodyUtil');
			if (bodyUtil) {
				(bodyUtil as HTMLElement).style.backgroundColor = '#242424';
				(bodyUtil as HTMLElement).style.borderColor = '#333';
			}

			// 更新关闭按钮颜色
			const closeBefore = box.querySelector('.closeBefore');
			const closeAfter = box.querySelector('.closeAfter');
			if (closeBefore) {
				(closeBefore as HTMLElement).style.backgroundColor = '#fff';
			}
			if (closeAfter) {
				(closeAfter as HTMLElement).style.backgroundColor = '#fff';
			}

			// 更新内容区背景
			const contentContainer = box.querySelector('.previewBody > div:last-child');
			if (contentContainer) {
				(contentContainer as HTMLElement).style.backgroundColor = '#1a1a1a';
			}

			// 更新页码信息颜色
			const pageInfo = box.querySelector('.pageInfo');
			if (pageInfo) {
				(pageInfo as HTMLElement).style.color = '#ccc';
			}

			// 更新主题切换图标
			const themeToggle = box.querySelector('.themeToggle');
			if (themeToggle) {
				themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
			}
		} else {
			box.setAttribute('data-theme', 'light');
			box.style.backgroundColor = 'rgba(250, 250, 250, 0.98)';
			
			// 更新头部样式
			const header = box.querySelector('.previewHeader');
			if (header) {
				(header as HTMLElement).style.backgroundColor = '#fff';
				(header as HTMLElement).style.borderColor = '#eaeaea';
			}

			// 更新标题颜色
			const title = box.querySelector('.previewHeader > div:first-child');
			if (title) {
				(title as HTMLElement).style.color = '#333';
			}

			// 更新工具栏颜色
			const tools = box.querySelectorAll('.previewHeader button, .previewHeader svg, .zoomDisplay, .zoomResetBtn');
			tools.forEach(tool => {
				(tool as HTMLElement).style.color = '#333';
			});

			// 更新主体样式
			const bodyUtil = box.querySelector('.previewBodyUtil');
			if (bodyUtil) {
				(bodyUtil as HTMLElement).style.backgroundColor = '#fff';
				(bodyUtil as HTMLElement).style.borderColor = '#eaeaea';
			}

			// 更新关闭按钮颜色
			const closeBefore = box.querySelector('.closeBefore');
			const closeAfter = box.querySelector('.closeAfter');
			if (closeBefore) {
				(closeBefore as HTMLElement).style.backgroundColor = '#666';
			}
			if (closeAfter) {
				(closeAfter as HTMLElement).style.backgroundColor = '#666';
			}

			// 更新内容区背景
			const contentContainer = box.querySelector('.previewBody > div:last-child');
			if (contentContainer) {
				(contentContainer as HTMLElement).style.backgroundColor = '#f5f5f5';
			}

			// 更新页码信息颜色
			const pageInfo = box.querySelector('.pageInfo');
			if (pageInfo) {
				(pageInfo as HTMLElement).style.color = '#666';
			}

			// 更新主题切换图标
			const themeToggle = box.querySelector('.themeToggle');
			if (themeToggle) {
				themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
			}
		}
	}

	// 创建全屏切换按钮
	private createFullscreenToggle(): HTMLElement {
		const fullscreenToggle = document.createElement('button');
		fullscreenToggle.setAttribute('class', 'fullscreenToggle');
		fullscreenToggle.setAttribute('style', commonBtnStyle());
		fullscreenToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
		fullscreenToggle.setAttribute('title', '切换全屏/弹窗模式');

		fullscreenToggle.addEventListener('mouseover', () => {
			fullscreenToggle.style.backgroundColor = this.isDarkMode ? '#444' : '#f0f0f0';
		});
		fullscreenToggle.addEventListener('mouseout', () => {
			fullscreenToggle.style.backgroundColor = 'transparent';
		});
		fullscreenToggle.addEventListener('click', () => {
			this.toggleFullscreen();
		});

		return fullscreenToggle;
	}

	// 切换全屏/弹窗模式
	private toggleFullscreen(): void {
		this.isFullscreen = !this.isFullscreen;
		const box = document.getElementById('vue-print-next-previewBox');
		if (!box) return;

		if (!this.isFullscreen) {
			// 切换到弹窗模式
			box.style.width = '80%';
			box.style.height = '80%';
			box.style.top = '10%';
			box.style.left = '10%';
			box.style.borderRadius = '8px';
			box.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.2)';

			// 更新全屏图标
			const fullscreenToggle = box.querySelector('.fullscreenToggle');
			if (fullscreenToggle) {
				fullscreenToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 3 3 3 3 8"></polyline><polyline points="21 8 21 3 16 3"></polyline><polyline points="3 16 3 21 8 21"></polyline><polyline points="16 21 21 21 21 16"></polyline></svg>';
			}
		} else {
			// 切换到全屏模式
			box.style.width = '100%';
			box.style.height = '100%';
			box.style.top = '0';
			box.style.left = '0';
			box.style.borderRadius = '0';
			box.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.1)';

			// 更新全屏图标
			const fullscreenToggle = box.querySelector('.fullscreenToggle');
			if (fullscreenToggle) {
				fullscreenToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>';
			}
		}
	}

	// 创建预览主体
	private createPreviewBody(): HTMLElement {
		const previewBody = document.createElement('div');
		previewBody.className = 'previewBody';
		previewBody.style.cssText = 'display: flex; flex-direction: column; height: calc(100% - 56px);';

		const previewBodyUtil = document.createElement('div');
		previewBodyUtil.className = 'previewBodyUtil';
		previewBodyUtil.style.cssText = 'height: 48px; background: #fff; position: relative; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; border-bottom: 1px solid #eaeaea; transition: background-color 0.3s ease, border-color 0.3s ease;';

		// 左侧工具区域
		const leftTools = document.createElement('div');
		leftTools.className = 'leftTools';
		leftTools.style.cssText = 'display: flex; align-items: center; gap: 16px;';

		// 打印按钮
		const previewBodyUtilPrintBtn = document.createElement('button');
		previewBodyUtilPrintBtn.className = 'previewBodyUtilPrintBtn';
		previewBodyUtilPrintBtn.style.cssText =
			'padding: 8px 16px; font-size: 14px; color: white; cursor: pointer; background: #1890ff; border: none; border-radius: 4px; transition: all 0.3s ease; outline: none; font-weight: 500; display: flex; align-items: center; justify-content: center;';
		previewBodyUtilPrintBtn.innerHTML = this.settings.previewPrintBtnLabel || '';
		
		// 添加打印图标
		const printIcon = document.createElement('span');
		printIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>';
		
		// 添加悬停效果
		previewBodyUtilPrintBtn.addEventListener('mouseover', () => {
			previewBodyUtilPrintBtn.style.backgroundColor = '#40a9ff';
			previewBodyUtilPrintBtn.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
		});
		previewBodyUtilPrintBtn.addEventListener('mouseout', () => {
			previewBodyUtilPrintBtn.style.backgroundColor = '#1890ff';
			previewBodyUtilPrintBtn.style.boxShadow = 'none';
		});
		
		previewBodyUtilPrintBtn.insertBefore(printIcon, previewBodyUtilPrintBtn.firstChild);
		leftTools.appendChild(previewBodyUtilPrintBtn);

		// 纸张信息显示
		const paperInfo = document.createElement('div');
		paperInfo.className = 'paperInfo';
		paperInfo.style.cssText = 'font-size: 13px; color: #666; display: flex; align-items: center; transition: color 0.3s ease;';
		
		// 获取纸张信息
		const { paperSize = 'A4', orientation = 'portrait', customSize, previewSize } = this.settings;
		let paperSizeText = '';
		
		// 优先使用预览尺寸（如果设置了）
		if (previewSize) {
			// 如果previewSize是字符串，表示使用预设尺寸
			if (typeof previewSize === 'string') {
				paperSizeText = previewSize;
			} else if (previewSize.width && previewSize.height) {
				// 如果是自定义尺寸对象
				const { width, height, unit = 'mm' } = previewSize;
				// 确保显示时正确处理number类型
				const displayWidth = getFormatSize(width, unit);
				const displayHeight = getFormatSize(height, unit);
				paperSizeText = `自定义 (${displayWidth} × ${displayHeight})`;
			}
		} else if (paperSize === 'custom' && customSize) {
			const { width, height, unit = 'mm' } = customSize;
			// 确保显示时正确处理number类型
			const displayWidth = getFormatSize(width, unit);
			const displayHeight = getFormatSize(height, unit);
			paperSizeText = `自定义 (${displayWidth} × ${displayHeight})`;
		} else {
			paperSizeText = paperSize;
		}
		
		paperInfo.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg> ${paperSizeText} - ${orientation === 'portrait' ? '纵向' : '横向'}`;
		
		leftTools.appendChild(paperInfo);
		previewBodyUtil.appendChild(leftTools);
		previewBody.appendChild(previewBodyUtil);

		// 添加内容容器
		const contentContainer = document.createElement('div');
		contentContainer.className = 'contentContainer';
		contentContainer.style.cssText = 'flex: 1; padding: 24px; overflow: auto; background: #f5f5f5; display: flex; justify-content: center; transition: background-color 0.3s ease;';

		// 添加纸张容器，按照纸张大小显示
		const paperContainer = document.createElement('div');
		paperContainer.className = 'paperContainer';
		paperContainer.style.cssText = 'background: white; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15); transition: box-shadow 0.3s ease; transform-origin: center top; margin-bottom: 24px;';

		// 设置纸张尺寸和方向
		this.setPaperSize(paperContainer);

		// 添加iframe容器
		const iframeContainer = document.createElement('div');
		iframeContainer.style.cssText = 'width: 100%; height: 100%; overflow: hidden;';
		paperContainer.appendChild(iframeContainer);
		contentContainer.appendChild(paperContainer);
		previewBody.appendChild(contentContainer);

		return previewBody;
	}

	// 设置纸张尺寸和方向
	private setPaperSize(container: HTMLElement): void {
		const { paperSize = 'A4', orientation = 'portrait', customSize, previewSize } = this.settings;
		const defaultSize = PAPER_SIZES.A4;
		let width = defaultSize.width;
		let height = defaultSize.height;

		// 优先使用预览尺寸（如果设置了）
		if (previewSize) {
			// 如果previewSize是字符串，表示使用预设尺寸
			if (typeof previewSize === 'string') {
				if (previewSize in PAPER_SIZES) {
					const size = PAPER_SIZES[previewSize as keyof typeof PAPER_SIZES];
					width = size.width;
					height = size.height;
				} else {
					// 如果指定的预设尺寸不存在，使用A4
					const defaultSize = PAPER_SIZES.A4;
					width = defaultSize.width;
					height = defaultSize.height;
				}
			} else if (previewSize.width && previewSize.height) {
				// 如果是自定义尺寸对象
				const { width: w, height: h, unit = 'mm' } = previewSize;
				// 处理宽度，支持number和string类型
				width = getFormatSize(w, unit);
				// 处理高度，支持number和string类型
				height = getFormatSize(h, unit);
			}
		} else if (paperSize === 'custom' && customSize) {
			// 如果没有设置预览尺寸，则使用打印尺寸
			const { width: w, height: h, unit = 'mm' } = customSize;
			// 处理宽度，支持number和string类型
			width = getFormatSize(w, unit);
			// 处理高度，支持number和string类型
			height = getFormatSize(h, unit);
		} else if (paperSize in PAPER_SIZES) {
			const size = PAPER_SIZES[paperSize as keyof typeof PAPER_SIZES];
			width = size.width;
			height = size.height;
		}

		// 根据方向设置尺寸
		if (orientation === 'portrait') {
			container.style.width = width;
			container.style.height = height;
		} else {
			container.style.width = height;
			container.style.height = width;
		}
	}
}
