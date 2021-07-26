<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialogRoule"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="tableList">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="edit(scope.row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination layout="prev,pager,next" :total="50" @current-change="pageChange" />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 新增弹框 -->
    <el-dialog :title="roleForm.id?'编辑角色':'新增角色'" :visible="showDialog" @close="cloneDialog">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="cloneDialog">取消</el-button>
          <el-button size="small" type="primary" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
// 导入接口数据
import { getRoleList, deleteRole, addRole, updateRole, getRoleDetail } from '@/api/settings'
export default {
  data() {
    return {
    // 承接数组
      tableList: [],
      // 分页
      params: {
        page: 1,
        pageSize: 10
      },
      // 新增弹窗
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.HGetRoleList()
  },
  methods: {
    // 新增数据
    async HGetRoleDetail(id) {
      const res = await getRoleDetail(id)
      this.roleForm = res
    },
    // 角色数据
    async HGetRoleList() {
      const res = await getRoleList(this.params)
      this.tableList = res.rows
    },
    // 删除
    delRoles(id) {
      this.$confirm('确认删除用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 成功删除
        await deleteRole(id)
        // 更新列表
        this.HGetRoleList()
        // 提示信息
        this.$message.success('删除成功')
      }).catch(error => {
        // 删除失败
        console.log(error)
      })
    },
    // 编辑
    edit(id) {
      // 1- 展示弹窗
      this.showDialog = true
      // 2- 调用方法
      this.HGetRoleDetail(id)
    },
    // 新增
    showDialogRoule() {
      this.showDialog = true
    },
    // 确定
    btnOk() {
      this.$refs.roleForm.validate(async(valid) => {
        // 1- 编辑业务逻辑
        if (valid) {
          console.log(22)

          if (this.roleForm.id) {
            await updateRole(this.roleForm)
          }
        } else {
          // 获取数据
          await addRole(this.roleForm)
          // 更新列表
          this.HGetRoleList()
          // 提示信息
          this.$message.success('更新角色成功')
          // 关闭弹窗
          this.showDialog = false
        }
      })
    },
    // 取消
    cloneDialog() {
      // 1- 清空表单数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 2- 移除校验
      this.$refs.roleForm.resetFields()
      // 3- 关闭弹窗
      this.showDialog = false
    },
    // 分页方法
    pageChange(page) {
      // 点击页数,让table组件渲染当前页的对应数据
      // 1- 当页数被点击的时候,以page作为请求的参数,去发送数据请求,拿到的就是当前页的数据
      // 2- 把请求回来的数据,重新交给用来负责表格渲染的tableList进行渲染
      this.params.page = page
      this.HGetRoleList()
    }

  }
}

</script>
<style scoped>

</style>
