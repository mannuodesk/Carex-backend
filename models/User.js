/**
 * Created by Tauqeer on 05-08-2016.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var UserSchema = new mongoose.Schema({
    Email: String,
    WalletAddress: String,
    WalletType:Number,
    Tokens:Number,
    CreatedOnUTC: Number,
    UpdatedOnUTC: Number
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);