<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-row>
            <el-col :span="8">
              <div>
                <userAvatar :user="user" />
              </div>
            </el-col>
            <el-col :span="16">
              <el-form ref="form" :model="user" :rules="rules" label-width="80px">
                <el-form-item label="用户名称" prop="realName">
                  <el-input v-model="user.realName" maxlength="30" />
                </el-form-item>
                <el-form-item label="部门" prop="deptName">
                  <el-input v-model="user.deptName" maxlength="50" :disabled="true" />
                </el-form-item>
                <el-form-item label="角色" prop="roleName">
                  <el-input v-model="user.roleName" maxlength="50" :disabled="true" />
                </el-form-item>
                <el-form-item label="创建时间" prop="createDate">
                  <el-input v-model="user.createDate" maxlength="50" :disabled="true" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" size="mini" @click="submit">保存</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserProfile, updateUserProfile } from '@/api/user'
import userAvatar from './userAvatar'

export default {
  name: 'Profile',
  components: { userAvatar },
  data() {
    return {
      user: {},
      // 表单校验
      rules: {
        realName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data
      })
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            this.msgSuccess('修改成功')
          })
        }
      })
    },
    close() {
      this.$tab.closePage()
    }
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #6a5858 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 250px;
    line-height: 250px;
    text-align: center;
  }
  .avatar {
    width: 250px;
    height: 250px;
    display: block;
  }
</style>
