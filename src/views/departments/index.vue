<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
      <!-- 树形组件 -->
      <el-tree :data="list" :props="defaultProps" :default-expand-all="true">
        <template #default="{data}">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            style="height: 40px; width: 100%;"
          >
            <el-col :span="20">
              <span>{{ data.name }}</span>
            </el-col>
            <el-col :span="4">
              <el-row type="flex" justify="end">
                <!-- 两个内容 -->
                <el-col>{{ data.manager }}</el-col>
                <el-col>
                  <!-- 下拉菜单 element -->
                  <el-dropdown>
                    <span> 操作<i class="el-icon-arrow-down" /> </span>
                    <!-- 下拉菜单 -->
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="add(data)">添加子部门</el-dropdown-item>
                      <el-dropdown-item @click.native="editDepart(data)">编辑部门</el-dropdown-item>
                      <el-dropdown-item @click.native="delPart(data.id)">删除部门</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- tree子组件 -->
    <add-dept
      ref="addDeep"
      :show-dialog="showDialog"
      :curr-node="currNode"
      @close-dialog="handleClose"
      @update-list="hGetDepartments"
    />
  </div>
</template>
<script>
import { getDepartments, delDepartments } from '@/api/departments'
import { transTreeData } from '@/utils/transTreeData'
import AddDept from './components/add-dept'
export default {
  name: 'Depments',
  components: {
    AddDept
  },
  data() {
    return {
      list: [],
      defaultProps: {
        lable: 'name',
        children: 'children'
      },
      showDialog: false, // 控制新增组件,显示/隐藏
      currNode: null,
      sourceList: []
    }
  },
  mounted() {
    this.hGetDepartments()
  },
  methods: {
    // 基本数据
    async hGetDepartments() {
      const res = await getDepartments()
      this.sourceList = res.depts.map(item => item.code)
      // console.log(this.sourceList)
      this.list = transTreeData(res.depts)
    },
    // 关闭弹窗
    handleClose() {
      this.showDialog = false
    },
    // 新增
    add(data) {
      this.currNode = data
      this.showDialog = true
    },
    // 删除
    delPart(data) {
      // 1.询问用户
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 正式调用删除接口
        await delDepartments(data.id)
        // 更新列表
        this.hGetDepartments()
        // 通知用户
        this.$message.success('删除成功')
      }).catch((error) => {
        console.log(error)
      })
    },
    // 编辑
    editDepart(data) {
      // 1- 打开弹窗
      this.showDialog = true
      // 2- 记录当前点击
      this.currNode = data
      // 3- 调用接口数据
      this.$refs.addDeep.hGetDepartments(data.id)
    }
  }
}
</script>
