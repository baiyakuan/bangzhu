<template>
	<div class="pdt140 boxCenter">
		<div class="img_box ">
			<img class="img" :src="staticImg + 'static/img/checked.png'" alt="">
			<div class="ft36 ftweight mgt40" style="color: #FF4610;">支付成功</div>
		</div>
		<div class=" mgt30" v-if="money">
			<div class="disib ft60 ftweight">￥</div>
			<div class=" ft60 ftweight disib">{{money}}</div>
		</div>
		<!-- 广告 -->
		<div class="footer">
			<advSwiper :type="advType"></advSwiper>
			<div class="btn ft32" @click="complete">
				完成
			</div>
		</div>
	</div>
</template>

<script>
	import { goLink } from '@/utils/link'
	import advSwiper from '@/components/adv_swiper/index.vue'
	export default {
		data() {
			return {
				money: '',
				advType:18,
			}
		},
		components:{
			advSwiper
		},
		computed: {
			staticImg() { return this.$store.state.staticImg } ,
			Imgpath() { return this.$store.state.Imgpath }
		},
		onLoad(options) {
			this.money = options.money;
		},
		methods: {
			complete() {
				uni.redirectTo({
				  url:"/personal/order/index?tabName=加油"
				})
			},
		},
	}
</script>

<style>
	.boxCenter{
		text-align: center;
	}
	.img_box {

		margin: 80rpx auto 0;
	}

	.img {
		width: 100rpx;
		height: 100rpx;
	}

	.disib {
		display: inline-block;
	}
	.footer {
		width: 100%;
		position: fixed;
		bottom: 100rpx;
		padding: 40rpx;
		box-sizing: border-box;
	}
	.btn{
		width: 300rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: #FF4610;
		color: #fff;
		box-sizing: border-box;
		margin:  40rpx auto 0;
		text-align: center;
		line-height: 80rpx;
	}
</style>
