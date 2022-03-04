<template>
	<view class="pd40-x">
		<view class="fs pd40-y">
			<view class="fst input-box bgw pdl30">
				<image :src="staticImg + 'static/img/ic_search.png'" class="searchIcon"  @click="clickSearch"></image>
				<input :focus="true" type="text" class="input ft28 mgl20" v-model="searchVal" placeholder="请输入关键词" placeholder-class="placeholder" @input="debouncedSearch" />
			</view>
			<view class="cancel ft28 ftweight" @click="cancelSearch">
				取消
			</view>
		</view>
		<view v-if="historyArr.length && !searchVal">
			<view v-for="(item,index) in historyArr" :key="index">
				<view class="history-box bgw fs pd30-x mgb20" >
					<view class="fst namebox" @click="search(item)">
						<!-- <image :src="staticImg + 'static/img/history-icon.png'" mode=""></image> -->
						<image :src="staticImg + 'static/img/history.png'" class="historyIcon"></image>
						<text class="ft22 name mgl20">{{item}}</text>
					</view>
					<view class="">
						<image :src="staticImg + 'static/img/deleteHistory.png'" class="deleteIcon" @click="deleteOneHistory(index)"></image>
					</view>
				</view>
			</view>
			<view class="history-box bgw tac ft22" @click="deleteAllHistory">
				清除历史记录
			</view>
		</view>
		<view v-else-if="searchVal">
			
			<parking-list
				:parkingArray="searchResults" 
				:v-if="searchResults.length>0"
				:Imgpath="Imgpath"
				@itemClick="itemClick"
				:pageStatus="pageStatus"
			></parking-list>
			
			<view v-if="!searchResults.length" class="noList">
				<image :src="staticImg + 'static/img/nocar.png'"></image>
				<view>暂无搜索结果</view>
				
			</view>

		</view>
	</view>
</template>

<script>
	import { setStorage , getStorage } from '@/utils/auth.js'
	import { pushParkSearchHistory, getSearchValue } from '@/utils'
	import { debounce, get } from '@/utils/miniLodash'
	import ParkingList from '../component/parkingList/parkingList.vue'
	
	export default {
		components:{
			ParkingList
		},
		data(){
			return {
				searchVal:'', 
				historyArr:[], 
				pageStatus: 'carRental'
			}
		},
		computed: {
			staticImg() { return this.$store.state.staticImg },
			Imgpath() {
				return this.$store.state.Imgpath
			},
			searchResults() {
				return this.$store.state.carRentalModule.parkingSearch.searchResults
			},
			type() {
				return this.pageStatus == 'carRental' ? 1 : 2
			}
		},
		onLoad(options) {
			if (options.pageStatus) {
				this.pageStatus = options.pageStatus
			}
		},
		mounted() {
			this.historyArr = getStorage('historyArr') || []
			this.debouncedSearch = debounce(this.search, 500)
		},
		methods:{
			clickSearch() {
				this.search(this.searchVal)
			},
			search(value){
				const searchVal = getSearchValue(value)
				if (searchVal) {
					this.$store.dispatch('carRentalModule/searchParkingOfRentAction', { parkingName: searchVal, type: this.type })
				} else {
					this.$store.commit('carRentalModule/clearSearchResults')
				}
				this.searchVal = searchVal
			},
			deleteOneHistory(i){
				this.historyArr.splice(i,1);
				setStorage('historyArr',this.historyArr);
			},
			deleteAllHistory(){
				setStorage('historyArr',[]);
				this.historyArr = []
			},
			cancelSearch(){
				uni.navigateBack({
					delta:1
				})
			},
			itemClick(item) {
				this.pushHistory(item.parkingName)
			},
			pushHistory(history) {
				let checkedHistory = pushParkSearchHistory(this.historyArr, history)
				setStorage('historyArr',checkedHistory);
				this.historyArr = checkedHistory
			}
		}
	}
</script>

<style lang="scss">
	.input-box{
		width: 574rpx;
		height: 82rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		.searchIcon{
			width: 40rpx;
			height: 40rpx;
		}
		.input{
			width: 100%;
			height: 82rpx;
			line-height: 82rpx;
			color:rgba(122,129,141,1);
		}
	}
	.placeholder{
		color:rgba(122,129,141,0.5);
	}
	.cancel{
		color:#7A818D;
	}
	.history-box{
		height:72rpx;
		line-height: 72rpx;
		border-radius: 20rpx;
		color:#7A818D;
		.namebox{
			width: 80%;
			.historyIcon{
				width: 22rpx;
				height: 22rpx;
			}
			.name{
				width:100%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				color:#7A818D;
			}
		}
		.deleteIcon{
			width: 18rpx;
			height: 18rpx;
		}
}
.noList{
	padding-top: 200rpx;
	text-align: center;
	font-size: 28rpx;
	color: #4A5362;
	image{
		width: 248rpx;
		height: 160rpx;
	}
}
</style>
