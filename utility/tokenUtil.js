var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://52.171.141.59:8545'));
var Client = require('node-rest-client').Client;

var client = new Client();



var TokenUtil = function Constructor() {

};
//0x27e78277915C5890eA25a0B941afce4398513d72
var addressForContract='0xb965f293a7783f65726dd9B160e7173c5dEf5c50';
var Contract = web3.eth.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"totalTokensToTransfer","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"daysToExtend","type":"uint256"}],"name":"extendDeadline","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_accountByOwner","type":"address"},{"name":"balanceToTransfer","type":"uint256"}],"name":"transferLimitedFundToAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"paused","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"index","type":"uint256"}],"name":"getParticipantAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"geTotalParticipants","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balanceOfUser","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"pause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_participant","type":"address"}],"name":"etherOf","outputs":[{"name":"balanceOfUser","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadLine","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_accountByOwner","type":"address"}],"name":"transferFundToAccount","outputs":[{"name":"result","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[],"name":"Pause","type":"event"},{"anonymous":false,"inputs":[],"name":"Unpause","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]
).at(addressForContract);
TokenUtil.prototype.transferToken = function (addressFrom, passwordUnlock, addressToTransfer, totalTokens) {
    try {
        var isUnlocked = web3.personal.unlockAccount(addressFrom, passwordUnlock, 15000);
        var tokenTransferRes = Contract.transfer.sendTransaction(addressToTransfer, totalTokens, {
            from: addressFrom,
            gas: '160000',
        });
        return tokenTransferRes;
    } catch (err) {
        console.log(err);
        return err;
    }
}
var filter = web3.eth.filter('latest');
filter.watch(function (error, result) {
    if (!error){
        var block = web3.eth.getBlock(result);
        for (var i = 0; i < block.transactions.length; i++) {
            var transaction = web3.eth.getTransaction(block.transactions[i]);
            if(transaction.to == global.AdminEthAddress){
                var amount = web3.fromWei(transaction.value, 'ether');
                var urlEthToUSD = "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD";
                client.get(url, function (data, resp) {
                    var price = data.USD;
                    var now = Math.floor(new Date());
                    var bonus = 0;
                    if (now < global.preSaleBonusDays) {
                        bonus = global.preSaleBonusPercent;
                    }
                    else if (now < global.saleBonusDays) {
                        bonus = global.saleBonusPercent;
                    }
                    var totalUSD = parseFloat(amount) * price;
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
                    transferTokenETH(global.AdminEthAddress, global.AdminEthPassword, req.body.WalletAddress, tokensToTransfer);
                });
            }
        }
    }
    else{
        console.log(error);
    }
});

function transferTokenETH(addressFrom, passwordUnlock, addressToTransfer, totalTokens) {
    try {
        var isUnlocked = web3.personal.unlockAccount(addressFrom, passwordUnlock, 15000);
        var tokenTransferRes = Contract.transfer.sendTransaction(addressToTransfer, totalTokens, {
            from: addressFrom,
            gas: '160000',
			gasPrice:'21000000000'
        });
        return tokenTransferRes;
    } catch (err) {
        console.log(err);
        return err;
    }
}

var decimals = 2;//For Precision of Total Remaining Tokens

TokenUtil.prototype.etherOf = function (addressForBalance){
    var balanceOfAddres = Contract.etherOf.call(addressForBalance, {
        from: addressForBalance,
        gasPrice: '40000'
    });
    var bal = web3.fromWei(balanceOfAddres,'ether');
    return bal;
}
TokenUtil.prototype.balanceOf = function (addressForBalance){
    var balanceOfAddres = Contract.balanceOf.call(addressForBalance, {
        from: addressForBalance,
        gasPrice: '40000'
    });
    return balanceOfAddres;
}

TokenUtil.prototype.totalSupply = function (){
    var balanceOfAddres = Contract.totalSupply.call();
    return balanceOfAddres;
}


TokenUtil.prototype.getBalance = function(address){
    var balance = web3.fromWei(web3.eth.getBalance(address), "ether");
    return balance;
}

TokenUtil.prototype.getTokenRemain = function(address){
    var balance = Contract.balanceOf.call(address, {
        from: address,
        gasPrice: '40000'
    });
    return balance;
}

module.exports = TokenUtil;