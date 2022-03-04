<template>
	<view>
		<view class="pd40-x pd50-y bgw">
			<view class="ft50 ftweight rgb51">抬头管理</view>
		</view>
		<view class="pdb160">
			<!-- <view> -->
				<uni-swipe-action  v-for="(item,index) in lists" :key='index'>
					<uni-swipe-action-item :options="options" :show="item.isOpened" :auto-close="false" @change="change" @click="bindClick(item,$event)">
						<view class="pd40" style="width: 100%;box-sizing: border-box;" >
							<view class="pd40-x pd30-y bgw list" @click="checkHead(item)">
								<view class="fst enterprise" v-if="item.type == 'enterprise'">
									<view class="icon">
										<image :src="staticImg + 'static/img/head_enterprise.png'"></image>
									</view>
									<view style="flex: 1;">
										<view class="fs mgb24">
											<view class="fst" >
												<view class="rgb27 mgr40 ft26 ftweight width">企业抬头</view>
												<view class="rgb74 ft24 ellipsis">{{item.name}}</view>
											</view>
											<view class="default" v-if="item.isDefault">默认</view>
										</view>
										<view class="fst">
											<view class="rgb27 mgr40 ft26 ftweight width">税号</view>
											<view class="rgb74 ft24">{{item.number}}</view>
										</view>
									</view>
								</view>
								<view class="fst personal" v-if="item.type == 'personal'">
									<view class="icon">
										<image :src="staticImg + 'static/img/head_personal.png'"></image>
									</view>
									<view style="flex: 1;">
										<view class="fs">
											<view class="fst">
												<view class="rgb27 mgr40 ft26 ftweight">个人抬头</view>
												<view class="rgb74 ft24">{{item.name}}</view>
											</view>
											<viw class="default" v-if="item.isDefault">默认</viw>
										</view>
									</view>
								</view>
							</view>
						</view>
					</uni-swipe-action-item>
				</uni-swipe-action>
			<!-- </view> -->
		</view>
		<view class="bottom">
			<view class="btn" @click="goAdd">新增</view>
		</view>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import store from '@/store'
	export default {
	    components: {
	        uniSwipeAction,
	        uniSwipeActionItem
	    },
		data() {
			return {
				lists: [{
					id:1,
					type:"enterprise",
					name:"济宁市众帮来袭信息科技有限公司",
					number:"HJKL258AS14DF7G369",
					isOpened: false,
					isDefault:true,
				},{
					id:2,
					type:"personal",
					name:"王二麻子",
					isOpened: false,
					isDefault:false,
				},{
					id:3,
					type:"enterprise",
					name:"济宁市众帮来袭信息科技有限公司",
					number:"HJKL258AS14DF7G369",
					isOpened: false,
					isDefault:false,
				},{
					id:4,
					type:"enterprise",
					name:"济宁市众帮来袭信息科技有限公司",
					number:"HJKL258AS14DF7G369",
					isOpened: false,
					isDefault:false,
				},{
					id:3,
					type:"personal",
					name:"王二",
					isOpened: false,
					isDefault:false,
				}],
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#f6f8fb',
						color:"#000",
						imgSrc:"/static/img/head_delete.png"
					}
				}, {
					text: '编辑',
					style: {
						backgroundColor: '#f6f8fb',
						color:"#000",
						imgSrc:"/static/img/head_edit.png"
					}
				}],
				ischeck:false
			}
		},
		onLoad(options) {
			if(options.type == "apply"){
				this.ischeck = true
			}
		},
		computed:{
			staticImg() { return this.$store.state.staticImg } ,
		},
		onShow() {

		},
		methods: {
			bindClick(item,e) {
				if(e.content.text == "编辑"){
					uni.navigateTo({
						url:`/personal/invoicing/headManage/add/index?id=${item.id}`
					})
				}else if(e.content.text == "删除"){
					uni.showToast({
						title: `确定要删除第${item.id}个抬头吗？`,
						icon: 'none'
					})
				}
			},
			change(e) {
				console.log('返回：', e);
			},
			goAdd(){
				uni.navigateTo({
					url:"/personal/invoicing/headManage/add/index"
				})
			},
			checkHead(item){
				if(this.ischeck){
					store.commit('set_headInfo', item)
					uni.navigateBack()
				}
			}
		},

	}
</script>

<style lang="stylus">
image
	width 100%
	height 100%
	display block
.list
	border-radius 40rpx
.icon
	width 40rpx
	height 40rpx
	margin-right 40rpx
.arrow
	width 10rpx
	height 20rpx
.width
	width 110rpx
.default
	font-size 14rpx
	color #FFFFFF
	// padding 4rpx
	width 36rpx
	height 26rpx
	line-height 26rpx
	text-align center
	background rgba(243,53,53,1)
	border-radius 4rpx
.ellipsis
	width 310rpx
	overflow hidden
	text-overflow ellipsis
	white-space nowrap
.bottom
	width 100%
	height 160rpx
	padding 40rpx
	box-sizing border-box
	background #FFFFFF
	position fixed
	left 0
	bottom 0
	z-index 100
	.btn
		background:rgba(27,25,33,1);
		border-radius:20rpx;
		text-align center
		line-height 80rpx
		font-weight:bold;
		font-size 26rpx
		color:rgba(254,254,254,1)
	
</style>
