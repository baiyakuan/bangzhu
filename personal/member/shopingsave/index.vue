<template>
	<div class="">
		<div class="pd40-x bgw">
			<div class="ft50 ftweight pdt20">购物省钱</div>
			<div class="fi mgt50 pdb40">
				<div class="">
					<div class="ft34 gold-word">{{ buyDiscount }}</div>
					<div class="ft28 gold-word mgt20">共节省（元）</div>
				</div>
			</div>
		</div>
		<div class="pd50-y mg40-x bteW fs" v-for="item in list" :key="item" @click="orderList(item)">
			<div>
				<div class="ft26">{{ item.name }}</div>
				<div class="mgt20 ft20 gray-a">{{ item.ctime }}</div>
			</div>
			<div class="fst">
				<view class="ft30 pdl20 gold-word">优惠{{ item.money }}元</view>
				<img class="icon mgl20" :src="staticImg + 'static/img/member-icon-c.png'" />
			</div>
		</div>
	</div>
</template>
<script>
import store from '@/store';
import { getBuyDiscount } from '@/api';
import { duration } from '@/utils/index';
export default {
	data() {
		return {
			pageIndex: 1,
			lastpage: false,
			list: [],
			buyDiscount: "0.00"
		};
	},
	computed:{
		staticImg() { return this.$store.state.staticImg } ,
	},
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
		//点击账单
		orderList(item) {
			wx.navigateTo({
				url: '/personal/wallet/bpdetails/index?code=' + item.code + '&ctype=' + item.ctype
			});
		},
		// async getList(){
		//   var that = this;
		//   const {data} = await getBuyDiscount();
		//   if (data.code == '1') {
		//       that.buyDiscount = data.obj.buyDiscount
		//       that.list = data.obj.buyDiscountList
		//   }
		// },
		//下拉刷新事件
		async loadremove() {
			let that = this;
			this.pageIndex = 1;
			this.lastpage = false;
			that.list = [];
			const { data } = await getBuyDiscount({
				pageIndex: that.pageIndex
			});
			if (data.code == '1') {
				that.buyDiscount = (data.obj.buyDiscount * 1).toFixed(2);
				that.list = data.obj.buyDiscountList.map(item => {
					item.money = (item.money * 1).toFixed(2);
					return item;
				});
			}
			wx.stopPullDownRefresh();
		},
		//上拉加载事件
		async loadmore() {
			let that = this;
			var list = that.list;
			if (!that.lastpage) {
				that.pageIndex += 1;
				const { data } = await getBuyDiscount({
					pageIndex: that.pageIndex
				});
				if (data.code == '1') {
					if (data.obj.buyDiscountList.length) {
						for (var i = 0; i < data.obj.buyDiscountList.length; i++) {
							data.obj.buyDiscountList[i].money = (data.obj.buyDiscountList[i].money * 1).toFixed(2);
							list.push(data.obj.buyDiscountList[i]);
						}
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
	onShow() {
		// this.getList();
	}
};
</script>

<style lang="stylus">
page
	background: #F6F8FB;
.icon
	width 10rpx
	height 20rpx
.rgb243
	color rgb(243, 53, 53)
.bteW
	border-bottom 1rpx solid #ffffff;
</style>
