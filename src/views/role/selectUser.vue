<template>
  <!-- 授权用户 -->
  <el-dialog title="选择用户" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true">
      <el-form-item label="登录名" prop="item.userName">
        <el-input
          v-model="queryParams.item.userName"
          placeholder="请输入登录名"
          clearable
        />
      </el-form-item>
      <el-form-item label="真实姓名" prop="item.realName">
        <el-input
          v-model="queryParams.item.realName"
          placeholder="请输入真实姓名"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table ref="table" :data="userList" height="260px" @row-click="clickRow" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="登录名" prop="userName" :show-overflow-tooltip="true" />
        <el-table-column label="真实姓名" prop="realName" :show-overflow-tooltip="true" />
        <el-table-column label="部门名称" prop="deptName" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="primary">{{ formatDictName(scope.row.status) }}</el-tag>
            <el-tag v-else type="danger">{{ formatDictName(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.page.pageNum"
        :limit.sync="queryParams.page.pageSize"
        @pagination="getList"
      />
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { unallocatedUserList } from '@/api/user'
import { authUserSelect } from '@/api/role'
export default {
  props: {
    // 角色编号
    // eslint-disable-next-line vue/require-default-prop
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 状态数据字典
      statusOptions: [],
      // 查询参数
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
    this.getDicts('user_status').then(response => {
      this.statusOptions = response.data
    })
  },
  methods: {
    // 显示弹框
    show() {
      this.queryParams.item.roleId = this.roleId
      this.getList()
      this.visible = true
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.userId)
    },
    // 查询表数据
    getList() {
      unallocatedUserList(this.queryParams).then(res => {
        this.userList = res.data.rows
        this.total = res.data.total
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      const userIds = []
      if (this.userIds.join(',') !== '') {
        userIds.push(this.userIds.join(','))
      }
      const roleId = this.queryParams.item.roleId
      if (userIds.length === 0) {
        this.msgError('请选择要分配的用户')
        return
      }
      authUserSelect({ roleId: roleId, userIds: userIds }).then(res => {
        this.msgSuccess('授权成功')
        this.visible = false
      })
    },
    // 根据字典编码获取字典名称
    formatDictName(dictCode) {
      return this.statusOptions.find(item => item.dictCode === dictCode).dictName
    }
  }
}
</script>
