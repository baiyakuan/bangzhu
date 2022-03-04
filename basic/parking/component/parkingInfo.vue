<template>
	<view style="padding:15rpx 25rpx 25rpx 25rpx ;margin: 20rpx;background-color: #fff;border-radius: 40rpx;font-size: 24rpx;" v-if="show">
		<view style="display: flex;align-items: center;" >
			<view style="font-size: 32rpx;color: #000;font-weight: bold; margin-left: 10rpx;">更多附近停车场</view>
		</view>
		<view 
			style="display: flex;align-items: center;margin-top: 20rpx;" 
			class="parking_crad" v-for="(item, index) in parkingList" :key="index" 
			@click="clickCardHandler(item)"
		>
			<view class="park_img">
				<image class="park_img" :src="item.parkingPic"></image>
			</view>
			<view class="parking_card_content">
				<view class="parking_card_title fst">
					<view style="font-size: 28rpx;font-weight: bold; max-width: 264rpx;" class="text-ellipsis">{{item.name}}</view>
					<view class="distance text-ellipsis">距目的地{{ item.distance }}</view>
				</view>
				<view class="parking_crad_info">
					<view class="parking_crad_info_view">
						<view style="font-size: 24rpx;" class="text-ellipsis">{{item.address}}</view>
						<view class="fst" style="margin-top: 5rpx;">
							<view class="charge">{{ item.price }}元/时</view>
							<view style="margin-left: 40rpx;color: #f00;border-radius: 2rpx solid #f00;border-radius: 10rpx;">{{item.carNum}}</view>
							<view style="margin-left: 10rpx;">空位</view>
						</view>
					</view>
					<view class="">
						<image :src="staticImg + 'static/img/parking-09.png'" style="width: 60rpx;height: 60rpx;" @click.stop="nav2target(item)"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
		};
	},
	props:{
		parkingList: {
			type: Array,
			default: []
		},
		clickCard: {
			type: Function,
			default: () => {}
		},
		showMorePark: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		show() {
			return this.showMorePark && this.parkingList.length > 0 
		},
		staticImg() { return this.$store.state.staticImg } ,
	},
	methods: {
		nav2target (item) {
		  uni.openLocation({
		    latitude: parseFloat(item.lat),
		    longitude: parseFloat(item.lnt),
			name:item.name,
			address:item.address
		  })
		},
		clickCardHandler(item) {
			this.$emit('clickCard', item)
		}
	}
};
</script>

<style lang="scss" scoped>
	.parking_crad {
		justify-content: space-between;
		.parking_card_content {
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			width: 460rpx;
			height: 128rpx;
		}
	}
	.parking_crad_info {
		display: flex;
		justify-content: space-between;
		.parking_crad_info_view {
			display: flex;
			align-items: center;
			flex-direction: column;
			max-width: 380rpx;
			align-items: start;
		}
	}
	.park_img{
		width: 172rpx;
		height: 116rpx;
		border-radius: 20rpx;
	}
	.charge {
		font-size: 20rpx;
		font-weight: 400;
		color: #f33535;
		margin-right: 6rpx;
		font-family: PingFang SC;
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
</style>
