var express = require('express');
var router = express.Router();

//Models Imported
var User = require('./../models/User');
//
//Utiltiy Imported
var PasswordHashing = require('./../utility/PasswordHashing');
var passwordHashing = new PasswordHashing();
//
//Enums, DTO's Imported
var ResponseCodeEnum = require('./../enums/ResponseCodeEnum');
var Response = require('./../dto/Response');
//
//Routes Defined
var postAddUser = router.route('/addUser');
var postLoginUser = router.route('/loginUser');
//
//Mongo Connectivity
var mongoose = require('mongoose');
var DbUrl = require('./../utility/DbUrl');
var dbUrl = new DbUrl();
var url = dbUrl.getURL();

mongoose.connect(url, function(err, db){
  if(err){
    console.log(err);
  }
  else{
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
module.exports = router;
