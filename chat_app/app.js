
/**
 * Module dependencies.
 */

var express = require('express'),
   routes = require('./routes'),
   RedisStore = require('connect-redis')(express);

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  //session
  //new RedisStore()しない？してもいい？
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
app.get('/logout', routes.logout);
app.get('/count/:id', routes.count);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
