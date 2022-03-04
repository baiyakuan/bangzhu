<template>
	<web-view style="width:100%;height:100%;" :src="webUrl + '/renrenbang/protocol.html?type=' + type + '&t=6'"></web-view>
</template>

<script>
import { getNewPortInfo } from '@/api';
import store from '@/store';
export default {
	data() {
		return {
			content: '',
			token: null,
			type: 2
		};
	},
	computed: {
		webUrl() {
			return store.state.webUrl;
		}
	},
	methods: {
		changeTittle(type) {
			if (type == 2) {
				wx.setNavigationBarTitle({
					title: '用户协议'
				});
			} else if (type == 6) {
				wx.setNavigationBarTitle({
					title: '帮驻PLUS会员协议'
				});
			}
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
		let that = this;
		that.type = that.$root.$mp.query.type;
		that.changeTittle(that.$root.$mp.query.type);
	}
};
</script>

<style>
page {
	width: 100%;
	height: 100%;
}
</style>
