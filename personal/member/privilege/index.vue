<template>
	<div class="">
		<div class="pd40-x bte pdb50"><div class="ft50 ftweight pdt20">会员特权</div></div>
		<div class="d_swiper pdt30">
			<swiper
				class="d_swiper"
				:indicator-color="indicatorColor"
				:indicator-active-color="indicatorActiveColor"
				:indicator-dots="indicatorDots"
				:previous-margin="previous"
				:next-margin="previous"
				:current="current"
				:autoplay="autoplay"
				:interval="interval"
				:duration="duration"
				:circular="circular"
				@change="swiperChange"
			>
				<block v-for="item in list" :key="item">
					<swiper-item><image :src="item.imgUrls" class="slide-image" :class="current == index ? 'active' : ''" /></swiper-item>
				</block>
			</swiper>
			<!-- 指示点 -->
			<div class="fcx dots"><div v-for="(item, index) in list" :key="index" class="dot" :class="index == current ? 'active' : ''"></div></div>
		</div>
		<div class="bgw footer" @click="purchase">
			<div class="btn fcy ft34 white-t" v-if="isplusmember == 1">立即续费</div>
			<div class="btn fcy ft34 white-t" v-else>立即开通</div>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import {} from '@/api';
export default {
	data() {
		return {
			indicatorColor: 'rgba(239,244,248,1)',
			indicatorActiveColor: 'rgba(198,158,104,1)',
			indicatorDots: false,
			autoplay: true,
			interval: 500000,
			duration: 1000,
			circular: true,
			previous: '60rpx',
			list: [],
			current: 0
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
		geturl() {
			for (var i = 1; i < 9; i++) {
				this.list.push({
					// imgUrls: store.state.urlImg + 'privilege-v2-' + i + '.png?t=3',
					imgUrls: store.state.staticImg + 'static/img/' + 'privilege-v2-' + i + '.png?t=5',
					id: i - 1
				});
			}
			// console.log(this.list)
		},
		swiperChange(e) {
			const that = this;
			this.current = e.mp.detail.current;
		},
		//购买会员
		purchase() {
			wx.navigateTo({
				url: `/personal/member/purchase/index`
			});
		}
	},
	computed: {
		isplusmember() {
			return store.state.memberuserInfo.isplusmember;
		}
	},
	onLoad() {
		let that = this;
		that.geturl();
		that.current = that.$root.$mp.query.page;
	},
	onUnload() {},
	onShow() {
		// #ifdef  MP-ALIPAY
		this.previous = 30 + 'rpx';
		// #endif
	}
};
</script>

<style lang="stylus">
page
	background-color #fff
.slide-image
	width 100%
	height 810rpx
	transform scale(0.9)
.d_swiper
	height 880rpx
.footer
	position fixed
	bottom 0rpx
	width 100%
.btn
	height 100rpx
	width 100%
	background-color #e7c78c
.active
	transform scale(1)
	transition all 0.2s ease-in 0s
	z-index 20
.dots
	width 100%
	height 16rpx
	.dot
		width 16rpx
		height 16rpx
		margin 0 8rpx
		border-radius 50%
		background rgba(239, 244, 248, 1)
		&.active
			background rgba(198, 158, 104, 1)
</style>
