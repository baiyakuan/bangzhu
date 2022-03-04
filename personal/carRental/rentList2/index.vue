<template>
<div>
	<!-- 头部 -->
	<div class="pd50-y pd40-x fs bgw top" style="width:100%;box-sizing:border-box;z-index:2;">
      <!-- <div class="ft50 ftweight rgb27">{{options.id == 2?'会员订单':options.id == 1?'我的租赁':'停车订单'}}</div> -->
	  <div class="ft50 ftweight rgb27">{{pageTitle}}</div>
	  <!-- <div class="ft24 rgb74" @click="changeInvoice">{{!options.isInvoice?'申请开票':options.id == 2?'返回PLUS会员':'返回订单'}}</div>  -->
    </div>
	<!-- 列表 -->
	<mescroll-uni class="mescroll" ref="mescrollRef" 
		:down="downOption" @down="downCallback" 
		:up="upOption" @up="upCallback" 
		:fixed="true"
		:bottom="bottom" top="166" 
		@emptyclick="emptyClick">
			<order-card :rentListData='allRentListData' v-if="allRentListData.length" :showType="options"></order-card>	
	</mescroll-uni>
	<!-- 底部 -->
	<view v-if="options.isInvoice" class="footer pd40-x pfb fs">
	  <view class=" pd60-y fcx" @click="selectAll">
			<img :src="isSelectAll?staticImg + 'static/img/check.png':staticImg + 'static/img/X_select_0.png'" class="" style="width:30rpx;height:30rpx;" alt="">
		  <view class="rgba74 mg20-x">全选</view>
		<view class="ftweight ft34 rgb27">合计￥{{selectListSum}}</view>
	  </view>
	  <view class="btn tac ft28" @click="nav2applyInvoice">申请开票</view>
	</view>
</div>
</template>

<script>
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
import orderCard from "@/components/orderCard/index/index.vue"

import { mapState ,mapActions, mapGetters,mapMutations } from 'vuex'
import { mapOrderListData } from '@/utils'
export default {
	mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
	components:{
		MescrollUni,
		orderCard
	},
	data () {
		return {
			pageTitle:'我的租赁',
			pageType:1,//1-租赁 2-车辆管理
			options:{
				id:0,
				isInvoice:false,
			},	
			bottom:0,
			// 下拉刷新
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
				native: false, // 是否使用系统自带的下拉刷新; 默认false; 仅mescroll-body生效 (值为true时,还需在pages配置enablePullDownRefresh:true;详请参考mescroll-native的案例)
				autoShowLoading: false, // 如果设置auto=true(在初始化完毕之后自动执行下拉刷新的回调),那么是否显示下拉刷新的进度; 默认false
				isLock: false, // 是否锁定下拉刷新,默认false;
				offset: 80, // 在列表顶部,下拉大于80upx,松手即可触发下拉刷新的回调
				fps: 80, // 下拉节流 (值越大每秒刷新频率越高)
				inOffsetRate: 1, // 在列表顶部,下拉的距离小于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
				outOffsetRate: 0.2, // 在列表顶部,下拉的距离大于offset时,改变下拉区域高度比例;值小于1且越接近0,高度变化越小,表现为越往下越难拉
				bottomOffset: 20, // 当手指touchmove位置在距离body底部20upx范围内的时候结束上拉刷新,避免Webview嵌套导致touchend事件不执行
				minAngle: 45, // 向下滑动最少偏移的角度,取值区间  [0,90];默认45度,即向下滑动的角度大于45度则触发下拉;而小于45度,将不触发下拉,避免与左右滑动的轮播等组件冲突;
				bgColor: "transparent", // 背景颜色 (建议在pages.json中再设置一下backgroundColorTop)
				textColor: "gray", // 文本颜色 (当bgColor配置了颜色,而textColor未配置时,则textColor会默认为白色)
				textInOffset: '下拉刷新', // 下拉的距离在offset范围内的提示文本
				textOutOffset: '释放更新', // 下拉的距离大于offset范围的提示文本
				textLoading: '加载中 ...' // 加载中的提示文本
			},
			// 上拉加载
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				isLock: false, // 是否锁定上拉加载,默认false;
				isBoth: true, // 上拉加载时,如果滑动到列表顶部是否可以同时触发下拉刷新;默认true,两者可同时触发;
				isBounce: false, // 默认禁止橡皮筋的回弹效果, 必读事项: http://www.mescroll.com/qa.html?v=190725#q25
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10, // 每页数据的数量
					time: null // 加载第一页数据服务器返回的时间; 防止用户翻页时,后台新增了数据从而导致下一页数据重复;
				},
				noMoreSize: 10, // 如果列表已无数据,可设置列表的总数量要大于等于5条才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
				offset: 20, // 距底部多远时,触发upCallback
				bgColor: "transparent", // 背景颜色 (建议在pages.json中再设置一下backgroundColorTop)
				textColor: "gray", // 文本颜色 (当bgColor配置了颜色,而textColor未配置时,则textColor会默认为白色)
				textLoading: '加载中 ...', // 加载中的提示文本
				textNoMore: '暂无数据', // 没有更多数据的提示文本
				toTop: {
					// 回到顶部按钮,需配置src才显示
					src: "", // 图片路径
				},
				empty: {
					use: true, // 是否显示空布局
					icon: "/static/img/noaddress.png", // 图标路径
					tip: '暂无订单', // 提示
					btnText: '', // 按钮
					fixed: true, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效 (transform会使fixed失效,最终会降级为absolute)
					top: "20%", // fixed定位的top值 (完整的单位值,如 "10%"; "100rpx")
					zIndex: 99 // fixed定位z-index值
				},
				onScroll: false // 是否监听滚动事件, 默认false, 仅mescroll-uni生效; mescroll-body直接声明onPageScroll (配置为true时,可@scroll="scroll"获取到滚动条位置和方向; 注意监听列表滚动是非常耗性能的,很容易出现卡顿,非特殊情况不要配置此项)
			},
		}
	},

	computed: {
		...mapState('carRentalModule/carRentalOrderListModule',{
			rentListInfo: (state) => state.rentListInfo,
			hasNext: (state) => !state.rentListInfo.isEndSuccess,
			currentRentListData:  (state) => state.rentListInfo.currentRentListData,
			selectedList: (state) => state.selectedList,
		}),
		
		pageIndex: {
			get() {
				return this.rentListInfo.pageIndex
			},
			set(pageIndex) {
				this.rentListInfo.pageIndex = pageIndex
			}
		},
		allRentListData: {
			get() {
				return this.rentListInfo.allRentListData
			},
			set(allRentListData) {
				this.rentListInfo.allRentListData = allRentListData
			}
		},
		...mapGetters('carRentalModule/carRentalOrderListModule',['selectListSum','isSelectAll']),
		staticImg() { return this.$store.state.staticImg },
	},
	onLoad(options){
		console.log(options)
		let {id,isInvoice,pageStatus} = options
		this.options = {id,isInvoice : Number(isInvoice),pageStatus}
		if(id ==  2){
			this.pageTitle = '会员订单'
		}else if (id ==  1){
			if(pageStatus == 'carRental'){
				this.pageTitle = '我的租赁'
				this.pageType = 1
			}else if(pageStatus == 'manageCar'){
				this.pageTitle = '我的车辆管理'
				this.pageType = 2
			}
		}
	},
	onShow(){
		this.clearSelectList();
		setTimeout(()=>{
			this.mescroll.resetUpScroll(false);
		},500)
	},
	methods: {
		...mapActions('carRentalModule/carRentalOrderListModule',['getRentOrderListAction']),
		...mapMutations('carRentalModule/carRentalOrderListModule',['updateSelectList','clearSelectList']),
		downCallback() {
			this.mescroll.resetUpScroll()
		},
		/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
		async upCallback(page) {
			this.pageIndex = page.num
			this.getRentOrderListAction({
				pageIndex:this.pageIndex,
				type:this.pageType
			}).then((res) => {
				this.mescroll.endSuccess(this.currentRentListData.length,this.hasNext)
			})
		},
		changeInvoice(){
			this.options.isInvoice = !this.options.isInvoice
			this.bottom = this.bottom ? 0 : 164
			// this.mescroll.resetUpScroll()   
		},
		nav2applyInvoice(){
			// 跳转去开发票
		},
		selectAll(){
			// this.isSelectAll ? this.clearSelectList() : this.updateSelectList([...this.allRentListData])
			if(this.isSelectAll){
				this.clearSelectList()
				this.allRentListData = this.allRentListData.map(item => {
					return {...item,checked:false}
				})
			}else{
				this.allRentListData = this.allRentListData.map(item => {
					return {...item,checked:true}
				})
				this.updateSelectList([...this.allRentListData])
			}
		}
	}
}
</script>

<style lang='stylus'>
page
  background:rgba(246,248,251,1);
  height 100%
.noorderimg
  width 305rpx
  height 298rpx
  position fixed
  top 30%
  left 50%
  margin-left -152rpx
.card
  /* height 212rpx */
  border-radius 32rpx
  box-sizing border-box
  /* box-shadow -10rpx 0 50rpx #ccc */
.ellipsis
  overflow hidden
  white-space nowrap 
  text-overflow ellipsis
.fsy
	/* height 170rpx */
	display flex
	flex-direction column
	align-items flex-end
	justify-content space-between
.move
  transform translate(70rpx)
.check
  position absolute
  top 50%
  left 40rpx
  margin-top -15rpx
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
  width 180rpx
  height 80rpx
  background #000
  line-height 80rpx
  color #fff
  border-radius 20rpx
  position absolute
  top 50%
  right 40rpx
  margin-top -40rpx
::-webkit-scrollbar
  width 0
  height 0
  color transparent
.iconload 
  animation load 1s ease infinite
@-webkit-keyframes load
  0% {transform:rotate(0)}
  100% {transform:rotate(360deg)}
.arrowRight
	margin-right -4rpx
	margin-top 4rpx

.orderIcon
	width 20rpx!important
	height 22rpx
.arrowRight
	margin-right -4rpx
.orderIcon
	width 20rpx!important
	height 22rpx
.address 
	background url(@/assets/orderIconAddress.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowIn
	background url(@/assets/orderIconIn.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.arrowOut
	background url(@/assets/orderIconOut.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.memberTime
	background url(@/assets/parkingIcon4.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.mycarIcon
	background url(@/assets/mycar.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.parkIcon
	background url(@/assets/orderIconPark.png) no-repeat
	background-size 20rpx 22rpx
	background-position left center
.type
	color #FFFFFF
	background #56C9CC
	padding 4rpx
	border-radius 4rpx
.width160
	width 160rpx
.renew
	width:120rpx;
	height:48rpx;
	line-height 48rpx
	background rgba(242,52,52,1)
	border-radius 8rpx
	text-align center
	color #FFFFFF
	font-size 20rpx
.Leasing
	color #F33535
.noeffective
	color #4A5360
.overdue
	color #4A5361
.gray
	opacity 0.5
	.type
		background #4A5362
</style>
