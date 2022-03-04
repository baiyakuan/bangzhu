<template>
	<!-- <u-popup v-model="show" mode="bottom" border-radius="20" :height="height + 'rpx'" :mask-close-able="true"> -->
	<view class="list">
		<view class="item" :class="{ delete: item == 'delete', ml0: isLeft(item), mt0: isTop(item) }" v-for="(item, index) in list" :key="index" @click="selectItem(item)">
			<image v-if="item == 'delete'" src="@/static/receiveCoupon/code_close.png" mode=""></image>
			<text v-else>{{ item }}</text>
		</view>
	</view>
		<!-- </u-popup> -->
</template>

<script>
export default {
	data() {
		return {
			show: false,
			list: [
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'0',
				'delete',
				'A',
				'B',
				'C',
				'D',
				'E',
				'F',
				'G',
				'H',
				'J',
				'K',
				'L',
				'M',
				'N',
				'P',
				'Q',
				'R',
				'S',
				'T',
				'U',
				'V',
				'W',
				'X',
				'Y',
				'Z',
				'使',
				'领',
				'警',
				'港',
				'澳',
				'学'
			]
		};
	},
	// computed: {
	// 	height() {
	// 		// 动态计算popup高度
	// 		const n = Math.ceil((this.list.length + 1) / 6);
	// 		return 160 + 90 * n + 26 * (n - 1);
	// 	}
	// },
	methods: {
		open() {
			this.show = true;
		},
		selectItem(item) {
			this.$emit('selectItem', item);
		},
		// 是否在最左边
		isLeft(item) {
			if (['1', '7', 'A', 'G', 'N', 'U', '使'].indexOf(item) > -1) {
				return true;
			}
			return false;
		},
		// 是否在最上边
		isTop(item) {
			if (['1', '2', '3', '4', '5', '6'].indexOf(item) > -1) {
				return true;
			}
			return false;
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	display: flex;
	flex-wrap: wrap;
	padding: 30rpx 40rpx;
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
	margin-top: 20rpx;
	line-height: 86rpx;
	font-size: 30rpx;
	color: #333333;
	font-weight: bold;
	text-align: center;
}
.ml0 {
	margin-left: 0;
}
.mt0 {
	margin-top: 0;
}
.delete {
	width: 206rpx;
	height: 90rpx;
	background-color: #f6f8fb;
	border-radius: 10rpx;
	border: 2rpx solid rgba(122, 129, 141, 0.1);
	box-sizing: border-box;
	margin-left: 26rpx;
	margin-top: 20rpx;
	display: flex;
	align-items: center;
	image {
		width: 40rpx;
		height: 40rpx;
		margin: 0 auto;
	}
}
</style>
