<template>
	<u-popup v-model="show" mode="center" :transparent="true">
		<view class="main">
			<view class="title">收费明细</view>

			<view class="dashed"></view>

			<view class="item">
				临停区停车时长
				<text>{{ s2time(info.time) }}</text>
			</view>
			<view class="item">
				临停金额
				<text>{{ ((info.money || 0) - (info.outMoney || 0)).toFixed(2) }}元</text>
			</view>
			<view class="item">
				超时时长
				<text>{{ s2time(info.outTime) }}</text>
			</view>
			<view class="item">
				超时金额
				<text>{{ (info.outMoney || 0).toFixed(2) }}元</text>
			</view>
			<button class="close" @click="show = false">关闭</button>
		</view>
	</u-popup>
</template>

<script>
import { getOrderMoneyDetail } from '@/api';
export default {
	data() {
		return {
			show: false,
			info: {}
		};
	},
	methods: {
		open(orderCode) {
			this.show = true;
			this.getData(orderCode);
		},
		async getData(orderCode) {
			const { data } = await getOrderMoneyDetail({
				orderCode
			});
			if (data.code == 1 && data.obj) {
				this.info = data.obj;
			}
		},
		s2time(seconds) {
			if (!seconds) {
				return '00:00:00';
			}
			seconds = parseInt(seconds) / 1000;
			let h = parseInt(seconds / 3600);
			let m = parseInt((seconds % 3600) / 60);
			let s = parseInt((seconds % 3600) % 60);
			h = h < 10 ? '0' + h : h;
			m = m < 10 ? '0' + m : m;
			s = s < 10 ? '0' + s : s;
			return h + ':' + m + ':' + s;
		}
	}
};
</script>

<style lang="scss" scoped>
.main {
	width: 650rpx;
	height: 620rpx;
	background-image: url(@/static/img/moneyDetail.png);
	background-size: 100% auto;
	background-repeat: no-repeat;
	background-position: top;
	background-color: #fff;
	border-radius: 24rpx;
	overflow: hidden;
	text-align: center;
}
.title {
	font-size: 34rpx;
	font-weight: bold;
	color: #333;
	margin-top: 94rpx;
}
.dashed {
	width: 430rpx;
	height: 0;
	box-sizing: content-box;
	border-bottom: 2rpx dashed #707070;
	opacity: 0.15;
	margin: 0 auto;
	margin-top: 30rpx;
	margin-bottom: 40rpx;
}
.item {
	width: 470rpx;
	font-size: 28rpx;
	color: #4a5361;
	margin: 0 auto;
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	text {
		margin-left: auto;
	}
}
.close {
	background-color: #f33535;
	width: 180rpx;
	height: 80rpx;
	line-height: 80rpx;
	border-radius: 20rpx;
	font-size: 26rpx;
	color: #fff;
	margin-top: 60rpx;
}
</style>
