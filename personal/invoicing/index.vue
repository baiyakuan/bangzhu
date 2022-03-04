<template>
	<view>
		<view class="pd40-x pd50-y bgw">
		  <view class="ft50 ftweight rgb51">开具发票</view>
		</view>
		<view class="pdt20">
		   <uni-list>
			 <uni-list-item title="停车服务开票" @click="goOrder(0)" :isFirstChild="true" :isBold="true"></uni-list-item>
			 <uni-list-item title="租赁服务开票" @click="goOrder(1)" :isBold="true"></uni-list-item>
			 <uni-list-item title="会员服务开票" @click="goOrder(2)" :isBold="true"></uni-list-item>
			 <!-- <uni-list-item title="拨打客服"  @click="visible = true" :only-tap-footer='true' :onlyTapFooter='true' :rightText='servicePhone'></uni-list-item>      -->
		   </uni-list>
		</view>
		  
		<view class="pdt20">
		   <uni-list>
			 <uni-list-item title="抬头管理" @click="goHead" :isFirstChild="true" :isBold="true"></uni-list-item>
			 <uni-list-item title="开票历史" @click="goHistory" :isBold="true"></uni-list-item>
			 <uni-list-item title="开票帮助" @click="goHelp" :isBold="true"></uni-list-item> 
		   </uni-list>
		</view>
	</view>
</template>

<script>
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	export default {
		components:{
			uniList,
			uniListItem
		},
		data() {
			return {
				
			}
		},
		methods: {
			goHelp(){
				uni.navigateTo({
					url:"/personal/invoicing/help/index"
				})
			},
			goHistory(){
				console.log(1)
				uni.navigateTo({
					url:"/personal/invoicing/history/index"
				})
			},
			goHead(){
				uni.navigateTo({
					url:"/personal/invoicing/headManage/index1"
				})
			},
			goOrder(id){
				// uni.navigateTo({
				// 	url:"/personal/invoicing/order/index?id=" + id
				// })
				uni.navigateTo({
					url:'/personal/carRental/rentList2/index?id=' + id + '&isInvoice=1'
				})
			}
		}
	}
</script>

<style>

</style>
