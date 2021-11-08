<template>
  <!-- 放置一个图标 -->
  <div>
    <svg-icon :icon-class="isScreenFull?'exit-fullscreen':'fullscreen'" class="fullscreen" @click="clickHandler" />
  </div>
</template>

<script>
export default {
  name: 'ScreenFull',
  data() {
    return {
      isScreenFull: false
    }
  },
  mounted() {
    // 监听无法esc无法关闭
    document.addEventListener('fullscreenchange', e => {
      // 监听到屏幕变化,判断是否退出全屏,已经退出,把状态修改为false
      const isFull = document.fullscreenElement
      if (!isFull) {
        this.isScreenFull = false
      }
    })
  },
  methods: {
    clickHandler() {
      if (this.isScreenFull) {
        // 关闭
        document.exitFullscreen()
      } else {
        // 打开
        document.documentElement.requestFullscreen()
      }
      this.isScreenFull = !this.isScreenFull
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  width: 20px;
  height: 20px;
  color: #fff;
  cursor: pointer;
}
</style>
