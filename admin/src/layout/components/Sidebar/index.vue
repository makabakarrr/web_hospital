<template>
  <el-menu
    :default-active="activeMenu"
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :unique-opened="false"
    :active-text-color="variables.menuActiveText"
    :collapse-transition="false"
    mode="horizontal"
    class="menu"
  >
    <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss">
  .menu {
    display: flex;
    width: 70%;
    float: left;
    justify-content: center;
  }
  .el-menu.el-menu--horizontal {
    border: none;
  }
  #app .hideSidebar .submenu-title-noDropdown {
    padding: 0 20px !important;
  }
  .el-menu-item, .el-submenu__title {
    height: 50px;
    line-height: 50px;
  }
  
</style>


