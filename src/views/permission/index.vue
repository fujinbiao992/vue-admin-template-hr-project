<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click.native="addPerssion(1,'0')">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button v-if="row.key===1" type="text">添加</el-button>
              <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
              <el-button type="text" @click="delPermission(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增权限 -->
        <el-dialog :visible="showDialog" :title="formData.id?'编辑权限':'新增权限'" @close="closeDialog">
          <el-form label-width="100px">
            <el-form-item label="权限名称">
              <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="权限标识">
              <el-input v-model="formData.code" />
            </el-form-item>
            <el-form-item label="权限描述">
              <el-input v-model="formData.description" />
            </el-form-item>
            <el-form-item label="权限启用">
              <el-switch
                v-model="formData.enVisible"
                active-text="启用"
                active-value="1"
                inactive-text="不启用"
                inactive-value="0"
              />
            </el-form-item>
          </el-form>
          <template #footer>
            <div style="text-align: right;">
              <el-button @click="showDialog = false">取消</el-button>
              <el-button type="primary" @click.native="clickSubmit">确定</el-button>
            </div>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail } from '@/api/permisson'
import { transTreeData } from '@/utils/transTreeData'
import { updateDepartments } from '@/api/departments'
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
    }
  },
  mounted() {
    this.hGetPermissionList()
  },
  methods: {
    // 表格数据
    async hGetPermissionList() {
      const data = await getPermissionList()
      this.list = transTreeData(data, '0')
    },
    // 保存权限
    async clickSubmit() {
      // 区分当前点击是编辑,还是新增
      if (this.formData.id) {
        // 编辑操作
        await updateDepartments(this.formData)
      } else {
      // 新增操作
        await addPermission(this.formData)
      }
      // 关闭弹窗
      this.showDialog = false
      // 通知用户
      this.$message.success('更新成功')
      // 更新列表
      this.hGetPermissionList()
    },
    // 新增业务
    addPerssion(type, id) {
      this.showDialog = true
      // 记录当前添加的相关信息
      this.formData.type = type
      this.formData.pid = id
    },
    // 删除业务
    async delPermission(id) {
      this.$confirm('确定要删除权限吗?', '温馨提示').then(async() => {
        // 发送删除请求
        await delPermission(id)
        // 更新业务接口
        this.hGetPermissionList()
        this.$message.success('成功删除权限')
      }).catch(() => {
        console.log('取消')
      })
    },
    // 编辑业务
    async editPermission(id) {
      const res = await getPermissionDetail(id)
      this.formData = res
      this.showDialog = true
    },
    // 重置数据
    closeDialog() {
      // 关闭弹窗
      this.showDialog = false
      // 置空对象
      this.formData = {
        formData: {
          enVisible: '0', // 开启
          name: '', // 名称
          code: '', // 权限标识
          description: '', // 描述
          type: '', // 类型
          pid: '' // 添加到哪个节点下
        }
      }
    }
  }
}
</script>
