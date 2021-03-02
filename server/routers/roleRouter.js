const express = require('express');
const Role = require('../model/Role');
const multiparty = require('multiparty');

const router = new express.Router();

// 获取角色权限
router.get('/permissions', async(req,res)=>{
  try {
    if(!req.session.userInfo){
      res.json({
          code: -1,
          message: '请先登录'
      })
    } else {
      const role = req.query.role
      const result = await Role.findOne({role: role})
      if (result) {
        res.json({
          code: 0,
          message: 'ok',
          data: result.permission
        })
      } else {
        res.json({
          code: -2,
          message: '未搜索到相应角色，请重试！',
          data:'err'
        })
      }
    }
  } catch (error) {
    console.log(error)
  }
})

router.post('/setPermission', async(req,res)=>{
  try {
    const role = req.body.role
    let permission = req.body.permission
    console.log(permission)
    if (!permission) {
      permission = []
    }else {
      permission = permission.split(',')
    }
    console.log(req.body)
    console.log(permission)
    if (!req.session.userInfo) {
      res.json({
        code: -1,
        message: '请先登录'
      })
    } else {
      if (req.session.userInfo.role !== 'admin') {
        res.json({
          code: -2,
          message: '抱歉，您没有操作权限，请联系管理员！',
          data: 'err'
        })
      } else {
        Role.updateOne(
          {
            role: role
          },
          {
            permission: permission
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
      }
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;