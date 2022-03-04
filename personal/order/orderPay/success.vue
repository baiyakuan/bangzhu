<template>
	<div class="pdt140 boxCenter">
		<div class="img_box ">
			<img class="img" :src="staticImg + 'static/img/checked.png'" alt="">
			<div class="ft36 ftweight mgt40" style="color: #FF4610;">缴费成功</div>
		</div>
		<div class=" mgt80 ft30 ftweight rgb27">{{plate}}</div>
		<div class=" mgt30">
			<div class="disib ft60 ftweight">￥</div>
			<div class=" ft60 ftweight disib">{{money}}</div>
		</div>
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
	import { mapActions,mapState } from 'vuex'
	import advSwiper from '@/components/adv_swiper/index.vue'
	export default {
		data() {
			return {
				advType:27,//缴费完成页 
				plate: '',
				money: ''
			}
		},
		components:{
			advSwiper
		},
		computed: {
			...mapState("commonModule", ['advertisement']),
			staticImg() { return this.$store.state.staticImg } ,
			Imgpath() { return this.$store.state.Imgpath }
		},
		onLoad(options) {
			const that = this;
			that.plate = options.plate;
			that.money = options.money;
			that.getAdverUrl()
		},
		onUnload() {
			wx.reLaunch({
				url: '/pages/index/index'
			})
		},
		methods: {
			...mapActions('commonModule', ['getAdvertisement']),
			// 获取广告位信息
			getAdverUrl() {
				this.getAdvertisement({type: 3}) //1-待支付卡片 2-扫码缴费页 3-缴费完成页 4-停车场详情页 5-新手指南 6-领停车券 7-UGCBanner管理'     8-加油活动
			},
			//广告位跳转
			navDetail() {
				goLink(this.advertisement.miniprogramurl)
			},
			complete() {
				wx.reLaunch({
					url: '/pages/index/index'
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
