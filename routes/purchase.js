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
global.AdminEthAddress = "0xD195e37a41118259cF9e9a9128F72D57aEe42c75";
global.AdminBitcoinAddress = "1FGjz1EdPa98Fek2dtKQFGAvakvt6urRn2";
global.AdminLitcoinAddress = "LYUKGkdykaHVX1fQUyDNYxW6w1j1hSZimA";
global.AdminSmartContractAddress = "0x569dEA7C56D9f143050a7eAf81AFB3053b302240";
global.AdminEthPassword = "bro123=H$";
global.priceForToken = 0.75;
global.preSaleBonusDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDay() + 13);
global.preSaleBonusDays = Math.floor(global.preSaleBonusDate);
global.saleBonusDate = new Date(preSaleBonusDate.getFullYear(), preSaleBonusDate.getMonth(), preSaleBonusDate.getDay() + 10);
global.saleBonusDays = Math.floor(global.saleBonusDate);
global.deadLine = Math.floor(new Date(saleBonusDate.getFullYear(), saleBonusDate.getMonth(), saleBonusDate.getDay() + 20));
global.preSaleBonusPercent = 20;
global.saleBonusPercent = 10;
global.totalTokens = 100000000;
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
    User.findOne({ EthAddress: req.body.WalletAddress }, function (err, user) {
        if (err) {
            console.log(err);
        }
        if (user == null) {
            var user = new User();
            user.Email = req.body.Email;
            user.WalletAddress = req.body.GenericWalletAddress;
            user.WalletType = req.body.WalletType;
            user.Tokens = req.body.Tokens;
            user.UpdatedOnUTC = Math.floor(new Date());
            user.CreatedOnUTC = Math.floor(new Date());
            user.EthAddress = req.body.WalletAddress;
            if (user.WalletType == WalletTypeEnum.BITCOIN) {
                var currency = '';
                if (req.body.WalletType == CryptoTypeEnum.BITCOIN) {
                    currency = 'BTC';
                }
                else if (req.body.WalletType == CryptoTypeEnum.ETHEREUM) {
                    currency = 'ETH';
                }
                else if (req.body.WalletType == CryptoTypeEnum.LITECOIN) {
                    currency = 'LTC';
                }
                if (currency != 'ETH') {
                    var confirmationUrl = "https://chain.so/api/v2/is_tx_confirmed/" + currency + "/" + req.body.TxHash.trim();
                    var transactionDataUrl = "https://chain.so/api/v2/get_tx_outputs/" + currency + "/" + req.body.TxHash.trim();
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
                                    if (req.body.WalletType == CryptoTypeEnum.BITCOIN) {
                                        //|| outputsArray[i].address == global.AdminBitcoinAddress
                                        if (outputsArray[i].address == req.body.GenericWalletAddress) {
                                            confirmationCount = confirmationCount + 1;
                                        }
                                        if (outputsArray[i].address == req.body.GenericWalletAddress) {
                                            totalBTCValue = parseFloat(outputsArray[i].value);
                                        }
                                    }
                                    // || outputsArray[i].address == global.AdminLitcoinAddress
                                    else if (req.body.WalletType == CryptoTypeEnum.LITECOIN) {
                                        if (outputsArray[i].address == req.body.GenericWalletAddress) {
                                            confirmationCount = confirmationCount + 1;
                                        }
                                        if (outputsArray[i].address == req.body.GenericWalletAddress) {
                                            totalBTCValue = parseFloat(outputsArray[i].value);
                                        }
                                    }
                                }
                                if (confirmationCount >= 1) {
                                    var now = Math.floor(new Date());
                                    var bonus = 0;
                                    if (now < global.preSaleBonusDays) {
                                        bonus = global.preSaleBonusPercent;
                                    }
                                    else if (now < global.saleBonusDays) {
                                        bonus = global.saleBonusPercent;
                                    }
                                    var urlBtcToUSD = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";
                                    var urlLtcToUSD = "https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD";
                                    var url = "";
                                    if (currency == CryptoTypeEnum.LITECOIN) {
                                        url = urlLtcToUSD;
                                    }
                                    else {
                                        url = urlBtcToUSD;
                                    }
                                    client.get(url, function (data, resp) {
                                        var price = data.USD;
                                        var totalUSD = parseFloat(totalBTCValue) * price;
                                        user.AmountInvested = totalBTCValue;
                                        var tokensToTransfer = (totalUSD / global.priceForToken);
                                        var bonusTokens = (tokensToTransfer * bonus) / 100;
                                        tokensToTransfer = tokensToTransfer + bonusTokens;
                                        tokenUtil.transferToken(global.AdminEthAddress, global.AdminEthPassword, req.body.WalletAddress, tokensToTransfer);
                                        user.save();
                                        response.code = ResponseCodeEnum.SUCCESS;
                                        response.data = null;
                                        response.message = "Success";
                                        res.json(response);
                                    });

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
                            res.json(response);
                        }
                    });
                }
                else {
                    user.save();
                    response.code = ResponseCodeEnum.SUCCESS;
                    response.data = null;
                    response.message = "Success";
                    res.json(response);
                }
            }
            else {
                var urlETHToUSD = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
                client.get(urlETHToUSD, function (data, resp) {
                    obj.EthToUSD = data.USD;
                    response.code = 200;
                    response.message = "Success";
                    response.data = obj;
                    res.json(response);
                });
                user.save();
                response.code = ResponseCodeEnum.SUCCESS;
                response.data = null;
                response.message = "Success";
                res.json(response);
            }
        }
        else {
            if (req.body.WalletType == WalletTypeEnum.BITCOIN) {
                var currency = '';
                if (req.body.WalletType == CryptoTypeEnum.BITCOIN) {
                    currency = 'BTC';
                }
                else if (req.body.WalletType == CryptoTypeEnum.ETHEREUM) {
                    currency = 'ETH';
                }
                else if (req.body.WalletType == CryptoTypeEnum.LITECOIN) {
                    currency = 'LTC';
                }
                if (currency != 'ETH') {
                    var confirmationUrl = "https://chain.so/api/v2/is_tx_confirmed/" + currency + "/" + req.body.TxHash.trim();
                    var transactionDataUrl = "https://chain.so/api/v2/get_tx_outputs/" + currency + "/" + req.body.TxHash.trim();
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
                                    if (req.body.WalletType == CryptoTypeEnum.BITCOIN) {
                                        // || outputsArray[i].address == global.AdminBitcoinAddress
                                        if (outputsArray[i].address == req.body.GenericWalletAddress) {
                                            confirmationCount = confirmationCount + 1;
                                        }
                                        if (outputsArray[i].address == req.body.GenericWalletAddress) {
                                            totalBTCValue = parseFloat(outputsArray[i].value);
                                        }
                                    }
                                    // || outputsArray[i].address == global.AdminLitcoinAddress
                                    else if (req.body.WalletType == CryptoTypeEnum.LITECOIN) {
                                        if (outputsArray[i].address == req.body.GenericWalletAddress) {
                                            confirmationCount = confirmationCount + 1;
                                        }
                                        if (outputsArray[i].address == req.body.GenericWalletAddress) {
                                            totalBTCValue = parseFloat(outputsArray[i].value);
                                        }
                                    }
                                }
                                if (confirmationCount >= 1) {
                                    var now = Math.floor(new Date());
                                    var bonus = 0;
                                    if (now < global.preSaleBonusDays) {
                                        bonus = global.preSaleBonusPercent;
                                    }
                                    else if (now < global.saleBonusDays) {
                                        bonus = global.saleBonusPercent;
                                    }
                                    var urlBtcToUSD = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";
                                    var urlLtcToUSD = "https://min-api.cryptocompare.com/data/price?fsym=LTC&tsyms=USD";
                                    var url = "";
                                    if (currency == CryptoTypeEnum.LITECOIN) {
                                        url = urlLtcToUSD;
                                    }
                                    else {
                                        url = urlBtcToUSD;
                                    }
                                    client.get(url, function (data, resp) {
                                        var price = data.USD;
                                        var totalUSD = parseFloat(totalBTCValue) * price;
                                        var tokenRemaining = tokenUtil.balanceOf(global.AdminEthAddress);
                                        tokens = global.totalTokens - tokenRemaining;
                                        if(tokens < 26666667){
                                            global.rateForToken = 0.75;
                                        }
                                        else if(tokens < 46666667){
                                            global.rateForToken = 1;
                                        }
                                        else if(tokens < 56666667){
                                            global.rateForToken = 2;
                                        }
                                        else if(tokens < 70000000){
                                            global.rateForToken = 3;
                                        }
                                        else if(tokens < 90000000){
                                            global.rateForToken = 5;
                                        }
                                        else if(tokens < 96666667){
                                            global.rateForToken = 10;
                                        }
                                        else{
                                            global.rateForToken = 15;
                                        }
                                        var tokensToTransfer = (totalUSD / global.priceForToken);
                                        var bonusTokens = (tokensToTransfer * bonus) / 100;
                                        tokensToTransfer = tokensToTransfer + bonusTokens;
                                        tokenUtil.transferToken(global.AdminEthAddress, global.AdminEthPassword, req.body.WalletAddress, tokensToTransfer);
                                        user.save();
                                        response.code = ResponseCodeEnum.SUCCESS;
                                        response.data = null;
                                        response.message = "Success";
                                        res.json(response);
                                    });

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
                            res.json(response);
                        }
                    });
                }
                else {
                    user.save();
                    response.code = ResponseCodeEnum.SUCCESS;
                    response.data = null;
                    response.message = "Success";
                    res.json(response);
                }
            }
            else {
                var urlETHToUSD = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD";
                client.get(urlETHToUSD, function (data, resp) {
                    var obj = {};
                    obj.EthToUSD = data.USD;
                    user.save();
                    response.code = 200;
                    response.message = "Success";
                    response.data = obj;
                    res.json(response);
                });
            }
        }
    });
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
                    if(purchasers[i].AmountInvested !== undefined){
                       purchasers[i].Ethers = purchasers[i].AmountInvested;
                    }
                    else{
                        purchasers[i].Ethers = 0;
                    }
                    purchasers[i].Password = "BTC";
                }
                else {
                    try {
                        var eth = parseFloat(tokenUtil.etherOf(purchasers[i].WalletAddress));
                        purchasers[i].Ethers = eth / 1000;
                        purchasers[i].Password = "ETH";
                    }
                    catch (ex) {
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