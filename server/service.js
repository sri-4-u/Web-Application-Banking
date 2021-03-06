/*
This is Javascript file consists of the logic which is used by the application
 */
const currency = '$';
const attachedKey = 'key';
const redis =require('redis')
const client = redis.createClient();

/*
The method makeDeposit is to make deposits into the bank account.
 */
makeDeposit = function (req,res,moneyToBeDeposited) {
    let user = req.session.key;
    client.hget(user, 'Deposits' , function (err, existingBalance) {
         if (err)
             throw err;
         let newBalance = parseInt(existingBalance) + moneyToBeDeposited;
         client.hmset(user, 'Deposits' , newBalance);
         client.lpush([user + attachedKey, moneyToBeDeposited], function (err) {
             if (err)
                 throw err;
         });
         res.send('Amount deposited in your account').status(200);
     });
}


/*
This method makeWithdrawl is to withdraw amount from the existing bank account.
 */
makeWithdrwal = function (req,res,moneyToBeWithdrawn) {
    let user = req.session.key;
    client.hget(user, 'Deposits' , function (err, existingBalance) {
        if (err) {
            throw err;
        }
        else if (moneyToBeWithdrawn < parseInt(existingBalance) || moneyToBeWithdrawn === parseInt(existingBalance)) {
            let newBalance = existingBalance - moneyToBeWithdrawn;
            client.hmset(user, 'Deposits' , newBalance);
            let amountToBeWithdrawn = -moneyToBeWithdrawn;
            client.lpush(user + attachedKey, amountToBeWithdrawn, function (err) {
                if (err)
                    throw err;
            });
            res.send('Amount Withdrawn from your account').status(200);
        }
        else res.sendStatus(201);
    });

}

/*
This method checkTransaction fetches history of transactions made in your account.
*/
checkTransaction = function (req,res) {
    var user = req.session.key;
    client.lrange(user + attachedKey, 0, -1, function (err, responseArray) { //outputs the array
        if (err)
            throw err;
        else if(responseArray.length > 0) {
            var arr = [];
            for(var i = 0;i < responseArray.length; i++){
                if(responseArray[i] < 0){
                    let money = -responseArray[i];
                    arr.push({
                        "type" : "withdrawed",
                        "amount" : money+currency
                    });
                }
                else arr.push({
                    "type" : "deposited",
                    "amount" : responseArray[i]+currency
                });
            }
            res.json(arr).status(200);
        }
        else res.sendStatus(201);
    });
}

/*
This method checkBalance is used to check balance in the existing bank account.
 */
checkBalance = function (req,res) {
    let user = req.session.key;
    client.hget(user, 'Deposits' , function (err, response) {
        if (err)
            throw err;
        res.json(response+currency);
    });
}

module.exports = {makeDeposit,checkBalance,checkTransaction,makeWithdrwal};