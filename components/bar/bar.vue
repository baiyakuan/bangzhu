<template>
	<view>
		<view class="header" :style="{'height':titleBarHeight,'padding-top':statusBarHeight,'background-color': nav.bg}">
			
			<uni-icons type="arrowleft" :size="nav.size" :color="nav.color" class="arrow" v-if="nav.isdisPlayNavTitle" @click="back"></uni-icons>
		
			
			<!-- #ifdef MP-ALIPAY -->
			<view class="aliArrow" :style="{'height':titleBarHeight}" @click="back"></view>
			<!-- #endif -->
			
			<!-- <view class="header-title weight">{{nav.navTitle}}</view> -->
		</view>
		<view  :style="{'height':titleBarHeight,'padding-top':statusBarHeight}"></view>
	</view>
</template>
<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue"
	export default {
		props:["nav"],
		components:{
			uniIcons
		},
		data() {
			return {
				statusBarHeight: 0, 
				titleBarHeight: 0, 
			}
		},
		created() {
			var  that = this;
			 	uni.getSystemInfo({
			 		success: function(res) {
			 			if (res.model.indexOf('iPhone') !== -1) {
							that.titleBarHeight = 44 + 'px';
			 			} else {
			 				that.titleBarHeight = 48  + 'px';
						}
							that.statusBarHeight = res.statusBarHeight  + 'px'
					},
						
			 	})
		 },
		methods: {
			 // 回到上一页
			 back: function(){
				 console.log()
				 this.$emit('onBack')
			 }
		}
	}
</script>

<style>
	
	.header {
		display: flex;
		align-items: center;
		top: 0;
		position: fixed;
		width: 100%;
		z-index: 1000;
		left:0;
	}
	
	.header .header-title {
		position: absolute;
		left: 50%;
		/* font-size: 38upx; */
		font-size: 28rpx;
		color: #000000;
		transform: translateX(-50%);
	}
	.header-back{
		position: absolute;
		left:15upx;
		font-size:30upx;
		padding: 10upx;
		border-radius: 50%;
	}
	.arrow{
		margin-left: 10rpx;
	}
	.aliArrow{
		width: 100rpx;
	}
</style>
