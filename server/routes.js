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
        var user = req.body.username;
        var password = req.body.password;
        client.exists(user,function (err,reply) {
            if(err)
                throw err;
            else if(reply ===1){
                req.flash('signupMessage','Username already exists ... Pick another one');
                res.redirect('/signup');
            }
            else {
                req.session.key = user;
                client.hmset(req.session.key,'Password',bcrypt.hashSync(password,null,null),'Deposits',parseInt(0));
                res.redirect('/profile');
            }
        });
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

    app.get('/profile/deposit',function (req,res) {
        if(req.session !=null && req.session){
            var moneyToBeDeposited = parseInt(req.query.depositMoney);
            makeDeposit(req,res,moneyToBeDeposited);
        }
    });

    app.get('/profile/withdraw',function (req,res) {
        if(req.session !=null && req.session){
            var moneyToBeWithdrawn = parseInt(req.query.withdrawMoney);
            makeWithdrwal(req,res,moneyToBeWithdrawn);
        }
    });

    app.get('/profile/checkBalance',function (req,res) {
        if(req.session !=null && req.session){
            checkBalance(req,res);
        }
    });

    app.get('/profile/checkTransactions',function (req,res) {
        if(req.session !=null && req.session){
            checkTransaction(req,res);
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