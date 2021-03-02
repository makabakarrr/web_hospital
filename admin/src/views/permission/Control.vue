<template>
  <div class="permission_con">
    <div class="title">权限设置: {{title}}</div>
    <div class="permission">
      <el-tree
        :data="treeData"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
        class="permission_tree">
      </el-tree>
    </div>
    <div class="bottom">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </div>
</template>

<script>
import {get,post} from '@/utils/request'
import qs from 'qs'
export default {
  data() {
    return {
      treeData: [
        {
          id: '1001',
          label: '挂号信息处理'
        },
        {
          id: '1002',
          label: '权限管理'
        },
        {
          id: '1003',
          label: '我的预约'
        },
        {
          id: '1004',
          label: '修改密码'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getPermissions()
  },
  computed: {
    title() {
      let obj = {
        'patient': '普通用户',
        'workers': '工作人员',
        'admin': '管理人员'
      }
      console.log(obj[this.$route.params.role])
      return obj[this.$route.params.role]
    }
  },
  methods: {
    getPermissions() {
      const role = this.$route.params.role
      get('/api/role/permissions', {role: role}).then(res=>{
        console.log(res)
        const checkedArr = res
        this.$refs.tree.setCheckedKeys(checkedArr)
      }).catch(err=>{
        console.log(err)
      })
    },
    handleCancel() {
      console.log('取消')
      this.$router.go(-1)
    },
    handleSubmit() {
      console.log('确定')
      const arr = this.$refs.tree.getCheckedKeys() || []
      let d = {
        role: this.$route.params.role,
        permission: arr.join(',')
      }
      d = qs.stringify(d)
      console.log(d, arr.join(','))
      post('/api/role/setPermission', d).then(res=>{
        console.log(res)
        if (res==='ok') {
          this.$message({
            message: '修改权限成功，请刷新浏览器试试！',
            type: 'success'
          });
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.title {
  width: 90%;
  margin: 5px auto;
  height: 60px;
  line-height: 60px;
  background: #fff;
  font-weight: bold;
  font-size: 20px;
  box-sizing: border-box;
  padding-left: 20px;
}
.bottom {
  width: 90%;
  margin: 0 auto;
}
.permission {
  width: 90%;
  margin: 20px auto;
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  .permission_tree {
    margin-bottom: 20px;
  }
}
</style>
<style lang="scss">
.el-tree-node__content {
  height: 50px;
}
</style>

