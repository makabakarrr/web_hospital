const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('./config');
const User = require('./model/User');
const Role = require('./model/Role');

// 创建保存session的仓库
var store = new MongoDBStore({
  uri: config.mongodbUrl,
  collection: 'session'
});
 
// Catch errors
store.on('error', function(error) {
  console.log(error);
});

const app = express();

// let initDoc = []
function mockData(){
    const {mock, Random} = require('mockjs');
    let subData = [
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
    let data = mock({
        'arr|50': [{
            username: '@cfirst@clast',
            password: 'a123456',
            role: 'workers',
            subject: '@natural(0,6)',
            workId: '@string("number",5)'
        }]
    });
    data = data.arr.map(item => {
        const i = item.subject
        return {
            ...item,
            subject: subData[i].value
        }
    });
    data.forEach(item=>{
        new User(item).save();
    })
}

// app.use(function(req, res, next){  
//     console.log(req.url)
//     res.header('Access-Control-Allow-Methods',
//     'GET,PUT,POST,DELETE,OPTIONS');  
//     res.header('Access-Control-Allow-Headers',
//     'Access-Control-Allow-Origin,*');  
//     res.header('Access-Control-Allow-Credentials', true);  
//     res.header('Access-Control-Allow-Origin',
//     '*');
//  if (req.method === 'OPTIONS') {
//      res.status(200);
//  } next();
// })
// 处理请求的session
app.use(require('express-session')({
    secret: 'hello world',
    name: 'SESSION_ID',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      secure: false
    },
    store: store,
    resave: false,
    saveUninitialized: false
}));

app.use('/static', express.static('./static'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/user', require('./routers/userRouter'));
app.use('/api/order', require('./routers/orderRouter'));
app.use('/api/role', require('./routers/roleRouter'));

// 连接数据库
mongoose.connect(config.mongodbUrl, (error)=>{
    if(error){
        console.log('连接数据库失败');
    }else{
        console.log('连接数据库成功');
        // 启动服务器
        app.listen(3000, (error)=>{
            if(error)
                console.log('启动失败');
            else
                console.log('启动成功');
                // 添加admin账户 随机生成医生信息
                User.findOne({username: 'admin'}).then(res => {
                    if (!res) {
                        new User({ username: 'admin', password: 'a123456', role: 'admin', workId: '', subject: '' }).save();
                        mockData()
                    }
                }).catch(err => {
                    console.log(err)
                })
                // 添加角色数量
                Role.findOne({role: 'admin'}).then(res => {
                    if (!res) {
                        new Role({ role: 'admin', id: '001', permission: ['1001', '1002'] }).save();
                        new Role({ role: 'workers', id: '002', permission: ['1001'] }).save();
                        new Role({ role: 'patient', id: '003', permission: [] }).save();
                    }
                }).catch(err => {
                    console.log(err)
                })
                
        })
    }
})
