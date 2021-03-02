const express = require('express');
const router = new express.Router();

router.get('/list', (req, res)=>{
    res.json({
        code: 0,
        message: 'ok',
        data: require('../data/tea.json')
    })
});

module.exports = router;