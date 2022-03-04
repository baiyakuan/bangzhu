<template>
	<div v-if="orderInfo">
		<div v-if="query.payTypes == '充值'">
			<div class="bgw header">
				<div class="title">充值</div>
				<div class="name">充值金额</div>
				<div class="price">
					<view>￥</view>
					{{ orderInfo.amount }}
				</div>
			</div>
			<div class="bgw item">
				<view>支付时间</view>
				<view>{{ orderInfo.payTime }}</view>
			</div>
			<div class="bgw item">
				<view>支付方式</view>
				<view>{{ orderInfo.payType }}</view>
			</div>
			<div class="bgw item">
				<view>流水号</view>
				<view>{{ orderInfo.orderOutTradeNo }}</view>
			</div>
		</div>

		<div v-if="query.payTypes == '提现'">
			<div class="bgw header">
				<div class="title">提现</div>
				<div class="name">提现金额</div>
				<div class="price">
					<view>￥</view>
					{{ orderInfo.amount }}
				</div>
			</div>
			<div class="bgw item">
				<view>提现时间</view>
				<view>{{ orderInfo.payTime }}</view>
			</div>
			<div class="bgw item">
				<view>提现银行卡号</view>
				<view>{{ orderInfo.bankNumber }}</view>
			</div>
			<div class="bgw item">
				<view>流水号</view>
				<view>{{ orderInfo.orderOutTradeNo }}</view>
			</div>
			<div class="bgw item">
				<view>提现状态</view>
				<view>{{ presentstatus }}</view>
			</div>
		</div>

		<div v-if="query.payTypes == '停车消费'">
			<div class="bgw header">
				<div class="title">停车消费</div>
				<div class="name">消费金额</div>
				<div class="price">
					<view>￥</view>
					{{ orderInfo.amount }}
				</div>
			</div>
			<div class="bgw item">
				<view>消费日期</view>
				<view>{{ orderInfo.payTime }}</view>
			</div>
			<div class="bgw item">
				<view>支付方式</view>
				<view>{{ orderInfo.payType }}</view>
			</div>
			<div class="bgw item">
				<view>流水号</view>
				<view>{{ orderInfo.orderOutTradeNo }}</view>
			</div>
			<div class="bgw item">
				<view>车场名称</view>
				<view>{{ orderInfo.parkingName }}</view>
			</div>
			<div class="bgw item">
				<view style="width:200rpx">车场地址</view>
				<view style="line-height:40rpx;">{{ orderInfo.parkingAddress }}</view>
			</div>
			<div class="bgw item">
				<view>预定时间</view>
				<view>{{ orderInfo.comeTime }}</view>
			</div>
			<div class="bgw item">
				<view>结束时间</view>
				<view>{{ orderInfo.outTime }}</view>
			</div>
		</div>

		<div v-if="query.payTypes == '购买PLUS会员'">
			<div class="bgw header">
				<div class="title">购买PLUS会员</div>
				<div class="name">消费金额</div>
				<div class="price">
					<view>￥</view>
					{{ orderInfo.amount }}
				</div>
			</div>
			<div class="bgw item">
				<view>消费日期</view>
				<view>{{ orderInfo.payTime }}</view>
			</div>
			<div class="bgw item">
				<view>支付方式</view>
				<view>{{ orderInfo.payType }}</view>
			</div>
			<div class="bgw item">
				<view>流水号</view>
				<view>{{ orderInfo.orderOutTradeNo }}</view>
			</div>
		</div>

		<div v-if="query.payTypes == '发票邮费'">
			<div class="bgw header">
				<div class="title">发票邮费</div>
				<div class="name">消费金额</div>
				<div class="price">
					<view>￥</view>
					{{ orderInfo.amount }}
				</div>
			</div>
			<div class="bgw item">
				<view>消费日期</view>
				<view>{{ orderInfo.payTime }}</view>
			</div>
			<div class="bgw item">
				<view>支付方式</view>
				<view>{{ orderInfo.payType }}</view>
			</div>
			<div class="bgw item">
				<view>流水号</view>
				<view>{{ orderInfo.orderOutTradeNo }}</view>
			</div>
		</div>

		<div v-if="query.payTypes == '兑换消费'">
			<div class="bgw header">
				<div class="title">兑换</div>
				<div class="name">消费金额</div>
				<div class="price">
					<view>￥</view>
					{{ orderInfo.amount }}
				</div>
			</div>
			<div class="bgw item">
				<view>消费日期</view>
				<view>{{ orderInfo.payTime }}</view>
			</div>
			<div class="bgw item">
				<view>支付方式</view>
				<view>{{ orderInfo.payType }}</view>
			</div>
			<div class="bgw item">
				<view>流水号</view>
				<view>{{ orderInfo.orderOutTradeNo }}</view>
			</div>
		</div>

		<div v-if="orderInfo.payTypes == '实店消费'">
			<div class="bgw header">
				<div class="title">{{ query.payTypes }}</div>
				<div class="name">消费金额</div>
				<div class="price">
					<view>￥</view>
					{{ orderInfo.amount }}
				</div>
			</div>
			<div class="bgw item">
				<view>支付方式</view>
				<view>{{ orderInfo.payType }}</view>
			</div>
			<div class="bgw item">
				<view>消费时间</view>
				<view>{{ orderInfo.payTime }}</view>
			</div>
			<div class="bgw item">
				<view>流水号</view>
				<view>{{ orderInfo.orderOutTradeNo }}</view>
			</div>
			<div class="bgw list pd30">
				<view>购物清单</view>
				<div class="list_item fright" v-for="(item, index) in orderInfo.goods" :key="index">
					<view class="fright">数量:{{ item.num }}</view>
					<view class="mg20-x fright">单价:{{ item.price }}</view>
					<view class="list_itemName fright">{{ item.goodsName }}</view>
				</div>
				<!-- <view>{{orderInfo.orderOutTradeNo}}</view> -->
			</div>
		</div>
	</div>
</template>

<script>
import { orderInfo } from '@/api';
export default {
	data() {
		return {
			orderInfo: null,
			query: {
				payTypes: '',
				orderId: ''
			},
			presentstatus: ''
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
			var query = this.$root.$mp.query;
			if (this.$root.$mp.query.orderId.indexOf('MVP') !== -1 || this.$root.$mp.query.orderId.indexOf('BZZF') !== -1) {
				query = {
					orderId: this.$root.$mp.query.orderId,
					payTypes: '实店支付'
				};
			}
			const { data } = await orderInfo(query);
			console.log(data);
			if (data.code === '1') {
				data.obj.amount = data.obj.amount.toFixed(2);
				this.orderInfo = data.obj;
				switch (data.obj.status) {
					case '1':
						this.presentstatus = '审核中';
						break;
					case '2':
						this.presentstatus = '通过';
						break;
					case '3':
						this.presentstatus = '驳回';
						break;
					case '6':
						this.presentstatus = '提现处理中';
					case '8':
						this.presentstatus = '已完成';
						break;
				}
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
.header
	height 330rpx
	border-bottom 1rpx solid #f4f4f4
.title
	font-size 30rpx
	height 85rpx
	line-height 85rpx
	padding-left 27rpx
	margin-bottom 30rpx
.name
	height 40rpx
	line-height 40rpx
	text-align center
	color #8a8a8a
	font-size 25rpx
.price
	height 70rpx
	line-height 70rpx
	font-size 40rpx
	text-align center
	letter-spacing 3rpx
	span
		font-size 30rpx
.item
	display flex
	align-items center
	justify-content space-between
	height 80rpx
	line-height 80rpx
	border-bottom 2rpx solid #f5f5f5
	font-size 28rpx
	padding 0 30rpx
	span:first-child
		color #8f8f8f
.list
	position relative
	font-size 28rpx
.list:after
	display block
	content ''
	clear both
.list>span
	color #8f8f8f
	position absolute
	top 50%
	transform translate(0, -50%)
.list_item
	display inline-block
	width 70%
	height 50rpx
	line-height 50rpx
.list_itemName
	display inline-block
	color #000
	width 50%
	overflow hidden
	white-space nowrap
	text-overflow ellipsis
	text-align right
</style>
