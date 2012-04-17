
/**
 * Module dependencies.
 */

var express = require('express'),
   routes = require('./routes'),
   RedisStore = require('connect-redis')(express);

//socket.io
var app = module.exports = express.createServer(),
    io  = require('socket.io').listen(app);
var parseCookie = require('connect').utils.parseCookie;
var sessionStore = new RedisStore();
//http://d.hatena.ne.jp/Jxck/20110730/1312042603
//http://d.hatena.ne.jp/Jxck/20110809/1312847290
//http://iamtherockstar.com/blog/2012/02/14/nodejs-and-socketio-authentication-all-way-down/
//http://jsondata.tumblr.com/post/18513328466/jordanrift
io.configure(function() {
  io.set('authorization', function(data, callback) {
    if (data.headers.cookie) {
      var cookie = parseCookie(data.headers.cookie);
      sessionStore.get(cookie['connect.sid'], function(err, session) {
        if (err || !session) {
          callback('Error', false);
        } else {
          data.session = session;
          callback(null, true);
        }
      });
    } else {
      callback('No cookie', false);
    }
  });
});

io.on('connection', function (socket){
  console.log("Got connected to server!");
  io.emit('chat', {my : 'hoge'});
  io.on("msg_push", function(data){
    console.log(data);
  });
});

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  //session
  app.use(express.cookieParser());
  app.use(express.session({secret: "secret",
                           store: new RedisStore(),
                           cookie: {maxAge: 60 * 60 * 1000}}));

  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/signup', routes.signup);
app.post('/signup', routes.create_signup);
app.get('/login', routes.login);
app.post('/login', routes.create_login);
app.get('/logout', routes.logout);
app.get('/roby', routes.roby);
app.post('/roby', routes.create_roby);
app.get('/room/:id?', routes.room);
app.post('/room/:id?', routes.create_room);
//app.get('/count/:id', routes.count);


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
