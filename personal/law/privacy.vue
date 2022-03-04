<template>
	<web-view style="width:100%;height:100%;" :src="webUrl + '/static/privacy1.html'"></web-view>
</template>

<script>
import store from '@/store';
export default {
	data() {
		return {
			content: '',
			token: null,
		};
	},
	computed: {
		webUrl() {
			// return store.state.webUrl;
			return 'https://www.zhongbanglaixi.com'
		}
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '推荐一个好用的停车工具',
			path: '/pages/index/index'
		};
	},
	// #endif
	onShow() {
	}
};
</script>

<style>
page {
	width: 100%;
	height: 100%;
}
</style>
