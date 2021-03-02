const express = require('express');
const User = require('../model/User');
const Role = require('../model/Role');
const multiparty = require('multiparty');
const request = require('request');

const router = new express.Router();

const tokens = {
    'admin': 'admin_token',
    'patient': 'patient_token',
    'workers': 'workers_token'
};

// 用户注册
router.post('/register', async (req, res)=>{
    try {
        // 取电话号码和验证码
        let {username, password} = req.body;
        let obj = req.body
        // 查数据库有没有这个电话号码的账号
        let result = await User.findOne({username});
        console.log('注册：', result)
        console.log(req.body)
        if(result){
            // 如果有，直接响应客户端账号已存在
            res.json({
                code: -1,
                message: '用户名已存在，请前往登录！',
            })
        }else{
            // 如果没有，帮用户注册，再登录
            let result = await new User(req.body).save();
            // 保存用户数据到session,保存用户的登录状态
            req.session.userInfo = result;
            const { role, username, workId, subject } = req.session.userInfo
            const resData = { role, username, workId, subject }
            res.json({
                code: 0,
                message: '登录成功',
                data: {
                    ...resData,
                    token: tokens[resData.role]
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            code: -4,
            message: '服务器异常，请重试'
        })
    }
})


// 根据电话号码和验证码的登录
router.post('/login', async (req, res)=>{
    try {
    
    // 取电话号码和验证码
    let {username, password} = req.body;
    // 查数据库有没有这个电话号码的账号
    let result = await User.findOne({username});
    if(result){
        // 如果有，直接响应客户端登录成功
        if (result.password === password) {
            // 保存用户数据到session,保存用户的登录状态
            req.session.userInfo = result;
            const { role, username, workId, subject } = req.session.userInfo._doc
            const resData = { role, username, workId, subject }
            console.log('存储session', req.session)
            res.json({
                code: 0,
                message: '登录成功',
                data: {
                    ...resData,
                    token: tokens[resData.role]
                }
            })
        } else {
            res.json({
                code: 1,
                message: '密码错误'
            })
        }
    }else{
        // 响应客户端登录成功
        res.json({
            code: 1,
            message: '用户名不存在'
        }) 
    }
    } catch (error) {
        console.log(error)
        res.json({
            code: -4,
            message: '服务器异常，请重试'
        }) 
    }

})

// 检查用户是否过期
router.get('/check_login', async(req, res)=>{
    if(req.session.userInfo){
        let result = await User.findById(req.session.userInfo._id);
        req.session.userInfo = result;
        //登录没有过期
        res.json({
            code:0,
            message: '用户没有过期',
            data: result
        })
    }else{
        //过期了
        res.json({
            code: -1,
            message: '用户过期了，请重新登录'
        })
    }
})

// 退出
router.get('/logout', (req, res)=>{
    req.session.userInfo = null;
    res.json({
        code: 0,
        message: 'ok',
        data: '退出成功'
    });
})

// 获得用户权限
router.get('/permission', async(req, res)=>{
    const r = req.query
    console.log(r)
    if(!req.session.userInfo){
        res.json({
            code: -1,
            message: '请先登录'
        })
    }else{
        let result = await Role.findOne({role: r.role});
        res.json({
            code: 0,
            message: 'ok',
            data: result
        })
    }
})

// 获得用户信息
router.get('/userinfo', async(req, res)=>{
    const r = req.query
    console.log(r)
    console.log('获取用户信息', req.session)
    const result = req.session.userInfo
    if(!result){
        res.json({
            code: -1,
            message: '请先登录'
        })
    }else{
        res.json({
            code: 0,
            message: 'ok',
            data: 
            {
                ...result,
                token: tokens[result.role]
            }
        })
    }
})

// 查询用户
router.get('/search', async(req, res)=>{
    console.log('查询', req.query)
    const sub = req.query
    const result = await User.find({role: 'workers', ...sub})
    res.json({
        code: 0,
        message: 'ok',
        data: result
    })
})

// 修改密码
router.post('/change', async(req,res)=>{
    const r = req.body
    console.log(r)
    if(!req.session.userInfo){
        res.json({
            code: -1,
            message: '请先登录'
        })
        return;
    }
    if (r.oldPassword===r.newPassword) {
        res.json({
            code: -1,
            message: '新密码不能与旧密码相同'
        })
        return;
    }
    let result = await User.findOne({_id: req.session.userInfo._id})
    console.log(result)
    if (result.password === r.oldPassword) {
        // 修改密码
        User.updateOne(
            {
                _id: req.session.userInfo._id
            },
            {
                password: r.newPassword
            }
        ).then(response=>{
            res.json({
                code: 0,
                message: 'ok',
                data: 'ok'
            })
        }).catch(err=>{
            console.log(err)
        })
    } else {
        res.json({
            code: -1,
            message: '修改密码失败！旧密码不匹配'
        })
    }
    
})


//   微博登录
router.get('/login/login_by_weibo', (req, res)=>{
    let {path} = req.query;
    let url = require('url');
    // 获得客户端的code
    let code = url.parse(path, true).query.code;

    console.log(code);

    // axios.post('https://api.weibo.com/oauth2/access_token', {
    //     client_id: '1189476203',
    //     client_secret: 'b61b65c6e45b994f7b0c26b648a1e072',
    //     grant_type: 'authorization_code',
    //     redirect_uri: 'http://129.204.72.71:8000',
    //     code 
    // })
    // .then(result=>{
    //     console.log(result);
    // })
    // .catch(error=>{
    // })

    // 请求换accesstoken， uid
    request({
        url: 'https://api.weibo.com/oauth2/access_token',//请求路径
        method: "POST",//请求方式，默认为get
        headers: {//设置请求头
            "content-type": "application/json",
        },
        form: {
            client_id: '1189476203',
            client_secret: 'b61b65c6e45b994f7b0c26b648a1e072',
            grant_type: 'authorization_code',
            redirect_uri: 'http://129.204.72.71:8000',
            code 
        }//post参数字符串
    }, function(error, response, body) {
        console.log(response.statusCode);
        if (!error && response.statusCode == 200) {
            console.log(body);
            let {uid, access_token} =body;

            // 使用accesstoken， uid 换用户信息
            request.get(`https://api.weibo.com/2/users/show.json?access_token=${access_token}&uid=${uid}`, function(error, response, body){
                console.log('----------');
                console.log(response.statusCode);
                console.log(body);
                if (!error && response.statusCode == 200) {
                    console.log(body);
                }
            })

        }
    }); 


})

module.exports = router;