const express = require('express');
const Order = require('../model/Order');
const router = new express.Router();

router.post('/submit', async (req, res)=>{
    console.log(req.body)
    const {name,
    phone,
    card,
    subject,
    doctor,
    subDate,
    time,
    note} = req.body;
    const form = {
        name,
        phone,
        card,
        subject,
        doctor,
        subDate,
        time,
        note
    }
    if(!req.session.userInfo){
        res.json({
            code: -1,
            message: '请先登录'
        })
    }else{
        if (req.session.userInfo.role==='admin') {
            res.json({
                code: -3,
                message: '抱歉，管理员不能预约，请切换其它账号重新预约！'
            })
            return;
        } else {
            let allresult = await Order.find({card: form.card, subDate: form.subDate, time: form.time, status: 0 }); // 根据身份证查找预约记录 身份证ID唯一
            if (allresult.length > 0) { // 有创建过预约
                res.json({
                    code: 3,
                    message: '您已预约该时间段，请勿重复预约！',
                    data: 'err'
                })
                return;
            } else {
                allresult = await Order.find({doctor: form.doctor, subDate: form.subDate, time: form.time, status: 0 });
                console.log(allresult.length)
                if (allresult.length===3) {
                    res.json({
                        code: 4,
                        message: '该医生在该时间段已预约满员，请预约其它医生或时间段！',
                        data: 'err'
                    })
                    return;
                } else {
                    console.log('已发送')
                    let date = new Date();
                    let dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes();
                    let result = await new Order({
                        user: req.session.userInfo._id,
                        ...form,
                        date: dateStr,
                        status: 0}).save();
                    res.json({
                        code: 0,
                        message: '保存成功',
                        data: result
                    });
                }
            }
        }
    }
})

router.get('/list', async (req, res)=>{
    if(!req.session.userInfo){
        res.json({
            code: -1,
            message: '请先登录'
        })
        return;
    }
    // 取得参数  page=1 count=10  page=2 count=10
    let {page, count} = req.query;
    // 设置默认值
    page = Number(page) || 1;
    count = Number(count) || 10;
    // 数据库的总数
    let allresult = '';
    if (req.session.userInfo.role==='workers') { // 医护人员
        var sub = req.session.userInfo.subject
        var id = req.session.userInfo.workId
        allresult = await Order.find({subject: sub, doctor: id})
    } else if (req.session.userInfo.role==='patient'){ // 患者
        allresult = await Order.find({user: req.session.userInfo})
    } else { // 管理员
        allresult = await Order.find({})
    }

    let dbCount = allresult.length;
    // console.log(dbCount);
    let skip = dbCount - (count * page);
    skip = (skip < 0) ? 0 : skip;
    
    // 判断长度
    let tmp = count * (page - 1);
    let limit = ((tmp + count) > dbCount) ? (dbCount - tmp) : count ;

    // console.log('skip: ', skip);
    // console.log('limit: ', limit);
    // let result = await Order.find({user: req.session.userInfo}).skip(skip).limit(limit);
    let result = ''
    if (req.session.userInfo.role==='workers') { // 医护人员
        result = await Order.find({subject: sub, doctor: id}).skip(skip).limit(limit);
    } else if (req.session.userInfo.role==='patient'){ // 患者
        result = await Order.find({user: req.session.userInfo}).skip(skip).limit(limit);
    } else { // 管理员
        result = await Order.find({}).skip(skip).limit(limit);
    }
    result = result.reverse();
        // 响应客户端
        res.json({
            code: 0,
            message: 'ok',
            data: {
                list: result,
                count: dbCount
            }
        })
})

router.get('/mylist', async(req,res)=>{
    if(!req.session.userInfo){
        res.json({
            code: -1,
            message: '请先登录'
        })
        return;
    }
    // 取得参数  page=1 count=10  page=2 count=10
    let {page, count} = req.query;
    // 设置默认值
    page = Number(page) || 1;
    count = Number(count) || 10;
    const allresult = await Order.find({user: req.session.userInfo})
    let dbCount = allresult.length;
    // console.log(dbCount);
    let skip = dbCount - (count * page);
    skip = (skip < 0) ? 0 : skip;
    
    // 判断长度
    let tmp = count * (page - 1);
    let limit = ((tmp + count) > dbCount) ? (dbCount - tmp) : count ;
    let result = await Order.find({user: req.session.userInfo}).skip(skip).limit(limit);
    result = result.reverse();
    // 响应客户端
    res.json({
        code: 0,
        message: 'ok',
        data: {
            list: result,
            count: dbCount
        }
    })
})

router.post('/changeStatus', async (req, res)=>{
    const status = req.body.status
    console.log('改变订单状态',status,status==1)
    if(!req.session.userInfo){
        res.json({
            code: -1,
            message: '请先登录'
        })
        return;
    }
    if (req.session.userInfo.role==='admin'){
        res.json({
            code: -2,
            message: '抱歉，管理员没有处理预约单的权限'
        })
        return;
    } else if (req.session.userInfo.role==='patient') {
        if (status==1) {
            res.json({
                code: -2,
                message: '抱歉，您没有处理预约单的权限！'
            })
            return;
        } else {
            Order.updateOne(
                {
                    user: req.session.userInfo._id,
                    _id: req.body.id
                },
                {
                    status: status
                }
            ).then(async response=>{
                let result = await Order.findOne({
                    user: req.session.userInfo._id,
                    _id: req.body.id
                }).populate(['user']);
                console.log(response)
                res.json({
                    code: 0,
                    message: 'ok',
                    data: 'ok'
                })
                return;
            }).catch(err=>{
                console.log(err)
                return;
            })
        }
    } else {
        Order.updateOne(
            {
                _id: req.body.id
            },
            {
                status: status
            }
        ).then(async response=>{
            let result = await Order.findOne({
                _id: req.body.id
            }).populate(['user']);
            console.log(response)
            res.json({
                code: 0,
                message: 'ok',
                data: 'ok'
            })
            return;
        }).catch(err=>{
            console.log(err)
        })
    }
})

module.exports = router;