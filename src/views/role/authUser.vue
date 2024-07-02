<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="登录名" prop="item.userName">
        <el-input
          v-model="queryParams.item.userName"
          placeholder="登录名"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="item.realName">
        <el-input
          v-model="queryParams.item.realName"
          placeholder="请输入真实姓名"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="openSelectUser"
        >添加用户</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-circle-close"
          size="mini"
          @click="cancelAuthUser"
        >批量取消授权</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="登录名" prop="userName" :show-overflow-tooltip="true" />
      <el-table-column label="真实姓名" prop="realName" :show-overflow-tooltip="true" />
      <el-table-column label="部门名称" prop="deptName" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="primary">{{ formatDictName(scope.row.status) }}</el-tag>
          <el-tag v-else type="danger">{{ formatDictName(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-circle-close"
            @click="cancelAuthUser(scope.row)"
          >取消授权</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <select-user ref="select" :role-id="queryParams.item.roleId" @ok="handleQuery" />
  </div>
</template>

<script>
import { allocatedUserList } from '@/api/user'
import { authUserCancel } from '@/api/role'
import selectUser from './selectUser'

export default {
  name: 'AuthUser',
  components: { selectUser },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中用户组
      userIds: [],
      // 用户表格数据
      userList: [],
      // 总条数
      total: 0,
      // 状态数据字典
      statusOptions: [],
      // 查询条件
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: 'id',
          orderFlag: 'desc'
        },
        item: {
          userName: undefined,
          realName: undefined,
          roleId: undefined
        }
      }
    }
  },
  created() {
    const roleId = this.$route.params && this.$route.params.roleId
    if (roleId) {
      this.queryParams.item.roleId = roleId
      this.getList()
    }
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    /** 查询授权用户列表 */
    getList() {
      this.loading = true
      allocatedUserList(this.queryParams).then(response => {
        this.userList = response.data.rows
        this.total = response.data.total
        this.loading = false
      }
      )
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.userId)
    },
    // 根据字典编码获取字典名称
    formatDictName(dictCode) {
      return this.statusOptions.find(item => item.dictCode === dictCode).dictName
    },
    /** 打开授权用户表弹窗 */
    openSelectUser() {
      this.$refs.select.show()
    },
    /** 取消授权按钮操作 */
    cancelAuthUser(row) {
      const roleId = this.queryParams.item.roleId
      const userIds = []
      if (row.userId !== undefined) {
        userIds.push(row.userId !== '' ? row.userId : [])
      } else {
        if (this.userIds.join(',') !== '') {
          userIds.push(this.userIds.join(','))
        }
        if (userIds.length === 0) {
          this.msgError('请选择要分配的用户')
          return
        }
      }
      this.$confirm('确认要取消选中用户的授权数据吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return authUserCancel({ userIds: userIds, roleId: roleId })
      }).then(() => {
        this.getList()
        this.msgSuccess('取消授权成功')
      }).catch(() => {})
    }
  }
}
</script>
<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
