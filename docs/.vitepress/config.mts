import { DefaultTheme, defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
	lang: 'zh-Hans',
	base: '/vue-print-next/docs',
	title: "Vue Print Next",
	description: "Vue Print Next Document",
	lastUpdated: true,
	themeConfig: {
		logo: '/logo.png',

		// https://vitepress.dev/reference/default-theme-config
		socialLinks: [
			{icon: 'github', link: 'https://github.com/Alessandro-Pang/vue-print-next'}
		],

		editLink: {
			pattern: 'https://github.com/Alessandro-Pang/vue-print-next/edit/master/docs/:path',
			text: '在 GitHub 上编辑此页面'
		},

		footer: {
			message: '基于 MIT 许可发布',
			copyright: `版权所有 © 2024-${new Date().getFullYear()} zi.Yang`
		},

		docFooter: {
			prev: '上一页',
			next: '下一页'
		},

		outline: {
			label: '页面导航'
		},

		lastUpdated: {
			text: '最后更新于',
			formatOptions: {
				dateStyle: 'short',
				timeStyle: 'medium'
			}
		},

		returnToTopLabel: '回到顶部',
		sidebarMenuLabel: '菜单',
		darkModeSwitchLabel: '主题',
		lightModeSwitchTitle: '切换到浅色模式',
		darkModeSwitchTitle: '切换到深色模式',

		nav: [
			{text: '首页', link: '/'},
			{text: '快速上手', link: '/guide/what-is-vue-print-next'},
			{text: '在线演示', link: 'https://alexpang.cn/vue-print-next/vue3-demo'}
		],

		sidebar: {
			'/guide/': {
				base: '/guide/',
				items: sidebarGuide()
			},
		},

		search: {
			provider: 'local',
			options: {
				placeholder: '搜索文档',
				translations: {
					button: {
						buttonText: '搜索文档',
						buttonAriaLabel: '搜索文档'
					},
					modal: {
						searchBox: {
							resetButtonTitle: '清除查询条件',
							resetButtonAriaLabel: '清除查询条件',
							cancelButtonText: '取消',
							cancelButtonAriaLabel: '取消'
						},
						startScreen: {
							recentSearchesTitle: '搜索历史',
							noRecentSearchesText: '没有搜索历史',
							saveRecentSearchButtonTitle: '保存至搜索历史',
							removeRecentSearchButtonTitle: '从搜索历史中移除',
							favoriteSearchesTitle: '收藏',
							removeFavoriteSearchButtonTitle: '从收藏中移除'
						},
						errorScreen: {
							titleText: '无法获取结果',
							helpText: '你可能需要检查你的网络连接'
						},
						footer: {
							selectText: '选择',
							navigateText: '切换',
							closeText: '关闭',
							searchByText: '搜索提供者'
						},
						noResultsScreen: {
							noResultsText: '无法找到相关结果',
							suggestedQueryText: '你可以尝试查询',
							reportMissingResultsText: '你认为该查询应该有结果？',
							reportMissingResultsLinkText: '点击反馈'
						}
					}
				}
			}
		}
	},
})

function sidebarGuide(): DefaultTheme.SidebarItem[] {
	return [
		{
			text: '简介',
			collapsed: false,
			items: [
				{text: '什么是 VuePrintNext？', link: 'what-is-vue-print-next'},
				{text: '快速开始', link: 'getting-started'},
			]
		},
		{
			text: '高级',
			collapsed: false,
			items: [
				{text: '生命周期', link: 'life-cycle'},
				{text: '预览工具', link: 'preview-tools'},
				{text: '实现原理', link: 'impl-principle'},
			]
		},
		{text: 'API 参考', link: 'api'},
		{text: '常见问题', link: 'faq'},
		{text: '从 vue-print-nb 迁移', link: 'migration-from-vue-print-nb'},
	]
}

