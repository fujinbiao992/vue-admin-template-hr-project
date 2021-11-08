<template>
  <!-- 分配权限的弹层 -->
  <el-dialog
    title="分配权限(一级为路由页面查看权限-二级为按钮操作权限)"
    :visible="showPermissionDialog"
    @close="closeDialog"
    @open="openDialog"
  >
    <!-- 权限点数据展示 -->
    <el-tree
      ref="tree"
      node-key="id"
      :data="permissionData"
      :props="{ label: 'name' }"
      :default-expand-all="true"
      :show-checkbox="true"
      :check-strictly="true"
    />
    <template #footer>
      <div style="text-align: right;">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="hAssingPerm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script>
import { getPermissionList } from '@/api/permisson'
import { assignPerm, getRoleDetail } from '@/api/setting'
import { transTreeData } from '@/utils/transTreeData'
export default {
  props: {
    showPermissionDialog: {
      type: Boolean
    },
    curId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      permissionData: []
    }
  },
  methods: {
    closeDialog() {
      // 通知父组件
      this.$emit('close-dialog')
      // 清空tree校验规则
      this.$refs.tree.setCheckedKeys([])
    // 打开弹窗
    },
    openDialog() {
      // 调用请求接口数据方法
      this.hGetPermissionList()
      this.hGetRoleDetail()
    },
    // 展示数据
    async hGetPermissionList() {
      const res = await getPermissionList()
      this.permissionData = transTreeData(res, '0')
    },
    // 保存数据
    async hAssingPerm() {
      // 携带参数1: 父组件中通过点击事件传递的id
      // 携带参数2: 通过el中tree组件方法,组成的id数组
      await assignPerm({
        id: this.curId,
        permIds: this.$refs.tree.getCheckedKeys()
      })
      this.closeDialog()
      this.$message.success('保存成功')
    },
    // 回显数据
    async hGetRoleDetail() {
      const res = await getRoleDetail(this.curId)
      this.$refs.tree.setCheckedKeys(res.permIds)
    }
  }
}
</script>
