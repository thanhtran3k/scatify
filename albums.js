var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'public/images/upload'})

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


// router.get('*', function(req, res, next){
// 	if(FireBase.auth().currentUser == null){
// 		res.redirect('/users/login');
// 	};
// 	next();
// });

router.get('/', function(req, res){
	var albumRef = fbRef.child('albums');

	//ref = reference
	//fetch data
	//loop through snapshot then build an object for the genre
	albumRef.once('value', function(snapshot){
		var albums = [];

		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			albums.push({
				id: key,
				artist: childData.artist,
				title: childData.title,
				genre: childData.genre,
				info: childData.info,
				label: childData.label,
				tracks: childData.tracks,
				linktoyoutube: childData.linktoyoutube,
				cover: childData.cover
			});
		});
		res.render('albums/index', {albums: albums});
	});
});

router.get('/add', function(req, res){
	var genreRef = fbRef.child('genres');

	//ref = reference
	//fetch data
	//loop through snapshot then build an object for the genre
	genreRef.once('value', function(snapshot){
		var data = [];

		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			data.push({
				id: key,
				name: childData.name
			});
		});
		res.render('albums/add', {genres: data});
	});
});

router.post('/add', upload.single('cover'), function(req, res){
	//check for the file upload
	if(req.file){
		console.log('Uploading file...');
		var cover = req.file.filename;
	}else {
		console.log('No file uploaded!');
		var cover = 'noimage.jpg';
	}

	//build album object
	var album = {
		artist: req.body.artist,
		title: req.body.title,
		genre: req.body.genre,
		info: req.body.info,
		year: req.body.year,
		label: req.body.label,
		tracks: req.body.tracks,
		linktoyoutube: req.body.linktoyoutube,
		cover: cover
	}

	//reference
	//column album in firebase
	var albumRef = fbRef.child('albums');
	albumRef.push().set(album);

	req.flash('success_msg', 'Your Album just saved successfully!');
	res.redirect('/albums');
});

router.get('/details/:id', function(req, res){
	var id = req.params.id;

	var albumRef = FireBase.database().ref('/albums/' +id);

	albumRef.once('value', function(snapshot){
		var album = snapshot.val();

		res.render('albums/details', {album: album, id: id});
	});
});

router.get('/edit/:id', function(req, res){
	var id = req.params.id;	

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

		albumRef.once('value', function(snapshot){
			var album = snapshot.val();

			res.render('albums/edit', {
				album: album, 
				id: id, genres: 
				genres
			});
		});	
	});

	var albumRef = FireBase.database().ref('/albums/' +id);

	
});

router.post('/edit/:id', upload.single('cover'), function(req, res){
	var id = req.params.id;	

	var albumRef = FireBase.database().ref('/albums/' +id);
	
	if(req.file){
		
		var cover = req.file.filename;
	  	
		albumRef.update({
			artist: req.body.artist,
			title: req.body.title,
			genre: req.body.genre,
			info: req.body.info,
			year: req.body.year,
			label: req.body.label,
			tracks: req.body.tracks,
			cover: cover
		});
	} else {	  	
		albumRef.update({
			artist: req.body.artist,
			title: req.body.title,
			genre: req.body.genre,
			info: req.body.info,
			year: req.body.year,
			label: req.body.label,
			tracks: req.body.tracks
		});
	}
	

	req.flash('success_msg', 'Your album is updated successfully!');
	res.redirect('/albums/details/'+id);
});

router.delete('/delete/:id', function(req, res){
	var id = req.params.id;
	
	var albumRef = FireBase.database().ref('/albums/' +id);

	albumRef.remove();

	req.flash('success_msg', 'Album deleted!');
	res.sendStatus(200);	
});


module.exports = router;