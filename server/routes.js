require('./service');

module.exports = function(app,client,bcrypt) {
    app.get('/', function (req, res) {
        res.render('main.ejs'); // load the main.ejs file
    });

    //===============SIGN-IN===================================

    app.get('/login', function (req, res) {
        res.render('login.ejs',{message: req.flash('loginMessage')});
    });

    app.post('/login',function (req,res) {
        var user = req.body.username;
        var password = req.body.password;
        client.exists(user,function (err,reply) {
            if(err)
                throw err;
            else if(reply === 1){
                client.hget(user,'Password',function (err,replyPassword) {
                    if(err)
                        throw err;
                    else if(bcrypt.compareSync(password,replyPassword)){
                        req.session.key = user;
                        res.redirect('/profile');
                    }
                    else {
                        req.flash('loginMessage','Wrong Password');
                        res.redirect('/login');
                    }
                });
            }
            else {
                req.flash('loginMessage','No user found');
                res.redirect('/login');
            }
        });
    },function (req,res) {
        if(req.body.remember){
            req.session.cookie.maxAge = 1000
        }
    });

    //===============REGISTRATION===============================

    app.get('/signup',function (req,res) {
        res.render('signup.ejs',{message1:req.flash('sign'),message: req.flash('signupMessage')});
    });

    app.post('/signup',function (req,res) {
        var regexUsername = RegExp('^[A-Za-z0-9_.]{3,12}$');
        var regexPassword = RegExp('^[A-Za-z0-9_.@#$*()!^]{6,20}$');
        var user = req.body.username;
        var password = req.body.password;
        if(false === regexUsername.test(user) && false === regexPassword.test(password)){ //checks if both username and password are invalid
            req.flash('signupMessage', 'Both username and password are invalid ... Please see the rules below');
            res.redirect('/signup');
        }
        else if(false === regexUsername.test(user)){ //check if username is invalid
            req.flash('signupMessage', 'Invalid username ... Please see the rules below');
            res.redirect('/signup');
        }
        else if(false === regexPassword.test(password)){ //check if password is invalid
            req.flash('signupMessage', 'Invalid password ... Please see the rules below');
            res.redirect('/signup');
        }
        else {
            client.exists(user, function (err, reply) { //if everything is valid
                if (err)
                    throw err;
                else if (reply === 1) {
                    req.flash('signupMessage', 'Username already exists ... Pick another one');
                    res.redirect('/signup');
                }
                else {
                    req.session.key = user;
                    client.hmset(req.session.key, 'Password', bcrypt.hashSync(password, null, null), 'Deposits', parseInt(0));
                    res.redirect('/profile');
                }
            });
        }
    });

    //==================PROFILE=============
    app.get('/profile',function (req,res) {
        if(req.session){
            //Only if session exists, this page will be appeared, otherwise redirected to main page
            res.render('profile.ejs',{
                username:req.session.key
            });
        }
        else {
            res.redirect('/');
        }
    });

    //route for making deposit
    app.get('/profile/deposit',function (req,res) {
        if(req.session !=null && req.session){
            var moneyToBeDeposited = parseInt(req.query.depositMoney);
            makeDeposit(req,res,moneyToBeDeposited);
        }
    });

    //route for making withdrawl
    app.get('/profile/withdraw',function (req,res) {
        if(req.session !=null && req.session){
            var moneyToBeWithdrawn = parseInt(req.query.withdrawMoney);
            makeWithdrwal(req,res,moneyToBeWithdrawn);
        }
    });

    //route for checking balance
    app.get('/profile/checkBalance',function (req,res) {
        if(req.session !=null && req.session){
            checkBalance(req,res);
        }
    });

    //check for transaction history
    app.get('/profile/checkTransactions',function (req,res) {
        if(req.session !=null && req.session){
            checkTransaction(req,res);
        }
    });

    //render transaction table page
    app.get('/transaction',function (req,res) {
        if(req.session){
            //Only if session exists, this page will be appeared, otherwise redirected to main page
            res.render('transaction.ejs',{
                username:req.session.key
            });
        }
        else {
            res.redirect('/');
        }
    });

    //==================LOGOUT==============
    app.get('/logout',function (req,res) {
        req.session.destroy(function (err) {
            if(err)
                throw err;
            req.session = null;
            res.redirect('/');
        });
    });
};