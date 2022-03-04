<template>
  <div class="d_cutdonw"  :class="[className] ">
    <button
      :plain='true' 
      :disabled='disabled || isStart' 
      :phone='1'
      v-if="!isStart" @click.stop="onClick"  style="width:200rpx;">
      获取验证码
    </button>
    <button
      :plain='true' 
      :disabled='disabled || isStart' 
      :phone='1'
      v-else  style="width:200rpx;color:#f44a3e;background-color:white">
      {{ count }}秒
    </button>
  </div>
</template>
<script>
import { getPhoneCode } from '@/api'
export function getphone(str) {
  this.form =arr
}
export default {
  props: {
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 自定义雷鸣
    className: {
      type: String,
      default: ''
    },
    phone:{
      type:String
    },
    vCode:{
      type:String
    }
  },
  data () {
    return {
      count: 60,  // 初始倒计时数， 小程序下好像watch 更改不了
      isStart: false, // 是否开始
      timer: null   // 定时器
    }
  },
  methods: {
    // 点击事件
    async onClick () {
      if (this.disabled || this.isStart) {
        return
      }
      // console.log(11111);
      // 广播click事件给父组件
      this.$emit('click')
      
      //发送验证码
      var {data}= await getPhoneCode({
        phone:this.phone,
        vCode:this.vCode,
				Types:'wx',
        type: '1'
      })
      if(data.code==1){
        // 开启倒计时
        this.isStart = true
        this.start()
        this.count = 60;
      }
    },
    start () {  
      if (!this.count) { 
        this.count = 60
        this.isStart = false
        clearTimeout(this.timer)
        return
      } else {
        // 倒计时定时器
        this.count--
        this.timer = setTimeout(() => {
          this.start()
        }, 1000)
      }

    },
    
  }
}
</script>

<style lang='stylus'>
/* @import '../../styles/color.scss' */

.d_cutdonw
  color #f44a3e
  z-index 99
  font-size 28rpx
  line-height 50rpx
  button
    border-radius 200rpx
    line-height 60rpx
    height 60rpx
    background #f33535
    color #fff
    //border 0
    border-color #e5e5e5
    padding 0
    font-size inherit
</style>
