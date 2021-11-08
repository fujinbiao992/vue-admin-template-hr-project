<template>
  <!-- 当前这个组件,与employee中的业务组件,是父子组件之间的关系,所以在props中可以接收父组件上绑定的属性,完后后续的操作 -->
  <el-image :src="url">
    <template #error>
      <!-- 替换原有的默认图片,替换成自己需要渲染的 -->
      <img src="./img/head.jpg" alt="" class="img-holder">
    </template>
  </el-image>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>
<style>
.img-holder{
  border-radius: 50%;
}
</style>
