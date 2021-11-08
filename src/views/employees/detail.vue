<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 使用login-setting组件 -->
            <login-setting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <!-- 使用user-info组件 -->
            <user-info />
          </el-tab-pane>
          <el-tab-pane label="岗位信息" />
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import LoginSetting from './components/login-setting'
import UserInfo from './components/user-info'
import { getUserDetailById } from '@/api/user'
export default {
  components: {
    LoginSetting,
    UserInfo
  },
  data() {
    return {
      userId: this.$route.query.id,
      userInfo: {}
    }
  },
  mounted() {
    this.HgetUserDetailById()
  },
  methods: {
    async HgetUserDetailById() {
      const res = getUserDetailById(this.userId)
      this.userInfo = res
      console.log(res)
    }
  }
}
</script>
