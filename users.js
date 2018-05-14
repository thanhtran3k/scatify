var express = require('express');
var router = express.Router();
var FireBase = require('firebase');
var config = {
    apiKey: "AIzaSyAF7sQoET9dQeSzfWeSk4hrnM8g3_jFKhg",
    authDomain: "scatify-487d0.firebaseapp.com",
    databaseURL: "https://scatify-487d0.firebaseio.com",
    projectId: "scatify-487d0",
    storageBucket: "scatify-487d0.appspot.com",
    messagingSenderId: "194338466340"
  };

var fbRef = FireBase.database().ref();

router.get('/register', function(req, res){
	res.render('users/register');
});

router.get('/login', function(req, res){
	res.render('users/login');
});

router.post('/register', function(req, res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	var location = req.body.location;
	var fav_genres = req.body.fav_genres;
	var fav_artists = req.body.fav_artists;

	req.checkBody('email', 'Email is invalid').isEmail();
	req.checkBody('password2', 'Passwords dont match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('users/register', {
			errors: errors
		});
	} else{

		FireBase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
		  
			var def = FireBase.auth().currentUser;
			console.log('Error creating user: ', JSON.stringify(def)); 
			console.log('Error creating user: ', JSON.stringify(user));				

			var user = {
					uid: user.uid,					
					email: email,
					firstname: firstname,
					lastname: lastname,
					location: location,
					fav_artists: fav_artists,
					fav_genres: fav_genres
				};

			var userRef = fbRef.child('users');
			userRef.push().set(user);

			req.flash('success_msg', 'Welcome, new guy!')
			res.redirect('/')
		}, function(error) {
    		// Handle Errors here.
    		var errorCode = error.code;
    		var errorMessage = error.message;
    		// [START_EXCLUDE]
    		if (errorCode == 'auth/weak-password') {
        		console.log('The password is too weak.');
        		req.flash('error_msg', 'The password is too weak.');
        		req.redirect('/users/register');
    		} else {
        		console.error(error);
    		}
    // [END_EXCLUDE]
		});		
	}
});

router.post('/login', function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	req.checkBody('email', 'Email is invalid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('users/login', {
			errors: errors
		});
	} else{

		FireBase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
		  
			var def = FireBase.auth().currentUser;
			console.log('Info: ', JSON.stringify(def)); 
			console.log('Info: ', JSON.stringify(user));

			req.flash('success_msg', 'You are now logged in!')
			res.redirect('/')
		}, function(error) {
    		// Handle Errors here.
    		var errorCode = error.code;
    		var errorMessage = error.message;
    		// [START_EXCLUDE]
    		if (errorCode == 'auth/user-not-found') {
        		console.log('There is no user record corresponding to this identifier. The user may have been deleted.');
        		req.flash('error_msg', 'There is no user record corresponding to this identifier. The user may have been deleted.');
        		res.redirect('/users/login');
    		} if(errorCode =='auth/wrong-password'){
    			req.flash('error_msg','Wrong password');
    			res.redirect('/users/login');
    		}    		
    		else {
        		console.error(error);
    		}
    // [END_EXCLUDE]
		});		
	}
});

router.get('/logout', function(req, res){
	FireBase.auth().signOut().then(function() {

		// var def = FireBase.auth().currentUser;

  		console.log('Signed Out');

  		req.flash('success_msg', 'You are now logged out');
		res.redirect('/');

	}, function(error) {
  		console.error('Sign Out Error', error);
	});	
});

module.exports = router;