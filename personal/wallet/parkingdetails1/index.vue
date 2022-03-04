<template>
	<div class="pd40-x pdb50">
		<div class="pd50-y rgb27 ft50 ftweight">账单详情</div>
		<div class="mgb50 fi storeInfo">
			<div class="Logo mgr60"></div>
			<div class="store">
				<div class="name ft36 ftweight rgb27 mgb15 ">帮驻</div>
				<div class="ft24 rgb74">BANGZHU</div>
			</div>
		</div>
		<div class="orderInfoBox pd30-x">
			<div class="ft26 rgb27 pd50-y">停车消费</div>
			<div class="pdb50 fs border">
				<div class="totalprice">
					<view class="ft26 rgb27">￥</view>
					<view class="ft70">{{ orderInfo.payMoney }}</view>
				</div>
				<div class="fcx">
					<div class="fcy mgr50">
						<view class="ft30 rgb27">{{ orderInfo.totalMoney }}</view>
						<view class="ft20 rgba74">订单金额</view>
					</div>
					<div class="fcy mgr50">
						<view class="ft30 rgb27">-{{ orderInfo.plusDeductMoney }}</view>
						<view class="ft20 rgba74">PLUS折扣</view>
					</div>
					<div class="fcy">
						<view class="ft30 rgb27">-{{ orderInfo.deductMoney }}</view>
						<view class="ft20 rgba74">优惠抵扣</view>
					</div>
				</div>
			</div>
			<!-- 支付信息 -->
			<div class="payInfo pd50-y">
				<div class="mgb20 fs">
					<div class=" ft24 rgba74">支付方式</div>
					<div class="ft24 rgb74">{{ orderInfo.payType }}</div>
				</div>
				<div class="mgb20 fs">
					<div class=" ft24 rgba74">流水号</div>
					<div class="ft24 rgb74">{{ orderInfo.orderOutTradeNo }}</div>
				</div>
				<div class="mgb20 fs">
					<div class=" ft24 rgba74">消费时间</div>
					<div class="ft24 rgb74">{{ orderInfo.payTime }}</div>
				</div>
				<div class="mgb20 fs">
					<div class="ft24 rgba74">车场名称</div>
					<div class="ft24 rgb74">{{ orderInfo.parkingName }}</div>
				</div>
				<div class="mgb20 fs">
					<div class=" ft24 rgba74">车场地址</div>
					<div class="ft24 rgb74">{{ orderInfo.parkingAddress }}</div>
				</div>
				<div class="mgb20 fs">
					<div class=" ft24 rgba74">停车时间</div>
					<div class="ft24 rgb74">{{ orderInfo.comeTime }}</div>
				</div>
				<div class="fs">
					<div class=" ft24 rgba74">结束时间</div>
					<div class="ft24 rgb74">{{ orderInfo.outTime }}</div>
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
			orderInfo: {}
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
		// 订单详情
		async getOrderInfo(query) {
			var that = this;
			const { data } = await orderInfo(query);
			if (data.code == 1) {
				that.orderInfo = data.obj;
				that.orderInfo.payMoney = (that.orderInfo.payMoney * 1).toFixed(2);
				that.orderInfo.totalMoney = (that.orderInfo.totalMoney * 1).toFixed(2);
				that.orderInfo.deductMoney = (that.orderInfo.deductMoney * 1).toFixed(2);
				that.orderInfo.plusDeductMoney = (that.orderInfo.plusDeductMoney * 1).toFixed(2);
			}
		},
		onShow() {
			var query = this.$root.$mp.query;
			console.log(query);
			this.getOrderInfo(query);
		}
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
	.fs
		text-align right
		.rgba74
			width 100rpx
			margin-right 40rpx
		.rgb74
			flex 1
</style>
