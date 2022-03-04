<template>
	<drawer ref="myDrawer" mode="right" width="520">
		<view class="page" :style="{ paddingTop: (statusBarHeight + 44) * rate + 'rpx' }">
			<view class="title">筛选</view>

			<scroll-view :style="{ height: (screenHeight - statusBarHeight - 176) * rate + 'rpx' }" :scroll-y="true" :scroll-with-animation="true">
				<view class="screen_title" style="margin-top: 0;">距离范围</view>
				<view class="list">
					<view class="item" :class="{ active: activeIndex1 == index }" @click="activeIndex1 = index" v-for="(item, index) in screen1" :key="index">{{ item }}</view>
				</view>

				<view class="screen_title">车场类型</view>
				<view class="list">
					<view class="item" :class="{ active: activeIndex2 == index }" @click="activeIndex2 = index" v-for="(item, index) in screen2" :key="index">{{ item }}</view>
				</view>

				<view class="screen_title">车场类型</view>
				<view class="list">
					<view class="item" :class="{ active: activeIndex3 == index }" @click="activeIndex3 = index" v-for="(item, index) in screen3" :key="index">{{ item }}</view>
				</view>
			</scroll-view>

			<view style="display: flex;align-items: center;margin-top: 40rpx;">
				<view class="btn_reset" @click="reset">重置</view>
				<view class="btn_sure">确定</view>
			</view>
		</view>
	</drawer>
</template>

<script>
import drawer from '@/components/uni-drawer/uni-drawer.vue';

export default {
	components: {
		drawer
	},
	data() {
		return {
			statusBarHeight: 0, // 状态栏高度
			screenHeight: 0, // 屏幕高度
			rate: 0,
			screen1: ['300m内', '600m内', '1km内', '1km以上'],
			screen2: ['地上', '地下', '停车楼'],
			screen3: ['只看租赁', '有免费时长'],
			activeIndex1: -1,
			activeIndex2: -1,
			activeIndex3: -1
		};
	},
	created() {
		uni.getSystemInfo({
			complete: res => {
				console.log(res);
				this.statusBarHeight = res.statusBarHeight;
				this.screenHeight = res.screenHeight;
				this.rate = 750 / res.screenWidth;
			}
		});
	},
	methods: {
		open() {
			this.$refs.myDrawer.open();
		},
		reset() {
			this.activeIndex1 = -1;
			this.activeIndex2 = -1;
			this.activeIndex3 = -1;
		}
	}
};
</script>

<style scoped lang="scss">
.page {
	padding: 40rpx;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.title {
	font-size: 36rpx;
	font-weight: bold;
	margin-bottom: 40rpx;
}
.screen_title {
	margin-top: 40rpx;
	margin-bottom: 20rpx;
	font-size: 30rpx;
}
.list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.item {
	width: 200rpx;
	height: 76rpx;
	line-height: 76rpx;
	text-align: center;
	background-color: #eff4f8;
	color: #000;
	border-radius: 20rpx;
	margin-top: 20rpx;
}
.active {
	background-color: #f33535;
	color: #fff;
	font-weight: bold;
}
.btn_reset {
	width: 200rpx;
	height: 76rpx;
	line-height: 76rpx;
	text-align: center;
	background-color: #eff4f8;
	color: #000;
	border-radius: 20rpx;
}
.btn_sure {
	width: 200rpx;
	height: 76rpx;
	line-height: 76rpx;
	text-align: center;
	background-color: #f33535;
	color: #fff;
	font-weight: bold;
	border-radius: 20rpx;
	margin-left: auto;
}
</style>
