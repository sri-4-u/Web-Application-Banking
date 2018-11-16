const currency = '$';
const attachedKey = 'key';
const redis =require('redis')
const client = redis.createClient();

makeDeposit = function (req,res,moneyToBeDeposited) {
    let user = req.session.key;
    client.hget(user, 'Deposits' , function (err, existingBalance) {
         if (err)
             throw err;
         let newBalance = parseInt(existingBalance) + moneyToBeDeposited;
         console.log(typeof newBalance);
         client.hmset(user, 'Deposits' , newBalance);
         client.lpush([user + attachedKey, moneyToBeDeposited], function (err) {
             if (err)
                 throw err;
         });
         res.send('Amount deposited in your account').status(200);
     });
}

makeWithdrwal = function (req,res,moneyToBeWithdrawn) {
    let user = req.session.key;
    //console.log(typeof moneyToBeWithdrawn);
    client.hget(user, 'Deposits' , function (err, existingBalance) {
        console.log('existing balance : '+ typeof existingBalance);
        if (err) {
            throw err;
        }
        else if (moneyToBeWithdrawn < parseInt(existingBalance) || moneyToBeWithdrawn === parseInt(existingBalance)) {
            let newBalance = existingBalance - moneyToBeWithdrawn;
            console.log('new balance : '+ typeof newBalance);
            client.hmset(user, 'Deposits' , newBalance);
            let amountToBeWithdrawn = -moneyToBeWithdrawn;
            console.log('amountTobeWithdrawn : '+ typeof amountToBeWithdrawn);
            client.lpush(user + attachedKey, amountToBeWithdrawn, function (err) {
                if (err)
                    throw err;
            });
            res.send('Amount Withdrawn from your account').status(200);
        }
        else res.send("You dont have enough funds in your account to make this transaction.ejs");
    });

}

checkTransaction = function (req,res) {
    var user = req.session.key;
    client.lrange(user + attachedKey, 0, -1, function (err, responseArray) { //outputs the array
        if (err)
            throw err;
        else if(responseArray.length > 0) {
            res.json(responseArray).status(200);
        }
        else res.json('No Transactions as of now').status(400);
    });
}

checkBalance = function (req,res) {
    let user = req.session.key;
    client.hget(user, 'Deposits' , function (err, response) {
        if (err)
            throw err;
        res.json(response);
    });
}

module.exports = {makeDeposit,checkBalance,checkTransaction,makeWithdrwal};