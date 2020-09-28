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
        var i;
        var idList = req.body.id;
        var prodList = req.body.productName;
        var qtyList = req.body.orderQuantity;
        var priceList = req.body.productPrice;
        var subList = req.body.subTotal;
        var totalAmount = req.body.totalAmount;
        
        var orderList = {
            orderDate: Date.now(),
            totalAmount: totalAmount
        }

        orderListModel.add(orderList, function(err, result) {
            if (err) {
                console.log(err);
                req.flash('error_msg', 'Could not add order list.');
                res.redirect('/POS');
            } else {
                listID = result._id;

                for(i = 0; i < idList.length; i++){
                    var order = {
                        productID: idList[i],
                        orderListID: result._id, 
                        productName: prodList[i],
                        orderQuantity: qtyList[i],
                        productPrice: priceList[i],
                        subTotal: subList[i]
                    }

                    orderModel.add(order, function(err, result){
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(result);
                        }
                    })
                }
                req.flash('success_msg', "Order saved!");
                res.redirect('/POS');
                console.log("Order saved!");
            }
        })
    } else {
        const messages = errors.array().map((item) => item.msg);
        req.flash('error_msg', messages.join(' '));
        res.redirect('/POS');
    }
};