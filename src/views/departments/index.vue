<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <el-col>操作人</el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
      <!-- 树形控件 -->
      <el-tree
        :data="list"
        :prps="defaultProps"
        :default-expand-all="true"
      >
        <template #default="{ data }">
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
    <!-- 新增部门组件 -->
    <add-deep
      ref="addDeep"
      :show-dialog="showDialog"
      :cur-node="curNode"
      :code-data="codeData"
      @close-dialog="closeDialog"
      @updae-depart="hGetDepartments"
    />
  </div>
</template>
<script>
import { getDepartments, delDepartments, getDepartDetail } from '@/api/departments'
import { tranTreeData } from '@/utils/transTreeData'
import AddDeep from './components/add-deep.vue'
export default {
  components: { AddDeep },
  data() {
    return {
      list: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      // 记录点击行为
      curNode: null,
      // 获取code数据
      codeData: []
    }
  },
  mounted() {
    this.hGetDepartments()
  },
  methods: {
    // 关闭按钮
    closeDialog() {
      this.showDialog = false
    },
    // tree数据
    async hGetDepartments() {
      const res = await getDepartments()
      this.list = tranTreeData(res.depts)
      this.codeData = res.depts.map(item => item.code)
    },
    // 删除部门数据
    delPart(id) {
      this.$confirm('您确定删除部门吗?', '温馨提示').then(async() => {
        // 1- 发送请求,并且传入对应的ID,进行删除操作
        await delDepartments(id)
        // 2- 删除完毕后,需要提示用户
        this.$message('成功删除部门信息')
        // 3- 更新删除完后数据
        this.hGetDepartments()
      }).catch(error => {
        console.log(error)
      })
    },
    // 新增部门数据
    async hGetDepartDetail(id) {
      const res = await getDepartDetail(id)
      console.log(res)
    },
    // 添加部门
    add(data) {
      // 1- 每次发生点击的时候,需要使用Pid进行记录
      this.curNode = data
      // 2- 触发添加后,更改showDialog的状态
      this.showDialog = true
    },
    // 编辑部门
    editDepart(data) {
      // 1- 点击打开弹窗
      this.showDialog = true
      // 2- 需要记录当前点击操作
      this.curNode = data
      // 3- 通知子组件进行数据回显和接口调用
      this.$refs.addDeep.hGetDepartDetails(data.id)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
