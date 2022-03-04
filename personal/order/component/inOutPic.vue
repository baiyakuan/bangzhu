<template>
	<u-popup v-model="show" mode="center" transparent="true">
		<view class="main">
			<view class="content" v-if="orderInfo.id">
				<view class="item">
					<image :src="imgPath + (orderInfo.inBigPicture || orderInfo.inPicture)" mode=""></image>
					<view class="info">
						<view class="time_label">入场时间</view>
						<view class="time">{{ orderInfo.inTime }}</view>
						<view class="car_label">停放车辆</view>
						<view class="car">{{ orderInfo.carNumber }}</view>
					</view>
				</view>
				<view class="item out">
					<image v-if="orderInfo.status == 1" src="@/static/img/no_image.png" mode=""></image>
					<image v-else :src="imgPath + (orderInfo.outBigPictrue || orderInfo.outPictrue)" mode=""></image>
					<view class="info">
						<view class="time_label">出场时间</view>
						<view class="time">{{ orderInfo.status == 1 ? '-/-/- - : - : -' : orderInfo.outTime }}</view>
						<view class="car_label">{{ orderInfo.status == 1 ? '车辆状态' : '停放车辆' }}</view>
						<view class="car">{{ orderInfo.status == 1 ? '暂未离场' : orderInfo.carNumber }}</view>
					</view>
				</view>
			</view>
			<view class="close"><image @click="show = false" src="@/static/img/close.png" mode=""></image></view>
		</view>
	</u-popup>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			orderInfo: {}
		};
	},
	computed: {
		imgPath() {
			return this.$store.state.Imgpath;
		}
	},
	methods: {
		open(order) {
			this.orderInfo = order;
			this.show = true;
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 670rpx;
	height: 600rpx;
}
.content {
	height: 480rpx;
	background-color: #fff;
	border-radius: 40rpx;
}
.item {
	height: 239rpx;
	margin: 0 40rpx;
	display: flex;
	align-items: center;
	image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 20rpx;
	}
}
.info {
	height: 160rpx;
	margin-left: 40rpx;
	display: flex;
	flex-direction: column;
	font-family: PingFang SC;
	.time_label {
		font-size: 24rpx;
		color: #4a5361;
		opacity: 0.5;
	}
	.time {
		font-size: 24rpx;
		color: #2c2837;
	}
	.car_label {
		font-size: 24rpx;
		color: #4a5361;
		margin-top: auto;
		opacity: 0.5;
	}
	.car {
		font-size: 28rpx;
		color: #2c2837;
		font-weight: bold;
	}
}
.out {
	border-top: 2rpx dashed #eee;
	box-sizing: content-box;
}
.close {
	height: 120rpx;
	text-align: center;
	image {
		margin-top: 60rpx;
		width: 60rpx;
		height: 60rpx;
	}
}
</style>
