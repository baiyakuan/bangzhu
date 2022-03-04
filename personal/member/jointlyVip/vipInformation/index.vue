<template>
	<div class="">
		<div class="mg40-x mgt50">
			<div class="bgImg" style="position:relative;">
				<img class="bgImg" style="position:absolute;" :src="vipcardinfo.cardimg" />
				<div class="ft50 bgImg pd40-x" style="position:absolute;">
					<div class="mgt40 fi">
						<img class="logo" :src="vipcardinfo.logo" />
						<div class="mgl20 ft30 white-t">{{ vipcardinfo.cardname }}</div>
					</div>
					<div class="fe pdr80 mgt130">
						<div class="ft30 white-t">NO: {{ vipcardinfo.cardNumber }}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="mgt60 mg40-x bgw title">
			<div class="pd40-x">
				<div class="fs">
					<div class="ft30 ftweight">有效期</div>
					<div class="ft30 ftweight">{{ vipcardinfo.validitydatebegin }} 至 {{ vipcardinfo.validitydateend }}</div>
				</div>
			</div>
		</div>
		<div class="mgt1 pdt50 mg40-x bgw content">
			<div class="pd40-x ft30 ftweight">权益说明</div>
			<div class="mgt40 pd40-x ft28 pdb50" style="line-height:50rpx;text-align:justify;">{{ vipcardinfo.explains }}</div>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import { getVipCardInfoById } from '@/api';
export default {
	data() {
		return {
			viprecordid: '',
			vipcardinfo: {}
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
	// #endif
	methods: {
		async getVipCardInfoById() {
			let that = this;
			const { data } = await getVipCardInfoById({
				viprecordid: that.viprecordid
			});
			if (data.code == 1) {
				that.vipcardinfo = data.obj.vipcardinfo;
				that.vipcardinfo.cardNumber = that.vipcardinfo.cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
			}
		}
	},
	onShow() {
		this.viprecordid = this.$root.$mp.query.viprecordid;
		this.getVipCardInfoById();
	}
};
</script>

<style lang="stylus">
page
	background-color #eff4f8
.icon
	width 44rpx
	height 44rpx
.rgb243
	color rgb(243, 53, 53)
.bgImg
	width 670rpx
	height 300rpx
.logo
	width 56rpx
	height 56rpx
.title
	height 130rpx
	clip-path polygon(
		0rpx 0,
		calc(100% - 20rpx) 0,
		100% 0rpx,
		100% calc(100% - 20rpx),
		calc(100% - 20rpx) 100%,
		20rpx 100%,
		0 calc(100% - 20rpx),
		0 20rpx
	)
	line-height 130rpx
.content
	clip-path polygon(
		20rpx 0,
		calc(100% - 20rpx) 0,
		100% 20rpx,
		100% calc(100% - 20rpx),
		calc(100% - 0rpx) 100%,
		0rpx 100%,
		0 calc(100% - 20rpx),
		0 20rpx
	)
</style>
