<!-- 商品列表组件 <pd-list :list="xx"></pd-list> -->
<template>
	<view>
		<view class="card-wrap" :v-if="list.length>0" v-for="(order,index) in list" :key="order.orderCode" >
			<!-- <good-item :checkMode="checkMode" :tabStatus="tabStatus" :order="order"></good-item> -->
			<parkingGoodItem :checkMode="checkMode" :tabStatus="tabStatus" :order="order" v-if="currentTypeId == 1"></parkingGoodItem>
			<rentGoodItem :checkMode="checkMode" :tabStatus="tabStatus" :order="order"  v-if="currentTypeId == 2"></rentGoodItem>
			<addoilGoodItem :checkMode="checkMode" :tabStatus="tabStatus" :order="order"  v-if="currentTypeId == 3"></addoilGoodItem>
			<examGoodItem :checkMode="checkMode" :tabStatus="tabStatus" :order="order" :currentTypeId="currentTypeId"  v-if="currentTypeId == 6"></examGoodItem>
			<washGoodItem :checkMode="checkMode" :tabStatus="tabStatus" :order="order" :currentTypeId="currentTypeId" v-if="currentTypeId == 7"></washGoodItem>
			<maintainGoodItem :checkMode="checkMode" :tabStatus="tabStatus" :order="order" :currentTypeId="currentTypeId" v-if="currentTypeId == 8"></maintainGoodItem>
		</view>		
	</view>
</template>

<script>
	// import GoodItem from './good-item.vue'
	import parkingGoodItem from './good-item/parking.vue' //停车
	import addoilGoodItem from './good-item/addoil.vue' //加油
	import rentGoodItem from './good-item/rent.vue' //租赁
	import examGoodItem from './good-item/exam.vue' //车检
	import washGoodItem from './good-item/wash.vue' //车检
	import maintainGoodItem from './good-item/maintain.vue' //车检
	
	export default {
		components: {
			// GoodItem,
			parkingGoodItem,
			addoilGoodItem,
			rentGoodItem,
			examGoodItem,
			washGoodItem,
			maintainGoodItem
		},
		props:{
			list: { // 数据列表
				type: Array,
				default(){
					return []
				}
			},
			tabStatus: Number,
			checkMode: Boolean,
			currentTypeId:Number
		},
		methods:{
			//去订单详情
			// nav2orderDetail (index) {
			//   this.$store.commit('set_orderIdDetail', this.list[index].orderCode)
			//   uni.navigateTo({
			//     url: '/personal/order/orderDetail/index'
			//   })
			// },
		},
	}
</script>

