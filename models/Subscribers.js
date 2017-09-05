/**
 * Created by Tauqeer on 05-08-2016.
 */

// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var SubscribersSchema = new mongoose.Schema({
    Email: String,
    CreatedOnUTC: Number,
    UpdatedOnUTC: Number
});

// Export the Mongoose model
module.exports = mongoose.model('Subscribers', SubscribersSchema);