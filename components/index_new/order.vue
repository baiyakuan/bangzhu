<template>
	<view class="order">
		<view style="height: 54rpx;display: flex;align-items: center;color: #fff;padding: 0 40rpx;box-sizing: border-box;">
			<view>{{ order.brandNumber }}</view>
			<view style="margin-left: auto;">停车中：{{ stopTimeStr }}</view>
		</view>
		<view class="parking" style="margin: 0;">
			<view class="parking_top" @click.stop="nav2parkLotDetail">
				<image :src="Imgpath + order.imgList[0]" style="width: 160rpx;height: 124rpx;border-radius: 20rpx;flex-shrink: 0;"></image>
				<view style="flex: 1;height: 120rpx;display: flex;flex-direction: column;justify-content: space-between;margin-left: 24rpx;">
					<view class="name">{{ order.parkingName }}</view>
					<view class="address">{{ order.address }}</view>
					<view style="display: flex;align-items: center;">
						<view class="charge">{{ order.charge }}元/时</view>
						<view v-if="order.cardTypeStr" style="display: flex;align-items: center;">
							<view v-if="order.cardTypeStr.indexOf('1') > -1" class="rent">周租</view>
							<view v-if="order.cardTypeStr.indexOf('2') > -1" class="rent">月租</view>
							<view v-if="order.cardTypeStr.indexOf('3') > -1" class="rent">年租</view>
						</view>
					</view>
				</view>
			</view>
			<view class="parking_bottom">
				<view style="display: flex;align-items: center;font-size: 24rpx;font-weight: bold;">
					停车费用：
					<view style="color: #f33535;margin-left: 10rpx;font-size: 30rpx;">{{ order.money }}元</view>
				</view>

				<view v-if="noPlateCar" class="tip" style="margin-left: auto;">无牌车不能无感支付</view>

				<view v-if="!noPlateCar && order.nofeelPay == 0 && order.money > wallet" class="button" style="margin-left: auto;" @click="recharge(order.brandNumber)">
					充值体验无感支付
					<view class="gift gift1" v-if="tip1">{{ tip1 }}</view>
				</view>

				<view v-if="!noPlateCar && order.nofeelPay == 1 && order.money > wallet" style="display: flex;align-items: center;margin-left: auto;">
					<!-- <view class="tip">无感支付余额不足</view> -->
					<view class="button" style="margin-left: 20rpx;" @click="recharge('')">
						立刻充值
						<view class="gift gift2" v-if="tip2">{{ tip2 }}</view>
					</view>
				</view>

				<view v-if="!noPlateCar && order.nofeelPay == 0 && !(order.money > wallet)" class="button" style="margin-left: auto;" @click="setNoFeelingToPay">开通无感支付</view>

				<view v-if="!noPlateCar && order.nofeelPay == 1 && !(order.money > wallet)" class="tip" style="margin-left: auto;">已开通无感支付</view>
			</view>
		</view>
	</view>
</template>

<script>
import { setNoFeelingToPay } from '@/api';

export default {
	props: {
		wallet: {
			default: 0
		},
		order: {
			default: {}
		}
	},
	data() {
		return {
			stopTime: 0,
			stopTimeStr: '',
			tip1: '',
			tip2: '',
			interval: null
		};
	},
	computed: {
		Imgpath() {
			return this.$store.state.Imgpath;
		},
		openInductivePay() {
			return this.$store.getters.openInductivePay;
		},
		noPlateCar() {
			return this.order.brandNumber.slice(0, 1) == '无';
		}
	},
	watch: {
		stopTime() {
			if (this.stopTime) {
				this.stopTimeStr = this.timeToStr();
			}
		},
		openInductivePay: {
			handler() {
				this.openInductivePay.forEach(item => {
					if (item.appUsePosition == 2) {
						this.tip1 = item.promptText;
					} else if (item.appUsePosition == 3) {
						this.tip2 = item.promptText;
					}
				});
			},
			deep: true
		},
		order() {
			this.getStopTime();
		}
	},
	mounted() {
		this.getStopTime();
		if (this.openInductivePay) {
			this.openInductivePay.forEach(item => {
				if (item.appUsePosition == 2) {
					this.tip1 = item.promptText;
				} else if (item.appUsePosition == 3) {
					this.tip2 = item.promptText;
				}
			});
		}
	},
	methods: {
		// 去停车场详情
		nav2parkLotDetail() {
			uni.navigateTo({
				url: `/basic/parkLotDetail/index?id=${this.order.parkingId}&islogin=${this.isLogin}`
			});
		},
		getStopTime() {
			const that = this;
			if (!this.isNull(this.order.inTime) && !this.isNull(this.order.currentTime)) {
				const startTimeStr = this.order.inTime.replace(/\.|\-/g, '/');
				const nowTimeStr = this.order.currentTime.replace(/\.|\-/g, '/');
				const startTime = new Date(startTimeStr).getTime();
				const nowTime = new Date(nowTimeStr).getTime();
				this.stopTime = parseInt((nowTime - startTime) / 1000);
				if (this.interval) {
					clearInterval(this.interval);
				}
				this.interval = setInterval(() => {
					that.stopTime++;
				}, 1000);
			} else {
				setTimeout(() => {
					that.getStopTime();
				}, 1000);
			}
		},
		timeToStr() {
			let hour = parseInt(this.stopTime / 3600);
			let min = parseInt((this.stopTime % 3600) / 60);
			let s = (this.stopTime % 3600) % 60;
			hour = hour < 10 ? '0' + hour : hour;
			min = min < 10 ? '0' + min : min;
			s = s < 10 ? '0' + s : s;
			return hour + ':' + min + ':' + s;
		},
		recharge(brandNumber) {
			this.$emit('openRecharge', { brandNumber: brandNumber });
		},
		// 开通无感支付
		async setNoFeelingToPay() {
			const that = this;
			const { data } = await setNoFeelingToPay({
				brandId: that.order.brandId,
				status: 1,
				type: 1,
				istrue: true
			});
			if (data.code == 1) {
				setTimeout(() => {
					uni.showToast({
						title: '开通成功',
						icon: 'success'
					});
				}, 500);
				this.$store.dispatch('getHomeOrderList', { istrue: true });
			} else {
				setTimeout(() => {
					uni.showToast({
						title: '开通失败',
						icon: 'none'
					});
				}, 500);
			}
		},
		isNull(value) {
			if (value === null || value === undefined || value === '') {
				return true;
			}
			return false;
		}
	}
};
</script>

<style lang="scss" scoped>
.order {
	width: 710rpx;
	box-sizing: border-box;
	background-image: linear-gradient(to right, #29c6d8, #72d9e5);
	margin: 0 20rpx;
	border-radius: 40rpx;
}
.parking {
	background-color: #fff;
	margin: 0 20rpx;
	border-radius: 40rpx;
	box-sizing: border-box;
	.parking_top {
		height: 184rpx;
		display: flex;
		align-items: center;
		padding: 0 40rpx;
		padding-top: 10rpx;
		box-sizing: border-box;
		.address {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 22rpx;
			width: 446rpx;
			color: #7a818d;
			font-weight: 400;
			font-family: PingFang SC;
		}
		.name {
			font-size: 30rpx;
			font-weight: bold;
			color: #1b1912;
			font-family: PingFang SC;
		}
		.distance {
			margin-left: auto;
			color: #f00;
			font-size: 24rpx;
			border: 2rpx solid #f00;
			border-radius: 20rpx;
			padding: 0 20rpx;
		}
		.charge {
			font-size: 22rpx;
			font-weight: 400;
			color: #f33535;
			font-family: PingFang SC;
		}
		.rent {
			width: 60rpx;
			height: 30rpx;
			line-height: 30rpx;
			border-radius: 8rpx;
			margin-left: 20rpx;
			background-color: #f33535;
			color: #fff;
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: bold;
			text-align: center;
		}
	}
	.parking_bottom {
		height: 94rpx;
		display: flex;
		align-items: center;
		background-color: #f0f0f0;
		border-radius: 0 0 40rpx 40rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		position: relative;
		.button {
			height: 60rpx;
			line-height: 60rpx;
			border-radius: 20rpx;
			box-sizing: border-box;
			padding: 0 40rpx;
			font-size: 22rpx;
			font-weight: bold;
			color: #fff;
			font-family: PingFang SC;
			background-color: #1b1912;
		}
		.gift {
			position: absolute;
			top: -40rpx;
			right: 40rpx;
			font-size: 20rpx;
			font-weight: bold;
			color: #1b1912;
			background-color: #ffcc33;
			height: 40rpx;
			line-height: 40rpx;
			padding: 0 40rpx;
			border-radius: 10rpx;
		}
		.gift1::after {
			position: absolute;
			top: 40rpx;
			left: 20rpx;
			content: '';
			width: 0;
			height: 0;
			border-left: 8rpx solid transparent;
			border-right: 8rpx solid transparent;
			border-bottom: none;
			border-top: 14rpx solid #ffcc33;
		}
		.gift2::after {
			position: absolute;
			top: 40rpx;
			left: 80rpx;
			content: '';
			width: 0;
			height: 0;
			border-left: 8rpx solid transparent;
			border-right: 8rpx solid transparent;
			border-bottom: none;
			border-top: 14rpx solid #ffcc33;
		}
		.tip {
			font-size: 20rpx;
			color: #4a5361;
			font-weight: bold;
			font-family: PingFang SC;
		}
	}
}
</style>
