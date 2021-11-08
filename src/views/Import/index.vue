<template>
  <div class="dashboard-container">
    <upload-excel :on-success="onSuccess" :before-upload="beforeUpload" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
import { transExcelDataToSouceData } from '@/utils/excelData'
export default {
  name: 'Dashboard',
  methods: {
    async onSuccess({ results, header }) {
      // results代表的是表格数据
      // header代表的是表头数据
      console.log('解析成功：', results, header)
      // 业务：
      // excel组件只能提供一个数据转换的功能 只能把excel格式 转换成js能认识的普通数据对象 （excel -> js）
      // 我们拿到转换好的数据之后，需要自行调用接口去完成批量添加功能
      // 1. 把excel表格转换成的js数据 经过格式化处理 处理成后端需要的样子格式 (js -> js)
      const apiData = transExcelDataToSouceData(results)
      // 2. 调用批量导入接口 完成数据落库
      const res = await importEmployee(apiData)
      console.log(res)
    },
    beforeUpload(file) {
      // 代表文件对象 可以根据文件对象中的size name做解析前校验
      // 如果加了这个函数 必须要在最后返回一个布尔值才能校验通过
      // 通过之后才能执行成功回调函数
      console.log('上传前校验', file)
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
