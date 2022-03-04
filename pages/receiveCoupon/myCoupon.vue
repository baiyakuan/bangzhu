<template>
	<view class="page"> 
		<view class="tabs">
			<view class="tab" :class="{ active: type == 1 }" @click="changeType(1)">
				<view class="border">
					<view class="tab_name">待使用</view>
					<view class="tab_num">{{isNotUseCount}}张</view>
				</view>
				<view class="tab_arrow">
					<view class="triangle-up"></view>
				</view>
			</view>
			<view class="tab" :class="{ active: type == 2 }" @click="changeType(2)">
				<view class="border">
					<view class="tab_name">已使用</view>
					<view class="tab_num">{{isUseCount}}张</view>
				</view>
				<view class="tab_arrow">
					<view class="triangle-up"></view>
				</view>
			</view>
			<view class="tab" :class="{ active: type == 3 }" @click="changeType(3)">
				<view class="border">
					<view class="tab_name">已过期</view>
					<view class="tab_num">{{expiredCount}}张</view>
				</view>
				<view class="tab_arrow">
					<view class="triangle-up"></view>
				</view>
			</view>
		</view>
		<scroll-view :style="{ height: windowHeight * rate - 180 + 'rpx' }" :scroll-with-animation="true" :scroll-y="true" v-if="storeList.length">
			<view class="list" v-for="(store, index) in storeList" :key="index">
				<view class="list_name">
					{{store.parkingName}}
				</view>
				<view class="item" v-for="(item, index1) in store.couponGainLots" :key="index1">
					<view class="top">
						<view class="left">
							<view class="title">
								<view class="name"> {{ item.couponName }} </view>
								<view class="store" v-if="item.issuerName"> ( {{ item.issuerName }} ) </view>
							</view>
							<view class="rule">
								使用规则：仅限{{item.parkingName}}使用
							</view>
							<view class="date" v-if="type == 1">有效期至{{ item.expiryDate }}</view>
							<view class="date" v-if="type == 2">使用时间 : {{ item.useTime }}</view>
							<view class="date" v-if="type == 3">过期时间 : {{ item.expiryDate }}</view>
						</view>
						<view class="right" @click="openModal(item)" v-if="type == 1 && item.flag==2">
							立即使用
						</view>
						<view class="used" v-if="type == 2"></view>
						<view class="overdue" v-if="type == 3"></view>
					</view>
					<view class="bottom">
						<view class="carNumber">
							绑定车辆：{{ $carNumber(item.plateNumber) }}
						</view>
						<view class="bind" @click="bindCarNumber(item)" v-if="type == 1">
							<view>更改绑定车牌</view>
							<u-icon name="arrow-right" color="#1B1912" size="24"></u-icon>
						</view>
					</view>
				</view>
			</view>

		</scroll-view>
		<view style="width:100%;text-align:center; margin-top:400rpx" v-else>
			<image src="/static/receiveCoupon/noCoupon.png" style="width:300rpx;height:160rpx" ></image>
			<view class="pdt50 rgb74 ft28">暂无停车券</view>
		</view>
		<Modal v-if="modalShow" :showOk="false" :showCancel="false" ref="modal">
			<view class="modal_content">
				<view class="modal_codeImg">
					<image :src="Imgpath + coupon.url"></image>
				</view>
				<view class="modal_title pd40-y ftweight ft40">
					{{coupon.code }}
				</view>
				<view class="ftweight" style="color: #FF4610;"> 出示服务码即可验券使用 </view>
				<image src="/static/receiveCoupon/code_close.png" class="openModal" @click="closeModal"></image>
			</view>
		</Modal>
	</view>
</template>

<script>
	import Modal from '@/components/Modal/index.vue'
	import {
		selectToReceiveList,
		selectByParkCouponCount,
		updateCouponPlate,
		getCouponGainCode
	} from '@/api';

	export default {
		components: {
			Modal
		},
		data() {
			return {
				windowHeight: 120,
				rate: 2,
				storeList:[],
				type: 1,
				phone: '',
				pageIndex: 1,
				pageCount: 0,
				loading: false, // 是否正在请求接口
				refreshing: false, // 是否正在下拉刷新
				modalShow: false,
				coupon: {
					code: '',
					url:''
				},
				isUseCount:0,
				isNotUseCount:0,
				expiredCount:0
			};
		},
		onLoad() {
			this.getScreenSize()
		},
		onShow() {
			this.getList()
			this.getListNum()
		},
		computed:{
			Imgpath() {
				return this.$store.state.Imgpath
			}
		},
		methods: {
			async openModal(item) {
				this.modalShow = true
				const { data } = await getCouponGainCode({
					gainCode:item.gainCode
				});
				if (data.code == 1){
					this.coupon.code = data.obj.val
					this.coupon.url = data.obj.qrUrl
				}
			},
			closeModal() {
				this.modalShow = false
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
			bindCarNumber(item){
				uni.navigateTo({
					url:'/pages/receiveCoupon/bindCarNumber?gainCode='  + item.gainCode + '&brandNumber='  + item.plateNumber + '&parkingName='  + item.parkingName  + '&couponTypeName='  + item.couponTypeName 
				})
			},
			async getListNum(){
				const { data } = await selectByParkCouponCount();
				if (data.code == 1){
					this.isUseCount = data.obj.isUseCount
					this.isNotUseCount = data.obj.isNotUseCount
					this.expiredCount = data.obj.expiredCount
				}
			},
			async getList() {
				this.loading = true;
				const {
					data
				} = await selectToReceiveList({
					// isGain:1,
					type: this.type
				});
				this.loading = false;
				this.refreshing = false;
				if (data.code == 1 && data.obj.list) {
					// this.pageCount = data.data.pageCount;
					// this.storeList = this.storeList.concat(data.obj.list);
					this.storeList = data.obj.list;
				}else{
					this.storeList = []
				}
			},
			onRefresh() {
				this.refreshList();
				this.refreshing = true;
			},
			refreshList(type) {
				if (type) {
					this.type = type;
				}
				this.pageIndex = 1;
				this.storeList = [];
				this.getList();
			},
			changeType(type) {
				if (this.type == type) {
					return;
				}
				this.type = type;
				this.pageIndex = 1;
				this.storeList = [];
				this.getList();
			},
			orderDetails(item) {
				uni.navigateTo({
					url: '/pages/orderDetails/orderDetails?orderCode=' + item.orderCode + '&type=' + item.type
				});
			},
			scrollBottom() {
				if (this.pageIndex < this.pageCount && !this.loading) {
					this.pageIndex++;
					this.getList();
				}
			},
			
		}
	};
</script>
<style lang="scss" scoped>
	.page {
		overflow: hidden;
		background: #F6F8FB;;
	}

	.tabs {
		background: #F33535;
		padding-top: 40rpx;
		display: flex;
		align-items: center;

		.tab {
			flex: 1;
			height: 100rpx;
			text-align: center;
			position: relative;

			.border {
				border-right: 2rpx solid #fff;
			}

			.tab_name {
				font-size: 30rpx;
				font-weight: bold;
				line-height: 36rpx;
				color: #FFFFFF;
			}

			.tab_num {
				font-size: 20rpx;
				line-height: 36rpx;
				color: #FFFFFF;
			}

			&:last-child {
				.border {
					border-right: none;
				}

			}

			.tab_arrow {
				display: none;
				position: absolute;
				bottom: 0;
				left: 50%;
				margin-left: -16rpx;
				.triangle-up {
					margin: 0 auto;
					width: 0;
					height: 0;
					border-left: 16rpx solid transparent;
					border-right: 16rpx solid transparent;
					border-bottom: 16rpx solid #FFFFFF;
				}
			}

			&.active {
				.tab_arrow {
					display: block;
				}
			}
		}

	}

	.list {
		margin: 40rpx;
		padding: 10rpx 0 10rpx;
		border-bottom: 2rpx solid #ffffff;

		.list_name {
			font-size: 26rpx;
			font-weight: bold;
			line-height: 36rpx;
			color: #1B1912;
			padding: 0 40rpx 20rpx;
		}

		.item {
			width: 666rpx;
			height: 236rpx;
			margin: 0 2rpx 4rpx;
			box-sizing: border-box;
			padding: 38rpx 36rpx 0 40rpx;
			background: url('@/static/receiveCoupon/couponBg.png');
			background-size: cover;

			&:last-child {
				margin-bottom: 0;
			}

			.top {
				display: flex;
				justify-content: space-between;
				border-bottom: 2rpx dashed #E2E2E2;
				padding: 0 22rpx 0 38rpx;

				.left {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					.title{
						display: flex;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						.name {
							font-size: 28rpx;
							line-height: 48rpx;
							color: #1B1912;
							margin-bottom: 10rpx;
							font-weight: 400;
							margin-right: 10rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						.store{
							font-size: 20rpx;
							line-height: 48rpx;
							color: rgba(27, 25, 18, 0.5);
						}
					}
					
					.rule {
						
						font-size: 20rpx;
						line-height: 28rpx;
						color: rgba(27, 25, 18, 0.5);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
					.date {
						font-size: 20rpx;
						line-height: 28rpx;
						color: rgba(27, 25, 18, 0.5);
						margin-bottom: 20rpx;
					}
				}

				.right {
					width: 148rpx;
					height: 54rpx;
					background: #F33535;
					border-radius: 32rpx;
					font-size: 22rpx;
					text-align: center;
					line-height: 54rpx;
					color: #FFFFFF;
					margin-top: 20rpx;
					flex-shrink: 0;
				}

				.used {
					width: 118rpx;
					height: 118rpx;
					background: url('@/static/receiveCoupon/used.png');
					background-size: cover;
					position: relative;
					flex-shrink: 0;
				}

				.overdue {
					width: 118rpx;
					height: 118rpx;
					background: url('@/static/receiveCoupon/overdue.png');
					background-size: cover;
					flex-shrink: 0;
				}
			}

			.bottom {
				display: flex;
				justify-content: space-between;
				padding: 0 0 0 38rpx;

				.carNumber {
					flex: 1;
					margin-right: 20rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-size: 24rpx;
					line-height: 48rpx;
					color: rgba(27, 25, 18, 0.5);
				}

				.bind {
					flex-shrink: 0;
					font-size: 24rpx;
					line-height: 48rpx;
					color: #1B1912;
					display: flex;
					.u-icon--right{
						margin-top: 4rpx;
					}
				}
			}

		}
	}

	.modal_content {
		border-radius: 40rpx;
		width: 670rpx;
		height: 836rpx;
		box-sizing: border-box;
		padding: 0 0 100rpx;
		background-color: #FFFFFF;
		background-size: cover;

		.modal_codeImg {
			padding: 88rpx 80rpx 40rpx;

			image {
				width: 440rpx;
				height: 440rpx;
			}

		}

		.openModal {
			width: 64rpx;
			height: 64rpx;
			position: absolute;
			left: 50%;
			margin-left: -32rpx;
			bottom: -100rpx;
		}
	}
</style>
// <style lang="scss" scoped>
// 	.page {
// 		background: #F33535;
// 		overflow: hidden;
// 	}

// 	.tabs {
// 		margin: 0 40rpx;
// 		padding-top: 40rpx;
// 		border-radius: 20rpx;
// 		display: flex;
// 		align-items: center;

// 		.tab {
// 			flex: 1;
// 			height: 100rpx;
// 			text-align: center;

// 			.border {
// 				border-right: 2rpx solid #fff;
// 			}

// 			.tab_name {
// 				font-size: 30rpx;
// 				font-weight: bold;
// 				line-height: 36rpx;
// 				color: #FFFFFF;
// 			}

// 			.tab_num {
// 				font-size: 20rpx;
// 				line-height: 36rpx;
// 				color: #FFFFFF;
// 			}

// 			&:last-child {
// 				.border {
// 					border-right: none;
// 				}

// 			}

// 			.tab_arrow {
// 				margin-top: 8rpx;
// 				display: none;

// 				.triangle-up {
// 					margin: 0 auto;
// 					width: 0;
// 					height: 0;
// 					border-left: 16rpx solid transparent;
// 					border-right: 16rpx solid transparent;
// 					border-bottom: 16rpx solid #FFFFFF;
// 				}
// 			}

// 			&.active {
// 				.tab_arrow {
// 					display: block;
// 				}
// 			}
// 		}

// 	}

// 	.list {
// 		background: #FFFFFF;
// 		box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.06);
// 		border-radius: 20px;
// 		margin: 40rpx;
// 		padding: 20rpx 0 40rpx;

// 		.list_name {
// 			font-size: 26rpx;
// 			font-weight: bold;
// 			line-height: 36rpx;
// 			color: #1B1912;
// 			padding: 0 40rpx 20rpx;
// 		}

// 		.item {
// 			width: 666rpx;
// 			height: 236rpx;
// 			margin: 0 2rpx 4rpx;
// 			box-sizing: border-box;
// 			padding: 38rpx 36rpx 0 40rpx;
// 			background: url('@/static/receiveCoupon/couponBg.png');
// 			background-size: cover;

// 			&:last-child {
// 				margin-bottom: 0;
// 			}

// 			.top {
// 				display: flex;
// 				justify-content: space-between;
// 				border-bottom: 2rpx dashed #E2E2E2;
// 				padding: 0 22rpx 0 38rpx;

// 				.left {
// 					.name {
// 						font-size: 34rpx;
// 						line-height: 48rpx;
// 						color: #1B1912;
// 						margin-bottom: 20rpx;
// 						font-weight: 400;
// 					}

// 					.date {
// 						font-size: 24rpx;
// 						line-height: 34rpx;
// 						color: rgba(27, 25, 18, 0.5);
// 						margin-bottom: 28rpx;
// 					}
// 				}

// 				.right {
// 					width: 148rpx;
// 					height: 54rpx;
// 					background: #F33535;
// 					border-radius: 32rpx;
// 					font-size: 22rpx;
// 					text-align: center;
// 					line-height: 54rpx;
// 					color: #FFFFFF;
// 					margin-top: 20rpx;
// 				}

// 				.used {
// 					width: 118rpx;
// 					height: 118rpx;
// 					background: url('@/static/receiveCoupon/used.png');
// 					background-size: cover;
// 				}

// 				.overdue {
// 					width: 118rpx;
// 					height: 118rpx;
// 					background: url('@/static/receiveCoupon/overdue.png');
// 					background-size: cover;
// 				}
// 			}

// 			.bottom {
// 				display: flex;
// 				justify-content: space-between;
// 				padding: 0 0 0 38rpx;
// 				margin-top: 6rpx;

// 				.rule {
// 					width: 65%;
// 					overflow: hidden;
// 					text-overflow: ellipsis;
// 					white-space: nowrap;
// 					font-size: 24rpx;
// 					line-height: 34rpx;
// 					color: rgba(27, 25, 18, 0.5);
// 				}

// 				.bind {
// 					font-size: 24rpx;
// 					line-height: 34rpx;
// 					color: #1B1912;
// 					display: flex;
// 				}
// 			}

// 		}
// 	}

// 	.modal_content {
// 		border-radius: 40rpx;
// 		width: 670rpx;
// 		height: 836rpx;
// 		box-sizing: border-box;
// 		padding: 0 40rpx 100rpx;
// 		background-color: #FFFFFF;
// 		background-size: cover;

// 		.modal_codeImg {
// 			padding: 88rpx 80rpx 40rpx;

// 			image {
// 				width: 440rpx;
// 				height: 440rpx;
// 			}

// 		}

// 		.openModal {
// 			width: 64rpx;
// 			height: 64rpx;
// 			position: absolute;
// 			left: 50%;
// 			margin-left: -32rpx;
// 			bottom: -100rpx;
// 		}
// 	}
// </style>
