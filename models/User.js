/**
 * Created by Tauqeer on 05-08-2016.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema = new mongoose.Schema({
    Email: String,
    Password: String,
    Role: Number,
    WalletAddress: String,
    EthAddress:String,
    WalletType: Number,
    AmountInvested:Number,
    Tokens: Number,
    Ethers:String,
    CreatedOnUTC: Number,
    UpdatedOnUTC: Number
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);