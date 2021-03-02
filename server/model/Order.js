const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    user: { // 创建订单的用户
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user'
    },
    hos: String,
    name: String,
    phone: String,
    card: String,
    subject: String,
    doctor: String,
    subDate: String,
    time: String,
    note: String,
    status: {
        default: 0,// 0待支处理  1已处理  -1已过期
        type: Number
    },
    date: String // 创建日期
})

const Order = mongoose.model('order', schema);

module.exports = Order;