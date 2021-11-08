<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <!-- 新增角色按钮 -->
        <el-row style="height:60px">
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="showDialog = true"
          >新增角色</el-button>
        </el-row>
        <!-- 表格 -->
        <!--
          1. data属性  传入一个对象数组
          2. table按照列来渲染  把每列要渲染的字段名称通过prop属性指定
          3. 自定义内容渲染 借助插槽进行渲染 slot-scope ="scope"  scope.row (拿到的是当前行的完整数据对象)
         -->
        <el-table :data="roleList">
          <el-table-column label="序号" width="120" type="index" />
          <el-table-column label="角色名称" width="240" prop="name" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <!--
              插槽新语法 + 解构
             -->
            <template #default="{ row }">
              <el-button size="small" type="success" @click="addClickPermission(row.id)">分配权限</el-button>
              <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
              <el-button size="small" type="danger" @click="hDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <!-- 分页组件 -->
          <!--
            1. layout 配置分页器的结构组成
            2. total  数据总条数  分页逻辑：总条数 / 每页条数(10) = 页数
            3. @current-change  点击页数的时候自动触发的事件 可以把当前点击的页数 传出来供业务使用
           -->
          <el-pagination layout="prev,pager,next" :total="100" @current-change="pageChange" />
        </el-row>
      </el-card>
    </div>
    <!-- 新增弹框 -->
    <el-dialog :visible="showDialog" :title="roleList.id?'编辑角色':'新增角色'" @close="cleanBtn">
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
          <el-button size="small" @click="showDialog=fasle">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 添加权限点弹窗 -->
    <add-permission
      :show-permission-dialog="showPermissionDialog"
      :cur-id="curId"
      @close-dialog="closePerssionsDialog"
    />
  </div>
</template>

<script>
import { getRoleList, addRole, updateRole, deleteRole } from '@/api/setting'
import AddPermission from './components/add-permission'
export default {
  components: {
    AddPermission
  },
  data() {
    return {
      showDialog: false,
      roleList: [], // 承接数组
      params: {
        page: 1,
        pagesize: 10
      },
      total: 100,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermissionDialog: false,
      curId: null
    }
  },
  mounted() {
    this.hGetRoleList()
  },
  methods: {
    // 基本数据方法
    async hGetRoleList() {
      const res = await getRoleList(this.params)
      this.roleList = res.rows
      this.total = res.total
    },
    closePerssionsDialog() {
      this.showPermissionDialog = false
    },
    // 分页方法
    pageChange(page) {
      this.params.page = page
      this.hGetRoleList()
    },
    // 取消新增
    cleanBtn() {
      // 清除value数据
      this.roleForm = {
        name: '',
        description: ''
      }
      // 移除校验
      this.$refs.roleForm.resetFields()
      // 关闭弹窗
      this.showDialog = false
    },
    // 新增保存
    btnOK() {
      // 1.兜底校验
      // 2.调用新增方法
      this.$refs.roleForm.validate(async(valid) => {
        if (valid) {
          // 做判断处理 判断当前是新增还是编辑
          if (this.roleForm.id) {
            // 编辑更新接口
            await updateRole(this.roleForm)
          } else {
            // 调用新增接口
            await addRole(this.roleForm)
          }
          // 1.更新列表
          this.hGetRoleList()
          // 2.给出提示
          this.$message.success('更新角色成功')
          // 3.关闭弹框
          this.showDialog = false
        }
      })
    },
    // 删除角色
    async hDel(id) {
      try {
        await this.$confirm('您确定要删除角色吗?')
        await deleteRole(id)
        // 调用更新接口
        this.hGetRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑弹窗
    edit(id) {
      this.showDialog = true
      this.hGetRoleList(id)
    },
    // 分配权限
    addClickPermission(id) {
      this.curId = id
      this.showPermissionDialog = true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
