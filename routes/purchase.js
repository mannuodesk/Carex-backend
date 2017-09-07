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
var getPurchasersList = router.route('/getPurchasers');
//
//Mongo Connectivity
var mongoose = require('mongoose');
var DbUrl = require('./../utility/DbUrl');
var dbUrl = new DbUrl();
var url = dbUrl.getURL();
//

//Global Variables
global.AdminEthAddress = "0xc8ae3f27017b99fd4072983c0a254174500441bf";
global.AdminBitcoinAddress = "";
global.AdminSmartContractAddress = "0xE8704901aaA5775F830E7B803078331B1Bb096cb";
global.AdminEthPassword = "inw76IzO27d9a03aceef5f2d22f65ab3c0560a19f";
global.priceForToken = 1000000000000000;
global.preSaleBonusDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay() + 13);
global.preSaleBonusDays = Math.floor(global.preSaleBonusDate);
global.saleBonusDate = new Date(preSaleBonusDate.getFullYear(), preSaleBonusDate.getMonth(), preSaleBonusDate.getDay() + 10);
global.saleBonusDays = Math.floor(global.saleBonusDate);
global.deadLine = Math.floor(new Date(saleBonusDate.getFullYear(), saleBonusDate.getMonth(), saleBonusDate.getDay() + 20));
//
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
            var confirmationUrl = "https://chain.so/api/v2/is_tx_confirmed/" + currency + "/" + req.body.TxHash;
            var transactionDataUrl = "https://chain.so/api/v2/get_tx_outputs/" + currency + "/" + req.body.TxHash;
            client.get(confirmationUrl, function (data, r) {
                // parsed response body as js object 
                if (data.data.is_confirmed == true) {

                    //Work to be done
                    //Transaction Address to be verified
                    //Transaction Amount to be verified and calculation to be done
                    //multiplication of final calculation with decimals


                    client.get(transactionDataUrl, function (data, r) {

                        var outputsArray = data.data.outputs;
                        var confirmationCount = 0;
                        var totalBTCValue = 0;
                        for (var i = 0; i < outputsArray.length; i++) {
                            if (outputsArray[i].address == req.body.WalletAddress || outputsArray[i].address == global.AdminBitcoinAddress){
                                confirmationCount = confirmationCount + 1;
                            }
                            if(outputsArray[i].address == req.body.WalletAddress){
                                totalBTCValue = parseFloat(outputsArray[i].value);
                            }
                        }
                        if (confirmationCount >= 2) {
                            var now = Math.floor(new Date());
                            var bonus = 0;
                            if (now < global.preSaleBonusDays) {
                                bonus = preSaleBonusPercent;
                            }
                            else if (now < global.saleBonusDays) {
                                bonus = saleBonusPercent;
                            }

                            var tokensToTransfer = (totalBTCValue / global.priceForToken);
                            var bonusTokens = (tokensToTransfer * bonus) * 100;
                            tokensToTransfer = tokensToTransfer + bonusTokens;
                            tokenUtil.transferToken("0xc8ae3f27017b99fd4072983c0a254174500441bf", "inw76IzO27d9a03aceef5f2d22f65ab3c0560a19f", req.body.EthAddress, tokensToTransfer);
                            response.code = ResponseCodeEnum.SUCCESS;
                            response.data = null;
                            response.message = "Success";
                            res.json(response);
                        }
                        else {
                            response.code = ResponseCodeEnum.ERRORED;
                            response.message = "Transaction Not Confirmed by System";
                            response.data = null;
                            res.json(response);
                        }
                    });


                }
                else {
                    response.code = ResponseCodeEnum.ERRORED;
                    response.message = "Transaction Not Confirmed";
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
    else {
        response.code = ResponseCodeEnum.SUCCESS;
        response.data = null;
        response.message = "Success";
        res.json(response);
    }
});

getPurchasersList.get(function (req, res) {
    var response = new Response();
    User.find({ 'Role': undefined }, function (err, purchasers) {
        if (err) {
            res.json(err);
        }
        else {
            for (var i = 0; i < purchasers.length; i++) {
                if (purchasers[i].WalletType == WalletTypeEnum.BITCOIN) {
                    purchasers[i].Ethers = 0;
                    purchasers[i].Password = "BTC";
                }
                else {
                    try{
                        purchasers[i].Ethers = tokenUtil.etherOf(purchasers[i].WalletAddress);
                        purchasers[i].Password = "ETH";
                    }
                    catch(ex){
                     console.log(ex);   
                    }
                }
            }
            response.code = 200;
            response.message = "Success";
            response.data = purchasers;
            res.json(response);
        }
    });
});

module.exports = router;