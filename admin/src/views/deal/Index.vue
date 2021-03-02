<template>
  <div class="mine deal">
    <el-table
    :data="tableData"
    border
    fit
    style="width: 100%"
    class="deal_table">
      <el-table-column
        prop="date"
        label="日期"
        width="140">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="card"
        label="身份证件号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话号码"
        width="120">
      </el-table-column>
      <el-table-column
        label="预约科室">
        <template slot-scope="scope">
          {{ getSubject(scope.row.subject) }}
        </template>
      </el-table-column>
      <el-table-column
        label="预约医生">
        <template slot-scope="scope">
          {{ getDoctor(scope.row.subject, scope.row.doctor) }}
        </template>
      </el-table-column>
      <el-table-column
        label="预约时间"
        width="140">
        <template slot-scope="scope">
          {{scope.row.subDate}} {{scope.row.time}}
        </template>
      </el-table-column>
      <el-table-column
        prop="note"
        label="备注"
        width="140">
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-tag
          v-if="scope.row.status === -1"
          type="danger"
          disable-transitions>已过期</el-tag>
          <el-tag
          v-else-if="scope.row.status === 1"
          type= 'success'
          disable-transitions>已处理</el-tag>
          <el-tag
          v-else-if="scope.row.status === 2"
          type="info"
          disable-transitions>已撤销</el-tag>
          <el-button
            v-else
            size="small"
            type="primary"
            @click="handleChange(scope.row)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="count"
      :current-page="pageParam.page"
      @current-change="getMore">
    </el-pagination>
  </div>
</template>

<script>
import qs from 'qs'
import {get, post} from '@/utils/request'

export default {
  data() {
    return {
      tableData: [],
      count: 0,
      subjectObj: {
        '001': '儿科',
        '002': '妇产科',
        '003': '骨科',
        '004': '心血管内科',
        '005': '神经内科',
        '006': '五官科',
        '007': '外科'
      },
      docData: [],
      pageParam: {
        page: 1,
        count: 10
      },
      role: ''
    }
  },
  created() {
    this.role = this.$store.getters.roles
    if (this.role==='admin') {
      this.getDoctorList()
    }
    this.getList()
  },
  methods: {
    getList() {
      this.tableData = []
      get('/api/order/list', this.pageParam).then(res=>{
        console.log(res)
        let date = new Date()
        let dateD = date.getFullYear()+'-'+ ((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))+'-' + (date.getDate()<10?('0'+date.getDate()):date.getDate())
        let dateH = date.getHours()
        let str = dateH > 12 ? '上午' : '下午'
        console.log(dateD)
        this.count = res.count
        this.tableData = res.list.map(order=>{
          console.log('日期',order.subDate<dateD)
          if (order.subDate<dateD) {
            order.status = -1
          } else if (order.subDate===dateD) {
            console.log('时间', order.time !== str)
            if (order.time !== str) {
              order.status = -1
            }
          }
          return order
        })
      }).catch(err=>{
        console.log(res)
      })
    },
    getMore(val) {
      console.log(val)
      this.pageParam.page = val
      this.getList()
    },
    getSubject(val) {
      return this.subjectObj[val]
    },
    getDoctorList() {
      get('/api/user/search', {role: 'workers'}).then(res=>{
        this.docData = res
      }).catch(err=>{
        console.log(err)
      })
    },
    getDoctor(sub, id) {
      if (this.docData.length) {
        const result = this.docData.find(item=>{
          return (item.subject===sub && item.workId===id)
        })
        return result.username
      }
    },
    handleChange(row) {
      console.log(row._id)
      let data = {
        id: row._id,
        status: 1
      }
      data = qs.stringify(data)
      post('/api/order/changeStatus', data).then(res=>{
        if (res==='ok') {
          this.$message({
            message: '您已成功处理该预约！',
            type: 'success'
          });
          this.$router.go(0)
        }
      }).catch(err=>{
        console.log(err)
      })
    }
  },
}
</script>

<style lang="scss">
.deal {
  width: 90%;
  margin: 20px auto;
  background: #fff;
  padding: 15px;
  box-sizing: border-box;
  .deal_table {
    margin-bottom: 20px;
  }
}
</style>
<style>
.el-table td, .el-table th {
  padding: 3px 0;
}
</style>

