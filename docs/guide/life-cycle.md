# 生命周期

`VuePrintNext` 提供了一系列的生命周期钩子函数，允许用户在打印过程的不同阶段执行自定义逻辑。通过这些钩子函数，你可以在打开打印窗口、关闭窗口以及打印预览的各个环节进行自定义操作。以下是生命周期钩子的详细介绍和使用示例：

## `openCallback`

- **说明**：在打印窗口打开时触发的回调函数。
- **用途**：可以在打印窗口打开时执行某些初始化操作或记录日志。

### 示例：

```javascript
const printObj = {
  el: '#printMe',
  openCallback() {
    console.log('打印窗口已经打开');
  }
}
```

当打印窗口打开时，控制台会输出 “打印窗口已经打开”。


## `closeCallback`

- **说明**：在打印窗口关闭时触发的回调函数。
- **用途**：在用户打印或取消打印后，执行清理操作或其他业务逻辑。无论用户是选择打印还是取消打印，该回调都会被触发。

### 示例：

```javascript
const printObj = {
  el: '#printMe',
  closeCallback() {
    console.log('打印窗口已经关闭');
  }
}
```

当打印窗口关闭时，控制台会输出 “打印窗口已经关闭”。


## `beforeOpenCallback`

- **说明**：在打印窗口打开之前触发的回调函数，主要用于打印预览时使用。
- **用途**：在打开预览窗口前执行一些准备工作，比如修改内容或调整样式。

### 示例：

```javascript
const printObj = {
  el: '#printMe',
  preview: true,
  beforeOpenCallback() {
    console.log('打印预览窗口即将打开');
  }
}
```

当打印预览窗口准备打开时，控制台会输出 “打印预览窗口即将打开”。

## `previewOpenCallback`

- **说明**：打印预览的 iframe 加载完成后触发的回调函数。
- **用途**：可以在打印预览内容加载完毕后执行进一步的操作，比如自动调整预览窗口中的内容，或者根据需要添加自定义样式。

### 示例：

```javascript
const printObj = {
  el: '#printMe',
  preview: true,
  previewOpenCallback() {
    console.log('打印预览窗口已加载完成');
  }
}
```

当打印预览窗口加载完成时，控制台会输出 “打印预览窗口已加载完成”。


## `previewBeforeOpenCallback`

- **说明**：在预览框架的 iframe 加载前触发的回调。
- **用途**：允许在 iframe 加载之前执行某些操作，如修改 DOM 结构或添加自定义的 CSS 样式。

### 示例：

```javascript
const printObj = {
  el: '#printMe',
  preview: true,
  previewBeforeOpenCallback() {
    console.log('打印预览 iframe 即将加载');
  }
}
```

当打印预览的 iframe 即将加载时，控制台会输出 “打印预览 iframe 即将加载”。

## 使用钩子的场景

1. **打印前进行数据处理**：通过 `beforeOpenCallback`，你可以在打印前调整内容、修改样式或进行必要的 DOM 操作。
2. **用户交互的记录**：通过 `openCallback` 和 `closeCallback`，你可以监控用户的打印行为，并在合适的时机记录用户操作或执行清理工作。
3. **复杂打印需求**：使用 `previewOpenCallback` 来自定义打印预览行为，帮助更复杂的业务场景提供更好的打印体验。

---

这些生命周期钩子为 `VuePrintNext` 插件提供了灵活性，用户可以根据自己的业务需求，在不同的阶段执行自定义操作。通过这些钩子，你可以更加灵活地控制打印流程，确保打印输出符合预期。
