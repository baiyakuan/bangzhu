<template>
	<div class="pd40-x pdb50">
		<div class="pd50-y rgb27 ft50 ftweight">
			<text v-if="query.from == 'orderPage'">订单详情</text>
			<text v-else>账单详情</text>
		</div>
		<div class="mgb50 fi storeInfo">
			<div class="Logo mgr60"></div>
			<div class="store">
				<div class="name ft36 rgb27 mgb15 ftweight">帮驻</div>
				<div class="ft24 rgba74">BANGZHU</div>
			</div>
		</div>
		<div class="orderInfoBox pd30-x">
			<div class="ft26 rgb27 pd50-y">加油消费：</div>
			<div class="pdb50 fs border">
				<div class="totalprice ftweight" style="width: 38%;">
					<view class="ft26 rgb27 mgt15">￥</view>
					<view class="ft60" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ orderInfo.amount }}</view>
				</div>
				<div class="fcx">
					<div class="fcy mgr50">
						<view class="ft30 rgb27">{{ orderInfo.stationMoney }}</view>
						<view class="ft20 rgba74">订单金额</view>
					</div>
					<div class="fcy mgr50">
						<view class="ft30 rgb27">-0.00</view>
						<view class="ft20 rgba74">PLUS折扣</view>
					</div>
					<div class="fcy">
						<view class="ft30 rgb27">-{{ orderInfo.bzDiscountMoney }}</view>
						<view class="ft20 rgba74">优惠抵扣</view>
					</div>
				</div>
			</div>
			<!-- 支付信息 -->
			<div class="payInfo pd50-y">
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">支付方式</div>
					<div class="ft24 rgb74">{{ orderInfo.payType }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">流水号</div>
					<div class="ft24 rgb74">{{ orderInfo.orderId }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">消费时间：</div>
					<div class="ft24 rgb74">{{ orderInfo.payTime }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">加油站名称：</div>
					<div class="ft24 rgb74">{{ orderInfo.stationName }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">加油站地址：</div>
					<div class="ft24 rgb74" style="width: 60%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis; text-align: right;">{{ orderInfo.stationAddress }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">油枪号：</div>
					<div class="ft24 rgb74">{{ orderInfo.oilGun }}</div>
				</div>
				<div class="fbt">
					<div class="ftweight ft26 rgb27 title">燃油标号：</div>
					<div class="ft24 rgb74">{{ orderInfo.fuelType }}#</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { orderInfo } from '@/api';
export default {
	data() {
		return {
			orderInfo: {},
			query: {}
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
		async getData() {
			var that = this;
			const { data } = await orderInfo(that.query);
			if (data.code === '1') {
				that.orderInfo = data.obj;
				that.orderInfo.amount = (data.obj.amount * 1).toFixed(2);
				that.orderInfo.stationMoney = (data.obj.stationMoney * 1).toFixed(2);
				that.orderInfo.bzDiscountMoney = (data.obj.bzDiscountMoney * 1).toFixed(2);
			}
		}
	},
	onShow() {
		this.query = this.$root.$mp.query;
		this.getData();
	}
};
</script>

<style lang="stylus">
page
	background #ffffff
.storeInfo
	.Logo
		width 100rpx
		height 100rpx
		background-image url('~@/assets/bzLogo.png')
		background-size 100% 100%
		border-radius 20rpx
.orderInfoBox
	box-shadow 0 0 10px #eeeeee
	border-radius 10rpx
	.totalprice
		display flex
		flex-direction row
		align-items top
		justify-content center
		.ft26
			height 26rpx
			line-height 26rpx
		.ft70
			line-height 70rpx
	.border
		border-bottom 1rpx solid #eeeeee
	.purchaseGoodList, .returnGoodList
		.name
			width 350rpx
			line-height 44rpx
			span
				width 300rpx
	.payInfo
		.title
			min-width 197rpx
</style>
