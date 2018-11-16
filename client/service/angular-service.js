app.service('BankService',['$http',function ($http) {
    var BASE_URL = '/profile';

    //makes http call to the server for checking balance
    this.checkBalance = function() {
        var url = BASE_URL + '/checkBalance';
        return $http.get(url).then(function (response) {
            if (response) {
                return response;
            }
            else console.log('no data');
        });
    }
    // makes http call to the server for making deposits
    this.makeDeposit = function(money) {
        var url = BASE_URL + '/deposit';
        var config = {params: {depositMoney:money}};
        return $http.get(url,config).then(function (response) {
            if (response) {
                return response;
            }
            else console.log('no data');
        });
    }
    //makes http call to the server for withdrawl of money
    this.makeWithdraw = function (money) {
        var url = BASE_URL + '/withdraw';
        var config = {params: {withdrawMoney:money}};
        return $http.get(url,config).then(function (response) {
            if (response) {
                return response;
            }
            else console.log('no data');
        });
    }

    this.checkTransactions = function () {
        var url = BASE_URL + '/checkTransactions';
        return $http.get(url).then(function (response) {
            if(response){
                return response;
            }
        });
    }
}]);