<template>
  <div
    v-if="showFullScreenBtn"
    class="full-screen-btn-con"
    @click="handleChange"
  >
    <Tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom">
      <Icon :type="value ? 'md-contract' : 'md-expand'" :size="21" />
    </Tooltip>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: false
    }
  },
  computed: {
    showFullScreenBtn() {
      return process.client ? window.navigator.userAgent.indexOf('MSIE') < 0 : true
    }
  },
  created() {
    if (process.client) {
      // console.log('process.client', process.client, document.webkitIsFullScreen)
      // let isFullscreen =
      //   document.fullscreenElement ||
      //   document.mozFullScreenElement ||
      //   document.webkitFullscreenElement ||
      //   document.fullScreen ||
      //   document.mozFullScreen ||
      //   document.webkitIsFullScreen
      // isFullscreen = !!isFullscreen
      // document.addEventListener('fullscreenchange', () => {
      //   this.$emit('input', !this.value)
      //   this.$emit('on-change', !this.value)
      // })
      // document.addEventListener('mozfullscreenchange', () => {
      //   this.$emit('input', !this.value)
      //   this.$emit('on-change', !this.value)
      // })
      // document.addEventListener('webkitfullscreenchange', () => {
      //   this.$emit('input', !this.value)
      //   this.$emit('on-change', !this.value)
      // })
      // document.addEventListener('msfullscreenchange', () => {
      //   this.$emit('input', !this.value)
      //   this.$emit('on-change', !this.value)
      // })
      // this.$emit('input', isFullscreen)
    }
  },
  methods: {
    handleFullscreen() {
      const main = document.body
      if (this.value) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.value = false
      } else if (!this.value) {
        if (main.requestFullscreen) {
          main.requestFullscreen()
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen()
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen()
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen()
        }
        this.value = true
      }
    },
    handleChange() {
      this.handleFullscreen()
    }
  }
}
</script>
