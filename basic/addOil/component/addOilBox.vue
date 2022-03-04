<template>
	<view>
		<view class="wrapper">
			<veiw class="currentStation ft24 fs">
				<view class="ft24">当前加油站</view>
				<view class="fcx" v-if="nearStation.stationName">
					<image :src="Imgpath + nearStation.imgPath" class="stationImg mgr20"></image>
					<view class="ft24 ftweight">{{nearStation.stationName}}</view>
				</view>
			</veiw>
			<view class="grayBox">
				<view class="fcx currentOil mgb40 ftweight">
					<view class="price fcx first" @click="openOilsBox">{{gasType}}# <view class="addcar_arrow"></view>
					</view>
					<view class="price fcy second ft24 ">
						<view>小帮价</view>
						<view>￥{{bzPrice}}/L</view>
					</view>
					<view class="price fcy ft24">
						<view>油站价</view>
						<view>￥{{gasPrice}}/L</view>
					</view>
					<view class="price fcy ft24">
						<view>国标价</view>
						<view>￥{{nationalPrice}}/L</view>
					</view>
				</view>
				<view class="checkOilGun mgb40">
					<view class="mgb40 title ft28 ftweight">
						选择油枪号
					</view>
					<view class="oilGun fs pd40-x" @click="openOilsGunBox">
						<view class="fst">
							<image :src="staticImg + 'static/img/oilGun.png'" mode=""></image>
							<view>{{ gasGunType}}</view>
						</view>
						<view class="icon-triangle"></view>
					</view>
				</view>
				<view class="checkMoney">
					<view class="mgb40 title ft28 ftweight">
						选择加油金额（站内开具发票）
					</view>
					<view class="moneyBox fs">
						<view class="money fst">
							<input type="digit" v-model="inputMoney" @input="focusM" @focus="focusM" placeholder="请输入油表金额" maxlength="7"
							 :disabled="!isPay && !nearStation" />
						</view>
						<view class="money fcy" :class="{'active':activeIndex == index}" v-for="(item,index) in moneyList" :key="index"
						 @click="clickMoney(index)">
							<view class="ft30">￥{{item.value}}</view>
							<view class="ft20" v-if="gasList.length">可优惠￥{{(item.value2)}}</view>
						</view>
					</view>
				</view>
				<view class="payBox fs">
					<view class="fcy ftweight payPrice">
						<veiw class="ft40">￥{{payMoney}}</veiw>
						<veiw class="ft20 mgl10">已优惠￥{{discountMoney}}</veiw>
					</view>
					<view class="payBtn" :class="isPay? 'ok' : 'no' " @click="pay">
						付款
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions,
		mapMutations,
		mapGetters
	} from 'vuex'
	import {
		toFixed2,
		// toFixed8
	} from '@/utils';
	import {
		countStationPayMoney
	} from '@/api'
	export default {
		name: "addOilBox",
		props: {
			gasTypeNum: {
				type: Number,
				default: 0
			},
			gasGunTypeNum: {
				type: Number,
				default: -1
			},
		},
		data() {
			return {
				inputMoney: '',
				originalMoney: 0,
				activeIndex: -1,
				moneyList: [{
					value: 100,
					value2:'0.00'
				}, {
					value: 200,
					value2:'0.00'
				}],
				isPay: false
			}
		},
		computed: {
			...mapState('addOilModule', ['nearStation', 'gasList', 'payMoney', 'discountMoney', ]),
			Imgpath() {
				return this.$store.state.Imgpath
			},
			staticImg() {
				return this.$store.state.staticImg
			},
			gasType() {
				if (this.gasList.length) {
					return this.gasList[this.gasTypeNum].gasType
				} else {
					return '92'
				}
			},
			bzPrice() {
				if (this.gasList.length) {
					return this.gasList[this.gasTypeNum].bzPrice
				} else {
					return '0'
				}
			},
			gasPrice() {
				if (this.gasList.length) {
					return this.gasList[this.gasTypeNum].gasPrice
				} else {
					return '0'
				}
			},
			nationalPrice() {
				if (this.gasList.length) {
					return this.gasList[this.gasTypeNum].nationalPrice
				} else {
					return '0'
				}
			},
			gasGunType() {
				if (this.gasGunTypeNum < 0 || !this.nearStation) {
					return '选择油枪号'
				} else {
					// return this.nearStation.gunNUm[this.gasGunTypeNum]
					return (this.gasGunTypeNum + 1) + '号枪'
				}
			}
		},
		watch: {
			nearStation(newVal, oldVal) {

			},
			gasList(newVal, oldVal) {
				if (newVal.length) {
					if (this.activeIndex > -1) {
						this.isPay = true
						this.setMoney()
					}
				} else {
					this.isPay = false
					this.resetMoney()
					this.activeIndex = -1
					this.inputMoney = ''
				}
				this.setMoneyList()
			},
			gasTypeNum(newVal, oldVal) {
				if (this.activeIndex == -1 && !parseInt(this.inputMoney)) {
					this.resetMoney()
				} else {
					this.setMoney()
				}
				this.setMoneyList()
			},
			originalMoney(newVal, oldVal) {
				if (newVal && newVal != 0) {
					this.setMoney()
					this.emit()
					this.isPay = true
				} else {
					this.resetMoney()
					this.isPay = false
				}

			},
		},
		mounted() {
			this.$nextTick(function() {
				this.$on('reset', this.reset);
			});
			this.moneyList.forEach((item, index) => {
				this.cal(item, index)
			})
		},
		methods: {
			...mapActions("addOilModule", ['countStationPayMoneyFun']),
			...mapMutations('addOilModule', ['resetMoney']),
			emit() {
				this.$emit("getMoney", {
					originalMoney: this.originalMoney,
				})
			},
			reset() {
				this.activeIndex = -1
				this.inputMoney = ''
				this.originalMoney = 0
				this.gasTypeNum = 0
				this.resetMoney()
			},
			focusM(event) {
				this.activeIndex = -1
				setTimeout(() => {
					if (event.detail.value.indexOf('.') > -1) {
						let len = event.detail.value.toString().split(".")[1].length
						if (len > 2) {
							this.inputMoney = toFixed2(event.detail.value)
						}
						this.originalMoney = this.inputMoney
					} else {
						this.originalMoney = this.inputMoney
					}
				}, 0)
			},
			async cal(item, index) {
				let num = item.value
				if (this.gasList) {
					// return (num - toFixed2(toFixed8( num / this.gasPrice) * this.bzPrice)).toFixed(2) 
					const {
						data
					} = await countStationPayMoney({
						payPrice: num,
						stationCode: this.nearStation.stationCode,
						gasType: this.gasType,
						istrue: true
					})
					this.$set(this.moneyList, index, {
						value: item.value,
						value2: data.obj.discount.toFixed(2)
					})
				}
			},
			openOilsBox() {
				this.$emit("openOilsBox")
			},
			openOilsGunBox() {
				this.$emit("openOilsGunBox")
			},
			pay() {
				if (!this.isPay && this.nearStation) {
					uni.showToast({
						title: '请输入或选择加油金额！',
						icon: 'none'
					})
					return false
				}
				if (!this.isPay && !this.nearStation) {
					uni.showToast({
						title: '您附近没有加油站！',
						icon: 'none'
					})
					return false
				}
				if (this.isPay && this.inputMoney < '0.1') {
					uni.showToast({
						title: '请重新输入加油金额！',
						icon: 'none'
					})
					return false
				}
				this.$emit("showPay")
			},
			clickMoney(index) {
				if (this.isPay || this.nearStation) {
					let item = this.moneyList[index]
					this.activeIndex = index
					this.originalMoney = item.value
					this.inputMoney = item.value
					this.isPay = true
				}
			},
			setMoney() {
				this.countStationPayMoneyFun({
					payPrice: this.originalMoney,
					stationCode: this.nearStation.stationCode,
					gasType: this.gasType
				})
			},
			setMoneyList(){
				this.moneyList.forEach((item, index) => {
					this.cal(item, index)
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrapper {
		background: #4a5361;
		border-radius: 50rpx 50rpx 60rpx 60rpx;

		.mgb40 {
			margin-bottom: 40rpx;
		}

		.currentStation {
			height: 100rpx;
			line-height: 100rpx;
			color: $main-white;
			padding: 0 40rpx;

			.stationImg {
				width: 20px;
				height: 20px;
				border-radius: 5px;

				image {
					width: 20px;
					height: 20px;
				}
			}

		}

		.grayBox {
			padding: 40rpx;
			background: $bg-gray;
			border-radius: 50rpx;
		}

		.currentOil {
			background: $main-white;
			height: 120rpx;
			border-radius: 40rpx;
			overflow: hidden;

			.addcar_arrow {
				transform: translateY(50%);
				width: 0;
				height: 0;
				margin-left: 10rpx;
				border-left: 8rpx solid transparent;
				border-right: 8rpx solid transparent;
				border-bottom: 8rpx solid transparent;
				border-top: 8rpx solid #FFFFFF;
			}

			.price {
				width: 25%;
				height: 100%;
				text-align: center;
				color: $main-gray;


				&.first {
					background: $main-red;
					color: $main-white;
					border-radius: 40rpx;
					align-items: center;
				}

				&.second {
					color: $main-red;
					;
				}
			}
		}

		.checkOilGun {
			.oilGun {
				height: 100rpx;
				background: $main-white;
				border-radius: 20rpx;
				color: $main-gray;
				font-size: 24rpx;

				.fst {
					image {
						width: 40rpx;
						height: 40rpx;
						margin-right: 40rpx;
					}
				}

				.icon-triangle {
					// width: 16rpx;
					// height: 16rpx;
					transform: translateY(50%);
					width: 0;
					height: 0;
					margin-left: 10rpx;
					border-left: 8rpx solid transparent;
					border-right: 8rpx solid transparent;
					border-bottom: 8rpx solid transparent;
					border-top: 8rpx solid #1B1912;
				}
			}

			.title {
				color: $main-black;
			}
		}

		.checkMoney {
			margin-bottom: 40rpx;

			.moneyBox {
				.money {
					height: 100rpx;
					background: $main-white;
					border-radius: 20rpx;
					width: 140rpx;


					&:first-child {
						width: 320rpx;
						padding-left: 40rpx;
						box-sizing: border-box;

						input {
							&::placeholder {
								font-size: 30rpx;
								font-weight: bold;
								color: $main-red;
								// opacity: 0.5;
							}

							&::-webkit-input-placeholder {
								/* WebKit browsers */
								color: $main-red;
							}

							&:-moz-placeholder {
								/* Mozilla Firefox 4 to 18 */
								color: $main-red;
							}

							&::-moz-placeholder {
								/* Mozilla Firefox 19+ */
								color: $main-red;
							}

							&:-ms-input-placeholder {
								/* Internet Explorer 10+ */
								color: $main-red;
							}

						}

					}

					.ft30 {
						color: $main-red;
					}

					.ft20 {
						color: $main-gray;
						opacity: 0.5;
					}

					&.active {
						background: $main-red;

						.ft30 {
							color: $main-white;
						}

						.ft20 {
							color: $main-white;
							opacity: 1;
						}
					}
				}
			}

			.title {
				color: $main-black;
			}
		}

		.payBox {
			.payPrice {
				align-items: flex-start;

				.ft40 {
					color: $main-black;
				}

				.ft20 {
					color: #636E74;
				}
			}

			.payBtn {
				width: 320rpx;
				height: 100rpx;
				border-radius: 20rpx;
				font-size: 30rpx;
				text-align: center;
				line-height: 100rpx;
				font-weight: bold;

				&.ok {
					background: $main-red;
					color: $main-white;
				}

				&.no {
					background: $main-gray;
					color: $main-white;
					opacity: 0.5;
				}
			}
		}

		// 燃油标号弹窗
		// .oilsBox {
		// 	border-radius: 50rpx 50rpx 0 0;

		// 	.oils {
		// 		flex-wrap: wrap;

		// 		.oil {
		// 			width: 140rpx;
		// 			height: 200rpx;
		// 			background: $main-white;
		// 			margin-top: 40rpx;
		// 			border-radius: 20rpx;
		// 		}
		// 	}
		// }

		// .oilsGunBox {
		// 	.oils {
		// 		.oil {
		// 			width: 120rpx;
		// 			height: 120rpx;
		// 		}
		// 	}
		// }
	}
</style>
