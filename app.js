//libraries
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var swig = require('swig');

//database tables
var db = require('./models/');
var Page = db.Page;
var User = db.User;

//server instantiation
var app = express();

//swig config
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.engine('html', swig.renderFile);
swig.setDefaults({cache: false});

//database synchronization (before server starts listening)
User.sync().then(function(){
	return Page.sync();
}).then(function(){
	app.listen(3000, function(){
		console.log('Listening on 3000!');
	});
}).catch(console.error);

//routers
var wikiRouter = require('./routes/wiki');
var usersRouter = require('./routes/users');
//middleware
app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//serve static files
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res, next){
	Page.findAll().then(function(pages){
		res.render('index', {
			pages: pages
		});
	}).catch(next);
});

app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);




