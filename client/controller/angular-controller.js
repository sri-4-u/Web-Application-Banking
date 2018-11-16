app.controller('BankAccountController', function($scope, BankService,$timeout){

    $scope.checkBalance = function () {
        BankService.checkBalance().then(function(response){
            $scope.balance = response.data;
        });
        $timeout(function(){
            $scope.checkBalance();
        },300)
    };

    $scope.deposit = function () {
        var reg = /^\d+(\.\d{1,2})?$/;
        $scope.messageDisplayDeposit = false;
        $scope.errormessageDisplayDeposit =false;
        if(reg.test($scope.moneyToDeposit)){
            let money = parseInt($scope.moneyToDeposit);
            BankService.makeDeposit(money).then(function (response) {
                $scope.messageDeposit = response.data;
                $scope.messageDisplayDeposit = true;
            });
        }
        else {
            $scope.messagefailDepositMessage = 'Enter a valid Amount';
            $scope.errormessageDisplayDeposit =true;
        }
        $timeout(function(){
            $scope.messageDisplayDeposit = false;
            $scope.errormessageDisplayDeposit =false;
        },3000);
        $scope.moneyToDeposit ='';
    }

    $scope.withdraw = function () {
        var reg = /^\d+(\.\d{1,2})?$/;
        $scope.messageDisplayWithdraw = false;
        $scope.errormessageDisplayWithdraw = false;
        if(reg.test($scope.moneyToWithdraw)){
            BankService.makeWithdraw($scope.moneyToWithdraw).then(function (response) {
                console.log(response.status);
                if(response.data.length > 0 && response.status === 200){
                    $scope.messageWithdraw = response.data;
                    $scope.messageDisplayWithdraw = true;
                }
                else {
                    $scope.messagefailWithdrawMessage = 'No Sufficient funds to make this transaction';
                    $scope.errormessageDisplayWithdraw = true;
                }

            });
        }
        else {
            $scope.messagefailWithdrawMessage = 'Enter a Valid amount';
            $scope.errormessageDisplayWithdraw = true;
        }
        $timeout(function(){
            $scope.messageDisplayWithdraw = false;
            $scope.errormessageDisplayWithdraw = false;
        },3000);
        $scope.moneyToWithdraw ='';
    }

    $scope.checkTransaction =function () {
        BankService.checkTransactions().then(function (response) {
            console.log(response.status);
            if(response.status === 200)
                $scope.lists = response.data;
            else if(response.status === 201)
                $scope.messageCheckTransactions = "No Transactions till now";
        });
    }

    $scope.checkBalance();
    $scope.checkTransaction();
});