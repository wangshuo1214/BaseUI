<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="字典类型" prop="item.dictType">
        <el-select v-model="queryParams.item.dictTypeId" size="small">
          <el-option
            v-for="item in typeOptions"
            :key="item.id"
            :label="item.dictName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典名称" prop="item.dictName">
        <el-input
          v-model="queryParams.item.dictName"
          placeholder="请输入字典名称"
          clearable
          size="small"
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
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典排序" align="center" prop="orderNum" />
      <el-table-column label="字典名称" align="center" prop="dictName" />
      <el-table-column label="字典编码" align="center" prop="dictCode" />
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
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
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-show="false" label="字典类型ID">
          <el-input v-model="form.dictTypeId" :disabled="true" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" :disabled="true" />
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典编码" prop="dictCode">
          <el-input v-model="form.dictCode" placeholder="请输入字典编码" />
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listType, queryData, getType, updateData, addData, getData, delData } from '@/api/dict'

export default {
  name: 'Data',
  data() {
    return {
      // 选中数组
      ids: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 非多个禁用
      multiple: true,
      // 类型数据字典
      typeOptions: [],
      // 字典表格数据
      dataList: [],
      // 默认字典类型
      defaultDictTypeId: '',
      // 查询参数
      queryParams: {
        page: {
          pageNum: 1,
          pageSize: 10,
          orderByColumn: 'orderNum',
          orderFlag: 'asc'
        },
        item: {
          dictTypeId: undefined,
          dictCode: undefined,
          dictName: undefined
        }
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictType: [
          { required: true, message: '字典类型不能为空', trigger: 'blur' }
        ],
        dictName: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        dictCode: [
          { required: true, message: '字典编码不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '字典顺序不能为空', trigger: 'blur' }
        ]
      },
      // 总条数
      total: 0
    }
  },
  created() {
    const dictTypeId = this.$route.params && this.$route.params.dictTypeId
    this.getType(dictTypeId)
    this.getTypeList()
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page.pageNum = 1
      this.getList()
    },
    /** 查询字典类型详细 */
    getType(dictTypeId) {
      getType(dictTypeId).then(response => {
        this.queryParams.item.dictTypeId = response.data.id
        this.defaultDictTypeId = response.data.id
        this.getList()
      })
    },
    /** 查询字典类型列表 */
    getTypeList() {
      listType().then(response => {
        this.typeOptions = response.data
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.multiple = !selection.length
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.item.dictTypeId = this.defaultDictTypeId
      this.handleQuery()
    },
    /** 查询字典数据列表 */
    getList() {
      this.loading = true
      queryData(this.queryParams).then(response => {
        this.dataList = response.data.rows
        this.total = response.data.total
        this.loading = false
      })
    },
    // 表单重置
    reset() {
      this.form = {
        dictTypeId: undefined,
        dictType: undefined,
        dictName: undefined,
        dictCode: undefined,
        orderNum: 0,
        remark: undefined
      }
      this.resetForm('form')
    },
    // 通过字典类型ID获取字典类型名称
    getTypeNameByTypeId(dictTypeId) {
      if (this.typeOptions) {
        for (const dictType of this.typeOptions) {
          if (dictType.id === dictTypeId) { return dictType.dictName }
        }
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加字典数据'
      this.form.dictTypeId = this.queryParams.item.dictTypeId
      this.form.dictType = this.getTypeNameByTypeId(this.queryParams.item.dictTypeId)
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const dictId = row.id
      getData(dictId).then(response => {
        this.form = response.data
        this.form.dictTypeId = response.data.id
        this.form.dictType = this.getTypeNameByTypeId(this.queryParams.item.dictTypeId)
        this.open = true
        this.title = '修改字典类型'
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.id !== undefined ? [row.id] : this.ids
      this.$confirm('是否确认删除选中的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delData(dictIds)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateData(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addData(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    }
  }
}
</script>
