const discrepancyModel = require('../models/Discrepancy');
const supplyModel = require('../models/Supplies');
const { validationResult } = require('express-validator');

// Recording discrepancy and updating stocks
exports.updateStock = (req, res) => {
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

                    var updateStock = {
                        totalSupply: physicalCount
                    };
                    
                    discrepancyModel.add(discrepancy, function(err, result){
                        if (err) {
                            throw err;
                        } else {
                            console.log('Discrepancy added!');
                            console.log(result);
                            supplyModel.updateStock(id, updateStock, (err, result) => {
                                if (err) {
                                    req.flash('error_msg', 'Could not update supply.');
                                    res.redirect('/supplies');
                                } else {
                                    req.flash('success_msg', 'Supply updated!');
                                    res.redirect('/supplies');
                                }
                            })
                        }

                    })
                }
            })
        }
        else {
            req.flash('error_msg', 'Please enter physical count.');
            res.redirect('/supplies');
        }
    }
};