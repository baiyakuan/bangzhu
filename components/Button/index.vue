<template>
  <button
    :disabled='disabled || loading'
    :loading='loading'
    class="d_btn"
    :class="[typeClass, className, radiusClass]"
    :plain='plain'
    :hover-class='hoverClass'
    open-type='openType'
    @getuserinfo='getUserInfo'
    @click="onClick"
    >
    <slot>  </slot>
  </button>
</template>

<script>
const prefix = 'd_btn'
export default {
  props: {
    payMoney:{
      type: Number,
      default: 0
    },
    openType: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    },
    className: {
      type: String,
      default: ''
    },
    plain: {
      type: Boolean,
      default: false
    },
    hoverClass: {
      type: String,
      default: 'none'
    },
    radius: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    typeClass () {
      return `${prefix}--${this.type}`
    },
    radiusClass () {
      return this.radius ? `${prefix}--radius` : ''
    }
  },
  methods: {
    onClick () {
      if (this.disabled) {
        return
      }
      this.$emit('click')
    },
    getUserInfo (e) {
      this.$emit('getUserInfo', e.mp.detail)
    }
  }
}
</script>

<style lang='stylus'>
@import '../../styles/btn.styl'
</style>
