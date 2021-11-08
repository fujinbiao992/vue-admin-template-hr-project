<template>
  <el-dialog
    class="assign-role"
    title="分配角色"
    :visible="showRoleDialog"
    @close="closeDialog"
    @open="openDialog"
  >
    <!-- el-checkbox-group选中的是 当前用户所拥有的角色  需要绑定 当前用户拥有的角色-->
    <el-checkbox-group v-model="roleIds">
      <!-- 选项 -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>

    <template #footer>
      <div style="text-align: right">
        <el-button type="primary" @click="hAssignRoles">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { assignRoles } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    curUserId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      list: [], // 多选框列表
      roleIds: [] // 存放选中项
    }
  },
  mounted() {
    // this.hGetRoleList()
  },
  methods: {
    // 子传父
    closeDialog() {
      this.$emit('close-dialog', false)
    },
    // 数据请求
    async hGetRoleList() {
      const res = await getRoleList({ page: 1, pagesize: 100 })
      this.list = res.rows
    },
    // 保存角色
    async hAssignRoles() {
      await assignRoles({ id: this.curUserId, roleIds: this.roleIds })
      // 关闭弹窗
      this.closeDialog()
      // 提示用户
      this.$message.success('分配角色成功')
    },
    // 回显请求
    async hGetUserDetailById() {
      const res = await getUserDetailById(this.curUserId)
      this.roleIds = res.roleIds
    },
    // 打开弹窗
    openDialog() {
      // 基本信息
      this.hGetRoleList()
      // 回显信息
      // this.hGetUserDetailById()
    }
  }
}
</script>
<style lang="scss" scoped>
.assign-role {
  ::v-deep {
    .el-checkbox {
      font-size: 30px;
    }
  }
}
</style>
