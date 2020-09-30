const productModel = require('../models/Product');
const orderModel = require('../models/Order');
const orderListModel = require('../models/OrderList');
const { validationResult } = require('express-validator');

exports.getSales = (req, res) => {
    var i;
    productModel.getAllProducts(req, (err, products) => {
        const productsObjects = [];
    
        if(err){
            req.flash('error_msg', 'Could not get products.');
            res.redirect('/sales_report');
        } else {
            // console.log("products");
            // console.log(products);
            // console.log("products[2].orders.length");
            // console.log(products[2].orders.length);
            
            orderModel.getAll(req, (err, orders) => {
                for(i = 0; i < products.length; i++){
                    if(products[i].orders.length != 0){
                        console.log("products[i].orders");
                        console.log(products[i].orders);
                        for(j = 0; j < orders.length;)
                        if(products[i].orders)
                        products[i].forEach(function(doc) {
                            productsObjects.push(doc);
                        });
                    }
                }
                // productsObjects.forEach(function(doc){

                // })
                res(productsObjects);
            })
            
        }
    })
};

exports.orderHistory = (req, res) => {
    var startDate = req.body.ordfromDate;
    var endDate = req.body.ordToDate;
    var i;

    console.log("start date in controller");
    console.log(startDate);
    console.log("end date in controller");
    console.log(endDate);
    
    if(startDate == undefined && endDate == undefined){
        console.log("pasok sa if undefined");
        orderListModel.getAll(req, (err, list) => {
            if(err){
                req.flash('error_msg', 'Could not get order list.');
                res.redirect('/order_history');
            } else {
                // console.log("list");
                // console.log(list);
                res(list);
            }
        })
    } else {
        console.log("start date with value in controller");
        console.log(startDate);
        console.log("end date with value in controller");
        console.log(endDate);
        // orderListModel.getAll(req, (err, list) => {
        //     if(err){
        //         req.flash('error_msg', 'Could not get order list.');
        //         res.redirect('/order_history');
        //     } else {
        //         var listObjects = [];
        //         for(i = 0; i < list.length; i++){
        //             if(list[i].orderDate >= startDate && list[i].orderDate <= endDate){
        //                 list.forEach(function(doc) {
        //                     listObjects.push(doc.toObject());
        //                 });
        //             }
        //         }
        //         console.log("list");
        //         console.log(list);
        //         res(listObjects);
        //     }
        // })
    }
};