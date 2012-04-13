
/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log(req.session);
  res.render('index', { title: 'My Chat' });
};

exports.signup= function(req, res){
  res.render('signup', { title: 'signup' });
};

exports.create_signup= function(req, res){
  //res.render('signup', { title: 'signup' });
  name = req.body.name;
  password= req.body.password;
  password2= req.body.password2;

  req.session = {};
  req.session.name = name;
  req.session.password = password;
  req.session.password2 = password2;
  console.log(req.session);
  res.redirect('/');
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
