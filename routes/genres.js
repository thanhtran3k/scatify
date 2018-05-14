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

// FireBase.auth().signInWithEmailAndPassword("thanh.tran3k@gmail.com", "mypassword").catch(function(error) {
//   // Handle Errors here.
//   var errorCode = error.code;
//   var errorMessage = error.message;
//   // ...
// });

var fbRef = FireBase.database().ref();

router.get('/', function(req, res, next){
	var genreRef = fbRef.child('genres');

	genreRef.once('value', function(snapshot){
		var genres = [];

		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			genres.push({
				id: key,
				name: childData.name
			});
		});
		res.render('genres/index', {genres: genres});
	});
});

router.get('/add', function(req, res, next){
	res.render('genres/add');
});

router.post('/add', function(req, res, next){
	var genre = {
		name: req.body.name
	}
	// console.log(genre);
	// return;
	var genreReference = fbRef.child('genres');
	genreReference.push().set(genre);

	req.flash('success_msg', 'Your genre just saved successfully!');
	res.redirect('/genres');
});

router.get('/edit/:id', function(req, res){
	var id = req.params.id;
	var genreRef = FireBase.database().ref('/genres/' +id);

	genreRef.once('value', function(snapshot){
		var genre = snapshot.val();
		res.render('genres/edit', {genre: genre, id: id});
	});
});

router.post('/edit/:id', function(req, res){
	var id = req.params.id;
	var name = req.body.name;
	var genreRef = FireBase.database().ref('/genres/' +id);

	genreRef.update({
		name: name
	});
	req.flash('success_msg', 'Your genre is updated successfully!');
	res.redirect('/genres');
});

router.delete('/delete/:id', function(req, res){
	var id = req.params.id;
	
	var genreRef = FireBase.database().ref('/genres/' +id);

	genreRef.remove();

	req.flash('success_msg', 'Genre deleted!');
	res.sendStatus(200);	
});

module.exports = router;
