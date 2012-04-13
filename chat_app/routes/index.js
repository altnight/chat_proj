
/*
 * GET home page.
 */
var redis = require('redis').createClient();

exports.index = function(req, res){
  res.render('index', { title: "Welcome My Chat by " + req.session.name });
};

exports.signup= function(req, res){
  res.render('signup', { title: 'signup' });
};

exports.create_signup= function(req, res){
  //if (! /[0-9a-zA-Z\-_]+/.test(req.body.name)){
    //res.send('name は 半角英数で');
    //res.redirect('/signup');
  //}
  //if (req.body.name.length < 8){
    //res.send('name は 8文字以上にしましょう');
    //res.redirect('/signup');
  //}
  //if (! /[0-9a-zA-Z\-_]+/.test(req.body.password)){
    //res.send('password は 半角英数で');
    //res.redirect('/signup');
  //}
  //if (req.body.password.length < 8){
    //res.send('password は 8文字以上にしましょう');
    //res.redirect('/signup');
  //}
  //if (req.body.password != req.body.password2) {
    //res.send('パスワード確認が間違ってるよ');
    //res.redirect('/signup');
  //}
  var uid = 0;
  uid++;
  auth_JSON= { "uid" : uid,
               "name" : req.body.name,
               "password": req.body.password };

  redis.set("auth:" + uid, JSON.stringify(auth_JSON));

  req.session.name = req.body.name;
  req.session.password = req.body.password;
  res.redirect('/');
};

exports.login= function(req, res){
  res.render('login', { title: 'login' });
};

exports.create_login= function(req, res){
  //res.render('login', { title: 'login' });

};

exports.logout= function(req, res){
  //res.render('logout', { title: 'logout' });
  delete req.session.name;
  delete req.session.password;
  req.session.name = "My Name";
  res.redirect('/');
};

exports.count= function(req, res){
  //res.render('count', { title: 'count' });
  res.send('user' + req.params.id);
};
