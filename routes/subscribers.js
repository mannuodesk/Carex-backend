var express = require('express');
var router = express.Router();


//Models Imported
var Subscibers = require('./../models/Subscribers');
//
//Utiltiy Imported
var tokenUtil = require('./../utility/tokenUtil');
var tokenUtil = new tokenUtil();
//
//Enums, DTO's Imported
var ResponseCodeEnum = require('./../enums/ResponseCodeEnum');
var WalletTypeEnum = require('./../enums/WalletTypeEnum');
var CryptoTypeEnum = require('./../enums/CryptoTypeEnum');
var Response = require('./../dto/Response');
//
//Routes Defined
var postAddSubscriber = router.route('/addSubscriber');
//
//Mongo Connectivity
var mongoose = require('mongoose');
var DbUrl = require('./../utility/DbUrl');
var dbUrl = new DbUrl();
var url = dbUrl.getURL();


mongoose.connect(url, function (err, db) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Successfully Connected");
    }
});
//

postAddSubscriber.post(function(req, res){
    var response = new Response();
    var subscibers = new Subscibers();
    subscibers.Email = req.body.Email;
    subscibers.save();
    response.code = ResponseCodeEnum.SUCCESS;
    response.data = null;
    response.message = "Success";
    res.json(response);
});

module.exports = router;
