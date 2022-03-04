<template>
	<div class="pdt140">
		<div class="img_box tac">
			<img class="img" :src="staticImg + 'static/img/paySuccess.png'" alt="" />
			<div class="ft34 ftweight rgb243">支付成功</div>
		</div>
		<div class="tac mgt110">
			<div class="disib ft34 ftweight">￥</div>
			<div class="tac ft40 ftweight disib">{{ num }}</div>
		</div>
		<div class="tac mgt150">
			<div class="rgb193">收款方</div>
			<div class="ft34 ftweight mgt60">{{ merchant }}</div>
		</div>
		<div class="footer pd120-x pd20-y ft32" @click="complete">完成</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			num: '',
			merchant: ''
		};
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '推荐一个好用的停车工具',
			path: '/pages/index/index'
		};
	},
	computed:{
		staticImg() { return this.$store.state.staticImg } ,
	},
	// #endif
	onLoad() {
		// console.log(this.$root.$mp.query)
		let { num, merchant } = this.$root.$mp.query;
		this.num = num;
		this.merchant = merchant;
	},
	onUnload() {
		wx.reLaunch({
			url: '/pages/index/index'
		});
	},
	methods: {
		complete() {
			wx.reLaunch({
				url: '/pages/index/index'
			});
		}
	}
};
</script>

<style>
.img_box {
	width: 270rpx;
	height: 200rpx;
	margin: 80rpx auto 0;
}
.img {
	width: 100%;
	height: 100%;
}
.disib {
	display: inline-block;
}
.footer {
	position: fixed;
	bottom: 100rpx;
	left: 50%;
	transform: translate(-50%);
	border: 1px solid #f44a3e;
	border-radius: 20rpx;
	color: #f44a3e;
}
</style>
