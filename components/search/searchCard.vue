<template>
	<view class="parking" :style="{ 'width': cardWidth + 'px' }">
		<view class="parking_top">
			<view class="fs parking_crad_info">
				<view style="display: flex;align-items: center; width: 100%; justify-content: space-between;">
					<view style="font-size: 30rpx;font-weight: bold; width: 60%;" class="text-ellipsis">{{ parking.parkingName }}</view>
					<view style="display: flex;align-items: center;" >
						<view class="redLabel">自营</view>
						<view class="redLabel">免费{{parking.freeTime}}分钟</view>
					</view>
				</view>
				<view style="font-size: 24rpx;" class="text-ellipsis">{{ parking.address }}</view>
			</view>
		</view>
		<view class="parking_bottom">
			<view style="display: flex;align-items: center;font-size: 22rpx;">
				<view class="fst">
					<text>空位</text>
					<view style="color: #f33535;margin-left: 10rpx;">{{ parking.carNum }}</view>
					<text>/{{ parking.carTotalNum }}</text>
				</view>
				<view class="fst" style="margin-left: 20rpx;">
					<text>单价</text>
					<view style="color: #f33535;margin-left: 10rpx;">{{ parking.price }}</view>
					<text style="color: #f33535;">元</text><text>/时</text>
				</view>
				
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
	props:{
		parking: {
			type: Object,
			default: {}
		}
	},
	computed:{
		staticImg() { return this.$store.state.staticImg } ,
		cardWidth() {
			const screenWidth = this.$store.state.system.screenWidth
			return screenWidth - 80 * screenWidth/750
		}
	},
	created() {
		console.log(this.parking, 'pariking')
	},
	methods:{
		nav2target(item) {
			uni.openLocation({
				latitude: parseFloat(item.latitude),
				longitude: parseFloat(item.longitude),
				name: item.title,
				address: item.address
			});
		},
	}
};
</script>

<style lang="scss" scoped>
.parking {
	border-radius: 40rpx;
	box-sizing: border-box;
	box-shadow: 0px 10px 20px rgba(27, 25, 33, 0.1);
	margin-left: 40rpx;
	.title {
		height: 54rpx;
		color: #fff;
		padding: 0 40rpx;
		line-height: 54rpx;
		font-size: 24rpx;
		font-weight: bold;
	}
	.parking_top {
		height: 154rpx;
		border-radius: 40rpx 40rpx 0 0;
		background-color: #fff;
		padding: 0 10px;

		.parking_crad_info {
			flex-direction: column;
			display: flex;
			align-items: flex-start;
			flex-direction: column;
			padding: 30rpx;
			justify-content: space-around;
			height: 100%;
			box-sizing: border-box;
		}
		.charge {
			font-size: 20rpx;
			font-weight: 400;
			color: #f33535;
			margin-right: 6rpx;
			font-family: PingFang SC;
		}
		.redLabel {
			// width: 60rpx;
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
			padding: 4rpx 10rpx;
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
