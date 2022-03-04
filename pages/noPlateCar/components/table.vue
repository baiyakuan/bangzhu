<template>
	<view class="">
		<!-- 收费标准 -->
		<div class="pd40" v-if="charge">
			<div class="ft26 ftweight rgb44">收费标准</div>
			<div class="mg40-y fwrap">
				<div class="ft22 fi width50 mgb20 ftweight" v-if="charge.freeTime">
					<image :src="staticImg + 'static/img/parkingIcon1.png'" class="parkingIcon mgr20"></image>
					免费时长{{charge.freeTime}}min
				</div>
				<div class="ft22 fi width50 mgb20 ftweight" v-if="parkInfo.chargeType != 2 && charge.dayMaxCharge">
					<image :src="staticImg + 'static/img/parkingIcon2.png'" class="parkingIcon mgr20"></image>
					24小时上限{{charge.dayMaxCharge}}元
				</div>
				<div class="ft22 fi width50 mgb20 ftweight" v-if="parkInfo.chargeType == 2 && charge.workDayMaxCharge && charge.dayMaxCharge">
					<image :src="staticImg + 'static/img/parkingIcon2.png'" class="parkingIcon mgr20"></image>
					工作日24小时上限{{charge.workDayMaxCharge}}元
				</div>
				<div class="ft22 fi width50 mgb20 ftweight" v-if="parkInfo.chargeType == 2 && charge.workDayMaxCharge && !charge.dayMaxCharge">
					<image :src="staticImg + 'static/img/parkingIcon2.png'" class="parkingIcon mgr20"></image>
					24小时上限{{charge.workDayMaxCharge}}元
				</div>
				<div class="ft22 fi width50 mgb20 ftweight" v-if="charge.isRecharge">
					<image :src="staticImg + 'static/img/parkingIcon6.png'" class="parkingIcon mgr20"></image>
					满24小时重新计费
				</div>
				<div class="ft22 fi width50 mgb20 ftweight" v-if="parkInfo.chargeType == 2 && charge.dayMaxCharge">
					<image :src="staticImg + 'static/img/parkingIcon2.png'" class="parkingIcon mgr20"></image>
					节假日24小时上限{{charge.dayMaxCharge}}元
				</div>
				<div class="ft22 fi width50 mgb20 ftweight" v-if="parkInfo.chargeType == 2">
					<image :src="staticImg + 'static/img/parkingIcon6.png'" class="parkingIcon mgr20"></image>
					高峰期:{{charge.peakStartTime}}-{{charge.peakEndTime}}
				</div>
			</div>
			<!-- chargetype = 1  普通版 -->
			<view class="content" v-if="parkInfo.chargeType == 1">
				<view class="genaral-area">
					<view class="flex-box tc thead">
						<view class="item-3 fcx"></view>
						<view class="item-3 fcx">
							<image :src="staticImg + 'static/img/parkingIcon4.png'" class="parkingIcon mgr8"></image>停车时长
						</view>
						<view class="item-3 fcx">
							<image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费金额
						</view>
					</view>
					<view class="flex-box table tc">
						<view class="item-3">
							首段收费
						</view>
						<view class="item-3">
							{{changeHourMinutestr(charge.time1)}}
						</view>
						<view class="item-3">
							{{charge.charge1}}元
						</view>
					</view>
					<view class="flex-box table tc">
						<view class="item-3">
							间隔收费
						</view>
						<view class="item-3">
							{{changeHourMinutestr(charge.time2)}}
						</view>
						<view class="item-3">
							{{charge.charge2}}元
						</view>
					</view>
				</view>
			</view>
			<!-- chargetype = 2 节假日版 -->
			<view class="content" v-if="parkInfo.chargeType == 2">
				<view class="advance-area">
					<view class="flex-box tc thead">
						<view class="item-4"></view>
						<view class="item-4"></view>
						<view class="item-4 fcx">
							<image :src="staticImg + 'static/img/parkingIcon4.png'" class="parkingIcon mgr8"></image>停车时长
						</view>
						<view class="item-4 fcx">
							<image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费金额
						</view>
					</view>
					<!-- 工作日高峰 -->
					<view class="flex-box table tc">
						<view class="item-4">
							{{charge.charge1 && charge.charge2 ? '工作日高峰' :'高峰'}}
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">首段收费</view>
								<view class="item">间隔收费</view>
							</view>
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">{{changeHourMinutestr(charge.time3)}}</view>
								<view class="item">{{changeHourMinutestr(charge.time4)}}</view>
							</view>
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">{{charge.charge3}}元</view>
								<view class="item">{{charge.charge4}}元</view>
							</view>
						</view>
					</view>
					<!-- 工作日非高峰 -->
					<view class="flex-box table tc">
						<view class="item-4">
							{{charge.charge1 && charge.charge2 ? '工作日非高峰' :'非高峰'}}
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">首段收费</view>
								<view class="item">间隔收费</view>
							</view>
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">{{changeHourMinutestr(charge.time5)}}</view>
								<view class="item">{{changeHourMinutestr(charge.time6)}}</view>
							</view>
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">{{charge.charge5}}元</view>
								<view class="item">{{charge.charge6}}元</view>
							</view>
						</view>
					</view>
					<!-- 节假日 -->
					<view class="flex-box table tc" v-if="charge.charge1 && charge.charge2">
						<view class="item-4">
							节假日
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">首段收费</view>
								<view class="item">间隔收费</view>
							</view>
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">{{changeHourMinutestr(charge.time1)}}</view>
								<view class="item">{{changeHourMinutestr(charge.time2)}}</view>
							</view>
						</view>
						<view class="item-4">
							<view class="table-flex">
								<view class="item">{{charge.charge1}}元</view>
								<view class="item">{{charge.charge2}}元</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- chargetype = 3  分时段版 -->
			<view class="content" v-if="parkInfo.chargeType == 3">
				<view class="genaral-area">
					<view class="flex-box tc thead">
						<view class="item-2 fcx">
							<image :src="staticImg + 'static/img/parkingIcon4.png'" class="parkingIcon mgr8"></image>停车时长
						</view>
						<view class="item-2 fcx">
							<image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费金额
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time1">
						<view class="item-2">
							{{changeHourMinutestr(charge.time1)}}
						</view>
						<view class="item-2">
							{{charge.charge1}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time2">
						<view class="item-2">
							{{changeHourMinutestr(charge.time2)}}
						</view>
						<view class="item-2">
							{{charge.charge2}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time3">
						<view class="item-2">
							{{changeHourMinutestr(charge.time3)}}
						</view>
						<view class="item-2">
							{{charge.charge3}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time4">
						<view class="item-2">
							{{changeHourMinutestr(charge.time4)}}
						</view>
						<view class="item-2">
							{{charge.charge4}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time5">
						<view class="item-2">
							{{changeHourMinutestr(charge.time5)}}
						</view>
						<view class="item-2">
							{{charge.charge5}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time6">
						<view class="item-2">
							{{changeHourMinutestr(charge.time6)}}
						</view>
						<view class="item-2">
							{{charge.charge6}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time7">
						<view class="item-2">
							{{changeHourMinutestr(charge.time7)}}
						</view>
						<view class="item-2">
							{{charge.charge7}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time8">
						<view class="item-2">
							{{changeHourMinutestr(charge.time8)}}
						</view>
						<view class="item-2">
							{{charge.charge8}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time9">
						<view class="item-2">
							{{changeHourMinutestr(charge.time9)}}
						</view>
						<view class="item-2">
							{{charge.charge9}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time10">
						<view class="item-2">
							{{changeHourMinutestr(charge.time10)}}
						</view>
						<view class="item-2">
							{{charge.charge10}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time11">
						<view class="item-2">
							{{changeHourMinutestr(charge.time11)}}
						</view>
						<view class="item-2">
							{{charge.charge11}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time12">
						<view class="item-2">
							{{changeHourMinutestr(charge.time12)}}
						</view>
						<view class="item-2">
							{{charge.charge12}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time13">
						<view class="item-2">
							{{changeHourMinutestr(charge.time13)}}
						</view>
						<view class="item-2">
							{{charge.charge13}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time14">
						<view class="item-2">
							{{changeHourMinutestr(charge.time14)}}
						</view>
						<view class="item-2">
							{{charge.charge14}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time15">
						<view class="item-2">
							{{changeHourMinutestr(charge.time15)}}
						</view>
						<view class="item-2">
							{{charge.charge15}}元
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time16">
						<view class="item-2">
							{{changeHourMinutestr(charge.time16)}}
						</view>
						<view class="item-2">
							{{charge.charge16}}元
						</view>
					</view>
				</view>
			</view>
			<!-- chargetype = 4  基础版 -->
			<view class="content" v-if="parkInfo.chargeType == 4">
				<view class="genaral-area">
					<view class="flex-box tc thead">
						<view class="item-2 fcx">
							<image :src="staticImg + 'static/img/parkingIcon4.png'" class="parkingIcon mgr8"></image>停车时长
						</view>
						<view class="item-2 fcx">
							<image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费金额
						</view>
					</view>
					<view class="flex-box table tc" v-if="charge.time1">
						<view class="item-2">
							{{changeHourMinutestr(charge.time1)}}
						</view>
						<view class="item-2">
							{{charge.charge1}}元
						</view>
					</view>
				</view>
			</view>
		
		</div>
		<view v-else>
			<view class="item-3 fcs pdl40">
				<image :src="staticImg + 'static/img/parkingIcon5.png'" class="parkingIcon mgr8"></image>收费标准以现场车场公示收费细则为准
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getParkingByCode
	} from '@/api';
	export default{
		props:{
			parkInfo:{
				type:Object
			},
			charge:{
				type:Object
			},
		},
		computed: {
			staticImg() {
				return this.$store.state.staticImg
			},
		},
		methods:{
			// 分钟转化小时分钟
			changeHourMinutestr (str) {
				let hours = Math.floor(str/60)
				let minutes = (str % 60)
				if (str !== '0' && str !== '' && str !== null) {
					return (hours ? hours + '小时' : '')+ (minutes ? minutes + '分钟' : '')
				} else {
					return ''
				}
			},
		}
	}
</script>

<style lang='stylus'>
.parkLot:last-child
  padding-bottom  50rpx
.crl
  width 90rpx
  height 90rpx
  font-size 30rpx
  border-radius 50%
  text-align center
  line-height 90rpx
  background-color #f33535
  color #fff
.isEmpty
  color #0dba46
.position 
  position: relative;
  padding-left 40rpx
  div
    display: inline-block;
    word-break: break-all;
    vertical-align: top 
.swiper-box
	width 100%
	height 540rpx
	position fixed
	top 0
.d_swiper
  height 540rpx
  position relative
.slide-image
  width 100%
  height 100%
.icon
  width 30rpx
  height 30rpx
.rgb150
  color rgb(150,150,150)
.credit
  height 40rpx
  line-height 40rpx
  border-radius 20rpx
  background-color #eff4f8
.credit-1
  width 120rpx
  height 36rpx
  line-height 36rpx
  border-radius 18rpx
  background-color #56c9cc
.icon-Dog
  width 26rpx
  height 26rpx
.btn-ok
  height 80rpx
  line-height 80rpx
  border-radius 10rpx
.parkcontainer
  height 500rpx
.car-icon
  width 20rpx
  height 40rpx
.iconpm
  width 50rpx
  height 50rpx
.plus
  margin-top 100rpx
  margin-left 80%
.minus
  margin-top 50rpx
  margin-left 80%
.compass
  margin-top 50rpx
  margin-left 40rpx
  width 24rpx
  height 72rpx
.btn-gray
  background-color rgb(150,150,150)
.btn-black
  background-color #1b1921
.footer
  box-sizing border-box
  position fixed
  height 160rpx
  bottom 0
  width 100%
  z-index 3
.icon-nav
  width 70rpx
  height 70rpx
.pkSpaNam_num
  color rgb(27,25,33)
  font-size 36rpx
  font-weight bold
.pkSpaNam_eqt
  width 120rpx
  height 36rpx
  margin-left 40rpx
  text-align center
  border-radius 18rpx
  background-color #56c9cc
  color #fff
  font-size 24rpx
.pkSpaNam_full
  width 120rpx
  height 36rpx
  margin-left 40rpx
  text-align center
  border-radius 18rpx
  background-color rgb(218,110,106)
  color #fff
  font-size 24rpx
.pkSpaNam_litle
  width 120rpx
  height 36rpx
  margin-left 40rpx
  text-align center
  border-radius 18rpx
  background-color rgb(227,191,115)
  color #fff
  font-size 24rpx
.pkSpaNam_plenty
  width 120rpx
  height 36rpx
  margin-left 40rpx
  text-align center
  border-radius 18rpx
  background-color rgb(116,198,202)
  color #fff
  font-size 24rpx
.pkcolor_full
  background rgb(53,243,102)
  border-radius 50%
.pkcolor_litle
  background rgb(242,185,60)
  border-radius 50%
.pkcolor_plenty
  background rgb(243,53,53)
  border-radius 50%
.pkSpaBtn
  height: 60rpx;
  line-height: 60rpx;
  color: #fff;
  font-weight: bold;
  font-size: 32rpx;
.order
  background-color rgb(106,118,129)
  margin-right 30rpx
.blur
  filter blur(10rpx)
.dialog
  width 590rpx
  background #fff
  border-radius 20rpx
.car_title
  color rgba(74,83,97,0.5)
  font-size 28rpx
  font-weight bold
.car_information
  color rgb(27,25,33)
  font-size 28rpx
  font-weight bold
.dialog_footer
  border-top 1px solid #EFF4F8
.dialog_cancel
  display inline-block
  width 50%
  text-align center
.dialog_sure
  display inline-block
  box-sizing border-box
  width 50%
  border-left 1px solid #EFF4F8
  color rgb(243,53,53)
  text-align center
.open_img
  width 500rpx
  height 323rpx
  position absolute
  top 400rpx
  left 50%
  margin-left -245rpx
.pro_box
  width 300rpx
  height 100rpx
  position absolute
  top 730rpx
  left 50%
  margin-left -150rpx
  text-align center
::-webkit-scrollbar{
  width: 0;
  height: 0;
  color: transparent; 
}
.fixedPage
  position fixed
  width 100%
  height 100%
  overflow hidden
  
.infoBox
	position relative
	top -40rpx
	border-top-left-radius 30rpx
	border-top-right-radius 30rpx
	border-bottom 2rpx dashed  rgba(239,244,248,1)
.parkingName 
	width 500rpx
.address
	width 500rpx
.parkingIcon
	width 22rpx
	height 22rpx
	margin-right 8rpx
.fwrap
 display flex
 flex-wrap wrap
.width50
	width 50% 
.chargeBox
	padding-bottom 180rpx
.navigationBox
	width 100%
	position fixed
	bottom 0
	box-sizing border-box
	background #FFFFFF
.navigation
	height 100rpx
	line-height 100rpx
	text-align center
	background rgba(26,25,33,1)
	border-radius 20rpx
	color #FFFFFF
/* 表格 */
.content 
	display flex
	flex 1
	flex-direction column
	background rgba(239,244,248,0.5)
	border-radius 20rpx
.flex-box 
	display flex
	flex-wrap wrap
.flex-box>.item-2 
	flex 0 0 50%
.flex-box>.item-3 
	flex 0 0 33.3333%
.flex-box>.item-4 
	flex 0 0 25%
.title
	margin 20rpx 0
	color red
/* 普通表格 */
.genaral-area 
	.item-2 ,.item-3 ,.item-4 
		font-size 16rpx
		border 1rpx solid #FFFFFF
		border-width 1rpx 1rpx 0 0
		height 60rpx
		line-height 60rpx
		box-sizing border-box
		text-align center
		&first-child 
			border-left-width 1rpx
		&last-child 
			border-right-width 1rpx
	.thead 
		.item-2 ,.item-3 ,.item-4 
			font-weight bold
			box-sizing border-box
	.table 
		&last-child 
			border-bottom 1rpx solid #FFFFFF
		.item-2 ,.item-3 ,.item-4 
			display flex
			justify-content center
			align-items center
			box-sizing border-box

 /* 多行合并表格 */
.advance-area 
		.item-3 ,.item-4 
			font-size 16rpx
			border 1rpx solid #FFFFFF
			border-width 1rpx 1rpx 0 0
			box-sizing border-box
			text-align center	
			&first-child 
				border-left-width 1rpx	
			&last-child 
				border-right-width 1rpx	
		.thead 
			.item-3 ,.item-4 
				font-weight bold
				height 60rpx
				line-height 60rpx
				box-sizing border-box	
		.table 
			&last-child 
				border-bottom 1rpx solid #FFFFFF	
			.item-3 ,.item-4 
				display flex
				justify-content center
				align-items center
				box-sizing border-box	
		.table-flex 
			flex 1	
			.item 
				border-bottom 1rpx solid #FFFFFF
				height 60rpx
				line-height 60rpx
				box-sizing border-box
				&last-child 
					border-width 0	
					
					
.dots
	width 100%
	height 10rpx
	position absolute
	bottom 70rpx
	left 0
	.dot
		width 10rpx
		height 10rpx
		margin 0 8rpx
		border-radius:50%;
		background:rgba(255,255,255,1);
		&.active
			background:rgba(243,53,53,1);
			
</style>
