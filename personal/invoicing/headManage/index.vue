<template>
	<view>
		<view class="pd40-x pd50-y bgw">
		  <view class="ft50 ftweight rgb51">抬头管理</view>
		</view>
		<view class="pd40">
			<view class="list pd40-x pd30-y bgw fs mgb40" @click="goDetail">
				<view class="fst">
					<view class="icon">
						<image :src="staticImg + 'static/img/head_enterprise.png'"></image>
					</view>
				    <view>
						<view class="mgb24 fst">
							<view class="rgb27 mgr40 ft26 ftweight width">企业抬头</view>
							<view class="rgb74 ft24">济宁市众帮来袭信息科技有限...</view>
						</view>
						<view class="fst">
							<view class="rgb27 mgr40 ft26 ftweight width">税号</view>
							<view class="rgb74 ft24">HJKL258AS14DF7G369</view>
						</view>
					</view>
				</view>
			</view>
			<view class="list pd40-x pd30-y bgw fs mgb40">
				<view class="fst">
					<view class="icon">
						<image :src="staticImg + 'static/img/head_personal.png'"></image>
					</view>
				    <view>
						<view class="fst">
							<view class="rgb27 mgr40 ft26 ftweight">个人抬头</view>
							<view class="rgb74 ft24">王二麻子</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			staticImg() { return this.$store.state.staticImg } ,
		},
		methods: {
			goDetail(){
				uni.navigateTo({
					url:'/personal/invoicing/detail/index'
				})
			}
		}
	}
</script>

<style lang="stylus">
image
	width 100%
	height 100%
	display block
.list
	border-radius 40rpx
.icon
	width 40rpx
	height 40rpx
	margin-right 40rpx
.arrow
	width 10rpx
	height 20rpx
.width
	width 104rpx
</style>
