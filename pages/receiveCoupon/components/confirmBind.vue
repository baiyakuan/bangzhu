<template>
	<u-popup v-model="show" mode="center" transparent="true" :maskCloseAble="false">
		<view class="main">
			<image class="image" src="@/static/img/tip.png"></image>
			<view class="tip1">即将绑定至无牌车</view>
			<view class="carNumber">{{ carNumber }}</view>
			<view class="tip2">领取的停车券仅限该无牌车使用</view>
			<view class="bottom">
				<view class="btn confirm" @click="bind">确认绑定</view>
				<view class="btn" @click="show = false">取消</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			carNumber: ''
		};
	},
	methods: {
		open(carNumber) {
			this.carNumber = carNumber;
			this.show = true;
		},
		bind() {
			this.show = false;
			this.$emit('confirm');
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 590rpx;
	height: 552rpx;
	border-radius: 40rpx;
	background-color: #fff;
	overflow: hidden;
	position: relative;
	text-align: center;
}
.image {
	width: 120rpx;
	height: 120rpx;
	margin-top: 60rpx;
}
.tip1 {
	color: #4a5361;
	font-size: 28rpx;
	margin-top: 60rpx;
}
.carNumber {
	color: #4a5361;
	font-size: 32rpx;
	margin-top: 20rpx;
	font-weight: bold;
}
.tip2 {
	color: #4a5361;
	font-size: 28rpx;
	margin-top: 20rpx;
}
.bottom {
	width: 100%;
	position: absolute;
	bottom: 0;
	border-top: 2rpx solid #eff4f8;
	display: flex;
	align-items: center;
}
.btn {
	height: 100rpx;
	line-height: 100rpx;
	flex: 1;
	box-sizing: content-box;
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
}
.confirm {
	border-right: 2rpx solid #eff4f8;
	color: #f33535;
}
</style>
