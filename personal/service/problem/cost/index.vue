<template>
	<web-view :src="webUrl + '/renrenbang/protocol.html?type=4'"></web-view>
	<!-- <web-view :src="'https://www.renren-bang.com/renrenbang/protocol.html?type=4'"></web-view> -->
</template>

<script>
import { getNewPortInfo } from '@/api';
import store from '@/store';
export default {
	data() {
		return {
			content: ''
		};
	},
	computed: {
		webUrl() {
			return store.state.webUrl;
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
		getNewPortInfo({
			type: 4
		}).then(res => {
			this.content = res.data.obj.newPort.content;
		});
	}
};
</script>

<style>
page {
	background-color: #fff;
}
</style>
