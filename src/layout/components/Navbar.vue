<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb v-if="!topNav" id="breadcrumb-container" class="breadcrumb-container" />
    <top-nav v-if="topNav" id="topmenu-container" class="topmenu-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="updPwd">
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog v-dialogDrag :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form.params" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="旧密码" prop="oldPwd">
              <el-input v-model="form.params.oldPwd" placeholder="请输入旧密码" maxlength="30" :type="oldPwdType">
                <i slot="suffix" :class="oldPwdIcon" @click="oldPwsShow" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="新密码" prop="newPwd">
              <el-input v-model="form.params.newPwd" placeholder="请输入新密码" maxlength="30" :type="newPwdType">
                <i slot="suffix" :class="newPwdIcon" @click="newPwsShow" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-input v-model="form.params.confirmPwd" placeholder="请确认密码" maxlength="500" :type="confirmPwdType">
                <i slot="suffix" :class="confirmPwdIcon" @click="confirmPwsShow" />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import { updatePwd } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger
  },
  data() {
    return {
      title: '',
      open: false,
      oldPwdType: 'password',
      oldPwdIcon: 'el-input__icon el-icon-view',
      newPwdType: 'password',
      newPwdIcon: 'el-input__icon el-icon-view',
      confirmPwdType: 'password',
      confirmPwdIcon: 'el-input__icon el-icon-view',
      // 表单参数
      form: {
        params: {
          oldPwd: undefined,
          newPwd: undefined,
          confirmPwd: undefined
        }
      },
      // 表单校验
      rules: {
        oldPwd: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '旧密码长度必须介于 6 和 20 之间', trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '新密码长度必须介于 6 和 20 之间', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '确认密码长度必须介于 6 和 20 之间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    // 密码的隐藏和显示
    oldPwsShow() {
      // 点击图标是密码隐藏或显示
      if (this.oldPwdType === 'text') {
        this.oldPwdType = 'password'
        // 更换图标
        this.oldPwdIcon = 'el-input__icon el-icon-view'
      } else {
        this.oldPwdType = 'text'
        this.oldPwdIcon = 'el-input__icon el-icon-magic-stick'
      }
    },
    newPwsShow() {
      // 点击图标是密码隐藏或显示
      if (this.newPwdType === 'text') {
        this.newPwdType = 'password'
        // 更换图标
        this.newPwdIcon = 'el-input__icon el-icon-view'
      } else {
        this.newPwdType = 'text'
        this.newPwdIcon = 'el-input__icon el-icon-magic-stick'
      }
    },
    confirmPwsShow() {
      // 点击图标是密码隐藏或显示
      if (this.confirmPwdType === 'text') {
        this.confirmPwdType = 'password'
        // 更换图标
        this.confirmPwdIcon = 'el-input__icon el-icon-view'
      } else {
        this.confirmPwdType = 'text'
        this.confirmPwdIcon = 'el-input__icon el-icon-magic-stick'
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('logout').then(() => {
          location.href = '/'
        })
      }).catch(() => {})
    },
    updPwd() {
      this.open = true
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          updatePwd(this.form).then(response => {
            this.msgSuccess('修改成功')
            this.open = false
          })
        }
      })
    },
    // 表单重置
    reset() {
      this.form.params = {
        oldPwd: undefined,
        newPwd: undefined,
        confirmPwd: undefined
      }
      this.resetForm('form')
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
