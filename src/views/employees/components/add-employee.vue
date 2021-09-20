<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="closeDialog" @open="openDialog">
    <!-- 表单 -->
    <el-form ref="addForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option
            v-for="item in employeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" />
        <!-- tree树形数据 -->
        <div class="tree-box">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            @node-click="nodeClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @close="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitAdd">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import employeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
import { getDepartments } from '@/api/departments'
import { transTreeData } from '@/utils/transTreeData'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      employeeEnum,
      treeData: [],
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      defaultProps: {
        label: 'name'
      }
    }
  },
  mounted() {
    this.HgetDepartments()
  },
  methods: {
    // 点击选中数据
    nodeClick(data) {
      // data代表当前点击的对应对象
      // 把点击的name属性,回显到用来负责部门的字段上
      // 如果当前节点下还存在子节点,点击只是展开就可以
      // 如果当前节点下没有子节点了,在去选中
      if (data.children.length > 0) {
        return
      } else {
        this.formData.departmentName = data.name
      }
    },
    // 获取组织架构数据
    async HgetDepartments() {
      const res = await getDepartments()
      this.treeData = transTreeData(res.depts)
    },
    // 关闭弹窗方法
    closeDialog() {
      this.$emit('close-dialog')
      // 清空数据
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      // 移除校验规则
      this.$refs.addForm.resetFields()
    },
    // 打开弹窗,获取数据
    openDialog() {
      this.HgetDepartments()
    },
    // 保存数据
    submitAdd() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          // 1- 发送数据
          await addEmployee(this.formData)
          // 2- 关闭弹窗
          this.$emit('close-dialog')
          // 3- 用户提示
          this.$message.success('新增员工成功')
          // this.$parent.reqGetEmployeeList()
        }
      })
    }
  }
}
</script>
