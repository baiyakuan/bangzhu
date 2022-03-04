<template>
	<view v-if="isShow" class="vehicle-panel"  :style="{'backgroundColor':backgroundColor}" style="height:430rpx">
	  <!--省份简写键盘-->
	  <block v-if="keyBoardType === 1">
	    <view class="vehicle-panel-row">
	      <view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button' :style="{'border':buttonBorder}" v-for="(item,idx) in keyVehicle1"  @click='vehicleTap' :key="idx" :data-value="item">{{item}}</view>
	    </view>
	    <view class="vehicle-panel-row">
	      <view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button' :style="{'border':buttonBorder}" v-for="(item,idx) in keyVehicle2" @click='vehicleTap' :key="idx" :data-value="item">{{item}}</view>
	    </view>
	    <view class="vehicle-panel-row">
	      <view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button' :style="{'border':buttonBorder}" v-for="(item,idx) in keyVehicle3" @click='vehicleTap' :key="idx" :data-value="item">{{item}}</view>
	    </view>
	    <view class="vehicle-panel-row-last">
			<view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button vehicle-panel-row-button-last vehicle-en-button-delete' @click='vehicleTap' data-value="hide" :style="{'border':buttonBorder}">
					隐藏
			</view>
			<view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button vehicle-panel-row-button-last' @click='vehicleTap' :data-value="item" v-for="(item,idx) in keyVehicle4" :style="{'border':buttonBorder}" :key="idx">{{item}}</view>
			
			<view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button vehicle-panel-row-button-last vehicle-en-button-delete' @click='vehicleTap' data-value="delete" :style="{'border':buttonBorder}">
					删除
			</view>
		</view>
	  </block>
	  <!--英文键盘  -->
	  <block v-else>
	    <view class="vehicle-panel-row">
	      <view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button vehicle-panel-row-button-number' v-for="(item,idx) in keyNumber" @click='vehicleTap' :style="{'border':buttonBorder}" :key="idx" :data-value="item">{{item}}</view>
	    </view>
	    <view class="vehicle-panel-row">
	      <view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button' :style="{'border':buttonBorder}"  v-for="(item,idx) in keyEnInput1" @click='vehicleTap'  :key="idx" :data-value="item" :class="{'vehicle-panel-row-button-noStyle':item=='O' || item=='I'}">{{item}}</view>
	    </view>
	    <view class="vehicle-panel-row">

			
	      <view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button' :style="{'border':buttonBorder}" v-for="(item,idx) in keyEnInput2" @click='vehicleTap' :key="idx" :data-value="item">{{item}}</view>
			

	    </view>
	    <view class="vehicle-panel-row-last">
			<view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button vehicle-panel-row-button-last vehicle-en-button-delete' @click='vehicleTap' data-value="hide" :style="{'border':buttonBorder}">
					隐藏
			</view>
	      <view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button vehicle-panel-row-button-last' @click='vehicleTap' :style="{'border':buttonBorder}"  v-for="(item,idx) in keyEnInput3" :key="idx" :data-value="item">{{item}}</view>
	      <!-- <view hover-class="vehicle-hover" :style="{'border':buttonBorder}" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button vehicle-panel-ok' @click='vehicleTap' data-value="ok">确定</view> -->
			<view hover-class="vehicle-hover" hover-start-time="10" hover-stay-time="100" class='vehicle-panel-row-button vehicle-panel-row-button-last vehicle-en-button-delete' @click='vehicleTap' data-value="delete" :style="{'border':buttonBorder}">
					删除
			</view>
		</view>
	  </block>
	</view>
</template>

<script>
export default {
	props: {
		isShow: {
			type: Boolean,
			value: true,
		},
		buttonBorder: {
			type: String,
			value: "1px solid #ccc"
		},
		backgroundColor: {
			type: String,
			value: "#fff"
		},
		//1为省份键盘，其它为英文键盘
		keyBoardType: {
			type: Number,
			value: 1,
		}
	},
	data() {
		return {
			keyVehicle1: ['京','津','沪','渝','苏','浙','豫','粤','川','陕'],
			keyVehicle2: ['冀','辽','吉','皖','闽','鄂','湘','鲁','晋','黑'],
			keyVehicle3: ['赣','贵','甘','桂','琼','云','青','蒙','藏','宁'],
			keyVehicle4: ['新','港','澳','台','警','学'],
			keyNumber: ['1','2','3','4','5','6','7','8','9','0'],
			keyEnInput1: ['Q','W','E','R','T','Y','U','I','O','P'],
			keyEnInput2: ['A','S','D','F','G','H','J','K','L','Z'],
			keyEnInput3: ['X','C','V','B','N','M'],
		}
	},
	methods: {
		vehicleTap(event) {
			let val = event.target.dataset.value;
			switch (val){
				case 'delete':
				this.$emit('delete');
				// this.$emit('inputchange');
				break;
				case 'hide':
				this.$emit('hide');
				break;
				case 'ok':
				this.$emit('ok');
				break;
				case 'I':
				break;
				case 'O':
				break;
				default:
				this.$emit('inputchange', val);
			}
		},
	}
}
</script>

<style>
:host {
  width: 100%;
}
.vehicle-panel {
  width: 100%;
  position: fixed;
	left: 0;
  bottom: 0;
  display:flex;
  flex-direction:column;
  justify-content:center;
  z-index: 1000;
  padding: 20rpx;
  box-sizing: border-box;
}
.vehicle-panel-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vehicle-panel-row-last{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.vehicle-panel-row-button {
  background-color: #fff;
  margin: 5rpx 0;
  width: 62rpx;
  height: 88rpx;
  text-align: center;
  line-height: 88rpx;
  border-radius: 10rpx;
  box-sizing: border-box;
}
.vehicle-panel-row-button-noStyle{
	 background-color: rgba(229,229,229,1);;
}
.vehicle-panel-row-button-number {
  /* background-color: #eee; */
}
.vehicle-panel-row-button-last {
  width: 62rpx;
  height: 88rpx;
  line-height: 88rpx;
}
.vehicle-hover {
  background-color: #ccc;
}
.vehicle-panel-row-button-img {
  display: flex;
  justify-content: center;
  align-items: center;
}
.vehicle-en-button-delete {
  width: 135rpx;
  height: 88rpx;
}
.vehicle-panel-ok {
  background-color: #0F4BA1;
  color: #fff;
  width: 150rpx;
  height: 80rpx;
}
</style>
