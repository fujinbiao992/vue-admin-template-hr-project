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
                  <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger">删除</el-button>
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
  </div>
</template>
<script>
// 导入接口数据
import { getRoleList } from '@/api/settings'
export default {
  data() {
    return {
    // 承接数组
      tableList: [],
      params: {
        page: 1,
        pageSize: 10
      }
    }
  },
  mounted() {
    this.HGetRoleList()
  },
  methods: {
    async HGetRoleList() {
      const res = await getRoleList(this.params)
      this.tableList = res.rows
    },
    edit(row) {
      console.log(row)
    },
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
