<template>
	<u-popup v-model="show" mode="center" transparent="true" :maskCloseAble="false">
		<view class="main">
			<image style="width: 570rpx;height: 330rpx;position: absolute;" :src="staticImg + '/static/image/notice_bg.png'"></image>
			<view class="content" @click="userTap"><image :src="staticImg + '/static/image/notice.png'" class="image"></image></view>
			<view class="know" @click="userTap">{{ title }}</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			title: '我知道了'
		};
	},
	computed: {
		staticImg() {
			return this.$store.state.staticImg;
		}
	},
	methods: {
		open() {
			this.show = true;
		},
		userTap() {
			this.show = false;
			this.$emit('userTap');
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 570rpx;
	height: 800rpx;
	border-radius: 20rpx;
	background-color: #fff;
	overflow: hidden;
	position: relative;
}
.content {
	width: 510rpx;
	height: 400rpx;
	background-color: #fff;
	top: 216rpx;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	text-align: center;
	box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
	border-radius: 20rpx;
	overflow: hidden;
	.image {
		width: 430rpx;
		height: 348rpx;
		margin-top: 26rpx;
	}
}
.know {
	width: 340rpx;
	height: 70rpx;
	line-height: 70rpx;
	font-size: 38rpx;
	font-family: 500;
	background-image: linear-gradient(#fd7533, #fa5d5e);
	border-radius: 50rpx;
	color: #fff;
	text-align: center;
	position: absolute;
	bottom: 64rpx;
	left: 50%;
	transform: translateX(-50%);
	font-family: PingFang SC;
}
</style>
