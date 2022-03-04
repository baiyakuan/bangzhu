<template>
	<div>
		<div class="bg239" v-if="list.length">
			<div :class="[currentIndex == index ? 'selected' : '']" v-for="(item, index) in list" :key="index" @click="onSelect(item, index)">
				<div class="pd20 fs" style="padding:0rpx 50rpx 20rpx 50rpx;" v-if="item.isUse">
					<!-- 优惠券列表 -->
					<div class="pdt30" v-if="list.length != 0">
						<div :class="[item.title == 'PLUS会员专享' ? 'cardcoupon_plus' : 'cardcoupon']">
							<img v-if="item.checked" :src="staticImg + 'static/img/selected.png'" class="select_card" style="width:50rpx;height:50rpx;" />
							<div class="fi mg40-x">
								<!-- 优惠券logo -->
								<div class="pdr10 pdt10" v-if="item.logo"><img class="logo" :src="Imgpath + item.logo" /></div>
								<!-- 优惠券标题 -->
								<div class="ft22 rgb153 pdt10" v-if="item.logo">{{ item.title }}</div>
								<div class="ft22 rgb153" v-else>{{ item.title }}</div>
							</div>
							<div class="fs ft36 mg40-x" :class="[!item.logo ? 'mgt40' : 'mgt28']">
								<!-- 优惠券类别名 -->
								<div class="ft36 rgb27">{{ item.distypename }}</div>
								<!-- 优惠券金额 -->
								<div class="fi" v-if="item.type == 2 && item.discountType == 2">
									<!-- <div class="ft24" :class="item.isSpecial==1?'gold-word':'main-s'">￥</div>
					  <div class="ft36" :class="item.isSpecial==1?'gold-word':'main-s'">{{item.discountNum}}</div> -->
									<div class="ft42 ftweight rgb243">{{ item.discountNum }}</div>
									<div class="ft24 rgb243 mgl10">h</div>
								</div>
								<div class="fi" v-else>
									<!-- <div class="ft24" :class="item.isSpecial==1?'gold-word':'main-s'">￥</div>
					  <div class="ft36" :class="item.isSpecial==1?'gold-word':'main-s'">{{item.discountNum}}</div> -->
									<div class="ft24" :class="item.title == 'PLUS会员专享' ? 'gold-word' : 'rgb243'">￥</div>
									<div class="ft42 ftweight" :class="item.title == 'PLUS会员专享' ? 'gold-word' : 'rgb243'">{{ item.discountNum }}</div>
								</div>
								<!-- <div class="fi" :class="[item.title=='PLUS会员专享'?'rgb231':'rgb243']">
						<div class="ft24">￥</div>
						<div class="ft36">{{item.discountNum}}</div>
				  </div> -->
							</div>
							<!-- 优惠券有效期 -->
							<div class="fs mg40-x mgt55">
								<div class="ft17 rgb51">{{ item.parkintName }}</div>
								<div class="ft17 rgb51">有效期至 {{ item.expiryDate }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- <div class="button">
		  <button class="btn cancel_btn" @click="onCancel">取消</button>
		  <button class="btn confirm_btn" @click="onConfirm">确定</button>
		</div> -->
		</div>
		<div v-if="list.length == 0 || allUsed" style="width:100%;text-align:center; padding-top:170rpx">
			<img :src="staticImg + 'static/img/noCoupons.png'" style="width:300rpx;height:160rpx" />
			<p class="no_data">暂无可用优惠券</p>
		</div>
	</div>
</template>

<script>
import { orderDiscountList } from '@/api';
import store from '@/store';
export default {
	data() {
		return {
			list: [],
			currentIndex: -1,
			pageIndex: 1,
			lastpage: false,
			discount: null,
			type: 2, //1 合并支付优惠券     2 单笔支付可用优惠券
			discountOrder: [], // 选择优惠券的订单
			state: 0 ,// 0 单笔订单 1 多笔订单
			allUsed: false
		};
	},
	// #ifdef MP-WEIXIN
	// 微信分享小程序给朋友
	onShareAppMessage() {
		return {
			title: '推荐一个好用的停车工具',
			path: '/pages/index/index'
		};
	},
	// #endif
	async onPullDownRefresh() {
		// 停止下拉刷新
		this.loadremove();
	},

	// 上拉加载，拉到底部触发
	async onReachBottom() {
		// 到这底部在这里需要做什么事情
		this.loadmore();
	},
	computed: {
		Imgpath() {
			return store.state.Imgpath;
		},
		staticImg() { return this.$store.state.staticImg },
	},
	methods: {
		//下拉刷新事件
		async loadremove() {
			this.pageIndex = 1;
			this.lastpage = false;
			var orderId = store.state.orderIdDetail;
			if (this.type == 1) {
				orderId = store.state.applyOrderId;
			}
			const { data } = await orderDiscountList({
				pageIndex: this.pageIndex,
				orderId,
				type: this.type
			});
			if (data.code == '1') {
				setTimeout(() => {
					this.list = [];
					wx.stopPullDownRefresh();
					this.list = data.obj.discountList.map(item => {
						return {
							...item,
							checked: false,
							isUse: true
						};
					});
					if (this.state) {
						this.list.forEach((item, index) => {
							this.discountOrder.map(item2 => {
								if (item2.discount) {
									if (item2.discount.userDisCountId == item.userDisCountId) {
										if (item2.id == store.state.orderIdDetail) {
											item.checked = true;
										} else {
											item.isUse = false;
										}
									}
								}
							});
						});
						let flag = this.list.every((item,index) => {
							return item.isUse == false //全部不能使用
						})
						flag ? this.allUsed = true : this.allUsed = false
					} else {
						this.list.forEach((item, index) => {
							if (store.state.discount) {
								if (store.state.discount.userDisCountId == item.userDisCountId) {
									item.checked = true;
								}
							} else {
								return;
							}
						});
					}
				}, 1000);
			}
		},
		//上拉加载事件
		async loadmore() {
			let that = this;
			var orderId = store.state.orderIdDetail;
			if (this.type == 1) {
				orderId = store.state.applyOrderId;
			}
			if (!that.lastpage) {
				that.pageIndex += 1;
				const { data } = await orderDiscountList({
					pageIndex: that.pageIndex,
					orderId,
					type: this.type
				});
				if (data.code == '1') {
					let arr = [];
					if (data.obj.discountList.length) {
						arr = data.obj.discountList;
						if (this.state) {
							for (var i = 0; i < arr.length; i++) {
								arr[i].checked = false;
								arr[i].isUse = true;
								this.discountOrder.map(item2 => {
									if (item2.discount) {
										if (item2.discount.userDisCountId == arr[i].userDisCountId) {
											if (item2.id == store.state.orderIdDetail) {
												arr[i].checked = true;
											} else {
												arr[i].isUse = false;
											}
										}
									}
								});
								that.list.push(arr[i]);
							}
							let flag = this.list.every((item,index) => {
								return item.isUse == false //全部不能使用
							})
							flag ? this.allUsed = true : this.allUsed = false
						} else {
							for (var i = 0; i < arr.length; i++) {
								if (store.state.discount) {
									if (store.state.discount.userDisCountId == arr[i].userDisCountId) {
										arr[i].checked = true;
									} else {
										arr[i].checked = false;
									}
								} else {
									arr[i].checked = false;
								}
								that.list.push(arr[i]);
							}
						}
					} else {
						wx.showToast({
							title: '暂无更多优惠券',
							icon: 'none',
							duration: 1000
						});
					}
				}
			}
		},
		// 获取优惠券列表
		async orderDiscountList() {
			var orderId = store.state.orderIdDetail;
			if (this.type == 1) {
				orderId = store.state.applyOrderId;
			}
			const { data } = await orderDiscountList({
				pageIndex: this.pageIndex,
				type: this.type,
				orderId
			});
			if (data.code == 1) {
				this.list = data.obj.discountList.map(item => {
					return {
						...item,
						checked: false,
						isUse: true
					};
				});
				if (this.state) {
					this.list.forEach((item, index) => {
						this.discountOrder.map(item2 => {
							if (item2.discount) {
								if (item2.discount.userDisCountId == item.userDisCountId) {
									if (item2.id == store.state.orderIdDetail) {
										item.checked = true;
									} else {
										item.isUse = false;
									}
								}
							}
						});
					});
					let flag = this.list.every((item,index) => {
						return item.isUse == false //全部不能使用
					})
					flag ? this.allUsed = true : this.allUsed = false
				} else {
					this.list.forEach((item, index) => {
						if (store.state.discount) {
							if (store.state.discount.userDisCountId == item.userDisCountId) {
								item.checked = true;
							}
						} else {
							return;
						}
					});
				}
			}
		},
		// 点击优惠券
		onSelect(discount, i) {
			this.currentIndex = i;
			if (this.list[i].checked == false) {
				this.list.forEach((item, index) => {
					if (index == i) {
						item.checked = !item.checked;
					} else {
						item.checked = false;
					}
				});
				if (this.state) {
					this.discountOrder.map(item => {
						if (item.id == store.state.orderIdDetail) {
							item.discount = discount;
						}
					});
					store.commit('set_discountOrder', this.discountOrder);
				} else {
					store.commit('set_discount', discount);
				}
			} else {
				this.list.forEach((item, index) => {
					if (index == i) {
						item.checked = !item.checked;
					} else {
						item.checked = false;
					}
				});
				if (this.state) {
					this.discountOrder.map(item => {
						if (item.id == store.state.orderIdDetail) {
							item.discount = null;
						}
					});
					store.commit('set_discountOrder', this.discountOrder);
				} else {
					store.commit('set_discount', null);
				}
			}
			setTimeout(() => {
				wx.navigateBack({
					delta: 1
				});
			}, 100);
		}
		// onCancel(){
		//   store.commit("set_discount", null)
		//   setTimeout(() => {
		//     wx.navigateBack({
		//       delta: 1
		//     })
		//   },100)
		// },
		// onConfirm(){
		//   if(this.discount){
		//     store.commit("set_discount", this.discount)
		//     setTimeout(() => {
		//       wx.navigateBack({
		//         delta: 1
		//       })
		//     },100)
		//   } else {
		//     wx.showToast({
		//       title:'请选择优惠券',
		//       icon:'none',
		//     })
		//   }
		// },
	},

	onShow() {
		this.orderDiscountList();
	},
	onLoad(option) {
		if (option.type) {
			this.type = option.type;
		}
		if (option.state) {
			this.state = option.state;
			this.discountOrder = store.state.discountOrder;
		}
	}
};
</script>

<style lang="stylus">
page
	background rgb(239, 244, 248)
.ft48
	font-size 48rpx
.cardcoupon
	position relative
	background url('~@/assets/parking_coupons_bg.png')
	width 650rpx
	/* height 220rpx */
	padding-bottom 10rpx
	background-size 100% 100%
	background-repeat no-repeat
	border-radius 0 0 6rpx 6rpx
	box-shadow -2rpx 0 4rpx #ccc
.cardcoupon_plus
	position relative
	background url('~@/assets/parking_couponsPlus_bg.png')
	width 650rpx
	/* height 220rpx */
	padding-bottom 10rpx
	background-size 100% 100%
	background-repeat no-repeat
	border-radius 0 0 6rpx 6rpx
	box-shadow -2rpx 0 20rpx #ccc
.card
	background-image url('~@/assets/parking_coupons_bg.png')
	width 47%
	height 200rpx
	background-size contain
	background-repeat no-repeat
	&:nth-child(2n-1)
		margin-right 40rpx
.cardcoupon_a
	float left
	position absolute
	width 430rpx
	padding-left 65rpx
	padding-top 15rpx
	padding-bottom 15rpx
.cardcoupon_b
	position absolute
	right 135rpx
	padding-top 30rpx
	width 165rpx
	height 100rpx
	text-align center
.select_card
	width 50rpx
	height 50rpx
	position absolute
	right 0
	top 0
.button
	width 100%
	height 160rpx
	position fixed
	bottom 0
	line-height 160rpx
	background #fff
.btn
	width 275rpx
	height 80rpx
	float left
	border-radius 8rpx
	color #fff
	line-height 80rpx
.cancel_btn
	position absolute
	left 80rpx
	top 50%
	margin-top -40rpx
	background-color rgb(74, 83, 97)
.confirm_btn
	position absolute
	right 80rpx
	top 50%
	margin-top -40rpx
	background-color #000
.i-checkbox
	.i-cell
		background-color red
.list
	display flex
	flex-wrap wrap
.pa
	// border-radius: 50%;
	right 20rpx
.logo
	width 50rpx
	height 36rpx
.rgb153
	color rgb(153, 153, 153)
.rgb51
	color rgb(51, 51, 51)
</style>
