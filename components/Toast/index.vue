<template>
	<!-- <view v-if="visibile" class="mask"> -->
	<view v-if="visibile">
		<view class="dialog">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			visibile :{
				type: Boolean,
				default: false
			},
		}
	}
</script>

<style scoped>
	/* .mask{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,0.5);
		z-index: 1000;
	} */
	.dialog{
		/* position: absolute; */
		/* top: 50%; */
		position: fixed;
		bottom: 15%;
		left: 50%;
		color: #fff;
		height: 80rpx;
		line-height: 80rpx;
		max-width: 80%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		/* padding: 10rpx 20rpx; */
		border-radius: 10rpx;
		transform: translate(-50%,-50%);
		background: rgba(0,0,0,0.8);
		padding: 0 30rpx;
		font-size: 24rpx;
	}
</style>
