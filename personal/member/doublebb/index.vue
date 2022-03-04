<template>
	<div class="">
		<div class="pd40-x bgw">
			<div class="ft50 ftweight pdt20">帮贝奖励</div>
			<div class="fi mgt50">
				<img class="icon" :src="staticImg + 'static/img/gold.png'" />
				<div class="ft34 ftweight pdl30">{{ totalBangBeiCount }}</div>
			</div>
			<div class="ft28 gray-a mgt20 pdb40">累计多获得</div>
		</div>
		<div class="pd50-y mg40-x bteW fs" v-for="item in list" :key="item">
			<div>
				<div class="ft26">{{ item.words }}</div>
				<div class="mgt20 ft20 gray-a">{{ item.time }}</div>
			</div>
			<div class="fst">
				<view class="ft30">+{{ item.commomNum }}</view>
				<view class="ft30 gold-word pdl20">+{{ item.addNum }}</view>
				<view class="pdl10 gold-word ft20">VIP</view>
			</div>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import { getBangBeiByUserPlus } from '@/api';
export default {
	data() {
		return {
			pageIndex: 1,
			lastpage: false,
			totalBangBeiCount: 0,
			list: []
		};
	},
	computed:{
		staticImg() { return this.$store.state.staticImg } ,
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
		//wx.stopPullDownRefresh();
	},

	// 上拉加载，拉到底部触发
	async onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadmore();
	},
	methods: {
		//下拉刷新事件
		async loadremove() {
			let that = this;
			that.pageIndex = 1;
			that.lastpage = false;
			that.list = [];
			const { data } = await getBangBeiByUserPlus({
				pageIndex: that.pageIndex
			});
			if (data.code == '1') {
				that.totalBangBeiCount = data.obj.totalBangBeiCount;
				for (var i = 0; i < data.obj.bangBeiList.length; i++) {
					data.obj.bangBeiList[i].commomNum = data.obj.bangBeiList[i].number - data.obj.bangBeiList[i].addNum;
					that.list.push(data.obj.bangBeiList[i]);
				}
			}
			wx.stopPullDownRefresh();
		},
		//上拉加载事件
		async loadmore() {
			let that = this;
			if (!that.lastpage) {
				that.pageIndex += 1;
				const { data } = await getBangBeiByUserPlus({
					pageIndex: that.pageIndex
				});
				if (data.code == '1') {
					if (data.obj.bangBeiList.length) {
						for (var i = 0; i < data.obj.bangBeiList.length; i++) {
							data.obj.bangBeiList[i].commomNum = data.obj.bangBeiList[i].number - data.obj.bangBeiList[i].addNum;
							that.list.push(data.obj.bangBeiList[i]);
						}
					} else {
						that.lastpage = true;
					}
				}
			}
		}
	},
	onShow() {
		this.loadremove();
	}
};
</script>

<style lang="stylus">
page
	background: #F6F8FB;
.icon
	width 40rpx
	height 40rpx
.bteW
	border-bottom 1rpx solid #ffffff;
</style>
