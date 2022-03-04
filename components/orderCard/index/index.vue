<template>
	<view>
		<view v-for="(item,index) in rentListData1" :key="index" v-if="showType.id == 0 && rentListData1.length">
			<parking-order :order='item' :showType='showType'
			></parking-order>
		</view>
		
		<view v-for="(item,index) in rentListData1" :key="index" v-if="showType.id == 1 && rentListData1.length">
			<rental-order :order='item' :showType='showType'  :pageStatus="pageStatus"
			@getOrder='getOrder'
			></rental-order>
		</view>
		
		<view v-for="(item,index) in rentListData1" :key="index" v-if="showType.id == 2 && rentListData1.length">
			<member-order :order='item' :showType='showType' ></member-order>
		</view>
	</view>
</template>

<script>
	import rentalOrder from '@/components/orderCard/rentalOrder/index.vue'
	import parkingOrder from '@/components/orderCard/parkingOrder/index.vue'
	import memberOrder from '@/components/orderCard/memberOrder/index.vue'
	import { mapState , mapMutations } from 'vuex'
	export default {
		components:{
			rentalOrder,
			parkingOrder,
			memberOrder
		},
		props:{
			showType:{
				type: Object
			},
			rentListData:{
				type: Array
			},
			pageStatus:{
				type: String
			},
		},
		data() {
			return {
				rentListData1: []
			}
		},
		mounted(){
		  this.rentListData1 = this.rentListData;
		},
		watch:{
			rentListData(n,o){
				this.rentListData1 = n
			}
		},
		computed:{
			...mapState('carRentalModule/carRentalOrderListModule',['selectList']),
			selectList1:{
				get(){
					return  JSON.parse(JSON.stringify(this.selectList))
				},
				set(data){
					this.selectList1 = data
				}
			}
		},
		methods: {
			...mapMutations('carRentalModule/carRentalOrderListModule',['updateSelectList']),
			getOrder(order,flag){
				let num = -1;
				// let filteredList = this.selectList1.filter((item, index) => item.id !== order.id)
				// filteredList.length === this.selectList1.length && filteredList.push(order)
				
				// this.selectList1 = filteredList
				var result = this.selectList1.some((item,index)=>{
					if(item.id == order.id){
						num = index;
						return true 
					} else{
						return false 
					}
				})
				if(result){
					this.selectList1.splice(num, 1)
				}else{
					this.selectList1.push(order)
				}
				this.updateSelectList([...this.selectList1])
				
				let arr = this.rentListData1.map(item => {
					if(item.id == order.id){
						return {...item,checked:order.checked}
					}else{
						return item
					}
				})
				this.rentListData1 = arr
			}
		}
	}
</script>

<style>

</style>
