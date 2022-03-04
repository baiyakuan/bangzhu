<template>
	<view>
		<view class="pd40-x" v-if="mounted">
			<view class="pdt60 pdb30">
				<view class="ft50 ftweight rgb27">无牌车出场</view>
			</view>
			<view class="car_detail">
				<view class=" fst pd40 bgw">
					<image class="carImg" :src="Imgpath + currentOrder.picture" @click="showImg"></image>
					<view class="mgl100">
						<view class="time">
							<view class="rgba74 ft24">入场时间</view>
							<view class="ft26 text-black mgt10">{{currentOrder.inTimeString}}</view>
						</view>
						<view class="car">
							<view class="rgba74 ft24 mgt10">停放车辆</view>
							<view class="text-black ft30 ftweight mgt10">{{currentOrder.carNumber}}</view>
						</view>
					</view>
				</view>
				<view class="pd40 bgw">
					<view class="fst mgb40">
						<view>
							<image :src="staticImg + 'static/img/orderIconAddress.png'" style="width:24rpx;height:28rpx"></image>
						</view>
						<view class="mgl20">
							<view class="ft30 ftweight rgb27">{{ currentOrder.parkingName }}</view>
							<view class="ft20 rgb74 mgt12">{{ currentOrder.address }}</view>
						</view>
					</view>
					<!-- <view class="line mg40-y"></view> -->
					<view class="fs ft24">
						<view class="rgba74">停车时长:</view>
						<view class="text-black">{{ currentOrder.parkTime }}</view>
					</view>
					<view class="fs ft24 mgt20">
						<view class="rgba74">订单金额:</view>
						<view class="text-black">{{ currentOrder.totalMoney }}元</view>
					</view>
				</view>
			</view>
			<view class="car_detail pd40-x pd20-y mg40-y bgw fs ft26" @click="visible = true">
				<view class="rgba74">若有疑问，请联系客服</view>
				<view class="text-orange">{{servicePhone}}</view>
			</view>
			<!-- <advSwiper :type="advType"></advSwiper> -->

			

		</view>
		<view class="btnBox">
			<view class="btn" @click="openGate">确认开闸</view>
		</view>
		
		<Modal v-if="visible" ok-css="color:#f44a3e;" ok-text="是" cancel-text="否" @ok="call" @cancel="visible = false">
			<view class="pd40-y">
				<view>是否拨打？</view>
				<view>{{servicePhone}}</view>
			</view>
		</Modal>
		<!-- <toastes :visibile="toastVisibile">{{ msg }}</toastes> -->
		<successModal ref="successModal"></successModal>
	</view>
</template>

<script>
	import {
		getServicePhone,
		parkingOrderView,
		outOpenGate
	} from '@/api';
	import Modal from '@/components/Modal/index.vue';
	import advSwiper from '@/components/adv_swiper/index.vue'
	import successModal from './components/successModal.vue'
	export default {
		data() {
			return {
				// advType: 26, //扫码缴费页 
				mounted: false, // 后台是否已返回数据
				serialno: '', // 出场二维码携带参数
			
				visible: false, // 拨打客服弹窗
				servicePhone: '',
				currentOrder:{}
			};
		},
		components: {
			Modal,
			advSwiper,
			successModal
		},
		onLoad(option) {
			this.serialno = option.serialno;
		},
		async onShow() {
			this.getServicePhone();
			this.getOrderInfo()
		},
		computed: {
			staticImg() {
				return this.$store.state.staticImg
			},
			Imgpath() {
				return  this.$store.state.Imgpath;
			},
		},
		methods: {
			async getOrderInfo(){
				const {
					data
				} = await parkingOrderView({
					serialno : this.serialno 
				})
				if (data.code == 1) {
					this.mounted = true
					this.currentOrder =  data.obj.currentOrder
				}else{
					// this.mounted = true
				}
			},
			async openGate(){
				const {data} = await outOpenGate({
					serialno:this.serialno,
					orderId :this.currentOrder.id
				})
				if (data.code == 1) {
					this.$refs.successModal.open('开闸成功','out')
					setTimeout(()=>{
						uni.reLaunch({
							url:"/pages/index/index"
						})
					},2000)
				}
				
			},
			//获取客服电话
			async getServicePhone() {
				const {
					data
				} = await getServicePhone();
				if (data.code == 1) {
					this.servicePhone = data.obj.sevicePhoneList[0].servcePhone;
				}

			},
			call() {
				uni.makePhoneCall({
					phoneNumber: this.servicePhone,
					success: () => {
						this.visible = false;
					}
				});
			},
			showImg() {
				uni.navigateTo({
					url: "/personal/order/orderPay/img?imgpath=" + this.currentOrder.picture
				})
			},

		}
	};
</script>

<style lang="scss">
	.text-black {
		color: #2c2837;
	}

	.text-orange {
		color: #ff4610;
	}

	.car_detail {
		border-radius: 30rpx;
		overflow: hidden;
	}

	.carImg {
		width: 160rpx;
		height: 160rpx;
		border-radius: 20rpx;
	}

	.plusImg {
		width: 60rpx;
		height: 30rpx;
	}

	.selectedImg {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		top: 0;
		right: 0;
	}

	.historCarImg {
		width: 140rpx;
		height: 185rpx;
		border-radius: 20rpx;
	}

	.line {
		width: 100%;
		height: 1px;
		background: #eff4f8;
	}

	.icon {
		width: 30rpx;
		height: 30rpx;
	}

	.placeholder {
		width: 100%;
		height: 200rpx;
	}

	.detail {
		width: 50%;
	}

	.ellipsis {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.footer {
		position: fixed;
		left: 0;
		bottom: 0;
		background: #fff;
		width: 100%;
		height: 160rpx;
	}

	.payBtn {
		// width:200rpx;
		// height:80rpx;
		padding: 20rpx 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		// line-height: 80rpx;
		// text-align: center;
		background: rgba(255, 70, 16, 1);
		border-radius: 20rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #fefefe;
		margin-right: 40rpx;
	}

	.list {
		border-radius: 30px 0 30rpx 30rpx;
		position: relative;
	}

	.money {
		align-self: flex-end;
	}

	.callBtn {
		width: 600rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: #ff4610;
		color: #ffffff;
		margin: 240rpx auto;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.advertisingSpace {
		margin-top: 60rpx;
		height: 221rpx;

		image {
			width: 100%;
			height: 221rpx;
		}
	}

	.noOrder {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 150rpx;
		color: #F33535;
		font-family: 'PingFang SC';
		font-weight: 600;
	}

	.noOrderContent {
		color: #1B1A22;
		background-color: #E8E8E8;
		display: flex;
		flex-direction: column;
		opacity: 0.7;
		justify-content: space-around;
		width: 598rpx;
		height: 330rpx;
		margin: auto;
		padding: 20rpx 17rpx;
		border-radius: 30rpx;
		padding-left: 40rpx;
	}

	.phoneText {
		color: #F33535;
	}

	.callBtn {
		width: 600rpx;
		height: 80rpx;
		border-radius: 20rpx;
		background: #ff4610;
		color: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		bottom: 200rpx;
		margin: 0 auto;
		left: 50%;
		transform: translateX(-50%);
	}

	.zblxText {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		position: fixed;
		color: #636D74;
		bottom: 120rpx;
		width: 250rpx;
		left: 50%;
		transform: translateX(-50%);
	}

	.orderImg {
		width: 100rpx;
		height: 100rpx;
	}

	.callImg {
		width: 30rpx;
		height: 30rpx;
	}
	.btnBox{
		width: 100%;
		border-radius: 20rpx;
		position: fixed;
		bottom: 40rpx;
		padding: 0 40rpx;
		box-sizing: border-box;
		overflow: hidden;
		.btn {
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			color: #FFFFFF;
			font-size: 30rpx;
			font-weight: bold;
			background: #F33535;
			border-radius: 20rpx;
		}
	}
	
</style>
