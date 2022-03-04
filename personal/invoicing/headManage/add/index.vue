<template>
	<view>
		<view class="pd40-x pd50-y bgw">
		  <view class="ft50 ftweight rgb51">抬头管理</view>
		</view> 
		<view class="pdb160">
			<view class="pd40-x pd30-y fst bgw mgt16 border">
				<view class="rgb27 ft28 ftweight mgr40">主体类型</view>
				<view class="rgb74 ft26">
					<view class="fs">
						<view  v-for="(item,index) in radioList" :key='index' @click="checkType(item)">
							<div class="fi mgr30">
								<image class='img' v-if="item.isActive" :src= 'staticImg + "static/img/check.png"'/>
								<image class='img' v-else :src= 'staticImg + "static/img/X_select_0.png"'/>
								<div class="mgl20 ft24">{{item.name}}</div>			
							</div>
						</view>
					</view>
				</view>
			</view>
			<view class="pd40-x pd30-y fst bgw border">
				<view class="rgb27 ft28 ftweight mgr40">发票抬头</view>
				<view class="rgb74 ft24 flex1">
					<input type="text" value="" placeholder="请输入名称" placeholder-class="placeholderClass" class="rgb74 ft24"/>
				</view>
			</view>
			<view class="pd40-x pd30-y fst bgw" v-if="form.companyType == 1">
				<view class="rgb27 ft28 ftweight mgr40">税号</view>
				<view class="rgb74 ft24 flex1"><input type="text" value="" placeholder="请填写企业识别号" placeholder-class="placeholderClass"/></view>
			</view>
			<view class="pd40-x pd30-y fst bgw mgt16">
				<view class="rgb27 ft28 ftweight mgr40">接收邮箱</view>
				<view class="rgb74 ft24 flex1"><input type="text" value="" placeholder="用于向您发送电子发票" placeholder-class="placeholderClass"/></view>
			</view>
			<view class="pd40-x pd30-y fs bgw mgt16">
				<view class="rgb27 ft28 ftweight">设置默认抬头</view>
				<view class="">
					<evan-switch
					:value="form.isDefault" 
					size="30" 
					inactive-color="#EFF4F8" active-color="#F33535"
					@aaa="changeDefault"
					></evan-switch>
				</view>
			</view>
		</view>
		<view class="bottom fs">
			<view class="btn canclebtn" @click="cancle">取消</view>
			<view class="btn savebtn" @click="save">保存</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				radioList:[
					{name:'个人', isActive:true, type:2},
					{name:'公司企业', isActive:false, type:1},
				],
				
				form:{
					companyType:2,
					isDefault:false,
				}
				
			}
		},
		onLoad(option) {
			if(option.id){
				console.log(option.id)
			}
		},
		computed:{
			staticImg() { return store.state.staticImg },
		},
		methods: {
			checkType(obj){
				this.radioList = this.radioList.map(item => {
					return {
						...item,
						isActive: !item.isActive
					}
				})
				this.form.companyType = this.radioList.filter(item => item.isActive)[0].type
			},
			changeDefault(){
				this.form.isDefault = !this.form.isDefault
			},
			//保存
			save(){
				
			},
			//取消
			cancle(){
				
			}
			
		}
	}
</script>

<style lang="stylus">
.border
	border-bottom 2rpx solid #F6F8FB
image
	width 100%
	height 100%
	display block
.arrow
	width 10rpx
	height 20rpx
.mgr40
	width 115rpx
.img
	width 20rpx
	height 20rpx
.flex1
	flex 1
.bottom
	width 100%
	height 160rpx
	padding 40rpx
	box-sizing border-box
	background #FFFFFF
	position fixed
	left 0
	bottom 0
	.btn
		text-align center
		line-height 80rpx
		font-weight:bold;
		font-size 26rpx
		color #FFFFFF
	.canclebtn
		width:200rpx;
		height:80rpx;
		background:rgba(74,83,97,0.5);
		border-radius:20rpx;
	.savebtn
		width:440rpx;
		height:80rpx;
		background:rgba(27,25,33,1);
		border-radius:20rpx;
.placeholderClass
	font-size 20rpx
	color rgba(170,170,170,1)
</style>

