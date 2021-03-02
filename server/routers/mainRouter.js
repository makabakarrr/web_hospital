const express = require('express');
const router = new express.Router();
const {mock} = require('mockjs');

router.get('/banner', (req, res)=>{
    let data = mock({
        code: 0,
        message: 'ok',
        'data|4': [
            {
                'id|+1': 1,
                url: '@image(320x220, @color)'
            }
        ]
    });
    res.json(data);
})

router.get('/shoplist', (req, res)=>{
    let shoplist= require('../data/shoplist.json');
    res.json({
        code:0,
        message: 'ok',
        data: shoplist
    })
})

module.exports = router;