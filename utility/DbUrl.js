var DbUrl = function Constructor() {

};


DbUrl.prototype.getURL = function () {
    // Connection URL. This is where your mongodb server is running.
    var url = 'mongodb://admin:bro123=H$@ds127034.mlab.com:27034/carex';
    return url;
};

module.exports = DbUrl;