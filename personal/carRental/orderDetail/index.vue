<template>
	<view>
		<view class="pd40-x pdb40" v-if="orderDetail.parkingName">
			<h1 class="ftweight ft50 rgb27 pd50-y">{{ pageTitle }}</h1>
			<view class="card_title fst mgb40">
				<view class="mgr40"><image :src="staticImg + 'static/img/orderIcon1.png'" class="card_icon"></image></view>
				<view>
					<view class="ftweight ft36 rgb27">
						<!-- {{orderDetail.orderStatus==1?'租赁中':orderDetail.orderStatus==2?'待生效':orderDetail.orderStatus==3?'已过期': '已退款'}} -->
						{{ orderStatusShow }}
					</view>
					<view class="ft24 rgb27">
						<!-- {{orderDetail.orderStatus==1?' In the lease':orderDetail.orderStatus==2?'To be effective':orderDetail.orderStatus==3?' Expired': 'Have a refund '}} -->
						{{ orderStatusShow2 }}
					</view>
				</view>
			</view>

			<view class="park bgw pd40 mgb40">
				<view class="fs" @click="nav2parkLotDetail">
					<view class="fst" style="width: 90%;">
						<img :src="staticImg + 'static/img/orderIconAddress.png'" style="width:24rpx;height:28rpx" />
						<view class="mgl20" style="width: 90%;">
							<view class=" ft32 ftweight  rgb27 mgb12 ellipsis">{{ orderDetail.parkingName }}</view>
							<view class=" ft20 rgb74 ellipsis">{{ orderDetail.address }}</view>
						</view>
					</view>
					<view class="icon"><image :src="staticImg + 'static/img/parking-09.png'" mode=""></image></view>
				</view>
			</view>
			<view class="park bgw pd40">
				<view class="pr">
					<view class="ft24 rgba74 mgb30">起止时间</view>
					<view class="fst mgb20">
						<img :src="staticImg + 'static/img/red2.png'" style="width:10rpx;height:10rpx;" />
						<view class="ft26  mgl50 rgb44">{{ orderDetail.validTime }}</view>
					</view>
					<view class="fst">
						<img :src="staticImg + 'static/img/red1.png'" style="width:10rpx;height:10rpx;" />
						<view class="ft26  mgl50 rgb44">{{ orderDetail.incalidTime }}</view>
					</view>
					<view class="line"></view>
				</view>
				<view class="time mgt30 fs">
					<view class="ft24 rgba74 ">选择服务</view>
					<view style="display: flex;align-items: center;">
						<view class="rent_time" v-if="orderDetail.rentType == 2">专属区车位</view>
						<view class="ft24 rgb44">{{ cardTypeShow }}</view>
						<view class="ft24 rgb44" v-if="orderDetail.rentType">——{{ orderDetail.rentType == 2 ? orderDetail.areaName : '全车场' }}</view>
					</view>
				</view>
				<view class="time mgt30 fs">
					<view class="ft24 rgba74 ">所选车位</view>
					<view class="ft24 rgb44">{{ orderDetail.lotCode ? orderDetail.lotCode : '不固定车位' }}</view>
				</view>
				<view class="time mgt30 fs">
					<view class="ft24 rgba74 ">车辆</view>
					<view class="ft24 rgb44">{{ orderDetail.carNum }}</view>
				</view>
			</view>
			<view class="park mgt40  bgw pd40 mgb40">
				<view class="fs mgb20">
					<view class="ft24 rgba74">订单金额:</view>
					<view class="ft24 rgb27">{{ orderPriceShow }}元</view>
				</view>
				<view class="fs mgb20">
					<view class="ft24 rgba74">优惠金额:</view>
					<view class="ft24 rgb86">-{{ discountAmountShow }}元</view>
				</view>
				<view class="fs">
					<view class="ft24 rgba74">实付金额:</view>
					<view class="ft24 rgb27">{{ paymentPriceShow }}元</view>
				</view>
			</view>
			<!-- 广告 -->
			<advSwiper :type="advType" v-if="advType"></advSwiper>
			<view class="park mgt40">
				<view class="fcx"><view class="payBtn ft26 ftweight" @click="renew">再次购买</view></view>
			</view>
		</view>
	</view>
</template>
<script>
import { nav2parkDetail } from '@/utils';

import { mapState, mapActions, mapMutations } from 'vuex';
import advSwiper from '@/components/adv_swiper/index.vue';
export default {
	data() {
		return {
			orderId: '',
			pageStatus: 'carRental',
			pageTitle: '租赁详情'
		};
	},
	components: {
		advSwiper
	},
	computed: {
		...mapState('carRentalModule/carRentalOrderListModule', ['orderDetail']),
		staticImg() {
			return this.$store.state.staticImg;
		},
		paymentPriceShow() {
			return (this.orderDetail.paymentPrice * 1).toFixed(2);
		},
		orderPriceShow() {
			return (this.orderDetail.orderPrice * 1).toFixed(2);
		},
		discountAmountShow() {
			return (this.orderDetail.discountAmount * 1).toFixed(2);
		},
		cardTypeShow() {
			if (this.orderDetail.cardType == 1) {
				return this.pageStatus == 'carRental' ? '周卡' : this.pageStatus == 'manageCar' ? '周费' : '周卡';
			} else if (this.orderDetail.cardType == 2) {
				return this.pageStatus == 'carRental' ? '月卡' : this.pageStatus == 'manageCar' ? '月费' : '月卡';
			} else {
				return this.pageStatus == 'carRental' ? '年卡' : this.pageStatus == 'manageCar' ? '年费' : '年卡';
			}
		},
		advType() {
			if (this.orderDetail.orderStatus == 1) {
				return 24; //租赁中
			} else if (this.orderDetail.orderStatus == 2) {
				return 23; //待生效
			} else if (this.orderDetail.orderStatus == 3) {
				return 25; //已到期
			}
		},
		orderStatusShow() {
			if (this.orderDetail.orderStatus == 1) {
				return this.pageStatus == 'carRental' ? '租赁中' : '生效中';
			} else if (this.orderDetail.orderStatus == 2) {
				return '待生效';
			} else if (this.orderDetail.orderStatus == 3) {
				return '已过期';
			} else {
				return '已退款';
			}
		},
		orderStatusShow2() {
			if (this.orderDetail.orderStatus == 1) {
				return this.pageStatus == 'carRental' ? 'In the lease' : 'In force';
			} else if (this.orderDetail.orderStatus == 2) {
				return 'To be effective';
			} else if (this.orderDetail.orderStatus == 3) {
				return 'Expired';
			} else {
				return 'Have a refund';
			}
		}
	},
	onLoad(options) {
		console.log(options);
		this.orderId = options.orderId;
		this.pageStatus = options.pageStatus;
		this.pageStatus == 'carRental' ? (this.pageTitle = '租赁详情') : (this.pageTitle = '车辆管理详情');
		this.getRentOrderDetailAction(options.orderId);
	},
	methods: {
		...mapActions('carRentalModule/carRentalOrderListModule', ['getRentOrderDetailAction', 'getSelectByRentOnline']),
		nav2parkLotDetail() {
			uni.openLocation({
				latitude: this.orderDetail.latitude,
				longitude: this.orderDetail.longitude
			});
		},
		renew() {
			let that = this;
			// 验证是否跳转续费页面
			that.getSelectByRentOnline(that.orderDetail.rentInfoCode).then(res => {
				if (res.result) {
					nav2parkDetail({ parkingCode: that.orderDetail.parkingCode, rentInfoCode: that.orderDetail.rentInfoCode, pageStatus: that.pageStatus });
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>
<style lang="stylus">
/* @import '../../../styles/color.scss' */
page
	background rgba(246, 248, 251, 1)
.red_line
	width 640rpx
	margin 0 auto
	border 2px solid red
	border-color transparent transparent red transparent
	border-top none
.card
	border-radius 20rpx
	box-shadow 4rpx 4rpx 50rpx #ccc
.park_detail
	border-top 1px dashed #ccc
	border-bottom 1px dashed #ccc
.park:after
	content ''
	display block
	clear both
.no_wrap
	white-space nowrap
	overflow hidden
	text-overflow ellipsis
.card_icon
	width 80rpx
	height 80rpx
	border-radius 20rpx
.park
	border-radius 32rpx
.nav_icon
	width 60rpx
	height 60rpx
.payBtn
	width 242rpx
	height 80rpx
	background rgba(27, 25, 33, 1)
	border-radius 20rpx
	color #FFFFFF
	text-align center
	line-height 80rpx
.ellipsis
	overflow hidden
	white-space nowrap
	text-overflow ellipsis
.line
	position absolute
	content ''
	left 3rpx
	bottom 29rpx
	width 4rpx
	height 32rpx
	background rgba(239, 244, 248, 1)
.arrowRight
	width 30rpx
.icon
	width 60rpx
	height 60rpx
	image
		width 60rpx
		height 60rpx
</style>

<style lang="scss">
.rent_time {
	width: 96rpx;
	height: 28rpx;
	line-height: 24rpx;
	border: 2rpx solid #f23434;
	border-radius: 14rpx;
	font-size: 16rpx;
	color: #f23434;
	text-align: center;
	box-sizing: border-box;
	margin-right: 20rpx;
}
</style>
