<template>
	<scroll-view class="page" :style="{ height: windowHeight * rate + 'rpx' }" :scroll-y="true" :scroll-with-animation="true">
		<!-- 广告 -->
		<advSwiper :type="advType" style="margin-top: 40rpx;"></advSwiper>

		<view class="couponTitle">
			<view class="parkingName">{{ option.parkingName }}</view>
			<view class="border"></view>
			<view class="couponTypeName">{{ option.couponTypeName }}</view>
		</view>
		<view class="brand_wrapper mgb60">
			<view class="title">该停车券用于车牌号：</view>
			<view class="brand_num">
				<view :class="brandCurrent == index ? 'num active' : 'num'" @click="openBoard(index)" v-for="(item, index) in brandArr" :key="index">{{ item }}</view>
				<view :class="isEnergy ? 'num energy active' : 'num energy'" @click="openBoard(7)" v-if="brandArr.length < 8">
					<image src="@/static/receiveCoupon/energy.png"></image>
				</view>
			</view>
			<view class="btn" @click="openEnquire">绑定</view>
		</view>
		<view class="brand_list brand_bindlist" v-if="brandList.length">
			<view class="title">已绑定车牌</view>
			<view class="list">
				<radio-group @change="radioChange1">
					<view class="brand" v-for="(item, index) in brandList" :key="item.brandId">
						<view class="default"><view v-show="item.isDefault" class="defaultText"></view></view>
						<view :class="current1 == index ? 'num active' : 'num'">{{ item.plateNumber }}</view>
						<label class="radio" style="transform:scale(0.6)"><radio :value="item.brandId + ''" color="#f00" :checked="index === current1" /></label>
					</view>
				</radio-group>
			</view>
		</view>
		<view class="brand_list brand_historylist" v-if="historyList.length">
			<view class="title">历史缴费车牌</view>
			<view class="list">
				<radio-group @change="radioChange2">
					<view class="brand" v-for="(item, index) in historyList" :key="item.historyId">
						<view class="default"></view>
						<view :class="current2 == index ? 'num active' : 'num'">{{ item.plateNumber }}</view>
						<label class="radio" style="transform:scale(0.6)"><radio :value="item.historyId + ''" color="#f00" :checked="index === current2" /></label>
					</view>
				</radio-group>
			</view>
		</view>
		<view class="brand_list brand_unlicensedCar" v-if="unlicensedCar.length">
			<view class="title">无牌车辆虚拟车牌</view>
			<view class="list">
				<radio-group @change="radioChange3">
					<view class="brand" v-for="(item, index) in unlicensedCar" :key="index">
						<view class="default"></view>
						<view :class="current3 == index ? 'num active' : 'num'">{{ item.brandNumber }}</view>
						<label class="radio" style="transform:scale(0.6)"><radio :value="'' + index" color="#f00" :checked="index === current3" /></label>
					</view>
				</radio-group>
			</view>
		</view>
		
		<!-- 询问enquire是否绑定 -->
		<toast v-if="enquireShow" @cancel="closeEnquire">
			<view class="confirmBox" slot="bottom">
				<view class="title">是否绑定该车牌用于停车券：</view>
				<view class="brand">{{ brandStr }}</view>
				<view class="btns">
					<view class="btn " @click="closeEnquire">取消</view>
					<view class="btn active" @click="updateCouponPlate">确认</view>
				</view>
			</view>
		</toast>
		
		<!-- 询问enquire是否绑定 -->
		<confirmBind ref="confirmBind" @confirm="updateCouponPlate"></confirmBind>
		
		<!-- 输入Board车牌号 -->
		<toast v-if="boardShow" @cancel="closeBoard" :maskColor="'rgba(0, 0, 0, 0.8)'">
			<view slot="top">
				<view class="couponTitle">
					<view class="parkingName">{{ option.parkingName }}</view>
					<view class="border"></view>
					<view class="couponTypeName">{{ option.couponTypeName }}</view>
				</view>
				<view class="brand_wrapper">
					<view class="title">该停车券用于车牌号：</view>
					<view class="brand_num">
						<view :class="brandCurrent == index ? 'num active' : 'num'" @click="openBoard(index)" v-for="(item, index) in brandArr" :key="index">{{ item }}</view>
						<view :class="isEnergy ? 'num energy active' : 'num energy'" @click="openBoard(7)" v-if="brandArr.length < 8">
							<image src="@/static/receiveCoupon/energy.png"></image>
						</view>
					</view>
					<view class="btn" @click="openEnquire">绑定</view>
				</view>
			</view>
			<view slot="bottom">
				<numberBoard v-if="numberShow" @selectItem="selectItemN"></numberBoard>
				<provinceBoard v-if="provinceShow" @selectItem="selectItemP"></provinceBoard>
			</view>
		</toast>
		<success v-if="successShow" @cancel="goCouponList" :brandNumber="brandStr" :successText="successText"></success>
	</scroll-view>
</template>

<script>
import { selectBindPlateList, updateCouponPlate, addCouponRecord2 } from '@/api';
import { requestSubscribeMessage } from '@/utils/subscribeMsgUtils';

import toast from './components/toast.vue';
import numberBoard from './components/numberBoard.vue';
import provinceBoard from './components/provinceBoard.vue';
import success from './components/success.vue';
import confirmBind from './components/confirmBind.vue';
import advSwiper from '@/components/adv_swiper/index.vue';
export default {
	components: {
		toast,
		numberBoard,
		provinceBoard,
		success,
		confirmBind,
		advSwiper //广告
	},
	computed: {
		brandStr() {
			return this.brandArr.join('');
		},
		Imgpath() {
			return this.$store.state.Imgpath;
		}
	},
	data() {
		return {
			current1: -1,
			current2: -1,
			current3: -1,
			windowHeight: 120,
			rate: 2,
			brandArr: ['', '', '', '', '', '', ''],

			enquireShow: false,
			boardShow: false,
			provinceShow: false,
			numberShow: false,
			isEnergy: false,
			successShow: false,

			brandCurrent: -1,
			brandList: [],
			historyList: [],
			unlicensedCar: [],

			adverList: [],
			gainCode: '',
			option: {},
			successText: '领券成功',
			activeIndex: 0,
			advType: 28
		};
	},
	onLoad(option) {
		this.getScreenSize();
		this.selectBindPlateList(); //获取车牌列表
		if (option) {
			this.option = option;
		}
	},
	watch: {
		brandCurrent(val) {
			if (val) {
				this.numberShow = true;
				this.provinceShow = false;
			} else {
				this.numberShow = false;
				this.provinceShow = true;
			}
		}
	},
	methods: {
		change(event) {
			this.activeIndex = event.detail.current;
		},
		openEnquire() {
			if (this.isEnergy && !this.brandArr[7]) {
				this.isEnergy = false;
			}
			let flag = this.brandArr.every(item => {
				return item != '';
			});
			if (this.brandStr.length < 7 || !flag) {
				uni.showToast({
					title: '请正确输入车牌号',
					icon: 'none'
				});
			} else {
				var reg = /^[A-Za-z]/;
				if (reg.test(this.brandArr[1])) {
					this.closeBoard();
					requestSubscribeMessage(['UfOGjD8Fb0WHB5J9UEQy5XTsAeMwfJiHokcg-V4K33o', 'QH4Iq02G1WmDJk-K5bXHh__nGagiTz5KT7SYovQNzrU'], () => {
						if(this.brandStr.slice(0,1) == '无'){
							this.$refs.confirmBind.open(this.brandStr);
						}else{
							this.enquireShow = true;
						}
					});
				} else {
					uni.showToast({
						title: '车牌第二位应为城市代码',
						icon: 'none'
					});
				}
			}
		},
		closeEnquire() {
			this.enquireShow = false;
		},
		openBoard(value) {
			if (value == 7) {
				this.isEnergy = true;
			} else {
				this.isEnergy = false;
			}
			this.brandCurrent = value;
			this.boardShow = true;
		},
		closeBoard() {
			this.brandCurrent = -1;
			this.boardShow = false;
			this.isEnergy = false;
		},
		cancleSelect() {
			if (this.current1 > -1 && this.brandStr != this.brandList[this.current1].plateNumber) {
				this.current1 = -1;
			}
			if (this.current2 > -1 && this.brandStr != this.historyList[this.current2].plateNumber) {
				this.current2 = -1;
			}
			if (this.current3 > -1 && this.brandStr != this.unlicensedCar[this.current3].brandNumber) {
				this.current3 = -1;
			}
		},
		selectItemP(value) {
			this.$set(this.brandArr, this.brandCurrent, value);
			this.brandCurrent++;
			this.closeBoard();
			this.openBoard(1);
			this.cancleSelect();
		},
		selectItemN(value) {
			if (value == 'delete') {
				// 删除
				if (this.isEnergy) {
					if (this.brandArr[7]) {
						this.brandArr.splice(-1, 1);
					}
					this.isEnergy = false;
					this.brandCurrent = 6;
				} else {
					this.$set(this.brandArr, this.brandCurrent, '');
					this.brandCurrent--;
				}
			} else {
				// 填充
				this.$set(this.brandArr, this.brandCurrent, value);
				if (!this.isEnergy && this.brandCurrent < 6) {
					this.brandCurrent++;
				}
				if (this.isEnergy && this.brandCurrent < 7) {
					this.brandCurrent++;
				}

				if (this.isEnergy && this.brandArr.length > 8) {
					return false;
				}
			}
			this.cancleSelect();
		},
		radioChange1(evt) {
			for (let i = 0; i < this.brandList.length; i++) {
				if (this.brandList[i].brandId == evt.target.value) {
					this.current1 = i;
					this.brandArr = this.brandList[i].plateNumber.split('');
					break;
				}
			}
			this.current2 = -1;
			this.current3 = -1;
		},
		radioChange2(evt) {
			for (let i = 0; i < this.historyList.length; i++) {
				if (this.historyList[i].historyId == evt.target.value) {
					this.current2 = i;
					this.brandArr = this.historyList[i].plateNumber.split('');
					break;
				}
			}
			this.current1 = -1;
			this.current3 = -1;
		},
		radioChange3(evt) {
			for (let i = 0; i < this.unlicensedCar.length; i++) {
				if (i == evt.target.value) {
					this.current3 = i;
					this.brandArr = this.unlicensedCar[i].brandNumber.split('');
					break;
				}
			}
			this.current1 = -1;
			this.current2 = -1;
		},
		// 已绑定车牌/历史缴费车牌
		async selectBindPlateList() {
			const { data } = await selectBindPlateList();
			if (data.code == 1) {
				this.brandList = data.obj.brandList || [];
				this.historyList = data.obj.historyList || [];
				this.unlicensedCar = data.obj.unlicensedCar || [];
				this.getBrand();
			}
		},
		getBrand() {
			if (this.option.brandNumber) {
				// 修改车牌
				this.gainCode = this.option.gainCode;
				this.brandArr = this.option.brandNumber.split('');
				this.current1 = -1;
				this.current2 = -1;
				this.current3 = -1;
			} else {
				// 绑定车牌
				this.brandArr = ['', '', '', '', '', '', ''];
			}
		},
		goUrl(item) {
			uni.navigateTo({
				url: item.miniprogramurl
			});
		},
		async updateCouponPlate() {
			if (this.gainCode) {
				// 修改车牌
				const { data } = await updateCouponPlate({
					gainCode: this.gainCode,
					plateNumber: this.brandStr
				});
				if (data.code == 1) {
					this.enquireShow = false;
					this.successShow = true;
					this.successText = '修改成功！';
				} else {
					this.enquireShow = false;
					this.successShow = false;
					uni.showToast({
						title: data.msg,
						icon: 'none'
					});
				}
			} else {
				//绑定车牌
				const { data } = await addCouponRecord2({
					key: this.option.key,
					carNumber: this.brandStr,
					isBind: false, //是否绑定  默认不绑定
					brandType: this.brandStr.length > 7 ? 1 : 0, //是否新能源
					istrue: true
				});
				if (data.code == 1) {
					this.enquireShow = false;
					this.successShow = true;
					this.successText = '领券成功！';
				} else {
					this.enquireShow = false;
					this.successShow = false;
					uni.showToast({
						title: data.msg,
						icon: 'none'
					});
				}
			}
		},
		goCouponList() {
			if (this.gainCode) {
				uni.navigateBack();
			} else {
				uni.redirectTo({
					url: '/pages/receiveCoupon/myCoupon'
				});
			}
		},
		getScreenSize() {
			const that = this;
			uni.getSystemInfo({
				complete: res => {
					that.windowHeight = res.windowHeight;
					that.rate = 750 / res.windowWidth;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	background: #f6f8fb;
	overflow-y: hidden;
}
.swiper_wrapper {
	padding: 40rpx;
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
			background-color: #1b1912;
			height: 100%;
			border-radius: 4rpx;
			&:last-child {
				margin-right: 0;
			}
			&.active {
				background-color: #3b87ff;
			}
		}
	}
	.swiper {
		border-radius: 20rpx;
		overflow: hidden;
		.swiper-item {
			width: 100%;
			height: 100%;
			border-radius: 20rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
				border-radius: 20rpx;
				overflow: hidden;
			}
		}
	}
}

.couponTitle {
	background-color: #ffffff;
	display: flex;
	align-items: center;
	padding: 20rpx 0 20rpx 60rpx;
	.parkingName {
		font-size: 24rpx;
		line-height: 36rpx;
		color: #1b1912;
	}
	.border {
		width: 2rpx;
		height: 20rpx;
		background: #7a818d;
		margin: 0 10rpx;
	}
	.couponTypeName {
		font-size: 20rpx;
		line-height: 36rpx;
		color: #7a818d;
	}
}

.brand_wrapper {
	background-color: #ffffff;
	padding: 20rpx 0;

	.newBrand {
		width: 100%;
		height: 500rpx;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000000000;
	}

	.title {
		margin-bottom: 20rpx;
		font-size: 24rpx;
		font-weight: 400;
		line-height: 36rpx;
		color: #7a818d;
		padding-left: 60rpx;
	}

	.brand_num {
		display: flex;
		justify-content: center;
		margin-bottom: 40rpx;

		.num {
			width: 80rpx;
			height: 80rpx;
			background: #f6f8fb;
			border: 2rpx solid rgba(243, 53, 53, 0.15);
			border-radius: 20rpx;
			font-size: 40rpx;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 80rpx;
			text-align: center;
			color: #4a5361;

			&.active {
				border: 2rpx solid #f33535;
			}

			&.energy {
				text-align: center;

				image {
					margin-top: 12rpx;
					width: 60rpx;
					height: 54rpx;
				}
			}
		}
	}

	.btn {
		width: 188rpx;
		height: 62rpx;
		background: #f33535;
		border-radius: 20rpx;
		margin: 0 auto;
		font-size: 30rpx;
		font-weight: 400;
		line-height: 62rpx;
		color: #ffffff;
		text-align: center;
	}
}

.brand_list {
	margin: 40rpx;
	background: #ffffff;
	opacity: 1;
	border-radius: 20rpx;
	padding: 0 20rpx 20rpx;

	.title {
		font-size: 24rpx;
		font-weight: 400;
		line-height: 36rpx;
		color: #7a818d;
		opacity: 1;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #f6f8fb;
	}

	.list {
		radio-group {
			width: 100%;
			display: flex;
			flex-wrap: wrap;

			.brand {
				padding: 20rpx 0;
				width: 50%;
				display: flex;
				align-items: center;

				.default {
					width: 40rpx;
					height: 20rpx;
					margin-right: 10rpx;

					.defaultText {
						width: 40rpx;
						height: 20rpx;
						background: url('@/static/receiveCoupon/default.png');
						background-size: cover;
					}
				}

				.num {
					&.active {
						font-weight: bold;
					}
				}
			}
		}
	}

	&.brand_bindlist {
	}

	&.brand_historylist {
	}
	
	&.brand_unlicensedCar {
	}
}

.confirmBox {
	background: #f6f8fb;
	padding: 60rpx;
	border-radius: 20rpx 20rpx 0px 0px;
	// border-top-left-radius:20rpx;
	// border-top-right-radius:20rpx;
	// border-bottom-right-radius:0;
	// border-bottom-left-radius:0;

	.title {
		font-size: 30rpx;
		line-height: 36rpx;
		color: #7a818d;
	}

	.brand {
		text-align: center;
		margin: 40rpx 0 100rpx;
		font-size: 60rpx;
		font-weight: bold;
		line-height: 36px;
		color: #1b1912;
	}

	.btns {
		height: 100rpx;
		background: #ffffff;
		border-radius: 20rpx;
		display: flex;

		.btn {
			width: 50%;
			text-align: center;
			line-height: 100rpx;
			font-size: 32rpx;
			color: #7a818d;

			&.active {
				height: 100rpx;
				color: #ffffff;
				background: #f33535;
				border-radius: 20rpx;
			}
		}
	}
}
</style>
