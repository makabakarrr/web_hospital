<template>
  <div class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <!-- <sidebar class="sidebar-container" /> -->
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div>
      <app-main />
      <div class="footer">
        <div class="footer_content">
          <ul class="title">
            <li>关于我们</li>
            <li>联系我们</li>
            <li>责任声明</li>
          </ul>
          <div class="bottom">
            <div class="footer_left">
              <h5>新余xx医院</h5>
              <p class="contact">24小时咨询热线：</p>
              <p class="phone">0790-666612138</p>
              <p class="address">地址：江西省新余市渝水区阳光大道2666号</p>
            </div>
            <div class="footer_center">
              <h5>就医指南</h5>
              <ul>
                <li>就医指南</li>
                <li>投诉建议</li>
                <li>健康问答</li>
              </ul>
            </div>
            <div class="footer_right">
              <div class="left">
                <img src="@/assets/home/eq.jpg" alt="">
                <p>手机版网站</p>
              </div>
              <div class="right">
                <img src="@/assets/home/gzh.jpg" alt="">
                <p>微信公众号</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
// import Sidebar from 
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .footer {
    width: 100%;
    height: 260px;
    background: rgb(48, 65, 86);
    color: rgb(191, 203, 217);
  }
  .footer_content {
    width: 90%;
    margin: 0 auto;
    vertical-align: middle;
    ul.title {
      padding: 0;
      margin: 0;
      overflow: hidden;
      li {
        list-style: none;
        float: left;
        line-height: 48px;
        width: 30%;
        text-align: center;
      }
    }
    .footer_left {
      width: 35%;
      height: 150px;
      border-right: 1px dashed #ccc;
      h5 {
        font-size: 18px;
        letter-spacing: 2px;
        margin: 5px 0;
      }
    }
    .bottom {
      padding-top: 20px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
    .footer_center {
      width: 150px;
      height: 150px;
      border-right: 1px dashed #ccc;
      h5 {
        font-size: 18px;
        letter-spacing: 2px;
        margin: 5px 0;
      }
      ul {
        padding: 0;
        li {
          list-style: none;
          height: 30px;
          line-height: 30px;
          font-size: 16px;
        }
      }
    }
    .footer_right {
      width: 30%;
      height: 150px;
      display: flex;
      align-items: center;
      .left, .right {
        width: 38%;
      }
      img {
        width: 120px;
        height: 120px;
        display: block;
        margin: 0 auto;
      }
      p {
        margin: 0;
        padding: 0;
        line-height: 30px;
        text-align: center;
      }
    }
  }
</style>
<style>
.el-menu-item, .el-submenu__title {
  height: 60px;
  line-height: 60px;
}
.el-menu-item {
  font-size: 18px;
}
</style>

