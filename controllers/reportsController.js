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

                        // for(j = 0; j < orders.length;){
                        //     if(products.orders)
                        //     products.forEach(function(doc) {
                        //         productsObjects.push(doc);
                        //     });
                        // }
                        
                    }
                }
                // productsObjects.forEach(function(doc){

                // })
                res(products);
            })
            
        }
    })
};

exports.orderHistory = (req, res) => {
    var sDate = req.query.ordfromDate;
    var eDate = req.query.ordToDate;
    
    if(sDate == undefined && eDate == undefined){
        orderListModel.getAll(req,(err, list) => {
            if(err){
                req.flash('error_msg', 'Could not get order list.');
                res.redirect('/order_history');
            } else {
                console.log("list");
                console.log(list);
                res(list);
            }
        })
    } else {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);

        orderListModel.getAll(req, (err, list) => {
            if(err){
                req.flash('error_msg', 'Could not get order list.');
                res.redirect('/order_history');
            } else {
                endDate.setDate(endDate.getDate()+1);
                var listObjects = list.filter(e => e.orderDate >= startDate && e.orderDate <= endDate);

                console.log(listObjects);
                        
                res(listObjects);
            }
        })
    }
};