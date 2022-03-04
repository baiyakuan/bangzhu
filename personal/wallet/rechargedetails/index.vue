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
			<div class="ft26 rgb27 pd50-y">{{ orderInfo.payTypes == '充值' ? '充值金额：' : '购买PLUS会员：' }}</div>
			<div class="pdb50 fs border">
				<div class="totalprice ftweight">
					<view class="ft26 rgb27 mgt15">￥</view>
					<view class="ft60">{{ orderInfo.amount }}</view>
				</div>
				<div class="fcx" v-if="orderInfo.payTypes == '充值'">
					<div class="fcy mgr50">
						<view class="ft30 rgb27">{{ orderInfo.payMoney }}</view>
						<view class="ft20 rgba74">实付金额</view>
					</div>
					<div class="fcy">
						<view class="ft30 rgb27">{{ activityMmount }}</view>
						<view class="ft20 rgba74">奖励金额</view>
					</div>
				</div>
			</div>
			<!-- 支付信息 -->
			<div class="payInfo pd50-y">
				<div class="mgb20 fs">
					<div class="ftweight ft26 rgb27">支付方式</div>
					<div class="ft24 rgb74">{{ orderInfo.payType }}</div>
				</div>
				<div class="mgb20 fs">
					<div class="ftweight ft26 rgb27">流水号</div>
					<div class="ft24 rgb74">{{ orderInfo.orderOutTradeNo }}</div>
				</div>
				<div class="fs">
					<div class="ftweight ft26 rgb27">充值时间</div>
					<div class="ft24 rgb74">{{ orderInfo.payTime }}</div>
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
			orderInfo: {},
			query: {},
			activityMmount: '' //活动金额
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
				that.orderInfo.payMoney = (data.obj.payMoney * 1).toFixed(2);
				that.activityMmount = (data.obj.amount - data.obj.payMoney).toFixed(2);
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
</style>
