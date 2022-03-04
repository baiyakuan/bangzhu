<template>
	<view class="order">
		<view style="height: 54rpx;display: flex;align-items: center;color: #fff;padding: 0 40rpx;box-sizing: border-box;">
			<view>{{ order.brandNumber }}</view>
			<view style="margin-left: auto;">待支付：{{ order.awaitPayNum }}笔</view>
		</view>
		<view class="parking" style="margin: 0;">
			<image v-if="ad && ad.icon" mode="aspectFill" :src="Imgpath + ad.icon" @click="intent(ad.miniprogramUrl)"></image>
			<image v-else mode="aspectFill" :src="staticImg + 'static/image/ad.png'" @click="intent('/personal/carRental/index')"></image>
			<view class="parking_bottom">
				<view class="label">
					停车费用：
					<view class="money">{{ order.awaitPayMoney }}元</view>
				</view>
				<view class="pay" @click="goOrderPage">
					立即支付
					<image :src="staticImg + 'static/img/arrow_right.png'"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		order: {              
			default: {}
		}
	},
	data() {
		return {};
	},
	computed: {
		Imgpath() {
			return this.$store.state.Imgpath;
		},
		staticImg() {
			return this.$store.state.staticImg;
		},
		ad() {
			return this.$store.getters.awaitPayOrderInfo;
		}
	},
	methods: {
		openPay() {
			this.$emit('pay', this.order);
		},
		goOrderPage() {
			uni.navigateTo({
				url: '/personal/order/index?tabName=停车&statusIndex=0'
			});
		},
		intent(url) {
			if (!url) {
				return;
			}
			if (url[0] == '/') {
				uni.navigateTo({
					url
				});
			} else {
				uni.navigateTo({
					url: '/pages/web_view/index?url=' + encodeURIComponent(url)
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.order {
	width: 710rpx;
	box-sizing: border-box;
	background-image: linear-gradient(to right, #ff4610, #ffab92);
	margin: 0 20rpx;
	border-radius: 40rpx;
}
.parking {
	background-color: #fff;
	margin: 0 20rpx;
	border-radius: 40rpx;
	box-sizing: border-box;
	font-size: 0;
	image {
		width: 100%;
		height: 184rpx;
		border-radius: 40rpx 40rpx 0 0;
	}
	.parking_bottom {
		height: 94rpx;
		display: flex;
		align-items: center;
		background-color: #f0f0f0;
		border-radius: 0 0 40rpx 40rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		.label {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			font-weight: bold;
			font-family: PingFang SC;
			color: #1b1912;
		}
		.money {
			color: #f33535;
			margin-left: 20rpx;
			font-size: 30rpx;
			font-family: PingFang SC Bold;
			font-weight: bold;
		}
		.pay {
			display: flex;
			align-items: center;
			background-color: #f33535;
			height: 60rpx;
			line-height: 60rpx;
			padding: 0 30rpx;
			border-radius: 20rpx;
			margin-left: auto;
			color: #fff;
			font-size: 22rpx;
			font-family: PingFang SC;
			font-weight: bold;
			image {
				width: 22rpx;
				height: 20rpx;
				margin-left: 14rpx;
			}
		}
	}
}
</style>
