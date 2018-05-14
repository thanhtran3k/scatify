var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var favicon = require('serve-favicon');

//firebase, fbRef is a reference to firebase
var FireBase = require('firebase');
var config = {
    apiKey: "AIzaSyAF7sQoET9dQeSzfWeSk4hrnM8g3_jFKhg",
    authDomain: "scatify-487d0.firebaseapp.com",
    databaseURL: "https://scatify-487d0.firebaseio.com",
    projectId: "scatify-487d0",
    storageBucket: "scatify-487d0.appspot.com",
    messagingSenderId: "194338466340"
  };
  FireBase.initializeApp(config);

//Route files
var routes = require('./routes/index');
var albums = require('./routes/albums');
var genres = require('./routes/genres');
var users = require('./routes/users');

//init app
var app = express();

//logger
app.use(logger('dev'));

//favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

//validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//connect flash
app.use(flash());

//global vars
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.authData = FireBase.auth().currentUser;
	next();
});


//setting a route to anything
app.get('*', function(req, res, next){
	if(FireBase.auth().currentUser != null){
		var userRef = FireBase.database().ref('/users/');
		userRef.orderByChild("uid").startAt(FireBase.auth().currentUser.uid).endAt(FireBase.auth().currentUser.uid).on("child_added", function(snapshot) {

			FireBase.auth().onAuthStateChanged(function(user) {
		    console.log('authStateChanged', user);
			    if (user) {
			      console.log("Welcome UID:" + user.uid);
			    }
			});
			res.locals.userData = snapshot.val();			
    	});
	}
	next();
});

//routes
app.use('/', routes);
app.use('/genres', genres);
app.use('/albums', albums);
app.use('/users', users);

//Server
app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function(){
	console.log('Server is running on PORT: ' +app.get('port'))
});