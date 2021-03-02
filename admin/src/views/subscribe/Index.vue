<template>
  <div class="subscribe">
    <div class="banner">
      <img src="@/assets/home/sub.jpg" alt="">
    </div>
    <div class="form_title intro_title">
      <h2>就诊信息填写<span>（请如实填写）</span></h2>
    </div>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="就诊院区" prop="">
        <el-input v-model="form.hos" disabled></el-input>
      </el-form-item>
      <el-form-item label="就诊人姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入就诊人姓名"></el-input>
      </el-form-item>
      <el-form-item label="就诊人证件号" prop="card">
        <el-input v-model="form.card" placeholder="请输入就诊人证件号码"></el-input>
      </el-form-item>
      <el-form-item label="就诊人电话号码" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入就诊人电话号码"></el-input>
      </el-form-item>
      <el-form-item label="就诊科室" prop="subject">
        <el-select v-model="form.subject" placeholder="请选择科室">
          <el-option
            v-for="item in subjectObj"
            :label="item.label" :value="item.value" 
            :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="就诊医生" prop="doctor">
        <el-select v-model="form.doctor" filterable placeholder="请选择该科室就诊医生">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="就诊日期" prop="subDate">
        <el-date-picker
          v-model="form.subDate"
          type="date"
          placeholder="选择就诊日期"
          :picker-options="pickerOptions"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="就诊时间" prop="time">
        <el-select v-model="form.time" placeholder="请选择就诊时间">
          <el-option label="上午" value="上午"></el-option>
          <el-option label="下午" value="下午"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="form.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSub">确认预约</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {get, post} from '@/utils/request'
import qs from 'qs'
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() || time.getTime() > Date.now() + 14*24*60*60*1000;
        }
      },
      form: {
        hos: 'xx医院中心',
        name: '',
        phone: '',
        card: '',
        subject: '',
        doctor: '',
        subDate: '',
        time: '上午',
        note: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入就诊人姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '请输入3-5个汉字', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入就诊人电话', trigger: 'blur' },
          {validator:function(rule,value,callback){
            if(/^1[34578]\d{9}$/.test(value) == false){
                callback(new Error("请输入正确的手机号"));
            }else{
                callback();
            }
          }, trigger: 'blur'}
        ],
        card: [
          { required: true, message:'请输入证件号！', trigger: 'blur' },
          {pattern:/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '你的身份证格式不正确', trigger: 'blur' }
        ],
        subject: [
          { required: true, message:'请选择就诊科室!', trigger: 'blur' }
        ],
        doctor: [
          { required: true, message:'请选择就诊医生', trigger: 'blur' }
        ],
        subDate: [
          { required: true, message:'请选择就诊日期！', trigger: 'blur' }
        ],
        time: [
          { required: true, message:'请选择就诊时间', trigger: 'blur' }
        ]
      },
      options: [],
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
  methods: {
    getDocData(sub) {
      get('/api/user/search', {subject: sub}).then(res=>{
        if (res) {
          res.forEach(item => {
            this.options.push({
              label: item.username,
              value: item.workId
            })
          })
        }
      }).catch(err=>{
        console.log(err)
      })
    },
    handleSub() {
      console.log(this.$refs.ruleForm)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          // 提交到服务器
          const d = qs.stringify(this.form)
          post('/api/order/submit', d).then(res=>{
            if (res) {
              this.$message({
                message: '您已预约成功',
                type: 'success'
              });
            }
          }).catch(err=>{
            console.log(err)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  watch: {
    'form.subject': function(val) {
      console.log('选择', val)
      this.options = []
      this.getDocData(val)
      this.form.doctor = ''
    }
  },
}
</script>

<style lang="scss" scoped>
.subscribe {
  .banner {
    img {
      width: 90%;
      height: 420px;
      margin: 0 auto;
      display: block;
    }
  }
  .intro_title {
    height: 48px;
    background: #3064b8;
    
    h2 {
      width: 80%;
      margin: 5px auto 0;
      color: #fff;
      border-left: 14px solid #bb0b0b;
      line-height: 48px;
      padding-left: 15px;
      span {
        font-size: 18px;
        margin-left:10px;
      }
    }
  }
}
</style>
<style lang="scss">
.subscribe {
  .el-form {
    width: 1200px;
    margin: 10px auto;
    padding: 20px 15%;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 10px;
  }
}
</style>

