# API 参数详解

## `el`

- **类型**: `string` \| `HtmlElement`
- **说明**: 指定需要打印的元素。可以是 CSS 选择器（如 `#elementId`）或实际的 DOM 元素节点（如 `document.getElementById('elementId')`）。
- **默认值**: 无
- **示例**:

  ```ts twoslash
  // 使用 CSS 选择器
  new VuePrintNext({ el: '#printMe' });

  // 使用 DOM 节点
  const element = document.getElementById('printMe');
  new VuePrintNext({ el: element });
  ```

## `standard`

- **类型**: `string`
- **说明**: 指定打印的文档类型。可以设置为 `html5`、`loose` 或 `strict`。默认使用 `html5`。
- **默认值**: `html5`
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    standard: 'strict' // 使用严格模式
  });
  ```

## `noPrintSelector`

- **类型**: `string[]` \| `string`
- **说明**: 指定在打印时需要忽略的元素。可以传入一个 CSS 选择器字符串或一个字符串数组。如果传入数组，数组中的所有选择器都会被忽略。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    noPrintSelector: '.no-print' // 忽略具有 no-print 类的元素
  });

  // 忽略多个选择器
  new VuePrintNext({ 
    el: '#printMe', 
    noPrintSelector: ['.no-print', '.ignore-me'] 
  });
  ```

## `popTitle`

- **类型**: `string`
- **说明**: 设置打印窗口的页眉标题。如果未设置，将使用当前页面的 `<title>` 标签内容作为页眉。
- **默认值**: 当前页面的 `<title>` 标签内容
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    popTitle: '打印标题' // 自定义标题
  });
  ```

## `preview`

- **类型**: `boolean`
- **说明**: 是否启用打印预览功能。启用后，打印前会显示一个预览窗口。
- **默认值**: `false`
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true // 启用打印预览
  });
  ```

## `previewTitle`

- **类型**: `string`
- **说明**: 设置预览窗口的标题。
- **默认值**: `'打印预览'`
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true, 
    previewTitle: '预览打印' // 自定义预览标题
  });
  ```

## `previewPrintBtnLabel`

- **类型**: `string`
- **说明**: 设置预览窗口中的打印按钮标签。
- **默认值**: `'打印'`
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true, 
    previewPrintBtnLabel: '开始打印' // 自定义打印按钮标签
  });
  ```

## `extraCss`

- **类型**: `string`
- **说明**: 指定额外的 CSS 文件路径，这些 CSS 文件会被应用到打印内容中。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    extraCss: 'https://cdn.example.com/extra.css' // 添加额外的 CSS
  });
  ```

## `extraHead`

- **类型**: `string`
- **说明**: 指定额外的 `<head>` 内容，例如自定义的 `<meta>` 标签或其他 `<link>` 标签。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    extraHead: '<meta name="viewport" content="width=device-width, initial-scale=1.0">' // 添加额外的 <head> 内容
  });
  ```

## `url`

- **类型**: `string`
- **说明**: 指定要打印的网址内容。必须保证该 URL 符合同源策略。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    url: 'https://example.com/print-content' // 打印指定 URL 内容
  });
  ```

## `asyncUrl`

- **类型**: `function`
- **说明**: 一个函数，用于异步加载 URL 内容。函数接受一个 `resolve` 回调，用于提供异步加载完成后的 URL。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    asyncUrl(resolve) {
      setTimeout(() => {
        resolve('https://example.com/print-content'); // 异步加载 URL
      }, 2000);
    }
  });
  ```

## `zIndex`

- **类型**: `number`
- **说明**: 设置预览窗口的 `z-index` 值，以确保它在其他元素之上。
- **默认值**: `20002`
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    zIndex: 30000 // 设置预览窗口的 z-index
  });
  ```

## `openCallback`

- **类型**: `function`
- **说明**: 打印窗口打开时的回调函数。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    openCallback() {
      console.log('打印窗口已打开');
    }
  });
  ```

## `closeCallback`

- **类型**: `function`
- **说明**: 打印窗口关闭时的回调函数，无论用户确认还是取消打印，都会触发此回调。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    closeCallback() {
      console.log('打印窗口已关闭');
    }
  });
  ```

## `beforeOpenCallback`

- **类型**: `function`
- **说明**: 打印窗口打开前的回调函数，仅在打印预览使用时有效。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true, 
    beforeOpenCallback() {
      console.log('打印预览窗口即将打开');
    }
  });
  ```

## `previewBeforeOpenCallback`

- **类型**: `function`
- **说明**: 预览框架 `iframe` 加载前的回调函数，仅在打印预览使用时有效。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true, 
    previewBeforeOpenCallback() {
      console.log('预览框架 iframe 加载前');
    }
  });
  ```

## `previewOpenCallback`

- **类型**: `function`
- **说明**: 预览框架 `iframe` 加载完成后的回调函数，仅在打印预览使用时有效。
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true, 
    previewOpenCallback() {
      console.log('预览框架 iframe 加载完成');
    }
  });
  ```

## `paperSize`

- **类型**: `string`
- **说明**: 设置打印纸张的尺寸。可选值包括 'A0'、'A1'、'A2'、'A3'、'A4'、'A5'、'A6'、'A7'、'A8'、'Letter'、'Legal'、'Tabloid' 和 'custom'。当设置为 'custom' 时，需要配合 `customSize` 参数使用。
- **默认值**: 无（不设置时保持浏览器默认打印设置）
- **注意**: 只有当明确传入了 `paperSize`、`orientation` 或 `customSize` 参数时，vue-print-next 才会强制应用页面尺寸设置。如果没有传入这些参数，将保持浏览器默认的打印设置控制。
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    paperSize: 'A4' // 设置纸张尺寸为 A4
  });
  ```

## `orientation`

- **类型**: `string`
- **说明**: 设置打印纸张的方向。可选值为 'portrait'（纵向）或 'landscape'（横向）。
- **默认值**: 无（不设置时保持浏览器默认打印设置）
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    orientation: 'landscape' // 设置纸张方向为横向
  });
  ```

## `customSize`

- **类型**: `object`
- **说明**: 设置自定义纸张尺寸，仅当 `paperSize` 设置为 'custom' 时生效。对象包含以下属性：
  - `width`: 宽度值（字符串）
  - `height`: 高度值（字符串）
  - `unit`: 单位，可选值为 'mm'、'cm'、'in' 或 'px'（可选，默认为 'mm'）
- **默认值**: 无
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    paperSize: 'custom',
    customSize: {
      width: '100',
      height: '150',
      unit: 'mm'
    }
  });
  ```

## `darkMode`

- **类型**: `boolean`
- **说明**: 是否默认使用深色模式显示预览界面。
- **默认值**: `false`
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true,
    darkMode: true // 启用深色模式
  });
  ```

## `windowMode`

- **类型**: `boolean`
- **说明**: 是否默认使用弹窗模式（非全屏）显示预览界面。
- **默认值**: `false`
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true,
    windowMode: true // 使用弹窗模式
  });
  ```

## `defaultScale`

- **类型**: `number`
- **说明**: 设置预览界面的默认缩放比例。
- **默认值**: `1`
- **示例**:

  ```typescript
  new VuePrintNext({ 
    el: '#printMe', 
    preview: true,
    defaultScale: 0.8 // 设置默认缩放比例为 80%
  });
  ```
