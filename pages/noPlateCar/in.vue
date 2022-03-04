<template>
	<scroll-view :style="{ height: windowHeight * rate + 'rpx' }" :scroll-y="true" :scroll-with-animation="true">
		<view class="pd40-x" v-if="mounted">
			<view v-if="hasCar">
				<view class="pdt60 pdb30">
					<view class="ft50 ftweight rgb27">无牌车入场</view>
				</view>
				<view class="car_detail">
					<view class=" fst pd40 bgw">
						<image class="carImg" :src="Imgpath + inParkingInfo.big_picture" @click="showImg"></image>
						<view class="mgl100">
							<view class="time">
								<view class="rgba74 ft24">申请入场时间</view>
								<view class="ft26 text-black mgt10">{{inParkingInfo.time}}</view>
							</view>
							<view class="car">
								<view class="rgba74 ft24 mgt10">停放车辆</view>
								<view class="text-black ft30 ftweight mgt10">{{inParkingInfo.car_number}}（无牌车）</view>
							</view>
						</view>
					</view>
					<view class=" pd40 bgw">
						<view class="fst">
							<view>
								<image :src="staticImg + 'static/img/orderIconAddress.png'" style="width:24rpx;height:28rpx"></image>
							</view>
							<view class="mgl20">
								<view class="ft30 ftweight rgb27">{{ parkingInfo.parkingName }}</view>
								<view class="ft20 rgb74 mgt12">{{ parkingInfo.address }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="car_detail pd40-x pd20-y mg40-y bgw fs ft26" @click="visible = true">
					<view class="rgba74">若有疑问，请联系客服</view>
					<view class="text-orange">{{servicePhone}}</view>
				</view>
				<!-- <advSwiper :type="advType"></advSwiper> -->
				<view class="car_detail bgw">
					<Table :parkInfo="parkingInfo" v-if="parkingInfo" :charge="charge"></Table>
				</view>

				<view class="btn" @click="openGate">确认开闸</view>
			</view>
			<view v-else>
				<view class="pd40-x">
					<view class="noOrder">
						<image :src="staticImg + 'static/img/withdrawFail.png'" class="orderImg"></image>
						<view class="mg60-y ft36">当前未识别到无牌车</view>
					</view>
					<view class="noOrderContent">
						<view>请您尝试以下解决方案：</view>
						<view>1、请将无牌车辆驶至道闸入口处再扫码操作。</view>
						<view>2、非无牌车请勿恶意扫码。</view>
						<view>3、若以上操作未能为您解决问题，请拨打客</view>
						<view> 服电话：<view class="phoneText" @click="showPhone">{{servicePhone}}</view></view>
					</view>
				</view>

				<!-- <view class="callBtn" @click="visible = true">
					<image :src="staticImg + 'static/img/call.png'" class="callImg"></image>
					<text class="mg30-x ft30 ftweight">拨打客服</text>
				</view> -->
				<view class="zblxText">
					<text>停车有位</text>
					<text>出行更美</text>
				</view>
			</view>

		</view>
		<Modal v-if="visible" ok-css="color:#f44a3e;" ok-text="是" cancel-text="否" @ok="call" @cancel="visible = false">
			<view class="pd40-y">
				<view>是否拨打？</view>
				<view>{{servicePhone}}</view>
			</view>
		</Modal>
		<!-- <toastes :visibile="toastVisibile">{{ msg }}</toastes> -->
		<successModal ref="successModal"></successModal>
	</scroll-view>
</template>

<script>
	import {
		getServicePhone,
		scanUnlicensedQrCode,
		inOpenGate
	} from '@/api';
	import Modal from '@/components/Modal/index.vue';
	import advSwiper from '@/components/adv_swiper/index.vue'
	import Table from './components/table.vue'
	import successModal from './components/successModal.vue'
	export default {
		data() {
			return {
				windowHeight: 120,
				rate: 2,

				mounted: false, // 后台是否已返回数据
				visible: false, // 拨打客服弹窗
				servicePhone: '',
				option: {},
				charge: {},
				parkingInfo: {},
				inParkingInfo: {},
				hasCar:true,
			};
		},
		components: {
			Modal,
			advSwiper,
			Table,
			successModal
		},
		onLoad(option) {
			this.option = option
		},
		async onShow() {
			this.getScreenSize();
			this.getServicePhone();
			this.getOrderInfo()
		},
		computed: {
			staticImg() {
				return this.$store.state.staticImg
			},
			Imgpath() {
				return this.$store.state.Imgpath;
			},
		},
		methods: {
			async getOrderInfo() {
				const {
					data
				} = await scanUnlicensedQrCode(this.option)
				if (data.code == 1) {
					this.hasCar = true
					this.mounted = true
					this.charge = data.obj.charge
					this.parkingInfo = data.obj.parking
					this.inParkingInfo = data.obj.inParkingInfo
				}else{
					this.mounted = true
					this.hasCar = false
				}
			},
			async openGate() {
				const {
					data
				} = await inOpenGate({
					orderId: this.inParkingInfo.orderId,
					serialno: this.option.serialno
				})
				if (data.code == 1) {
					this.$refs.successModal.open('开闸成功','in')
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
					url: "/personal/order/orderPay/img?imgpath=" + this.inParkingInfo.big_picture
				})
			},
			getScreenSize() {
				const that = this;
				uni.getSystemInfo({
					complete: res => {
						that.windowHeight = res.windowHeight;
						that.rate = 750 / res.windowWidth;
					}
				});
			},
			showPhone(){
				this.visible = true
			}

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
		// width: 598rpx;
		// height: 330rpx;
		margin: auto;
		padding: 20rpx 17rpx;
		border-radius: 30rpx;
		padding-left: 40rpx;
		font-size: 24rpx;
		line-height: 70rpx;
	}

	.phoneText {
		display: inline-block;
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

	.btn {
		margin: 40rpx 0;
		width: 100%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background: #F33535;
		border-radius: 20rpx;
		color: #FFFFFF;
		font-size: 30rpx;
		font-weight: bold;
	}
</style>
