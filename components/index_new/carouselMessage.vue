<template>
	<view>
		<view v-if="isShowCoupon" style="background-color: #ffe4d8;border-radius: 15rpx;display: flex;align-items: center;position: absolute;left: 10rpx;bottom: 0rpx;">
			<image class="map_icon" style="position: relative;" src="/static/img/tip_bind.png"></image>
			<view @click="goCouponList()" class="content_item content_item1">
				<view class="text-ellipsis content_item-text ftweight">有停车券未完成绑定，点击继续绑定</view>
				<view class="addcar_arrow"></view>
			</view>
		</view>
		<view v-else>
			<view v-if="showContent" style="background-color: #ffe4d8;border-radius: 15rpx;display: flex;align-items: center;position: absolute;left: 10rpx;bottom: 0rpx;">
				<image class="map_icon" style="position: relative;" :src="staticImg + 'static/img/notice_addcar.png'"></image>
				<swiper class="text_content" :autoplay="true" :circular="true" :vertical="true" :disable-touch="true" v-if="showContent">
					<!-- <swiper-item @click="addCarHandler" class="addcar_wrapper content_item" v-if="showAddCar">
					<view class="text-ellipsis content_item-text">添加车辆享受无感支付</view>
					<view class="addcar_arrow"></view>
				</swiper-item> -->
					<swiper-item @click="noticeHandler(item)" v-for="(item, index) in dataList" class="content_item" :key="index">
						<view class="text-ellipsis content_item-text ftweight">{{ item.adName }}</view>
						<view class="addcar_arrow"></view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapQuery
	} from '@/utils/miniLodash';
	export default {
		data() {
			return {
				show: false,
				noBrand: true
			};
		},
		props: {
			isLogin: {
				type: Boolean,
				default: false
			},
			noticeList: {
				type: Array,
				default: []
			},
			brandNum: {
				type: Number,
				default: 0
			}
		},
		computed: {
			couponInfo() {
				return this.$store.state.menuModule.couponInfo
			},
			isShowCoupon(){
				console.log("是否显示通知" + this.$store.state.menuModule.couponInfo.data)
				return this.$store.state.menuModule.couponInfo.data
			},
			showContent() {
				return this.dataList.length > 0;
			},
			staticImg() {
				return this.$store.state.staticImg
			},
			showAddCar() {
				return !this.isLogin || this.noBrand;
			},
			dataList() {
				let res = []
				if (this.showAddCar) {
					res.unshift({
						adName: '添加车辆享受无感支付'
					})
					if (this.noticeList.length == 0) {
						res = res.concat(res);
					} else {
						res = res.concat(this.noticeList)
					}
				} else {
					res = this.noticeList
					if (res.length == 1) {
						res = res.concat(res)
					}
				}

				return res
			}
		},
		created() {
			this.noBrand = this.brandNum == 0;
		},
		watch: {
			brandNum(newValue, oldValue) {
				this.noBrand = newValue == 0;
			}
		},
		methods: {
			showAddCarPop() {
				if (this.brandNum >= 3) {
					setTimeout(() => {
						uni.showToast({
							title: '您绑定的车牌数量已达上限',
							icon: 'none',
							duration: 2000
						});
					}, 1500);
				} else {
					this.show = true;
					this.$emit('openKeyBoard');
				}
			},
			// addCarHandler() {
			// 	this.$emit('clickAddCar');
			// },
			finishAddBrand() {
				this.show = false;
			},
			noticeHandler(item) {
				if (item.adName == '添加车辆享受无感支付') {
					this.$emit('clickAddCar');
				} else {
					this.$emit('clickNotice', item);
				}
			},
			goCouponList() {
				uni.navigateTo({
					url: `/pages/receiveCoupon/bindCarNumber?key=${this.couponInfo.key}&parkingName=${this.couponInfo.parkingName}&couponTypeName=${this.couponInfo.couponTypeName}`
				});
			},
		}
	};
</script>

<style scoped lang="scss">
	.addcar_arrow {
		width: 13rpx;
		height: 13rpx;
		border-top: 5rpx solid #f33535;
		border-right: 5rpx solid #f33535;
		transform: rotate(45deg);
		margin-top: 2rpx;
	}

	.map_icon {
		position: absolute;
		border-radius: 15rpx;
		width: 60rpx;
		height: 60rpx;
	}

	.text_content,
	.content_item {
		width: 320rpx;
		height: 60rpx;
		font-size: 24rpx;

		&.content_item1 {
			font-size: 22rpx;
			width: 450rpx;
		}
	}

	.content_item {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		padding-right: 10rpx;
		box-sizing: border-box;
	}

	.content_item-text {
		width: 80%;
		color: #f33535;
	}
</style>
