<template>
	<div class="">
		<div class="pd40-x bgw">
			<div class="ft50 ftweight pdt20">停车打折</div>
			<div class="fi mgt50 pdb40">
				<div class="">
					<div class="ft34 gold-word">{{ totalOrderDisount }}</div>
					<div class="ft28 gold-word mgt20">优惠（元）</div>
				</div>
			</div>
		</div>
		<div class="pd50-y mg40-x bteW fs" v-for="item in list" :key="item" @click="orderList(item)">
			<div>
				<div class="ft26">{{ item.parkingName }}</div>
				<div class="mgt20 ft20 gray-a">{{ item.ctime }}</div>
			</div>
			<div class="fst">
				<view class="ft30 pdl20 gold-word">优惠{{ item.discountPricePlus }}元</view>
				<img class="icon mgl20" :src="staticImg + 'static/img/member-icon-c.png'" />
			</div>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import { OrderListOfUserPlus } from '@/api';
export default {
	data() {
		return {
			pageIndex: 1,
			lastpage: false,
			list: [],
			totalOrderDisount: '0.00'
		};
	},
	computed:{
		staticImg() { return store.state.staticImg } ,
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
		//点击账单
		orderList(item) {
			store.commit('set_orderIdDetail', item.orderId);
			if (item.status == 9) {
				wx.navigateTo({
					url: '/personal/order/orderDetail/index'
				});
			} else {
				wx.navigateTo({
					url: '/personal/order/orderDetail/index'
				});
			}
		},
		//下拉刷新事件
		async loadremove() {
			let that = this;
			this.pageIndex = 1;
			this.lastpage = false;
			that.list = [];
			const { data } = await OrderListOfUserPlus({
				pageIndex: that.pageIndex
			});
			if (data.code == '1') {
				that.totalOrderDisount = (data.obj.totalOrderDisount * 1).toFixed(2);
				that.list = data.obj.orderList;
			}
			wx.stopPullDownRefresh();
		},
		//上拉加载事件
		async loadmore() {
			let that = this;
			var list = that.list;
			if (!that.lastpage) {
				that.pageIndex += 1;
				const { data } = await OrderListOfUserPlus({
					pageIndex: that.pageIndex
				});
				if (data.code == '1') {
					if (data.obj.orderList.length) {
						list = list.concat(data.obj.orderList)
						that.list = list;
					} else {
						that.lastpage = true;
					}
				}
			}
		}
	},
	onLoad() {
		let that = this;
		that.loadremove();
	},
};
</script>

<style lang="stylus">
page
	background: #F6F8FB;
.icon
	width 10rpx
	height 20rpx
.bteW
	border-bottom 1rpx solid #ffffff;
</style>
