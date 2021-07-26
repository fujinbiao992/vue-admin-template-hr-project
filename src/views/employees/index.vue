<template>
  <div class="employees-container ">
    <div class="app-contatine">
      <page-tools>
        <!-- 插入到left插槽位置上 -->
        <template #left>
          <span>本月:社保在缴 公积金在缴</span>
        </template>
        <!-- 插入到right插槽位置 -->
        <template #right>
          <el-button type="primary" size="small">导入excel</el-button>
          <el-button type="primary" size="small">导出excel</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 列表 -->
      <el-card v-loading="loading" style="margin-top: 10px;">
        <el-table border :data="dataList">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="聘用形式" prop="formOfEmployment" />
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" />
          <el-table-column label="账户状态" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div style="height: 60px; margin-top: 10px">
          <el-pagination layout="prev, pager, next" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { GetEmployeeList } from '@/api/employees'
export default {
  name: 'Employees',
  data() {
    return {
      dataList: [],
      params: {
        page: 1, // 当前页
        size: 10 // 每页条数
      },
      total: 0,
      loading: false
    }
  },
  mounted() {
    this.HgetEmployeeList()
  },
  methods: {
    // 员工数据
    async HgetEmployeeList() {
      const data = GetEmployeeList(this.params)
      console.log(data)
      // this.dataList = data.rows
    }
  }
}
</script>

<style lang="less" scoped>
</style>
