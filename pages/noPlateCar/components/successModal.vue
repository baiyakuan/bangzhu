<template>
	<u-popup v-model="show" mode="center" transparent="true" :maskCloseAble="false">
		<view class="main">
			<image class="image" src="@/static/img/success.png"></image>
			<view class="title">{{ title }}</view>
			<view class="tip" v-if="type == 'in'">
				无牌车离场时，必须与入场扫码微信一致，否则无法开闸！
			</view>
		</view>
	</u-popup>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			title: '',
			type:''
		};
	},
	methods: {
		open(title,type) {
			this.show = true;
			this.type = type
			this.title = title;
			setTimeout(() => {
				this.show = false;
			}, 2000);
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 590rpx;
	// height: 348rpx;
	border-radius: 20rpx;
	background-color: #fff;
	overflow: hidden;
	text-align: center;
	padding-bottom: 40rpx;
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
.tip{
	font-size: 28rpx;
	color: red;
	font-weight: bold;
	margin: 40rpx 40rpx 0;
}
</style>
