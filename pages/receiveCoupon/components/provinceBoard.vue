<template>
	<!-- <u-popup v-model="show" mode="bottom" border-radius="20" :height="height + 'rpx'" :mask-close-able="true"> -->
		<view class="list">
			<view class="item" v-for="(item, index) in list" :key="index" @click="selectItem(item)">{{ item }}</view>
		</view>
	<!-- </u-popup> -->
</template>

<script>
export default {
	data() {
		return {
			show: false,
			list: [
				'京','津','沪','渝','冀','晋','辽','吉','黑','苏','浙','皖','闽','赣','鲁','豫','鄂','湘','粤','琼',
				'川','贵','云','陕','甘','青','蒙','桂','宁','新','藏','使','警','学','港','澳'
			]
		};
	},
	// computed: {
	// 	height() {
	// 		// 动态计算popup高度
	// 		const n = Math.ceil(this.list.length / 6);
	// 		return 160 + 90 * n + 26 * (n - 1);
	// 	}
	// },
	methods: {
		open() {
			this.show = true;
		},
		selectItem(item) {
			this.$emit('selectItem', item);
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	display: flex;
	flex-wrap: wrap;
	padding: 50rpx 40rpx;
	box-sizing: border-box;
	background: #FFFFFF;
}
.item {
	width: 90rpx;
	height: 90rpx;
	background-color: #f6f8fb;
	border-radius: 10rpx;
	border: 2rpx solid rgba(122, 129, 141, 0.1);
	box-sizing: border-box;
	margin-left: 26rpx;
	margin-top: 26rpx;
	line-height: 86rpx;
	font-size: 30rpx;
	color: #333333;
	font-weight: bold;
	text-align: center;
}
.item:nth-child(6n-5) {
	margin-left: 0;
}
.item:nth-child(-n + 6) {
	margin-top: 0;
}
</style>
