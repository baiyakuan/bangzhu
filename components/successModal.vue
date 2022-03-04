<template>
	<u-popup v-model="show" mode="center" transparent="true" :maskCloseAble="false">
		<view class="main">
			<image class="image" src="@/static/img/success.png"></image>
			<view class="title">{{ title }}</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			title: ''
		};
	},
	methods: {
		open(title) {
			this.show = true;
			this.title = title;
			setTimeout(() => {
				this.show = false;
			}, 1500);
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 590rpx;
	height: 348rpx;
	border-radius: 20rpx;
	background-color: #fff;
	overflow: hidden;
	text-align: center;
}
.image {
	width: 120rpx;
	height: 120rpx;
	margin-top: 60rpx;
}
.title {
	font-size: 34rpx;
	color: #333;
	font-weight: bold;
	margin-top: 60rpx;
}
</style>
