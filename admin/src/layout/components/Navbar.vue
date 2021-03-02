<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <sidebar />
    

    <div class="right-menu">

      <router-link to="/login" v-if="!token" class="tip_con">
        请先<span class="login_tip">登录</span>
      </router-link>
      <el-dropdown class="avatar-container" trigger="click" v-else>
        <div class="avatar-wrapper">
          <div class="name">{{name}}</div>
          <div class="img">
            <img :src="userAvater" class="user-avatar">
          <i class="el-icon-caret-bottom" />
          </div>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item v-if="showCpsd" @click.native="showDialog">
            修改密码
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="form" ref="form" :rules="formRule">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="form.oldPassword" autocomplete="off" placeholder="请输入旧密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="form.newPassword" autocomplete="off" placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sidebar from './Sidebar'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import qs from 'qs'
import {post} from '@/utils/request'

export default {
  components: {
    Sidebar,
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(value)) {
        callback(new Error('密码格式为6-12个数字或字母'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      username: '',
      form: {
        oldPassword: '',
        newPassword: ''
      },
      formRule: {
        oldPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
      }
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'sidebar',
      'avatar',
      'name',
      'idList'
    ]),
    showCpsd() {
      return this.$store.getters.idList.indexOf('1004') !== -1
    },
    userAvater() {
      return this.avater || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1585131946404&di=715ec9b1937dde9ca8415ede83c51dad&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01786557e4a6fa0000018c1bf080ca.png'
    }
  },
  methods: {
    logout() {
      console.log('退出')
      this.$store.dispatch('user/logout').then(res => {
        this.$store.dispatch('permission/resetPermission')
        this.$router.push({name: 'Dashboard'})
      })
    },
    showDialog() {
      this.dialogFormVisible = true
    },
    handleSubmit() {
      this.dialogFormVisible = false
      this.$refs.form.validate(valid => {
        if (valid) {
          const formData = qs.stringify(this.form)
          post('/api/user/change', formData).then(res=>{
            console.log(res)
            if (res==='ok') {
              this.$alert('请重新登录', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.logout()
                }
              });
            }
          }).catch(err=>{
            console.log(err)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;

  .menu {
    flex: 1;
  }

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

  .right-menu {
    width: 150px;
    height: 100%;
    line-height: 70px;
    background-color: rgb(48, 65, 86);

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
      .name {
        margin-right: 8px;
        color: #f5f5f5;
      }
      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 20px;
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
.el-dropdown-menu {
  padding: 5px 0;
  top: 48px !important;
  li {
    line-height: 24px;
    &:first-child {
      border-top: 0px;
      margin-top: 0px;
    }
  }
}
.tip_con {
  color: rgb(191, 203, 217);
  font-size: 14px;
  line-height: 50px;
  .login_tip {
  text-decoration: underline;
  &:hover {
    color: rgb(64, 158, 255)
  }
}
}

</style>
