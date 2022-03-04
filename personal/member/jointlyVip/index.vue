<template>
	<div class="">
		<div class="pd40-x"><div class="ft50 ftweight pdt20">联名VIP</div></div>
		<div class="bte mgt40"></div>
		<div class="mg40-x mgt20" v-for="item in list" :key="item" @click="vipInformation(item)">
			<div class="bgImg" style="position:relative;">
				<img class="bgImg" style="position:absolute;" :src="item.cardimg" />
				<div class="ft50 bgImg pd40-x" style="position:absolute;">
					<div class="mgt40 fi">
						<img class="logo" :src="item.logo" />
						<div class="mgl20 ft30 white-t">{{ item.cardname }}</div>
					</div>
					<div class="fe pdr80 mgt130">
						<div class="ft30 white-t">NO: {{ item.cardnumber }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import { vipCard } from '@/api';
export default {
	data() {
		return {
			pageIndex: 1,
			list: [],
			lastpage: false
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
	async onPullDownRefresh() {
		// 停止下拉刷新
		this.loadremove();
		wx.stopPullDownRefresh();
	},

	// 上拉加载，拉到底部触发
	async onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadmore();
	},
	methods: {
		vipInformation(item) {
			wx.navigateTo({
				url: `/personal/member/jointlyVip/vipInformation/index?viprecordid=${item.viprecordid}`
			});
		},
		//下拉刷新事件
		async loadremove() {
			let that = this;
			that.pageIndex = 1;
			that.lastpage = false;
			that.list = [];
			const { data } = await vipCard({
				pageIndex: that.pageIndex,
				adcode: store.state.address.adcode.substr(0, 4) + '00'
			});
			if (data.code == '1') {
				that.list = data.obj.vipCards;
				for (var i = 0; i < that.list.vipCards.length; i++) {
					that.list[i].cardnumber = that.list[i].cardnumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ');
					that.list.push(data.obj.vipCards[i]);
				}
			}
			wx.stopPullDownRefresh();
		},
		//上拉加载事件
		async loadmore() {
			let that = this;
			if (!that.lastpage) {
				that.pageIndex += 1;
				const { data } = await vipCard({
					pageIndex: that.pageIndex,
					adcode: store.state.address.adcode.substr(0, 4) + '00'
				});
				if (data.code == '1') {
					if (data.obj.vipCards.length) {
						for (var i = 0; i < data.obj.vipCards.length; i++) {
							that.list.push(data.obj.vipCards[i]);
						}
					} else {
						that.lastpage = true;
					}
				}
			}
		}
	},
	computed: {},
	onShow() {
		this.loadremove();
	}
};
</script>

<style lang="stylus">
page
	background-color #fff
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
</style>
