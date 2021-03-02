<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">欢迎登录</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
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
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="role" v-if="isRigster">
        <span class="svg-container">
          <svg-icon icon-class="example" />
        </span>
        <el-select v-model="loginForm.role" placeholder="请选择用户类型">
          <el-option label="普通用户" value="patient" key="patient"></el-option>
          <el-option label="医护人员" value="workers" key="workers"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="subject" v-if="loginForm.role==='workers'">
        <span class="svg-container">
          <svg-icon icon-class="tree" />
        </span>
        <el-select v-model="loginForm.subject" placeholder="请选择所属科室">
          <el-option
            v-for="item in subjectObj"
            :label="item.label" :value="item.value" 
            :key="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="workId" v-if="loginForm.role==='workers'">
        <span class="svg-container">
          <svg-icon icon-class="nested" />
        </span>
        <el-input
          v-model="loginForm.workId"
          placeholder="请输入工号"
          name="workId"
          type="text"
          tabindex="3"
          auto-complete="on"
        />
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">{{showBtn}}</el-button>
      <p class="tips" v-if="!isRigster">没有账号？点此处<span class="clicker" style="color:#409EFF; margin-left:5px;text-decoration:underline;cursor:pointer;" @click="handleRigster">开始注册</span></p>
      <p class="tips" v-else>已有账号？点此处<span class="clicker" style="color:#409EFF; margin-left:5px;text-decoration:underline;cursor:pointer;" @click="handleToLogin">去登录</span></p>

    </el-form>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import qs from 'qs'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!(value.length >= 2 && value.length <= 6)) {
        callback(new Error('请输入2-6个字符'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(value)) {
        callback(new Error('请输入6-12个数字或字母'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        role: '',
        workId: '',
        subject: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        role: [{ required: true, trigger: 'blur', message: '请选择用户类型！' }],
        workId: [{required: false, trigger: 'blur', message: '请输入您的工号！' }],
        subject: [{required: false, trigger: 'blur', message: '请选择您的科室！' }]
      },
      isRigster: false,
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      subjectObj: [
        {
          label: '儿科',
          value: '001'
        },
        {
          label: '妇产科',
          value: '002',
        },
        {
          label: '骨科',
          value: '003',
        },
        {
          label: '心血管内科',
          value: '004',
        },
        {
          label: '神经内科',
          value: '005',
        },
        {
          label: '五官科',
          value: '006',
        },
        {
          label: '外科',
          value: '007',
        }
      ]
    }
  },
  computed: {
    showBtn() {
      if (this.isRigster) {
        return '注册'
      } else {
        return '登录'
      }
    }
  },
  watch: {
    'loginForm.role': function(val){
      if (val === 'workers') {
        this.loginRules.workId[0].required = true
        this.loginRules.subject[0].required = true
      } else {
        this.loginRules.workId[0].required = false
        this.loginRules.subject[0].required = false
      }
    },
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
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
          console.log(valid)
          const formData = qs.stringify(this.loginForm)
          console.log(formData)
          this.loading = true
          if (this.isRigster) {
            this.$store.dispatch('user/register', formData).then((res) => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            this.$store.dispatch('user/login', formData).then((res) => {
              this.loading = false
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRigster() {
      console.log('注册')
      this.isRigster = true
    },
    handleToLogin() {
      this.isRigster = false
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

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
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .el-select {
    width: 90%;
    .el-input {
      width: 95%;
    }
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
    margin: 0 auto;
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
      font-size: 26px;
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
