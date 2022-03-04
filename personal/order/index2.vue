<template>
	<view>
		<!-- 头部 -->
		<view class="top fixed" id="top" style="z-index: 9999;">
			<view class="pd50-y pd40-x fs bgw top" style="width:100%;box-sizing:border-box;z-index:2;">
				<view class="ft50 ftweight rgb27">我的订单</view>
				<view class="ft24 rgb74" v-if="tabs[selectedTabIndex].status == 3" @click="togglePayName">{{ showPayName ? '返回订单' : '合并支付' }}</view>
			</view>
			<!-- 点击选项 -->
			<view class="app-tabs">
				<view class="tabs-item">
					<view class="tab-item" v-for="(tab, index) in tabs" :class="selectedTabIndex == index ? 'active' : ''" 
						:key="index" @click="tabClick(index)">{{ tab.name }}</view>
				</view>
			</view>
		</view>
		<!-- swiper -->
		<swiper :style="{ height: height }" :current="selectedTabIndex" @change="swiperChange" class="fixed">
			<!--全部 -->
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<mescroll-item
					:index="index"
					:tabs="tabs"
					:ref="item.alias"
					@loadData="loadOrders"
					:pageIndex="selectedOrderDetail.pageIndex"
					:hasNext="selectedOrderDetail.hasNext"
					:curPageLen="selectedOrderDetail.curPageLen"
					:checkMode="showPayName"
					:tabStatus="item.status"
				></mescroll-item>
			</swiper-item>
		</swiper>
		<!-- 底部 -->
		<view id="footer" class="footer pd40-x pfb fs" v-if="selectedTabIndex == 0 && showPayName">
			<view class=" pd60-y fcx" @click="selectAllClick">
				<img :src="isSelectedAll ? staticImg + 'static/img/check.png' : staticImg +'static/img/X_select_0.png'" style="width:30rpx;height:30rpx;" />
				<view class="rgba74 mg20-x">全选</view>
				<view class="ftweight ft34 rgb27">合计￥{{ sum }}</view>
			</view>
			<view class="btn tac ft28" @click="nav2applyInvoice">{{ selectedTabIndex == 0 ? '支付' : '申请开票' }}</view>
		</view>
	</view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MescrollItem from './component/mescroll-swiper-item.vue';
import { orderUtils } from '@/utils'
import http from '@/api/requestIntercept.js'


const { mapActions, mapMutations } = createNamespacedHelpers('orderModule')
const { getOrderTabs, caculateOrderMoney } = orderUtils

let cancelToken, endErr;

export default {
	components: {
		MescrollItem
	},
	data() {
		return {
			tabs: getOrderTabs(),
			selectedTabIndex: 0, // tab下标
			height: '', // 需要固定swiper的高度
			checkedCollection: {
				checkedOrderCodes: [],
			},
			isClickChange: false
		};
	},
	provide() {
		return {
			checkedCollection: this.checkedCollection,
			itemCheckClick: (orderId) => this.itemCheckClick(orderId)
		}
	},
	computed: {
		selectedTab() {
			return this.tabs[this.selectedTabIndex]
		},
		selectedOrderDetail() {
			return this.$store.getters['orderModule/selectedOrderDetail'](this.selectedTab)
		},
		isSelectedAll() {
			return this.checkedCollection.checkedOrderCodes.length === this.selectedOrderDetail.orders.length
		},
		sum() {
			return caculateOrderMoney(this.selectedOrderDetail.orders, this.checkedCollection.checkedOrderCodes)
		},
		showPayName: {
			get() {
				return this.selectedTab.showPayName;
			},
			set(value) {
				this.selectedTab.showPayName = value;
			}
		},
		staticImg() { return this.$store.state.staticImg } ,
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
	methods: {
		...mapActions(['getUnpaiedOrderAction', 'getOngoingOrders', 'getFinishedOrders']),
		...mapMutations(['resetOrderDetails']),
		togglePayName() {
			if (this.showPayName !== undefined) {
				this.showPayName = !this.showPayName;
				if (this.showPayName && this.selectedOrderDetail.firstLoad) {
					this.updateMescroll(this.selectedTabIndex)
				}
			}
		},
		swiperChange(swiper) {
			if (this.isClickChange) {
				this.isClickChange = false
				return
			}
			this.tabChange(swiper.detail.current)
			this.isClickChange = false
		},
		tabClick(tabIndex) {
			this.isClickChange = true;
			this.tabChange(tabIndex)
		},
		tabChange(tabIndex) {
			if (this.selectedTabIndex === tabIndex) return
			this.cancelRequest()
			this.selectedTabIndex = tabIndex;
			this.showPayName = false;
			if (this.selectedOrderDetail.orders.length === 0 && this.selectedOrderDetail.firstLoad) {
				this.updateMescroll(this.selectedTabIndex)
			}
		},
		async loadOrders(page, endSuccess, endError) {
			const hasZero = this.selectedTab.status == 3 ? 2 : 0
			const reset = page.isDownScrolling
			cancelToken = + new Date()
			endErr = endError
			await this[this.selectedTab.loadOrderActionName]({pageIndex: page.num, hasZero, reset, cancelToken})
			endErr = null
			cancelToken = null
			endSuccess(this.selectedOrderDetail.curPageLen, this.selectedOrderDetail.hasNext)
		},

		itemCheckClick(orderId) {
			let orderSet = new Set(this.checkedCollection.checkedOrderCodes)
			if (orderSet.has(orderId)) {
				orderSet.delete(orderId)
			} else {
				orderSet.add(orderId)
			}
			this.checkedCollection.checkedOrderCodes = Array.from(orderSet)
		},
		selectAllClick() {
			if (this.isSelectedAll) {
				this.checkedCollection.checkedOrderCodes = []
			} else {
				this.selectedOrderDetail.orders.reduce((checkedCodes, currentValue) => {
					if (!checkedCodes.includes(currentValue.orderId)) {
						checkedCodes.push(currentValue.orderId)
					}
					return checkedCodes
				}, this.checkedCollection.checkedOrderCodes)
			}
		},

		nav2applyInvoice () {
			const checkedOrderStr = this.checkedCollection.checkedOrderCodes.join(',')
		  if (this.checkedCollection.checkedOrderCodes.length === 0) {
			uni.showToast({
			  title: '请选择订单',
			  icon: 'none'
			})
			return
		  }
		  this.$store.commit('set_applyOrderId', checkedOrderStr)
		  uni.navigateTo({
				url: `/personal/order/allPay/index?sum=${this.sum}`,
		  })
		  setTimeout(() => {
			  this.checkedCollection.checkedOrderCodes = []
		  }, 500)
		},
		updateMescroll(index) {
			if (index == 0) {
				this.$refs.unpaid[0].resetMescroll();
			} else if (index == 1) {
				this.$refs.ongoing[0].resetMescroll();
			} else {
				this.$refs.finished[0].resetMescroll();
			}
		},
		cancelRequest() {
			cancelToken && http.cancelRequests(new Set([cancelToken]))
			endErr && endErr()
			cancelToken = null
			endErr = null
		}
	},
	onLoad(option) {
		if (option.selectedTabIndex) {
			this.selectedTabIndex = option.selectedTabIndex;
		}
		setTimeout(() => {
			this.updateMescroll(this.selectedTabIndex)
		}, 500);
	},
	onShow() {
		// 需要固定swiper的高度
		this.height = uni.getSystemInfoSync().windowHeight + 'px';
	},
	destroyed() {
		this.resetOrderDetails()
	}

};
</script>

<style lang="stylus">
.app-tabs
	position relative
	height 60rpx
	line-height 60rpx
	font-size 24rpx
	background-color #fff
	border-bottom 1rpx solid #eee
	z-index 10
.app-tabs .tabs-item
	display flex
	text-align center
	padding 0 10rpx
.app-tabs .tabs-item .tab-item
	margin 0 30rpx
	color rgba(74, 83, 98, 1)
	font-size 28rpx
	flex none
.app-tabs .tabs-item .tab-item.active
	color rgba(243, 53, 53, 1)
	font-weight bold
	position relative
.app-tabs .tabs-item .tab-item.active::after
	content '' /* CSS伪类用法 */
	position absolute /* 定位背景横线的位置 */
	bottom 0
	left 0
	background #F33535 /* 宽和高做出来的背景横线 */
	width 100%
	height 2rpx
.footer
	width 100%
	background #fff
	z-index 1000
	box-sizing border-box
.footer:after
	content ''
	display block
	clear both
.btn
	position absolute
	top 50%
	right 40rpx
	width 180rpx
	height 80rpx
	background #000
	line-height 80rpx
	color #fff
	border-radius 20rpx
	margin-top -40rpx
.fixed
	position fixed
	top 0
	left 0
	width 100%
</style>
