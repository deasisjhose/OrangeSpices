const productModel = require('../models/Product');
const orderModel = require('../models/Order');
const orderListModel = require('../models/OrderList');
const { validationResult } = require('express-validator');

//Getting all orders
exports.getAllOrders = (param, callback) => {
    orderModel.getAll(param, (err, order) => {
        if (err) throw err;

        const ordersObjects = [];

        order.forEach(function(doc) {
            ordersObjects.push(doc.toObject());
        });

        callback(ordersObjects);
    });
};

exports.checkout = (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        console.log("req.body.id in controller");
        console.log(req.body.id);
        console.log("total amount in controller");
        console.log(req.body.totalAmount);
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/POS');
    }
};