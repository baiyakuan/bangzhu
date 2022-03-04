<template>
	<view>
		<view v-for="(item,index) in parkingArray" :key="index">
			<view class="parking-box bgw mgt40 pd20-x pd30-y fs" @click="executeNav2parkDetail(item)">
				<view class="content fcx">
				<view class="left">
					<image :src="Imgpath+item.parkingPic" class="parkImg fleft"></image>
				</view>
				<view class="mid fst" style="justify-content: center; flex-direction: column;align-items: flex-start;">
					<view class="nameTitle fst" >
						<view class="parkName ft26 ftweight text-ellipsis">{{item.parkingName}}</view>
						<view class="label ft14 tac mgl20">{{item.cardType}}</view> 
					</view>
					<view class="parkAdreess text-ellipsis ft22">
						{{item.address}}
					</view>
					<view class="time_content" v-if="pageStatus == 'carRental'">
						<view v-if="!item.allDay">
							<view class="rgb74 ft20 mgb20 time_text" v-if="item.weekDay">
								<text>工作日</text>
								<text class="mgl20">{{item.weekDay}}</text>
							</view>
							<view class="rgb74 ft20 time_text">
								<view v-if="item.holiday">
									<text>节假日</text>
									<text class="mgl20">{{item.holiday}}</text>
								</view>
							</view>
						</view>
						<view class="rgb74 ft20 time_text" v-if="item.allDay">
							<text>每天</text>
							<text class="mgl20">{{item.allDay}}</text>
						</view>
					</view>
				</view>
				</view>
				<view class="right">
					<view class="distance-box">
						<image :src="staticImg + 'static/img/orderIconAddress.png'" class="distanceIcon"></image>
						<text class="rgb27 ft24 ftweight mgl10 translucent text-ellipsis">{{excuteFormatDistance(item.distance)}}</text>
					</view>
					<view class="rgb27 ft36 ftweight">￥ {{item.price}}</view>
				</view>
			</view>
		</view>	
	</view>
</template>

<script>
	import { nav2parkDetail, formatDistance } from '@/utils'
	export default {
		props:{
			parkingArray: { // 数据列表
				type: Array,
				default(){
					return []
				}
			},
			Imgpath: {
				type:String
			},
			pageStatus: {
				type: String,
				default: 'carRental'
			}
		},
		computed:{
			staticImg() { return this.$store.state.staticImg } ,
		},
		methods:{
			excuteFormatDistance(distance) {
				return formatDistance(distance)
			},
			executeNav2parkDetail(item){
				this.$emit('itemClick',item)
				nav2parkDetail({
					parkingCode: item.parkingCode,
					rentInfoCode: item.rentInfoCode,
					pageStatus: this.pageStatus
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
.parking-box{
	width: 670rpx;
	height: 176rpx;
	box-sizing: border-box;
	border-radius: 40rpx;
	.content{
		flex: 1;
		.left{
			width: 154rpx;
			height: 116rpx;
			margin-right: 20rpx;
			.parkImg{
				width: 154rpx;
				height: 116rpx;
				border-radius: 20rpx;
			}
		}
		.mid{
			flex: 1;
			height: 116rpx;
			.nameTitle{
				line-height: 26rpx;
				margin-bottom: 20rpx;
				.parkName{
					max-width: 220rpx;
					color:#2C2837;
				}
				.time_text{
					line-height: 20rpx;
				}
				.label{
					width: 36rpx;
					height: 26rpx;
					line-height: 26rpx;
					background: #56C9CC;
					color: #fff;
				}
			}
			.parkAdreess {
				max-width: 300rpx;
				color: #4A5361;
				line-height: 26rpx;
			}
		}
	}
	.right{
		height: 116rpx;
		display: flex;
		flex-direction: column;
		justify-content:space-between;
		align-items: center;
		.distance-box{
			.distanceIcon{
				width: 20rpx;
				height: 24rpx;
			}
		}
	}
}
</style>

