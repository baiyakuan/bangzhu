<template>
<div>
	<!-- 头部 -->
	<div class="pd50-y pd40-x fs bgw top" style="width:100%;box-sizing:border-box;z-index:2;">
      <div class="ft50 ftweight rgb27">{{tabs[tabIndex].title}}</div>
      <div class="ft24 rgb74" @click="doInvoice()" v-if="isInvoice">{{tabs[tabIndex].name1}} </div>  
	  <div class="ft24 rgb74" @click="doInvoice()" v-else>{{tabs[tabIndex].name2}} </div>  
    </div>
	<!-- 列表 -->
	<mescroll-uni class="mescroll" ref="mescrollRef" 
		:down="downOption" @down="downCallback" 
		:up="upOption" @up="upCallback" 
		:fixed="true"
		:bottom="bottom" top="166" 
		@emptyclick="emptyClick">
			<!-- 不可选 -->
			<div v-if="!isInvoice">
				<view v-if="tabIndex == 0" class="card mgt50 bgw pd20-y mg40-x" v-for="(order,index) in list" :key="order.orderId" @click="nav2orderDetail(index)">
					<view class="pd40-x">
						<view class="fs mgb20" >
							<view style="width:80%;">
								<view class="ftweight ft32 rgb27  ellipsis">创意大厦停车场</view>
							</view>
							<view class="fcx">
								<view class="ft24 ftweight rgba74 mgr6">查看</view>
								<uni-icons type="arrowright" size="30" class="mgt4 arrowRight rgba74" color="#4A5361"></uni-icons>
							</view>
						</view>
						<view class="fs" style="align-items: flex-end;">
						    <view style="width:80%;">
								<view class="fst pdl30 address" >
									<view class="ellipsis ft20 rgb74">山东省济宁市高新区海川路69号创意大厦</view>
								</view>
								<view class="ft20 rgb74  arrowIn pdl30 mgt12">2020.04.01   11:01:25</view>
								<view class="ft20 rgb74 arrowOut pdl30 mgt12">2020.04.01   11:01:25</view>
							</view>
							<view class="ftweight ft32 rgb27">
								￥2.00
							</view>
						</view>
					</view>
				</view>
				
				<view v-if="tabIndex == 1" class="card mgt50 bgw pd20-y mg40-x" v-for="(order,index) in list" :key="order.orderId" @click="nav2orderDetail(index)">
					<view class="fs mgb20 pdb20 pd40-x"  style="border-bottom:2rpx solid rgba(239,244,248,1);" :class="index==1?'gray':''">
						<view class="fst">
							<view class="ftweight ft32 rgb27  ellipsis">置城国际地下停车场</view>
							<view class="mgl20 fst">
								<view class="ft14 ftweight type">月卡</view>
							</view>
						</view>
						<view class="ftweight ft20" :class="index==0?'Leasing':index==1?'overdue':'noeffective'">{{index == 0?'租赁中':index == 1?'已到期':'待生效'}}</view>						
					</view>
					<view class="fs pd40-x" style="align-items: flex-end;">
						<view style="width:80%;" :class="index==1?'gray':''">
							<view class="fst pdl30 address" >
								<view class="ellipsis ft20 rgb74">山东省济宁市高新区海川路69号创意大厦</view>
							</view>
							<view class="ft20 rgb74  parkIcon pdl30 mgt12 fst">
								<view class="width160">固定泊位</view>
								<view>A003</view>
							</view>
							<view class="ft20 rgb74 mycarIcon pdl30 mgt12 fst">
								<view class="width160">鲁H·54188</view>
								<view>2020.04.01   11:01:25</view>
							</view>
						</view>
						<view class="renew">续费</view>
					</view>
				</view>				
				
				<view v-if="tabIndex == 2" class="card mgt50 bgw pd20-y mg40-x" v-for="(order,index) in list" :key="order.orderId" @click="nav2orderDetail(index)">
				    <view class="pd40-x">
						<view class="fs" >
							<view style="width:80%;">
								<view class="ftweight ft32 rgb27  ellipsis">PLUS半年会员</view>
								<view class="ft20 rgb74 memberTime pdl30 mgt20">2020.04.01   11:01:25</view>
							</view>
							<view class="ftweight ft32 rgb27">
								￥50.00
							</view>
						</view>
				    </view>
				</view>	
			</div>
			<!-- 可选 -->
			<div v-else>
				<div class="pr" v-for="(order,index) in invoiceList" :key="order.orderId" @click="onCheckBox(index)">
					<img :src="order.checked?staticImg + 'static/img/check.png':staticImg + 'static/img/X_select_0.png'" class="check" style="width:30rpx;height:30rpx;" alt="">
					<view v-if="tabIndex == 0" class="move card mgt50 bgw pd20-y mg40-x">
						<view class="pd40-x">
							<view class="fs mgb20" >
								<view style="width:80%;">
									<view class="ftweight ft32 rgb27  ellipsis">创意大厦停车场</view>
								</view>
								<view class="fcx">
									<view class="ft24 ftweight rgba74 mgr6">查看</view>
									<uni-icons type="arrowright" size="30" class="mgt4 arrowRight rgba74" color="#4A5361"></uni-icons>
								</view>
							</view>
							<view class="fs" style="align-items: flex-end;">
								<view style="width:80%;">
									<view class="fst pdl30 address" >
										<view class="ellipsis ft20 rgb74">山东省济宁市高新区海川路69号创意大厦</view>
									</view>
									<view class="ft20 rgb74  arrowIn pdl30 mgt12">2020.04.01   11:01:25</view>
									<view class="ft20 rgb74 arrowOut pdl30 mgt12">2020.04.01   11:01:25</view>
								</view>
								<view class="ftweight ft32 rgb27">
									￥2.00
								</view>
							</view>
						</view>
					</view>
					
					<view v-if="tabIndex == 1" class="move card mgt50 bgw pd20-y mg40-x" >
						<view class="fs mgb20 pdb20 pd40-x"  style="border-bottom:2rpx solid rgba(239,244,248,1);" :class="index==1?'gray':''">
							<view class="fst">
									<view class="ftweight ft32 rgb27  ellipsis">置城国际地下停车场</view>
									<view class="mgl20 fst">
										<view class="ft14 ftweight type">月卡</view>
									</view>
								</view>
								<view class="ftweight ft20" :class="index==0?'Leasing':index==1?'overdue':'noeffective'">{{index == 0?'租赁中':index == 1?'已到期':'待生效'}}</view>						
							</view>
						<view class="fs pd40-x" style="align-items: flex-end;">
							<view style="width:80%;" :class="index==1?'gray':''">
								<view class="fst pdl30 address" >
									<view class="ellipsis ft20 rgb74">山东省济宁市高新区海川路69号创意大厦</view>
								</view>
								<view class="ft20 rgb74  parkIcon pdl30 mgt12 fst">
									<view class="width160">固定泊位</view>
									<view>A003</view>
								</view>
								<view class="ft20 rgb74 mycarIcon pdl30 mgt12 fst">
									<view class="width160">鲁H·54188</view>
									<view>2020.04.01   11:01:25</view>
								</view>
							</view>
							<view class="renew">续费</view>
						</view>
					</view>
					
					<view v-if="tabIndex == 2" class="move card mgt50 bgw pd20-y mg40-x">
						<view class="pd40-x">
							<view class="fs" >
								<view style="width:80%;">
									<view class="ftweight ft32 rgb27  ellipsis">PLUS半年会员</view>
									<view class="ft20 rgb74 memberTime pdl30 mgt20">2020.04.01   11:01:25</view>
								</view>
								<view class="ftweight ft32 rgb27">
									￥50.00
								</view>
							</view>
						</view>
					</view>	
				</div>
			</div>
	</mescroll-uni>
	<!-- 底部 -->
	<view v-if="isInvoice" class="footer pd40-x pfb fs">
	  <view class=" pd60-y fcx" @click="selectAll">
			<img :src="isSelectAll?staticImg + 'static/img/check.png':staticImg + 'static/img/X_select_0.png'" class="" style="width:30rpx;height:30rpx;" alt="">
		  <view class="rgba74 mg20-x">全选</view>
		<view class="ftweight ft34 rgb27" v-if="tabIndex!=2">合计￥{{sum}}</view>
	  </view>
	  <view class="btn tac ft28" @click="nav2applyInvoice">申请开票</view>
	</view>
</div>
</template>

<script>
import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
import AppTabs from "@/components/tabs/app-tabs.vue";
import uniIcons from "@/components/uni-icons/uni-icons.vue"
import store from '@/store'
import { getOrderByStatus} from '@/api'
export default {
mixins: [MescrollMixin], // 使用mixin (在main.js注册全局组件)
data () {
	return {
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
			textLoading: '加载中...' // 加载中的提示文本
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
			textLoading: '加载中...', // 加载中的提示文本
			textNoMore: '暂无数据', // 没有更多数据的提示文本
			toTop: {
				// 回到顶部按钮,需配置src才显示
				src: "", // 图片路径
			},
			empty: {
				use: false, // 是否显示空布局
				icon: "static/img/nocar.png", // 图标路径
				tip: '暂无停车订单', // 提示
				btnText: '', // 按钮
				fixed: true, // 是否使用fixed定位,默认false; 配置fixed为true,以下的top和zIndex才生效 (transform会使fixed失效,最终会降级为absolute)
				top: "20%", // fixed定位的top值 (完整的单位值,如 "10%"; "100rpx")
				zIndex: 99 // fixed定位z-index值
			},
			onScroll: false // 是否监听滚动事件, 默认false, 仅mescroll-uni生效; mescroll-body直接声明onPageScroll (配置为true时,可@scroll="scroll"获取到滚动条位置和方向; 注意监听列表滚动是非常耗性能的,很容易出现卡顿,非特殊情况不要配置此项)
		},
		hasZero :0,
		flagReceipt :0,
		list: [], // 全部已完成订单列表
		invoiceList:[],// 可开发票订单列表
		sum:'0.00', //开票总金额
		bottom:164,
		tabs: [{
				title:'停车订单',
				name1:'返回订单',
				name2:'申请开票',
				status:2,
			},{
				title:'租赁订单',
				name1:'返回订单',
				name2:'申请开票',
				status:2,
			},{
				title:'会员订单',
				name1:'返回PLUS会员	',
				name2:'申请开票',
				status:2,
			},
		],
		isInvoice:true,
		tabIndex: 0, // tab下标
		isSelectAll:false
    }
  },
components:{
	MescrollUni,
	AppTabs,
	uniIcons
},
computed: {
	// 选中多订单 拼接orderId
	orderId () {
		if (!this.list.length) {
		  return ''
		}
		return this.invoiceList.filter(item => item.checked == true).map(item => item.orderCode).join(',')
	},
	staticImg() { return store.state.staticImg },
},
onLoad(option){
	if(option.id){
		this.tabIndex = option.id;
	}
	if(option.isInvoice == 0){
		this.isInvoice = false;
		this.bottom = 0
	}
},
onShow(){
	setTimeout(()=>{
		this.mescroll.resetUpScroll(false);
	},500)
	this.sum = "0.00";
	this.isSelectAll = false;
},
methods: {
	downCallback() {
		this.isSelectAll = false;
		this.mescroll.resetUpScroll()
	},
	/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
	async upCallback(page) {
		const { data } = await getOrderByStatus({
		  pageIndex: page.num,
		  status: this.tabs[this.tabIndex].status,
		  hasZero :this.hasZero,
		  flagReceipt :this.flagReceipt,
		  istrue:true
		})
		if(data.code == 1){
			let curPageLen = data.obj.orderList.length;
			if(curPageLen < 10){
				this.mescroll.endSuccess(curPageLen,false)
			} else {
				this.mescroll.endSuccess(curPageLen,true)
			}

			if(page.num == 1){
				this.list = [{
					ctime: "2020-06-12 15:33:44",
					discountCoupon: 0,
					discountPlus: 0,
					flagReceipt: 0,
					id: 630,
					inTime: "2020-06-12 15:33:44",
					money: 6,
					orderCode: "INCAR540626502102",
					outTime: "2020-06-12 18:27:50",
					parkingAddress: "山东省济宁高新区海川路69号创意大厦",
					parkingId: "BGP426090204021",
					parkingName: "创意大厦停车场",
					payMoney: 6,
					showMoney:"2.00",
					status: 3,
					userId: "BVUI209380219001",
					checked: false
				},{
					ctime: "2020-06-12 15:33:44",
					discountCoupon: 0,
					discountPlus: 0,
					flagReceipt: 0,
					id: 630,
					inTime: "2020-06-12 15:33:44",
					money: 6,
					orderCode: "INCAR540626502102",
					outTime: "2020-06-12 18:27:50",
					parkingAddress: "山东省济宁高新区海川路69号创意大厦",
					parkingId: "BGP426090204021",
					parkingName: "创意大厦停车场",
					payMoney: 6,
					showMoney:"2.00",
					status: 3,
					userId: "BVUI209380219001",
					checked: false
				},{
					ctime: "2020-06-12 15:33:44",
					discountCoupon: 0,
					discountPlus: 0,
					flagReceipt: 0,
					id: 630,
					inTime: "2020-06-12 15:33:44",
					money: 6,
					orderCode: "INCAR540626502102",
					outTime: "2020-06-12 18:27:50",
					parkingAddress: "山东省济宁高新区海川路69号创意大厦",
					parkingId: "BGP426090204021",
					parkingName: "创意大厦停车场",
					payMoney: 6,
					showMoney:"2.00",
					status: 3,
					userId: "BVUI209380219001",
					checked: false
				}]; //如果是第一页需手动制空列表
				this.invoiceList = this.list;
			} 
			var list = data.obj.orderList.map(item => {
			  return {
				...item,
				money:(item.money*1).toFixed(2),
				payMoney:(item.payMoney*1).toFixed(2),
				showMoney:(item.money - item.discountCoupon - item.discountPlus).toFixed(2)>0?(item.money - item.discountCoupon - item.discountPlus).toFixed(2):'0.00',
				checked: false
			  }
			});
			this.list = this.list.concat(list);
			this.invoiceList = this.list;
		}
	},

	// 点击返回订单
	doInvoice(){
		var that = this;
		that.isInvoice = !that.isInvoice
		that.isSelectAll = false;
		that.sum = "0.00";
		that.mescroll.resetUpScroll()   
		if(that.bottom == 0){
			that.bottom = 164
		}else{
			that.bottom = 0
		}
  },
    // 点击选择订单
    onCheckBox (i) {
		// 圆圈显示
		this.invoiceList.forEach((item, index) => {
			if (index == i) {
				item.checked = !item.checked
			}
		});
		if(this.tabs[this.tabIndex].status == 3){
			var isAll = this.invoiceList.every(item => item.checked == true )
		}
		if(this.tabs[this.tabIndex].status == 2){
			var isAll = this.invoiceList.every(item => item.checked == true )
		}
	
		if(isAll){
		   this.isSelectAll = true;
		}else{
		   this.isSelectAll = false;
		}
		// 计算总价格
		var sum = 0;
		var arr = this.orderId.split(',')
		this.invoiceList.forEach((item, index) => {
			arr.forEach((itemorderId, indexorderId) => {
				if (item.orderCode == itemorderId) {
				sum += ( item.showMoney * 1 )
				}
			})
		})
		this.sum = (sum * 1).toFixed(2)
    },
    // 选中订单后 去申请发票 、去支付页面
    async nav2applyInvoice () {
		console.log(this.list)
		console.log(this.orderId)
      if (!this.orderId) {
        wx.showToast({
          title: '请选择订单',
          icon: 'none'
        })
        return
      }
	  // 开发票
	  // if(this.sum < 200){
		 //  wx.showToast({
			// title: '金额满200元可申请发票',	
			// icon: 'none'
		 //  })
	  // }else{
		 store.commit('set_applyOrderId', this.orderId)
		 wx.navigateTo({
		   url: `/personal/invoicing/order/apply/index?sum=${this.sum}`
		 })  
	  // }
    },
    //去订单详情
    nav2orderDetail (index) {
      store.commit('set_orderIdDetail', this.list[index].orderCode)
	  if(this.tabIndex == 1){
		  uni.navigateTo({
		  	url:'/personal/carRental/rentalOrderDetail/index'
		  })
	  }else{
		  uni.navigateTo({
		    url: '/personal/order/orderDetail/index'
		  })
	  }
     
    },
	// 全选中
	selectAll(){
	  this.isSelectAll = !this.isSelectAll;
	  this.invoiceList.forEach((item, index) => {
		  	 item.checked = this.isSelectAll
	  });
	  var sum = 0;
	  var arr = this.orderId.split(',')
	  this.invoiceList.forEach((item, index) => {
	   arr.forEach((itemorderId, indexorderId) => {
	      if (item.orderCode == itemorderId) {
	        sum += ( item.showMoney * 1 )
	      }
	    })
	  })
	  this.sum = ( sum * 1 ).toFixed(2)
	},
},
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
