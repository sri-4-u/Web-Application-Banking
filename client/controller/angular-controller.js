app.controller('BankAccountController', function($scope, BankService,$timeout){
    console.log('entered controleer');

    $scope.checkBalance = function () {
        BankService.checkBalance().then(function(response){
            $scope.balance = response;
        });
        $timeout(function(){
            $scope.checkBalance();
        },300)
    };

    $scope.deposit = function () {
        $scope.messageDisplayDeposit = false;
        if($scope.moneyToDeposit){
            let money = parseInt($scope.moneyToDeposit);
            BankService.makeDeposit(money).then(function (response) {
                $scope.messageDeposit = response;
                $scope.messageDisplayDeposit = true;
            });
        }
        $timeout(function(){
            $scope.messageDisplayDeposit = false;
        },1000);
        $scope.moneyToDeposit ='';
    }

    $scope.withdraw = function () {
        $scope.messageDisplayWithdraw = false;
        if($scope.moneyToWithdraw){
            BankService.makeWithdraw($scope.moneyToWithdraw).then(function (response) {
                $scope.messageWithdraw = response;
                $scope.messageDisplayWithdraw = true;
            });
        }
        $timeout(function(){
            $scope.messageDisplayWithdraw = false;
        },1000);
        $scope.moneyToWithdraw ='';
    }

    $scope.checkTransaction = function () {

    }


    $scope.checkBalance();
});