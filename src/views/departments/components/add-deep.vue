<template>
  <!-- 放置弹出层组件 -->
  <el-dialog
    title="新增部门"
    :visible="showDialog"
    @close="dialogClose"
  >
    <el-form ref="deptForm" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
          <!-- 循环遍历option中的数据 -->
          <el-option v-for="item in peoples" :key="item.id" :value="item.username" :label="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- footer插槽位置 -->
    <template #footer>
      <el-button type="primary" size="small" @click="clickSubmit">确定</el-button>
      <el-button size="small" @click="dialogClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    curNode: {
      type: Object,
      default() {
        return {}
      }
    },
    codeData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    // 设置Code码校验函数
    const validDataCode = (rule, value, callback) => {
      // 完成判断重复Code码
      // 问题: 在新增时,输入框的回显Code已经存在codeData中了
      // 解决: 如果是编辑业务,从codeData中,删除掉自己就可以了
      // 问题: 由于输入框存在双向绑定,所以一旦修改以后,就不知道要删除哪个了
      // 问题: 把每次初显出来的code码,进行保存,作为将来要删除的Code码
      let codeList = []
      if (this.form.id) {
        // 编辑
        codeList = this.codeData.filter(item => item !== this.editCode)
        console.log(codeList)
      } else {
        // 新增
        codeList = this.codeData
      }
      if (codeList.includes(this.form.code)) {
        // 找的到,提示Error信息
        callback(new Error('您输入的code码已经存在,请您再次输入'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: ['blur', 'change'] }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: ['blur', 'change'] },
          { validator: validDataCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: ['blur', 'change'] }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: ['blur', 'change'] }
        ]
      },
      peoples: [],
      editCode: null
    }
  },
  mounted() {
    this.hGetEmployeeSimple()
  },
  methods: {
    // 1- 弹窗组件方法
    dialogClose() {
      this.$emit('close-dialog')
      // 清除form表单中默认数据
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 清除校验规则
      this.$refs.deptForm.resetFields()
    },
    // 2- 部门能负责人动态数据方法
    async hGetEmployeeSimple() {
      const data = await getEmployeeSimple()
      this.peoples = data
    },
    // 3- 新增兜底校验规则
    clickSubmit() {
      this.$refs.deptForm.validate(async vaild => {
        // 1- 调用编辑更新接口,需要先进行判断
        if (this.form.id) {
          // 调用更新接口
          await updateDepartments(this.form)
        } else {
          // 调用新增接口
          await addDepartments({ ...this.form, ...{ pid: this.curNode.id }})
        }
        if (vaild) {
          // 3-2: 更新列表
          this.$emit('update-depart')
          // 3-3: 提示用户
          this.$message.success('添加部门成功')
          // 3-4: 关闭弹框
          this.$emit('close-dialog')
        }
      })
    },
    // 5- 获取部门详情数据
    async hGetDepartDetails(id) {
      const res = await getDepartDetail(id)
      // 单独缓存Code码
      this.editCode = res.code
      this.form = res
    }
  }
}
</script>

<style scoped lang='less'>

</style>
