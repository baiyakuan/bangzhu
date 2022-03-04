<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height="100%"固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	 <!-- top="227"  468 -->
	<mescroll-uni 
	 ref="mescrollRef" 
	 height="100%"
	 :top="top"
	 :down="downOption" 
	 @down="downCallback" 
	 :up="upOption" 
	 @up="upCallback" 
	 :bottom="bottom"
	>
		<!-- 数据列表 -->
		<good-list
			:list="renderList" 
			v-if="renderList.length>0" 
			:checkMode="showCheckMode" 
			:tabStatus="tabStatus" 
			:itemClick="itemClick"
			:currentTypeId="currentTypeId"
		></good-list>
	</mescroll-uni>
</template>

<script>
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	import GoodList from "./good-list.vue";
	import { getMescrollConfig } from '@/utils'
	import {
		createNamespacedHelpers
	} from 'vuex'
	const {
		mapActions,
		mapMutations
	} = createNamespacedHelpers('orderModule2')
	
	const { downOption, upOption } = getMescrollConfig((config) => {
		config.upOption.empty.tip = '暂无订单'
		return config
	});	
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			GoodList,
		},
		data() {
			return {
				downOption,
				upOption,
			}
		},
		props:{
			index: Number,
			tabs: Array,
			loadData: Function,
			hasNext: Boolean,
			curPageLen: Number,
			checkMode: Boolean,
			tabStatus: Number,
			itemClick: Function,
			currentTypeId:Number,
			tabBars:Array
		},
		computed: {
			renderList() {
				return this.$store.getters['orderModule2/selectedOrderDetail'](this.tabs[this.index]).orders
			},
			bottom() {
				return this.checkMode ? 167 : 0
			},
			showCheckMode () {
				return this.checkMode && this.tabs[this.index] != undefined
			},
			top(){
				return this.tabBars.length > 5 ? 450 : 420
			}
		},
		watch:{
			renderList(aaa){
				// console.log(aaa)
			}
		},
		methods: {
			...mapMutations(['resetOrderDetails']),
			resetMescroll(){
				this.mescroll.resetUpScroll(false)
			},
			downCallback() {
				this.resetOrderDetails()
				this.mescroll.resetUpScroll()
			},
			upCallback(page) {
				setTimeout(() => {
					this.$emit('loadData',{page:page,tabStatus:this.tabStatus},(curPageLen, hasNext) => this.mescroll.endSuccess(curPageLen, hasNext), () => this.mescroll.endErr())
				},500)
			}		
		}
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
</style>

