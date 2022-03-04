<template>
	<view class="pd40-x">
		<view class="pdt60 pdb30">
			 <view class="ft50 ftweight rgb27">领取停车券</view>
		</view>
		<view class="fst mgt20 mgb40">
			<image class="getcouponImg" :src="staticImg + 'static/img/scangetcoupon.png'"></image>
			<text class="mgl20 ft32 ftweight rgb51">{{name}}</text>
		</view>
		<view class="pd40 bgw add-box">
			<view class="ft28 rgb51 mgb20">输入车牌领取停车券</view>
			<view class="numberBox fs">
				<view class="numbox" v-for="(item,index) in carNumber" :key="index" @click.stop="tap(index)"  :class="current == index ?'active': ''"> 
					<!-- <input type="text" :value="item.id"/> -->
					{{item.id}}
				</view>
				<view class="numbox fcy" @click.stop="tap2" :class="addNewEnergy?'active':''">
					<!-- <input type="text" :value="" /> -->
					<view  v-if="addNewEnergy || newEnergyNum">{{newEnergyNum}}</view>
					<view class="ft14" v-else>新能源</view>
				</view>
			</view>
		</view>
		<view class="fs bgw bind-box mgt40" @click="isBind = !isBind">
			<view class="ft24 rgb74">绑定该车辆至本账号</view>
			<image class="icon" v-if="isBind" :src="staticImg + 'static/img/checked.png'"></image>
			<image class="icon" v-else :src="staticImg + 'static/img/nocheck.png'"></image>
		</view>
		<!-- 广告位 -->
		<div v-if="advertisement" @click="navDetail" class="mgt40" >
			<image :src="Imgpath + advertisement.icon"  style="width:100%;" mode="widthFix"/>
		</div>
		
		<TypeWriting :is-show="isShow" :button-border="buttonBorder" @ok="inputOk" @hide="inputHide"  @delete="inputDelete" @inputchange="inputChange" :key-board-type="keyBoardType" backgroundColor="rgba(229,229,229,1)"></TypeWriting>
		<view class="btn" @click="addCouponRecord2">{{isBind?'绑定并领取': '立即领取'}}</view>
		<toastes :visibile="toastVisibile">{{msg}}</toastes>
	</view>
</template>

<script>
	import TypeWriting from '@/components/TypeWriting/index.vue';
	import { addCouponRecord2} from '@/api';
	import { goLink } from '@/utils/link'
	import { mapActions, mapState } from 'vuex'
 	export default{
		data(){
			return {
				rebate:'', // 优惠券二维码携带信息
				name:'',
				isBind:true, // 是否绑定
				isShow:true,
				buttonBorder:"1px solid #ccc",
				backgroundColor:'#fff',
				keyBoardType: 1	,
				carNumber:[{id:''},{id:''},{id:''},{id:''},{id:''},{id:''},{id:''}],  // 车牌号码,
				current:0,
				addNewEnergy:false,
				newEnergyNum:'',
				brandType:0,
				disabled:true,
				brandNumber:'',
				brandInfo:{},
				brandId:'',
				isDefault:0,
				canTap:true,
				newEnergyText:'新能源',
				toastVisibile:false,
				msg:'',
			}
		},
		components: {
			TypeWriting
		},
		onLoad(option) {
			this.rebate = option.rebate;
			this.name = option.name;
			this.getAdverUrl()
		},
		computed:{
			...mapState("commonModule",['advertisement']),
			Imgpath(){return this.$store.state.Imgpath},
			staticImg () { return this.$store.state.staticImg } 
		},
		methods:{
			 ...mapActions('commonModule',['getAdvertisement']),
			// 获取广告位信息
			getAdverUrl(){
				this.getAdvertisement({type: 6})//1-待支付卡片 2-扫码缴费页 3-缴费完成页 4-停车场详情页 5-新手指南 6-领停车券 7-UGCBanner管理'     8-加油活动
			},
			//广告位跳转
			navDetail(){
				goLink(this.advertisement.miniprogramurl)
			},
			// 点击输入框
			tap(index){
				this.current = index;
				this.addNewEnergy = false;
				if(index<7){
					this.carNumber[index].id = '';
				} else {
					this.newEnergyNum = '';
				}
				if(index == 0){
					// 显示省份
					this.isShow = true;
					this.keyBoardType= 1 ;
				}else if(this.current == this.carNumber.length){
					if(this.newEnergy == 1){
						this.addNewEnergy = true;
					} else {
						this.isShow = false;					
					}
				}else{
					//显示数字和英文
					this.isShow = true;
					this.keyBoardType= 0 ;
				}
			},
			tap2(){
				this.newEnergyNum = '';
				var flag = this.carNumber.every((item)=>{
					return item.id == '';
				})
				if(flag){
					this.current = 0;
					this.keyBoardType = 1;
					this.newEnergy = 1;
					this.newEnergyText = '';
				} else {
					//显示数字和英文
					this.isShow = true;
					this.keyBoardType= 0 ;
					this.addNewEnergy = true;
					this.current = this.carNumber.length;
				}
			},
			// 输入
			inputChange(value){
				if(!this.addNewEnergy){
					this.carNumber[this.current].id =  value;
					this.current ++;
					this.isShow = true;
					this.tap(this.current)
				}else{
					// 新能源
					this.newEnergyNum = value;
					this.isShow = false;
					this.current ++;
				}
				var flag = this.carNumber.every((item)=>{
					return item.id
				})
				if(flag){
					this.disabled = false
				}
			},
			// 删除
			inputDelete(){
				if(this.addNewEnergy){
					this.newEnergyNum = ''
					this.addNewEnergy = false
					this.current = this.carNumber.length - 1;
				}else{
					let value = this.carNumber[this.current].id;		
					if(this.current > 0){
						if(!value){
							this.current --
						}
						this.carNumber[this.current].id =  '';
						if(this.current == 0){
							// 显示省份
							this.isShow = true;
							this.keyBoardType= 1 ;
						}
					}else if(this.current == 0){
						if(value){
							this.carNumber[this.current].id =  '';
						}
					}
					this.disabled = true
				}
			},
			inputHide(){
				this.isShow = false;
			},
			// 领取优惠券
			async addCouponRecord2(){
				if(this.canTap){
					this.canTap = false;
					this.isShow = false;
					this.addNewEnergy = false;
					this.current = this.carNumber.length + 1;
					var str = '';
					if(!this.disabled){
						this.carNumber.forEach((item)=>{
							str += item.id
						})
						if(this.newEnergyNum){
							this.brandType = 1
							str += this.newEnergyNum
						}
						this.brandNumber = str;
						var reg= /^[A-Za-z]/;
						if (reg.test(this.carNumber[1].id)){
							const {data} = await addCouponRecord2({
								key:this.rebate,
								carNumber:this.brandNumber,
								isBind:this.isBind,
								brandType:this.brandType,
								istrue:true
							})
							if(data.code == 1){
								uni.showToast({
									title:"领取成功",
									icon:'none'
								})
								setTimeout(()=>{
									uni.reLaunch({
										url:'/pages/index/index?status=success'
									})
								},1500)
							} else {
								this.msg = data.msg;
								this.toastVisibile = true;
								this.isBind = false;
								setTimeout(()=>{
									this.toastVisibile = false;
									this.msg = '';
								},1500)
							}
						}else{
							uni.showToast({
								title: '车牌第二位应为城市代码',
								icon:"none",
								duration: 2000
							});
						}
					}else{
						uni.showToast({
							title: '请正确输入车牌号',
							icon:"none",
							duration: 2000
						});
					}
					setTimeout(()=>{
						this.canTap = true;
					},3000);
				}
			}
		}
	}
</script>

<style lang="scss">
	.getcouponImg{
		width: 40rpx;
		height: 40rpx;
	}
	.add-box{
		border-radius: 20rpx;
	}
	.numberBox{
		// background: #F6F8FB;
		.numbox{
			width: 60rpx;
			height: 72rpx;
			background: #F6F8FB;
			border-radius: 12rpx;
			text-align: center;
			line-height: 80rpx;
			box-sizing: border-box;
			// input{
			// 	width: 100%;
			// 	height: 100%;
			// }
			&.active{
				border: 1rpx solid #FA4242;
			}
		}
	}
	.bind-box{
		padding: 16rpx 40rpx;
		border-radius:20px;
	}
	.icon{
		width: 30rpx;
		height: 30rpx;
	}
	.btn{
		position: fixed;
		left: 50%;
		bottom: 50rpx;
		margin-left: -335rpx;
		width: 670rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		border-radius: 20rpx;
		background-color: #ff4610;
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
	}
</style>
