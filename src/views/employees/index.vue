<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 全局注册的组件 -->
      <page-tools>
        <template #left>
          <span>总记录数: 16 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small">excel导入</el-button>
          <el-button type="danger" size="small">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <el-card style="margin-top: 10px;">
        <el-table border :data="tabeList" :default-sort="{prop:'workNumber'}">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="工号" prop="workName" />
          <el-table-column label="聘用形式">
            <template slot-scope="scope">
              <!--
                1- 聘用形式,也是需要用到插槽的机制,读取转换聘用形式格式
               -->
              {{ _formatFormOfEmployment(scope.row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <!-- 保证字段上声明了prop属性,和sortable属性 -->
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template slot-scope="scope">
              <!--
                1- 使用插槽机制,拿到当前的数据源
                2- 对数据源,进行数据格式的转换
               -->
              {{ _formatDate(scope.row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="scope">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button type="text" size="small" @click="delUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <div style="height: 60px; margin-top: 10px">
          <!--
            默认情况下每页10条
            如果接口获取到的数据不是每页10条
            需要我们通过参数传入配置分页器每页显示多少条
          -->
          <el-pagination
            layout="prev, pager, next"
            :total="total"
            :page-size="params.size"
            @current-change="pageChange"
          />
        </div>
      </el-card>
    </div>
    <!-- 使用子组件 -->
    <add-employee :show-dialog="showDialog" @close-dialog="closeDialog" />
  </div>
</template>
<script>
import { reqGetEmployeeList, delEmployee } from '@/api/employees'
import Types from '@/api/constant/employees'
import dayjs from 'dayjs'
import AddEmployee from './components/add-employee'
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      tabeList: [],
      params: {
        page: 1,
        size: 10
      },
      total: 0,
      showDialog: false
    }
  },
  mounted() {
    this.HgetEmployeeList()
  },
  methods: {
    // 表格数据
    async HgetEmployeeList() {
      const res = await reqGetEmployeeList(this.params)
      this.tabeList = res.rows
      this.total = res.total
    },
    pageChange(newPage) {
      this.params.page = newPage
      this.HgetEmployeeList()
    },
    closeDialog() {
      this.showDialog = false
    },
    // 聘用格式化
    _formatFormOfEmployment(val) {
      // 拿到原始数据
      const hireType = Types.hireType
      const map = {}
      hireType.forEach(item => {
        map[item.id] = item.value
      })
      return map[val]
    },
    // 时间格式化
    _formatDate(val) {
      return dayjs(val).format('YYYY-MM-DD')
    },
    // 删除员工
    async delUser(id) {
      this.$confirm('确定要删除吗?', '温馨提示').then(async() => {
        await delEmployee(id)
        this.HgetEmployeeList()
        this.$message.success('删除成功')
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>
