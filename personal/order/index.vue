<template>
	<view>
		<!-- 头部 -->
		<view class="top fixed" id="top">
			<view class="pd50-y pd40-x fs bgw top" style="width:100%;box-sizing:border-box;z-index:2;">
				<view class="ft50 ftweight rgb27">我的订单</view>
				<view class="ft24 rgb74" @click="togglePayName" v-if='isShowCancle'>删除订单</view>
			</view>
			<!-- 滑动选项 -->
			<view class="tabBars">
				<tabBars :tabBars="tabBarsShow" @onTabTap="onTabTap" :tabIndexInit="tabIndexInit"></tabBars>
			</view>
			<!-- 点击选项 -->
			<view class="app-tabs">
				<view class="tabs-item">
					<view class="tab-item" v-for="(tab, index) in tabs" :class="selectedTabIndex == index ? 'active' : ''" :key="index"
					 @click="tabClick(index)">{{ tab.name }}</view>
				</view>
			</view>
		</view>
		<!-- swiper -->
		<swiper :style="{ height: height }" :current="selectedTabIndex" @change="swiperChange" class="fixed">
			<!--全部 -->
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<mescroll-item :index="index" :tabs="tabs" :tabBars="tabBarsShow" :ref="item.alias" @loadData="loadOrders" @setPayName="setPayName" 
				 :pageIndex="selectedOrderDetail.pageIndex"
				 :hasNext="selectedOrderDetail.hasNext" :curPageLen="selectedOrderDetail.curPageLen" 
				 :checkMode="selectedTab.showPayName"
				 :tabStatus="item.status" :currentTypeId="currentTypeId"></mescroll-item>
			</swiper-item>
		</swiper>
		<!-- 底部 -->
		<view id="footer" class="footer pd40-x pfb fs" v-if="selectedTabIndex == 0 && selectedTab.showPayName">
		      <view class=" pd60-y fcx" @click="selectAllClick">
		        <img :src="isSelectedAll ? staticImg + 'static/img/check.png' : staticImg +'static/img/X_select_0.png'" style="width:30rpx;height:30rpx;" />
		        <view class="rgba74 mg20-x">全选</view>
		        <view class="ftweight ft34 rgb27">合计￥{{ sum }}</view>
		      </view>
		    <view class="btn tac ft28" @click="nav2applyInvoice">{{ selectedTabIndex == 0 ? '合并支付' : '申请开票' }}</view>
		</view>
		<view id="footer" class="footer pd40-x pfb fs" v-if="isCancle">
			<view class=" pd60-y fcx" @click="selectAllClick">
				<img :src="isSelectedAll ? staticImg + 'static/img/check.png' : staticImg +'static/img/X_select_0.png'" style="width:30rpx;height:30rpx;" />
				<view class="rgba74 mg20-x">全选</view>
				<!-- <view class="ftweight ft34 rgb27">合计￥{{ sum }}</view> -->
			</view>
			<view class="btn tac ft28" @click="deleteOrder">删除订单</view>
		</view>
		<Modal v-if="modalShow" :showOk="false" :showCancel="false">
			<view class="modal_content">
				<view class="modal_title pd40-y ft32 ftweight">
					{{order.goods_name }}
				</view>
				<view class="modal_codeImg">
					<image :src="Imgpath + order.write_off_code_url"></image>
				</view>
				<view class="modal_title pd40-y ftweight ft40">
					{{order.write_off_code }}
				</view>
				<view  class="ftweight" style="color: #FF4610;"> 把服务码出示给门店即可验券使用 </view>
				<image :src="staticImg + 'static/img/code_close.png'" class="openModal" @click="closeModal"></image>
			</view>
		</Modal>

		<Modal
			v-if="delModalShow"
			cancel-css="color:#aaa;font-size:30rpx;font-weight:bold;"
			ok-css="color:#FA4242;font-size:30rpx;font-weight:bold;"
			ok-text="取消"
			cancel-text="确定"
			@ok="delModalShow = false"
			@cancel="onOkDel"
		>
			<view class="img-box mgt80"><img class="failTips" src='@/static/img/tip.png' alt="" /></view>
			<view class="mgt30 ft28 ftweight rgb51">提示</view>
			<view class="mgt20 rgb153 ft24 ftweight mgb30">信息删除后不可恢复，</br>是否删除所选订单？</view>
		</Modal>
	</view>
</template>

<script>
	import { tabBars
	} from '@/components/scroll-horizontal-tab/scroll-horizontal-tab.vue'
	import {
		createNamespacedHelpers
	} from 'vuex'
	import MescrollItem from './component/mescroll-swiper-item.vue';
	import {
		orderUtils
	} from '@/utils'
	import http from '@/api/requestIntercept.js'
	import Modal from '@/components/Modal/index.vue'
	
	import {getServiceManageBannerIsShow,deleteOrderBathch} from "@/api" 

	const {
		mapActions,
		mapMutations
	} = createNamespacedHelpers('orderModule2')
	const {
		getOrderTabs,
		caculateOrderMoney,
		getTabBars,
		getTabBars2
	} = orderUtils

	let cancelToken, endErr;

	export default {
		components: {
			MescrollItem,
			tabBars,
			Modal
		},
		data() {
			return {
				tabBarsShow:[], //显示的tab数组
				tabBar: getTabBars(),
				
				tabIndexInit:0, //默认订单类型索引
				tabName: '停车',//默认订单类型
				currentTypeId: 1, //当前订单类型id
				selectedTabIndex: 0, // 状态tab下标索引
				
				checkedCollection: {
					checkedOrderCodes: [],
				},
				isClickChange: false, //区分点击与滑动，避免重复请求
				height: '', // 需要固定swiper的高度
				order: {},
				modalShow: false,
				socketTask: null,
				isScan:false,
				isShowCancle:false,
				isCancle:false,
				delModalShow:false,//删除订单对话框
			};
		},
		provide() {
			return {
				checkedCollection: this.checkedCollection,
				itemCheckClick: (orderId) => this.itemCheckClick(orderId)
			}
		},
		computed: {
			// 状态栏
			tabs(){
				return  getTabBars2(this.tabIndexInit)
			},
			// 当前状态
			selectedTab: {
				get() {
					return this.tabs[this.selectedTabIndex]
				},
				set(value) {
					 this.$emit('input', value)
				}
			},
			selectedOrderDetail() {
				return this.$store.getters['orderModule2/selectedOrderDetail'](this.selectedTab)
			},
			isSelectedAll() {
				return this.checkedCollection.checkedOrderCodes.length ? this.checkedCollection.checkedOrderCodes.length === this.selectedOrderDetail.orders.length : false
			},
			sum() {
				return caculateOrderMoney(this.selectedOrderDetail.orders, this.checkedCollection.checkedOrderCodes)
			},
			Imgpath() {
				return this.$store.state.Imgpath
			},
			staticImg() {
				return this.$store.state.staticImg
			},
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
		mounted() {
			var that = this
			this.getShowData() //控制栏目是否显示
			
			// 监听显示车检二维码
			that.$bus.$off('showToast')
			that.$bus.$on('showToast', (val) => {
				that.modalShow = true
				that.order = val
				that.connectWebsocket() //连接Socket
			});
			uni.$off('update')
			uni.$on('update',function(data){
				console.log('update-data:' + data)
				if (data !== undefined) {
					that.selectedTabIndex = data
					console.log(that.tabIndexInit)
					console.log(that.selectedTabIndex)
					that.destroyed()
					// 更新列表
					that.tabChange(that.selectedTabIndex)
				}
		   })
		},
		watch:{
			// 监听显示删除入口
			selectedTabIndex(n,o){
				if((this.currentTypeId == 1  && n == 2) || (this.currentTypeId == 3) || (this.currentTypeId == 7  && n != 0)
				|| (this.currentTypeId == 2  && n == 2) || (this.currentTypeId == 8  && n != 0)|| (this.currentTypeId == 6  && n != 0)
				){
					this.isShowCancle = true
				}else{
					this.isShowCancle = false
				}
			},
			tabIndexInit(){
				if((this.currentTypeId == 1  && this.selectedTabIndex == 2) || (this.currentTypeId == 3) || (this.currentTypeId == 7  && this.selectedTabIndex != 0)
				|| (this.currentTypeId == 2  && this.selectedTabIndex == 2) || (this.currentTypeId == 8  && this.selectedTabIndex != 0)|| (this.currentTypeId == 6  
				&& this.selectedTabIndex != 0)
				){
					this.isShowCancle = true
				}else{
					this.isShowCancle = false
				}
			}
		},
		onLoad(option) {
			if(option.tabName){
				this.tabName = option.tabName
			}
			if(option.statusIndex){
				this.isScan = true
				this.selectedTabIndex = option.statusIndex
			}
			
		},
		onShow() {
			// 需要固定swiper的高度
			this.height = uni.getSystemInfoSync().windowHeight + 'px';
			
		},
		methods: {
			...mapActions(['getUnpaiedOrdersAction', 'getOngoingOrdersAction', 'getFinishedOrdersAction']),
			...mapMutations(['resetOrderDetails']),
			// 关闭websocket
			closeSocket() {
				console.log("WebSocket2开始关闭")
				this.socketTask.close()
			},
			togglePayName(){
				this.isCancle = !this.isCancle
				uni.$emit('delOrder',this.isCancle)
				this.$store.state.isDelete =  this.isCancle
			},
			// 关闭二维码弹窗
			closeModal(){
				this.modalShow = false
				this.closeSocket()
			},
			// 重连websocket
			async connectWebsocket(){
				await this.connectSocket(this.$store.state.userInfo.usersPhone);
			},
			connectSocket(data) {
				var that = this
				console.log("WebSocket2开始连接")
				if (data) {
					that.socketTask = uni.connectSocket({
						url: 'wss://' +  that.$store.state.wssUrl2 + '/websocket?token=' + data + 'wx',
						header: {
							'content-type': 'application/json',
						},
						method: "GET",
						complete: () => {}
					})
					that.socketTask.onOpen(function(res) {
						console.log('WebSocket2连接已打开！');
						// uni.showToast({
						//     title: '连接已打开',
						// 	icon:'none'
						// })
					})
					that.socketTask.onClose(function(res) {
						console.log('WebSocket2已关闭！')
						// uni.showToast({
						//     title: '连接已关闭',
						// 	icon:'none'
						// })
						if(res.code != 1000){
							that.connectSocket(data)
						}
					})
					that.socketTask.onMessage(function(res) {
						that.modalShow = false
						uni.showToast({
							title: '核销成功',
							icon:'none'
						})
						that.closeSocket()
						setTimeout(() => { 
							that.destroyed()
							that.selectedTabIndex = 1;
							that.tabChange(that.selectedTabIndex)
						},2000)
					})
				}
			},
			async getShowData(){
				const {data} = await getServiceManageBannerIsShow()
				// 0 停车 1加油 2洗车 3车位租赁 4车辆保养 5 车辆检测
				this.tabBar[0].isShow = data.obj.parkingIsShow //停车
				this.tabBar[1].isShow = data.obj.refuelIsShow // 加油
				this.tabBar[2].isShow = data.obj.washCarIsShow //洗车
				this.tabBar[3].isShow = data.obj.rentIsShow //车位租赁
				this.tabBar[4].isShow = data.obj.vehicleMaintenanceIsShow //车辆保养
				this.tabBar[5].isShow = data.obj.carInspectIsShow //车辆检测
				// this.tabBar[6].isShow = data.obj.otherIsShow
				
				// 显示的数组
				this.tabBarsShow = this.tabBar.filter((item, i) => {
					return item.isShow == 1
				})
				
				let index = 0
				if(this.tabName){
					this.tabBar.map((item, i) => {
						if (item.name == this.tabName) {
							index = i
						}
					})
				}else{
					this.tabBar.map((item, i) => {
						if (item.name == arr[0].name) {
							index = i
						}
					})
				}
				this.onTabTap(index) //初始化栏目下的状态栏
				
			},
			// 点击订单类型
			onTabTap(index) {
				// setTimeout(()=>{
					this.tabIndexInit = index
				// },300)
				// this.destroyed()
				this.currentTypeId = this.tabBar[index].id
				this.isCancle = false
				uni.$emit('delOrder',this.isCancle)
				this.$store.state.isDelete =  this.isCancle
				this.checkedCollection.checkedOrderCodes = []
				console.log(this.currentTypeId)
				if(this.isScan){
					this.tabChange(this.selectedTabIndex)
				}else{
					this.tabChange(0)
					
				}
				this.isScan = false
				
			},
			// 滑动
			swiperChange(swiper) {
				if (this.isClickChange) {
					this.isClickChange = false
					return
				}
				this.tabChange(swiper.detail.current)
				this.isClickChange = false
				this.isCancle = false
				uni.$emit('delOrder',this.isCancle)
				this.$store.state.isDelete =  this.isCancle
				this.checkedCollection.checkedOrderCodes = []
			},
			// 点击状态
			tabClick(tabIndex) {
				this.isClickChange = true;
				this.isCancle = false
				uni.$emit('delOrder',this.isCancle)
				this.$store.state.isDelete =  this.isCancle
				this.checkedCollection.checkedOrderCodes = []
				// if (this.selectedTabIndex === tabIndex) return
				this.tabChange(tabIndex)
			},
			tabChange(tabIndex) {
				this.selectedTabIndex = tabIndex;
				this.destroyed()
				setTimeout(()=>{
					
					// if (this.selectedOrderDetail.orders.length === 0 && this.selectedOrderDetail.firstLoad) {
					// 	this.cancelRequest()
					// 	console.log(this.selectedTab.name + "请求")
						this.updateMescroll(this.selectedTabIndex)
						
					// }
				},300)
				
			},
			async loadOrders(page, endSuccess, endError) {
				const hasZero = this.currentTypeId == 1 && page.tabStatus == 3 ? 2 : 0
				const reset = page.isDownScrolling
				cancelToken = +new Date()
				endErr = endError
				await this[this.selectedTab.loadOrderActionName]({
					pageIndex: page.page.num,
					status: page.tabStatus,
					type: this.currentTypeId,
					hasZero,
					reset,
					cancelToken
				})
				// endErr = null
				// cancelToken = null
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
			// 合并支付
			nav2applyInvoice() {
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
			// 删除订单
			deleteOrder() {
				const checkedOrderStr = this.checkedCollection.checkedOrderCodes.join(',')
				if (this.checkedCollection.checkedOrderCodes.length === 0) {
					uni.showToast({
						title: '请选择订单',
						icon: 'none'
					})
					return
				}
				this.$store.commit('set_applyOrderId', checkedOrderStr)
				this.delModalShow = true
				
			},
			async onOkDel(){
				const {data} = await deleteOrderBathch({
					orederIds: this.$store.state.applyOrderId,
					type:this.currentTypeId
				})
				if(data.code == 1){
					this.delModalShow = false
					uni.showToast({
						title:'删除成功',
						icon:'none'
					})
					this.tabChange(this.selectedTabIndex)
					// setTimeout(() => {
					// 	this.checkedCollection.checkedOrderCodes = []
					// }, 500)
				}
				
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
			},
			destroyed() {
				this.resetOrderDetails()
			}
		},

	};
</script>
<style lang="stylus">
#top
	z-index 1
.tabBars
	// height 120rpx
	box-sizing border-box
	background #FFFFFF
	// padding-bottom 40rpx
.app-tabs
	position relative
	height 100rpx
	line-height 100rpx
	font-size 24rpx
	background-color #fff
	border-bottom 1rpx solid #eee
	z-index 10
.app-tabs .tabs-item
	display flex
	text-align center
	justify-content space-around
	padding 0 10rpx
	margin-top 20rpx;
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
.modal_content
	width 670rpx
	height 870rpx
	box-sizing border-box
	padding 0 40rpx 100rpx
	background url(@/assets/codeBg.png)
	background-size cover
	.modal_codeImg
		padding 40rpx 80rpx
		image
			width 440rpx
			height 440rpx
	.openModal
		width 64rpx
		height 64rpx
		position absolute
		left 50%
		margin-left -32rpx
		bottom -100rpx
.failTips
	width 120rpx
	height 120rpx
</style>