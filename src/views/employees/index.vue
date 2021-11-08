<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- 全局注册的组件 -->
      <page-tools>
        <template #left>
          <span>总记录数: 16 条</span>
        </template>
        <template #right>
          <el-button type="warning" size="small" to="/import">excel导入</el-button>
          <el-button type="danger" size="small" @click="exportExcel">excel导出</el-button>
          <el-button type="primary" size="small" @click="showDialog=true">新增员工</el-button>
        </template>
      </page-tools>
      <el-card style="margin-top: 10px;">
        <el-table border :data="tabeList" :default-sort="{prop:'workNumber'}">
          <el-table-column label="序号" type="index" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="用户头像">
            <template slot-scope="scope" class="staff">
              <!-- 展示用户头像 -->
              <!-- {{ scope.row.staffPhoto }} -->
              <ImgPlaceHoder :src="scope.row.staffPhoto" @click.native="clickShowCode(scope.row.staffPhoto)" />
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" />
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
              <el-button type="text" size="small" @click="goDetail(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="addRole(scope.row.id)">分配角色</el-button>
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
    <!-- 新增员工组件 -->
    <add-employee :show-dialog="showDialog" @close-dialog="closeDialog" />
    <!-- 二维码组件 -->
    <el-dialog
      :visible="showCodeDialog"
      title="二维码"
      @close="showCodeDialog=false"
    >
      <el-row type="flex" justify="conter">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配权限组件 -->
    <assing-role
      :show-role-dialog.sync="showRoleDialog"
      :cur-user-id="curId"
      @close-dialog="closeRoleDialog"
    />
  </div>
</template>
<script>
import { reqGetEmployeeList, delEmployee } from '@/api/employees'
import Types from '@/api/constant/employees'
import { transSourceDataToArray } from '@/utils/excelData'
import AddEmployee from './components/add-employee'
import AssingRole from './components/assing-role'
import dayjs from 'dayjs'
import Qrcode from 'qrcode'
export default {
  components: {
    AddEmployee,
    AssingRole
  },
  data() {
    return {
      tabeList: [],
      params: {
        page: 1,
        size: 10
      },
      total: 0,
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      curId: null
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
    closeRoleDialog() {
      // 进行父子组件传值的自定义事件函数
      this.showRoleDialog = false
    },
    // 导出excel
    exportExcel() {
      // 使用按需导出的方式
      import('@/vendor/Export2Excel').then(async excel => {
        // 1- 按照当前页的参数,请求当前页的数据
        // 2- 对后端返回的数据,进行分页处理,分别添加到表头和表格数据的配置项位置
        const header = {
          '手机号': 'mobile',
          '姓名': 'username',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        const res = await reqGetEmployeeList(this.params)
        const tableData = transSourceDataToArray(res.rows, header)
        excel.export_json_to_excel({
          header: Object.keys(header),
          data: tableData,
          filename: '员工列表',
          autoWidth: true,
          bookType: 'xlsx'
        })
      })
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
    },
    // 详情展示
    goDetail(row) {
      this.$router.push({
        path: '/employees/detail',
        query: {
          id: row.id
        }
      })
    },
    // 二维码配置
    clickShowCode(url) {
      if (url === null) {
        return false
      } else {
        // 展开对话框
        this.showCodeDialog = true
        this.$nextTick(() => {
          Qrcode.toCanvas(this.$refs.myCanvas, url)
        })
      }
    },
    // 分配角色
    addRole(id) {
      this.showRoleDialog = true
      this.curId = id
    }
  }
}
</script>
<style scoped lang='scss'>
.employees-container {
  .staff {
    width: 70px;
    height: 70px;
    margin: 0 auto;
    border-radius: 50%;
  }
}
</style>
