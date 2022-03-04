<template>
	<div class="pd40-x pdb50">
		<div class="pd50-y rgb27 ft50 ftweight">账单详情</div>
		<div class="mgb50 fi storeInfo">
			<div class="Logo mgr60"></div>
			<div class="store">
				<div class="name ft36 ftweight rgb27 mgb15">帮驻</div>
				<div class="ft24 rgba74">BANGZHU</div>
			</div>
		</div>
		<div class="orderInfoBox pd30-x">
			<div class="ft26 rgb27 pd50-y">停车消费：</div>
			<div class="pdb50 fs border">
				<div class="totalprice ftweight" style="width: 40%;">
					<view class="ft26 rgb27 mgt15">￥</view>
					<view class="ft60" style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ orderInfo.payMoney }}</view>
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
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">支付方式</div>
					<div class="ft24 rgb74">{{ orderInfo.payType }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">流水号</div>
					<div class="ft24 rgb74">{{ orderInfo.orderOutTradeNo }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">消费时间：</div>
					<div class="ft24 rgb74">{{ orderInfo.payTime }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">车场名称：</div>
					<div class="ft24 rgb74">{{ orderInfo.parkingName }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">车场地址：</div>
					<div class="ft24 rgb74" style="width: 60%;white-space: nowrap;overflow: hidden;text-overflow: ellipsis; text-align: right;">{{ orderInfo.parkingAddress }}</div>
				</div>
				<div class="mgb20 fbt">
					<div class="ftweight ft26 rgb27 title">停车时间：</div>
					<div class="ft24 rgb74">{{ orderInfo.comeTime }}</div>
				</div>
				<div class="fbt">
					<div class="ftweight ft26 rgb27 title">结束时间：</div>
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
				that.orderInfo.payMoney = data.obj.payMoney
					? (data.obj.payMoney * 1).toFixed(2)
					: (data.obj.totalMoney - data.obj.plusDeductMoney - data.obj.deductMoney).toFixed(2);
				that.orderInfo.totalMoney = (data.obj.totalMoney * 1).toFixed(2);
				that.orderInfo.plusDeductMoney = (data.obj.plusDeductMoney * 1).toFixed(2);
				that.orderInfo.deductMoney = (data.obj.deductMoney * 1).toFixed(2);
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
