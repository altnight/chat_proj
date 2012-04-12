
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'My Chat' });
};

exports.signup= function(req, res){
  res.render('signup', { title: 'signup' });
};

exports.create_signup= function(req, res){
  //res.render('signup', { title: 'signup' });
};

exports.login= function(req, res){
  res.render('login', { title: 'login' });
};

exports.logout= function(req, res){
  res.render('logout', { title: 'logout' });
};

exports.count= function(req, res){
  //res.render('count', { title: 'count' });
  res.send('user' + req.params.id);
};
