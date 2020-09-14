const discrepancyModel = require('../models/Discrepancy');
const supplyModel = require('../models/Supplies');
const { validationResult } = require('express-validator');

exports.checkDiscrepancy = (req, res) => {
    const errors = validationResult(req);
    const messages = errors.array().map((item) => item.msg);
    const { physicalCount, id } = req.body;

    if(errors.isEmpty()){
        if(physicalCount != ""){
            supplyModel.getByID(id, (err, result) => {
                var stock = result.totalSupply;
                if(physicalCount == stock){
                    req.flash('success_msg', 'System count and physical count are the same.');
                    res.redirect('/supplies');               
                }
                else {
                    var discrepancy = {
                       physicalCount: physicalCount,
                       date: Date.now(),
                       supplyID: id
                    };
                    
                    discrepancyModel.add(discrepancy, function(err, result){
                        if (err) {
                            throw err;
                        } else {
                            console.log('Discrepancy added!');
                            console.log(result);
                        }
                    })
                    req.flash('success_msg', 'Discrepancy recorded!');
                    res.redirect('/supplies');
                }
            })
        }
        else {
            req.flash('error_msg', 'Please enter physical count.');
            res.redirect('/supplies');
        }
    }
    //res.redirect('/supplies');
};