<!--
 * @Author: zi.yang
 * @Date: 2025-05-10 16:34:39
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-05-10 21:22:13
 * @Description: 
 * @FilePath: /vue-print-next/docs/guide/preview-tools.md
-->
# 自定义预览工具栏

从 v1.1.1 版本开始，VuePrintNext 支持自定义预览工具栏中显示的功能按钮，让用户可以根据需要控制预览界面的交互元素。

## 配置选项

通过 `previewTools` 选项，你可以控制预览工具栏中显示的功能按钮：

```js
useVuePrintNext({
  el: '#print-content',
  preview: true,
  previewTools: {
    zoom: true,      // 是否显示缩放控制
    theme: true,     // 是否显示主题切换按钮
    fullscreen: true // 是否显示全屏切换按钮
  }
});
```

你也可以通过设置 `previewTools: false` 来一次性关闭所有工具按钮：

```js
useVuePrintNext({
  el: '#print-content',
  preview: true,
  previewTools: false // 关闭所有工具按钮
});
```

## 可配置的工具按钮

| 选项 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `zoom` | `boolean` | `true` | 控制是否显示缩放控制（缩小、放大、重置按钮） |
| `theme` | `boolean` | `true` | 控制是否显示主题切换按钮（深色/浅色模式） |
| `fullscreen` | `boolean` | `true` | 控制是否显示全屏切换按钮（全屏/窗口模式） |

## 使用场景

### 简化界面

如果你希望为用户提供一个简化的预览界面，可以隐藏部分或全部工具按钮。

方式一：单独设置各个工具按钮

```js
useVuePrintNext({
  el: '#print-content',
  preview: true,
  previewTools: {
    zoom: false,
    theme: false,
    fullscreen: false
  }
});
```

方式二：一次性关闭所有工具按钮

```js
useVuePrintNext({
  el: '#print-content',
  preview: true,
  previewTools: false
});
```

### 限制用户交互

在某些场景下，你可能希望限制用户对预览内容的操作，例如禁止缩放但允许切换主题：

```js
useVuePrintNext({
  el: '#print-content',
  preview: true,
  previewTools: {
    zoom: false,    // 禁用缩放
    theme: true,    // 允许切换主题
    fullscreen: true // 允许全屏切换
  }
});
```

### 固定预览模式

如果你希望预览始终以窗口模式显示，可以禁用全屏切换按钮并设置 `windowMode: true`：

```js
useVuePrintNext({
  el: '#print-content',
  preview: true,
  windowMode: true,  // 默认使用窗口模式
  previewTools: {
    zoom: true,
    theme: true,
    fullscreen: false // 禁用全屏切换
  }
});
```

## 注意事项

- 即使隐藏了所有工具按钮，关闭按钮仍然会显示，以便用户可以关闭预览窗口。
- 如果你禁用了某个功能按钮，用户将无法通过界面切换相应的功能，但你仍然可以通过其他配置选项设置初始状态（如 `darkMode`、`windowMode`、`defaultScale` 等）。
