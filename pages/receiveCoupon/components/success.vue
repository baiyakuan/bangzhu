<template>
	<view class="maskWrapper" >
		<view class="top">
			<view class="image">
				<image src="@/static/receiveCoupon/success.png" mode=""></image>
			</view>
			<view class="brand">
				{{ brandNumber.slice(0,1)=='无'?'无牌车':brandNumber }}
			</view>
			<view class="text">
				{{ successText }}
			</view>
			
		</view>
		<view class="bottom">
			<!-- 广告 -->
			<advSwiper :type="advType"></advSwiper>
			<view class="btn" @click="close">
				完成
			</view>
		</view>
	</view>
</template>

<script>
	import advSwiper from '@/components/adv_swiper/index.vue'
	export default {
		data() {
			return {
				activeIndex:0,
				advType:17,
			}
		},
		components:{
			advSwiper
		},
		props: {
			brandNumber:{
				type:String,
				default:''
			},
			successText:{
				type:String
			}
		},
		computed: {
			Imgpath(){
				return this.$store.state.Imgpath
			}
		},
		methods: {
			change(event) {
				this.activeIndex = event.detail.current;
			},
			close() {
				this.$emit('cancel')
			},
		}
	}
</script>

<style scoped lang="scss">
	.maskWrapper {
		width: 100%;
		height: 100%;
		background: #F6F8FB;
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 1000;
	}
	

	.top {
		width: 100%;
		position: fixed;
		top: 200rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.image{
			width: 140rpx;
			height: 140rpx;
			margin-bottom: 20rpx;
			image{
				width: 140rpx;
				height: 140rpx;
			}
		}
		.brand{
			font-size: 50rpx;
			font-weight: bold;
			line-height: 90rpx;
			color: #1B1A22;
			margin-bottom: 20rpx;
		}
		.text{
			font-size: 40rpx;
			line-height: 90rpx;
			color: #1B1A22;
		}
		
	}

	.bottom {
		width: 100%;
		position: fixed;
		bottom: 80rpx;
		.swiper_wrapper {
			padding: 40rpx;
			margin-bottom: 80rpx;
			.list {
				height: 6rpx;
				margin: 20rpx auto 0;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 10rpx;
				flex-wrap: nowrap;
				.item {
					width: 40rpx;
					margin-right: 20rpx;
					background-color: #1B1912;
					height: 100%;
					border-radius: 4rpx;
					&:last-child{
						margin-right: 0
					}
					&.active {
						background-color: #3B87FF;
					}
				}
			}
			.swiper{
				border-radius: 20rpx;
				overflow: hidden;
				.swiper-item{
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
					overflow: hidden;
					image{
						width: 100%;
						height: 100%;
						border-radius: 20rpx;
						overflow: hidden;
					}
				}
			}
		}
		.btn{
			width: 316rpx;
			height: 100rpx;
			background: #F33535;
			border-radius: 20rpx;
			font-size: 32rpx;
			line-height: 100rpx;
			text-align: center;
			color: #FFFFFF;
			margin: 40rpx auto 0;
		}
	}
</style>
