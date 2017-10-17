var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;

var client = new Client();
//Models Imported
var User = require('./../models/User');
//
//Utiltiy Imported
var PasswordHashing = require('./../utility/PasswordHashing');
var passwordHashing = new PasswordHashing();
//
//Utiltiy Imported
var tokenUtil = require('./../utility/tokenUtil');
var tokenUtil = new tokenUtil();
//
//Enums, DTO's Imported
var ResponseCodeEnum = require('./../enums/ResponseCodeEnum');
var WalletTypeEnum = require('./../enums/WalletTypeEnum');
var Response = require('./../dto/Response');
//
//Routes Defined
var postAddUser = router.route('/addUser');
var postAddUserWalletInfo = router.route('/postAddUserWalletInfo');
var postLoginUser = router.route('/loginUser');
var getDashboardData = router.route('/getDashboardData');
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
postAddUser.post(function (req, res) {
  var user = new User();
  var response = new Response();
  User.findOne({ Email: req.body.Email }, function (err, existingUser) {
    if (existingUser != null) {
      response.code = ResponseCodeEnum.DECLINED;
      response.message = "User Already Exists";
      response.data = null;
      res.json(response);
    }
    else {
      user.Email = req.body.Email;
      user.Password = passwordHashing.createHash(req.body.Password);
      //***Wallet For New User */
      user.Role = 1;
      user.CreatedOnUTC = Math.floor(new Date());
      user.UpdatedOnUTC = Math.floor(new Date());
      user.save(function (err, user) {
        if (err) {
          response.code = ResponseCodeEnum.ERRORED;
          response.message = "Error for inserting Data to DB";
          response.data = err;
          res.json(response);
        }
        else {
          response.code = ResponseCodeEnum.SUCCESS;
          response.message = "User Created";
          user.Password = "";
          response.data = user;
          res.json(response);
        }
      });
    }
  });
});
postLoginUser.post(function (req, res) {
  var response = new Response();
  User.findOne({ Email: req.body.Email }, function (err, user) {
    if (user == null) {
      response.code = ResponseCodeEnum.DECLINED;
      response.message = "User Does not exists";
      response.data = null;
      res.json(response);
    }
    else {
      var validate = passwordHashing.validateHash(user.Password, req.body.Password);
      if (validate != true) {
        response.code = ResponseCodeEnum.DECLINED;
        response.message = "User Password is incorrect";
        response.data = null;
        return res.json(response);
      }
      response.code = ResponseCodeEnum.SUCCESS;
      response.message = "User Created";
      user.Password = "";
      response.data = user;
      res.json(response);
    }
  });
});
getDashboardData.get(function (req, res) {
  var response = new Response();
  var obj = new Object();
  var bitcoinurl = "https://chain.so/api/v2/get_address_balance/BTC/" + global.AdminBitcoinAddress;
  var litcoinurl = "https://chain.so/api/v2/get_address_balance/LTC/" + global.AdminLitcoinAddress;
  obj.ethers = tokenUtil.getBalance(global.AdminEthAddress);
  client.get(bitcoinurl, function (data, resp) {
    obj.bitcoins = data.data.confirmed_balance;
    obj.tokenRemaining = tokenUtil.balanceOf(global.AdminEthAddress);
    obj.totalCoins = tokenUtil.totalSupply();
    client.get(litcoinurl, function (data, resp) {
      obj.litcoins = data.data.confirmed_balance;
      response.code = 200;
      response.data = obj;
      response.message = "Success";
      res.json(response);
    });
  });

});

postAddUserWalletInfo.post(function (req, res) {
  var response = new Response();
  User.findOne({ EthAddress: req.body.EthAddress }, function (err, user) {
    if (user == null) {
      user = new User();
      user.EthAddress = req.body.EthAddress;
    }
    if (req.body.bitcoinAddress != null && req.body.bitcoinAddress != "") {
      user.WalletType = WalletTypeEnum.BITCOIN;
    }
    else if (req.body.ltcAddress != null && req.body.ltcAddress != "") {
      user.WalletType = WalletTypeEnum.LTC;
    }
    else {
      user.WalletType = WalletTypeEnum.ETHEREUM;
    }
    user.save(function(err,user){
      response.code = ResponseCodeEnum.SUCCESS;
      response.message = "SUCCESS";
      response.data = user;
    });
  });

});
module.exports = router;