<template>
  <!-- 放置弹层组件 -->
  <el-dialog title="新增部门" :visible="showDialog" @close="closeDialog">
    <el-form ref="form" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择">
          <!-- 循环遍历部门数据 -->
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" size="small" @click="addSubmit">确定</el-button>
      <el-button size="small" @click="closeDialog">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, updateDepartments, getDepartDetail } from '@/api/departments'
export default {

  // 需要传入一个props来控制显示隐藏
  props: {
    showDialog: {
      type: Boolean
    },
    currNode: {
      type: Object,
      default() {
        return {}
      }
    },
    sourceList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    // 重复校验Code码
    const validateCode = (rule, value, callback) => {
      let list = []
      if (this.formData.id) {
        // 编辑状态
        list = this.sourceList.filter(item => item !== this.cacheCode)
      } else {
        // 新增状态
        list = this.sourceList
      }
      if (list.includes(this.formData.code)) {
        // 出现重复
        callback(new Error('当前输入的code码已经存在'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validateCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      peoples: [], // 部门数据
      cacheCode: null

    }
  },
  mounted() {
    this.getEmployees()
  },
  methods: {
    // 编辑数据
    async hGetDepartments(id) {
      const res = await getDepartDetail(id)
      this.cacheCode = res.code
      this.formData = res
    },
    // 员工数据
    async getEmployees() {
      const res = await getEmployeeSimple()
      this.peoples = res
    },
    // 关闭弹窗
    closeDialog() {
      this.$emit('close-dialog')
      // 清除校验规则
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      // 关闭弹窗
      this.$refs.form.resetFields()
    },
    // 确定提交
    addSubmit() {
      // 兜底校验
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 先区分是编辑操作,还是更新操作,然后调用对应的接口
          if (this.formData.id) {
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, ...{ pid: this.currNode.id }})
          }
          // 更新列表
          this.$emit('update-list')
          // 关闭弹窗
          this.$emit('close-dialog')
          // 提示用户
          this.$message.success('子部门更新成功')
        }
      })
    }

  }
}
</script>

