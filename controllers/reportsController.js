const productModel = require('../models/Product');
const orderModel = require('../models/Order');
const expenseModel = require('../models/ExpenseDetails');
const orderListModel = require('../models/OrderList');
const purchaseModel = require('../models/PurchaseSupplies');
const { validationResult } = require('express-validator');

// Order history report
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

                console.log("listObjects");
                console.log(listObjects);
                        
                res(listObjects);
            }
        })
    }
};

// Sales report
exports.salesReport = (req, res) => {
    var sDate = req.query.salfromDate;
    var eDate = req.query.salToDate;
    var i;

    if(sDate == undefined && eDate == undefined){
        var today = new Date;
        productModel.getAllProducts(req, (err, products) => {
            if(err){
                console.log("Could not get sales");
                console.log(err);
                req.flash('error_msg', 'Could not get products.');
                //res.redirect('/sales_report');
            } else {
                console.log("products");
                console.log(products);
                
                res(products);    
            }
        })
    } else {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);

    }
};

// Purchase report
exports.purchaseReport = (req, res) => {
    var sDate = req.query.ordfromDate;
    var eDate = req.query.ordToDate;
    
    if(sDate == undefined && eDate == undefined){
        purchaseModel.getAllPurchase(req,(err, purchase) => {
            if(err){
                req.flash('error_msg', 'Could not get purchases.');
                res.redirect('/purchase_report');
            } else {
                console.log("purchase");
                console.log(purchase);
                res(purchase);
            }
        })
    } else {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);

        purchaseModel.getAllPurchase(req, (err, purchase) => {
            if(err){
                req.flash('error_msg', 'Could not get purchase list.');
                res.redirect('/purchase_report');
            } else {
                endDate.setDate(endDate.getDate());
                var purchaseList = purchase.filter(e => e.purchaseDate >= startDate && e.purchaseDate <= endDate);

                console.log("purchaseList");
                console.log(purchaseList);
                        
                res(purchaseList);
            }
        })
    }
};

// Profitability total sales
exports.profitReport = (req, res) => {
    productModel.getTotalSales(req,(err, total) => {
        if(err){
            req.flash('error_msg', 'Could not get total sales.');
            res.redirect('/profitability');
        } else {
            console.log("total");
            console.log(total[0].totalSales);
            res(total[0].totalSales);
        }
    })
};

// Profitability total sales
exports.profitExpReport = (req, res) => {
    expenseModel.getTotalExpenses(req,(err, expenses) => {
        if(err){
            req.flash('error_msg', 'Could not get expenses.');
            res.redirect('/profitability');
        } else {
            console.log("total expenses");
            console.log(expenses[0].totalExpenses);
            res(expenses[0].totalExpenses);
        }
    })
};

// Getting net income
exports.getNetIncome = (req, res) => {
    expenseModel.getTotalExpenses(req,(err, expenses) => {
        productModel.getTotalSales(req,(err, total) => {
            var totalSales, totalExpenses, netIncome;
            if(err){
                req.flash('error_msg', 'Could not get purchases.');
                res.redirect('/profitability');
            } else {
                totalSales = total[0].totalSales;
                totalExpenses = expenses[0].totalExpenses;
                netIncome = totalSales - totalExpenses;
                console.log(netIncome);
                res(netIncome);
            }
        })
    })
};