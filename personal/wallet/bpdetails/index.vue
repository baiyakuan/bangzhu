<template>
	<div class="pd40-x pdb50">
		<div class="pd50-y rgb27 ft50 ftweight">账单详情</div>
		<div class="mgb50 fi storeInfo">
			<div class="Logo mgr60"></div>
			<div class="store">
				<div class="name ft36 ftweight rgb27 mgb15">帮品 · 数字大厦店</div>
				<div class="ft24 rgba74">BangGoods . A new way of life</div>
			</div>
		</div>
		<div class="orderInfoBox pd30-x">
			<div class="ft26 rgb27 pd50-y">帮品消费</div>
			<div class="pdb50 fs border">
				<div class="totalprice">
					<view class="ft26 rgb27">￥</view>
					<view class="ft70">{{ payInfo.paymoney }}</view>
				</div>
				<div class="fcx">
					<div class="fcy mgr50">
						<view class="ft30 rgb27">{{ payInfo.totalMoney }}</view>
						<view class="ft20 rgba74">订单金额</view>
					</div>
					<div class="fcy mgr50">
						<view class="ft30 rgb27">-{{ payInfo.discountMoney }}</view>
						<view class="ft20 rgba74">PLUS折扣</view>
					</div>
					<div class="fcy">
						<view class="ft30 rgb27">-{{ payInfo.couponMoney }}</view>
						<view class="ft20 rgba74">优惠抵扣</view>
					</div>
				</div>
			</div>
			<!-- 购物清单 -->
			<div class="purchaseGoodList border">
				<div class="pd50-y ftweight ft26 rgb27">购物清单</div>
				<div class="pdb10">
					<div class="fs mgb40 " v-for="(buyGood, index) in buyList" :key="index">
						<div class="name ft24 rgb74">
							<view>{{ buyGood.name }}</view>
						</div>
						<div class="price ft20 rgb74">￥{{ buyGood.price }}</div>
						<div class="num ft24 rgb86">*{{ buyGood.num }}</div>
					</div>
				</div>
			</div>
			<!-- 退货清单 -->
			<div class="returnGoodList border" v-if="refoundList.length">
				<div class="pd50-y ftweight ft26 rgb27">退货清单</div>
				<div class="pdb10">
					<div class="fs mgb40 " v-for="(refoundGood, index) in refoundList" :key="index">
						<div class="name ft24 rgb74">
							<view>{{ refoundGood.reord_goodsName }}</view>
						</div>
						<!-- <div class="price ft20 rgb74">￥{{refoundGood.reord_price}}</div> -->
						<div class="num ft24 rgb86">-{{ refoundGood.reord_number }}</div>
					</div>
				</div>
			</div>
			<!-- 支付信息 -->
			<div class="payInfo pd50-y">
				<div class="mgb20 fs">
					<div class="ftweight ft26 rgb27">支付方式</div>
					<div class="ft24 rgb74">{{ payInfo.pay_type }}</div>
				</div>
				<div class="mgb20 fs">
					<div class="ftweight ft26 rgb27">流水号</div>
					<div class="ft24 rgb74">{{ payInfo.code }}</div>
				</div>
				<div class="fs" :class="refoundList.length ? 'mgb20' : ''">
					<div class="ftweight ft26 rgb27">消费时间</div>
					<div class="ft24 rgb74">{{ payInfo.ctime }}</div>
				</div>
				<div class="fs" v-if="refoundList.length">
					<div class="ftweight ft26 rgb27">已退款</div>
					<div class="ft24 rgb74">-￥{{ refundMoney }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getBuyDiscountMsg } from '@/api';
export default {
	data() {
		return {
			orderInfo: {},
			buyDiscount: '',
			refundMoney: '',
			buyList: [],
			refoundList: [],
			payInfo: {},
			code: '',
			ctype: ''
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
			const { data } = await getBuyDiscountMsg({
				code: that.code,
				ctype: that.ctype
			});
			if (data.code === '1') {
				that.buyDiscount = (data.obj.buyDiscount * 1).toFixed(2);
				that.refundMoney = (data.obj.refundMoney * 1).toFixed(2);
				that.buyList = data.obj.buyDiscountListMsg.map(item => {
					item.price = (item.price * 1).toFixed(2);
					return item;
				});
				that.refoundList = data.obj.refundGoodsList;
				that.payInfo = data.obj.discountTypeAndNum;
				that.payInfo.totalMoney = (data.obj.discountTypeAndNum.totalMoney * 1).toFixed(2);
				that.payInfo.paymoney = (data.obj.discountTypeAndNum.paymoney * 1).toFixed(2);
				that.payInfo.discountMoney = (data.obj.discountTypeAndNum.discountMoney * 1).toFixed(2);
				that.payInfo.couponMoney = (data.obj.discountTypeAndNum.couponMoney * 1).toFixed(2);
			}
		}
	},
	onShow() {
		var query = this.$root.$mp.query;
		this.code = query.code;
		if (query.ctype == '帮品消费') {
			this.ctype = 'VPB';
		} else if (query.ctype == '餐品消费') {
			this.ctype = 'BP';
		} else {
			this.ctype = query.ctype;
		}
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
		background-image url('~@/assets/bpLogo.png')
		background-size 100% 100%
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
