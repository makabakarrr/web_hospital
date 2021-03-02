<template>
  <div class="role_con">
    <div class="title">角色列表</div>
    <div class="roles">
      <el-table
      :data="tableData"
      border
      fit
      style="width: 100%"
      class="deal_table">
        <el-table-column
          type="index"
          label="序号"
          width="120">
        </el-table-column>
        <el-table-column
          label="角色"
          prop="role">
        </el-table-column>
        <el-table-column
          label="编号"
          prop="code">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
          <el-button
            @click="handleClick(scope.row)"
            type="text">
            设置权限
          </el-button>
        </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: '001',
          code: 'patient',
          role: '普通用户'
        },
        {
          id: '002',
          code: 'workers',
          role: '医护人员'
        },
        {
          id: '003',
          code: 'admin',
          role: '管理人员'
        }
      ]
    }
  },
  methods: {
    handleClick(data) {
      console.log(data)
      this.$router.push({name: 'Permission_control', params: {role: data.code}})
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
.roles {
  width: 90%;
  margin: 20px auto;
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  .role_table {
    margin-bottom: 20px;
  }
}
</style>
