var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;

var client = new Client();

//Models Imported
var User = require('./../models/User');
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
var postPurchaseTokens = router.route('/purchaseTokens');
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

//Global Variables
global.rateForToken = 0.52;
//

postPurchaseTokens.post(function (req, res) {
    var user = new User();
    var response = new Response();
    user.Email = req.body.Email;
    user.WalletAddress = req.body.WalletAddress;
    user.WalletType = req.body.WalletType;
    user.Tokens = req.body.Tokens;
    user.UpdatedOnUTC = Math.floor(new Date());
    user.CreatedOnUTC = Math.floor(new Date());
    user.save();
    if (user.WalletType == WalletTypeEnum.BITCOIN) {
        var currency = '';
        if (req.body.WalletType == CryptoTypeEnum.BITCOIN) {
            currency = 'BTC';
        }
        else if (req.body.WalletType == CryptoTypeEnum.ETHEREUM) {
            currency = 'ETH';
        }
        if (currency != 'ETH') {
            var url = "https://chain.so/api/v2/is_tx_confirmed/" + currency + "/" + req.body.TxHash;
            client.get(url, function (data, resp) {
                // parsed response body as js object 
                console.log(data);
                if (data.data.is_confirmed == true) {
                    tokenUtil.transferToken("0xc8ae3f27017b99fd4072983c0a254174500441bf", "inw76IzO27d9a03aceef5f2d22f65ab3c0560a19f", user.EthAddress, claim.TotalTokens);
                    response.code = ResponseCodeEnum.SUCCESS;
                    response.data = null;
                    response.message = "Success";
                    res.json(response);
                }
                else {
                    response.code = ResponseCodeEnum.ERRORED;
                    response.message = "Failure";
                    response.data = null;
                    res.json(res);
                }
            });
        }
        else {
            response.code = ResponseCodeEnum.SUCCESS;
            response.data = null;
            response.message = "Success";
            res.json(response);
        }
    }
    else{
        response.code = ResponseCodeEnum.SUCCESS;
        response.data = null;
        response.message = "Success";
        res.json(response);
    }
});

module.exports = router;
