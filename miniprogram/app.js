// app.js
App({
	onLaunch: function(){
		this.globalData.curLang = wx.getStorageSync("curLang") || this.globalData.langList[0]
	},
	// 用于处理语言切换事件，将选中的语言索引（event.detail）存储到 active 变量中。
	globalData: {
		onChange(event) {
			this.setData({ active: event.detail });
		},
		curLang: {},
		langList: [
			{
				'chs': '英文',
				'lang': 'en',
				'index': 0
			},
			{
				'chs': '中文',
				'lang': 'zh',
				'index': 1
			},
			{
				'chs': '文言文',
				'lang': 'wyw',
				'index': 2
			},
			{
				'chs': '日语',
				'lang': 'jp',
				'index': 3
			},
			{
				'chs': '韩语',
				'lang': 'kor',
				'index': 4
			},
			{
				'chs': '法语',
				'lang': 'fra',
				'index': 5
			},
			{
				'chs': '西班牙语',
				'lang': 'spa',
				'index': 6
			},
			{
				'chs': '泰语',
				'lang': 'th',
				'index': 7
			},
			{
				'chs': '阿拉伯语',
				'lang': 'ara',
				'index': 8
			},
			{
				'chs': '俄语',
				'lang': 'ru',
				'index': 9
			},
			{
				'chs': '葡萄牙语',
				'lang': 'pt',
				'index': 10
			},
			{
				'chs': '德语',
				'lang': 'de',
				'index': 11
			},
			{
				'chs': '意大利语',
				'lang': 'it',
				'index': 12
			},
			{
				'chs': '希腊语',
				'lang': 'el',
				'index': 13
			},
			{
				'chs': '荷兰语',
				'lang': 'nl',
				'index': 14
			},
			{
				'chs': '波兰语',
				'lang': 'pl',
				'index': 15
			},
			{
				'chs': '保加利亚语',
				'lang': 'bul',
				'index': 16
			},
			{
				'chs': '爱沙尼亚语',
				'lang': 'est',
				'index': 17
			},
			{
				'chs': '丹麦语',
				'lang': 'dan',
				'index': 18
			},
			{
				'chs': '芬兰语',
				'lang': 'fin',
				'index': 19
			},
			{
				'chs': '捷克语',
				'lang': 'cs',
				'index': 20
			},
			{
				'chs': '罗马尼亚语',
				'lang': 'rom',
				'index': 21
			},
			{
				'chs': '斯洛文尼亚语',
				'lang': 'slo',
				'index': 22
			},
			{
				'chs': '瑞典语',
				'lang': 'swe',
				'index': 23
			},
			{
				'chs': '匈牙利语',
				'lang': 'hu',
				'index': 24
			},
			{
				'chs': '越南语',
				'lang': 'vie',
				'index': 25
			},
		]
	}
})
