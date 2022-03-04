<template>
	<view id="rental-content">
		<view  v-html="content"class="pd20-x pd20-y"></view>
	</view>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import { getNewPortInfo } from '@/api';

export default {
	data() {
		return {
			content: ''
		};
	},
	methods: {
		...mapActions('carRentalModule/carRentalDetailModule', ['getNewPortOfTypeAction']),
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
	onLoad(option) {
		this.getNewPortOfTypeAction(8).then((res) => {
			this.content = res.content
		})
	}
};
</script>

<style>
#rental-content {
	width: 100%;
	height: 100%;
}
</style>
