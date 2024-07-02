<template>
  <div class="login-container">
    <div
      id="stars"
      style="width: 100%;
          height: 100vh;
          margin: auto;
          overflow: hidden;"
    >
      <div class="star" style="top: 0px;left: 200px;" />
      <div class="star" style="top: 0px;left: 300px;" />
      <div class="star" style="top: 0px;left: 400px;" />
      <div class="star" style="top: 0px;left: 500px;" />
      <div class="star" style="top: 0px;left: 600px;" />
      <div class="star" style="top: 0px;left: 700px;" />

      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left" autocomplete="off">
        <div class="title-container">
          <h3 class="title">基础支撑系统</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="Username"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>

      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.loginForm).then(() => {
            this.$router.push('/')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    init() {
      var stars = document.getElementById('stars')
      // js随机生成流星
      for (var j = 0; j < 30; j++) {
        var newStar = document.createElement('div')
        newStar.className = 'star'
        newStar.style.top = this.randomDistance(500, -100) + 'px'
        newStar.style.left = this.randomDistance(1300, 300) + 'px'
        stars.appendChild(newStar)
      }
      var star = document.getElementsByClassName('star')

      // 给流星添加动画延时
      for (var i = 0, len = star.length; i < len; i++) {
        star[i].style.animationDelay = i % 6 === 0 ? '0s' : i * 0.8 + 's'
      }
    },
    randomDistance(max, min) {
      var distance = Math.floor(Math.random() * (max - min + 1) + min)
      return distance
    }
  }
}
</script>

<style lang="scss">
#stars {
  margin: 0 auto;
  max-width: 1600px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
}
.star {
  display: block;
  width: 1px;
  background: transparent;
  position: relative;
  opacity: 0;
  /*过渡动画*/
  animation: star-fall 2s linear infinite;
  -webkit-animation: star-fall 2s linear infinite;
  -moz-animation: star-fall 2s linear infinite;
}

.star:after {
  content: '';
  display: block;
  border: 0px solid #fff;
  border-width: 0px 90px 2px 90px;
  border-color: transparent transparent transparent rgba(255, 255, 255, .5);
  box-shadow: 0 0 1px 0 rgba(255, 255, 255, .1);
  /*变形*/
  transform: rotate(-45deg) translate3d(1px, 3px, 0);
  -webkit-transform: rotate(-45deg) translate3d(1px, 3px, 0);
  -moz-transform: rotate(-45deg) translate3d(1px, 3px, 0);
  transform-origin: 0% 100%;
  -webkit-transform-origin: 0% 100%;
  -moz-transform-origin: 0% 100%;
}

@keyframes star-fall {
  0% {
    opacity: 0;
    transform: scale(0.5) translate3d(0, 0, 0);
    -webkit-transform: scale(0.5) translate3d(0, 0, 0);
    -moz-transform: scale(0.5) translate3d(0, 0, 0);
  }
  50% {
    opacity: 1;
    transform: translate3d(-200px, 200px, 0);
    -webkit-transform: translate3d(-200px, 200px, 0);
    -moz-transform: translate3d(-200px, 200px, 0);
  }
  100% {
    opacity: 0;
    transform: scale(1.2) translate3d(-300px, 300px, 0);
    -webkit-transform: scale(1.2) translate3d(-300px, 300px, 0);
    -moz-transform: scale(1.2) translate3d(-300px, 300px, 0);
  }
}

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('../../assets/images/login.jpg');
  background-size: 100% 100%;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        -webkit-transition-delay: 99999s;
        -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
        // box-shadow: 0 0 0px 1000px white inset !important;
        // -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 30px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
