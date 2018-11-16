app.service('BankService',['$http',function ($http) {
    this.checkBalance = function() {
        return $http({
            method: 'GET',
            url: '/profile' + "/checkBalance",
        }).then(function (response) {
            if (response.data) {
                console.log(response.data);
                return response.data;
            }
            else console.log('no data');
        });
    }

    this.makeDeposit = function(money) {
        var url = '/profile' + '/deposit';
        var config = {params: {depositMoney:money}};
        return $http.get(url,config).then(function (response) {
            if (response.data) {
                console.log(response.data);
                return response.data;
            }
            else console.log('no data');
        });
    }

    this.makeWithdraw = function (money) {
        var url = '/profile' + '/withdraw';
        var config = {params: {withdrawMoney:money}};
        return $http.get(url,config).then(function (response) {
            if (response.data) {
                console.log(response.data);
                return response.data;
            }
            else console.log('no data');
        });
    }
}]);