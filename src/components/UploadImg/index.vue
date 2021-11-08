<template>
  <div>
    <!--
      show-file-list 显示列表
      on-success 上传成功的返回的回调函数
      before-upload 上传成功以后的回调函数
      http-request 上传

     -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
      :http-request="upload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
      <!-- 进度条组件 -->
      <el-progress v-if="progressFlag" type="circle" :percentage="progress" />
    </el-upload>
  </div>
</template>

<script>
var COS = require('cos-js-sdk-v5')
const cos = new COS({
  SecretId: 'AKID4nMiqkPq47xc2ECvRlrkPq31lHafYDeq', // 身份识别ID
  SecretKey: '1pPo0xkLkwueAUbU8YjfR4TdYFhwxjJe' // 身份秘钥
})
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      progress: 0,
      progressFlag: false
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPNG) {
        this.$message.error('上传头像图片只能是 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPNG && isLt2M
    },
    upload(res) {
      this.progressFlag = false
      // 腾讯云上传图片基本配置对象
      cos.putObject({
        Bucket: '01-my-roject-1307040377', /* 必须 */
        Region: 'ap-beijing', /* 存储桶所在地域，必须字段 */
        Key: 'exampleobject', /* 必须 */
        StorageClass: 'STANDARD',
        Body: res.file, // 上传文件对象
        onProgress: function(progressData) {
          console.log('当前上传进度为' + JSON.stringify(progressData))
          this.progress = Math.ceil(progressData.percent * 100)
        }
      }, (err, data) => {
        console.log('上传成功了' + err || data)
        if (data.statusCode === 200) {
          this.imageUrl = `https:${data.Location}`
        }
        // 上传成功后,通知父组件,更改imgUrl路径信息
        this.$emit('input', this.imageUrl)
        this.progressFlag = false
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
