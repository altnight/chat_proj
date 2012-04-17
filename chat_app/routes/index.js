
/*
 * GET home page.
 */
var redis = require('redis').createClient();

exports.index = function(req, res){
  if (req.session.name){
    res.render('index', { title: "Welcome My Chat by " + req.session.name });
  }
  else {
    res.render('index', { title: "Welcome My Chat by 増田"});
  }
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

  redis.get("name:" + req.body.name + ":uid", function(err, uid){
    if (uid){
      console.log("既に同じ名前があります");
      res.redirect('/signup');
    }
    else {
      //新規登録
      redis.incr("uid", function(err, uid){
        redis.set("name:" + req.body.name +":uid", uid);
        redis.set("uid:" + uid + ":name", req.body.name);
        redis.set("uid:" + uid + ":password", req.body.password);
      });
    req.session.name = req.body.name;
    res.redirect('/');
    }
  });
};

exports.login= function(req, res){
  res.render('login', { title: 'login' });
};

exports.create_login= function(req, res){
  redis.get("name:" + req.body.name + ":uid", function(err, uid){
    if (! uid){
      console.log('そんな名前ないです');
      res.redirect('/login');
    }
    else redis.get("uid:" + uid + ":password", function(err2, real_password){
      if (req.body.password != real_password){
        console.log('パスワードが違うっぽい');
        res.redirect('/login');
      }
      else{
        console.log('ログインします');
        req.session.name = req.body.name;
        res.redirect('/');
      }
    });
  });

};

exports.logout= function(req, res){
  //res.render('logout', { title: 'logout' });
  delete req.session.name;
  delete req.session.room;
  res.redirect('/');
};

//exports.count= function(req, res){
  ////res.render('count', { title: 'count' });
  //res.send('user' + req.params.id);
//};
exports.roby= function(req, res){
  redis.lrange("room", 0, -1, function(err, room){
  res.render('roby', { title: 'roby',
                       room: room });
  });
};

exports.create_roby= function(req, res){
  redis.rpush("room", req.body.room);
  redis.rpop("room", function(err, latest_room){
    redis.rpush("room", latest_room);
    req.session.room = latest_room;
    res.redirect('/room/' + latest_room);
  });
};

exports.room= function(req, res){
  redis.lrange(req.session.room, 0, -1,function(err, chat){
    res.render('room', { title: "chat_room",
                       chat: chat });
  });
};

exports.create_room= function(req, res){
  (req.session.name === undefined) ? name = '増田' : name = req.session.name;
  redis.rpush(req.session.room, name + ":" + req.body.chat);
  res.redirect('/room/' + req.session.room);
};
