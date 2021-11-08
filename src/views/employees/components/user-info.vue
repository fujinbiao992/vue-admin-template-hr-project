<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!--手机 聘用形式  -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="手机">
            <el-input v-model="userInfo.mobile" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 工号 入职时间 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="userInfo.timeOfEntry"
              type="date"
              class="inputW"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 员工照片 -->
      <el-row class="inline-info">
        <el-col :span="12">
          <el-form-item label="员工头像">
            <!-- 放置上传图片 -->
            <upload-img v-model="userInfo.staffPhoto" />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 保存个人信息 -->
      <el-row class="inline-info" type="flex" justify="center">
        <el-col :span="12">
          <el-button type="primary" @click="hSaveUserDetailById">保存更新</el-button>
          <el-button @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  data() {
    return {
      userId: this.$route.query.id,
      userInfo: {}
    }
  },
  mounted() {
    this.hGetUserDetailById()
  },
  methods: {
    // 获取用户头像
    async hGetUserDetailById() {
      const res = await getUserDetailById(this.userId)
      this.userInfo = res
      // this.$refs.staffPhoto.imageUrl = this.userInfo.staffPhoto
    },
    // 更新用户头像
    async hSaveUserDetailById() {
      // 通过子组件refs属性,拿到关键上传字段
      // this.userInfo.staffPhoto = this.$refs.staffPhoto.imageUrl
      await saveUserDetailById(this.userInfo)
      this.hGetUserDetailById()
      this.$message.success('更新成功')
    }
  }
}
</script>

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
