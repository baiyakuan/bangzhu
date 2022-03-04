<template>
	<view class="parking">
		<view class="title">{{ parking.recommendText }}</view>
		<view class="parking_top fs" @click="clickCardHandler">
			<view class="park_img"><image class="park_img" :src="parking.parkingPic"></image></view>
			<view class="fs parking_crad_info">
				<view style="display: flex;align-items: center; width: 100%;">
					<view style="font-size: 30rpx;font-weight: bold;max-width: 450rpx;" class="text-ellipsis">{{ parking.name }}</view>
					<view class="distance text-ellipsis">{{ targetText }}{{ parking.distance }}</view>
				</view>
				<view style="font-size: 24rpx;" class="text-ellipsis">{{ parking.address }}</view>
				<view style="display: flex;align-items: center;width: 100%;">
					<view class="charge">{{ parking.price }}元/时</view>
					<view v-if="parking.cardTypeStr" style="display: flex;align-items: center;">
						<view v-if="parking.cardTypeStr.indexOf('1') > -1" class="rent">周租</view>
						<view v-if="parking.cardTypeStr.indexOf('2') > -1" class="rent">月租</view>
						<view v-if="parking.cardTypeStr.indexOf('3') > -1" class="rent">年租</view>
					</view>
				</view>
			</view>
		</view>
		<view class="parking_bottom">
			<view style="display: flex;align-items: center;font-size: 22rpx;">
				空位/总车位
				<view style="color: #f33535;margin-left: 20rpx;">{{ parking.carNum }}</view>
				/{{ parking.carTotalNum }}
			</view>
			<view class="navigation" @click.stop="nav2target(parking)">
				<image :src="staticImg + 'static/image/navigation.png'" style="width: 20rpx;height: 20rpx;"></image>
				导航
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			targetText: '距目的地'
		};
	},
	props: {
		parking: {
			type: Object,
			default: {}
		},
		clickCard: {
			type: Function,
			default: () => {}
		},
		longitude: {
			type: [Number, String]
		},
		latitude: {
			type: [Number, String]
		}
	},
	computed: {
		Imgpath() {
			return this.$store.state.Imgpath;
		},
		staticImg() { return this.$store.state.staticImg } ,
		ownLongitude() {
			return this.$store.state.location.longitude;
		},
		ownLatitude() {
			return this.$store.state.location.latitude;
		}
	},
	created() {
		this.checkTargetText();
	},
	watch: {
		longitude(newValue, oldValue) {
			if (newValue != oldValue) {
				this.checkTargetText();
			}
		}
	},
	methods: {
		nav2target(item) {
			uni.openLocation({
				latitude: parseFloat(item.lat),
				longitude: parseFloat(item.lnt),
				name: item.name,
				address: item.address
			});
		},
		clickCardHandler() {
			this.$emit('clickCard', this.parking);
		},
		checkTargetText() {
			if (String(this.longitude).slice(0, 6) == String(this.ownLongitude).slice(0, 6) && String(this.latitude).slice(0, 6) == String(this.ownLatitude).slice(0, 6)) {
				this.targetText = '距您';
			} else {
				this.targetText = '距目的地';
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.parking {
	background-color: red;
	margin: 0 10rpx;
	border-radius: 40rpx;
	box-sizing: border-box;
	.title {
		height: 54rpx;
		color: #fff;
		padding: 0 40rpx;
		line-height: 54rpx;
		font-size: 24rpx;
		font-weight: bold;
	}
	.parking_top {
		height: 184rpx;
		align-items: center;
		box-sizing: border-box;
		border-radius: 40rpx 40rpx 0 0;
		background-color: #fff;
		justify-content: space-around;
		text-align: left;
		padding: 0 10px;
		.park_img {
			width: 160rpx;
			height: 124rpx;
			border-radius: 20rpx;
		}
		.parking_crad_info {
			flex-direction: column;
			width: 470rpx;
			height: 128rpx;
			display: flex;
			align-items: flex-start;
		}
		.distance {
			margin-left: auto;
			color: #f33535;
			height: 32rpx;
			line-height: 32rpx;
			font-size: 20rpx;
			border: 2rpx solid #f33535;
			border-radius: 20rpx;
			padding: 0 10rpx;
		}
		.charge {
			font-size: 20rpx;
			font-weight: 400;
			color: #f33535;
			margin-right: 6rpx;
			font-family: PingFang SC;
		}
		.rent {
			width: 60rpx;
			height: 30rpx;
			line-height: 30rpx;
			border-radius: 8rpx;
			background-color: #f33535;
			color: #fff;
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: bold;
			text-align: center;
			margin-right: 5rpx;
		}
	}
	.parking_bottom {
		height: 94rpx;
		display: flex;
		align-items: center;
		background-color: #f6f8fb;
		border-radius: 0 0 35rpx 35rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		.navigation {
			display: flex;
			align-items: center;
			background-color: #1b1912;
			height: 60rpx;
			border-radius: 20rpx;
			margin-left: auto;
			font-size: 11px;
			color: #fff;
			width: 136rpx;
			justify-content: space-evenly;
		}
	}
}
</style>
