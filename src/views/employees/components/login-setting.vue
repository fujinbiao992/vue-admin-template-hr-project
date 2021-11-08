<template>
  <!-- 放置表单 -->
  <el-form
    ref="form"
    :rules="rules"
    :model="userInfo"
    label-width="120px"
    style="margin-left: 120px; margin-top:30px"
  >
    <el-form-item label="姓名:" prop="username">
      <el-input v-model="userInfo.username" style="width:300px" />
    </el-form-item>
    <el-form-item label="密码:" prop="password">
      <el-input
        v-model="userInfo.password"
        type="password"
        style="width:300px"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="updateUserInfo">更新</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  data() {
    return {
      userId: this.$route.query.id,
      userInfo: {},
      rules: {
        username: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.hGetUserInfoById()
  },
  methods: {
    // 数据回显
    async hGetUserInfoById() {
      const res = await getUserDetailById(this.userId)
      this.userInfo = res
    },
    // 更新方法
    updateUserInfo() {
      this.$refs.form.validate(async vaild => {
        if (vaild) {
          // 调用更新接口
          await saveUserDetailById(this.userInfo)
          // 从新拉取数据
          this.hGetUserInfoById()
          // 提示用户
          this.$message.success('更新成功')
        }
      })
    }
  }
}
</script>
